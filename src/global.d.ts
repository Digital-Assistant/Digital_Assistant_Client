declare module "domJson";
declare module "lodash";
declare module "react-infinite-scroller";

declare global {
    interface Window {
        isRecording: boolean;
        domJSON: any;
        UDAGlobalConfig: any;
        UDAPluginSDK: any;
        UDAClickObjects: any;
        UDARemovedClickObjects: any;
    }
}

export {}