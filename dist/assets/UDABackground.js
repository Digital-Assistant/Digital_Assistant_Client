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

/***/ "./src/util/UDADigestMessage.ts":
/*!**************************************!*\
  !*** ./src/util/UDADigestMessage.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UDADigestMessage: function() { return /* binding */ UDADigestMessage; }
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

/***/ "./src/util/invokeApi.ts":
/*!*******************************!*\
  !*** ./src/util/invokeApi.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   invokeApi: function() { return /* binding */ invokeApi; }
/* harmony export */ });
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
        const baseProdURL = "https://udantest.nistapp.ai/api";
        const baseTestURL = "https://udantest.nistapp.ai/api";
        let baseURL = baseProdURL;
        if (url.indexOf("http") === -1) {
            if (UDAGlobalConfig.environment === 'TEST') {
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
/*!***************************!*\
  !*** ./src/Background.js ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_UDADigestMessage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/UDADigestMessage */ "./src/util/UDADigestMessage.ts");
/* harmony import */ var _util_invokeApi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/invokeApi */ "./src/util/invokeApi.ts");


function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


var _require = __webpack_require__(/*! detect-browser */ "./node_modules/detect-browser/es/index.js"),
  detect = _require.detect;
var browser = detect();
var enablePlugin = false;
var browserVar;
console.log(browser.name);
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
var UDADebug = false; //this variable exists in links.js file also
var apiHost = "https://udantest.nistapp.ai/api";
var cookieName = "uda-sessiondata";
var CSPStorageName = "uda-csp-storage";
var activeTabs = [];
var sessionKey = "";
var sessionData = {
  sessionkey: "",
  authenticated: false,
  authenticationsource: "",
  authdata: {},
  csp: {
    cspenabled: false,
    udanallowed: true,
    domain: ''
  }
};
var currentTab = [];
var activeTabId;

/**
 * Storing the active tab id to fetch for further data.
 */
browserVar.tabs.onActivated.addListener(function (activeInfo) {
  activeTabId = activeInfo.tabId;
});

//login with browser identity functionality
function loginWithBrowser() {
  return _loginWithBrowser.apply(this, arguments);
} //send the sessiondata to the webpage functionality
function _loginWithBrowser() {
  _loginWithBrowser = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          sessionData.authenticationsource = "google";
          browserVar.identity.getProfileUserInfo({
            accountStatus: 'ANY'
          }, /*#__PURE__*/function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(data) {
              return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    if (!(data.id !== '' && data.email !== "")) {
                      _context5.next = 6;
                      break;
                    }
                    sessionData.authenticated = true;
                    sessionData.authdata = data;
                    (0,_util_UDADigestMessage__WEBPACK_IMPORTED_MODULE_0__.UDADigestMessage)(sessionData.authdata.id, "SHA-512").then( /*#__PURE__*/function () {
                      var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(encryptedid) {
                        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                          while (1) switch (_context4.prev = _context4.next) {
                            case 0:
                              sessionData.authdata.id = encryptedid;
                              (0,_util_UDADigestMessage__WEBPACK_IMPORTED_MODULE_0__.UDADigestMessage)(sessionData.authdata.email, "SHA-512").then( /*#__PURE__*/function () {
                                var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(encryptedemail) {
                                  return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                                    while (1) switch (_context3.prev = _context3.next) {
                                      case 0:
                                        sessionData.authdata.email = encryptedemail;
                                        _context3.next = 3;
                                        return bindAuthenticatedAccount();
                                      case 3:
                                      case "end":
                                        return _context3.stop();
                                    }
                                  }, _callee3);
                                }));
                                return function (_x9) {
                                  return _ref5.apply(this, arguments);
                                };
                              }());
                            case 2:
                            case "end":
                              return _context4.stop();
                          }
                        }, _callee4);
                      }));
                      return function (_x8) {
                        return _ref4.apply(this, arguments);
                      };
                    }());
                    _context5.next = 8;
                    break;
                  case 6:
                    _context5.next = 8;
                    return sendSessionData("UDAAlertMessageData", "login");
                  case 8:
                  case "end":
                    return _context5.stop();
                }
              }, _callee5);
            }));
            return function (_x7) {
              return _ref3.apply(this, arguments);
            };
          }());
          return _context6.abrupt("return", true);
        case 3:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _loginWithBrowser.apply(this, arguments);
}
function sendSessionData() {
  return _sendSessionData.apply(this, arguments);
}
/**
 *
 * @returns {currentTab}
 */
