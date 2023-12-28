import {browserVar, UDABrowserPlugin} from "../BrowserConstants";

export let activeTabId: number;

/**
 * Storing the active tab id to fetch for further data.
 */
if(UDABrowserPlugin) {
    browserVar.tabs.onActivated.addListener(function (activeInfo) {
        activeTabId = activeInfo.tabId;
    });
}

/**
 * Retrieves the active tab from the browser.
 *
 * @return {Promise<Object>} The active tab object.
 */
export const getTab = async () => {
    let queryOptions = {active: true, currentWindow: true};
    let tab = (await browserVar.tabs.query(queryOptions))[0];
    // let tab = await browserVar.tabs.getCurrent();
    if (tab) {
        return tab;
    } else {
        tab = await browserVar.tabs.get(activeTabId);
        if (tab) {
            return tab;
        } else {
            console.log('No active tab identified.');
        }
    }
    return tab;
}
