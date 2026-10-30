/**
 * Keycloak sign-in for the background worker: authorization code + PKCE (S256) on a public
 * client, through the browser's web-auth-flow window. No client secret anywhere.
 *
 * - The refresh token (an offline token: `offline_access`, so a sign-in lasts weeks) stays in
 *   the worker: chrome.storage.local, key STORAGE_KEY. Only the short-lived access token
 *   leaves it (to the SDK in the worker and to the panel), never the refresh or id token.
 * - Silent first: `interactive: false` with `prompt=none`; a window opens only when the caller
 *   allows it (a user action).
 * - Browser-neutral: only `identity.launchWebAuthFlow` / `identity.getRedirectURL` through
 *   getBrowserVar(). Firefox has both, but is not supported yet (no gecko id; README).
 *
 * Tests: the runner's `keycloak-pkce` driver (scripts/e2e/behaviour-check.mjs) replaces
 * `identity.launchWebAuthFlow` in the running worker; nothing here knows about tests.
 */

import { getBrowserVar } from "@udan/digital-assistant-sdk";

export interface KeycloakSettings {
    /** Keycloak base URL, without /realms. */
    baseUrl: string;
    realm: string;
    /** Public client id (standard flow + PKCE S256, no secret). */
    clientId: string;
    /** Identity provider alias for kc_idp_hint; empty = Keycloak's own page. */
    idpHint?: string;
}

export interface KeycloakTokens {
    accessToken: string;
    /** Access token expiry, epoch ms. */
    expiresAt: number;
    refreshToken?: string;
    /** Refresh token expiry, epoch ms; 0 = none given (offline token: idle timeout only). */
    refreshExpiresAt: number;
    idToken?: string;
    sub: string;
    email?: string;
    /** Issuer and client the tokens belong to: tokens of another Keycloak, realm or client are not used. */
    owner: string;
}

export class KeycloakAuthError extends Error {
    constructor(message: string, readonly code: string) {
        super(message);
        this.name = "KeycloakAuthError";
    }
}

const STORAGE_KEY = "udanKeycloakTokens";
const SCOPE = "openid offline_access";
/** Refresh this long before the access token expires. */
const RENEW_BEFORE_MS = 60_000;
/** Answers of a silent attempt that mean "a window is needed" (OIDC prompt=none errors, or the browser refused). */
const NEEDS_INTERACTION = new Set(["login_required", "interaction_required", "consent_required", "account_selection_required", "launch"]);

const issuer = (s: KeycloakSettings) => `${s.baseUrl.replace(/\/+$/, "")}/realms/${encodeURIComponent(s.realm)}`;
const endpoint = (s: KeycloakSettings, name: "auth" | "token" | "logout") => `${issuer(s)}/protocol/openid-connect/${name}`;
const ownerOf = (s: KeycloakSettings) => `${issuer(s)} ${s.clientId}`;
const browser = () => getBrowserVar() as any;

// ---- PKCE and JWT helpers ------------------------------------------------------------------------

