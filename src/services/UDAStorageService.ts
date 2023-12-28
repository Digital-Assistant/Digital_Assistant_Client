//storing the data to local storage
import {browserVar, UDABrowserPlugin} from "../BrowserConstants";

export const UDAStorageService = {
    /**
     * Adds data to the storage.
     * @param {any} data - The data to be added.
     * @param {string} key - The key to store the data under.
     * @returns {Promise<void>} - A Promise that resolves when the data is added to the storage.
     */
    add: async (data, key) => {
        if(UDABrowserPlugin === true) {
            let storageData = {};
            storageData[key] = data;
            return await browserVar.storage.local.set(storageData);
        } else {
            const storageData = JSON.stringify(data);
            return window.localStorage.setItem(key, storageData);
        }
    },
    /**
     * Retrieves data from the storage.
     *
     * @param {string} key - The key associated with the data to be retrieved.
     * @returns {Promise<any>} - A Promise that resolves with the retrieved data.
     */
    get: async (key) => {
        if(UDABrowserPlugin === true) {
            let result = await browserVar.storage.local.get([key]);
            return result[key];
        } else {
            return window.localStorage.getItem(key);
        }
    },
    /**
     * Removes data from the storage.
     *
     * @param {string} key - The key associated with the data to be removed.
     * @returns {Promise<void>} - A Promise that resolves when the data is successfully removed from the storage.
     */
    remove: async (key) => {
        if(UDABrowserPlugin === true) {
            return await browserVar.storage.local.remove([key]);
        } else {
            return window.localStorage.removeItem(key);
        }
    }
}
