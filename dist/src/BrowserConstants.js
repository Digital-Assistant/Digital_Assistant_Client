import { CONFIG } from "./config";
export let UDABrowserPlugin = false;
export let UDASessionName = CONFIG.USER_AUTH_DATA_KEY;
export let activeTabId = -1;
export let enablePlugin = false;
export let browserVar;
const { detect } = require('detect-browser');
const browser = detect();
switch (browser && browser.name) {
    case 'edge-chromium':
    case 'edge':
    case 'edge-ios':
    case 'chrome':
        enablePlugin = true;
        browserVar = chrome;
        break;
    default:
        browserVar = browser;
        break;
}
export const updateBrowserPlugin = (plugin) => {
    UDABrowserPlugin = plugin;
};
export const updateSessionName = (sessionName) => {
    UDASessionName = UDASessionName + "-" + sessionName;
};
export const updateActiveTabId = (tabId) => {
    activeTabId = tabId;
};
//# sourceMappingURL=BrowserConstants.js.map