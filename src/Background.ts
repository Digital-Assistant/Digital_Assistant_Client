'use strict';

/**
 * Background Script for Universal Digital Assistant Browser Extension
 *
 * This service worker handles:
 * - User authentication: Chrome Identity API (LoginWithBrowser) or Keycloak authorization
 *   code + PKCE (LoginWithKeycloak, no client secret)
 * - Session management
 * - Communication between content scripts and web pages
 *
 * Architecture:
 * - Browser-specific logic: In this file and ./browser-auth/
 * - Platform-agnostic logic: Imported from @udan/digital-assistant-sdk package
 */

// Import browser constants and utilities from core package
import {
    getBrowserVar,
    getUDASessionName,
    updateActiveTabId,
    updateBrowserPlugin,
    UDASessionData,
    UDAGetSessionKey,
    UDABindAuthenticatedAccount,
    UDASendSessionData,
    UDAStorageService,
    UDADigestMessage,
    keyCloakStore,
    AppConfig,
    apiClient,
    ENDPOINT,
    setAuthToken,
    clearAuthToken,
    setAuthTokenRenewer,
    hasClientSecret,
} from "@udan/digital-assistant-sdk";

// Import browser extension specific authentication
import { LoginWithBrowser, getBrowserIdentity } from "./browser-auth/LoginWithBrowser";
import {
    KeycloakAuthError,
    signInWithKeycloak,
    getKeycloakTokens,
    refreshKeycloakTokens,
    signOutOfKeycloak,
    type KeycloakSettings,
    type KeycloakTokens,
} from "./browser-auth/LoginWithKeycloak";
import { buildConfig } from "./config/buildConfig";
import {
    applyBuildConfig,
    chooseEnvironment,
    normalizeEnvironment,
    ENVIRONMENT_STORAGE_KEY,
    type Environment,
    type EnvironmentChoice,
} from "./config/runtimeEnvironment";

// Initialize browser variables
const browserVar = getBrowserVar();
const UDASessionName = getUDASessionName();

updateBrowserPlugin(true);

/**
 * Storing the active tab id to fetch for further data.
 */
browserVar.tabs.onActivated.addListener(function (activeInfo) {
	updateActiveTabId(activeInfo.tabId);
});

let sessionData: UDASessionData = new UDASessionData();

/**
 * Runtime environment (TEST or PROD). The worker has its own SDK instance: session key,
 * token and CheckUserSession calls run here, so it needs the environment too (not only
 * the page). `ownChoice` = options override, else install type (unpacked = TEST), else
 * PROD. A page that set `environment` itself sends it with its messages (`pageEnvironment`)
 * and wins for that message. getSelf() needs no permission and works in the worker only.
 */
const anyBrowser = browserVar as any;
let ownChoice: EnvironmentChoice = { environment: "PROD", source: "default" };
let installType: string | undefined;
let appliedEnvironment: Environment | undefined;
const appliedKeys = new Set<string>();

function applyEnvironment(environment: Environment) {
    if (appliedEnvironment === environment) return;
    appliedEnvironment = environment;
    applyBuildConfig(AppConfig, environment, { applied: appliedKeys });
}

async function refreshEnvironment(): Promise<EnvironmentChoice> {
    try {
        installType = (await anyBrowser.management.getSelf()).installType;
    } catch (err) {
        console.warn("[UDA Background] management.getSelf failed, using PROD:", err);
    }
    let override: unknown;
    try {
        override = (await anyBrowser.storage.local.get(ENVIRONMENT_STORAGE_KEY))?.[ENVIRONMENT_STORAGE_KEY];
    } catch (err) {
        console.warn("[UDA Background] reading the environment override failed:", err);
    }
    ownChoice = chooseEnvironment(installType, override);
    applyEnvironment(ownChoice.environment);
    updateBadge();
    return ownChoice;
}

/** Toolbar badge: "TEST" while the extension's own environment is TEST. */
function updateBadge() {
    const action = anyBrowser.action;
    if (!action?.setBadgeText) return;
    action.setBadgeText({ text: ownChoice.environment === "TEST" ? "TEST" : "" });
    action.setBadgeBackgroundColor?.({ color: "#d97706" });
}

function environmentInfo() {
    return { environment: ownChoice.environment, source: ownChoice.source, installType };
}

