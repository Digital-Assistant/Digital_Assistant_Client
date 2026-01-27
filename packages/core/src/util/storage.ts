/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file Manages browser storage functionalities, adapting to different browser environments.
c *
 * Supports:
 * - Chrome/Edge/Chromium (chrome.storage API)
 * - Firefox (browser.storage API)
 * - Safari (browser.storage API)
 * - Opera (chrome.storage API)
 * - Brave (chrome.storage API)
 * - Service Workers (all browsers)
 * - Standalone Web Apps (localStorage)
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { detect } from 'detect-browser';

// Declare globals for different browser extension APIs
declare const chrome: any;
declare const browser: any; // Firefox, Safari use 'browser' namespace

/**
 * Get the appropriate browser extension API
 * Priority: browser API (Firefox/Safari) > chrome API (Chrome/Edge/Opera/Brave)
 */
function getBrowserAPI(): any {
  // Firefox, Safari use 'browser' namespace
  if (typeof browser !== 'undefined' && browser.storage) {
    return browser;
  }
  // Chrome, Edge, Opera, Brave use 'chrome' namespace
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return chrome;
  }
  return null;
}

// Detect the current browser environment.
const detectedBrowser = detect();
const browserAPI = getBrowserAPI();
let browserVar: any = browserAPI; // Variable to hold the browser-specific API
let enablePlugin = false; // Flag to indicate if a browser extension environment is detected.
let isServiceWorker = false; // Flag to indicate if running in a service worker context

// Check if we're in a service worker context (no window object)
if (typeof window === 'undefined' && typeof self !== 'undefined') {
  isServiceWorker = true;
}

