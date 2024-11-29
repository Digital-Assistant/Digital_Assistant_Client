/**
 * Imports the `AuthData` and `CSPData` classes from their respective files.
 * These classes are used within the `UDASessionData` class to manage authentication
 * data and Content Security Policy (CSP) settings for a User Digital Assistant (UDA)
 * session.
 */
import { AuthData } from "./AuthData";
import { CSPData } from "./CSPData";

/**
 * Class representing session data for User Digital Assistant (UDA)
 * Manages authentication state and security policies
 */
export class UDASessionData {
    // Unique identifier for the current session
    sessionKey: string;

    // Flag indicating if user is currently authenticated
    authenticated: boolean;

    // System or method used for authentication (e.g., 'oauth', 'jwt')
    authenticationSource: string;

    // User authentication details including credentials and permissions
    authData: AuthData;

    // Content Security Policy settings for the session
    csp: CSPData;

    /**
     * Constructs a new instance of the `UDASessionData` class, which represents session data for a User Digital Assistant (UDA).
     * The constructor initializes the session key, authentication state, authentication source, authentication data, and Content Security Policy (CSP) data.
     * It performs validation checks to ensure that the required properties are not null or undefined.
     *
     * @param sessionKey - The unique identifier for the current session.
     * @param authenticated - A flag indicating whether the user is currently authenticated.
     * @param authenticationSource - The system or method used for authentication (e.g., 'oauth', 'jwt').
     * @param authData - The user authentication details, including credentials and permissions.
     * @param csp - The Content Security Policy settings for the session.
     */
    constructor(
        sessionKey: string = null,
        authenticated: boolean = false,
        authenticationSource: string = null,
        authData: AuthData = new AuthData(),
        csp: CSPData = new CSPData()
    ) {
        // Validate session key presence
        if (sessionKey === null) {
            throw new Error("Session key cannot be null.");
        }

        // Ensure authentication state is defined
        if (authenticated === null) {
            throw new Error("Authenticated cannot be null.");
        }

        // Verify authentication source is provided
        if (authenticationSource === null) {
            throw new Error("Authentication source cannot be null.");
        }

        // Check for valid authentication data object
        if (authData === null) {
            throw new Error("Authentication data cannot be null.");
        }

        // Validate CSP data presence
        if (csp === null) {
            throw new Error("Content Security Policy data cannot be null.");
        }

        // Initialize instance properties
        this.sessionKey = sessionKey;
        this.authenticated = authenticated;
        this.authenticationSource = authenticationSource;
        this.authData = authData;
        this.csp = csp;
    }
}