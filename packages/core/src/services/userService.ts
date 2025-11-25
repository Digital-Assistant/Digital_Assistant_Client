// packages/core/src/services/userService.ts
import { store } from '../store';
import type { RootState } from '../store';

/**
 * Check that a value is a non-empty string.
 * @param v - value to check
 * @returns true when v is a trimmed, non-empty string
 */
const isNonEmptyString = (v: unknown): v is string =>
    typeof v === 'string' && v.trim().length > 0;

/**
 * Check that a value is a finite number.
 * @param v - value to check
 * @returns true when v is a finite number
 */
const isFiniteNumber = (v: unknown): v is number =>
    typeof v === 'number' && Number.isFinite(v);

/**
 * Safely parse a JSON value that may already be an object or a JSON string.
 * Returns `null` for invalid input or failed parsing.
 *
 * - If input is `null`/`undefined` returns `null`.
 * - If input is already an object returns it as-is.
 * - If input is a non-empty string attempts JSON.parse and returns `null` on error.
 *
 * @typeParam T - expected parsed type
 * @param input - JSON string or object to parse
 * @returns parsed value or `null`
 */
const safeParseJson = <T = any>(input: unknown): T | null => {
    if (input == null) return null;
    // Already parsed object -> return directly
    if (typeof input === 'object') return input as T;
    // Only attempt to parse meaningful non-empty strings
    if (!isNonEmptyString(input)) return null;
    try {
        return JSON.parse(input as string) as T;
    } catch {
        // Parsing failed -> treat as missing
        return null;
    }
};

/**
 * Extract `authData` from a user state object which may store `authData`
 * as either a string (JSON) or already-parsed object.
 *
 * The stored value can be either:
 * - a raw object with `authData` fields
 * - a JSON string representing that object
 *
 * @param userState - the `user` slice from the app state
 * @returns object containing `id` and/or `token` fields, or `null`
 */
const extractAuthData = (userState: any): { id?: unknown; token?: unknown } | null => {
    // Attempt to read the stored authData entry
    const raw = userState?.userSessionData?.authData;
    if (!raw) return null;

    // Try to normalize the possibly-string value into an object
    const parsed = safeParseJson<any>(raw);
    if (!parsed) return null;

    // Some stores wrap the actual auth fields inside `.authData`
    const auth = parsed?.authData ?? parsed;

    // Ensure final value is an object
    return typeof auth === 'object' ? auth : null;
};

/**
 * Normalize a value to a string when possible.
 * Accepts non-empty strings and finite numbers; returns `null` otherwise.
 *
 * @param value - value to normalize
 * @returns string representation or `null`
 */
const normalizeToString = (value: unknown): string | null => {
    if (isNonEmptyString(value)) return value;
    if (isFiniteNumber(value)) return String(value);
    return null;
};

/**
 * Retrieve the current user id from the application store.
 *
 * The function checks multiple locations in this order:
 * 1. `user.userSessionData.authData` (parsed)
 * 2. `user.userSessionData.authData.id` (raw)
 * 3. `user.userData.id`
 * 4. `user.keycloakSessionData.id`
 *
 * Returns `null` when no valid id is found or on error.
 *
 * @returns resolved user id or `null`
 */
export const getUserId = async (): Promise<string | null> => {
    try {
        // Read state safely from the store (guard against missing store shape)
        const state: RootState | undefined = (store as any)?.getState?.();
        if (!state || typeof state !== 'object') {
            console.error('getUserId: invalid store state');
            return null;
        }

        const userState = state.user ?? null;
        if (!userState || typeof userState !== 'object') return null;

        // Use extractAuthData to safely get the authData object
        const authData = extractAuthData(userState);

        if (authData?.id) {
            const userId = normalizeToString(authData.id);
            if (userId) return userId;
        }

        // Check userData
        if (userState.userData?.id) {
            const userId = normalizeToString(userState.userData.id);
            if (userId) return userId;
        }

        // Check keycloakSessionData
        if (userState.keycloakSessionData?.id) {
            const userId = normalizeToString(userState.keycloakSessionData.id);
            if (userId) return userId;
        }

        return null;
    } catch (error) {
        // Log unexpected errors and return null to avoid throwing from helpers
        console.error('getUserId error:', error);
        return null;
    }
};

/**
 * Retrieve a session key or token from the application store.
 *
 * The function checks multiple locations in this order:
 * 1. `user.userSessionData.authData.token` (parsed)
 * 2. `user.userSessionData.sessionKey`
 * 3. `user.userSessionId`
 * 4. falls back to `getUserId()` if none found
 *
 * @returns session token/key or `null`
 */
export const getSessionKey = async (): Promise<string | null> => {
    try {
        const state: RootState | undefined = (store as any)?.getState?.();
        if (!state || typeof state !== 'object') {
            console.error('getSessionKey: invalid store state');
            return null;
        }

        const userState = state.user ?? null;
        if (!userState || typeof userState !== 'object') return null;

        if(userState?.userSessionData?.sessionKey) {
            return userState.userSessionData.sessionKey;
        }

        return null;
    } catch (error) {
        console.error('getSessionKey error:', error);
        return null;
    }
};

/**
 * Retrieve the user session id from the application store.
 *
 * Checks:
 * 1. `user.userSessionId`
 * 2. falls back to `getUserId()` if not present
 *
 * @returns session id or `null`
 */
export const getUserSessionId = async (): Promise<string | null> => {
    try {
        const state: RootState | undefined = (store as any)?.getState?.();
        if (!state || typeof state !== 'object') {
            console.error('getUserSessionId: invalid store state');
            return null;
        }

        // Prefer explicit userSessionId when present
        const userSessionId = normalizeToString(state.user?.userSessionId);
        if (userSessionId) return userSessionId;

        // Otherwise reuse user id resolution
        return await getUserId();
    } catch (error) {
        console.error('getUserSessionId error:', error);
        return null;
    }
};

export class UserService {
    /**
     * Retrieves the current user ID from the application store.
     * @returns A promise that resolves to the user ID string or null if not found.
     */
    public async getUserId(): Promise<string | null> {
        return getUserId();
    }

    /**
     * Retrieves a session key or token from the application store.
     * @returns A promise that resolves to the session key string or null if not found.
     */
    public async getSessionKey(): Promise<string | null> {
        return getSessionKey();
    }

    /**
     * Retrieves the user session ID from the application store.
     * @returns A promise that resolves to the user session ID string or null if not found.
     */
    public async getUserSessionId(): Promise<string | null> {
        return getUserSessionId();
    }
}
