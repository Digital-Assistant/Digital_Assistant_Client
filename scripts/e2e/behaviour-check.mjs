// Behaviour check: the 14 checks of the extension against a running backend (local stack).
// Loads a ready, unpacked build in Chromium (playwright-core), opens the host-page fixture from a
// local server, signs in through an auth driver, records a two-step recording, saves, finds and plays
// it. Knows nothing about secrets: the build it is given must already be able to sign in.
//   node scripts/e2e/behaviour-check.mjs --build <dir> --backend <base-url>
//        [--auth chrome-identity|keycloak-pkce] [--identity <label>] [--keycloak-user <name>] [--out <dir>] [--headed]
// keycloak-pkce signs in as a Keycloak user on Keycloak's own page; the password comes from the
// environment variable UDAN_E2E_KEYCLOAK_PASSWORD and is never printed.
// <base-url> is the Server REST base (http(s)://host[:port]/api, the /api is optional).
// Exit: 0 all 14 pass, 1 a check failed, 2 usage or setup error, 3 backend unreachable.
// Output: <out>/behaviour-check.json and behaviour-check.md (check, result, evidence); a screenshot
// on failure. Backend, token service and Keycloak hosts are redacted; tokens and bodies are never
// recorded, headers only as "UDAN-Realm present yes/no". Read README "Behaviour check (local stack)".
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { chromium } from "playwright-core";

const USAGE =
  "usage: behaviour-check.mjs --build <dir> --backend <base-url> [--auth chrome-identity|keycloak-pkce] [--identity <label>] [--keycloak-user <name>] [--out <dir>] [--headed]";
const STEP_MS = 30_000; // longest wait for one observation
const SETTLE_MS = 2_500; // quiet time after load before the load-time checks are judged

let opts;
try {
  opts = parseArgs({
    options: {
      build: { type: "string" },
      backend: { type: "string" },
      auth: { type: "string", default: "chrome-identity" },
      identity: { type: "string", default: "pk-e2e-a" },
      "keycloak-user": { type: "string" },
      out: { type: "string" },
      headed: { type: "boolean", default: false },
      help: { type: "boolean", default: false },
    },
  }).values;
} catch (err) {
  console.error(`${err.message}\n${USAGE}`);
  process.exit(2);
}
if (opts.help) { console.log(USAGE); process.exit(0); }
if (!opts.build || !opts.backend) { console.error(USAGE); process.exit(2); }

const buildDir = resolve(opts.build);
if (!existsSync(join(buildDir, "manifest.json"))) {
  console.error(`no manifest.json in ${buildDir}: pass the unpacked build directory (npm run build -> build/)`);
  process.exit(2);
}
if (!/^[a-z0-9][a-z0-9._-]{0,40}$/.test(opts.identity)) {
  console.error("--identity must be a short label: lower-case letters, digits, '.', '_' or '-'");
  process.exit(2);
}
let backendUrl;
try {
  backendUrl = new URL(opts.backend.replace(/\/+$/, ""));
  if (!/^https?:$/.test(backendUrl.protocol)) throw new Error("not http(s)");
} catch {
  console.error(`--backend must be http(s)://host[:port][/api]\n${USAGE}`);
  process.exit(2);
}
const apiPrefix = `${backendUrl.origin}${backendUrl.pathname.replace(/\/api$/, "")}/api/`.replace(/([^:])\/{2,}/g, "$1/");
const runId = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14) + "-" + Math.random().toString(36).slice(2, 6);
const outDir = resolve(opts.out || join("out", "behaviour", runId));
const here = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(join(here, "..", "ci", "fixtures", "host-page.html"));

// ---- redaction: no backend, token service or Keycloak host in any output ----------------------
const hosts = [[backendUrl.origin, "<backend>"]];
const redact = (text) => {
  let out = String(text);
  for (const [origin, label] of hosts) {
    if (!origin) continue;
    out = out.split(origin).join(label).split(new URL(origin).host).join(label);
  }
  return out;
};
const log = (line = "") => console.log(redact(line));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitFor(fn, what, ms = STEP_MS) {
  const end = Date.now() + ms;
  for (;;) {
    const v = await fn();
    if (v) return v;
    if (Date.now() > end) throw new Error(`timeout waiting for ${what}`);
    await sleep(250);
  }
}

