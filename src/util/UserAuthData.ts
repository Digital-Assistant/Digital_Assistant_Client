//adding the sessionKey to the authid
import {UDASendSessionData} from "./UDASendSessionData";
import {UDAStoreSessionData} from "../AuthService";
import {invokeApi} from "./invokeApi";
import {ENDPOINT} from "../config/endpoints";

export const UDABindAccount = async (userAuthData, UDASessionData) => {
  let userSessionData = {userauthid: userAuthData.id, usersessionid: UDASessionData.sessionkey};

  let response = await invokeApi(ENDPOINT.CheckUserSession, "POST", userSessionData);
  if(response){
    UDAStoreSessionData(UDASessionData);
    UDASendSessionData(UDASessionData, "UDAAuthenticatedUserSessionData");
  }
}