let environmentReady: Promise<EnvironmentChoice> = refreshEnvironment();

// the options page changed the override: re-apply, then tell the open tabs
anyBrowser.storage?.onChanged?.addListener((changes: any, area: string) => {
    if (area !== "local" || !changes[ENVIRONMENT_STORAGE_KEY]) return;
    environmentReady = refreshEnvironment();
    environmentReady.then(async () => {
        try {
            const tabs = await anyBrowser.tabs.query({});
            for (const tab of tabs) {
                if (tab.id !== undefined) {
                    Promise.resolve(anyBrowser.tabs.sendMessage(tab.id, { action: "UDAEnvironmentChanged", data: environmentInfo() })).catch(() => {});
                }
            }
        } catch (err) {
            console.warn("[UDA Background] could not notify tabs of the environment change:", err);
        }
    });
});

// listen for the requests made from webpage for accessing userdata
browserVar.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === "UDAGetEnvironment") {
		environmentReady.then(() => sendResponse(environmentInfo()));
		return true;
	}

	const tabId: number | undefined = sender?.tab?.id;
	const handleMessage = async (): Promise<Record<string, unknown> | void> => {
		await environmentReady;
		// a page that set `environment` itself wins for its own messages
		applyEnvironment(normalizeEnvironment(request.pageEnvironment) ?? ownChoice.environment);
		if (request.action === "getusersessiondata" || request.action === "UDAGetNewToken") {
			if (await resumeKeycloakSession(tabId, request.action === "UDAGetNewToken")) return;
			if (keycloakSettings() && !chromeIdentityCanSignIn()) {
				// the Chrome identity flow cannot finish without the secret: signed out (session key
				// only, as for a signed-out profile) until the Sign-in button runs the Keycloak sign-in
				if (!sessionData.sessionKey) sessionData = await UDAGetSessionKey(sessionData);
				await sendToTab(tabId, "UDAAlertMessageData", "login");
				return;
			}
			await legacySession(request.action);
		} else if (request.action === "UDASignIn" || request.action === "UDASignInKeycloak") {
			// the user pressed Sign in: the only place a sign-in window may open
			await signIn(tabId, request.action === "UDASignInKeycloak");
		} else if (request.action === "UDASignOut") {
			await signOut();
		} else if (request.action === "UDARenewAccessToken") {
			// the panel's token is about to expire: the access token only, never the refresh token
			return { accessToken: await panelAccessToken(tabId) };
		} else if (request.action === "authtenicate") {
			await LoginWithBrowser(sessionData, false);
		} else if (request.action === "createSession") {
			await keyCloakStore(sessionData, request.data);
		}
	};

	handleMessage()
		.then((extra) => sendResponse({ success: true, ...(extra || {}) }))
		.catch((err) => {
			const error = err instanceof Error ? err : new Error(String(err));
			console.error("[UDA Background] onMessage error:", error);
			sendResponse({ success: false, error: error.message });
		});

	// Return true to keep the message channel open for async sendResponse
	return true;
});

/** The session of the Chrome identity flow (compatibility until PK15), as before the Keycloak sign-in. */
async function legacySession(action: string) {
	const storedSessionData = await UDAStorageService.get(UDASessionName);
	if (!storedSessionData) {
		sessionData = await UDAGetSessionKey(sessionData);
		await LoginWithBrowser(sessionData, false);
	} else {
		// looks like browser storage might have changed so changing the reading the data has been changed. For to work with old version have added the new code to else if statement
		if (storedSessionData.hasOwnProperty("sessionKey") && storedSessionData["sessionKey"] && typeof storedSessionData["sessionKey"] != 'object') {
			sessionData = storedSessionData;
			if (action === "UDAGetNewToken") {
				await generateNewToken();
			} else if (storedSessionData.hasOwnProperty('authenticated') && storedSessionData.authenticated) {
				await UDASendSessionData(sessionData);
			} else {
				await LoginWithBrowser(sessionData, false);
			}
		} else if (storedSessionData.hasOwnProperty(UDASessionName) && storedSessionData[UDASessionName].hasOwnProperty("sessionKey") && storedSessionData[UDASessionName]["sessionKey"] && typeof storedSessionData[UDASessionName]["sessionKey"] != 'object') {
			sessionData = storedSessionData[UDASessionName];
			if (storedSessionData.hasOwnProperty('authenticated') && storedSessionData.authenticated) {
				await UDASendSessionData(sessionData);
			} else {
				await LoginWithBrowser(sessionData, false);
			}
		} else {
			sessionData = await UDAGetSessionKey(sessionData);
			await LoginWithBrowser(sessionData, false);
		}
	}
}

