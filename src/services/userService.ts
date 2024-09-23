/**
 * @author Yureswar Ravuri
 */

import { getFromStore } from "../util";
import { CONFIG } from "../config";

/**
 * For getting user id from the storage
 */
/**
 * Retrieves the user's ID from the application's storage.
 * 
 * @returns {Promise<string | null>} The user's ID, or `null` if it could not be retrieved.
 * @throws {Error} If there was an error retrieving the user's ID.
 */
export const getUserId = async (): Promise<string | null> => {
  try {
    // Retrieve user session data from the store using the key defined in CONFIG.USER_AUTH_DATA_KEY
    const userSessionData = await getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);

    // Check if the userSessionData object exists, has an authData property, and the authData has an id property
    if (userSessionData && userSessionData.authData && userSessionData.authData.id) {
      // Return the user's ID from the authData object
      return userSessionData.authData.id;
    }

    // If the user's ID could not be found, return null
    return null;
  } catch (error) {
    // Log the error to the console
    console.error("Error retrieving user ID:", error);

    // Throw a new Error with a custom message
    throw new Error("Failed to retrieve user ID");
  }
}

/**
 * Retrieves the user's session key from the application's storage.
 * 
 * @returns {Promise<string | null>} The user's session key, or `null` if it could not be retrieved.
 * @throws {Error} If there was an error retrieving the user's session key.
 */
export const getSessionKey = async (): Promise<string | null> => {
  try {
    // Retrieve user session data from the store using the key defined in CONFIG.USER_AUTH_DATA_KEY
    const userSessionData = await getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);

    // Check if the userSessionData object exists and has a sessionKey property
    if (userSessionData && userSessionData.sessionKey) {
      // Return the user's session key
      return userSessionData.sessionKey;
    }

    /**
     * Handles the case where the user's session key could not be retrieved from the application's storage.
     * 
     * @returns {Promise<string | null>} `null` if the session key could not be retrieved.
     * @throws {Error} If there was an error retrieving the session key.
     */
    
    // If the user's session key could not be found, return null
    return null;
  } catch (error) {
    // Log the error to the console
    console.error("Error retrieving session key:", error);

    // Throw a new Error with a custom message
    throw new Error("Failed to retrieve session key");
  }
}
