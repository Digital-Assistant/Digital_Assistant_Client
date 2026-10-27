/**
 * Build-time public config of the extension.
 *
 * webpack inlines these `process.env.*` values from environments/<build>.env
 * (schema: environments/env.example, loader: scripts/build-env.js). Public keys
 * only: anything here is readable by anyone who unzips the extension.
 *
 * Both environments are kept so one build can serve TEST and PROD; the
 * environment is picked at runtime.
 *
 * Not wired into the SDK yet: phase C04 passes it to the SDK once the SDK
 * accepts these keys from the page config (phase C03). Until then nothing
 * imports this module, so the values are not in the bundle.
 */

// Defined by webpack only for local builds (UDAN_ALLOW_CLIENT_SECRET=1), see webpack.config.js.
declare const __UDAN_LOCAL_CLIENT_SECRET__: string | undefined;

export interface EnvironmentUrls {
    /** Backend REST base, including /api (endpoint paths are appended). */
    apiBaseUrl: string;
    /** Token service (user token, remote error log). */
    tokenUrl: string;
    /** LLM search service. */
    llmUrl: string;
    /** Keycloak base URL. */
    keycloakUrl: string;
}

export interface BuildConfig {
    PROD: EnvironmentUrls;
    TEST: EnvironmentUrls;
    keycloakRealm: string;
    keycloakClientId: string;
    /** Local test builds only; empty otherwise (no secret in release builds). */
    keycloakClientSecret: string;
    googleAnalyticsMeasurementId: string;
    enableGoogleAnalytics: boolean;
}

export const buildConfig: Readonly<BuildConfig> = Object.freeze({
    PROD: Object.freeze({
        apiBaseUrl: process.env.baseProdURL || "",
        tokenUrl: process.env.tokenProdUrl || "",
        llmUrl: process.env.llmProdUrl || "",
        keycloakUrl: process.env.keycloakProdUrl || "",
    }),
    TEST: Object.freeze({
        apiBaseUrl: process.env.baseTestURL || "",
        tokenUrl: process.env.tokenTestUrl || "",
        llmUrl: process.env.llmTestUrl || "",
        keycloakUrl: process.env.keycloakTestUrl || "",
    }),
    keycloakRealm: process.env.keycloakRealm || "",
    keycloakClientId: process.env.keycloakClientId || "",
    keycloakClientSecret: (typeof __UDAN_LOCAL_CLIENT_SECRET__ !== "undefined" && __UDAN_LOCAL_CLIENT_SECRET__) || "",
    googleAnalyticsMeasurementId: process.env.googleAnalyticsMeasurementId || "",
    enableGoogleAnalytics: process.env.enableGoogleAnalytics === "true",
});

export default buildConfig;
