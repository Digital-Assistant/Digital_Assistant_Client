import { AuthData } from "./AuthData";
import { CSPData } from "./CSPData";

// UDASessionData class to manage user session data
export class UDASessionData {
    sessionKey: string; // Unique identifier for the session
    authenticated: boolean; // Indicates whether the user is authenticated
    authenticationSource: string; // Source of authentication (e.g., SSO, Local)
    authData: AuthData; // Contains additional authentication details
    csp: CSPData; // Contains CSP-related information

    /**
     * Constructor to initialize the UDASessionData object
     * @param {string|null} sessionKey - Session key (default: null)
     * @param {boolean} authenticated - Authentication status (default: false)
     * @param {string|null} authenticationSource - Source of authentication (default: null)
     * @param {AuthData} authData - Authentication data object (default: new AuthData())
     * @param {CSPData} csp - CSP data object (default: new CSPData())
     */
    constructor(
        sessionKey: string = null,
        authenticated: boolean = false,
        authenticationSource: string = null,
        authData: AuthData = new AuthData(),
        csp: CSPData = new CSPData()
    ) {
        // Validate sessionKey: must be a non-empty string if provided
        if (sessionKey !== null && typeof sessionKey !== "string") {
            throw new Error("Invalid sessionKey: must be a string or null.");
        }

        // Validate authenticationSource: must be a non-empty string if provided
        if (authenticationSource !== null && typeof authenticationSource !== "string") {
            throw new Error("Invalid authenticationSource: must be a string or null.");
        }

        // Validate that authData is an instance of AuthData
        if (!(authData instanceof AuthData)) {
            throw new Error("Invalid authData: must be an instance of AuthData.");
        }

        // Validate that csp is an instance of CSPData
        if (!(csp instanceof CSPData)) {
            throw new Error("Invalid csp: must be an instance of CSPData.");
        }

        // Assign values to class properties
        this.sessionKey = sessionKey;
        this.authenticated = authenticated;
        this.authenticationSource = authenticationSource;
        this.authData = authData;
        this.csp = csp;
    }

    /**
     * Updates the session key.
     * @param {string} newSessionKey - New session key
     */
    updateSessionKey(newSessionKey: string): void {
        if (!newSessionKey || typeof newSessionKey !== "string") {
            throw new Error("Invalid newSessionKey: must be a non-empty string.");
        }
        this.sessionKey = newSessionKey;
    }

    /**
     * Toggles the authenticated status.
     */
    toggleAuthentication(): void {
        this.authenticated = !this.authenticated;
    }

    /**
     * Updates the authentication source.
     * @param {string} newAuthSource - New authentication source
     */
    updateAuthSource(newAuthSource: string): void {
        if (!newAuthSource || typeof newAuthSource !== "string") {
            throw new Error("Invalid newAuthSource: must be a non-empty string.");
        }
        this.authenticationSource = newAuthSource;
    }
}