// ---- auth drivers --------------------------------------------------------------------------------
// An auth driver gets the extension from "signed out" to "signed in". prepare() runs once the
// worker is up and before the host page opens (the page must load signed out, check 3); signIn()
// runs from the open panel's login screen and returns when sign-in was started. loginCalls are the
// calls check 8 expects; extras() (optional) runs after check 14 and adds evidence outside the 14.
const isTokenServiceCall = (r) => r.service === "token" && r.method === "POST" && r.path.endsWith("/user/token");
const isKeycloakTokenCall = (r) => r.service === "keycloak" && r.method === "POST" && r.path.endsWith("/protocol/openid-connect/token");
const authDrivers = {
  "chrome-identity": {
    // The worker signs in with chrome.identity.getProfileUserInfo (src/browser-auth/LoginWithBrowser.ts).
    // Headless Chromium has no Chrome profile, so the runner replaces that one function in the
    // running worker with a stub that returns a labelled test identity. Chosen over patching the
    // build: the build under test stays byte-for-byte what was built, and nothing in the repo
    // carries test code. The stub answers "not signed in" (empty id and email, as Chrome does)
    // until signIn() sets the identity. If Chrome restarts the worker the stub is gone and the real
    // function also answers "not signed in", so signIn() installs it again on the current worker.
    check8: "Login: getsessionkey 200, checkauthid 200, POST /user/token 201, checkusersession 200, with UDAN-Realm header",
    loginCalls: [
      ["getsessionkey", (r) => r.service === "backend" && r.path.endsWith("/user/getsessionkey"), [200], true],
      ["checkauthid", (r) => r.service === "backend" && r.path.endsWith("/user/checkauthid"), [200], true],
      ["POST /user/token", isTokenServiceCall, [201], true],
      ["checkusersession", (r) => r.service === "backend" && r.path.endsWith("/user/checkusersession"), [200], true],
    ],
    secretExpected: true,
    async install(worker, identity) {
      await worker.evaluate((who) => {
        globalThis.__udaE2EIdentity = who;
        chrome.identity.getProfileUserInfo = (_options, callback) => {
          const value = { ...(globalThis.__udaE2EIdentity || { email: "", id: "" }) };
          return typeof callback === "function" ? callback(value) : Promise.resolve(value);
        };
      }, identity);
    },
    async prepare({ worker }) {
      await this.install(worker, { email: "", id: "" });
      return "chrome.identity.getProfileUserInfo stubbed in the worker (signed out)";
    },
    async signIn({ context, panel, identity }) {
      const worker = context.serviceWorkers()[0];
      if (!worker) throw new Error("extension worker not running at sign-in");
      await this.install(worker, { email: `${identity}@example.test`, id: identity });
      await panel.getByRole("button", { name: "Sign in with Google" }).click();
      return `test identity ${identity}@example.test`;
    },
    async extras({ uiSignOut, signInShown }) {
      await uiSignOut();
      const shown = await signInShown();
      return [{ name: "Logout: Settings > Sign Out shows the Sign-in button again", status: shown ? "PASS" : "FAIL", evidence: `"Sign in with Google" ${shown ? "visible" : "not visible"} after Sign Out` }];
    },
  },
  "keycloak-pkce": {
    // The worker signs in with Keycloak authorization code + PKCE on the public client
    // (src/browser-auth/LoginWithKeycloak.ts) through chrome.identity.launchWebAuthFlow, which
    // headless Chromium cannot show. As with chrome-identity, the build is not patched: the runner
    // replaces launchWebAuthFlow in the running worker with a stub that parks the authorization URL
    // and waits. The runner opens that URL in a tab of the same profile, signs in on Keycloak's own
    // page as --keycloak-user (password from UDAN_E2E_KEYCLOAK_PASSWORD), catches the redirect to
    // https://<extension id>.chromiumapp.org/ by route interception and hands it to the stub. A silent
    // request (interactive: false) is answered as Chrome answers it: Keycloak's redirect if it gives
    // one without a page, else "User interaction required.". getProfileUserInfo answers "signed out"
    // for the cancel check and a signed-in Chrome profile (<label>@example.test) for the real sign-in,
    // as on a tester's Chrome: a build without a client secret must still take the Keycloak path.
    // Needs a build with keycloakPublicClientId set and the client's redirect URI registered for the
    // extension id.
    check8: "Login: getsessionkey 200, Keycloak code exchange (POST /token) 200, checkauthid 200 and checkusersession 200 with a bearer token, no POST /user/token, with UDAN-Realm header",
    loginCalls: [
      ["getsessionkey", (r) => r.service === "backend" && r.path.endsWith("/user/getsessionkey"), [200], true],
      ["Keycloak POST /token", isKeycloakTokenCall, [200], false],
      ["checkauthid", (r) => r.service === "backend" && r.path.endsWith("/user/checkauthid") && r.bearer, [200], true],
      ["checkusersession", (r) => r.service === "backend" && r.path.endsWith("/user/checkusersession") && r.bearer, [200], true],
    ],
    forbiddenLoginCalls: [["POST /user/token", isTokenServiceCall]],
    secretExpected: false,
    user: "",
    password: "",
    flows: [],
    async install(worker, profile = { email: "", id: "" }) {
      await worker.evaluate((who) => {
        chrome.identity.getProfileUserInfo = (_options, callback) => {
          const value = { ...who };
          return typeof callback === "function" ? callback(value) : Promise.resolve(value);
        };
        globalThis.__udaE2EFlows = globalThis.__udaE2EFlows || [];
        chrome.identity.launchWebAuthFlow = (details, callback) => {
          const answer = new Promise((resolve, reject) => {
            globalThis.__udaE2EFlows.push({ url: details.url, interactive: Boolean(details.interactive), taken: false, resolve, reject });
          });
          if (typeof callback === "function") { answer.then(callback, () => callback(undefined)); return undefined; }
          return answer;
        };
      }, profile);
    },
    async prepare({ worker }) {
      this.user = opts["keycloak-user"] || "";
      this.password = process.env.UDAN_E2E_KEYCLOAK_PASSWORD || "";
      if (!this.user || !this.password) throw new Error("keycloak-pkce needs --keycloak-user and UDAN_E2E_KEYCLOAK_PASSWORD");
      this.extensionId = new URL(worker.url()).host;
      // the browser's own API, before the stub replaces it: the worker needs it for the real sign-in window
      const native = await worker.evaluate(() => typeof chrome.identity?.launchWebAuthFlow);
      await this.install(worker);
      const stored = await worker.evaluate(async () => Boolean((await chrome.storage.local.get("udanKeycloakTokens")).udanKeycloakTokens));
      if (stored) throw new Error("the fresh profile already holds Keycloak tokens");
      return `chrome.identity.launchWebAuthFlow (in the worker: ${native}) stubbed, extension id ${this.extensionId}`;
    },
    // One parked authorization request: open it, sign in if it is interactive, answer the stub.
    async serve(context, flow, { cancel = false } = {}) {
      const redirectPrefix = `https://${this.extensionId}.chromiumapp.org/`;
      const authUrl = new URL(flow.url);
      this.clientId = authUrl.searchParams.get("client_id");
      if (flow.interactive) this.hints = { idp: authUrl.searchParams.get("kc_idp_hint") || "", login: authUrl.searchParams.get("login_hint") || "" };
      this.tokenEndpoint = `${authUrl.origin}${authUrl.pathname.replace(/\/auth$/, "/token")}`;
      const tab = await context.newPage();
      let redirect = null;
      tab.on("request", (r) => { if (r.url().startsWith(redirectPrefix)) redirect = r.url(); });
      await tab.route(`${redirectPrefix}**`, (route) => {
        redirect = route.request().url();
        return route.fulfill({ status: 200, contentType: "text/plain", body: "redirect captured by the behaviour check" });
      });
      let note;
      try {
        await tab.goto(flow.url, { waitUntil: "load", timeout: STEP_MS }).catch(() => {});
        if (!redirect && flow.interactive && cancel) {
          // the user closes the sign-in window without signing in
          await tab.locator("#username").waitFor({ state: "visible", timeout: STEP_MS });
        } else if (!redirect && flow.interactive) {
          await tab.locator("#username").fill(this.user, { timeout: STEP_MS });
          await tab.locator("#password").fill(this.password);
          await tab.locator("#kc-login").click();
          await waitFor(() => redirect, "the redirect to <extension id>.chromiumapp.org");
        } else if (!redirect) {
          await waitFor(() => redirect, "a silent redirect", 3_000).catch(() => {});
        }
      } finally {
        await tab.close().catch(() => {});
      }
      const answered = redirect ? new URL(redirect).searchParams : null;
      note = !redirect ? `${flow.interactive ? "interactive" : "silent"}: ${cancel && flow.interactive ? "window closed" : "no redirect"}`
        : `${flow.interactive ? "interactive" : "silent"}: ${answered.get("code") ? "code" : `error ${answered.get("error")}`}`;
      const worker = context.serviceWorkers()[0];
      await worker.evaluate(({ index, url }) => {
        const f = globalThis.__udaE2EFlows[index];
        if (url) f.resolve(url); else f.reject(new Error("User interaction required."));
      }, { index: flow.index, url: redirect });
      return note;
    },
    // Serves the parked authorization requests until `done(notes)` is true or the time is up.
    async pump(context, done, options) {
      const end = Date.now() + 2 * STEP_MS;
      while (Date.now() < end && !done(this.flows)) {
        const current = context.serviceWorkers()[0];
        const pending = current ? await current.evaluate(() => (globalThis.__udaE2EFlows || [])
          .map((f, index) => ({ index, url: f.url, interactive: f.interactive, taken: f.taken }))
          .filter((f) => !f.taken)).catch(() => []) : [];
        for (const flow of pending) {
          await current.evaluate((i) => { globalThis.__udaE2EFlows[i].taken = true; }, flow.index);
          this.flows.push(await this.serve(context, flow, options));
        }
        if (done(this.flows)) break;
        await sleep(250);
      }
    },
    // The real sign-in runs with a signed-in Chrome profile, as on a tester's Chrome.
    async signIn({ context, panel, identity = opts.identity }) {
      const worker = context.serviceWorkers()[0];
      if (!worker) throw new Error("extension worker not running at sign-in");
      this.profileEmail = `${identity}@example.test`;
      await this.install(worker, { email: this.profileEmail, id: identity });
      this.flows = [];
      await panel.getByRole("button", { name: "Sign in with Google" }).click();
      await this.pump(context, (notes) => notes.some((n) => n.startsWith("interactive: code")));
      return `Keycloak user ${this.user}, Chrome profile ${this.profileEmail} (sign-in windows: ${this.flows.join("; ") || "none"})`;
    },
    // Before the real sign-in: the user presses Sign in and closes the window, then a sign-in fails
    // inside the worker. The panel must say so in plain words each time and keep the Sign-in button.
    async beforeSignIn({ context, panel }) {
      const worker = context.serviceWorkers()[0];
      await this.install(worker);
      this.flows = [];
      const button = panel.getByRole("button", { name: "Sign in with Google" });
      const noIdentity = await button.isVisible();
      await button.click();
      // the page's own answer to the press must not end "Signing in…"; only the worker's answer does
      await sleep(500);
      const busy = !(await button.isEnabled().catch(() => true));
      await this.pump(context, (notes) => notes.some((n) => n.startsWith("interactive:")), { cancel: true });
      const message = panel.getByRole("alert");
      await message.waitFor({ state: "visible", timeout: STEP_MS }).catch(() => {});
      const text = ((await message.isVisible()) ? await message.innerText() : "").trim();
      const again = await button.isEnabled().catch(() => false);
      const tokens = await worker.evaluate(async () => Boolean((await chrome.storage.local.get("udanKeycloakTokens")).udanKeycloakTokens));
      // worker error: the worker's next storage read fails, so the sign-in throws before any window
      await worker.evaluate(() => {
        const area = chrome.storage.local;
        globalThis.__udaE2EStorageGet = area.get;
        area.get = function () {
          area.get = globalThis.__udaE2EStorageGet;
          return Promise.reject(new Error("storage refused by the behaviour check"));
        };
      });
      await button.click();
      const failed = await waitFor(async () => {
        const shown = (await message.isVisible()) ? (await message.innerText()).trim() : "";
        return /cancel/i.test(shown) ? "" : shown;
      }, "a message after the worker error", 10_000).catch(() => "");
      const enabledAfterError = await button.isEnabled().catch(() => false);
      await worker.evaluate(() => { chrome.storage.local.get = globalThis.__udaE2EStorageGet; delete globalThis.__udaE2EStorageGet; });
      this.flows = [];
      return [
        { name: "No identity: the Sign-in button is shown (not signed in)", status: noIdentity ? "PASS" : "FAIL", evidence: `"Sign in with Google" ${noIdentity ? "visible" : "not visible"} before the press` },
        { name: "Busy: the Sign-in button stays disabled while the worker signs in", status: busy ? "PASS" : "FAIL", evidence: `0.5 s after the press the button is ${busy ? "disabled" : "enabled again"}` },
        { name: "Cancel: closing the sign-in window shows a plain message and keeps the Sign-in button; no tokens stored", status: /cancel/i.test(text) && again && !tokens ? "PASS" : "FAIL",
          evidence: `message "${text || "none"}"; Sign-in button ${again ? "enabled" : "not enabled"}; tokens stored ${tokens ? "yes" : "no"}` },
        { name: "Worker error: a sign-in that fails inside the worker shows a plain message and keeps the Sign-in button", status: failed && enabledAfterError ? "PASS" : "FAIL",
          evidence: `message "${failed || "none"}"; Sign-in button ${enabledAfterError ? "enabled" : "not enabled"}` },
      ];
    },
    // Evidence beyond the 14: a refresh with the stored refresh token, and sign-out revoking it.
    // Token values stay inside the browser; only yes/no and status codes come out.
    async extras({ context, page, panel, find, answered, describe, uiSignOut, signInShown }) {
      const out = [];
      const worker = context.serviceWorkers()[0];
      // Google: the sign-in window goes to the Google IdP (a build without keycloakIdpHint sends "google")
      // and Keycloak gets the Chrome profile's email as login_hint
      const hints = this.hints || { idp: "", login: "" };
      out.push({ name: "Google: the sign-in window asks Keycloak for the Google IdP and the Chrome profile's account", status: hints.idp === "google" && hints.login === this.profileEmail ? "PASS" : "FAIL",
        evidence: `kc_idp_hint "${hints.idp || "none"}"; login_hint ${hints.login ? (hints.login === this.profileEmail ? "the Chrome profile's email" : "another value") : "none"}` });
      // owner: the Server stores a Keycloak user's recordings under the numeric user row id, and the
      // panel shows the owner buttons when that equals its user id (authData.id); ids are compared here, not printed
      const saved = find((r) => r.service === "backend" && r.path.endsWith("/clickevents/recordsequencedata") && r.status === 200)[0];
      const owner = await saved?.req.response().then((res) => res?.json()).then((b) => b?.usersessionid).catch(() => undefined);
      const panelUserId = await page.evaluate(() => {
        let v = localStorage.getItem("udaUserData");
        for (let i = 0; i < 3 && typeof v === "string"; i++) { try { v = JSON.parse(v); } catch { break; } }
        return v?.authData?.id ?? null;
      });
      const sameOwner = owner !== undefined && owner !== null && String(owner) === String(panelUserId);
      out.push({ name: "Owner: the saved recording's owner is the panel's user id, a numeric user row id (owner buttons shown)", status: sameOwner && /^\d+$/.test(String(owner)) ? "PASS" : "FAIL",
        evidence: `recordsequencedata owner ${owner === undefined ? "not read" : /^\d+$/.test(String(owner)) ? "is a row id" : "is not a row id"}; equals the panel's authData.id: ${sameOwner ? "yes" : "no"}` });
      const tokenCalls = () => find(isKeycloakTokenCall).length;
      // refresh: age the stored access token, then let the panel ask the worker for a fresh one
      const before = tokenCalls();
      await worker.evaluate(async () => {
        const { udanKeycloakTokens: t } = await chrome.storage.local.get("udanKeycloakTokens");
        globalThis.__udaE2EOld = { access: t.accessToken, refresh: t.refreshToken };
        await chrome.storage.local.set({ udanKeycloakTokens: { ...t, expiresAt: Date.now() - 6 * 60_000 } });
      });
      const panelGotToken = await page.evaluate(() => new Promise((resolve) => {
        const timer = setTimeout(() => resolve(false), 15_000);
        document.addEventListener("UDAAccessTokenData", (e) => { clearTimeout(timer); resolve(Boolean(e.detail?.data?.token)); }, { once: true });
        document.dispatchEvent(new CustomEvent("UDARequestAccessToken", { detail: {} }));
      }));
      const refreshed = await worker.evaluate(async () => {
        const { udanKeycloakTokens: t } = await chrome.storage.local.get("udanKeycloakTokens");
        return { changed: Boolean(t && t.accessToken !== globalThis.__udaE2EOld.access), fresh: Boolean(t && t.expiresAt > Date.now() + 60_000) };
      });
      await waitFor(() => tokenCalls() > before && find(isKeycloakTokenCall).slice(before).every(answered), "the refresh call", 10_000).catch(() => {});
      const refreshCall = find(isKeycloakTokenCall).slice(before)[0];
      const refreshOk = panelGotToken && refreshed.changed && refreshed.fresh && refreshCall?.status === 200;
      out.push({ name: "Refresh after 5+ min idle: an access token expired 6 min ago is renewed with the stored refresh token; the panel gets the new access token", status: refreshOk ? "PASS" : "FAIL",
        evidence: `panel answer ${panelGotToken ? "has a token" : "empty"}; worker token changed ${refreshed.changed ? "yes" : "no"}, valid > 60 s ${refreshed.fresh ? "yes" : "no"}; ${refreshCall ? describe(refreshCall) : "no Keycloak /token call"}` });
      // sign-out: the panel's logout message; then the old refresh token must be refused
      await worker.evaluate(async () => {
        const { udanKeycloakTokens: t } = await chrome.storage.local.get("udanKeycloakTokens");
        globalThis.__udaE2EOld.refresh = t?.refreshToken || globalThis.__udaE2EOld.refresh;
      });
      const logoutBefore = find((r) => r.service === "keycloak" && r.path.endsWith("/protocol/openid-connect/logout")).length;
      await uiSignOut();
      const logoutCall = await waitFor(() => find((r) => r.service === "keycloak" && r.path.endsWith("/protocol/openid-connect/logout")).slice(logoutBefore).find(answered), "the Keycloak logout call", 10_000).catch(() => null);
      const after = await worker.evaluate(async ({ clientId, tokenEndpoint }) => {
        const stored = await chrome.storage.local.get(null);
        const tokensGone = !stored.udanKeycloakTokens;
        const sessionGone = !Object.entries(stored).some(([, v]) => typeof v === "object" && v?.authenticationSource === "keycloak");
        const res = await fetch(tokenEndpoint, {
          method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ grant_type: "refresh_token", client_id: clientId, refresh_token: globalThis.__udaE2EOld.refresh }),
        });
        const body = await res.json().catch(() => ({}));
        delete globalThis.__udaE2EOld;
        return { tokensGone, sessionGone, status: res.status, error: body.error || "" };
      }, { clientId: this.clientId, tokenEndpoint: this.tokenEndpoint });
      // judged by the status Keycloak sent (Chromium may still flag the body-less 204 as aborted)
      const signOutOk = logoutCall?.status >= 200 && logoutCall.status < 300 && after.tokensGone && after.sessionGone && after.status === 400 && after.error === "invalid_grant";
      out.push({ name: "Logout: Settings > Sign Out shows the Sign-in button again", status: await signInShown() ? "PASS" : "FAIL", evidence: `"Sign in with Google" ${await signInShown() ? "visible" : "not visible"} after Sign Out` });
      out.push({ name: "Sign-out: Keycloak logout, worker forgets tokens and session, the old refresh token is refused", status: signOutOk ? "PASS" : "FAIL",
        evidence: `${logoutCall ? `${logoutCall.method} ${logoutCall.path} status ${logoutCall.status ?? "none"}${logoutCall.failed ? ` (flagged ${logoutCall.failed})` : ""}` : "no Keycloak logout call"}; tokens gone ${after.tokensGone ? "yes" : "no"}, session gone ${after.sessionGone ? "yes" : "no"}; old refresh token -> ${after.status} ${after.error}` });
      // session expired: sign in again, then Keycloak refuses the refresh token (it is revoked/expired)
      // while the access token has run out; the panel must say so and show the Sign-in button
      const again = await this.signIn({ context, page, panel });
      await panel.getByRole("button", { name: "Record" }).waitFor({ state: "visible", timeout: STEP_MS }).catch(() => {});
      await worker.evaluate(async () => {
        const { udanKeycloakTokens: t } = await chrome.storage.local.get("udanKeycloakTokens");
        if (t) await chrome.storage.local.set({ udanKeycloakTokens: { ...t, refreshToken: "revoked-by-the-behaviour-check", expiresAt: Date.now() - 1_000 } });
      });
      await page.evaluate(() => document.dispatchEvent(new CustomEvent("UDARequestAccessToken", { detail: {} })));
      const note = panel.getByRole("alert");
      await note.waitFor({ state: "visible", timeout: STEP_MS }).catch(() => {});
      const noteText = ((await note.isVisible()) ? await note.innerText() : "").trim();
      out.push({ name: "Session expired: a refused refresh token shows a plain message and the Sign-in button", status: /expired/i.test(noteText) && await signInShown() ? "PASS" : "FAIL",
        evidence: `${again ? "signed in again; " : ""}message "${noteText || "none"}"; Sign-in button ${await signInShown() ? "visible" : "not visible"}` });
      return out;
    },
  },
};
const driver = authDrivers[opts.auth];
if (!driver || driver.todo) {
  console.error(driver ? driver.todo : `unknown --auth ${opts.auth}; known: ${Object.keys(authDrivers).join(", ")}`);
  process.exit(2);
}

