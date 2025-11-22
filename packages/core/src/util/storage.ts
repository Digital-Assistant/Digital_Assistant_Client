/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file Manages browser storage functionalities, adapting to different browser environments.
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { detect } from 'detect-browser';

declare const chrome: any; // Declare `chrome` global for TypeScript.

// Detect the current browser environment.
const browser = detect();
let browserVar: any; // Variable to hold the browser-specific API (e.g., `chrome` or `window`).
let enablePlugin = false; // Flag to indicate if a browser extension environment is detected.

// If the browser is Chrome or Edge, assume a browser extension environment.
if (browser && (browser.name === 'chrome' || browser.name.startsWith('edge'))) {
  enablePlugin = true;
  browserVar = chrome; // Use the `chrome` API for storage.
} else {
  browserVar = browser; // Fallback to `window.localStorage` if not a recognized extension environment.
}

/**
 * A utility class for handling storage operations in different browser environments.
 * It abstracts the underlying storage mechanism, allowing for seamless interaction
 * with either the browser's `localStorage` or a browser extension's `chrome.storage.local`.
 */
export class StorageUtil {
  /**
   * A static flag indicating whether the UDA browser plugin is enabled.
   * This flag can be set externally to control the storage behavior.
   */
  public static UDABrowserPlugin = false;

  /**
   * Adds data to the appropriate storage mechanism (extension storage or local storage).
   *
   * @param data The data to be added.
   * @param key The key under which to store the data.
   * @param convertToString If `true`, the data will be JSON.stringified before storing. Defaults to `true`.
   * @returns A Promise that resolves when the data is successfully added to the storage.
   */
  public static async add(data: any, key: string, convertToString: boolean = true): Promise<void> {
    if (this.UDABrowserPlugin && enablePlugin) {
      const storageData: { [key: string]: any } = {};
      storageData[key] = (convertToString)?JSON.stringify(data):data;
      return browserVar.storage.local.set(storageData);
    } else {
      const storageData = (convertToString)?JSON.stringify(data):data;
      return window.localStorage.setItem(key, storageData);
    }
  }

  /**
   * Retrieves data from the appropriate storage mechanism.
   *
   * @param key The key associated with the data to be retrieved.
   * @param parseAsJson If `true`, the retrieved data will be JSON.parsed. Defaults to `true`.
   * @returns A Promise that resolves with the retrieved data, or `null` if the key is not found.
   */
  public static async get(key: string, parseAsJson: boolean = true): Promise<any> {
    if (this.UDABrowserPlugin && enablePlugin) {
      const result = await browserVar.storage.local.get([key]);
      if(result[key]){
          return (parseAsJson)?JSON.parse(result[key]):result[key];
      } else {
          return null;
      }
    } else {
      const item = window.localStorage.getItem(key);
      if(item){
          return (parseAsJson)?JSON.parse(item):item;
      } else {
          return null;
      }
    }
  }

  /**
   * Removes data from the appropriate storage mechanism.
   *
   * @param key The key associated with the data to be removed.
   * @returns A Promise that resolves when the data is successfully removed from the storage.
   */
  public static async remove(key: string): Promise<void> {
    if (this.UDABrowserPlugin && enablePlugin) {
      return browserVar.storage.local.remove([key]);
    } else {
      return window.localStorage.removeItem(key);
    }
  }

    /**
     * Sets data to `localStorage`. This method is a synchronous wrapper around `localStorage.setItem`.
     *
     * @param data The data to be stored.
     * @param key The key under which to store the data.
     * @param isRaw If `true`, the data is stored as-is; otherwise, it's JSON.stringified.
     */
    public static setToStore = (data: any, key: string, isRaw: boolean) => {
        localStorage.setItem(key, !isRaw ? JSON.stringify(data) : data);
    };

    /**
     * Retrieves data from `localStorage`. This method is a synchronous wrapper around `localStorage.getItem`.
     *
     * @param key The key associated with the data to be retrieved.
     * @param isRaw If `true`, the data is returned as a raw string; otherwise, it's JSON.parsed.
     * @returns The retrieved data, or `undefined` if the key is not found.
     */
    public static getFromStore = (key: string, isRaw: boolean) => {
        const data = localStorage.getItem(key);
        if (data) return !isRaw ? JSON.parse(data) : data;
    };
}
