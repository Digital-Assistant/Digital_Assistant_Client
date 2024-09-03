var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UDASessionName, updateSessionName, updateBrowserPlugin } from "./BrowserConstants";
updateBrowserPlugin(false);
updateSessionName('web');
// export let sessionData: any = {sessionKey:"", authenticated:false, authenticationSource:"", authData:{}};
let sessionData = new UDASessionData();
import { UDAGetSessionKey } from "./util/UDAGetSessionKey";
import { UDASendSessionData } from "./util/UDASendSessionData";
import { UDABindAuthenticatedAccount } from "./util/UDABindAuthenticatedAccount";
import { AuthDataConfig } from "./config/AuthDataConfig";
import { AuthConfig } from "./config/UserAuthConfig";
import { keyCloakStore } from "./util/KeycloakStore";
import { on } from "./util/events";
import { UDAStorageService } from "./services/UDAStorageService";
import { UDASessionData } from "./models/UDASessionData";
import { CustomConfig } from "./config/CustomConfig";
import { AppConfig } from "./config/AppConfig";
global.UDAAuthDataConfig = AuthDataConfig;
global.UDAAuthConfig = AuthConfig;
global.UDAPluginSDK = AppConfig;
global.UDAGlobalConfig = CustomConfig;
// Clearing user session in case if the id gets changed
on("UDAClearSessionData", () => __awaiter(void 0, void 0, void 0, function* () {
    yield UDAStorageService.remove(UDASessionName);
}));
// listening to the requests that is sent by the sdk.
on("RequestUDASessionData", (data) => __awaiter(void 0, void 0, void 0, function* () {
    let action = data.detail.data;
    if (action === "getusersessiondata" && global.UDAGlobalConfig.realm !== 'UDAN') {
        let storedSessionData = yield UDAStorageService.get(UDASessionName);
        //	check for change in id
        yield UDACheckUserSessionData(storedSessionData);
    }
    else {
        yield UDASendSessionData(sessionData, "UDAAlertMessageData", "login");
    }
}));
on('CreateUDASessionData', (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield keyCloakStore(sessionData, data.detail.data);
}));
on('UDAGetNewToken', (data) => __awaiter(void 0, void 0, void 0, function* () {
    let storedSessionData = yield UDAStorageService.get(UDASessionName);
    //	check for change in id
    yield UDACheckUserSessionData(storedSessionData, false, true);
}));
export const UDACheckUserSessionData = (storedSessionData, getSession = true, renewToken = false) => __awaiter(void 0, void 0, void 0, function* () {
    storedSessionData = JSON.parse(storedSessionData);
    if (storedSessionData !== null && storedSessionData.hasOwnProperty("sessionKey") && storedSessionData.sessionKey && storedSessionData.authData) {
        if (typeof global.UDAAuthConfig != 'undefined' && global.UDAAuthConfig.id && (storedSessionData.authData.hasOwnProperty('id') && storedSessionData.authData.id === global.UDAAuthConfig.id)) {
            sessionData = storedSessionData;
            if (sessionData.authData.token && !renewToken) {
                yield UDASendSessionData(sessionData);
            }
            else {
                yield UDABindAuthenticatedAccount(sessionData, renewToken);
            }
        }
        else if (getSession && typeof global.UDAAuthConfig !== 'undefined' && global.UDAAuthConfig.id) {
            window.localStorage.removeItem(UDASessionName);
            sessionData = yield UDAGetSessionKey(sessionData);
            sessionData.authData.id = global.UDAAuthConfig.id;
            sessionData.authData.email = (global.UDAAuthConfig.email) ? global.UDAAuthConfig.email : global.UDAAuthConfig.id;
            sessionData.authenticated = true;
            sessionData.authenticationSource = window.location.hostname;
            yield UDABindAuthenticatedAccount(sessionData, renewToken);
        }
        else {
            yield UDASendSessionData(sessionData, "UDAAlertMessageData", "login");
        }
    }
    else if (typeof global.UDAAuthConfig !== 'undefined' && global.UDAAuthConfig.id) {
        sessionData = yield UDAGetSessionKey(sessionData);
        sessionData.authData.id = global.UDAAuthConfig.id;
        sessionData.authData.email = (global.UDAAuthConfig.email) ? global.UDAAuthConfig.email : global.UDAAuthConfig.id;
        sessionData.authenticated = true;
        sessionData.authenticationSource = window.location.hostname;
        yield UDABindAuthenticatedAccount(sessionData, renewToken);
    }
    else if (global.UDAAuthConfig.id === '') {
        yield UDASendSessionData(sessionData, "UDAAlertMessageData", "login");
    }
});
/**
 * Clearing Session storage
 */
export const UDAClearSession = () => {
    window.localStorage.removeItem(UDASessionName);
    sessionData = new UDASessionData();
};
//# sourceMappingURL=AuthService.js.map