// ---- report --------------------------------------------------------------------------------------
const CHECKS = {
  1: "Extension loads, worker starts",
  2: "Content script injects, panel mounts (#udan-react-root, shadow root)",
  3: "Panel opens, login screen shown",
  4: "No console errors on load",
  5: "Backend reached with the build's own defaults",
  6: "Early host-page UDAPluginSDK({environment, realm}) honoured (page world; worker takes build config)",
  7: "Zero Keycloak requests on page load",
  8: driver.check8,
  9: "Search list GET /api/search/all 200; text filter shows a saved recording",
  10: "Record two clicks; steps listed",
  11: "Save: clickednode x2 200, recordsequencedata 200",
  12: "Saved recording listed and searchable",
  13: "Playback navigates the steps, userclick 204, ends on \"Playback completed\"",
  14: "No failed backend calls in the whole run",
};
const results = new Map(); // number -> { status, evidence }
const extras = []; // { name, status, evidence }: driver evidence beyond the 14
const pass = (n, evidence) => results.set(n, { status: "PASS", evidence });
const fail = (n, evidence) => results.set(n, { status: "FAIL", evidence });
const started = Date.now();
let setupError = "";

function writeReport(requests) {
  mkdirSync(outDir, { recursive: true });
  const checks = Object.entries(CHECKS).map(([n, name]) => {
    const r = results.get(Number(n)) || { status: "NOT RUN", evidence: setupError ? "see the setup error" : "an earlier step failed" };
    return { check: Number(n), name, status: r.status, evidence: redact(r.evidence) };
  });
  const passed = checks.filter((c) => c.status === "PASS").length;
  const report = {
    runId,
    auth: opts.auth,
    identity: opts.identity,
    backend: "<backend>",
    durationSeconds: Math.round((Date.now() - started) / 1000),
    passed,
    total: checks.length,
    ok: passed === checks.length,
    setupError: setupError ? redact(setupError) : undefined,
    checks,
    extras: extras.map((e) => ({ ...e, evidence: redact(e.evidence) })),
    requests: (requests || []).map((r) => ({
      phase: r.phase, method: r.method, service: r.service, path: r.path,
      status: r.failed ? `failed (${r.failed})` : r.status ?? "no answer", udanRealm: r.realm ? "yes" : "no",
      bearer: r.bearer ? "yes" : "no", clientSecretField: r.secretField ? "yes" : "no",
    })),
  };
  writeFileSync(join(outDir, "behaviour-check.json"), JSON.stringify(report, null, 2) + "\n");
  const cell = (s) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
  const md = [
    `# Behaviour check ${runId}`,
    "",
    `Auth driver \`${opts.auth}\`, identity \`${opts.identity}\`, backend \`<backend>\`, ${report.durationSeconds} s: **${passed}/${checks.length} pass**.`,
    setupError ? `\nSetup error: ${cell(redact(setupError))}\n` : "",
    "| # | Check | Result | Evidence |",
    "|---|---|---|---|",
    ...checks.map((c) => `| ${c.check} | ${cell(c.name)} | ${c.status} | ${cell(c.evidence)} |`),
    "",
    ...(extras.length ? [
      "Extra evidence (not one of the 14):",
      "",
      "| Extra | Result | Evidence |",
      "|---|---|---|",
      ...extras.map((e) => `| ${cell(e.name)} | ${e.status} | ${cell(redact(e.evidence))} |`),
      "",
    ] : []),
  ].join("\n");
  writeFileSync(join(outDir, "behaviour-check.md"), md);
  return report;
}

