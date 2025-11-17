import {detect} from "detect-browser";
declare const chrome: any;

export const checkBrowser = () => {
    const udaIdentifiedBrowser = detect();

    let enableUDAPlugin = false;

    let udaBrowserVar;

    const browser: any = detect();

    switch (udaIdentifiedBrowser && udaIdentifiedBrowser.name) {
        case 'edge-chromium':
        case 'edge':
        case 'edge-ios':
        case 'chrome':
            enableUDAPlugin = true;
            udaBrowserVar = chrome;
            break;
        default:
            if(typeof browser !== "undefined"){
                udaBrowserVar = browser;
            }
            break;
    }

    return {enableUDAPlugin: enableUDAPlugin, udaBrowserVar: udaBrowserVar, udaIdentifiedBrowser: udaIdentifiedBrowser};
}