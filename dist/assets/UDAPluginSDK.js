<<<<<<< HEAD
var UdanLibrary;
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/detect-browser/es/index.js":
/*!*************************************************!*\
  !*** ./node_modules/detect-browser/es/index.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BotInfo: function() { return /* binding */ BotInfo; },
/* harmony export */   BrowserInfo: function() { return /* binding */ BrowserInfo; },
/* harmony export */   NodeInfo: function() { return /* binding */ NodeInfo; },
/* harmony export */   ReactNativeInfo: function() { return /* binding */ ReactNativeInfo; },
/* harmony export */   SearchBotDeviceInfo: function() { return /* binding */ SearchBotDeviceInfo; },
/* harmony export */   browserName: function() { return /* binding */ browserName; },
/* harmony export */   detect: function() { return /* binding */ detect; },
/* harmony export */   detectOS: function() { return /* binding */ detectOS; },
/* harmony export */   getNodeVersion: function() { return /* binding */ getNodeVersion; },
/* harmony export */   parseUserAgent: function() { return /* binding */ parseUserAgent; }
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
/***/ (function(module) {

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

/***/ "./src/util/checkBrowser.ts":
/*!**********************************!*\
  !*** ./src/util/checkBrowser.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkBrowser: function() { return /* binding */ checkBrowser; }
/* harmony export */ });
/* harmony import */ var detect_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! detect-browser */ "./node_modules/detect-browser/es/index.js");

const checkBrowser = () => {
    const udaIdentifiedBrowser = (0,detect_browser__WEBPACK_IMPORTED_MODULE_0__.detect)();
    let enableUDAPlugin = false;
    let udaBrowserVar;
    switch (udaIdentifiedBrowser && udaIdentifiedBrowser.name) {
        case 'edge-chromium':
        case 'edge':
        case 'edge-ios':
        case 'chrome':
            enableUDAPlugin = true;
            udaBrowserVar = chrome;
            break;
        default:
            if (typeof browser !== "undefined") {
                udaBrowserVar = browser;
            }
            break;
    }
    return { enableUDAPlugin: enableUDAPlugin, udaBrowserVar: udaBrowserVar, udaIdentifiedBrowser: udaIdentifiedBrowser };
};


/***/ }),

/***/ "./src/util/checkScreenSize.ts":
/*!*************************************!*\
  !*** ./src/util/checkScreenSize.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkScreenSize: function() { return /* binding */ checkScreenSize; }
/* harmony export */ });
/* harmony import */ var _getScreenSize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getScreenSize */ "./src/util/getScreenSize.ts");

const checkScreenSize = () => {
    const screenSize = (0,_getScreenSize__WEBPACK_IMPORTED_MODULE_0__.getScreenSize)();
    let enablePluginForScreen = true;
    let showScreenAlert = false;
    if (screenSize.resolution.height < 768) {
        enablePluginForScreen = false;
    }
    else if (screenSize.resolution.height < 1080) {
        showScreenAlert = true;
    }
    if (screenSize.resolution.width < 1366) {
        enablePluginForScreen = false;
    }
    else if (screenSize.resolution.width < 1920) {
        showScreenAlert = true;
    }
    return { enablePluginForScreen, showScreenAlert };
};


/***/ }),

/***/ "./src/util/getScreenSize.ts":
/*!***********************************!*\
  !*** ./src/util/getScreenSize.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getScreenSize: function() { return /* binding */ getScreenSize; }
/* harmony export */ });
/**
 * To get screen/window size
 * @returns object
 */
const getScreenSize = () => {
    let page = { height: 0, width: 0 };
    let screen = { height: 0, width: 0 };
    let body = document.body, html = document.documentElement;
    const docEl = document.documentElement;
    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    let resolution = { height: 0, width: 0 };
    page.height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    page.width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
    if (window.innerWidth !== undefined) {
        screen.width = window.innerWidth * 0.75;
        screen.height = window.innerHeight;
    }
    else {
        const D = document.documentElement;
        screen.width = D.clientWidth;
        screen.height = D.clientHeight * 0.75;
    }
    resolution.height = window.screen.height;
    resolution.width = window.screen.width;
    const windowProperties = {
        page: page,
        screen: screen,
        scrollInfo: { scrollTop: scrollTop, scrollLeft: scrollLeft },
        resolution,
    };
    return windowProperties;
};


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
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!*****************************!*\
  !*** ./src/ExtensionSDK.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_checkBrowser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/checkBrowser */ "./src/util/checkBrowser.ts");
