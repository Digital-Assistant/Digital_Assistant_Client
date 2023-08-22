//binding session key to the authenticated account
import {UDABindAccount} from "./UserAuthData";
import {invokeApi} from "./invokeApi";
import {ENDPOINT} from "../config/endpoints";

export const UDABindAuthenticatedAccount = async (UDASessionData: any) => {
  let authData = {
    authid: UDASessionData.authdata.id,
    emailid: UDASessionData.authdata.email,
    authsource: UDASessionData.authenticationsource
  };
  let response = await invokeApi(ENDPOINT.CheckUserId, "POST", authData);
  if(response){
    if (UDASessionData.sessionkey !== null) {
      await UDABindAccount(response, UDASessionData);
    }
  }
}
