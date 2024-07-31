/**
 * @author Yureswar Ravuri
 */

import {getFromStore} from "../util";
import {CONFIG} from "../config";

/**
 * For getting user id from the storage
 */
export const getUserId = async (): Promise<string | null> => {
  try {
    const userSessionData = await getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
    if (userSessionData && userSessionData.authData && userSessionData.authData.id) {
      return userSessionData.authData.id;
    }
    return null;
  } catch (error) {
    console.error("Error retrieving user ID:", error);
    throw new Error("Failed to retrieve user ID");
  }
}

/**
 * For getting session id from the storage
 */
export const getSessionKey = async (): Promise<string | null> => {
  try {
    const userSessionData = await getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
    if (userSessionData && userSessionData.sessionKey) {
      return userSessionData.sessionKey;
    }
    return null;
  } catch (error) {
    console.error("Error retrieving session key:", error);
    throw new Error("Failed to retrieve session key");
  }
}
