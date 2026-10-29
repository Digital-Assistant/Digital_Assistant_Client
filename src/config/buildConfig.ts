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
 * Handed to the SDK at runtime by ./runtimeEnvironment.ts (applyBuildConfig),
 * which the background worker and the panel (src/main.tsx) both call. The
 * client secret is deliberately not part of this config.
 */

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
});

export default buildConfig;
