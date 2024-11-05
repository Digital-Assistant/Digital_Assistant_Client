var UdanLibrary;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/detect-browser/es/index.js":
/*!*************************************************!*\
  !*** ./node_modules/detect-browser/es/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BotInfo: () => (/* binding */ BotInfo),
/* harmony export */   BrowserInfo: () => (/* binding */ BrowserInfo),
/* harmony export */   NodeInfo: () => (/* binding */ NodeInfo),
/* harmony export */   ReactNativeInfo: () => (/* binding */ ReactNativeInfo),
/* harmony export */   SearchBotDeviceInfo: () => (/* binding */ SearchBotDeviceInfo),
/* harmony export */   browserName: () => (/* binding */ browserName),
/* harmony export */   detect: () => (/* binding */ detect),
/* harmony export */   detectOS: () => (/* binding */ detectOS),
/* harmony export */   getNodeVersion: () => (/* binding */ getNodeVersion),
/* harmony export */   parseUserAgent: () => (/* binding */ parseUserAgent)
/* harmony export */ });
/* provided dependency */ var process = __webpack_require__(/*! process/browser */ "./node_modules/process/browser.js");
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var BrowserInfo = /** @class */ (function () {
    function BrowserInfo(name, version, os) {
        this.name = name;
        this.version = version;
        this.os = os;
        this.type = 'browser';
    }
    return BrowserInfo;
}());

var NodeInfo = /** @class */ (function () {
    function NodeInfo(version) {
        this.version = version;
        this.type = 'node';
        this.name = 'node';
        this.os = process.platform;
    }
    return NodeInfo;
}());

var SearchBotDeviceInfo = /** @class */ (function () {
    function SearchBotDeviceInfo(name, version, os, bot) {
        this.name = name;
        this.version = version;
        this.os = os;
        this.bot = bot;
        this.type = 'bot-device';
    }
    return SearchBotDeviceInfo;
}());

var BotInfo = /** @class */ (function () {
    function BotInfo() {
        this.type = 'bot';
        this.bot = true; // NOTE: deprecated test name instead
        this.name = 'bot';
        this.version = null;
        this.os = null;
    }
    return BotInfo;
}());

var ReactNativeInfo = /** @class */ (function () {
    function ReactNativeInfo() {
        this.type = 'react-native';
        this.name = 'react-native';
        this.version = null;
        this.os = null;
    }
    return ReactNativeInfo;
}());

// tslint:disable-next-line:max-line-length
var SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
var SEARCHBOT_OS_REGEX = /(nuhk|curl|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/;
var REQUIRED_VERSION_PARTS = 3;
var userAgentRules = [
    ['aol', /AOLShield\/([0-9\._]+)/],
    ['edge', /Edge\/([0-9\._]+)/],
    ['edge-ios', /EdgiOS\/([0-9\._]+)/],
    ['yandexbrowser', /YaBrowser\/([0-9\._]+)/],
    ['kakaotalk', /KAKAOTALK\s([0-9\.]+)/],
    ['samsung', /SamsungBrowser\/([0-9\.]+)/],
    ['silk', /\bSilk\/([0-9._-]+)\b/],
    ['miui', /MiuiBrowser\/([0-9\.]+)$/],
    ['beaker', /BeakerBrowser\/([0-9\.]+)/],
    ['edge-chromium', /EdgA?\/([0-9\.]+)/],
    [
        'chromium-webview',
        /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/,
    ],
    ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
    ['phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/],
    ['crios', /CriOS\/([0-9\.]+)(:?\s|$)/],
    ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
    ['fxios', /FxiOS\/([0-9\.]+)/],
    ['opera-mini', /Opera Mini.*Version\/([0-9\.]+)/],
    ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
    ['opera', /OPR\/([0-9\.]+)(:?\s|$)/],
    ['pie', /^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],
    ['pie', /^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer) (\d+\.\d+);.*Windows CE.*\)$/],
    ['netfront', /^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],
    ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
    ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
    ['ie', /MSIE\s(7\.0)/],
    ['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/],
    ['android', /Android\s([0-9\.]+)/],
    ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
    ['safari', /Version\/([0-9\._]+).*Safari/],
    ['facebook', /FB[AS]V\/([0-9\.]+)/],
    ['instagram', /Instagram\s([0-9\.]+)/],
    ['ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/],
    ['ios-webview', /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
    ['curl', /^curl\/([0-9\.]+)$/],
    ['searchbot', SEARCHBOX_UA_REGEX],
];
var operatingSystemRules = [
    ['iOS', /iP(hone|od|ad)/],
    ['Android OS', /Android/],
    ['BlackBerry OS', /BlackBerry|BB10/],
    ['Windows Mobile', /IEMobile/],
    ['Amazon OS', /Kindle/],
    ['Windows 3.11', /Win16/],
    ['Windows 95', /(Windows 95)|(Win95)|(Windows_95)/],
    ['Windows 98', /(Windows 98)|(Win98)/],
    ['Windows 2000', /(Windows NT 5.0)|(Windows 2000)/],
    ['Windows XP', /(Windows NT 5.1)|(Windows XP)/],
    ['Windows Server 2003', /(Windows NT 5.2)/],
    ['Windows Vista', /(Windows NT 6.0)/],
    ['Windows 7', /(Windows NT 6.1)/],
    ['Windows 8', /(Windows NT 6.2)/],
    ['Windows 8.1', /(Windows NT 6.3)/],
    ['Windows 10', /(Windows NT 10.0)/],
    ['Windows ME', /Windows ME/],
    ['Windows CE', /Windows CE|WinCE|Microsoft Pocket Internet Explorer/],
    ['Open BSD', /OpenBSD/],
    ['Sun OS', /SunOS/],
    ['Chrome OS', /CrOS/],
    ['Linux', /(Linux)|(X11)/],
    ['Mac OS', /(Mac_PowerPC)|(Macintosh)/],
    ['QNX', /QNX/],
    ['BeOS', /BeOS/],
    ['OS/2', /OS\/2/],
];
function detect(userAgent) {
    if (!!userAgent) {
        return parseUserAgent(userAgent);
    }
    if (typeof document === 'undefined' &&
        typeof navigator !== 'undefined' &&
        navigator.product === 'ReactNative') {
        return new ReactNativeInfo();
    }
    if (typeof navigator !== 'undefined') {
        return parseUserAgent(navigator.userAgent);
    }
    return getNodeVersion();
}
function matchUserAgent(ua) {
    // opted for using reduce here rather than Array#first with a regex.test call
    // this is primarily because using the reduce we only perform the regex
    // execution once rather than once for the test and for the exec again below
    // probably something that needs to be benchmarked though
    return (ua !== '' &&
        userAgentRules.reduce(function (matched, _a) {
            var browser = _a[0], regex = _a[1];
            if (matched) {
                return matched;
            }
            var uaMatch = regex.exec(ua);
            return !!uaMatch && [browser, uaMatch];
        }, false));
}
function browserName(ua) {
    var data = matchUserAgent(ua);
    return data ? data[0] : null;
}
function parseUserAgent(ua) {
    var matchedRule = matchUserAgent(ua);
    if (!matchedRule) {
        return null;
    }
    var name = matchedRule[0], match = matchedRule[1];
    if (name === 'searchbot') {
        return new BotInfo();
    }
    // Do not use RegExp for split operation as some browser do not support it (See: http://blog.stevenlevithan.com/archives/cross-browser-split)
    var versionParts = match[1] && match[1].split('.').join('_').split('_').slice(0, 3);
    if (versionParts) {
        if (versionParts.length < REQUIRED_VERSION_PARTS) {
            versionParts = __spreadArray(__spreadArray([], versionParts, true), createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length), true);
        }
    }
    else {
        versionParts = [];
    }
    var version = versionParts.join('.');
    var os = detectOS(ua);
    var searchBotMatch = SEARCHBOT_OS_REGEX.exec(ua);
    if (searchBotMatch && searchBotMatch[1]) {
        return new SearchBotDeviceInfo(name, version, os, searchBotMatch[1]);
    }
    return new BrowserInfo(name, version, os);
}
function detectOS(ua) {
    for (var ii = 0, count = operatingSystemRules.length; ii < count; ii++) {
        var _a = operatingSystemRules[ii], os = _a[0], regex = _a[1];
        var match = regex.exec(ua);
        if (match) {
            return os;
        }
    }
    return null;
}
function getNodeVersion() {
    var isNode = typeof process !== 'undefined' && process.version;
    return isNode ? new NodeInfo(process.version.slice(1)) : null;
}
function createVersionParts(count) {
    var output = [];
    for (var ii = 0; ii < count; ii++) {
        output.push('0');
    }
    return output;
}


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./src/BrowserConstants.ts":
/*!*********************************!*\
  !*** ./src/BrowserConstants.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UDABrowserPlugin: () => (/* binding */ UDABrowserPlugin),
/* harmony export */   UDASessionName: () => (/* binding */ UDASessionName),
/* harmony export */   activeTabId: () => (/* binding */ activeTabId),
/* harmony export */   browserVar: () => (/* binding */ browserVar),
/* harmony export */   enablePlugin: () => (/* binding */ enablePlugin),
/* harmony export */   updateActiveTabId: () => (/* binding */ updateActiveTabId),
/* harmony export */   updateBrowserPlugin: () => (/* binding */ updateBrowserPlugin),
/* harmony export */   updateSessionName: () => (/* binding */ updateSessionName)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ "./src/config/index.ts");

