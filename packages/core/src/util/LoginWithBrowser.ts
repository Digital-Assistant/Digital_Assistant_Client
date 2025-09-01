import {UDADigestMessage} from "./UDADigestMessage";
import {UDASessionData} from "../models/UDASessionData";
import {UDABindAuthenticatedAccount} from "./UDABindAuthenticatedAccount";
import {UDASendSessionData} from "./UDASendSessionData";
import {browserVar} from "../BrowserConstants";

/**
 * Asynchronously logs the user in using a browser.
 *
 * @param {UDASessionData} sessionData - The session data object to be updated with the user's authentication information.
 * @param {boolean} renewToken - Whether to renew the user's authentication token.
 * @return {Promise<boolean>} A promise that resolves to true if the login was successful, otherwise false.
 */
export const LoginWithBrowser = async (sessionData: UDASessionData, renewToken: boolean) => {
    sessionData.authenticationSource = "google";
    const data = await browserVar.identity.getProfileUserInfo({accountStatus: 'ANY'})
    if (data && data?.id !== '' && data?.email !== "") {
        sessionData.authenticated = true;
        sessionData.authData = data;
        UDADigestMessage(data.id, "SHA-512").then(async (encryptedId) => {
            sessionData.authData.id = encryptedId;
            UDADigestMessage(data.email, "SHA-512").then(async (encryptedEmail) => {
                sessionData.authData.email = encryptedEmail;
                await UDABindAuthenticatedAccount(sessionData, renewToken);
            });
        });
    } else {
        await UDASendSessionData(sessionData, "UDAAlertMessageData", "login");
    }
    return true;
}
