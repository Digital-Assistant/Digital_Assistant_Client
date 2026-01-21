/**
 * @file This file contains constants and functions related to browser detection and plugin state.
 *
 * Supports all major browsers:
 * - Chrome, Edge, Chromium (chrome API)
 * - Firefox (browser API)
 * - Safari (browser API)
 * - Opera, Brave (chrome API)
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
 * The browser variable - holds the appropriate API (chrome or browser)
 */
let browserVar: any;

const { detect } = require('detect-browser');

/**
 * The detected browser object.
 */
const browser: any = detect();

// Declare both chrome and browser globals for cross-browser support
declare const chrome: any;
declare const browserAPI: any;

/**
 * Get the appropriate browser extension API
 * Firefox/Safari use 'browser', Chrome/Edge/Opera/Brave use 'chrome'
 */
function getBrowserExtensionAPI(): any {
    // Try 'browser' namespace first (Firefox, Safari)
    if (typeof browserAPI !== 'undefined' && browserAPI.storage) {
        return browserAPI;
    }
    // Try 'chrome' namespace (Chrome, Edge, Opera, Brave)
    if (typeof chrome !== 'undefined' && chrome.storage) {
        return chrome;
    }
    // Fallback - try window.browser for Firefox
    if (typeof window !== 'undefined' && (window as any).browser && (window as any).browser.storage) {
        return (window as any).browser;
    }
    return null;
}

// Supported browser extensions
const supportedBrowsers = [
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

// Detect browser and set appropriate API
if (browser && browser.name) {
    const browserName = browser.name.toLowerCase();

    if (supportedBrowsers.some(name => browserName.includes(name))) {
        enablePlugin = true;
        browserVar = getBrowserExtensionAPI() || browser;
    } else {
        browserVar = browser;
    }
} else {
    // If detection fails, try to get extension API anyway
    browserVar = getBrowserExtensionAPI();
    if (browserVar) {
        enablePlugin = true;
    }
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