let UDABrowserPlugin = false;
let UDASessionName = _config__WEBPACK_IMPORTED_MODULE_0__.CONFIG.USER_AUTH_DATA_KEY;
let activeTabId = -1;
let enablePlugin = false;
let browserVar;
const { detect } = __webpack_require__(/*! detect-browser */ "./node_modules/detect-browser/es/index.js");
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
const updateBrowserPlugin = (plugin) => {
    UDABrowserPlugin = plugin;
};
const updateSessionName = (sessionName) => {
    UDASessionName = UDASessionName + "-" + sessionName;
};
const updateActiveTabId = (tabId) => {
    activeTabId = tabId;
};


/***/ }),

/***/ "./src/config/CustomConfig.ts":
/*!************************************!*\
  !*** ./src/config/CustomConfig.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomConfig: () => (/* binding */ CustomConfig)
/* harmony export */ });
/**
 * Author: Yureswar Ravuri
 * Type: MAP
 * Objective: Config Objects
 */
// assigning default values to the default configuration
const CustomConfig = {
    enableEditClickedName: false,
    enableSkipDuringPlay: false,
    enableTooltipAddition: true,
    enableMultilingual: false,
    enableNodeTypeSelection: true,
    enablePermissions: false,
    permissions: {},
    enableProfanity: false,
    enableRecording: true,
    enableOverlay: true,
    environment: 'PROD',
    enableUdaIcon: true,
    udaDivId: 'uda-nistapp-logo',
    enableForAllDomains: false,
    enableSpeechToText: true,
    enableSlowReplay: true,
    enableCustomIcon: false,
    customIcon: 'https://udan.nistapp.com/uda-logo.jpg',
    realm: "UDAN",
    clientId: "backend-service",
    clientSecret: "cXA2yFTq3ORQfrio2mGXttFaOTfvIC7N",
    enableHidePanelAfterCompletion: false,
    enableAISearch: true
};


/***/ }),

/***/ "./src/config/endpoints.ts":
/*!*********************************!*\
  !*** ./src/config/endpoints.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ENDPOINT: () => (/* binding */ ENDPOINT)
/* harmony export */ });
/**
 * Author: Lakshman Veti
 * Type: MAP
 * Objective: HTTP Endpoints
 */