function finish(requests, code) {
  const report = writeReport(requests);
  log(`Behaviour check ${runId} (${opts.auth}, ${report.durationSeconds} s)`);
  if (setupError) log(`Setup error: ${setupError}`);
  for (const c of report.checks) log(`${c.status.padEnd(7)} ${String(c.check).padStart(2)} ${c.name} - ${c.evidence}`);
  for (const e of report.extras) log(`${e.status.padEnd(7)} +  ${e.name} - ${e.evidence}`);
  log(`${report.passed}/${report.total} pass. Report: ${join(outDir, "behaviour-check.md")}`);
  process.exit(code ?? (report.ok && report.extras.every((e) => e.status === "PASS") ? 0 : 1));
}

// ---- preflight: the backend answers at all ---------------------------------------------------------
try {
  const res = await fetch(`${apiPrefix}user/getsessionkey`, { signal: AbortSignal.timeout(5_000) });
  log(`backend answers: GET <backend>/api/user/getsessionkey -> ${res.status}`);
} catch (err) {
  setupError = `backend unreachable: no HTTP answer from ${apiPrefix} (${err.cause?.code || err.cause?.message || err.message}). Start the local stack (local-up.sh) and the Server (start-server.sh), or pass the right --backend.`;
  finish([], 3);
}

