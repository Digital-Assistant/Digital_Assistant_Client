/**
 * Page side of the runtime environment (TEST or PROD). Rules: ../config/runtimeEnvironment.ts.
 *
 * Flow: the page asks the content script (`UDAGetEnvironment` event), which asks the
 * background worker; the answer comes back as `UDAEnvironmentData` and is applied with the
 * SDK's AppConfig, together with the build-config URLs of that environment. A host page that
 * sets keys itself through window.UDAPluginSDK(...) always wins: keys it has set are tracked
 * by wrapping UDAPluginSDK and never overwritten. When the page sets `environment`, the
 * build-config URLs are re-applied for it, and the content script tells the background
 * (`UDAPageEnvironment`) so token and session calls use the same environment.
 *
 * Fires `UDASdkReady` on window once the SDK is configured (documented for host pages).
 */

// AuthService assigns global.UDAPluginSDK / UDAGlobalConfig at load: it must run first.
import "../AuthService";
import { AppConfig } from "@udan/digital-assistant-sdk";
import {
    allowedEnvironment,
    applyBuildConfig,
    normalizeEnvironment,
    type Environment,
    type EnvironmentChoice,
    type EnvironmentSource,
} from "../config/runtimeEnvironment";

const g = globalThis as any;

const pageSetKeys = new Set<string>();
const appliedKeys = new Set<string>();
let backendChoice: EnvironmentChoice | undefined;
/** Tier stamp of the installed extension (TEST store build = locked to TEST); undefined = none. */
let tierStamp: Environment | undefined;
let installed = false;
let ready: Promise<void> | undefined;

/** Environment the SDK uses right now (the SDK reads UDAGlobalConfig per request). */
export function getEffectiveEnvironment(): Environment {
    return normalizeEnvironment(g.UDAGlobalConfig?.environment) ?? "PROD";
}

export function getEnvironmentSource(): EnvironmentSource {
    if (pageSetKeys.has("environment")) return "page";
    return backendChoice?.source ?? "default";
}

function sync() {
    const environment = pageSetKeys.has("environment") ? getEffectiveEnvironment() : (backendChoice?.environment ?? getEffectiveEnvironment());
    applyBuildConfig(AppConfig, environment, { skip: pageSetKeys, applied: appliedKeys });
}

function installPageWrapper() {
    if (installed) return;
    installed = true;
    g.UDAPluginSDK = (config: Record<string, unknown>) => {
        if (config && typeof config === "object") {
            for (const [key, value] of Object.entries(config)) {
                if (typeof value !== "string") continue; // AppConfig rejects other types
                if (key === "environment" && !normalizeEnvironment(value)) continue;
                // a TEST-stamped install cannot be switched to PROD by a page: drop that request
                if (key === "environment" && !allowedEnvironment(value, tierStamp)) {
                    console.warn("[UDA] this extension build is locked to TEST; ignoring environment PROD from the page");
                    config = { ...config };
                    delete config[key];
                    continue;
                }
                pageSetKeys.add(key);
            }
        }
        const result = AppConfig(config as any);
        sync();
        if (pageSetKeys.has("environment")) {
            document.dispatchEvent(new CustomEvent("UDAPageEnvironment", { detail: { data: getEffectiveEnvironment() }, bubbles: false, cancelable: false }));
        }
        return result;
    };
}

function fireReady() {
    g.UDASdkIsReady = true;
    window.dispatchEvent(
        new CustomEvent("UDASdkReady", { detail: { environment: getEffectiveEnvironment(), source: getEnvironmentSource() } }),
    );
}

/**
 * Wraps window.UDAPluginSDK, asks for the environment, applies the build config and fires
 * UDASdkReady. Resolves after the first answer or after `timeoutMs` (then the SDK default,
 * PROD, stays). Safe to call more than once.
 */
export function initRuntimeEnvironment(timeoutMs = 3000): Promise<void> {
    if (ready) return ready;
    installPageWrapper();
    // Loaded by a host page (SDK CDN bundle), not by the extension's content script: there is
    // no background to ask. Keep the SDK defaults and the page's own config.
    if (!document.documentElement.hasAttribute("data-udan-extension")) {
        sync();
        fireReady();
        return (ready = Promise.resolve());
    }
    ready = new Promise<void>((resolve) => {
        let settled = false;
        const settle = () => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            sync();
            fireReady();
            resolve();
        };
        const timer = setTimeout(() => {
            console.warn("[UDA] no environment answer from the extension background; keeping the SDK default");
            settle();
        }, timeoutMs);
        document.addEventListener("UDAEnvironmentData", (event: Event) => {
            const data = (event as CustomEvent).detail?.data;
            const environment = normalizeEnvironment(data?.environment);
            if (environment) {
                backendChoice = { environment, source: data.source };
                tierStamp = normalizeEnvironment(data.tierStamp);
                if (settled) sync(); // a later change (options override): AppConfig fires UDAConfigUpdated
            }
            settle();
        });
        document.dispatchEvent(new CustomEvent("UDAGetEnvironment", { detail: { data: "UDAGetEnvironment" }, bubbles: false, cancelable: false }));
    });
    return ready;
}
