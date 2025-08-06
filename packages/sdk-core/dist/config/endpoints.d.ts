/**
 * Author: Lakshman Veti
 * Type: MAP
 * Objective: Config Objects
 */
export declare const CONFIG: {
    apiHost: string;
    apiHostDev: string;
    apiHostProd: string;
    UDA_DATA_KEY: string;
    current: string;
    UDADebug: boolean;
    UDA_CONTAINER_CLASS: string;
    UDA_CLICK_IGNORE_CLASS: string;
    UDA_DOMAIN: string | undefined;
    UDA_API_URL: string;
    UDASessionID: string;
    UDA_POST_INTERVAL: number;
    UDALastMutationTime: number;
    UDALogLevel: number;
    RECORDING_IS_PLAYING: string;
    RECORDING_MANUAL_PLAY: string;
    RECORDING_SWITCH_KEY: string;
    RECORDING_SEQUENCE: string;
    SELECTED_RECORDING: string;
    USER_AUTH_DATA_KEY: string;
    UserScreenAcceptance: string;
    USER_SESSION_KEY: string;
    UDAKeyCloakKey: string;
    UDA_SESSION_KEY: string;
    USER_SESSION_ID: string;
    SYNC_INTERVAL: number;
    AUTO_PLAY_SLEEP_TIME: number;
    JARO_WEIGHT: number;
    JARO_WEIGHT_PERSONAL: number;
    lastClickedTime: null;
    specialNodeKey: string;
    enableInfiniteScroll: boolean;
    enableInfiniteScrollPageLength: number;
    UDA_URL_Param: string;
    Environment: string;
    DEBOUNCE_INTERVAL: number;
    indexInterval: number;
    clickObjects: never[];
    nodeId: number;
    isRecording: boolean;
    htmlIndex: never[];
    invokeTime: number;
    apiInvokeTime: number;
    maxStringLength: number;
    playNextAction: boolean;
    navigatedToNextPage: {
        check: boolean;
        url: string;
    };
    ignoreElements: string[];
    ignoreAttributes: string[];
    innerTextWeight: number;
    ignoreNodesFromIndexing: string[];
    ignoreNodesContainingClassNames: string[];
    cancelRecordingDuringRecordingNodes: never[];
    addClickToSpecialNodes: string[];
    ignoreClicksOnSpecialNodes: string[];
    customNameForSpecialNodes: {
        'ngb-datepicker': string;
        'mat-datepicker-content': string;
        'ngx-daterangepicker-material': string;
    };
    specialInputClickClassNames: string[];
    commonTags: string[];
    tooltipDisplayedNodes: never[];
    autoplayCompleted: boolean;
    autoplayPaused: boolean;
    invokedActionManually: boolean;
    personalNodeIgnoreAttributes: string[];
    profanity: {
        enabled: boolean;
        provider: string;
        config: {
            key1: string | undefined;
            key2: string | undefined;
            endPoint: string | undefined;
            region: string | undefined;
        };
    };
    multilingual: {
        enabled: boolean;
        searchInLang: string;
        selectedLang: string;
        displayText: string;
        translatedText: string;
        translate: {
            provider: string;
            apikey: string | undefined;
            translateTo: string;
            apiurl: string | undefined;
        };
    };
    bcpLang: (string | string[])[][];
    enableNodeTypeChangeSelection: boolean;
    enableNodeTypeSelection: boolean;
    cspUserAcceptance: {
        storageName: string;
        data: {
            proceed: boolean;
        };
    };
    screenAcceptance: {
        storageName: string;
        data: {
            proceed: boolean;
        };
    };
    ignoreDynamicAttributeText: string[];
};
export declare const ENDPOINT: {
    apiHost: string;
    apiHostDev: string;
    apiHostProd: string;
    Search: string;
    SearchWithPermissions: string;
    fetchRecord: string;
    SpecialNodes: string;
    ClickStream: string;
    Click: string;
    UpdateClick: string;
    DeleteRecording: string;
    UpdateRecording: string;
    RecordSequence: string;
    RecordSequenceData: string;
    ProfanityCheck: string;
    TranslateText: string;
    SessionKey: string;
    UserId: string;
    Vote: string;
    VoteRecord: string;
    Statuses: string;
};
