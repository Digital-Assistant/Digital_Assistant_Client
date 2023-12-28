import {getTab} from "./getTab";
import {UDASessionData} from "../models/UDASessionData";
import {UDABindAuthenticatedAccount} from "./UDABindAuthenticatedAccount";
declare const browserVar;

export const sendSessionDataExtension = async (sendAction = "UDAUserSessionData", message = '', sessionData: UDASessionData) => {
    let tab = await getTab();
    if (sendAction === "UDAAlertMessageData") {
        await browserVar.tabs.sendMessage(tab.id, {action: sendAction, data: message});
        return true;
    } else {
        // Logic to add the authtoken to the session data
        if (!sessionData.authData.hasOwnProperty('token')) {
            await UDABindAuthenticatedAccount(sessionData, false);
        } else {
            await browserVar.tabs.sendMessage(tab.id, {action: sendAction, data: JSON.stringify(sessionData)});
        }
        return true;
    }
}