// ---- host page -----------------------------------------------------------------------------------
const server = createServer((req, res) => {
  res.setHeader("content-type", "text/html; charset=utf-8");
  res.end(req.url?.startsWith("/favicon") ? "" : fixture);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const pageOrigin = `http://127.0.0.1:${server.address().port}`;

// ---- browser -------------------------------------------------------------------------------------
const work = mkdtempSync(join(tmpdir(), "udan-behaviour-"));
// channel "chromium" = the new headless mode, which supports extensions (as smoke-extension.mjs).
const context = await chromium.launchPersistentContext(join(work, "profile"), {
  channel: "chromium",
  headless: !opts.headed,
  viewport: { width: 1280, height: 900 },
  args: [`--disable-extensions-except=${buildDir}`, `--load-extension=${buildDir}`],
});

// Every request to the backend, token service or Keycloak, with the phase it happened in.
let phase = "start";
const requests = [];
const services = []; // [prefix, name]
const serviceOf = (url) => services.find(([prefix]) => url.startsWith(prefix))?.[1];
const isKeycloak = (url) => serviceOf(url) === "keycloak" || /\/realms\/|\/protocol\/openid-connect/.test(url);
context.on("request", (req) => {
  const url = req.url();
  if (url.startsWith("data:") || url.startsWith("chrome-extension:") || url.startsWith(pageOrigin)) return;
  const service = serviceOf(url) || (isKeycloak(url) ? "keycloak" : null);
  if (!service) return;
  // long hex ids in a path (e.g. the hashed user id in /votes/...) are shortened, not reported
  const path = new URL(url).pathname.replace(/[0-9a-f]{32,}/gi, "<hash>");
  // header and body facts as yes/no only: the bearer token and the body are never kept
  requests.push({
    req, phase, service, method: req.method(), path, realm: Boolean(req.headers()["udan-realm"]),
    bearer: /^Bearer \S/.test(req.headers().authorization || ""), secretField: /client_?secret/i.test(req.postData() || ""),
  });
});
context.on("response", (res) => {
  const e = requests.find((r) => r.req === res.request());
  if (e) e.status = res.status();
});
context.on("requestfailed", (req) => {
  const e = requests.find((r) => r.req === req);
  if (e) e.failed = req.failure()?.errorText || "failed";
});
const consoleErrors = []; // { phase, text }
context.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push({ phase, text: msg.text().slice(0, 200) }); });
context.on("weberror", (err) => consoleErrors.push({ phase, text: `uncaught: ${String(err.error()?.message || err.error()).slice(0, 200)}` }));

