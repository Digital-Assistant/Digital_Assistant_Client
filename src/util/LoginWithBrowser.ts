import {UDADigestMessage} from "./UDADigestMessage";
import {UDASessionData} from "../models/UDASessionData";
import {UDABindAuthenticatedAccount} from "./UDABindAuthenticatedAccount";
import {UDASendSessionData} from "./UDASendSessionData";
import {browserVar} from "../BrowserConstants";

export const LoginWithBrowser = async (sessionData: UDASessionData, renewToken: boolean) => {
    sessionData.authenticationSource = "google";
    const data = await browserVar.identity.getProfileUserInfo({accountStatus: 'ANY'})
    if (data.id !== '' && data.email !== "") {
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
        await UDASendSessionData(sessionData, "UDAAlertMessageData", "login")
    }
    // await sendSessionData("UDAAlertMessageData", "login");
    return true;
}
