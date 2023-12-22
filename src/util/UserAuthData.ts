//adding the sessionKey to the authid
import {UDASendSessionData} from "./UDASendSessionData";
import {UDAStoreSessionData} from "../AuthService";
import {invokeApi} from "./invokeApi";
import {ENDPOINT} from "../config/endpoints";
import {CustomConfig} from "../config/CustomConfig";

global.UDAGlobalConfig = CustomConfig;

/**
 * Binds the user account with UDASessionData.
 * @param {Object} userAuthData - User authentication data.
 * @param {Object} UDASessionData - UDA session data.
 * @param {boolean} renewToken - Flag indicating whether to renew the token.
 * @returns {Promise<void>} Promise that resolves when the binding is complete.
 */
export const UDABindAccount = async (userAuthData, UDASessionData, renewToken) => {
  const payLoad = {uid: UDASessionData.authdata.id, email: UDASessionData.authdata.email, realm: global.UDAGlobalConfig.realm, clientId: global.UDAGlobalConfig.clientId, clientSecret: global.UDAGlobalConfig.clientSecret};
  const authToken = await invokeApi(process.env.tokenUrl+ENDPOINT.tokenUrl,"POST", payLoad);
  if(authToken && authToken?.token) {
    UDASessionData.authdata.token = authToken.token;
    let userSessionData = {userauthid: userAuthData.id, usersessionid: UDASessionData.sessionkey};

    let response = await invokeApi(ENDPOINT.CheckUserSession, "POST", userSessionData);
    if(response){
      UDAStoreSessionData(UDASessionData);
      UDASendSessionData(UDASessionData, "UDAAuthenticatedUserSessionData");
    }
  }
}
