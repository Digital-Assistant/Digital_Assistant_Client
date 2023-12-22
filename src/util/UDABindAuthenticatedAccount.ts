//binding session key to the authenticated account
import {UDABindAccount} from "./UserAuthData";
import {invokeApi} from "./invokeApi";
import {ENDPOINT} from "../config/endpoints";

/**
 * Binds the authenticated account with UDASessionData.
 * @param {any} UDASessionData - The UDA session data.
 * @param {boolean} [renewToken=false] - Flag indicating whether to renew the token.
 * @returns {Promise<void>} A Promise that resolves when the binding is complete.
 */
export const UDABindAuthenticatedAccount = async (UDASessionData: any, renewToken: boolean = false) => {
  let authData = {
    authid: UDASessionData.authdata.id,
    emailid: UDASessionData.authdata.email,
    authsource: UDASessionData.authenticationsource
  };
  let response = await invokeApi(ENDPOINT.CheckUserId, "POST", authData);
  if(response){
    if (UDASessionData.sessionkey !== null) {
      await UDABindAccount(response, UDASessionData, renewToken);
    }
  }
}