const ENDPOINT = {
    CheckUserId: `/user/checkauthid`,
    GetSessionKey: `/user/getsessionkey`,
    CheckUserSession: `/user/checkusersession`,
    Search: `/search/all?query=#keyword#&domain=#domain#&page=#page#&userSessionId=#userSessionId#`,
    AISearch: `search/all?query=#keyword#&domain=#domain#&page=#page#&userSessionId=#userSessionId#`,
    SearchWithPermissionsOld: `/clickevents/sequence/search?query=#keyword#&domain=#domain#&page=#page#&additionalParams=#additionalParams#`,
    SearchWithPermissions: `/search/withPermissions?query=#keyword#&domain=#domain#&page=#page#&additionalParams=#additionalParams#&userSessionId=#userSessionId#`,
    AISearchWithPermissions: `search/all?query=#keyword#&domain=#domain#&page=#page#&additionalParams=#additionalParams#&userSessionId=#userSessionId#`,
    ProfanityCheck: `https://nistapp-content-moderator.cognitiveservices.azure.com/contentmoderator/moderate/v1.0/ProcessText/Screen`,
    SpecialNodes: `/clickevents`,
    Record: `/clickevents/clickednode`,
    UpdateRecord: `/clickevents/updateclickednode`,
    RecordSequence: `/clickevents/recordsequencedata`,
    updateRecordSequence: `/clickevents/updatesequencedata`,
    UserClick: `/clickevents/userclick`,
    DeleteSequence: `/clickevents/sequence/delete`,
    fetchRecord: '/search',
    VoteRecord: `/votes/addVote`,
    fetchVoteRecord: `/votes/`,
    tokenUrl: 'user/token'
};


/***/ }),

/***/ "./src/config/index.ts":
/*!*****************************!*\
  !*** ./src/config/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CONFIG: () => (/* binding */ CONFIG)
/* harmony export */ });
/**
 * Author: Lakshman Veti
 * Type: MAP
 * Objective: Config Objects
 */
