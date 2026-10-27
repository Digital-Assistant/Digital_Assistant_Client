/**
 * Runtime environment (TEST or PROD) of the extension: pure rules, shared by the
 * background worker, the page-side code and the options page.
 *
 * Environment precedence (first match wins):
 *   1. set by the page through UDAPluginSDK({ environment })   (page side only)
 *   2. the options override in chrome.storage.local (`udanEnvironment`)
 *   3. install type: `development` (unpacked) = TEST, anything else = PROD
 *   4. PROD
 * URL precedence within the environment: page keys, then the build config
 * (./buildConfig.ts, public values only), then the SDK defaults. Empty build values
 * are skipped so the SDK defaults apply.
 */

import { buildConfig, type BuildConfig } from "./buildConfig";

export type Environment = "TEST" | "PROD";
export type EnvironmentSource = "page" | "override" | "install-type" | "default";

export interface EnvironmentChoice {
    environment: Environment;
    source: EnvironmentSource;
}

/** chrome.storage.local key of the options override: "TEST" | "PROD" | unset (automatic). */
export const ENVIRONMENT_STORAGE_KEY = "udanEnvironment";

/** SDK config keys (SDK 0.11.0) that the build config can fill. */
export const BUILD_CONFIG_KEYS = ["apiBaseUrl", "tokenUrl", "llmUrl", "keycloakUrl", "realm", "clientId", "clientSecret"] as const;
export type BuildConfigKey = (typeof BUILD_CONFIG_KEYS)[number];

export function normalizeEnvironment(value: unknown): Environment | undefined {
    if (typeof value !== "string") return undefined;
    const upper = value.trim().toUpperCase();
    return upper === "TEST" || upper === "PROD" ? upper : undefined;
}

/** Steps 2 to 4 of the precedence (the background has no page). */
export function chooseEnvironment(installType?: string, override?: unknown): EnvironmentChoice {
    const forced = normalizeEnvironment(override);
    if (forced) return { environment: forced, source: "override" };
    if (installType === "development") return { environment: "TEST", source: "install-type" };
    if (installType) return { environment: "PROD", source: "install-type" };
    return { environment: "PROD", source: "default" };
}

/** Build-config values for one environment, as SDK config keys. Empty values are included as "". */
export function buildSdkValues(environment: Environment, config: Readonly<BuildConfig> = buildConfig): Record<BuildConfigKey, string> {
    const urls = config[environment];
    return {
        apiBaseUrl: urls.apiBaseUrl,
        tokenUrl: urls.tokenUrl,
        llmUrl: urls.llmUrl,
        keycloakUrl: urls.keycloakUrl,
        realm: config.keycloakRealm,
        clientId: config.keycloakClientId,
        clientSecret: config.keycloakClientSecret,
    };
}

export interface ApplyOptions {
    /** Keys the page has set itself: never touched. */
    skip?: ReadonlySet<string>;
    /** Keys this module has applied before (updated in place): lets a switch to an environment with an empty value clear the old one. */
    applied?: Set<string>;
    /** Build config to use (tests). */
    config?: Readonly<BuildConfig>;
}

/**
 * Hands the build config for `environment` to the SDK with one `configure` call
 * (the SDK's AppConfig). Skips page-set keys and empty values; a key applied for the
 * other environment earlier and empty now is reset to "" (the SDK reads "" as unset).
 * Returns the config passed to `configure`.
 */
export function applyBuildConfig(
    configure: (config: Record<string, string>) => unknown,
    environment: Environment,
    { skip = new Set<string>(), applied = new Set<string>(), config = buildConfig }: ApplyOptions = {},
): Record<string, string> {
    const values = buildSdkValues(environment, config);
    const next: Record<string, string> = {};
    if (!skip.has("environment")) next.environment = environment;
    for (const key of BUILD_CONFIG_KEYS) {
        if (skip.has(key)) continue;
        if (values[key]) {
            next[key] = values[key];
            applied.add(key);
        } else if (applied.has(key)) {
            next[key] = "";
            applied.delete(key);
        }
    }
    if (Object.keys(next).length) configure(next);
    return next;
}