// Detect browser extension environment for all Chromium-based and Firefox browsers
if (detectedBrowser) {
  const browserName = detectedBrowser.name.toLowerCase();
  const extensionBrowsers = [
    'chrome',
    'edge',
    'edge-chromium',
    'edge-ios',
    'firefox',
    'safari',
    'opera',
    'brave',
    'chromium-webview'
  ];

  if (extensionBrowsers.some(name => browserName.includes(name))) {
    enablePlugin = true;
    browserVar = browserAPI || detectedBrowser;
  } else {
    browserVar = detectedBrowser;
  }
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
    const extensionAPI = getBrowserAPI();

    // Try browser extension storage first (works in all browsers)
    if (this.UDABrowserPlugin && enablePlugin && browserVar?.storage) {
      const storageData: { [key: string]: any } = {};
      storageData[key] = (convertToString)?JSON.stringify(data):data;
      return browserVar.storage.local.set(storageData);
    } else if (isServiceWorker && extensionAPI?.storage) {
      // Service worker context - use extension API (cross-browser)
      const storageData: { [key: string]: any } = {};
      storageData[key] = (convertToString)?JSON.stringify(data):data;
      return extensionAPI.storage.local.set(storageData);
    } else if (typeof window !== 'undefined' && window.localStorage) {
      // Web context - use localStorage
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
    const extensionAPI = getBrowserAPI();

    // Try browser extension storage first (works in all browsers)
    if (this.UDABrowserPlugin && enablePlugin && browserVar?.storage) {
      const result = await browserVar.storage.local.get([key]);
      if(result[key]){
          return (parseAsJson)?JSON.parse(result[key]):result[key];
      } else {
          return null;
      }
    } else if (isServiceWorker && extensionAPI?.storage) {
      // Service worker context - use extension API (cross-browser)
      const result = await extensionAPI.storage.local.get([key]);
      if(result[key]){
          return (parseAsJson)?JSON.parse(result[key]):result[key];
      } else {
          return null;
      }
    } else if (typeof window !== 'undefined' && window.localStorage) {
      // Web context - use localStorage
      const item = window.localStorage.getItem(key);
      if(item){
          return (parseAsJson)?JSON.parse(item):item;
      } else {
          return null;
      }
    }
    return null;
  }

  /**
   * Removes data from the appropriate storage mechanism.
   *
   * @param key The key associated with the data to be removed.
   * @returns A Promise that resolves when the data is successfully removed from the storage.
   */
  public static async remove(key: string): Promise<void> {
    const extensionAPI = getBrowserAPI();

    // Try browser extension storage first (works in all browsers)
    if (this.UDABrowserPlugin && enablePlugin && browserVar?.storage) {
      return browserVar.storage.local.remove([key]);
    } else if (isServiceWorker && extensionAPI?.storage) {
      // Service worker context - use extension API (cross-browser)
      return extensionAPI.storage.local.remove([key]);
    } else if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.removeItem(key);
    }
  }

  /**
   * Clears all data from the appropriate storage mechanism.
   *
   * @returns A Promise that resolves when the storage is successfully cleared.
   */
  public static async clear(): Promise<void> {
    const extensionAPI = getBrowserAPI();

    // Try browser extension storage first (works in all browsers)
    if (this.UDABrowserPlugin && enablePlugin && browserVar?.storage) {
      return browserVar.storage.local.clear();
    } else if (isServiceWorker && extensionAPI?.storage) {
      // Service worker context - use extension API (cross-browser)
      return extensionAPI.storage.local.clear();
    } else if (typeof window !== 'undefined' && window.localStorage) {
      // Web context - use localStorage
      return window.localStorage.clear();
    }
  }

    /**
     * Sets data to storage. Checks for browser extension context first, then falls back to localStorage.
     * For browser extensions, this uses async storage (fire-and-forget).
     * For web context, this uses synchronous localStorage.
     *
     * @param data The data to be stored.
     * @param key The key under which to store the data.
     * @param isRaw If `true`, the data is stored as-is; otherwise, it's JSON.stringified.
     */
    public static setToStore = (data: any, key: string, isRaw: boolean) => {
        const extensionAPI = getBrowserAPI();
        const serializedData = !isRaw ? JSON.stringify(data) : data;

        // Browser extension context - use extension storage (async, fire-and-forget)
        if (this.UDABrowserPlugin && enablePlugin && browserVar?.storage) {
            const storageData: { [key: string]: any } = {};
            storageData[key] = serializedData;
            browserVar.storage.local.set(storageData).catch((err: Error) => {
                console.error(`Error saving ${key} to extension storage:`, err);
            });
        } else if (isServiceWorker && extensionAPI?.storage) {
            // Service worker context - use extension API (cross-browser, async, fire-and-forget)
            const storageData: { [key: string]: any } = {};
            storageData[key] = serializedData;
            extensionAPI.storage.local.set(storageData).catch((err: Error) => {
                console.error(`Error saving ${key} to extension storage:`, err);
            });
        } else if (typeof window !== 'undefined' && window.localStorage) {
            // Web context - use localStorage (synchronous)
            window.localStorage.setItem(key, serializedData);
        } else {
            console.warn('Storage not available. Use async methods instead.');
        }
    };

    /**
     * Retrieves data from storage. This is a synchronous method that only works with localStorage.
     * For browser extension/service worker contexts, use the async `get()` method instead.
     *
     * @param key The key associated with the data to be retrieved.
     * @param isRaw If `true`, the data is returned as a raw string; otherwise, it's JSON.parsed.
     * @returns The retrieved data, or `undefined` if the key is not found or in service worker context.
     */
    public static getFromStore = (key: string, isRaw: boolean) => {
        const extensionAPI = getBrowserAPI();

        // Check if we're in a browser extension or service worker context
        if ((this.UDABrowserPlugin && enablePlugin && browserVar?.storage) ||
            (isServiceWorker && extensionAPI?.storage)) {
            console.warn(`getFromStore() is synchronous and cannot access extension storage. Use async get() method instead for key: ${key}`);
            return undefined;
        }

        // Web context - use localStorage (synchronous)
        if (typeof window !== 'undefined' && window.localStorage) {
            const data = window.localStorage.getItem(key);
            if (data) return !isRaw ? JSON.parse(data) : data;
        } else {
            console.warn('Storage not available. Use async get() method instead.');
            return undefined;
        }
    };
}

/**
 * Compatibility export for UDAStorageService
 * This provides backward compatibility with the extension layer
 * Maps to StorageUtil methods
 */
export const UDAStorageService = {
    /**
     * Adds data to the storage.
     * @param data - The data to be added.
     * @param key - The key to store the data under.
     * @returns A Promise that resolves when the data is added to the storage.
     */
    add: async (data: any, key: string): Promise<void> => {
        return StorageUtil.add(data, key, false);
    },

    /**
     * Sets data to the storage (alias for add).
     * @param key - The key to store the data under.
     * @param data - The data to be added.
     * @returns A Promise that resolves when the data is added to the storage.
     */
    set: async (key: string, data: any): Promise<void> => {
        return StorageUtil.add(data, key, false);
    },

    /**
     * Retrieves data from the storage.
     * @param key - The key associated with the data to be retrieved.
     * @returns A Promise that resolves with the retrieved data.
     */
    get: async (key: string): Promise<any> => {
        return StorageUtil.get(key, false);
    },

    /**
     * Removes data from the storage.
     * @param key - The key associated with the data to be removed.
     * @returns A Promise that resolves when the data is successfully removed from the storage.
     */
    remove: async (key: string): Promise<void> => {
        return StorageUtil.remove(key);
    },

    /**
     * Clears all data from the storage.
     * @returns A Promise that resolves when the storage is successfully cleared.
     */
    clear: async (): Promise<void> => {
        return StorageUtil.clear();
    }
};