const CONFIG = {
    current: "TEST",
    UDADebug: false,
    UDA_CONTAINER_CLASS: "udan-main-panel",
    UDA_CLICK_IGNORE_CLASS: "uda_exclude",
    UDA_DOMAIN: "https://udantest.nistapp.com/api",
    UDA_API_URL: "https://udantest.nistapp.com/api" + "/api",
    UDASessionID: (Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)),
    UDA_POST_INTERVAL: 1000,
    UDALastMutationTime: 0,
    UDALogLevel: 0,
    RECORDING_IS_PLAYING: "UDAIsPlaying",
    RECORDING_MANUAL_PLAY: "UDAManualPlay",
    RECORDING_SWITCH_KEY: "UDARecordingSwitch",
    RECORDING_SEQUENCE: "UDAActiveRecordingData",
    SELECTED_RECORDING: "UDASelectedRecordedItem",
    USER_AUTH_DATA_KEY: "udaUserData",
    UserScreenAcceptance: "udaUserScreenAcceptance",
    USER_SESSION_KEY: "UDASessionKey",
    UDAKeyCloakKey: "UDAKeyCloak",
    USER_SESSION_ID: "UDASessionId",
    SYNC_INTERVAL: 1000,
    AUTO_PLAY_SLEEP_TIME: 2000,
    JARO_WEIGHT: 0.95,
    JARO_WEIGHT_PERSONAL: 0.90,
    lastClickedTime: null,
    specialNodeKey: "UDASpecialNodes",
    enableInfiniteScroll: true,
    enableInfiniteScrollPageLength: 10,
    UDA_URL_Param: 'UDA_Sequence_id',
    set Environment(value) {
        this.current = value.toString().toUpperCase();
        if (this.current === "PROD") {
            this.UDA_DOMAIN = "https://udan.nistapp.ai";
        }
        else {
            this.UDA_DOMAIN = "https://udantest.nistapp.ai";
        }
        this.UDA_API_URL = this.UDA_DOMAIN + "/api";
    },
    get Environment() {
        return this.current;
    },
    DEBOUNCE_INTERVAL: 1000,
    indexInterval: 1000,
    clickObjects: [],
    nodeId: 0,
    isRecording: false,
    htmlIndex: [],
    invokeTime: 2000,
    apiInvokeTime: 300,
    maxStringLength: 40,
    playNextAction: true,
    navigatedToNextPage: { check: false, url: '' },
    ignoreElements: ["script", "h1", "h2", "h3", "link", "noscript", "style"],
    ignoreAttributes: [
        'translate', 'draggable', 'spellcheck', 'tabindex', 'clientHeight', 'clientLeft', 'clientTop', 'clientWidth',
        'offsetHeight', 'offsetLeft', 'offsetTop', 'offsetWidth', 'scrollHeight', 'scrollLeft', 'scrollTop', 'scrollWidth',
        'baseURI', 'isConnected', 'ariaPressed', 'aria-pressed', 'nodePosition', 'outerHTML', 'innerHTML', 'style',
        'aria-controls', 'aria-activedescendant', 'ariaExpanded', 'autocomplete', 'aria-expanded', 'aria-owns', 'formAction',
        'ng-star-inserted', 'ng-star', 'aria-describedby', 'width', 'height', 'x', 'y', 'selectionStart', 'selectionEnd', 'required', 'validationMessage', 'selectionDirection',
        'naturalWidth', 'naturalHeight', 'complete', '_indexOf', 'value', 'defaultValue', 'min', 'max', 'nodeInfo', 'data-tooltip-id', 'addedclickrecord', 'checked', 'data-tribute',
        'hasclick', 'addedClickRecord', 'hasClick', 'valueAsNumber', 'udaIgnoreChildren', 'udaIgnoreClick', 'udaignorechildren', 'udaignoreclick', 'fdprocessedid', '__ngContext__', 'd', 'text', 'textContent', 'cdk-describedby-host', 'inert', 'fill', 'disabled', 'hidden'
    ],
    innerTextWeight: 5,
    ignoreNodesFromIndexing: ['ng-dropdown-panel', 'ckeditor', 'fusioncharts', 'ngb-datepicker', 'ngx-daterangepicker-material', 'uda-panel', 'mat-datepicker-content', 'ng-select'],
    ignoreNodesContainingClassNames: ['cke_dialog_container', 'cke_notifications_area', 'gldp-default', 'ajs-layer', 'aui-list', 'herknl', 'jstBlock'],
    cancelRecordingDuringRecordingNodes: [],
    addClickToSpecialNodes: ['ng-select', 'ngb-datepicker'],
    ignoreClicksOnSpecialNodes: ['ngx-daterangepicker-material'],
    customNameForSpecialNodes: {
        'ngb-datepicker': 'Date selector',
        'mat-datepicker-content': 'Date selector',
        'ngx-daterangepicker-material': 'Date Range Selector'
    },
    specialInputClickClassNames: ['ghx-dropdown-trigger', 'aui-list', 'jstBlock', 'mat-form-field-flex', 'mat-select-trigger'],
    commonTags: ['span', 'div'],
    tooltipDisplayedNodes: [],
    // replay variables
    autoplayCompleted: false,
    autoplayPaused: false,
    // manual click variables
    invokedActionManually: false,
    // personal node ignore attributes
    personalNodeIgnoreAttributes: [
        "innerText",
        "innerHTML",
        "outerText",
        "outerHTML",
        "nodeValue",
        "src",
        "naturalWidth",
        "naturalHeight",
        "currentSrc",
    ],
    //Azure content moderator attributes
    profanity: {
        enabled: true,
        provider: "azure",
        config: {
            key1: "bc015cc4090543d58c3056e8dc98cc9b",
            key2: "bc015cc4090543d58c3056e8dc98cc9b",
            endPoint: "https://nistapp-content-moderator.cognitiveservices.azure.com/contentmoderator/moderate/v1.0/ProcessText/Screen",
            region: "eastus",
        },
    },
    multilingual: {
        enabled: false,
        searchInLang: "en-US",
        selectedLang: "en-US",
        displayText: "",
        translatedText: "",
        translate: {
            provider: "google",
            apikey: "AIzaSyD3XUOZEMz9Y_e5YpDWZEsQT_7zJPF0H4k",
            translateTo: "en",
            apiurl: "https://translation.googleapis.com/language/translate/v2",
        },
    },
    // BCP list of languages
    bcpLang: [
        ["Afrikaans", ["af-ZA"]],
        ["አማርኛ", ["am-ET"]],
        ["Azərbaycanca", ["az-AZ"]],
        ["বাংলা", ["bn-BD", "বাংলাদেশ"], ["bn-IN", "ভারত"]],
        ["Bahasa Indonesia", ["id-ID"]],
        ["Bahasa Melayu", ["ms-MY"]],
        ["Català", ["ca-ES"]],
        ["Čeština", ["cs-CZ"]],
        ["Dansk", ["da-DK"]],
        ["Deutsch", ["de-DE"]],
        [
            "English",
            ["en-AU", "Australia"],
            ["en-CA", "Canada"],
            ["en-IN", "India"],
            ["en-KE", "Kenya"],
            ["en-TZ", "Tanzania"],
            ["en-GH", "Ghana"],
            ["en-NZ", "New Zealand"],
            ["en-NG", "Nigeria"],
            ["en-ZA", "South Africa"],
            ["en-PH", "Philippines"],
            ["en-GB", "United Kingdom"],
            ["en-US", "United States"],
        ],
        [
            "Español",
            ["es-AR", "Argentina"],
            ["es-BO", "Bolivia"],
            ["es-CL", "Chile"],
            ["es-CO", "Colombia"],
            ["es-CR", "Costa Rica"],
            ["es-EC", "Ecuador"],
            ["es-SV", "El Salvador"],
            ["es-ES", "España"],
            ["es-US", "Estados Unidos"],
            ["es-GT", "Guatemala"],
            ["es-HN", "Honduras"],
            ["es-MX", "México"],
            ["es-NI", "Nicaragua"],
            ["es-PA", "Panamá"],
            ["es-PY", "Paraguay"],
            ["es-PE", "Perú"],
            ["es-PR", "Puerto Rico"],
            ["es-DO", "República Dominicana"],
            ["es-UY", "Uruguay"],
            ["es-VE", "Venezuela"],
        ],
        ["Euskara", ["eu-ES"]],
        ["Filipino", ["fil-PH"]],
        ["Français", ["fr-FR"]],
        ["Basa Jawa", ["jv-ID"]],
        ["Galego", ["gl-ES"]],
        ["ગુજરાતી", ["gu-IN"]],
        ["Hrvatski", ["hr-HR"]],
        ["IsiZulu", ["zu-ZA"]],
        ["Íslenska", ["is-IS"]],
        ["Italiano", ["it-IT", "Italia"], ["it-CH", "Svizzera"]],
        ["ಕನ್ನಡ", ["kn-IN"]],
        ["ភាសាខ្មែរ", ["km-KH"]],
        ["Latviešu", ["lv-LV"]],
        ["Lietuvių", ["lt-LT"]],
        ["മലയാളം", ["ml-IN"]],
        ["मराठी", ["mr-IN"]],
        ["Magyar", ["hu-HU"]],
        ["ລາວ", ["lo-LA"]],
        ["Nederlands", ["nl-NL"]],
        ["नेपाली भाषा", ["ne-NP"]],
        ["Norsk bokmål", ["nb-NO"]],
        ["Polski", ["pl-PL"]],
        ["Português", ["pt-BR", "Brasil"], ["pt-PT", "Portugal"]],
        ["Română", ["ro-RO"]],
        ["සිංහල", ["si-LK"]],
        ["Slovenščina", ["sl-SI"]],
        ["Basa Sunda", ["su-ID"]],
        ["Slovenčina", ["sk-SK"]],
        ["Suomi", ["fi-FI"]],
        ["Svenska", ["sv-SE"]],
        ["Kiswahili", ["sw-TZ", "Tanzania"], ["sw-KE", "Kenya"]],
        ["ქართული", ["ka-GE"]],
        ["Հայերեն", ["hy-AM"]],
        [
            "தமிழ்",
            ["ta-IN", "இந்தியா"],
            ["ta-SG", "சிங்கப்பூர்"],
            ["ta-LK", "இலங்கை"],
            ["ta-MY", "மலேசியா"],
        ],
        ["తెలుగు", ["te-IN"]],
        ["Tiếng Việt", ["vi-VN"]],
        ["Türkçe", ["tr-TR"]],
        ["اُردُو", ["ur-PK", "پاکستان"], ["ur-IN", "بھارت"]],
        ["Ελληνικά", ["el-GR"]],
        ["български", ["bg-BG"]],
        ["Pусский", ["ru-RU"]],
        ["Српски", ["sr-RS"]],
        ["Українська", ["uk-UA"]],
        ["한국어", ["ko-KR"]],
        [
            "中文",
            ["cmn-Hans-CN", "普通话 (中国大陆)"],
            ["cmn-Hans-HK", "普通话 (香港)"],
            ["cmn-Hant-TW", "中文 (台灣)"],
            ["yue-Hant-HK", "粵語 (香港)"],
        ],
        ["日本語", ["ja-JP"]],
        ["हिन्दी", ["hi-IN"]],
        ["ภาษาไทย", ["th-TH"]],
    ],
    // Flag to enable node type detection
    enableNodeTypeChangeSelection: true,
    set enableNodeTypeSelection(val) {
        this.enableNodeTypeChangeSelection = val;
        // this.showhtml();
    },
    get enableNodeTypeSelection() {
        return CONFIG.multilingual.enabled;
    },
    cspUserAcceptance: {
        storageName: "uda-csp-enabled",
        data: { proceed: true },
    },
    screenAcceptance: {
        storageName: "uda-user-screen-consent",
        data: { proceed: true },
    },
    ignoreDynamicAttributeText: ['_ng', '__context', '__zone_symbol']
};