const answered = (r) => r.status !== undefined || r.failed;
const ok = (r) => !r.failed && r.status >= 200 && r.status < 400;
const describe = (r) => `${r.method} ${r.path} ${r.failed ? `failed (${r.failed})` : r.status ?? "pending"}`;
const find = (pred) => requests.filter(pred);
const apiPath = (suffix) => (r) => r.service === "backend" && r.path.endsWith(suffix);

let page;
try {
  // 1 ------------------------------------------------------------------------------------------------
  phase = "load";
  const worker = context.serviceWorkers()[0] || (await context.waitForEvent("serviceworker", { timeout: STEP_MS }));
  const manifestVersion = await worker.evaluate(() => chrome.runtime.getManifest().version);
  // The worker applies the build config once it has chosen TEST or PROD (Background.ts).
  const cfg = await waitFor(
    () => worker.evaluate(() => {
      const c = globalThis.UDAGlobalConfig || {};
      if (!c.apiBaseUrl) return null;
      return {
        apiBaseUrl: c.apiBaseUrl, tokenUrl: c.tokenUrl || "", keycloakUrl: c.keycloakUrl || "",
        realm: c.realm || "", clientIdSet: Boolean(c.clientId), clientSecretSet: Boolean(c.clientSecret),
        environment: c.environment || "",
      };
    }),
    "the worker's build config (UDAGlobalConfig.apiBaseUrl)",
  );
  const origin = (u) => { try { return new URL(u).origin; } catch { return ""; } };
  if (cfg.tokenUrl) { hosts.push([origin(cfg.tokenUrl), "<token service>"]); services.push([cfg.tokenUrl.replace(/\/?$/, "/"), "token"]); }
  if (cfg.keycloakUrl) { hosts.push([origin(cfg.keycloakUrl), "<keycloak>"]); services.push([cfg.keycloakUrl.replace(/\/?$/, "/"), "keycloak"]); }
  services.push([apiPrefix, "backend"]);
  // the token service may share the backend host on another port: keep the longest prefix first
  services.sort((a, b) => b[0].length - a[0].length);
  pass(1, `worker running, manifest ${manifestVersion}, worker environment ${cfg.environment || "?"}`);

  const authNote = await driver.prepare({ worker, context });

  // 2 ------------------------------------------------------------------------------------------------
  page = await context.newPage();
  const hostConfig = { environment: "TEST", realm: cfg.realm };
  const pageUrl = `${pageOrigin}/?udaEnvironment=${encodeURIComponent(hostConfig.environment)}&udaRealm=${encodeURIComponent(hostConfig.realm)}`;
  await page.goto(pageUrl, { waitUntil: "load" });
  await page.waitForSelector("#udan-react-root", { state: "attached", timeout: STEP_MS });
  const shadow = await page.evaluate(() => Boolean(document.querySelector("#udan-react-root")?.shadowRoot));
  if (!shadow) throw new Error("#udan-react-root has no shadow root");
  pass(2, "#udan-react-root attached with a shadow root");
  const panel = page.locator("#udan-react-root");

  // 3 ------------------------------------------------------------------------------------------------
  // On load the panel asks the worker for the session; signed out, the worker gets a session key and
  // answers "login". Wait for that answer, then open the panel: the login screen must be shown.
  try {
    await waitFor(() => find(apiPath("/user/getsessionkey")).some(answered), "the load-time getsessionkey answer", 20_000);
  } catch { /* judged by check 5 */ }
  const signInButton = panel.getByRole("button", { name: "Sign in with Google" });
  if (!(await signInButton.isVisible())) {
    await panel.getByRole("button", { name: "Open UDAN panel" }).click({ timeout: STEP_MS });
  }
  await signInButton.waitFor({ state: "visible", timeout: STEP_MS });
  pass(3, `panel open, "Sign in with Google" shown (${authNote})`);
  await sleep(SETTLE_MS);

  // 4 ------------------------------------------------------------------------------------------------
  const loadErrors = consoleErrors.filter((e) => e.phase === "load");
  if (loadErrors.length) fail(4, `${loadErrors.length} console error(s): ${loadErrors.slice(0, 3).map((e) => e.text).join(" / ")}`);
  else pass(4, "no console errors in page or worker during load");

  // 5 ------------------------------------------------------------------------------------------------
  {
    const loadCalls = find((r) => r.phase === "load" && r.service === "backend");
    const reached = loadCalls.find((r) => ok(r));
    if (!cfg.apiBaseUrl.replace(/\/+$/, "").startsWith(apiPrefix.replace(/\/api\/$/, ""))) {
      fail(5, `the build's backend is not --backend (worker apiBaseUrl differs): rebuild with the right env or pass its URL`);
    } else if (!cfg.clientIdSet || !cfg.realm || (driver.secretExpected && !cfg.clientSecretSet)) {
      fail(5, `worker SDK not configured (realm ${cfg.realm ? "set" : "missing"}, clientId ${cfg.clientIdSet ? "set" : "missing"}, client secret ${cfg.clientSecretSet ? "set" : "missing"}): the SDK sends nothing`);
    } else if (!driver.secretExpected && cfg.clientSecretSet) {
      fail(5, "the worker SDK holds a client secret; this driver signs in without one");
    } else if (!reached) {
      fail(5, loadCalls.length ? `no 2xx: ${loadCalls.map(describe).join("; ")}` : "no request reached <backend>/api/ during load");
    } else {
      pass(5, `build default apiBaseUrl = <backend>; ${describe(reached)}${driver.secretExpected ? "" : "; no client secret in the worker config"}`);
    }
  }

  // 6 ------------------------------------------------------------------------------------------------
  {
    const page6 = await waitFor(
      () => page.evaluate(() => {
        const c = window.UDAGlobalConfig;
        return window.__udaHostConfig && c ? { environment: c.environment, realm: c.realm } : null;
      }),
      "the host page's UDAPluginSDK call after UDASdkReady",
      10_000,
    ).catch(() => null);
    const workerRealm = await (context.serviceWorkers()[0] || worker).evaluate(() => globalThis.UDAGlobalConfig?.realm || "");
    if (!page6) fail(6, "host page did not get to call UDAPluginSDK (no UDASdkReady?)");
    else if (page6.environment !== hostConfig.environment || page6.realm !== hostConfig.realm) {
      fail(6, `page world has environment ${page6.environment}, realm ${page6.realm}; the page asked for ${hostConfig.environment}, ${hostConfig.realm}`);
    } else if (workerRealm !== cfg.realm) {
      fail(6, `worker realm changed to ${workerRealm}; it must keep the build realm ${cfg.realm}`);
    } else {
      pass(6, `page world: environment ${page6.environment}, realm ${page6.realm} (set by the page); worker keeps the build realm ${workerRealm}`);
    }
  }

  // 7 ------------------------------------------------------------------------------------------------
  {
    const kc = find((r) => r.phase === "load" && r.service === "keycloak");
    if (kc.length) fail(7, `${kc.length} Keycloak request(s) on load: ${kc.slice(0, 3).map(describe).join("; ")}`);
    else pass(7, `0 Keycloak requests during load (${find((r) => r.phase === "load").length} backend/token requests)`);
  }

  // 8 ------------------------------------------------------------------------------------------------
  phase = "login";
  if (driver.beforeSignIn) extras.push(...(await driver.beforeSignIn({ context, page, panel })));
  const who = await driver.signIn({ context, page, panel, identity: opts.identity });
  const recordButton = panel.getByRole("button", { name: "Record" });
  await recordButton.waitFor({ state: "visible", timeout: STEP_MS }).catch(() => {});
  {
    const want = driver.loginCalls;
    await waitFor(() => want.every(([, pred]) => requests.some((r) => pred(r) && answered(r))), "the login calls", 20_000).catch(() => {});
    const problems = [];
    const seen = [];
    for (const [name, pred, statuses, needsRealm] of want) {
      const hits = requests.filter(pred);
      const good = hits.find((r) => statuses.includes(r.status));
      if (!good) problems.push(`${name}: ${hits.length ? hits.map(describe).join(", ") : "no request"}`);
      else {
        seen.push(`${name} ${good.status}${good.realm ? " +realm" : ""}${good.bearer ? " +bearer" : ""}`);
        if (needsRealm && !good.realm) problems.push(`${name} without UDAN-Realm`);
      }
    }
    for (const [name, pred] of driver.forbiddenLoginCalls || []) {
      const hits = requests.filter(pred);
      if (hits.length) problems.push(`${name} must not be called: ${hits.map(describe).join(", ")}`);
      else seen.push(`no ${name}`);
    }
    if (!(await recordButton.isVisible())) problems.push("panel did not reach the signed-in view (no Record button)");
    if (problems.length) fail(8, problems.join("; "));
    else pass(8, `${seen.join(", ")}; signed in as ${who}`);
  }

  // 9 (list half; the filter half runs after the save below) ------------------------------------------
  phase = "search";
  let listCall;
  try {
    listCall = await waitFor(() => find(apiPath("/search/all")).find((r) => r.status === 200), "GET /api/search/all 200", 20_000);
  } catch {
    fail(9, `no GET /api/search/all 200: ${find(apiPath("/search/all")).map(describe).join("; ") || "no request"}`);
  }

  // 10 -----------------------------------------------------------------------------------------------
  phase = "record";
  const openPanel = async () => {
    const opener = panel.getByRole("button", { name: "Open UDAN panel" });
    if (await opener.isVisible()) await opener.click();
  };
  const label = `pk e2e ${opts.identity} ${runId}`;
  try {
    await recordButton.click({ timeout: STEP_MS });
    await panel.getByRole("button", { name: "Start" }).click({ timeout: STEP_MS });
    await sleep(4_500); // 3 s countdown, then the SDK listens for clicks
    // the SDK keeps the clicks locally; clickednode goes out when the recording is saved (check 11)
    for (const selector of ["#sanity-button", "#second-button"]) {
      await page.click(selector);
      await sleep(800);
      await openPanel();
      await panel.getByRole("button", { name: "Save step" }).click({ timeout: STEP_MS });
      await sleep(1_500);
    }
    await panel.getByRole("button", { name: "Finish Recording" }).click({ timeout: STEP_MS });
    await panel.getByPlaceholder("Enter Label").first().waitFor({ state: "visible", timeout: STEP_MS });
    // the final save screen lists the recorded steps ("1. Sample button", "2. Second button")
    await panel.getByText("Recorded Steps").waitFor({ state: "visible", timeout: STEP_MS });
    const listed = await waitFor(async () => {
      const items = (await panel.locator("li").allInnerTexts()).map((t) => t.trim());
      return items.some((t) => t.includes("Second button")) ? items : null;
    }, "the two recorded steps", 10_000).catch(async () => (await panel.locator("li").allInnerTexts()).map((t) => t.trim()));
    const steps = ["Sample button", "Second button"].filter((s) => listed.some((t) => t.includes(s)));
    if (steps.length === 2) pass(10, `two clicks recorded; steps listed: ${listed.filter((t) => /button/.test(t)).join(", ")}`);
    else fail(10, `steps listed: ${listed.join(", ") || "none"}`);
  } catch (err) {
    fail(10, `recording flow broke: ${err.message.split("\n")[0]}`);
  }

  // 11 -----------------------------------------------------------------------------------------------
  phase = "save";
  try {
    await panel.getByPlaceholder("Enter Label").first().fill(label);
    await panel.getByRole("button", { name: "save", exact: true }).click({ timeout: STEP_MS });
    await waitFor(() => find(apiPath("/clickevents/recordsequencedata")).some(answered), "recordsequencedata", 20_000).catch(() => {});
    const nodes = find(apiPath("/clickevents/clickednode"));
    const seq = find(apiPath("/clickevents/recordsequencedata"));
    const nodesOk = nodes.filter((r) => r.status === 200).length;
    const seqOk = seq.find((r) => r.status === 200);
    if (nodesOk === 2 && nodes.length === 2 && seqOk) pass(11, `clickednode x2 200, recordsequencedata 200 (label "${label}")`);
    else fail(11, `clickednode: ${nodes.map(describe).join(", ") || "none"}; recordsequencedata: ${seq.map(describe).join(", ") || "none"}`);
  } catch (err) {
    fail(11, `save flow broke: ${err.message.split("\n")[0]}`);
  }

  // 12 + the filter half of 9 ----------------------------------------------------------------------------
  phase = "search";
  const viewButton = panel.getByRole("button", { name: `View ${label}` });
  const searchFor = async (query) => {
    const box = panel.getByPlaceholder("Search").first();
    const before = requests.length;
    await box.fill(query);
    await box.press("Enter");
    const call = await waitFor(
      () => requests.slice(before).find((r) => apiPath("/search/all")(r) && answered(r) && r.req.url().includes(encodeURIComponent(query.split(" ")[0]))),
      `search for "${query}"`,
      15_000,
    ).catch(() => null);
    await viewButton.waitFor({ state: "visible", timeout: 10_000 }).catch(() => {});
    return { call, shown: await viewButton.isVisible() };
  };
  try {
    await viewButton.waitFor({ state: "visible", timeout: STEP_MS });
    const listed = "listed after save";
    const full = await searchFor(label);
    if (full.call?.status === 200 && full.shown) pass(12, `${listed}; search for the full label: ${describe(full.call)}, card shown`);
    else fail(12, `${listed}; search for the full label: ${full.call ? describe(full.call) : "no search call"}, card ${full.shown ? "shown" : "not shown"}`);
  } catch (err) {
    fail(12, `saved recording "${label}" not listed: ${err.message.split("\n")[0]}`);
  }
  if (!results.has(9)) {
    try {
      const partial = await searchFor(runId);
      if (partial.call?.status === 200 && partial.shown) {
        pass(9, `list ${describe(listCall)}; text filter "${runId}" ${describe(partial.call)} shows the saved recording`);
      } else {
        fail(9, `list ${describe(listCall)}; text filter "${runId}": ${partial.call ? describe(partial.call) : "no search call"}, card ${partial.shown ? "shown" : "not shown"}`);
      }
    } catch (err) {
      fail(9, `text filter broke: ${err.message.split("\n")[0]}`);
    }
  }

  // 13 -----------------------------------------------------------------------------------------------
  phase = "playback";
  try {
    await viewButton.click({ timeout: STEP_MS });
    await panel.getByText("Steps", { exact: true }).waitFor({ state: "visible", timeout: STEP_MS });
    await panel.getByRole("button", { name: "Play", exact: true }).click({ timeout: STEP_MS });
    const done = page.getByText(/Playback completed/).first();
    await done.waitFor({ state: "visible", timeout: 45_000 });
    const userclick = (r) => r.phase === "playback" && apiPath("/clickevents/userclick")(r);
    await waitFor(() => find(userclick).some(answered), "userclick", 10_000).catch(() => {});
    const clicks = find(userclick);
    const good = clicks.filter((r) => r.status === 204);
    if (good.length >= 1 && good.length === clicks.length) pass(13, `"Playback completed" shown; userclick during playback ${good.length}x 204`);
    else fail(13, `"Playback completed" shown, but userclick during playback: ${clicks.map(describe).join(", ") || "none"}`);
  } catch (err) {
    fail(13, `playback did not complete: ${err.message.split("\n")[0]}; userclick: ${find(apiPath("/clickevents/userclick")).map(describe).join(", ") || "none"}`);
  }

  // 14 -----------------------------------------------------------------------------------------------
  phase = "end";
  await sleep(1_000);
  {
    const bad = requests.filter((r) => r.failed || (r.status !== undefined && r.status >= 400));
    const pending = requests.filter((r) => !answered(r));
    const withSecret = requests.filter((r) => r.secretField);
    if (bad.length) fail(14, `${bad.length} failed call(s): ${bad.slice(0, 5).map(describe).join("; ")}`);
    else if (!driver.secretExpected && withSecret.length) fail(14, `${withSecret.length} call(s) carry a client secret field: ${withSecret.slice(0, 3).map(describe).join("; ")}`);
    else {
      const noRealm = requests.filter((r) => r.service !== "keycloak" && !r.realm).length;
      pass(14, `${requests.length} backend/token calls, none failed${pending.length ? ` (${pending.length} still pending at the end)` : ""}; ${noRealm} without UDAN-Realm; ${withSecret.length} with a client secret field`);
    }
  }

  if (driver.extras) {
    phase = "extra";
    try {
      // the panel's own logout: Settings menu > Sign Out
      const uiSignOut = async () => {
        const opener = panel.getByRole("button", { name: "Open UDAN panel" });
        if (await opener.isVisible()) await opener.click();
        await panel.getByRole("button", { name: "Settings" }).click({ timeout: STEP_MS });
        await panel.getByRole("button", { name: "Sign Out" }).click({ timeout: STEP_MS });
      };
      const signInShown = () => panel.getByRole("button", { name: "Sign in with Google" }).waitFor({ state: "visible", timeout: 10_000 }).then(() => true, () => false);
      extras.push(...(await driver.extras({ context, page, panel, find, answered, describe, uiSignOut, signInShown })));
    } catch (err) {
      extras.push({ name: "driver extras", status: "FAIL", evidence: `stopped: ${err.message.split("\n")[0]}` });
      mkdirSync(outDir, { recursive: true });
      await page.screenshot({ path: join(outDir, "failure.png") }).catch(() => {});
    }
  }
} catch (err) {
  setupError = `run stopped: ${err.message.split("\n")[0]}`;
} finally {
  if (results.size < 14 || [...results.values()].some((r) => r.status !== "PASS")) {
    mkdirSync(outDir, { recursive: true });
    await page?.screenshot({ path: join(outDir, "failure.png") }).catch(() => {});
  }
  await context.close().catch(() => {});
  server.close();
  rmSync(work, { recursive: true, force: true });
}
finish(requests);
