/**
 * Options page: one select (Automatic / TEST / PROD), saved to chrome.storage.local as
 * `udanEnvironment`. The background worker watches the key and re-applies the environment.
 * A build with the TEST tier stamp (`tier.json`, TEST store item) is locked to TEST: the PROD
 * choice is removed here and the worker ignores a stored PROD (rules: config/runtimeEnvironment.ts).
 */
import { ENVIRONMENT_STORAGE_KEY, normalizeEnvironment } from "./config/runtimeEnvironment";

declare const chrome: any;

const select = document.getElementById("environment") as HTMLSelectElement;
const effective = document.getElementById("effective") as HTMLElement;
const status = document.getElementById("status") as HTMLElement;
const lockNote = document.getElementById("lock-note") as HTMLElement;

/** Hides the PROD choice when the build is stamped TEST. */
function lockToTest() {
    select.querySelector('option[value="PROD"]')?.remove();
    const automatic = select.querySelector('option[value=""]');
    if (automatic) automatic.textContent = "Automatic (this build: TEST)";
    lockNote.textContent = "This is the TEST build of the extension. It always uses TEST and cannot be switched to PROD.";
}

async function showEffective() {
    try {
        const info = await chrome.runtime.sendMessage({ action: "UDAGetEnvironment" });
        const stamp = normalizeEnvironment(info.tierStamp);
        if (stamp === "TEST") lockToTest();
        else if (stamp) select.querySelector('option[value=""]')!.textContent = `Automatic (this build: ${stamp})`;
        effective.textContent = `In use: ${info.environment} (${info.source}${info.installType ? `, install type ${info.installType}` : ""}).`;
    } catch {
        effective.textContent = "In use: unknown (the background worker did not answer).";
    }
}

async function load() {
    const stored = (await chrome.storage.local.get(ENVIRONMENT_STORAGE_KEY))[ENVIRONMENT_STORAGE_KEY];
    await showEffective(); // may remove the PROD option (TEST stamp)
    select.value = normalizeEnvironment(stored) ?? "";
    if (select.selectedIndex < 0) select.value = ""; // a stored PROD on a locked build shows as Automatic
}

select.addEventListener("change", async () => {
    const value = normalizeEnvironment(select.value);
    if (value) await chrome.storage.local.set({ [ENVIRONMENT_STORAGE_KEY]: value });
    else await chrome.storage.local.remove(ENVIRONMENT_STORAGE_KEY);
    status.textContent = "Saved. Open pages pick it up within a moment.";
    setTimeout(showEffective, 300);
});

load();
