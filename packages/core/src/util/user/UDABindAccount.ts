//adding the sessionKey to the authid
import {UDASendSessionData} from "./UDASendSessionData";
import { ENDPOINT } from "../../config";
import {StorageUtil} from "../storage";
import {getUDASessionName} from "../browser";
import {UDASessionData} from "../../models/UDASessionData";
import {apiClient} from "../../services";


/**
 * Binds the user account with UDASessionData.
 * @param {Object} userAuthData - User authentication data.
 * @param {Object} UDASessionData - UDA session data.
 * @param {boolean} renewToken - Flag indicating whether to renew the token.
 * @returns {Promise<void>} Promise that resolves when the binding is complete.
 */
export const UDABindAccount = async (userAuthData: any, UDASessionData: UDASessionData, renewToken: any) => {
  const payLoad = {uid: UDASessionData.authData.id, email: UDASessionData.authData.email, realm: window.UDAGlobalConfig.realm, clientId: window.UDAGlobalConfig.clientId, clientSecret: window.UDAGlobalConfig.clientSecret};
  const authToken: any = await apiClient.post(process.env.tokenUrl+ENDPOINT.tokenUrl, payLoad);
  if(authToken && authToken?.token) {
    UDASessionData.authData.token = authToken.token;
    let userSessionData: any = {userauthid: userAuthData.id, usersessionid: UDASessionData.sessionKey};
    let response = await apiClient.post(ENDPOINT.CheckUserSession, userSessionData);
    if(response){
      await StorageUtil.add(UDASessionData, getUDASessionName());
      await UDASendSessionData(UDASessionData, "UDAAuthenticatedUserSessionData");
    }
  }
}
