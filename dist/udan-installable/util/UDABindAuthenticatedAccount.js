var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//binding session key to the authenticated account
import { UDABindAccount } from "./UDABindAccount";
import { invokeApi } from "./invokeApi";
import { ENDPOINT } from "../config/endpoints";
/**
 * Binds the authenticated account with UDASessionData.
 * @param {any} sessionData - The UDA session data.
 * @param {boolean} [renewToken=false] - Flag indicating whether to renew the token.
 * @returns {Promise<void>} A Promise that resolves when the binding is complete.
 */
export const UDABindAuthenticatedAccount = (sessionData, renewToken = false) => __awaiter(void 0, void 0, void 0, function* () {
    let authData = {
        authid: sessionData.authData.id,
        emailid: sessionData.authData.email,
        authsource: sessionData.authenticationSource
    };
    let response = yield invokeApi(ENDPOINT.CheckUserId, "POST", authData);
    if (response) {
        if (sessionData.sessionKey !== null) {
            yield UDABindAccount(response, sessionData, renewToken);
        }
    }
});
