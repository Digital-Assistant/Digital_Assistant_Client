var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getTab } from "./getTab";
import { browserVar, UDABrowserPlugin } from "../BrowserConstants";
import { UDABindAuthenticatedAccount } from "./UDABindAuthenticatedAccount";
export const UDASendSessionData = (udaSessionData, sendAction = "UDAUserSessionData", message = '') => __awaiter(void 0, void 0, void 0, function* () {
    if (UDABrowserPlugin === true) {
        yield UDASendSessionDataToBackground(udaSessionData, sendAction, message);
    }
    else {
        let sessionEvent = {};
        switch (sendAction) {
            case "UDAUserSessionData":
                sessionEvent = new CustomEvent("UDAUserSessionData", {
                    detail: { data: JSON.stringify(udaSessionData) },
                    bubbles: false,
                    cancelable: false
                });
                break;
            case "UDAAuthenticatedUserSessionData":
                sessionEvent = new CustomEvent("UDAAuthenticatedUserSessionData", {
                    detail: { data: JSON.stringify(udaSessionData) },
                    bubbles: false,
                    cancelable: false
                });
                break;
            case "UDAAlertMessageData":
                sessionEvent = new CustomEvent("UDAAlertMessageData", {
                    detail: { data: message },
                    bubbles: false,
                    cancelable: false
                });
                break;
        }
        document.dispatchEvent(sessionEvent);
    }
});
export const UDASendSessionDataToBackground = (udaSessionData, sendAction = "UDAUserSessionData", message = '') => __awaiter(void 0, void 0, void 0, function* () {
    let tab = yield getTab();
    if (!tab) {
        console.log('No active tab identified.');
        return false;
    }
    if (sendAction === "UDAAlertMessageData") {
        yield browserVar.tabs.sendMessage(tab.id, { action: sendAction, data: message });
        return true;
    }
    else {
        // Logic to add the authtoken to the session data
        if (!udaSessionData.authData.hasOwnProperty('token')) {
            yield UDABindAuthenticatedAccount(udaSessionData, false);
        }
        else {
            yield browserVar.tabs.sendMessage(tab.id, { action: sendAction, data: JSON.stringify(udaSessionData) });
        }
        return true;
    }
});
