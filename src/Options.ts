/**
 * Options page: one select (Automatic / TEST / PROD), saved to chrome.storage.local as
 * `udanEnvironment`. The background worker watches the key and re-applies the environment.
 */
import { ENVIRONMENT_STORAGE_KEY, normalizeEnvironment } from "./config/runtimeEnvironment";

declare const chrome: any;

const select = document.getElementById("environment") as HTMLSelectElement;
const effective = document.getElementById("effective") as HTMLElement;
const status = document.getElementById("status") as HTMLElement;

async function showEffective() {
    try {
        const info = await chrome.runtime.sendMessage({ action: "UDAGetEnvironment" });
        effective.textContent = `In use: ${info.environment} (${info.source}${info.installType ? `, install type ${info.installType}` : ""}).`;
    } catch {
        effective.textContent = "In use: unknown (the background worker did not answer).";
    }
}

async function load() {
    const stored = (await chrome.storage.local.get(ENVIRONMENT_STORAGE_KEY))[ENVIRONMENT_STORAGE_KEY];
    select.value = normalizeEnvironment(stored) ?? "";
    await showEffective();
}

select.addEventListener("change", async () => {
    const value = normalizeEnvironment(select.value);
    if (value) await chrome.storage.local.set({ [ENVIRONMENT_STORAGE_KEY]: value });
    else await chrome.storage.local.remove(ENVIRONMENT_STORAGE_KEY);
    status.textContent = "Saved. Open pages pick it up within a moment.";
    setTimeout(showEffective, 300);
});

load();
