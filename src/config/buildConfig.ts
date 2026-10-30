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
 * Read by ./runtimeEnvironment.ts (handed to the SDK) and by the worker's
 * Keycloak sign-in (../browser-auth/LoginWithKeycloak.ts).
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
    /** Public Keycloak client for the worker's PKCE sign-in (no secret); empty = PKCE sign-in off. */
    keycloakPublicClientId: string;
    /** Optional identity provider alias sent as kc_idp_hint (e.g. the Google IdP); empty = Keycloak's own page. */
    keycloakIdpHint: string;
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
    keycloakPublicClientId: process.env.keycloakPublicClientId || "",
    keycloakIdpHint: process.env.keycloakIdpHint || "",
});

export default buildConfig;
