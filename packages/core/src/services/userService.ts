import { store } from '../store';
import type { RootState } from '../store';

/**
 * Retrieves the user's ID from the Redux store
 * @returns The user's ID, or null if it could not be retrieved
 */
export const getUserId = (): string | null => {
  try {
    const state: RootState = (store as any).getState();
    const userState = state.user;

    // Check userSessionData first
    if (userState.userSessionData?.authData?.id) {
      return userState.userSessionData.authData.id;
    }

    // Check userData
    if (userState.userData?.id) {
      return userState.userData.id;
    }

    // Check keycloakSessionData
    if (userState.keycloakSessionData?.id) {
      return userState.keycloakSessionData.id;
    }

    return null;
  } catch (error) {
    console.error("Error retrieving user ID:", error);
    return null;
  }
};

/**
 * Retrieves the user's session key from the Redux store
 * @returns The user's session key, or null if it could not be retrieved
 */
export const getSessionKey = (): string | null => {
  try {
    const state: RootState = (store as any).getState();
    const userState = state.user;

    // Check userSessionData for sessionKey
    if (userState.userSessionData?.sessionKey) {
      return userState.userSessionData.sessionKey;
    }

    // Check userSessionId property
    if (userState.userSessionId) {
      return userState.userSessionId;
    }

    // Fallback to user ID
    return getUserId();
  } catch (error) {
    console.error("Error retrieving session key:", error);
    return null;
  }
};

/**
 * Gets the current user session ID
 * @returns User session ID or null
 */
export const getUserSessionId = (): string | null => {
  try {
    const state: RootState = (store as any).getState();
    return state.user.userSessionId || getUserId();
  } catch (error) {
    console.error("Error retrieving user session ID:", error);
    return null;
  }
};
