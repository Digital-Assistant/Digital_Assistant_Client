// Capture the real-UI store screenshots from a built extension (1280x800).
//   npm run build            (any build; the capture only needs the unpacked folder)
//   node store/listing/capture-screenshots.mjs <build-dir> [<out-dir>]
// What it does: loads <build-dir> unpacked into Chromium (Playwright), serves the synthetic
// page demo-page.html from 127.0.0.1 (the content scripts only run on http(s) pages, so file://
// would show no panel) and screenshots the page and the signed-out panel. Every request other than
// that page is aborted and listed; the run fails if the extension tried anything else than the
// build's own configured backend URLs, so nothing can reach a real backend, Keycloak, TEST or PROD.
// Build it with placeholder URLs (see README.md) so the aborted requests go nowhere anyway.
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const here = dirname(fileURLToPath(import.meta.url));
if (!process.argv[2]) { console.error("usage: capture-screenshots.mjs <build-dir> [<out-dir>]"); process.exit(2); }
const buildDir = resolve(process.argv[2]);
const outDir = resolve(process.argv[3] || here);

const page_html = readFileSync(join(here, "demo-page.html"));
const server = createServer((_req, res) => { res.setHeader("content-type", "text/html; charset=utf-8"); res.end(page_html); });
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const pageOrigin = `http://127.0.0.1:${server.address().port}`;

const profile = mkdtempSync(join(tmpdir(), "udan-shot-"));
const context = await chromium.launchPersistentContext(profile, {
  channel: "chromium",
  headless: true,
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  args: [`--disable-extensions-except=${buildDir}`, `--load-extension=${buildDir}`],
});

// Allow only the local page itself and the browser's internal schemes; abort and record the rest.
const aborted = [];
await context.route(
  (url) => !(url.origin === pageOrigin || /^(chrome-extension|about|blob|data):$/.test(url.protocol)),
  (route) => { aborted.push(route.request().url()); route.abort(); },
);

try {
  const page = await context.newPage();
  await page.goto(`${pageOrigin}/`, { waitUntil: "load" });
  await page.waitForSelector("#udan-react-root", { state: "attached", timeout: 20_000 });
  const button = page.locator("#udan-react-root >> text=UDAN").first();
  await button.waitFor({ state: "visible", timeout: 20_000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(outDir, "03-page-with-udan-button-1280x800.png") });

  await button.click();
  await page.getByText("Sign in with Google").first().waitFor({ state: "visible", timeout: 20_000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(outDir, "02-panel-sign-in-1280x800.png") });
} finally {
  await context.close().catch(() => {});
  server.close();
  rmSync(profile, { recursive: true, force: true });
}

// Report only hosts of aborted requests (placeholders in a placeholder build).
const hosts = [...new Set(aborted.map((u) => new URL(u).host))];
console.log(`aborted ${aborted.length} non-local request(s); hosts: ${hosts.join(", ") || "none"}`);
const unexpected = hosts.filter((h) => h !== "127.0.0.1:9");
if (unexpected.length) { console.error(`unexpected host(s): ${unexpected.join(", ")}`); process.exit(1); }
