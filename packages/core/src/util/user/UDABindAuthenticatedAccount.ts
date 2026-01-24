//binding session key to the authenticated account
import {UDABindAccount} from "./UDABindAccount";
import {ENDPOINT} from "../../config/endpoints";
import {UDASessionData} from "../../models/UDASessionData";
import {apiClient} from "../../services";

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
  console.log(sessionData);
  let response = await apiClient.post(ENDPOINT.CheckUserId, authData);
  if(response){
    if (sessionData.sessionKey !== null) {
      console.log("Binding authenticated account with session key");
      console.log("Session key:", sessionData.sessionKey);
      await UDABindAccount(response, sessionData, renewToken);
    }
  }
}
