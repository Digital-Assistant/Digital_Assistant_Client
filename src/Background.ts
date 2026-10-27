'use strict';

/**
 * Background Script for Universal Digital Assistant Browser Extension
 *
 * This service worker handles:
 * - User authentication via Chrome Identity API
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
    keyCloakStore,
    AppConfig
} from "@udan/digital-assistant-sdk";

// Import browser extension specific authentication
import { LoginWithBrowser } from "./browser-auth/LoginWithBrowser";
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

	const handleMessage = async () => {
		await environmentReady;
		// a page that set `environment` itself wins for its own messages
		applyEnvironment(normalizeEnvironment(request.pageEnvironment) ?? ownChoice.environment);
		if (request.action === "getusersessiondata" || request.action === "UDAGetNewToken") {
			const storedSessionData = await UDAStorageService.get(UDASessionName);
			if (!storedSessionData) {
				sessionData = await UDAGetSessionKey(sessionData);
				await LoginWithBrowser(sessionData, false);
			} else {
				// looks like browser storage might have changed so changing the reading the data has been changed. For to work with old version have added the new code to else if statement
				if (storedSessionData.hasOwnProperty("sessionKey") && storedSessionData["sessionKey"] && typeof storedSessionData["sessionKey"] != 'object') {
					sessionData = storedSessionData;
					if (request.action === "UDAGetNewToken") {
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
		} else if (request.action === "authtenicate") {
			await LoginWithBrowser(sessionData, false);
		} else if (request.action === "createSession") {
			await keyCloakStore(sessionData, request.data);
		}
	};

	handleMessage()
		.then(() => sendResponse({ success: true }))
		.catch((err) => {
			const error = err instanceof Error ? err : new Error(String(err));
			console.error("[UDA Background] onMessage error:", error);
			sendResponse({ success: false, error: error.message });
		});

	// Return true to keep the message channel open for async sendResponse
	return true;
});

async function generateNewToken() {
	console.log(sessionData);
	await UDABindAuthenticatedAccount(sessionData, true);
}

