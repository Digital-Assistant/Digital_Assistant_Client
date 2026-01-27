/**
 * Browser Extension Authentication Adapter
 *
 * This file contains browser-extension-specific authentication logic that uses
 * the Chrome Identity API. This CANNOT be moved to the core package because:
 * - chrome.identity API only works in browser extensions
 * - Requires extension manifest permissions (identity, identity.email)
 *
 * For standalone SDK usage, implement alternative authentication methods
 * (OAuth, JWT, etc.) that don't rely on browser extension APIs.
 */

import {
    UDADigestMessage,
    UDABindAuthenticatedAccount,
    UDASendSessionData,
    UDASessionData,
    getBrowserVar
} from "@digital-assistant/core";

/**
 * Authenticate user using Chrome Identity API (Browser Extension Only)
 *
 * This function:
 * 1. Gets user profile from Chrome Identity API
 * 2. Encrypts user ID and email using SHA-512
 * 3. Binds the authenticated account using core package utilities
 *
 * @param sessionData - The UDA session data object
 * @param renewToken - Whether to renew the authentication token
 * @returns Promise<boolean> - true if login successful, false otherwise
 *
 * @example
 * ```typescript
 * const sessionData = new UDASessionData();
 * await LoginWithBrowser(sessionData, false);
 * ```
 */
export const LoginWithBrowser = async (
    sessionData: UDASessionData,
    renewToken: boolean
): Promise<boolean> => {
    const browserVar = getBrowserVar();
    sessionData.authenticationSource = "google";

    // Chrome Identity API - only available in browser extensions with proper permissions
    // Requires: "identity" and "identity.email" permissions in manifest.json
    const data = await browserVar.identity.getProfileUserInfo({ accountStatus: 'ANY' });

    if (data && data?.id !== '' && data?.email !== "") {
        sessionData.authenticated = true;
        sessionData.authData = data;

        // Encrypt user ID and email for privacy
        const encryptedId = await UDADigestMessage(data.id, "SHA-512");
        sessionData.authData.id = encryptedId;

        const encryptedEmail = await UDADigestMessage(data.email, "SHA-512");
        sessionData.authData.email = encryptedEmail;

        // Bind the authenticated account using core package utility
        await UDABindAuthenticatedAccount(sessionData, renewToken);
    } else {
        // Send alert if authentication fails
        await UDASendSessionData(sessionData, "UDAAlertMessageData", "login");
    }

    return true;
}
