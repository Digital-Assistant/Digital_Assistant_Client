/**
 * @file Browser detection and enabling UDA plugin
 */
import {detect} from "detect-browser";
declare const chrome: any;

/**
 * Detects the browser and returns whether the UDA plugin is enabled, the browser variable, and the identified browser.
 * @returns {{enableUDAPlugin: boolean, udaBrowserVar: any, udaIdentifiedBrowser: (false | BrowserInfo | BotInfo)}}
 */
export const checkBrowser = () => {
    const udaIdentifiedBrowser = detect();

    let enableUDAPlugin = false;
    let udaBrowserVar: any = undefined; // Initialize to undefined

    switch (udaIdentifiedBrowser && udaIdentifiedBrowser.name) {
        case 'edge-chromium':
        case 'edge':
        case 'edge-ios':
        case 'chrome':
        case 'opera': // Added 'opera' here
            enableUDAPlugin = true;
            udaBrowserVar = chrome;
            break;
        default:
            // If udaIdentifiedBrowser is null, udaBrowserVar remains undefined.
            // If it's an unknown browser object, assign it.
            if (udaIdentifiedBrowser !== null) {
                udaBrowserVar = udaIdentifiedBrowser;
            }
            break;
    }

    return {enableUDAPlugin: enableUDAPlugin, udaBrowserVar: udaBrowserVar, udaIdentifiedBrowser: udaIdentifiedBrowser};
}
