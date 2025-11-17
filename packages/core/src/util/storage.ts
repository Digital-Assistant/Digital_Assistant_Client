/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file Manages browser storage functionalities, adapting to different browser environments.
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { detect } from 'detect-browser';

declare const chrome: any;

const browser = detect();
let browserVar: any;
let enablePlugin = false;

if (browser && (browser.name === 'chrome' || browser.name.startsWith('edge'))) {
  enablePlugin = true;
  browserVar = chrome;
} else {
  browserVar = browser;
}

/**
 * A utility class for handling storage operations in different browser environments.
 * It abstracts the underlying storage mechanism, allowing for seamless interaction
 * with either the browser's local storage or a browser extension's storage.
 */
export class StorageUtil {
  /**
   * A flag indicating whether the browser plugin is enabled.
   */
  public static UDABrowserPlugin = false;

  /**
   * Adds data to the storage.
   *
   * @param data - The data to be added.
   * @param key - The key to store the data under.
   * @returns A Promise that resolves when the data is added to the storage.
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
   * Retrieves data from the storage.
   *
   * @param key - The key associated with the data to be retrieved.
   * @returns A Promise that resolves with the retrieved data.
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
   * Removes data from the storage.
   *
   * @param key - The key associated with the data to be removed.
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
     *
     * @param data
     * @param key
     * @param isRaw - is raw data or json
     */
    public static setToStore = (data: any, key: string, isRaw: boolean) => {
        localStorage.setItem(key, !isRaw ? JSON.stringify(data) : data);
    };

    /**
     *
     * @param key
     * @param isRaw - is raw data or json
     * @returns
     */
    public static getFromStore = (key: string, isRaw: boolean) => {
        const data = localStorage.getItem(key);
        if (data) return !isRaw ? JSON.parse(data) : data;
    };
}