/***/ }),

/***/ "./src/models/AuthData.ts":
/*!********************************!*\
  !*** ./src/models/AuthData.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthData: () => (/* binding */ AuthData)
/* harmony export */ });
class AuthData {
    constructor(id = null, email = null, token = null) {
        this.id = id;
        this.email = email;
        this.token = token;
    }
}


/***/ }),

/***/ "./src/models/CSPData.ts":
/*!*******************************!*\
  !*** ./src/models/CSPData.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSPData: () => (/* binding */ CSPData)
/* harmony export */ });
class CSPData {
    constructor(cspEnabled = false, udaAllowed = true, domain = null) {
        this.cspEnabled = cspEnabled;
        this.udaAllowed = udaAllowed;
        this.domain = domain;
    }
}


/***/ }),

/***/ "./src/models/UDASessionData.ts":
/*!**************************************!*\
  !*** ./src/models/UDASessionData.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UDASessionData: () => (/* binding */ UDASessionData)
/* harmony export */ });
/* harmony import */ var _AuthData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AuthData */ "./src/models/AuthData.ts");
/* harmony import */ var _CSPData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CSPData */ "./src/models/CSPData.ts");


class UDASessionData {
    constructor(sessionKey = null, authenticated = false, authenticationSource = null, authData = new _AuthData__WEBPACK_IMPORTED_MODULE_0__.AuthData(), csp = new _CSPData__WEBPACK_IMPORTED_MODULE_1__.CSPData()) {
        this.sessionKey = sessionKey;
        this.authenticated = authenticated;
        this.authenticationSource = authenticationSource;
        this.authData = authData;
        this.csp = csp;
    }
}


/***/ }),

/***/ "./src/services/UDAStorageService.ts":
/*!*******************************************!*\
  !*** ./src/services/UDAStorageService.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UDAStorageService: () => (/* binding */ UDAStorageService)
/* harmony export */ });
/* harmony import */ var _BrowserConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BrowserConstants */ "./src/BrowserConstants.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//storing the data to local storage

const UDAStorageService = {
    /**
     * Adds data to the storage.
     * @param {any} data - The data to be added.
     * @param {string} key - The key to store the data under.
     * @returns {Promise<void>} - A Promise that resolves when the data is added to the storage.
     */
    add: (data, key) => __awaiter(void 0, void 0, void 0, function* () {
        if (_BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.UDABrowserPlugin === true) {
            let storageData = {};
            storageData[key] = data;
            return yield _BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.browserVar.storage.local.set(storageData);
        }
        else {
            const storageData = JSON.stringify(data);
            return window.localStorage.setItem(key, storageData);
        }
    }),
    /**
     * Retrieves data from the storage.
     *
     * @param {string} key - The key associated with the data to be retrieved.
     * @returns {Promise<any>} - A Promise that resolves with the retrieved data.
     */
    get: (key) => __awaiter(void 0, void 0, void 0, function* () {
        if (_BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.UDABrowserPlugin === true) {
            let result = yield _BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.browserVar.storage.local.get([key]);
            return result[key];
        }
        else {
            return window.localStorage.getItem(key);
        }
    }),
    /**
     * Removes data from the storage.
     *
     * @param {string} key - The key associated with the data to be removed.
     * @returns {Promise<void>} - A Promise that resolves when the data is successfully removed from the storage.
     */
    remove: (key) => __awaiter(void 0, void 0, void 0, function* () {
        if (_BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.UDABrowserPlugin === true) {
            return yield _BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.browserVar.storage.local.remove([key]);
        }
        else {
            return window.localStorage.removeItem(key);
        }
    })
};


/***/ }),

/***/ "./src/util/KeycloakStore.ts":
/*!***********************************!*\
  !*** ./src/util/KeycloakStore.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   keyCloakStore: () => (/* binding */ keyCloakStore)
/* harmony export */ });
/* harmony import */ var _UDAGetSessionKey__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UDAGetSessionKey */ "./src/util/UDAGetSessionKey.ts");
/* harmony import */ var _UDABindAuthenticatedAccount__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UDABindAuthenticatedAccount */ "./src/util/UDABindAuthenticatedAccount.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


/**
 * Store keycloak data in chrome extension storage for retrival for other sites
 */
const keyCloakStore = (sessionData, data) => __awaiter(void 0, void 0, void 0, function* () {
    sessionData = yield (0,_UDAGetSessionKey__WEBPACK_IMPORTED_MODULE_0__.UDAGetSessionKey)(sessionData);
    sessionData.authData = data;
    sessionData.authenticated = true;
    sessionData.authenticationSource = 'keycloak';
    yield (0,_UDABindAuthenticatedAccount__WEBPACK_IMPORTED_MODULE_1__.UDABindAuthenticatedAccount)(sessionData);
});


/***/ }),

/***/ "./src/util/LoginWithBrowser.ts":
/*!**************************************!*\
  !*** ./src/util/LoginWithBrowser.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoginWithBrowser: () => (/* binding */ LoginWithBrowser)
/* harmony export */ });
/* harmony import */ var _UDADigestMessage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UDADigestMessage */ "./src/util/UDADigestMessage.ts");
/* harmony import */ var _UDABindAuthenticatedAccount__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UDABindAuthenticatedAccount */ "./src/util/UDABindAuthenticatedAccount.ts");
/* harmony import */ var _UDASendSessionData__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UDASendSessionData */ "./src/util/UDASendSessionData.ts");
/* harmony import */ var _BrowserConstants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../BrowserConstants */ "./src/BrowserConstants.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




