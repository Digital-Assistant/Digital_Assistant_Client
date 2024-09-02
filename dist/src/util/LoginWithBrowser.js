var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UDADigestMessage } from "./UDADigestMessage";
import { UDABindAuthenticatedAccount } from "./UDABindAuthenticatedAccount";
import { UDASendSessionData } from "./UDASendSessionData";
import { browserVar } from "../BrowserConstants";
/**
 * Asynchronously logs the user in using a browser.
 *
 * @param {UDASessionData} sessionData - The session data object to be updated with the user's authentication information.
 * @param {boolean} renewToken - Whether to renew the user's authentication token.
 * @return {Promise<boolean>} A promise that resolves to true if the login was successful, otherwise false.
 */
export const LoginWithBrowser = (sessionData, renewToken) => __awaiter(void 0, void 0, void 0, function* () {
    sessionData.authenticationSource = "google";
    const data = yield browserVar.identity.getProfileUserInfo({ accountStatus: 'ANY' });
    if (data && (data === null || data === void 0 ? void 0 : data.id) !== '' && (data === null || data === void 0 ? void 0 : data.email) !== "") {
        sessionData.authenticated = true;
        sessionData.authData = data;
        UDADigestMessage(data.id, "SHA-512").then((encryptedId) => __awaiter(void 0, void 0, void 0, function* () {
            sessionData.authData.id = encryptedId;
            UDADigestMessage(data.email, "SHA-512").then((encryptedEmail) => __awaiter(void 0, void 0, void 0, function* () {
                sessionData.authData.email = encryptedEmail;
                yield UDABindAuthenticatedAccount(sessionData, renewToken);
            }));
        }));
    }
    else {
        yield UDASendSessionData(sessionData, "UDAAlertMessageData", "login");
    }
    return true;
});
//# sourceMappingURL=LoginWithBrowser.js.map