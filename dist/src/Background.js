'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { browserVar, UDASessionName, updateActiveTabId, updateBrowserPlugin } from "./BrowserConstants";
updateBrowserPlugin(true);
/**
 * Storing the active tab id to fetch for further data.
 */
browserVar.tabs.onActivated.addListener(function (activeInfo) {
    updateActiveTabId(activeInfo.tabId);
});
import { LoginWithBrowser } from "./util/LoginWithBrowser";
import { UDASendSessionData } from "./util/UDASendSessionData";
import { UDASessionData } from "./models/UDASessionData";
import { UDAGetSessionKey } from "./util/UDAGetSessionKey";
import { UDABindAuthenticatedAccount } from "./util/UDABindAuthenticatedAccount";
import { UDAStorageService } from "./services/UDAStorageService";
import { keyCloakStore } from "./util/KeycloakStore";
let sessionData = new UDASessionData();
// listen for the requests made from webpage for accessing userdata
browserVar.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        if (request.action === "getusersessiondata" || request.action === "UDAGetNewToken") {
            const storedSessionData = yield UDAStorageService.get(UDASessionName);
            if (!storedSessionData) {
                sessionData = yield UDAGetSessionKey(sessionData);
                yield LoginWithBrowser(sessionData, false);
            }
            else {
                // looks like browser storage might have changed so changing the reading the data has been changed. For to work with old version have added the new code to else if statement
                if (storedSessionData.hasOwnProperty("sessionKey") && storedSessionData["sessionKey"] && typeof storedSessionData["sessionKey"] != 'object') {
                    sessionData = storedSessionData;
                    if (request.action === "UDAGetNewToken") {
                        yield generateNewToken();
                    }
                    else if (storedSessionData.hasOwnProperty('authenticated') && storedSessionData.authenticated) {
                        yield UDASendSessionData(sessionData);
                    }
                    else {
                        yield LoginWithBrowser(sessionData, false);
                    }
                }
                else if (storedSessionData.hasOwnProperty(UDASessionName) && storedSessionData[UDASessionName].hasOwnProperty("sessionKey") && storedSessionData[UDASessionName]["sessionKey"] && typeof storedSessionData[UDASessionName]["sessionKey"] != 'object') {
                    sessionData = storedSessionData[UDASessionName];
                    if (storedSessionData.hasOwnProperty('authenticated') && storedSessionData.authenticated) {
                        yield UDASendSessionData(sessionData);
                    }
                    else {
                        yield LoginWithBrowser(sessionData, false);
                    }
                }
                else {
                    sessionData = yield UDAGetSessionKey(sessionData);
                    yield LoginWithBrowser(sessionData, false);
                }
            }
        }
        else if (request.action === "authtenicate") {
            yield LoginWithBrowser(sessionData, false);
        }
        else if (request.action === "createSession") {
            yield keyCloakStore(sessionData, request.data);
        }
    });
});
function generateNewToken() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(sessionData);
        yield UDABindAuthenticatedAccount(sessionData, true);
    });
}
//# sourceMappingURL=Background.js.map