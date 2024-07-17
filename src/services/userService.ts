import { getFromStore } from "../util";
import { CONFIG } from "../config";
import { UDAErrorLogger } from "../config/error-log";

/**
 * Retrieves the user's unique identifier from the application's storage.
 * 
 * This function attempts to retrieve the user's ID from the stored user authentication data. If the user session data is missing or invalid, an error is logged and `null` is returned.
 * 
 * @returns The user's unique identifier as a string, or `null` if the user ID could not be retrieved.
 */
export const getUserId = async (): Promise<string | null> => {
  try {
    // Retrieve user session data from storage
    const userSessionData = await getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
    
    // Check if userSessionData exists and is an object
    if (!userSessionData || typeof userSessionData !== 'object') {
      throw new Error('User session data is missing or invalid');
    }
    
    // Check if authData exists and has a valid id property
    if (!userSessionData.authData || typeof userSessionData.authData.id !== 'string') {
      throw new Error('User ID is missing or invalid');
    }
    
    // Return the user ID
    return userSessionData.authData.id;
  } catch (error) {
    // Log the error and return null if any error occurs
    UDAErrorLogger.error('Error retrieving user ID', error);
    return null;
  }
}

export const getSessionKey = async (): Promise<string | null> => {
  try {
    // Retrieve user session data from storage
    const userSessionData = await getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
    
    // Check if userSessionData exists and is an object
    if (!userSessionData || typeof userSessionData !== 'object') {
      throw new Error('User session data is missing or invalid');
    }
    
    // Check if sessionKey exists and is a string
    if (typeof userSessionData.sessionKey !== 'string') {
      throw new Error('Session key is missing or invalid');
    }
    
    // Return the session key
    return userSessionData.sessionKey;
  } catch (error) {
    // Log the error and return null if any error occurs
    UDAErrorLogger.error('Error retrieving session key', error);
    return null;
  }
}
