var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//adding the sessionKey to the authid
import { UDASendSessionData } from "./UDASendSessionData";
import { invokeApi } from "./invokeApi";
import { ENDPOINT } from "../config/endpoints";
import { CustomConfig } from "../config/CustomConfig";
import { UDAStorageService } from "../services/UDAStorageService";
import { UDASessionName } from "../BrowserConstants";
global.UDAGlobalConfig = CustomConfig;
/**
 * Binds the user account with UDASessionData.
 * @param {Object} userAuthData - User authentication data.
 * @param {Object} UDASessionData - UDA session data.
 * @param {boolean} renewToken - Flag indicating whether to renew the token.
 * @returns {Promise<void>} Promise that resolves when the binding is complete.
 */
export const UDABindAccount = (userAuthData, UDASessionData, renewToken) => __awaiter(void 0, void 0, void 0, function* () {
    const payLoad = { uid: UDASessionData.authData.id, email: UDASessionData.authData.email, realm: global.UDAGlobalConfig.realm, clientId: global.UDAGlobalConfig.clientId, clientSecret: global.UDAGlobalConfig.clientSecret };
    const authToken = yield invokeApi(process.env.tokenUrl + ENDPOINT.tokenUrl, "POST", payLoad);
    if (authToken && (authToken === null || authToken === void 0 ? void 0 : authToken.token)) {
        UDASessionData.authData.token = authToken.token;
        let userSessionData = { userauthid: userAuthData.id, usersessionid: UDASessionData.sessionKey };
        let response = yield invokeApi(ENDPOINT.CheckUserSession, "POST", userSessionData);
        if (response) {
            yield UDAStorageService.add(UDASessionData, UDASessionName);
            yield UDASendSessionData(UDASessionData, "UDAAuthenticatedUserSessionData");
        }
    }
});
//# sourceMappingURL=UDABindAccount.js.map