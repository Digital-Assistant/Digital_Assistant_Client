var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UDAGetSessionKey } from "./util/UDAGetSessionKey";
import { UDASendSessionData } from "./util/UDASendSessionData";
import { UDABindAuthenticatedAccount } from "./util/UDABindAuthenticatedAccount";
import { CONFIG } from "./config";
import { AuthDataConfig } from "./config/AuthDataConfig";
import { AuthConfig } from "./config/UserAuthConfig";
import { keyCloakStore } from "./util/KeycloakStore";
import { on } from "./util/events";
global.UDAAuthDataConfig = AuthDataConfig;
global.UDAAuthConfig = AuthConfig;
export const UDAApiHost = CONFIG.UDA_DOMAIN;
export const UDASessionName = CONFIG.USER_AUTH_DATA_KEY + '-web';
export let UDASessionData = { sessionKey: "", authenticated: false, authenticationSource: "", authData: {} };
// Clearing user session in case if the id gets changed
on("UDAClearSessionData", () => {
    UDAClearSession();
});
// listening to the requests that is sent by the sdk.
on("RequestUDASessionData", (data) => __awaiter(void 0, void 0, void 0, function* () {
    let action = data.detail.data;
    if (action === "getusersessiondata") {
        let storedSessionData = window.localStorage.getItem(UDASessionName);
        //	check for change in id
        yield UDACheckUserSessionData(storedSessionData);
    }
}));
on('CreateUDASessionData', (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield keyCloakStore(UDASessionData, data.detail.data);
}));
on('UDAGetNewToken', (data) => __awaiter(void 0, void 0, void 0, function* () {
    let storedSessionData = window.localStorage.getItem(UDASessionName);
    //	check for change in id
    yield UDACheckUserSessionData(storedSessionData, false, true);
}));
export const UDACheckUserSessionData = (storedSessionData, getSession = true, renewToken = false) => __awaiter(void 0, void 0, void 0, function* () {
    storedSessionData = JSON.parse(storedSessionData);
    if (storedSessionData !== null && storedSessionData.hasOwnProperty("sessionkey") && storedSessionData.sessionkey && storedSessionData.authdata) {
        if (typeof global.UDAAuthConfig != 'undefined' && global.UDAAuthConfig.id && (storedSessionData.authdata.hasOwnProperty('id') && storedSessionData.authdata.id === global.UDAAuthConfig.id)) {
            UDASessionData = storedSessionData;
            if (UDASessionData.authdata.token && !renewToken) {
                UDASendSessionData(UDASessionData);
            }
            else {
                yield UDABindAuthenticatedAccount(UDASessionData, renewToken);
            }
        }
        else if (getSession && typeof global.UDAAuthConfig !== 'undefined' && global.UDAAuthConfig.id) {
            window.localStorage.removeItem(UDASessionName);
            UDASessionData = yield UDAGetSessionKey(UDASessionData);
            UDASessionData.authdata = global.UDAAuthConfig;
            UDASessionData.authenticated = true;
            UDASessionData.authenticationsource = window.location.hostname;
            yield UDABindAuthenticatedAccount(UDASessionData, renewToken);
        }
        else {
            UDASendSessionData(UDASessionData, "UDAAlertMessageData", "login");
        }
    }
    else if (typeof global.UDAAuthConfig !== 'undefined' && global.UDAAuthConfig.id) {
        UDASessionData = yield UDAGetSessionKey(UDASessionData);
        UDASessionData.authdata = global.UDAAuthConfig;
        UDASessionData.authenticated = true;
        UDASessionData.authenticationsource = window.location.hostname;
        yield UDABindAuthenticatedAccount(UDASessionData, renewToken);
    }
    else if (global.UDAAuthConfig.id === '') {
        UDASendSessionData(UDASessionData, "UDAAlertMessageData", "login");
    }
});
//storing the data to local storage
export const UDAStoreSessionData = (udaSessionData) => {
    const storageData = JSON.stringify(udaSessionData);
    window.localStorage.setItem(UDASessionName, storageData);
    UDASessionData = udaSessionData;
};
/**
 * Clearing Session storage
 */
export const UDAClearSession = () => {
    window.localStorage.removeItem(UDASessionName);
    UDASessionData = { sessionKey: null, authenticated: false, authenticationSource: null, authData: {} };
};
//# sourceMappingURL=AuthService-backup.js.map