/* harmony import */ var _util_checkScreenSize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/checkScreenSize */ "./src/util/checkScreenSize.ts");


var _checkBrowser = (0,_util_checkBrowser__WEBPACK_IMPORTED_MODULE_0__.checkBrowser)(),
  enableUDAPlugin = _checkBrowser.enableUDAPlugin,
  udaBrowserVar = _checkBrowser.udaBrowserVar,
  udaIdentifiedBrowser = _checkBrowser.udaIdentifiedBrowser;
var _checkScreenSize = (0,_util_checkScreenSize__WEBPACK_IMPORTED_MODULE_1__.checkScreenSize)(),
  enablePluginForScreen = _checkScreenSize.enablePluginForScreen,
  showScreenAlert = _checkScreenSize.showScreenAlert;
if (enableUDAPlugin === false) {
  console.log('Plugin disabled for browser: ' + udaIdentifiedBrowser.name);
} else if (enablePluginForScreen === false) {
  console.log('Plugin disabled due to lower resolution');
} else {
  var _udaBrowserVar$runtim;
  console.log('Browser Enabled');
  var s1 = document.createElement('script');
  var scriptPath = udaBrowserVar === null || udaBrowserVar === void 0 || (_udaBrowserVar$runtim = udaBrowserVar.runtime) === null || _udaBrowserVar$runtim === void 0 ? void 0 : _udaBrowserVar$runtim.getURL("assets/UDASdk.js");
  s1.src = scriptPath;
  s1.onload = function () {};
  (document.body || document.documentElement).appendChild(s1);
  document.addEventListener("RequestUDASessionData", function (data) {
    udaBrowserVar.runtime.sendMessage({
      action: data.detail.data,
      data: data.detail.data
    });
  });
  document.addEventListener("UDADebugSetEvent", function (data) {
    udaBrowserVar.runtime.sendMessage({
      action: data.detail.data.action,
      data: data.detail.data.value
    });
  });

  /**
   * create keycloak storage to browserVar
   */
  document.addEventListener("CreateUDASessionData", function (data) {
    udaBrowserVar.runtime.sendMessage({
      action: data.detail.action,
      data: data.detail.data
    });
  });
  udaBrowserVar.runtime.onMessage.addListener(function (request) {
    if (request.action === "UDAUserSessionData") {
      document.dispatchEvent(new CustomEvent("UDAUserSessionData", {
        detail: {
          data: request.data
        },
        bubbles: false,
        cancelable: false
      }));
    } else if (request.action === "UDAAuthenticatedUserSessionData") {
      document.dispatchEvent(new CustomEvent("UDAAuthenticatedUserSessionData", {
        detail: {
          data: request.data
        },
        bubbles: false,
        cancelable: false
      }));
    } else if (request.action === "UDAAlertMessageData") {
      document.dispatchEvent(new CustomEvent("UDAAlertMessageData", {
        detail: {
          data: request.data
        },
        bubbles: false,
        cancelable: false
      }));
    }
  });
}
}();
UdanLibrary = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=UDAPluginSDK.js.map
=======
var UdanLibrary;(()=>{var e={6512:e=>{var t,n,i=e.exports={};function o(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function s(e){if(t===setTimeout)return setTimeout(e,0);if((t===o||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:o}catch(e){t=o}try{n="function"==typeof clearTimeout?clearTimeout:r}catch(e){n=r}}();var a,d=[],c=!1,l=-1;function u(){c&&a&&(c=!1,a.length?d=a.concat(d):l=-1,d.length&&h())}function h(){if(!c){var e=s(u);c=!0;for(var t=d.length;t;){for(a=d,d=[];++l<t;)a&&a[l].run();l=-1,t=d.length}a=null,c=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===r||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{return n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function f(e,t){this.fun=e,this.array=t}function w(){}i.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];d.push(new f(e,t)),1!==d.length||c||s(h)},f.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=w,i.addListener=w,i.once=w,i.off=w,i.removeListener=w,i.removeAllListeners=w,i.emit=w,i.prependListener=w,i.prependOnceListener=w,i.listeners=function(e){return[]},i.binding=function(e){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(e){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}}},t={};function n(i){var o=t[i];if(void 0!==o)return o.exports;var r=t[i]={exports:{}};return e[i](r,r.exports,n),r.exports}n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var i={};(()=>{"use strict";n.r(i);var e=n(6512),t=function(e,t,n){if(n||2===arguments.length)for(var i,o=0,r=t.length;o<r;o++)!i&&o in t||(i||(i=Array.prototype.slice.call(t,0,o)),i[o]=t[o]);return e.concat(i||Array.prototype.slice.call(t))},o=function(e,t,n){this.name=e,this.version=t,this.os=n,this.type="browser"},r=function(t){this.version=t,this.type="node",this.name="node",this.os=e.platform},s=function(e,t,n,i){this.name=e,this.version=t,this.os=n,this.bot=i,this.type="bot-device"},a=function(){this.type="bot",this.bot=!0,this.name="bot",this.version=null,this.os=null},d=function(){this.type="react-native",this.name="react-native",this.version=null,this.os=null},c=/(nuhk|curl|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/,l=3,u=[["aol",/AOLShield\/([0-9\._]+)/],["edge",/Edge\/([0-9\._]+)/],["edge-ios",/EdgiOS\/([0-9\._]+)/],["yandexbrowser",/YaBrowser\/([0-9\._]+)/],["kakaotalk",/KAKAOTALK\s([0-9\.]+)/],["samsung",/SamsungBrowser\/([0-9\.]+)/],["silk",/\bSilk\/([0-9._-]+)\b/],["miui",/MiuiBrowser\/([0-9\.]+)$/],["beaker",/BeakerBrowser\/([0-9\.]+)/],["edge-chromium",/EdgA?\/([0-9\.]+)/],["chromium-webview",/(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],["chrome",/(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],["phantomjs",/PhantomJS\/([0-9\.]+)(:?\s|$)/],["crios",/CriOS\/([0-9\.]+)(:?\s|$)/],["firefox",/Firefox\/([0-9\.]+)(?:\s|$)/],["fxios",/FxiOS\/([0-9\.]+)/],["opera-mini",/Opera Mini.*Version\/([0-9\.]+)/],["opera",/Opera\/([0-9\.]+)(?:\s|$)/],["opera",/OPR\/([0-9\.]+)(:?\s|$)/],["pie",/^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],["pie",/^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer) (\d+\.\d+);.*Windows CE.*\)$/],["netfront",/^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],["ie",/Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],["ie",/MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],["ie",/MSIE\s(7\.0)/],["bb10",/BB10;\sTouch.*Version\/([0-9\.]+)/],["android",/Android\s([0-9\.]+)/],["ios",/Version\/([0-9\._]+).*Mobile.*Safari.*/],["safari",/Version\/([0-9\._]+).*Safari/],["facebook",/FB[AS]V\/([0-9\.]+)/],["instagram",/Instagram\s([0-9\.]+)/],["ios-webview",/AppleWebKit\/([0-9\.]+).*Mobile/],["ios-webview",/AppleWebKit\/([0-9\.]+).*Gecko\)$/],["curl",/^curl\/([0-9\.]+)$/],["searchbot",/alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/]],h=[["iOS",/iP(hone|od|ad)/],["Android OS",/Android/],["BlackBerry OS",/BlackBerry|BB10/],["Windows Mobile",/IEMobile/],["Amazon OS",/Kindle/],["Windows 3.11",/Win16/],["Windows 95",/(Windows 95)|(Win95)|(Windows_95)/],["Windows 98",/(Windows 98)|(Win98)/],["Windows 2000",/(Windows NT 5.0)|(Windows 2000)/],["Windows XP",/(Windows NT 5.1)|(Windows XP)/],["Windows Server 2003",/(Windows NT 5.2)/],["Windows Vista",/(Windows NT 6.0)/],["Windows 7",/(Windows NT 6.1)/],["Windows 8",/(Windows NT 6.2)/],["Windows 8.1",/(Windows NT 6.3)/],["Windows 10",/(Windows NT 10.0)/],["Windows ME",/Windows ME/],["Windows CE",/Windows CE|WinCE|Microsoft Pocket Internet Explorer/],["Open BSD",/OpenBSD/],["Sun OS",/SunOS/],["Chrome OS",/CrOS/],["Linux",/(Linux)|(X11)/],["Mac OS",/(Mac_PowerPC)|(Macintosh)/],["QNX",/QNX/],["BeOS",/BeOS/],["OS/2",/OS\/2/]];function f(t){return t?m(t):"undefined"==typeof document&&"undefined"!=typeof navigator&&"ReactNative"===navigator.product?new d:"undefined"!=typeof navigator?m(navigator.userAgent):void 0!==e&&e.version?new r(e.version.slice(1)):null}function w(e){return""!==e&&u.reduce((function(t,n){var i=n[0],o=n[1];if(t)return t;var r=o.exec(e);return!!r&&[i,r]}),!1)}function m(e){var n=w(e);if(!n)return null;var i=n[0],r=n[1];if("searchbot"===i)return new a;var d=r[1]&&r[1].split(".").join("_").split("_").slice(0,3);d?d.length<l&&(d=t(t([],d,!0),function(e){for(var t=[],n=0;n<e;n++)t.push("0");return t}(l-d.length),!0)):d=[];var u=d.join("."),f=function(e){for(var t=0,n=h.length;t<n;t++){var i=h[t],o=i[0];if(i[1].exec(e))return o}return null}(e),m=c.exec(e);return m&&m[1]?new s(i,u,f,m[1]):new o(i,u,f)}let{enableUDAPlugin:p,udaBrowserVar:g,udaIdentifiedBrowser:v}=(()=>{const e=f();let t,n=!1;switch(e&&e.name){case"edge-chromium":case"edge":case"edge-ios":case"chrome":n=!0,t=chrome;break;default:"undefined"!=typeof browser&&(t=browser)}return{enableUDAPlugin:n,udaBrowserVar:t,udaIdentifiedBrowser:e}})();const{enablePluginForScreen:b,showScreenAlert:S}=(()=>{const e=(()=>{let e={height:0,width:0},t={height:0,width:0},n=document.body,i=document.documentElement;const o=document.documentElement,r=window.pageYOffset||o.scrollTop||n.scrollTop,s=window.pageXOffset||o.scrollLeft||n.scrollLeft;let a={height:0,width:0};if(e.height=Math.max(n.scrollHeight,n.offsetHeight,i.clientHeight,i.scrollHeight,i.offsetHeight),e.width=Math.max(n.scrollWidth,n.offsetWidth,i.clientWidth,i.scrollWidth,i.offsetWidth),void 0!==window.innerWidth)t.width=.75*window.innerWidth,t.height=window.innerHeight;else{const e=document.documentElement;t.width=e.clientWidth,t.height=.75*e.clientHeight}return a.height=window.screen.height,a.width=window.screen.width,{page:e,screen:t,scrollInfo:{scrollTop:r,scrollLeft:s},resolution:a}})();let t=!0,n=!1;return e.resolution.height<768?t=!1:e.resolution.height<1080&&(n=!0),e.resolution.width<1366?t=!1:e.resolution.width<1920&&(n=!0),{enablePluginForScreen:t,showScreenAlert:n}})();if(!1===p);else if(!1===b);else{var W;let e=document.createElement("script"),t=null==g||null===(W=g.runtime)||void 0===W?void 0:W.getURL("assets/UDASdk.js");e.src=t,e.onload=function(){},(document.body||document.documentElement).appendChild(e),document.addEventListener("RequestUDASessionData",(function(e){g.runtime.sendMessage({action:e.detail.data,data:e.detail.data})})),document.addEventListener("UDADebugSetEvent",(function(e){g.runtime.sendMessage({action:e.detail.data.action,data:e.detail.data.value})})),document.addEventListener("UDAGetNewToken",(function(e){g.runtime.sendMessage({action:e.detail.data,data:e.detail.data})})),document.addEventListener("CreateUDASessionData",(function(e){g.runtime.sendMessage({action:e.detail.action,data:e.detail.data})})),g.runtime.onMessage.addListener((function(e){"UDAUserSessionData"===e.action?document.dispatchEvent(new CustomEvent("UDAUserSessionData",{detail:{data:e.data},bubbles:!1,cancelable:!1})):"UDAAuthenticatedUserSessionData"===e.action?document.dispatchEvent(new CustomEvent("UDAAuthenticatedUserSessionData",{detail:{data:e.data},bubbles:!1,cancelable:!1})):"UDAAlertMessageData"===e.action&&document.dispatchEvent(new CustomEvent("UDAAlertMessageData",{detail:{data:e.data},bubbles:!1,cancelable:!1}))}))}})(),UdanLibrary=i})();
>>>>>>> 26f4371d2009adedbcbf213c05d9245d994885b4
