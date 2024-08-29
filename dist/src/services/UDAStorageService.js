var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//storing the data to local storage
import { browserVar, UDABrowserPlugin } from "../BrowserConstants";
export const UDAStorageService = {
    /**
     * Adds data to the storage.
     * @param {any} data - The data to be added.
     * @param {string} key - The key to store the data under.
     * @returns {Promise<void>} - A Promise that resolves when the data is added to the storage.
     */
    add: (data, key) => __awaiter(void 0, void 0, void 0, function* () {
        if (UDABrowserPlugin === true) {
            let storageData = {};
            storageData[key] = data;
            return yield browserVar.storage.local.set(storageData);
        }
        else {
            const storageData = JSON.stringify(data);
            return window.localStorage.setItem(key, storageData);
        }
    }),
    /**
     * Retrieves data from the storage.
     *
     * @param {string} key - The key associated with the data to be retrieved.
     * @returns {Promise<any>} - A Promise that resolves with the retrieved data.
     */
    get: (key) => __awaiter(void 0, void 0, void 0, function* () {
        if (UDABrowserPlugin === true) {
            let result = yield browserVar.storage.local.get([key]);
            return result[key];
        }
        else {
            return window.localStorage.getItem(key);
        }
    }),
    /**
     * Removes data from the storage.
     *
     * @param {string} key - The key associated with the data to be removed.
     * @returns {Promise<void>} - A Promise that resolves when the data is successfully removed from the storage.
     */
    remove: (key) => __awaiter(void 0, void 0, void 0, function* () {
        if (UDABrowserPlugin === true) {
            return yield browserVar.storage.local.remove([key]);
        }
        else {
            return window.localStorage.removeItem(key);
        }
    })
};
//# sourceMappingURL=UDAStorageService.js.map