/**
 * Keycloak sign-in (authorization code + PKCE, public client, no secret). Settings come from the
 * build (keycloakPublicClientId, the environment's keycloakUrl, keycloakRealm); null = this build
 * has no public client, so only the Chrome identity flow exists.
 */
function keycloakSettings(): KeycloakSettings | null {
	const environment = appliedEnvironment ?? ownChoice.environment;
	const baseUrl = buildConfig[environment].keycloakUrl;
	const { keycloakRealm: realm, keycloakPublicClientId: clientId } = buildConfig;
	// users sign in with Google only (no Keycloak password): the window goes straight to Google.
	// A realm without that alias ignores the hint and shows its own page.
	const idpHint = buildConfig.keycloakIdpHint || DEFAULT_IDP_HINT;
	return baseUrl && realm && clientId ? { baseUrl, realm, clientId, idpHint } : null;
}

/** Identity provider alias sent as kc_idp_hint when the build names none. */
const DEFAULT_IDP_HINT = "google";

/** The worker's SDK sends the Keycloak access token on its calls and asks for a fresh one before it expires. */
function applyKeycloakToken(tokens: KeycloakTokens) {
	setAuthToken({ token: tokens.accessToken, expiresAt: tokens.expiresAt, authsource: "keycloak", sub: tokens.sub });
	setAuthTokenRenewer(async () => {
		const settings = keycloakSettings();
		const next = settings ? await getKeycloakTokens(settings) : null;
		return next ? { token: next.accessToken, expiresAt: next.expiresAt, authsource: "keycloak", sub: next.sub } : null;
	});
}

/** The stored session if it came from the Keycloak sign-in. */
async function storedKeycloakSession(): Promise<UDASessionData | null> {
	let stored = await UDAStorageService.get(UDASessionName);
	if (typeof stored === "string") {
		try { stored = JSON.parse(stored); } catch { return null; }
	}
	return stored?.authenticated && stored.authenticationSource === "keycloak" && stored.sessionKey ? stored : null;
}

async function sendToTab(tabId: number | undefined, action: string, data: string) {
	if (tabId === undefined) {
		// not asked by a tab: the SDK finds the active tab itself
		await UDASendSessionData(sessionData, action, data);
		return;
	}
	await anyBrowser.tabs.sendMessage(tabId, { action, data });
}

/**
 * A stored Keycloak session: refresh the access token if needed (`force`: the Server refused it) and
 * send the session to the tab. False when there is none, or Keycloak ended it (the stored session
 * is dropped, so the caller continues signed out).
 */
async function resumeKeycloakSession(tabId: number | undefined, force = false): Promise<boolean> {
	const stored = await storedKeycloakSession();
	if (!stored) return false;
	const settings = keycloakSettings();
	const tokens = settings ? await (force ? refreshKeycloakTokens(settings) : getKeycloakTokens(settings)) : null;
	if (!tokens) {
		clearAuthToken();
		await UDAStorageService.remove(UDASessionName);
		sessionData = new UDASessionData();
		return false;
	}
	applyKeycloakToken(tokens);
	sessionData = stored;
	sessionData.authData = { ...sessionData.authData, token: tokens.accessToken, expiresAt: tokens.expiresAt } as UDASessionData["authData"];
	await UDAStorageService.add(sessionData, UDASessionName);
	await sendToTab(tabId, "UDAAuthenticatedUserSessionData", JSON.stringify(sessionData));
	return true;
}

/**
 * Binds a Keycloak sign-in to a UDAN session: checkauthid and checkusersession with the access
 * token (the Server takes the user from the token: sub, authsource keycloak), then stores the
 * session and sends it to the tab. The session holds the access token only.
 */
