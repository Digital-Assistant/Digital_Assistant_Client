// Behaviour check: the 14 checks of the extension against a running backend (local stack).
// Loads a ready, unpacked build in Chromium (playwright-core), opens the host-page fixture from a
// local server, signs in through an auth driver, records a two-step recording, saves, finds and plays
// it. Knows nothing about secrets: the build it is given must already be able to sign in.
//   node scripts/e2e/behaviour-check.mjs --build <dir> --backend <base-url>
//        [--auth chrome-identity] [--identity <label>] [--out <dir>] [--headed]
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
  "usage: behaviour-check.mjs --build <dir> --backend <base-url> [--auth chrome-identity] [--identity <label>] [--out <dir>] [--headed]";
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
// runs from the open panel's login screen and returns when sign-in was started.
// keycloak-pkce is the seam PK11 fills in (Keycloak authorization code + PKCE in the worker).
const authDrivers = {
  "chrome-identity": {
    // The worker signs in with chrome.identity.getProfileUserInfo (src/browser-auth/LoginWithBrowser.ts).
    // Headless Chromium has no Chrome profile, so the runner replaces that one function in the
    // running worker with a stub that returns a labelled test identity. Chosen over patching the
    // build: the build under test stays byte-for-byte what was built, and nothing in the repo
    // carries test code. The stub answers "not signed in" (empty id and email, as Chrome does)
    // until signIn() sets the identity. If Chrome restarts the worker the stub is gone and the real
    // function also answers "not signed in", so signIn() installs it again on the current worker.
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
      await panel.getByRole("button", { name: "Sign in with UDAN" }).click();
      return `test identity ${identity}@example.test`;
    },
  },
  "keycloak-pkce": {
    // To fill in: prepare() clears any stored session; signIn() clicks Sign-in, completes the
    // Keycloak login for the test identity in the auth window, and returns. Then drop `todo`.
    todo: "auth driver keycloak-pkce is not implemented yet (the PKCE sign-in phase adds it)",
    async prepare() { throw new Error(this.todo); },
    async signIn() { throw new Error(this.todo); },
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
  8: "Login: getsessionkey 200, checkauthid 200, POST /user/token 201, checkusersession 200, with UDAN-Realm header",
  9: "Search list GET /api/search/all 200; text filter shows a saved recording",
  10: "Record two clicks; steps listed",
  11: "Save: clickednode x2 200, recordsequencedata 200",
  12: "Saved recording listed and searchable",
  13: "Playback navigates the steps, userclick 204, ends on \"Playback completed\"",
  14: "No failed backend calls in the whole run",
};
const results = new Map(); // number -> { status, evidence }
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
    requests: (requests || []).map((r) => ({
      phase: r.phase, method: r.method, service: r.service, path: r.path,
      status: r.failed ? `failed (${r.failed})` : r.status ?? "no answer", udanRealm: r.realm ? "yes" : "no",
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
  ].join("\n");
  writeFileSync(join(outDir, "behaviour-check.md"), md);
  return report;
}

function finish(requests, code) {
  const report = writeReport(requests);
  log(`Behaviour check ${runId} (${opts.auth}, ${report.durationSeconds} s)`);
  if (setupError) log(`Setup error: ${setupError}`);
  for (const c of report.checks) log(`${c.status.padEnd(7)} ${String(c.check).padStart(2)} ${c.name} - ${c.evidence}`);
  log(`${report.passed}/${report.total} pass. Report: ${join(outDir, "behaviour-check.md")}`);
  process.exit(code ?? (report.ok ? 0 : 1));
}

// ---- preflight: the backend answers at all ---------------------------------------------------------
try {
  const res = await fetch(`${apiPrefix}user/getsessionkey`, { signal: AbortSignal.timeout(5_000) });
  log(`backend answers: GET <backend>/api/user/getsessionkey -> ${res.status}`);
} catch (err) {
  setupError = `backend unreachable: no HTTP answer from ${apiPrefix} (${err.cause?.code || err.name}). Start the local stack (local-up.sh) and the Server (start-server.sh), or pass the right --backend.`;
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
  const u = new URL(url);
  requests.push({ req, phase, service, method: req.method(), path: u.pathname, realm: Boolean(req.headers()["udan-realm"]) });
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
  const signInButton = panel.getByRole("button", { name: "Sign in with UDAN" });
  if (!(await signInButton.isVisible())) {
    await panel.getByRole("button", { name: "Open UDAN panel" }).click({ timeout: STEP_MS });
  }
  await signInButton.waitFor({ state: "visible", timeout: STEP_MS });
  pass(3, `panel open, "Sign in with UDAN" shown (${authNote})`);
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
    } else if (!cfg.clientIdSet || !cfg.clientSecretSet || !cfg.realm) {
      fail(5, `worker SDK not configured (realm ${cfg.realm ? "set" : "missing"}, clientId ${cfg.clientIdSet ? "set" : "missing"}, client secret ${cfg.clientSecretSet ? "set" : "missing"}): the SDK sends nothing`);
    } else if (!reached) {
      fail(5, loadCalls.length ? `no 2xx: ${loadCalls.map(describe).join("; ")}` : "no request reached <backend>/api/ during load");
    } else {
      pass(5, `build default apiBaseUrl = <backend>; ${describe(reached)}`);
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
  const who = await driver.signIn({ context, page, panel, identity: opts.identity });
  const recordButton = panel.getByRole("button", { name: "Record" });
  await recordButton.waitFor({ state: "visible", timeout: STEP_MS }).catch(() => {});
  {
    const want = [
      ["getsessionkey", (r) => apiPath("/user/getsessionkey")(r), [200]],
      ["checkauthid", (r) => apiPath("/user/checkauthid")(r), [200]],
      ["POST /user/token", (r) => r.service === "token" && r.method === "POST" && r.path.endsWith("/user/token"), [201]],
      ["checkusersession", (r) => apiPath("/user/checkusersession")(r), [200]],
    ];
    await waitFor(() => want.every(([, pred]) => requests.some((r) => pred(r) && answered(r))), "the login calls", 20_000).catch(() => {});
    const problems = [];
    const seen = [];
    for (const [name, pred, statuses] of want) {
      const hits = requests.filter(pred);
      const good = hits.find((r) => statuses.includes(r.status));
      if (!good) problems.push(`${name}: ${hits.length ? hits.map(describe).join(", ") : "no request"}`);
      else {
        seen.push(`${name} ${good.status}${good.realm ? " +realm" : ""}`);
        if (!good.realm) problems.push(`${name} without UDAN-Realm`);
      }
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
    for (const selector of ["#sanity-button", "#second-button"]) {
      const before = find(apiPath("/clickevents/clickednode")).length;
      await page.click(selector);
      await waitFor(() => find(apiPath("/clickevents/clickednode")).length > before, `clickednode after ${selector}`, 15_000).catch(() => {});
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
    await waitFor(() => find(apiPath("/clickevents/userclick")).some(answered), "userclick", 10_000).catch(() => {});
    const clicks = find(apiPath("/clickevents/userclick"));
    const good = clicks.filter((r) => r.status === 204);
    if (good.length >= 1 && good.length === clicks.length) pass(13, `"Playback completed" shown; userclick ${good.length}x 204`);
    else fail(13, `"Playback completed" shown, but userclick: ${clicks.map(describe).join(", ") || "none"}`);
  } catch (err) {
    fail(13, `playback did not complete: ${err.message.split("\n")[0]}; userclick: ${find(apiPath("/clickevents/userclick")).map(describe).join(", ") || "none"}`);
  }

  // 14 -----------------------------------------------------------------------------------------------
  phase = "end";
  await sleep(1_000);
  {
    const bad = requests.filter((r) => r.failed || (r.status !== undefined && r.status >= 400));
    const pending = requests.filter((r) => !answered(r));
    if (bad.length) fail(14, `${bad.length} failed call(s): ${bad.slice(0, 5).map(describe).join("; ")}`);
    else {
      const noRealm = requests.filter((r) => r.service !== "keycloak" && !r.realm).length;
      pass(14, `${requests.length} backend/token calls, none failed${pending.length ? ` (${pending.length} still pending at the end)` : ""}; ${noRealm} without UDAN-Realm`);
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
