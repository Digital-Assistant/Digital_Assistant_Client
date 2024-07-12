import { getFromStore } from "../util";
import { CONFIG } from "../config";
import { UDAErrorLogger } from "../config/error-log";

export const getUserId = async (): Promise<string | null> => {
  try {
    const userSessionData = await getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
    if (!userSessionData || typeof userSessionData !== 'object') {
      throw new Error('User session data is missing or invalid');
    }
    if (!userSessionData.authData || typeof userSessionData.authData.id !== 'string') {
      throw new Error('User ID is missing or invalid');
    }
    return userSessionData.authData.id;
  } catch (error) {
    UDAErrorLogger.error('Error retrieving user ID', error);
    return null;
  }
}

export const getSessionKey = async (): Promise<string | null> => {
  try {
    const userSessionData = await getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
    if (!userSessionData || typeof userSessionData !== 'object') {
      throw new Error('User session data is missing or invalid');
    }
    if (typeof userSessionData.sessionKey !== 'string') {
      throw new Error('Session key is missing or invalid');
    }
    return userSessionData.sessionKey;
  } catch (error) {
    UDAErrorLogger.error('Error retrieving session key', error);
    return null;
  }
}
