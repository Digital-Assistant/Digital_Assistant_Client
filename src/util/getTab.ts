import {activeTabId, browserVar, UDABrowserPlugin} from "../BrowserConstants";

/**
 * Retrieves the active tab from the browser.
 *
 * @return {Promise<Object>} The active tab object.
 */
export const getTab = async () => {
    let queryOptions = {active: true, currentWindow: true};
    let tab = (await browserVar.tabs.query(queryOptions))[0];
    if (tab) {
        return tab;
    } else if(activeTabId !== -1){
        tab = await browserVar.tabs.get(activeTabId);
        if (tab) {
            return tab;
        } else {
            console.log('No active tab identified.');
            return false;
        }
    } else {
        return false;
    }
}
