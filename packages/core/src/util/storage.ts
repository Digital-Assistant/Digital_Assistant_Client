// packages/core/src/util/storage.ts
// Framework-agnostic storage helpers backed by browser storage.
// These mirror the UI storage helpers so UI and core can share the same keys.

import TSON from 'typescript-json';

/**
 * Persist data into Web Storage (localStorage by default).
 * If isRaw=false, value will be JSON-stringified using TSON to preserve types.
 */
export const setToStore = (data: any, key: string, isRaw: boolean): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  window.localStorage.setItem(key, !isRaw ? TSON.stringify(data) : data);
};

/**
 * Retrieve data from Web Storage (localStorage by default).
 * If isRaw=false, value will be JSON-parsed.
 */
export const getFromStore = (key: string, isRaw: boolean): any => {
  if (typeof window === 'undefined' || !window.localStorage) return undefined;
  const data = window.localStorage.getItem(key);
  if (data == null) return undefined;
  return !isRaw ? JSON.parse(data) : data;
};

/**
 * Remove a value from Web Storage
 */
export const removeFromStore = (key: string): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  window.localStorage.removeItem(key);
};
