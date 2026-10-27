// Sanity check of a built extension zip (called by smoke-extension.sh; read its header).
// Playwright loads the unpacked zip into Chromium and opens a local host page. Unauthenticated
// and read-only. The test backend URL is never printed (public repo, public run logs): every
// message shows "<test backend>" and "<prod backend>" instead.
//   node scripts/ci/smoke-extension.mjs <zip> <test-base-url>
// Env: BASE_PROD_URL, SMOKE_ATTEMPTS (3), SMOKE_WAIT seconds (3), GITHUB_STEP_SUMMARY.
import { execFileSync } from "node:child_process";
import { appendFileSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const [zipArg, baseArg] = process.argv.slice(2);
if (!zipArg || !baseArg) {
  console.error("usage: smoke-extension.mjs <zip> <test-base-url>");
  process.exit(2);
}
const ATTEMPTS = Number(process.env.SMOKE_ATTEMPTS || 3);
const WAIT_MS = Number(process.env.SMOKE_WAIT || 3) * 1000;
const STEP_MS = 20_000; // longest wait for one observation inside one try

const here = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(join(here, "fixtures", "host-page.html"));

// BASE_TEST_URL includes /api; accept it with or without.
const testUrl = new URL(baseArg.replace(/\/+$/, ""));
const apiPrefix = `${testUrl.origin}${testUrl.pathname.replace(/\/api$/, "")}/api/`.replace(/\/{2,}api/, "/api");
const prodOrigin = process.env.BASE_PROD_URL ? new URL(process.env.BASE_PROD_URL).origin : "";

// Output never names a backend host.
const redact = (text) => {
  let out = String(text);
  for (const [origin, label] of [[testUrl.origin, "<test backend>"], [prodOrigin, "<prod backend>"]]) {
    if (origin) out = out.split(origin).join(label).split(new URL(origin).host).join(label);
  }
  return out;
};
const log = (line = "") => console.log(redact(line));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- unpack -------------------------------------------------------------------------------
const work = mkdtempSync(join(tmpdir(), "udan-smoke-"));
const extDir = join(work, "ext");
execFileSync("unzip", ["-q", resolve(zipArg), "-d", extDir]);
const manifest = JSON.parse(readFileSync(join(extDir, "manifest.json"), "utf8"));
const buildInfo = JSON.parse(readFileSync(join(extDir, "build-info.json"), "utf8"));
// Builds with the runtime environment (C04) carry this event name; older ones call no backend.
const hasRuntimeEnv = readdirSync(join(extDir, "assets"))
  .filter((f) => f.endsWith(".js"))
  .some((f) => readFileSync(join(extDir, "assets", f), "utf8").includes("UDASdkReady"));

// ---- local host page ----------------------------------------------------------------------
const server = createServer((req, res) => {
  res.setHeader("content-type", "text/html; charset=utf-8");
  res.end(req.url?.startsWith("/favicon") ? "" : fixture);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const pageUrl = `http://127.0.0.1:${server.address().port}/`; // matches "*://*/*"

// ---- browser ------------------------------------------------------------------------------
// channel "chromium" = the new headless mode, which supports extensions.
const context = await chromium.launchPersistentContext(join(work, "profile"), {
  channel: "chromium",
  headless: true,
  args: [`--disable-extensions-except=${extDir}`, `--load-extension=${extDir}`],
});

const seen = []; // { url, status?, type?, failed? }
context.on("request", (r) => seen.push({ url: r.url(), req: r }));
context.on("response", (r) => {
  const e = seen.find((s) => s.req === r.request());
  if (e) { e.status = r.status(); e.type = (r.headers()["content-type"] || "").toLowerCase(); }
});
context.on("requestfailed", (r) => {
  const e = seen.find((s) => s.req === r);
  if (e) e.failed = r.failure()?.errorText || "failed";
});
await context.addInitScript(() => {
  window.addEventListener("UDASdkReady", (e) => { window.__udaReady = e.detail || true; });
});

const page = await context.newPage();
page.on("pageerror", () => {}); // host-page noise is not a check

// ---- checks -------------------------------------------------------------------------------
class Skip extends Error {}
const results = [];
let failures = 0;

async function check(name, fn) {
  let why = "";
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const detail = await fn(attempt);
      results.push({ name, status: "PASS", detail: detail || "" });
      return;
    } catch (err) {
      if (err instanceof Skip) { results.push({ name, status: "SKIP", detail: err.message }); return; }
      why = err.message;
      if (attempt < ATTEMPTS) await sleep(WAIT_MS);
    }
  }
  failures++;
  results.push({ name, status: "FAIL", detail: why });
}

async function waitFor(fn, what, ms = STEP_MS) {
  const end = Date.now() + ms;
  for (;;) {
    const v = await fn();
    if (v) return v;
    if (Date.now() > end) throw new Error(`timeout waiting for ${what}`);
    await sleep(250);
  }
}

let worker;
let loaded = false;
async function openHostPage(attempt) {
  if (!loaded || attempt > 1) {
    await page.goto(pageUrl, { waitUntil: "load" });
    loaded = true;
  }
}

try {
  await check("1 extension loads, version matches build-info", async () => {
    worker = context.serviceWorkers()[0] || (await context.waitForEvent("serviceworker", { timeout: STEP_MS }));
    const running = await worker.evaluate(() => chrome.runtime.getManifest().version);
    if (running !== buildInfo.version) throw new Error(`manifest version ${running}, build-info says ${buildInfo.version}`);
    if (manifest.version !== buildInfo.version) throw new Error(`zip manifest ${manifest.version}, build-info ${buildInfo.version}`);
    return `version ${running}`;
  });

  await check("2 panel mounts on a matching page", async (attempt) => {
    await openHostPage(attempt);
    await page.waitForSelector("#udan-react-root", { state: "attached", timeout: STEP_MS });
    return "#udan-react-root present";
  });

  await check("3 TEST backend answers (not HTML), no PROD call", async (attempt) => {
    if (!hasRuntimeEnv) throw new Skip("skipped: needs C04 (this build calls no backend)");
    await openHostPage(attempt);
    if (prodOrigin) {
      const prod = seen.find((s) => s.url.startsWith(`${prodOrigin}/`));
      if (prod) throw new Error(`a request went to the PROD backend: ${prod.url}`);
    }
    // Any one answer from the Server passes: 2xx or 401 that is not the HTML fallback of nginx or a
    // SPA. The only call the extension makes without a login (GET /api/user/getsessionkey) answers
    // text/plain, so JSON is not required.
    const answers = () => seen.filter((s) => s.url.startsWith(apiPrefix) && (s.status !== undefined || s.failed));
    const good = (s) => ((s.status >= 200 && s.status < 300) || s.status === 401) && !s.type.includes("html");
    const describe = (s) => `${s.req.method()} ${new URL(s.url).pathname} ${s.failed ? `failed (${s.failed})` : `${s.status} '${s.type}'`}`;
    try {
      await waitFor(() => answers().some(good), "an answer from the Server", answers().length ? 8_000 : STEP_MS);
    } catch {
      const got = answers();
      if (got.length === 0) throw new Error("no request reached <test backend>/api/ (the build's TEST URL may differ from the one given)");
      if (got.some((s) => s.status === 403)) throw new Error("403 from the TEST backend: TEST backend CORS (DESIGN F9), it rejects browser origins");
      const failed = got.some((s) => s.failed) ? " A failed request is often a CORS rejection: see TEST backend CORS (DESIGN F9)." : "";
      throw new Error(`no usable answer; saw: ${[...new Set(got.map(describe))].slice(0, 5).join("; ")}.${failed}`);
    }
    const hit = answers().find(good);
    return `${hit.req.method()} ${new URL(hit.url).pathname} ${hit.status} ${hit.type}`;
  });

  await check("4 TEST badge shown, UDASdkReady fired", async (attempt) => {
    if (!hasRuntimeEnv) throw new Skip("skipped: needs C04");
    await openHostPage(attempt);
    const ready = await waitFor(() => page.evaluate(() => window.__udaReady), "UDASdkReady");
    const badge = await worker.evaluate(() => chrome.action.getBadgeText({}));
    if (badge !== "TEST") throw new Error(`toolbar badge is '${badge}', want 'TEST'`);
    return `UDASdkReady ${JSON.stringify(ready)}, toolbar badge TEST`;
  });
} finally {
  await context.close().catch(() => {});
  server.close();
  rmSync(work, { recursive: true, force: true });
}

// ---- report -------------------------------------------------------------------------------
const icon = { PASS: "✅ PASS", SKIP: "⏭️ SKIP", FAIL: "❌ FAIL" };
log(`Sanity check of extension ${buildInfo.version} (${buildInfo.version_name}) against <test backend>`);
for (const r of results) log(`${r.status.padEnd(4)} ${r.name}${r.detail ? ` - ${r.detail}` : ""}`);

if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = results.map((r) => `| ${r.name} | ${icon[r.status]} | ${r.detail.replace(/\|/g, "\\|")} |`);
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    redact(`### Extension sanity check\n\nBuild ${buildInfo.version} (${buildInfo.version_name}), Chromium via Playwright, unauthenticated.\n\n| Check | Result | Detail |\n|---|---|---|\n${rows.join("\n")}\n`)
  );
}
if (failures > 0) {
  console.error(redact(`Sanity check FAILED: ${failures} check(s). The prerelease is already published; fix forward or redeploy the previous version (rollback).`));
  process.exit(1);
}
log("Sanity check passed (skips are not failures)");
