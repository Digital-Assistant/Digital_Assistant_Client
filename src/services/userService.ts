/**
 * @author Yureswar Ravuri
 */

import {getFromStore} from "../util";
import {CONFIG} from "../config";

/**
 * For getting user id from the storage
 */
export const getUserId = async () => {
  let userSessionData = await getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
  if(userSessionData && userSessionData.authData){
    return userSessionData.authData.id;
  } else {
    return null;
  }
}

/**
 * For getting session id from the storage
 */
export const getSessionKey = async () => {
  let userSessionData = await getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
  if(userSessionData && userSessionData.sessionKey){
    return userSessionData.sessionKey;
  } else {
    return null;
  }
}
