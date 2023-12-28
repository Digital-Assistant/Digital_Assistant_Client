//adding the sessionKey to the authid
import {UDASendSessionData} from "./UDASendSessionData";
import {invokeApi} from "./invokeApi";
import {ENDPOINT} from "../config/endpoints";
import {CustomConfig} from "../config/CustomConfig";
import {UDASessionData} from "../models/UDASessionData";
import {UDAStorageService} from "../services/UDAStorageService";
import {UDASessionName} from "../BrowserConstants";

global.UDAGlobalConfig = CustomConfig;

/**
 * Binds the user account with UDASessionData.
 * @param {Object} userAuthData - User authentication data.
 * @param {Object} UDASessionData - UDA session data.
 * @param {boolean} renewToken - Flag indicating whether to renew the token.
 * @returns {Promise<void>} Promise that resolves when the binding is complete.
 */
export const UDABindAccount = async (userAuthData, UDASessionData: UDASessionData, renewToken) => {
  const payLoad = {uid: UDASessionData.authData.id, email: UDASessionData.authData.email, realm: global.UDAGlobalConfig.realm, clientId: global.UDAGlobalConfig.clientId, clientSecret: global.UDAGlobalConfig.clientSecret};
  const authToken = await invokeApi(process.env.tokenUrl+ENDPOINT.tokenUrl,"POST", payLoad);
  if(authToken && authToken?.token) {
    UDASessionData.authData.token = authToken.token;
    let userSessionData = {userauthid: userAuthData.id, usersessionid: UDASessionData.sessionKey};
    let response = await invokeApi(ENDPOINT.CheckUserSession, "POST", userSessionData);
    if(response){
      await UDAStorageService.add(UDASessionData, UDASessionName);
      await UDASendSessionData(UDASessionData, "UDAAuthenticatedUserSessionData");
    }
  }
}