async function bindKeycloakSession(tokens: KeycloakTokens, tabId: number | undefined) {
	applyKeycloakToken(tokens);
	if (!sessionData.sessionKey) sessionData = await UDAGetSessionKey(sessionData);
	const email = tokens.email ? await UDADigestMessage(tokens.email, "SHA-512") : null;
	const account = await apiClient.post(ENDPOINT.CheckUserId, { authid: tokens.sub, emailid: email, authsource: "keycloak" });
	const userId = account?.data?.id;
	if (userId === undefined || userId === null) throw new Error("checkauthid returned no user id");
	await apiClient.post(ENDPOINT.CheckUserSession, { userauthid: userId, usersessionid: sessionData.sessionKey });
	sessionData.authenticated = true;
	sessionData.authenticationSource = "keycloak";
	// the Server's owner key of a Keycloak user is this row id; the panel compares it with authData.id
	sessionData.authData = { id: String(userId), email, token: tokens.accessToken, expiresAt: tokens.expiresAt } as UDASessionData["authData"];
	await UDAStorageService.add(sessionData, UDASessionName);
	await sendToTab(tabId, "UDAAuthenticatedUserSessionData", JSON.stringify(sessionData));
}

/**
 * The Chrome identity flow ends at the token service, which needs the client secret. Builds never
 * carry one (check-env-keys.sh); only a local test build has it added to its own copy.
 */
function chromeIdentityCanSignIn(): boolean {
	return hasClientSecret();
}

/**
 * Sign-in button. A Chrome identity keeps the Chrome identity flow (compatibility until PK15)
 * when that flow can finish (a build with the client secret) and the user did not choose
 * Keycloak; otherwise the Keycloak sign-in runs: silently first, then in a window. A build
 * without the public client keeps the old answer. Every way out sends the tab a session or a
 * message code, or throws (the content script then shows "signin-failed").
 */
async function signIn(tabId: number | undefined, keycloakChosen: boolean) {
	if (await resumeKeycloakSession(tabId)) return;
	const settings = keycloakSettings();
	const identity = await getBrowserIdentity();
	if (!settings || (identity && !keycloakChosen && chromeIdentityCanSignIn())) {
		if (!identity) {
			// the button did nothing before: tell the user why
			await sendToTab(tabId, "UDAAlertMessageData", "signin-no-identity");
			return;
		}
		await legacySession("getusersessiondata");
		// the token service gave no token: that flow stops without a word, so say it here
		if (!sessionData.authData?.token) await sendToTab(tabId, "UDAAlertMessageData", "signin-failed");
		return;
	}
	try {
		const tokens = await signInWithKeycloak(settings, { interactive: true, loginHint: identity?.email });
		await bindKeycloakSession(tokens, tabId);
	} catch (err) {
		console.warn("[UDA Background] Keycloak sign-in did not complete:", (err as Error)?.message || err);
		await sendToTab(tabId, "UDAAlertMessageData", signInFailureCode(err));
	}
}

/** What the panel shows when the sign-in did not complete (texts live in the panel): cancelled, no connection, or failed. */
function signInFailureCode(err: unknown): string {
	if (err instanceof KeycloakAuthError) {
		if (err.code === "cancelled") return "signin-cancelled";
		return err.code.startsWith("http_5") ? "signin-network" : "signin-failed";
	}
	const message = (err as Error)?.message || "";
	return err instanceof TypeError || /network|failed to fetch|timeout/i.test(message) ? "signin-network" : "signin-failed";
}

/** Sign-out: ends the Keycloak session (if any) and forgets the stored session and tokens. */
async function signOut() {
	clearAuthToken();
	await UDAStorageService.remove(UDASessionName);
	sessionData = new UDASessionData();
	await signOutOfKeycloak(keycloakSettings());
}

/** A fresh access token for the panel, or null when there is no Keycloak session. */
async function panelAccessToken(tabId: number | undefined): Promise<{ token: string; expiresAt: number } | null> {
	const settings = keycloakSettings();
	if (!settings || !(await storedKeycloakSession())) return null;
	const tokens = await getKeycloakTokens(settings);
	if (!tokens) {
		// Keycloak ended the session (refresh token expired or revoked): sign out here, the panel shows the Sign-in button
		clearAuthToken();
		await UDAStorageService.remove(UDASessionName);
		sessionData = new UDASessionData();
		await sendToTab(tabId, "UDAAlertMessageData", "session-expired");
		return null;
	}
	return { token: tokens.accessToken, expiresAt: tokens.expiresAt };
}

async function generateNewToken() {
	console.log(sessionData);
	await UDABindAuthenticatedAccount(sessionData, true);
}

