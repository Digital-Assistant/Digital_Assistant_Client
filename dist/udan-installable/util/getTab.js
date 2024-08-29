var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { activeTabId, browserVar } from "../BrowserConstants";
/**
 * Retrieves the active tab from the browser.
 *
 * @return {Promise<Object>} The active tab object.
 */
export const getTab = () => __awaiter(void 0, void 0, void 0, function* () {
    let queryOptions = { active: true, currentWindow: true };
    let tab = (yield browserVar.tabs.query(queryOptions))[0];
    if (tab) {
        return tab;
    }
    else if (activeTabId !== -1) {
        tab = yield browserVar.tabs.get(activeTabId);
        if (tab) {
            return tab;
        }
        else {
            console.log('No active tab identified.');
            return false;
        }
    }
    else {
        return false;
    }
});
