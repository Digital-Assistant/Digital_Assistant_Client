/**
 * @file This file contains constants and functions related to browser detection and plugin state.
 */
import {CONFIG} from "../../config";

/**
 * A boolean indicating whether the UDA browser plugin is active.
 */
let UDABrowserPlugin: boolean=false;

/**
 * The session name for UDA.
 */
let UDASessionName= CONFIG.USER_AUTH_DATA_KEY;

/**
 * The ID of the active tab.
 */
let activeTabId: number = -1;

/**
 * A boolean indicating whether the plugin is enabled for the current browser.
 */
let enablePlugin = false;

/**
 * The browser variable (e.g., `chrome` or the detected browser object).
 */
let browserVar: any;

const { detect } = require('detect-browser');

/**
 * The detected browser object.
 */
const browser: any = detect();
declare const chrome: any;

switch (browser && browser.name) {
    case 'edge-chromium':
    case 'edge':
    case 'edge-ios':
    case 'chrome':
    case 'opera':
        enablePlugin = true;
        browserVar = chrome;
        break;
    default:
        browserVar = browser;
        break;
}

/**
 * Updates the `UDABrowserPlugin` constant.
 * @param plugin - The new value.
 */
export const updateBrowserPlugin = (plugin: boolean) => {
    UDABrowserPlugin=plugin;
}

/**
 * Updates the `UDASessionName` constant.
 * @param sessionName - The new session name.
 */
export const updateSessionName = (sessionName: string) => {
    UDASessionName=CONFIG.USER_AUTH_DATA_KEY+"-"+sessionName;
}

/**
 * Updates the `activeTabId` constant.
 * @param tabId - The new tab ID.
 */
export const updateActiveTabId = (tabId: any) =>{
    activeTabId=tabId;
}

export const getUDABrowserPlugin = () => UDABrowserPlugin;
export const getUDASessionName = () => UDASessionName;
export const getActiveTabId = () => activeTabId;
export const getEnablePlugin = () => enablePlugin;
export const getBrowserVar = () => browserVar;
export const getBrowser = () => browser;