function base64Url(bytes: Uint8Array): string {
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomString(byteCount: number): string {
    const bytes = new Uint8Array(byteCount);
    crypto.getRandomValues(bytes);
    return base64Url(bytes);
}

async function s256(verifier: string): Promise<string> {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
    return base64Url(new Uint8Array(digest));
}

/** Payload of a JWT, unverified: the Server verifies the signature; the worker only reads claims. */
function jwtClaims(token: string | undefined): Record<string, any> {
    const part = token?.split(".")[1];
    if (!part) return {};
    try {
        const b64 = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
        const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
        return {};
    }
}

// ---- storage (worker only) -----------------------------------------------------------------------

async function load(): Promise<KeycloakTokens | null> {
    const stored = await browser().storage.local.get(STORAGE_KEY);
    return stored?.[STORAGE_KEY] ?? null;
}

async function save(tokens: KeycloakTokens): Promise<void> {
    await browser().storage.local.set({ [STORAGE_KEY]: tokens });
}

async function clear(): Promise<void> {
    await browser().storage.local.remove(STORAGE_KEY);
}

// ---- Keycloak calls ------------------------------------------------------------------------------

async function tokenRequest(s: KeycloakSettings, form: Record<string, string>, previous?: KeycloakTokens): Promise<KeycloakTokens> {
    const res = await fetch(endpoint(s, "token"), {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ client_id: s.clientId, ...form }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || typeof body.access_token !== "string") {
        throw new KeycloakAuthError(`Keycloak token request failed (${res.status} ${body.error || ""})`.trim(), body.error || `http_${res.status}`);
    }
    const access = jwtClaims(body.access_token);
    const id = jwtClaims(body.id_token);
    if (access.azp !== s.clientId) throw new KeycloakAuthError(`token is for client ${access.azp}, not ${s.clientId}`, "azp");
    if (typeof access.sub !== "string" || !access.sub) throw new KeycloakAuthError("token has no subject", "sub");
    const now = Date.now();
    return {
        accessToken: body.access_token,
        expiresAt: now + Number(body.expires_in || 0) * 1000,
        refreshToken: body.refresh_token || previous?.refreshToken,
        refreshExpiresAt: body.refresh_expires_in ? now + Number(body.refresh_expires_in) * 1000 : 0,
        idToken: body.id_token || previous?.idToken,
        sub: access.sub,
        email: id.email || access.email || previous?.email,
        owner: ownerOf(s),
    };
}

async function launchFlow(url: string, interactive: boolean): Promise<URL> {
    const identity = browser().identity;
    if (!identity?.launchWebAuthFlow) throw new KeycloakAuthError("this browser has no identity.launchWebAuthFlow", "unsupported");
    let answer: string | undefined;
    try {
        answer = await identity.launchWebAuthFlow({ url, interactive });
    } catch (err) {
        // Chrome rejects a silent flow that needs a page ("User interaction required.") and a closed window
        throw new KeycloakAuthError(`sign-in window: ${(err as Error)?.message || err}`, interactive ? "cancelled" : "launch");
    }
    if (!answer) throw new KeycloakAuthError("sign-in window closed", "cancelled");
    return new URL(answer);
}

/** One authorization request, then the code exchange. */
async function authorize(s: KeycloakSettings, interactive: boolean, loginHint?: string): Promise<KeycloakTokens> {
    const redirectUri: string = browser().identity.getRedirectURL();
    const verifier = randomString(48);
    const state = randomString(16);
    const nonce = randomString(16);
    const params = new URLSearchParams({
        client_id: s.clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: SCOPE,
        code_challenge: await s256(verifier),
        code_challenge_method: "S256",
        state,
        nonce,
    });
    if (!interactive) params.set("prompt", "none");
    if (s.idpHint) params.set("kc_idp_hint", s.idpHint);
    if (loginHint) params.set("login_hint", loginHint);

    const answer = await launchFlow(`${endpoint(s, "auth")}?${params}`, interactive);
    if (`${answer.origin}${answer.pathname}` !== new URL(redirectUri).href.replace(/\?.*$/, "")) {
        throw new KeycloakAuthError("sign-in answered on an unexpected address", "redirect");
    }
    if (answer.searchParams.get("state") !== state) throw new KeycloakAuthError("sign-in answer has the wrong state", "state");
    const error = answer.searchParams.get("error");
    if (error) throw new KeycloakAuthError(`Keycloak answered ${error}`, error);
    const code = answer.searchParams.get("code");
    if (!code) throw new KeycloakAuthError("sign-in answer has no code", "code");

    const tokens = await tokenRequest(s, { grant_type: "authorization_code", code, redirect_uri: redirectUri, code_verifier: verifier });
    if (jwtClaims(tokens.idToken).nonce !== nonce) throw new KeycloakAuthError("id token has the wrong nonce", "nonce");
    return tokens;
}

// ---- public API ----------------------------------------------------------------------------------

/**
 * Signs in: silently first, then, if `interactive` (a user action) and Keycloak needs a page, in a
 * window. Stores and returns the tokens.
 */
export async function signInWithKeycloak(
    s: KeycloakSettings,
    { interactive, loginHint }: { interactive: boolean; loginHint?: string },
): Promise<KeycloakTokens> {
    let tokens: KeycloakTokens;
    try {
        tokens = await authorize(s, false, loginHint);
    } catch (err) {
        if (!interactive || !(err instanceof KeycloakAuthError) || !NEEDS_INTERACTION.has(err.code)) throw err;
        tokens = await authorize(s, true, loginHint);
    }
    await save(tokens);
    return tokens;
}

let refreshing: Promise<KeycloakTokens | null> | null = null;

/**
 * Refreshes now (one call at a time). Null and the tokens are dropped when Keycloak refuses the
 * refresh token (expired, revoked, signed out elsewhere); network errors are thrown and keep them.
 */
export function refreshKeycloakTokens(s: KeycloakSettings): Promise<KeycloakTokens | null> {
    if (!refreshing) {
        refreshing = (async () => {
            const current = await load();
            if (!current || current.owner !== ownerOf(s)) return null;
            if (!current.refreshToken || (current.refreshExpiresAt && current.refreshExpiresAt <= Date.now())) {
                await clear();
                return null;
            }
            try {
                const next = await tokenRequest(s, { grant_type: "refresh_token", refresh_token: current.refreshToken }, current);
                if (next.sub !== current.sub) throw new KeycloakAuthError("refreshed token is for another user", "sub");
                await save(next);
                return next;
            } catch (err) {
                // an OAuth error (invalid_grant, ...) or a wrong token ends the sign-in; a bare HTTP status
                // (Keycloak down, proxy error) does not
                if (err instanceof KeycloakAuthError && !err.code.startsWith("http_")) {
                    await clear();
                    return null;
                }
                throw err;
            }
        })().finally(() => {
            refreshing = null;
        });
    }
    return refreshing;
}

/**
 * The stored tokens with an access token valid for at least a minute (refreshed first if needed,
 * also after a worker restart); null when signed out or the stored tokens belong to other settings.
 */
export async function getKeycloakTokens(s: KeycloakSettings): Promise<KeycloakTokens | null> {
    const current = await load();
    if (!current || current.owner !== ownerOf(s)) return null;
    if (current.expiresAt - RENEW_BEFORE_MS > Date.now()) return current;
    return refreshKeycloakTokens(s);
}

/** Ends the Keycloak session (offline and browser session) and forgets the tokens. */
export async function signOutOfKeycloak(s: KeycloakSettings | null): Promise<void> {
    const current = await load();
    await clear();
    if (!s || !current?.refreshToken || current.owner !== ownerOf(s)) return;
    try {
        // ends the offline session and the browser session it came from (Keycloak answers 204)
        const res = await fetch(endpoint(s, "logout"), {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ client_id: s.clientId, refresh_token: current.refreshToken }),
        });
        await res.text().catch(() => "");
        if (!res.ok) console.warn(`[UDA Keycloak] logout answered ${res.status}; the local tokens are gone anyway`);
    } catch (err) {
        console.warn("[UDA Keycloak] logout call failed; the local tokens are gone anyway:", (err as Error)?.message);
    }
}
