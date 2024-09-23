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
import { UDABindAuthenticatedAccount } from "./UDABindAuthenticatedAccount";
export const sendSessionDataExtension = (sendAction = "UDAUserSessionData", message = '', sessionData) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (!sessionData.authData.hasOwnProperty('token')) {
            yield UDABindAuthenticatedAccount(sessionData, false);
        }
        else {
            yield browserVar.tabs.sendMessage(tab.id, { action: sendAction, data: JSON.stringify(sessionData) });
        }
        return true;
    }
});