/**
 * Asynchronously logs the user in using a browser.
 *
 * @param {UDASessionData} sessionData - The session data object to be updated with the user's authentication information.
 * @param {boolean} renewToken - Whether to renew the user's authentication token.
 * @return {Promise<boolean>} A promise that resolves to true if the login was successful, otherwise false.
 */
const LoginWithBrowser = (sessionData, renewToken) => __awaiter(void 0, void 0, void 0, function* () {
    sessionData.authenticationSource = "google";
    const data = yield _BrowserConstants__WEBPACK_IMPORTED_MODULE_3__.browserVar.identity.getProfileUserInfo({ accountStatus: 'ANY' });
    if (data && (data === null || data === void 0 ? void 0 : data.id) !== '' && (data === null || data === void 0 ? void 0 : data.email) !== "") {
        sessionData.authenticated = true;
        sessionData.authData = data;
        (0,_UDADigestMessage__WEBPACK_IMPORTED_MODULE_0__.UDADigestMessage)(data.id, "SHA-512").then((encryptedId) => __awaiter(void 0, void 0, void 0, function* () {
            sessionData.authData.id = encryptedId;
            (0,_UDADigestMessage__WEBPACK_IMPORTED_MODULE_0__.UDADigestMessage)(data.email, "SHA-512").then((encryptedEmail) => __awaiter(void 0, void 0, void 0, function* () {
                sessionData.authData.email = encryptedEmail;
                yield (0,_UDABindAuthenticatedAccount__WEBPACK_IMPORTED_MODULE_1__.UDABindAuthenticatedAccount)(sessionData, renewToken);
            }));
        }));
    }
    else {
        yield (0,_UDASendSessionData__WEBPACK_IMPORTED_MODULE_2__.UDASendSessionData)(sessionData, "UDAAlertMessageData", "login");
    }
    return true;
});


/***/ }),

/***/ "./src/util/UDABindAccount.ts":
/*!************************************!*\
  !*** ./src/util/UDABindAccount.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UDABindAccount: () => (/* binding */ UDABindAccount)
/* harmony export */ });
/* harmony import */ var _UDASendSessionData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UDASendSessionData */ "./src/util/UDASendSessionData.ts");
/* harmony import */ var _invokeApi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./invokeApi */ "./src/util/invokeApi.ts");
/* harmony import */ var _config_endpoints__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/endpoints */ "./src/config/endpoints.ts");
/* harmony import */ var _config_CustomConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config/CustomConfig */ "./src/config/CustomConfig.ts");
/* harmony import */ var _services_UDAStorageService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/UDAStorageService */ "./src/services/UDAStorageService.ts");
/* harmony import */ var _BrowserConstants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../BrowserConstants */ "./src/BrowserConstants.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//adding the sessionKey to the authid






__webpack_require__.g.UDAGlobalConfig = _config_CustomConfig__WEBPACK_IMPORTED_MODULE_3__.CustomConfig;
/**
 * Binds the user account with UDASessionData.
 * @param {Object} userAuthData - User authentication data.
 * @param {Object} UDASessionData - UDA session data.
 * @param {boolean} renewToken - Flag indicating whether to renew the token.
 * @returns {Promise<void>} Promise that resolves when the binding is complete.
 */
const UDABindAccount = (userAuthData, UDASessionData, renewToken) => __awaiter(void 0, void 0, void 0, function* () {
    const payLoad = { uid: UDASessionData.authData.id, email: UDASessionData.authData.email, realm: __webpack_require__.g.UDAGlobalConfig.realm, clientId: __webpack_require__.g.UDAGlobalConfig.clientId, clientSecret: __webpack_require__.g.UDAGlobalConfig.clientSecret };
    const authToken = yield (0,_invokeApi__WEBPACK_IMPORTED_MODULE_1__.invokeApi)("https://authenticatetest.nistapp.com/" + _config_endpoints__WEBPACK_IMPORTED_MODULE_2__.ENDPOINT.tokenUrl, "POST", payLoad);
    if (authToken && (authToken === null || authToken === void 0 ? void 0 : authToken.token)) {
        UDASessionData.authData.token = authToken.token;
        let userSessionData = { userauthid: userAuthData.id, usersessionid: UDASessionData.sessionKey };
        let response = yield (0,_invokeApi__WEBPACK_IMPORTED_MODULE_1__.invokeApi)(_config_endpoints__WEBPACK_IMPORTED_MODULE_2__.ENDPOINT.CheckUserSession, "POST", userSessionData);
        if (response) {
            yield _services_UDAStorageService__WEBPACK_IMPORTED_MODULE_4__.UDAStorageService.add(UDASessionData, _BrowserConstants__WEBPACK_IMPORTED_MODULE_5__.UDASessionName);
            yield (0,_UDASendSessionData__WEBPACK_IMPORTED_MODULE_0__.UDASendSessionData)(UDASessionData, "UDAAuthenticatedUserSessionData");
        }
    }
});


/***/ }),

/***/ "./src/util/UDABindAuthenticatedAccount.ts":
/*!*************************************************!*\
  !*** ./src/util/UDABindAuthenticatedAccount.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UDABindAuthenticatedAccount: () => (/* binding */ UDABindAuthenticatedAccount)
/* harmony export */ });
/* harmony import */ var _UDABindAccount__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UDABindAccount */ "./src/util/UDABindAccount.ts");
/* harmony import */ var _invokeApi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./invokeApi */ "./src/util/invokeApi.ts");
/* harmony import */ var _config_endpoints__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/endpoints */ "./src/config/endpoints.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//binding session key to the authenticated account



/**
 * Binds the authenticated account with UDASessionData.
 * @param {any} sessionData - The UDA session data.
 * @param {boolean} [renewToken=false] - Flag indicating whether to renew the token.
 * @returns {Promise<void>} A Promise that resolves when the binding is complete.
 */
