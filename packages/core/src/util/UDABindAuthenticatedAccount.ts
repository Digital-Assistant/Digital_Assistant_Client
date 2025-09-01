//binding session key to the authenticated account
import {UDABindAccount} from "./UDABindAccount";
import {invokeApi} from "./invokeApi";
import {ENDPOINT} from "../config/endpoints";
import {UDASessionData} from "../models/UDASessionData";

/**
 * Binds the authenticated account with UDASessionData.
 * @param {any} sessionData - The UDA session data.
 * @param {boolean} [renewToken=false] - Flag indicating whether to renew the token.
 * @returns {Promise<void>} A Promise that resolves when the binding is complete.
 */
export const UDABindAuthenticatedAccount = async (sessionData: UDASessionData, renewToken: boolean = false) => {
  let authData = {
    authid: sessionData.authData.id,
    emailid: sessionData.authData.email,
    authsource: sessionData.authenticationSource
  };
  let response = await invokeApi(ENDPOINT.CheckUserId, "POST", authData);
  if(response){
    if (sessionData.sessionKey !== null) {
      await UDABindAccount(response, sessionData, renewToken);
    }
  }
}