function _sendSessionData() {
  _sendSessionData = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
    var sendaction,
      message,
      tab,
      url,
      domain,
      cspRecord,
      cspData,
      recordExists,
      cspRecords,
      i,
      _args7 = arguments;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          sendaction = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : "UDAUserSessionData";
          message = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : '';
          _context7.next = 4;
          return getTab();
        case 4:
          tab = _context7.sent;
          if (!(sendaction === "UDAAlertMessageData")) {
            _context7.next = 11;
            break;
          }
          _context7.next = 8;
          return browserVar.tabs.sendMessage(tab.id, {
            action: sendaction,
            data: message
          });
        case 8:
          return _context7.abrupt("return", true);
        case 11:
          url = new URL(tab.url);
          domain = url.protocol + '//' + url.hostname;
          cspRecord = {
            cspenabled: false,
            udanallowed: true,
            domain: ''
          };
          cspData = getstoragedata(CSPStorageName);
          recordExists = false;
          if (!cspData) {
            _context7.next = 29;
            break;
          }
          cspRecords = cspData;
          if (!(cspRecords.length > 0)) {
            _context7.next = 29;
            break;
          }
          i = 0;
        case 20:
          if (!(i < cspRecords.length)) {
            _context7.next = 28;
            break;
          }
          if (!(cspRecords[i].domain === domain)) {
            _context7.next = 25;
            break;
          }
          recordExists = true;
          cspRecord = cspRecords[i];
          return _context7.abrupt("break", 28);
        case 25:
          i++;
          _context7.next = 20;
          break;
        case 28:
          if (recordExists) {
            sessionData.csp = cspRecord;
          }
        case 29:
          sessionData.csp = cspRecord;
          console.log(sessionData);
          _context7.next = 33;
          return browserVar.tabs.sendMessage(tab.id, {
            action: sendaction,
            data: JSON.stringify(sessionData)
          });
        case 33:
          return _context7.abrupt("return", true);
        case 34:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _sendSessionData.apply(this, arguments);
}
function getTab() {
  return _getTab.apply(this, arguments);
} // listen for the requests made from webpage for accessing userdata
function _getTab() {
  _getTab = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
    var queryOptions, tab;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          queryOptions = {
            active: true,
            currentWindow: true
          };
          _context8.next = 3;
          return browserVar.tabs.query(queryOptions);
        case 3:
          tab = _context8.sent[0];
          if (!tab) {
            _context8.next = 8;
            break;
          }
          return _context8.abrupt("return", tab);
        case 8:
          _context8.next = 10;
          return browserVar.tabs.get(activeTabId);
        case 10:
          tab = _context8.sent;
          if (!tab) {
            _context8.next = 15;
            break;
          }
          return _context8.abrupt("return", tab);
        case 15:
          console.log('No active tab identified.');
        case 16:
          return _context8.abrupt("return", tab);
        case 17:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return _getTab.apply(this, arguments);
}
browserVar.runtime.onMessage.addListener( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(request, sender, sendResponse) {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          console.log(request);
          if (!(request.action === "getusersessiondata")) {
            _context2.next = 5;
            break;
          }
          browserVar.storage.local.get([cookieName], /*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(storedsessiondata) {
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    if (!browserVar.runtime.lastError) {
                      _context.next = 4;
                      break;
                    }
                    console.log('failed to read stored session data');
                    _context.next = 30;
                    break;
                  case 4:
                    if (!(storedsessiondata.hasOwnProperty("sessionkey") && storedsessiondata["sessionKey"] && _typeof(storedsessiondata["sessionKey"]) != 'object')) {
                      _context.next = 15;
                      break;
                    }
                    sessionData = storedsessiondata;
                    if (!(storedsessiondata.hasOwnProperty('authenticated') && storedsessiondata.authenticated)) {
                      _context.next = 11;
                      break;
                    }
                    _context.next = 9;
                    return sendSessionData();
                  case 9:
                    _context.next = 13;
                    break;
                  case 11:
                    _context.next = 13;
                    return loginWithBrowser();
                  case 13:
                    _context.next = 30;
                    break;
                  case 15:
                    if (!(storedSessionData.hasOwnProperty(cookieName) && storedSessionData[cookieName].hasOwnProperty("sessionkey") && storedSessionData[cookieName]["sessionKey"] && _typeof(storedSessionData[cookieName]["sessionKey"]) != 'object')) {
                      _context.next = 26;
                      break;
                    }
                    sessionData = storedSessionData[cookieName];
                    // await sendSessionData();
                    if (!(storedSessionData.hasOwnProperty('authenticated') && storedSessionData.authenticated)) {
                      _context.next = 22;
                      break;
                    }
                    _context.next = 20;
                    return sendSessionData();
                  case 20:
                    _context.next = 24;
                    break;
                  case 22:
                    _context.next = 24;
                    return loginWithBrowser();
                  case 24:
                    _context.next = 30;
                    break;
                  case 26:
                    _context.next = 28;
                    return getSessionKey(false);
                  case 28:
                    _context.next = 30;
                    return loginWithBrowser();
                  case 30:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x4) {
              return _ref2.apply(this, arguments);
            };
          }());
          _context2.next = 17;
          break;
        case 5:
          if (!(request.action === "authtenicate")) {
            _context2.next = 10;
            break;
          }
          _context2.next = 8;
          return loginWithBrowser();
        case 8:
          _context2.next = 17;
          break;
        case 10:
          if (!(request.action === "Debugvalueset")) {
            _context2.next = 14;
            break;
          }
          UDADebug = request.data;
          _context2.next = 17;
          break;
        case 14:
          if (!(request.action === "createSession")) {
            _context2.next = 17;
            break;
          }
          _context2.next = 17;
          return keycloakStore(request.data);
        case 17:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

//storing the data to the browser storage
function storeSessionData() {
  return _storeSessionData.apply(this, arguments);
} //getting the sessionkey from backend server
function _storeSessionData() {
  _storeSessionData = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
    var storageData;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          storageData = {};
          storageData[cookieName] = sessionData;
          _context9.next = 4;
          return browserVar.storage.local.set(storageData);
        case 4:
          return _context9.abrupt("return", true);
        case 5:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return _storeSessionData.apply(this, arguments);
}
function getSessionKey() {
  return _getSessionKey.apply(this, arguments);
} //binding the sessionkey and browser identity id
function _getSessionKey() {
  _getSessionKey = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
    var senddata,
      response,
      _args10 = arguments;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          senddata = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : true;
          _context10.next = 3;
          return (0,_util_invokeApi__WEBPACK_IMPORTED_MODULE_1__.invokeApi)(apiHost + "/user/getsessionkey", "GET", null, false);
        case 3:
          response = _context10.sent;
          console.log(response);
          if (response) {
            _context10.next = 7;
            break;
          }
          return _context10.abrupt("return", response);
        case 7:
          sessionData.sessionkey = response;
          _context10.next = 10;
          return storeSessionData();
        case 10:
          if (!senddata) {
            _context10.next = 13;
            break;
          }
          _context10.next = 13;
          return sendSessionData();
        case 13:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return _getSessionKey.apply(this, arguments);
}
function bindAuthenticatedAccount() {
  return _bindAuthenticatedAccount.apply(this, arguments);
} //binding the session to the authid
function _bindAuthenticatedAccount() {
  _bindAuthenticatedAccount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
    var authdata, response;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          authdata = {
            authid: sessionData.authdata.id,
            emailid: sessionData.authdata.email ? sessionData.authdata.email : '',
            authsource: sessionData.authenticationsource
          };
          _context11.next = 3;
          return (0,_util_invokeApi__WEBPACK_IMPORTED_MODULE_1__.invokeApi)(apiHost + "/user/checkauthid", "POST", authdata);
        case 3:
          response = _context11.sent;
          if (!response) {
            _context11.next = 10;
            break;
          }
          _context11.next = 7;
          return bindAccount(response);
        case 7:
          return _context11.abrupt("return", true);
        case 10:
          return _context11.abrupt("return", response);
        case 11:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return _bindAuthenticatedAccount.apply(this, arguments);
}
function bindAccount(_x5) {
  return _bindAccount.apply(this, arguments);
}
function _bindAccount() {
  _bindAccount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(userauthdata) {
    var usersessiondata, response;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          usersessiondata = {
            userauthid: userauthdata.id,
            usersessionid: sessionData.sessionkey
          };
          _context12.next = 3;
          return (0,_util_invokeApi__WEBPACK_IMPORTED_MODULE_1__.invokeApi)(apiHost + "/user/checkusersession", "POST", usersessiondata);
        case 3:
          response = _context12.sent;
          _context12.next = 6;
          return storeSessionData();
        case 6:
          _context12.next = 8;
          return sendSessionData("UDAAuthenticatedUserSessionData");
        case 8:
          return _context12.abrupt("return", true);
        case 9:
        case "end":
          return _context12.stop();
      }
    }, _callee12);
  }));
  return _bindAccount.apply(this, arguments);
}
function CheckCSPStorage() {
  var cspenabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var udanallowed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var domain = arguments.length > 2 ? arguments[2] : undefined;
  var csprecord = {
    cspenabled: cspenabled,
    udanallowed: udanallowed,
    domain: domain
  };
  var cspdata = getstoragedata(CSPStorageName);
  if (cspdata) {
    var _csprecords = cspdata;
    if (_csprecords.length > 0) {
      var recordexists = false;
      for (var i = 0; i < _csprecords.length; i++) {
        var record = _csprecords[i];
        if (record.domain === domain) {
          recordexists = true;
          _csprecords[i] = csprecord;
          createstoragedata(CSPStorageName, _csprecords);
        }
      }
      if (!recordexists) {
        _csprecords.push(csprecord);
        createstoragedata(CSPStorageName, _csprecords);
      }
    } else {
      _csprecords.push(csprecord);
      createstoragedata(CSPStorageName, _csprecords);
    }
  } else {
    var csprecords = [];
    csprecords.push(csprecord);
    createstoragedata(CSPStorageName, csprecords);
  }
}
function createstoragedata(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}
function getstoragedata(key) {
  try {
    var result = localStorage.getItem(key);
    return JSON.parse(result);
  } catch (e) {
    return false;
  }
}
function ProcessCSPValues() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var domain = arguments.length > 1 ? arguments[1] : undefined;
  var udanallowed = false;
  var cspenabled = true;
  if (value) {
    var allowedSrcs = value.split(";");
    if (allowedSrcs.length > 0) {
      for (var i = 0; i < allowedSrcs.length; i++) {
        var allowedSrc = allowedSrcs[i];
        var allowedDomains = allowedSrc.split(' ');
        if (allowedDomains.length > 1 && allowedDomains[0].toLowerCase() === 'default-src') {
          for (var index = 0; index < allowedDomains.length; index++) {
            var allowedDomain = allowedDomains[index];
            if (allowedDomain === 'default-src') {
              continue;
            }
            switch (allowedDomain.toLowerCase()) {
              case '*':
              case 'https:':
                udanallowed = true;
                cspenabled = true;
                break;
            }
          }
        } else if (allowedDomains.length > 0 && allowedDomains[0].toLowerCase() === 'default-src') {
          udanallowed = true;
          cspenabled = true;
        }
      }
    }
  } else {
    udanallowed = true;
    cspenabled = true;
  }
  CheckCSPStorage(cspenabled, udanallowed, domain);
}
var onHeadersReceived = function onHeadersReceived(details) {
  var url = new URL(details.url);
  var domain = url.protocol + '//' + url.hostname;
  for (var i = 0; i < details.responseHeaders.length; i++) {
    if (details.responseHeaders[i].name.toLowerCase() === 'content-security-policy') {
      ProcessCSPValues(details.responseHeaders[i].value, domain);
    }
  }
};
var onHeaderFilter = {
  urls: ['*://*/*'],
  types: ['main_frame']
};

// commented the CSP checking code functionality
/*browserVar.declarativeNetRequest.onHeadersReceived.addListener(
	onHeadersReceived, onHeaderFilter, ['blocking', 'responseHeaders']
);*/

/**
 * Store keycloak data in browser extension storage for retrival for other sites
 */
function keycloakStore(_x6) {
  return _keycloakStore.apply(this, arguments);
}
function _keycloakStore() {
  _keycloakStore = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(data) {
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          console.log('creating session at extension');
          sessionData.authenticationsource = 'keycloak';
          sessionData.authenticated = true;
          sessionData.authdata = data;
          _context13.next = 6;
          return getSessionKey(false);
        case 6:
          _context13.next = 8;
          return bindAuthenticatedAccount();
        case 8:
        case "end":
          return _context13.stop();
      }
    }, _callee13);
  }));
  return _keycloakStore.apply(this, arguments);
}
}();
UdanLibrary = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=UDABackground.js.map