const UDABindAuthenticatedAccount = (sessionData, renewToken = false) => __awaiter(void 0, void 0, void 0, function* () {
    let authData = {
        authid: sessionData.authData.id,
        emailid: sessionData.authData.email,
        authsource: sessionData.authenticationSource
    };
    let response = yield (0,_invokeApi__WEBPACK_IMPORTED_MODULE_1__.invokeApi)(_config_endpoints__WEBPACK_IMPORTED_MODULE_2__.ENDPOINT.CheckUserId, "POST", authData);
    if (response) {
        if (sessionData.sessionKey !== null) {
            yield (0,_UDABindAccount__WEBPACK_IMPORTED_MODULE_0__.UDABindAccount)(response, sessionData, renewToken);
        }
    }
});


/***/ }),

/***/ "./src/util/UDADigestMessage.ts":
/*!**************************************!*\
  !*** ./src/util/UDADigestMessage.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UDADigestMessage: () => (/* binding */ UDADigestMessage)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 *
 * @param textMessage
 * @param algorithm
 * @returns {Promise<ArrayBuffer>}
 * @constructor
 *
 * This is used for encrypting text messages as specified in the docs
 * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 *
 */
const UDADigestMessage = (textMessage, algorithm) => __awaiter(void 0, void 0, void 0, function* () {
    const encoder = new TextEncoder();
    const data = encoder.encode(textMessage);
    const hash = yield crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hash)); // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
});


/***/ }),

/***/ "./src/util/UDAGetSessionKey.ts":
/*!**************************************!*\
  !*** ./src/util/UDAGetSessionKey.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UDAGetSessionKey: () => (/* binding */ UDAGetSessionKey)
/* harmony export */ });
/* harmony import */ var _invokeApi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./invokeApi */ "./src/util/invokeApi.ts");
/* harmony import */ var _config_endpoints__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/endpoints */ "./src/config/endpoints.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//getting session key from backend server


const UDAGetSessionKey = (UDASessionData) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0,_invokeApi__WEBPACK_IMPORTED_MODULE_0__.invokeApi)(_config_endpoints__WEBPACK_IMPORTED_MODULE_1__.ENDPOINT.GetSessionKey, "GET", null, false);
    if (!response) {
        return response;
    }
    UDASessionData.sessionKey = response;
    return UDASessionData;
});


/***/ }),

/***/ "./src/util/UDASendSessionData.ts":
/*!****************************************!*\
  !*** ./src/util/UDASendSessionData.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UDASendSessionData: () => (/* binding */ UDASendSessionData),
/* harmony export */   UDASendSessionDataToBackground: () => (/* binding */ UDASendSessionDataToBackground)
/* harmony export */ });
/* harmony import */ var _getTab__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getTab */ "./src/util/getTab.ts");
/* harmony import */ var _BrowserConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../BrowserConstants */ "./src/BrowserConstants.ts");
/* harmony import */ var _UDABindAuthenticatedAccount__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UDABindAuthenticatedAccount */ "./src/util/UDABindAuthenticatedAccount.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



const UDASendSessionData = (udaSessionData, sendAction = "UDAUserSessionData", message = '') => __awaiter(void 0, void 0, void 0, function* () {
    if (_BrowserConstants__WEBPACK_IMPORTED_MODULE_1__.UDABrowserPlugin === true) {
        yield UDASendSessionDataToBackground(udaSessionData, sendAction, message);
    }
    else {
        let sessionEvent = {};
        switch (sendAction) {
            case "UDAUserSessionData":
                sessionEvent = new CustomEvent("UDAUserSessionData", {
                    detail: { data: JSON.stringify(udaSessionData) },
                    bubbles: false,
                    cancelable: false
                });
                break;
            case "UDAAuthenticatedUserSessionData":
                sessionEvent = new CustomEvent("UDAAuthenticatedUserSessionData", {
                    detail: { data: JSON.stringify(udaSessionData) },
                    bubbles: false,
                    cancelable: false
                });
                break;
            case "UDAAlertMessageData":
                sessionEvent = new CustomEvent("UDAAlertMessageData", {
                    detail: { data: message },
                    bubbles: false,
                    cancelable: false
                });
                break;
        }
        document.dispatchEvent(sessionEvent);
    }
});
const UDASendSessionDataToBackground = (udaSessionData, sendAction = "UDAUserSessionData", message = '') => __awaiter(void 0, void 0, void 0, function* () {
    let tab = yield (0,_getTab__WEBPACK_IMPORTED_MODULE_0__.getTab)();
    if (!tab) {
        console.log('No active tab identified.');
        return false;
    }
    if (sendAction === "UDAAlertMessageData") {
        yield _BrowserConstants__WEBPACK_IMPORTED_MODULE_1__.browserVar.tabs.sendMessage(tab.id, { action: sendAction, data: message });
        return true;
    }
    else {
        // Logic to add the authtoken to the session data
        if (!udaSessionData.authData.hasOwnProperty('token')) {
            yield (0,_UDABindAuthenticatedAccount__WEBPACK_IMPORTED_MODULE_2__.UDABindAuthenticatedAccount)(udaSessionData, false);
        }
        else {
            yield _BrowserConstants__WEBPACK_IMPORTED_MODULE_1__.browserVar.tabs.sendMessage(tab.id, { action: sendAction, data: JSON.stringify(udaSessionData) });
        }
        return true;
    }
});


/***/ }),

/***/ "./src/util/getTab.ts":
/*!****************************!*\
  !*** ./src/util/getTab.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTab: () => (/* binding */ getTab)
/* harmony export */ });
/* harmony import */ var _BrowserConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BrowserConstants */ "./src/BrowserConstants.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

/**
 * Retrieves the active tab from the browser.
 *
 * @return {Promise<Object>} The active tab object.
 */
const getTab = () => __awaiter(void 0, void 0, void 0, function* () {
    let queryOptions = { active: true, currentWindow: true };
    let tab = (yield _BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.browserVar.tabs.query(queryOptions))[0];
    if (tab) {
        return tab;
    }
    else if (_BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.activeTabId !== -1) {
        tab = yield _BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.browserVar.tabs.get(_BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.activeTabId);
        if (tab) {
            return tab;
        }
        else {
            console.log('No active tab identified.');
            return false;
        }
    }
    else {
        return false;
    }
});


/***/ }),

