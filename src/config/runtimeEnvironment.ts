/**
 * Runtime environment (TEST or PROD) of the extension: pure rules, shared by the
 * background worker, the page-side code and the options page.
 *
 * Environment precedence (first match wins):
 *   1. set by the page through UDAPluginSDK({ environment })   (page side only)
 *   2. the options override in chrome.storage.local (`udanEnvironment`)
 *   3. the tier stamp: `tier.json` at the zip root, `{"tier":"TEST"}` or `{"tier":"PROD"}`
 *      (written by the store packaging, read by ./tierStamp.ts)
 *   4. install type: `development` (unpacked) = TEST, anything else = PROD
 *   5. PROD
 * A stamp `TEST` locks the extension to TEST: a PROD value from step 1 or 2 is ignored (a TEST
 * store install can never reach PROD). A stamp `PROD` accepts the overrides as before. A missing
 * or invalid stamp is the same as no stamp (steps 4 and 5, today's behaviour), so an unpacked
 * development build without a stamp is still TEST.
 * URL precedence within the environment: page keys, then the build config
 * (./buildConfig.ts, public values only), then the SDK defaults. Empty build values
 * are skipped so the SDK defaults apply.
 */

import { buildConfig, type BuildConfig } from "./buildConfig";

export type Environment = "TEST" | "PROD";
export type EnvironmentSource = "page" | "override" | "stamp" | "install-type" | "default";

export interface EnvironmentChoice {
    environment: Environment;
    source: EnvironmentSource;
}

/** chrome.storage.local key of the options override: "TEST" | "PROD" | unset (automatic). */
export const ENVIRONMENT_STORAGE_KEY = "udanEnvironment";

/** SDK config keys (SDK 0.12.0) that the build config can fill. */
export const BUILD_CONFIG_KEYS = ["apiBaseUrl", "tokenUrl", "llmUrl", "keycloakUrl", "realm", "clientId"] as const;
export type BuildConfigKey = (typeof BUILD_CONFIG_KEYS)[number];

export function normalizeEnvironment(value: unknown): Environment | undefined {
    if (typeof value !== "string") return undefined;
    const upper = value.trim().toUpperCase();
    return upper === "TEST" || upper === "PROD" ? upper : undefined;
}

/**
 * Reads the content of `tier.json`. Strict on purpose: the text must be JSON, an object whose
 * only key is `tier`, with the exact value "TEST" or "PROD". Anything else (bad JSON, extra keys,
 * other case, other value, not a string) is no stamp, and the caller falls back to PROD.
 */
export function parseTierStamp(text: unknown): Environment | undefined {
    if (typeof text !== "string") return undefined;
    let data: unknown;
    try {
        data = JSON.parse(text);
    } catch {
        return undefined;
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) return undefined;
    const keys = Object.keys(data);
    if (keys.length !== 1 || keys[0] !== "tier") return undefined;
    const tier = (data as { tier: unknown }).tier;
    return tier === "TEST" || tier === "PROD" ? tier : undefined;
}

/**
 * An environment requested by a page (UDAPluginSDK({ environment })) or by the options override,
 * or undefined when it is not allowed or not valid. With a TEST stamp a PROD request is refused.
 */
export function allowedEnvironment(requested: unknown, stamp?: Environment): Environment | undefined {
    const wanted = normalizeEnvironment(requested);
    return wanted && !(stamp === "TEST" && wanted === "PROD") ? wanted : undefined;
}

/** Steps 2 to 5 of the precedence (the background has no page). `stamp` = parsed `tier.json`, if any. */
export function chooseEnvironment(installType?: string, override?: unknown, stamp?: Environment): EnvironmentChoice {
    const forced = allowedEnvironment(override, stamp);
    if (forced) return { environment: forced, source: "override" };
    if (stamp) return { environment: stamp, source: "stamp" };
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
