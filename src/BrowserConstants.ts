import {CONFIG} from "./config";

export let UDABrowserPlugin: boolean=false;

export let UDASessionName=CONFIG.USER_AUTH_DATA_KEY;

declare const chrome;

export let enablePlugin = false;

export let browserVar: any;

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

export const updateBrowserPlugin = (plugin: boolean) => {
    UDABrowserPlugin=plugin;
}

export const updateSessionName = (sessionName: string) => {
    UDASessionName=UDASessionName+"-"+sessionName;
}