/***/ "./src/util/invokeApi.ts":
/*!*******************************!*\
  !*** ./src/util/invokeApi.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   invokeApi: () => (/* binding */ invokeApi)
/* harmony export */ });
/* harmony import */ var _config_CustomConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/CustomConfig */ "./src/config/CustomConfig.ts");
/**
 * Common API call functionality
 */
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

__webpack_require__.g.UDAGlobalConfig = _config_CustomConfig__WEBPACK_IMPORTED_MODULE_0__.CustomConfig;
const invokeApi = (url, method, data, parseJson = true) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'charset': 'UTF-8'
            }
        };
        if (data) {
            config.body = JSON.stringify(data);
        }
        const baseProdURL = "https://udantest.nistapp.com/api";
        const baseTestURL = "https://udantest.nistapp.com/api";
        let baseURL = baseProdURL;
        if (url.indexOf("http") === -1) {
            if (__webpack_require__.g.UDAGlobalConfig.environment === 'TEST') {
                baseURL = baseTestURL;
            }
            url = baseURL + url;
        }
        let response = yield fetch(url, config);
        if (response.ok) {
            if (parseJson) {
                return response.json();
            }
            else {
                return response.text();
            }
        }
        else {
            return false;
        }
    }
    catch (e) {
        console.log(e);
        return false;
    }
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***************************!*\
  !*** ./src/Background.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _BrowserConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BrowserConstants */ "./src/BrowserConstants.ts");
/* harmony import */ var _util_LoginWithBrowser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/LoginWithBrowser */ "./src/util/LoginWithBrowser.ts");
/* harmony import */ var _util_UDASendSessionData__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/UDASendSessionData */ "./src/util/UDASendSessionData.ts");
/* harmony import */ var _models_UDASessionData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./models/UDASessionData */ "./src/models/UDASessionData.ts");
/* harmony import */ var _util_UDAGetSessionKey__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util/UDAGetSessionKey */ "./src/util/UDAGetSessionKey.ts");
/* harmony import */ var _util_UDABindAuthenticatedAccount__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util/UDABindAuthenticatedAccount */ "./src/util/UDABindAuthenticatedAccount.ts");
/* harmony import */ var _services_UDAStorageService__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./services/UDAStorageService */ "./src/services/UDAStorageService.ts");
/* harmony import */ var _util_KeycloakStore__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./util/KeycloakStore */ "./src/util/KeycloakStore.ts");

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

(0,_BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.updateBrowserPlugin)(true);
/**
 * Storing the active tab id to fetch for further data.
 */
_BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.browserVar.tabs.onActivated.addListener(function (activeInfo) {
    (0,_BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.updateActiveTabId)(activeInfo.tabId);
});







let sessionData = new _models_UDASessionData__WEBPACK_IMPORTED_MODULE_3__.UDASessionData();
// listen for the requests made from webpage for accessing userdata
_BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.browserVar.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        if (request.action === "getusersessiondata" || request.action === "UDAGetNewToken") {
            const storedSessionData = yield _services_UDAStorageService__WEBPACK_IMPORTED_MODULE_6__.UDAStorageService.get(_BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.UDASessionName);
            if (!storedSessionData) {
                sessionData = yield (0,_util_UDAGetSessionKey__WEBPACK_IMPORTED_MODULE_4__.UDAGetSessionKey)(sessionData);
                yield (0,_util_LoginWithBrowser__WEBPACK_IMPORTED_MODULE_1__.LoginWithBrowser)(sessionData, false);
            }
            else {
                // looks like browser storage might have changed so changing the reading the data has been changed. For to work with old version have added the new code to else if statement
                if (storedSessionData.hasOwnProperty("sessionKey") && storedSessionData["sessionKey"] && typeof storedSessionData["sessionKey"] != 'object') {
                    sessionData = storedSessionData;
                    if (request.action === "UDAGetNewToken") {
                        yield generateNewToken();
                    }
                    else if (storedSessionData.hasOwnProperty('authenticated') && storedSessionData.authenticated) {
                        yield (0,_util_UDASendSessionData__WEBPACK_IMPORTED_MODULE_2__.UDASendSessionData)(sessionData);
                    }
                    else {
                        yield (0,_util_LoginWithBrowser__WEBPACK_IMPORTED_MODULE_1__.LoginWithBrowser)(sessionData, false);
                    }
                }
                else if (storedSessionData.hasOwnProperty(_BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.UDASessionName) && storedSessionData[_BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.UDASessionName].hasOwnProperty("sessionKey") && storedSessionData[_BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.UDASessionName]["sessionKey"] && typeof storedSessionData[_BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.UDASessionName]["sessionKey"] != 'object') {
                    sessionData = storedSessionData[_BrowserConstants__WEBPACK_IMPORTED_MODULE_0__.UDASessionName];
                    if (storedSessionData.hasOwnProperty('authenticated') && storedSessionData.authenticated) {
                        yield (0,_util_UDASendSessionData__WEBPACK_IMPORTED_MODULE_2__.UDASendSessionData)(sessionData);
                    }
                    else {
                        yield (0,_util_LoginWithBrowser__WEBPACK_IMPORTED_MODULE_1__.LoginWithBrowser)(sessionData, false);
                    }
                }
                else {
                    sessionData = yield (0,_util_UDAGetSessionKey__WEBPACK_IMPORTED_MODULE_4__.UDAGetSessionKey)(sessionData);
                    yield (0,_util_LoginWithBrowser__WEBPACK_IMPORTED_MODULE_1__.LoginWithBrowser)(sessionData, false);
                }
            }
        }
        else if (request.action === "authtenicate") {
            yield (0,_util_LoginWithBrowser__WEBPACK_IMPORTED_MODULE_1__.LoginWithBrowser)(sessionData, false);
        }
        else if (request.action === "createSession") {
            yield (0,_util_KeycloakStore__WEBPACK_IMPORTED_MODULE_7__.keyCloakStore)(sessionData, request.data);
        }
    });
});
function generateNewToken() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(sessionData);
        yield (0,_util_UDABindAuthenticatedAccount__WEBPACK_IMPORTED_MODULE_5__.UDABindAuthenticatedAccount)(sessionData, true);
    });
}

})();

UdanLibrary = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=UDABackground.js.map