var s = document.createElement('script');s.async = false;s.onload = function() {};s.text = `(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("LibraryName", [], factory);
	else if(typeof exports === 'object')
		exports["LibraryName"] = factory();
	else
		root["LibraryName"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/browserCheck.ts":
/*!*************************************!*\
  !*** ./src/modules/browserCheck.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UDABrowserCheck": () => (/* binding */ UDABrowserCheck)
/* harmony export */ });
var UDABrowserCheck = {
    /**
       * Detects Chrome browser
       * @param {string} userAgent
       * @return {boolean}
       */
    isChrome: function (userAgent) {
        return (userAgent.includes('Chrome') &&
            !userAgent.includes('Chromium') &&
            !userAgent.includes('OPR') &&
            !userAgent.includes('Edge') &&
            !userAgent.includes('Edg') &&
            !userAgent.includes('SamsungBrowser'));
    },
    /**
       * Detects Safari browser
       * @param {string} userAgent
       * @return {boolean}
       */
    isSafari: function (userAgent) {
        return (userAgent.includes('Safari') &&
            !userAgent.includes('Chrome') &&
            !userAgent.includes('Chromium') &&
            !userAgent.includes('Edg') &&
            !userAgent.includes('Android'));
    },
    /**
       * Detects UC browser
       * @param {string} userAgent
       * @return {boolean}
       */
    isUCBrowser: function (userAgent) {
        return userAgent.includes('UCBrowser');
    },
    /**
       * Detects Firefox browser
       * @param {string} userAgent
       * @return {boolean}
       */
    isFirefox: function (userAgent) {
        return userAgent.includes('Firefox') && !userAgent.includes('Seamonkey');
    },
    /**
       * Detects IE browser
       * @param {string} userAgent
       * @return {boolean}
       */
    isIE: function (userAgent) {
        return /trident/i.test(userAgent);
    },
    /**
       * Detects Opera browser
       * @param {string} userAgent
       * @return {boolean}
       */
    isOpera: function (userAgent) {
        return userAgent.includes('OPR');
    },
    /**
       * Detects Samsung browser
       * @param {string} userAgent
       * @return {boolean}
       */
    isSamsungInternet: function (userAgent) {
        return userAgent.includes('SamsungBrowser');
    },
    /**
       * Detects Android browser
       * @param {string} userAgent
       * @return {boolean}
       */
    isAndroidBrowser: function (userAgent) {
        return (userAgent.includes('Android') &&
            !userAgent.includes('Chrome') &&
            userAgent.includes('AppleWebKit'));
    },
    /**
       * Detects Edge browser
       * @param {string} userAgent
       * @return {boolean}
       */
    isEdge: function (userAgent) {
        return userAgent.match(/\b(Edge|Edgios|Edga|Edg)\/(\d+)/);
        // return ((userAgent.includes('Edge') || userAgent.includes('Edgeios') || userAgent.includes('Edga') || userAgent.includes('Edg')) && userAgent.includes('Chrome'));
    },
    /**
       * Detects browser name
       * @param {string} userAgent - window.navigator
       * @return {string} browser name
       */
    detectBrowserName: function (userAgent) {
        if (this.isChrome(userAgent))
            return 'Chrome';
        if (this.isSafari(userAgent))
            return 'Safari';
        if (this.isUCBrowser(userAgent))
            return 'UC Browser';
        if (this.isFirefox(userAgent))
            return 'Firefox';
        if (this.isIE(userAgent))
            return 'IE';
        if (this.isOpera(userAgent))
            return 'Opera';
        if (this.isSamsungInternet(userAgent))
            return 'Samsung Internet';
        if (this.isAndroidBrowser(userAgent))
            return 'Android Browser';
        if (this.isEdge(userAgent))
            return 'Edge';
    },
    /**
       * Retrieve browser version
       * @param {string} name
       * @param {string} str
       * @return {number} browser version
       */
    retrieveVersion: function (name, str) {
        name = name + '/';
        var start = str.indexOf(name);
        var preNum = str.substring(start + name.length);
        var index = preNum.indexOf(' ');
        if (index > 0)
            preNum = preNum.substring(0, index);
        var end;
        if (preNum.indexOf('.', 2) > 0) {
            end = preNum.indexOf('.', 2);
        }
        else {
            end = preNum.indexOf('.', 1);
        }
        var num = preNum.substring(0, end);
        return Number(num);
    },
    /**
       * Returns Association
       * @param {string} name
       * @return {string} browser name
       */
    getBeautifulName: function (name) {
        var browserName;
        switch (name) {
            case 'Opera':
                browserName = 'OPR';
                break;
            case 'UC Browser':
                browserName = 'UCBrowser';
                break;
            case 'Samsung Internet':
                browserName = 'SamsungBrowser';
                break;
        }
        return browserName;
    },
    /**
       * Detects browser version
       * @param {object} nav
       * @param {string} name
       * @return {number} browser version
       */
    detectBrowserVersion: function (nav, name) {
        var userAgent = nav.userAgent;
        switch (name) {
            case 'IE': {
                var _temp1 = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
                return Number(_temp1[1]) || null;
            }
            case 'Edge': {
                var _temp2 = userAgent.match(/\b(Edge|Edgios|Edga|Edg)\/(\d+)/);
                return Number(_temp2[2]);
            }
        }
        var browserName = this.getBeautifulName(name);
        if (browserName)
            return this.retrieveVersion(browserName, userAgent);
        var found = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        found = found[2] ?
            [found[1], found[2]] :
            [nav.appName, nav.appVersion, '-?'];
        var temp;
        if ((temp = userAgent.match(/version\/(\d+)/i)) !== null) {
            found.splice(1, 1, temp[1]);
        }
        return Number(found[1]);
    },
    /**
       * Detects browser name & version
       * @param {object} nav
       * @return {object} browser name & version
       */
    detectBrowserNameAndVersion: function (nav) {
        var name = this.detectBrowserName(nav.userAgent);
        if (!name)
            return { name: 'unknown', version: 'unknown' };
        return {
            name: name,
            version: this.detectBrowserVersion(nav, name),
        };
    },
};


/***/ }),

/***/ "./src/util/index.ts":
/*!***************************!*\
  !*** ./src/util/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DSA_OBSERVER": () => (/* binding */ DSA_OBSERVER),
/* harmony export */   "UDAAddNewElement": () => (/* binding */ UDAAddNewElement),
/* harmony export */   "UDAProcessNode": () => (/* binding */ UDAProcessNode),
/* harmony export */   "UDAProcessRemovedNode": () => (/* binding */ UDAProcessRemovedNode),
/* harmony export */   "UDAdigestMessage": () => (/* binding */ UDAdigestMessage)
/* harmony export */ });
// import {UDAConsoleLogger, UDAErrorLogger} from '../config/error-log';
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var UDAClickObjects = [];
var UDARemovedClickObjects = [];
// adding the clickobjects that were identified.
function UDAAddNewElement(node) {
    try {
        var clickObject = { element: node };
        // checking whether the element is window or not
        if (clickObject.element === window) {
            return;
        }
        var tag = clickObject.element.tagName;
        if (tag &&
            (tag.toLowerCase() === 'body' ||
                tag.toLowerCase() === 'document' ||
                tag.toLowerCase() === 'window' ||
                tag.toLowerCase() === 'html')) {
            return;
        }
        if (clickObject.element.hasAttribute &&
            clickObject.element.hasAttribute('nist-voice')) {
            return;
        }
        for (var _i = 0, UDAClickObjects_1 = UDAClickObjects; _i < UDAClickObjects_1.length; _i++) {
            var i = UDAClickObjects_1[_i];
            if (i.element.isSameNode(clickObject.element)) {
                // todo, discuss , how better to call actions, if multiple actions should be stored, or selector better.
                return;
            }
        }
        clickObject.id = UDAClickObjects.length;
        UDAClickObjects.push(clickObject);
    }
    catch (e) {
        var htmlelement = node.innerHTML;
        // UDAErrorLogger.error(
        //     'Unable to process clickable object - ' + htmlelement,
        //     e,
        // );
    }
}
// processing node from mutation and then send to clickbojects addition
function UDAProcessNode(node) {
    var _a;
    var processchildren = true;
    if (node.onclick != undefined) {
        UDAAddNewElement(node);
    }
    // switched to switch case condition from if condition
    if (node.tagName) {
        switch (node.tagName.toLowerCase()) {
            case 'a':
                if (node instanceof HTMLAnchorElement && (node === null || node === void 0 ? void 0 : node.href) !== undefined) {
                    UDAAddNewElement(node);
                }
                break;
            case 'input':
            case 'textarea':
            case 'option':
            case 'select':
                UDAAddNewElement(node);
                break;
            case 'button':
                if (node.hasAttribute('ng-click') || node.hasAttribute('onclick')) {
                    UDAAddNewElement(node);
                }
                else if (node.hasAttribute('type') &&
                    node.getAttribute('type') === 'submit') {
                    UDAAddNewElement(node);
                }
                else if (node.classList &&
                    (node.classList.contains('expand-button') ||
                        node.classList.contains('btn-pill'))) {
                    UDAAddNewElement(node);
                }
                else {
                    //UDAConsoleLogger.info({node});
                }
                break;
            case 'span':
                if (node.classList && node.classList.contains('select2-selection')) {
                    UDAAddNewElement(node);
                }
                else if (node.hasAttribute('ng-click') ||
                    node.hasAttribute('onclick')) {
                    UDAAddNewElement(node);
                }
                break;
            // fix for editor issue
            case 'ckeditor':
                UDAAddNewElement(node);
                break;
            case 'div':
                if (node.hasAttribute('ng-click') || node.hasAttribute('onclick')) {
                    UDAAddNewElement(node);
                }
                break;
        }
    }
    if (node.classList && node.classList.contains('dropdown-toggle')) {
        UDAAddNewElement(node);
    }
    if (node.children && ((_a = node === null || node === void 0 ? void 0 : node.children) === null || _a === void 0 ? void 0 : _a.length) && processchildren) {
        for (var _i = 0, _b = Array.from(node === null || node === void 0 ? void 0 : node.children); _i < _b.length; _i++) {
            var i = _b[_i];
            UDAProcessNode(i);
        }
    }
}
// removal of clickbojects via mutation observer
function UDAProcessRemovedNode(node) {
    var _index = 0;
    for (var _i = 0, UDAClickObjects_2 = UDAClickObjects; _i < UDAClickObjects_2.length; _i++) {
        var j = UDAClickObjects_2[_i];
        if (node.isEqualNode(j.element)) {
            var addtoremovenodes = true;
            // removedclickobjectcounter:
            for (var _a = 0, UDARemovedClickObjects_1 = UDARemovedClickObjects; _a < UDARemovedClickObjects_1.length; _a++) {
                var k = UDARemovedClickObjects_1[_a];
                if (node.isEqualNode(k.element)) {
                    addtoremovenodes = false;
                    break;
                }
            }
            if (addtoremovenodes) {
                UDARemovedClickObjects.push(j);
            }
            UDAClickObjects.splice(_index, 1);
            _index++;
            break;
        }
    }
    if (node.children) {
        for (var _b = 0, _c = node.children; _b < _c.length; _b++) {
            var i = _c[_b];
            UDAProcessRemovedNode(i);
        }
    }
}
function UDAdigestMessage(textmessage, algorithm) {
    return __awaiter(this, void 0, void 0, function () {
        var encoder, data, hash, hashArray, hashHex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    encoder = new TextEncoder();
                    data = encoder.encode(textmessage);
                    return [4 /*yield*/, crypto.subtle.digest(algorithm, data)];
                case 1:
                    hash = _a.sent();
                    hashArray = Array.from(new Uint8Array(hash));
                    hashHex = hashArray
                        .map(function (b) { return b.toString(16).padStart(2, '0'); })
                        .join('');
                    return [2 /*return*/, hashHex];
            }
        });
    });
}
var UDALastMutationTime = 0;
// mutation observer initialization and adding the logic to process the clickobjects
var DSA_OBSERVER = new MutationObserver(function (mutations) {
    // UDAConsoleLogger.info('------------ detected clicked objects-------------');
    // UDAConsoleLogger.info(UDAClickObjects);
    mutations.forEach(function (mutation) {
        if (mutation.removedNodes.length) {
            [].some.call(mutation.removedNodes, UDAProcessRemovedNode);
        }
        if (!mutation.addedNodes.length) {
            return;
        }
        [].some.call(mutation.addedNodes, UDAProcessNode);
    });
    // UDAConsoleLogger.info('------------ removed clicked objects-------------');
    // UDAConsoleLogger.info(UDAClickObjects);
    UDALastMutationTime = Date.now();
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/sdk/header.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/index */ "./src/util/index.ts");
/* harmony import */ var _modules_browserCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/browserCheck */ "./src/modules/browserCheck.ts");
var _a;

// import { UDAUserAuthData } from './modules/authData'

var UDABrowserName = _modules_browserCheck__WEBPACK_IMPORTED_MODULE_1__.UDABrowserCheck.detectBrowserNameAndVersion(navigator);
var UDAAllowedBrowsers = ['chrome', 'edge'];
var isUDAAllowed = UDAAllowedBrowsers.indexOf((_a = UDABrowserName === null || UDABrowserName === void 0 ? void 0 : UDABrowserName.name) === null || _a === void 0 ? void 0 : _a.toLowerCase());
if (isUDAAllowed < 0) {
    // UDAConsoleLogger.info('UDA links script not loaded');
}
else {
    // adding the click object that is registered via javascript
    EventTarget.prototype.addEventListener = (function (addEventListener) {
        var element = this;
        return function () {
            if (arguments[0] === 'click') {
                (0,_util_index__WEBPACK_IMPORTED_MODULE_0__.UDAAddNewElement)(element);
            }
            addEventListener.call(element, arguments[0], arguments[1], arguments[2]);
        };
    })(EventTarget.prototype.addEventListener);
    // starting the mutation observer
    _util_index__WEBPACK_IMPORTED_MODULE_0__.DSA_OBSERVER.observe(document, {
        childList: true,
        subtree: true,
    });
}

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRSxDQUFDLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFFM0MsaUNBQWlDO0lBQ2pDLDZEQUFvQixDQUFDLFFBQVEsRUFBRTtRQUM3QixTQUFTLEVBQUUsSUFBSTtRQUNmLE9BQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQyxDQUFDO0NBQ0oiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9MaWJyYXJ5TmFtZS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vTGlicmFyeU5hbWUvLi9zcmMvbW9kdWxlcy9icm93c2VyQ2hlY2sudHMiLCJ3ZWJwYWNrOi8vTGlicmFyeU5hbWUvLi9zcmMvdXRpbC9pbmRleC50cyIsIndlYnBhY2s6Ly9MaWJyYXJ5TmFtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9MaWJyYXJ5TmFtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTGlicmFyeU5hbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9MaWJyYXJ5TmFtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0xpYnJhcnlOYW1lLy4vc3JjL3Nkay9oZWFkZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJMaWJyYXJ5TmFtZVwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJMaWJyYXJ5TmFtZVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJMaWJyYXJ5TmFtZVwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsICgpID0+IHtcbnJldHVybiAiLCJleHBvcnQgY29uc3QgVURBQnJvd3NlckNoZWNrID0ge1xuICAvKipcblx0ICogRGV0ZWN0cyBDaHJvbWUgYnJvd3NlclxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXNlckFnZW50XG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59XG5cdCAqL1xuICBpc0Nocm9tZTogZnVuY3Rpb24odXNlckFnZW50OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdXNlckFnZW50LmluY2x1ZGVzKCdDaHJvbWUnKSAmJlxuXHRcdFx0IXVzZXJBZ2VudC5pbmNsdWRlcygnQ2hyb21pdW0nKSAmJlxuXHRcdFx0IXVzZXJBZ2VudC5pbmNsdWRlcygnT1BSJykgJiZcblx0XHRcdCF1c2VyQWdlbnQuaW5jbHVkZXMoJ0VkZ2UnKSAmJlxuXHRcdFx0IXVzZXJBZ2VudC5pbmNsdWRlcygnRWRnJykgJiZcblx0XHRcdCF1c2VyQWdlbnQuaW5jbHVkZXMoJ1NhbXN1bmdCcm93c2VyJylcbiAgICApO1xuICB9LFxuXG4gIC8qKlxuXHQgKiBEZXRlY3RzIFNhZmFyaSBicm93c2VyXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyQWdlbnRcblx0ICogQHJldHVybiB7Ym9vbGVhbn1cblx0ICovXG4gIGlzU2FmYXJpOiBmdW5jdGlvbih1c2VyQWdlbnQ6IHN0cmluZykge1xuICAgIHJldHVybiAoXG4gICAgICB1c2VyQWdlbnQuaW5jbHVkZXMoJ1NhZmFyaScpICYmXG5cdFx0XHQhdXNlckFnZW50LmluY2x1ZGVzKCdDaHJvbWUnKSAmJlxuXHRcdFx0IXVzZXJBZ2VudC5pbmNsdWRlcygnQ2hyb21pdW0nKSAmJlxuXHRcdFx0IXVzZXJBZ2VudC5pbmNsdWRlcygnRWRnJykgJiZcblx0XHRcdCF1c2VyQWdlbnQuaW5jbHVkZXMoJ0FuZHJvaWQnKVxuICAgICk7XG4gIH0sXG5cbiAgLyoqXG5cdCAqIERldGVjdHMgVUMgYnJvd3NlclxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXNlckFnZW50XG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59XG5cdCAqL1xuICBpc1VDQnJvd3NlcjogZnVuY3Rpb24odXNlckFnZW50OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdXNlckFnZW50LmluY2x1ZGVzKCdVQ0Jyb3dzZXInKTtcbiAgfSxcblxuICAvKipcblx0ICogRGV0ZWN0cyBGaXJlZm94IGJyb3dzZXJcblx0ICogQHBhcmFtIHtzdHJpbmd9IHVzZXJBZ2VudFxuXHQgKiBAcmV0dXJuIHtib29sZWFufVxuXHQgKi9cbiAgaXNGaXJlZm94OiBmdW5jdGlvbih1c2VyQWdlbnQ6IHN0cmluZykge1xuICAgIHJldHVybiB1c2VyQWdlbnQuaW5jbHVkZXMoJ0ZpcmVmb3gnKSAmJiAhdXNlckFnZW50LmluY2x1ZGVzKCdTZWFtb25rZXknKTtcbiAgfSxcblxuICAvKipcblx0ICogRGV0ZWN0cyBJRSBicm93c2VyXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyQWdlbnRcblx0ICogQHJldHVybiB7Ym9vbGVhbn1cblx0ICovXG4gIGlzSUU6IGZ1bmN0aW9uKHVzZXJBZ2VudDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIC90cmlkZW50L2kudGVzdCh1c2VyQWdlbnQpO1xuICB9LFxuXG4gIC8qKlxuXHQgKiBEZXRlY3RzIE9wZXJhIGJyb3dzZXJcblx0ICogQHBhcmFtIHtzdHJpbmd9IHVzZXJBZ2VudFxuXHQgKiBAcmV0dXJuIHtib29sZWFufVxuXHQgKi9cbiAgaXNPcGVyYTogZnVuY3Rpb24odXNlckFnZW50OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdXNlckFnZW50LmluY2x1ZGVzKCdPUFInKTtcbiAgfSxcblxuICAvKipcblx0ICogRGV0ZWN0cyBTYW1zdW5nIGJyb3dzZXJcblx0ICogQHBhcmFtIHtzdHJpbmd9IHVzZXJBZ2VudFxuXHQgKiBAcmV0dXJuIHtib29sZWFufVxuXHQgKi9cbiAgaXNTYW1zdW5nSW50ZXJuZXQ6IGZ1bmN0aW9uKHVzZXJBZ2VudDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHVzZXJBZ2VudC5pbmNsdWRlcygnU2Ftc3VuZ0Jyb3dzZXInKTtcbiAgfSxcblxuICAvKipcblx0ICogRGV0ZWN0cyBBbmRyb2lkIGJyb3dzZXJcblx0ICogQHBhcmFtIHtzdHJpbmd9IHVzZXJBZ2VudFxuXHQgKiBAcmV0dXJuIHtib29sZWFufVxuXHQgKi9cbiAgaXNBbmRyb2lkQnJvd3NlcjogZnVuY3Rpb24odXNlckFnZW50OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdXNlckFnZW50LmluY2x1ZGVzKCdBbmRyb2lkJykgJiZcblx0XHRcdCF1c2VyQWdlbnQuaW5jbHVkZXMoJ0Nocm9tZScpICYmXG5cdFx0XHR1c2VyQWdlbnQuaW5jbHVkZXMoJ0FwcGxlV2ViS2l0JylcbiAgICApO1xuICB9LFxuXG4gIC8qKlxuXHQgKiBEZXRlY3RzIEVkZ2UgYnJvd3NlclxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXNlckFnZW50XG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59XG5cdCAqL1xuICBpc0VkZ2U6IGZ1bmN0aW9uKHVzZXJBZ2VudDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHVzZXJBZ2VudC5tYXRjaCgvXFxiKEVkZ2V8RWRnaW9zfEVkZ2F8RWRnKVxcLyhcXGQrKS8pO1xuICAgIC8vIHJldHVybiAoKHVzZXJBZ2VudC5pbmNsdWRlcygnRWRnZScpIHx8IHVzZXJBZ2VudC5pbmNsdWRlcygnRWRnZWlvcycpIHx8IHVzZXJBZ2VudC5pbmNsdWRlcygnRWRnYScpIHx8IHVzZXJBZ2VudC5pbmNsdWRlcygnRWRnJykpICYmIHVzZXJBZ2VudC5pbmNsdWRlcygnQ2hyb21lJykpO1xuICB9LFxuXG4gIC8qKlxuXHQgKiBEZXRlY3RzIGJyb3dzZXIgbmFtZVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXNlckFnZW50IC0gd2luZG93Lm5hdmlnYXRvclxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9IGJyb3dzZXIgbmFtZVxuXHQgKi9cbiAgZGV0ZWN0QnJvd3Nlck5hbWU6IGZ1bmN0aW9uKHVzZXJBZ2VudDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuaXNDaHJvbWUodXNlckFnZW50KSkgcmV0dXJuICdDaHJvbWUnO1xuICAgIGlmICh0aGlzLmlzU2FmYXJpKHVzZXJBZ2VudCkpIHJldHVybiAnU2FmYXJpJztcbiAgICBpZiAodGhpcy5pc1VDQnJvd3Nlcih1c2VyQWdlbnQpKSByZXR1cm4gJ1VDIEJyb3dzZXInO1xuICAgIGlmICh0aGlzLmlzRmlyZWZveCh1c2VyQWdlbnQpKSByZXR1cm4gJ0ZpcmVmb3gnO1xuICAgIGlmICh0aGlzLmlzSUUodXNlckFnZW50KSkgcmV0dXJuICdJRSc7XG4gICAgaWYgKHRoaXMuaXNPcGVyYSh1c2VyQWdlbnQpKSByZXR1cm4gJ09wZXJhJztcbiAgICBpZiAodGhpcy5pc1NhbXN1bmdJbnRlcm5ldCh1c2VyQWdlbnQpKSByZXR1cm4gJ1NhbXN1bmcgSW50ZXJuZXQnO1xuICAgIGlmICh0aGlzLmlzQW5kcm9pZEJyb3dzZXIodXNlckFnZW50KSkgcmV0dXJuICdBbmRyb2lkIEJyb3dzZXInO1xuICAgIGlmICh0aGlzLmlzRWRnZSh1c2VyQWdlbnQpKSByZXR1cm4gJ0VkZ2UnO1xuICB9LFxuXG4gIC8qKlxuXHQgKiBSZXRyaWV2ZSBicm93c2VyIHZlcnNpb25cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0clxuXHQgKiBAcmV0dXJuIHtudW1iZXJ9IGJyb3dzZXIgdmVyc2lvblxuXHQgKi9cbiAgcmV0cmlldmVWZXJzaW9uOiBmdW5jdGlvbihuYW1lOiBzdHJpbmcsIHN0cjogc3RyaW5nKSB7XG4gICAgbmFtZSA9IG5hbWUgKyAnLyc7XG4gICAgY29uc3Qgc3RhcnQgPSBzdHIuaW5kZXhPZihuYW1lKTtcbiAgICBsZXQgcHJlTnVtID0gc3RyLnN1YnN0cmluZyhzdGFydCArIG5hbWUubGVuZ3RoKTtcbiAgICBjb25zdCBpbmRleCA9IHByZU51bS5pbmRleE9mKCcgJyk7XG4gICAgaWYgKGluZGV4ID4gMCkgcHJlTnVtID0gcHJlTnVtLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgbGV0IGVuZDtcblxuICAgIGlmIChwcmVOdW0uaW5kZXhPZignLicsIDIpID4gMCkge1xuICAgICAgZW5kID0gcHJlTnVtLmluZGV4T2YoJy4nLCAyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW5kID0gcHJlTnVtLmluZGV4T2YoJy4nLCAxKTtcbiAgICB9XG5cbiAgICBjb25zdCBudW0gPSBwcmVOdW0uc3Vic3RyaW5nKDAsIGVuZCk7XG4gICAgcmV0dXJuIE51bWJlcihudW0pO1xuICB9LFxuXG4gIC8qKlxuXHQgKiBSZXR1cm5zIEFzc29jaWF0aW9uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG5cdCAqIEByZXR1cm4ge3N0cmluZ30gYnJvd3NlciBuYW1lXG5cdCAqL1xuICBnZXRCZWF1dGlmdWxOYW1lOiBmdW5jdGlvbihuYW1lOiBzdHJpbmcpIHtcbiAgICBsZXQgYnJvd3Nlck5hbWU7XG4gICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICBjYXNlICdPcGVyYSc6XG4gICAgICAgIGJyb3dzZXJOYW1lID0gJ09QUic7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdVQyBCcm93c2VyJzpcbiAgICAgICAgYnJvd3Nlck5hbWUgPSAnVUNCcm93c2VyJztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ1NhbXN1bmcgSW50ZXJuZXQnOlxuICAgICAgICBicm93c2VyTmFtZSA9ICdTYW1zdW5nQnJvd3Nlcic7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gYnJvd3Nlck5hbWU7XG4gIH0sXG5cbiAgLyoqXG5cdCAqIERldGVjdHMgYnJvd3NlciB2ZXJzaW9uXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBuYXZcblx0ICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcblx0ICogQHJldHVybiB7bnVtYmVyfSBicm93c2VyIHZlcnNpb25cblx0ICovXG4gIGRldGVjdEJyb3dzZXJWZXJzaW9uOiBmdW5jdGlvbihuYXY6IGFueSwgbmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3Qge3VzZXJBZ2VudH0gPSBuYXY7XG5cbiAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgIGNhc2UgJ0lFJzoge1xuICAgICAgICBjb25zdCBfdGVtcDE6IGFueSA9IC9cXGJydlsgOl0rKFxcZCspL2cuZXhlYyh1c2VyQWdlbnQpIHx8IFtdO1xuICAgICAgICByZXR1cm4gTnVtYmVyKF90ZW1wMVsxXSkgfHwgbnVsbDtcbiAgICAgIH1cblxuICAgICAgY2FzZSAnRWRnZSc6IHtcbiAgICAgICAgY29uc3QgX3RlbXAyID0gdXNlckFnZW50Lm1hdGNoKC9cXGIoRWRnZXxFZGdpb3N8RWRnYXxFZGcpXFwvKFxcZCspLyk7XG4gICAgICAgIHJldHVybiBOdW1iZXIoX3RlbXAyWzJdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBicm93c2VyTmFtZSA9IHRoaXMuZ2V0QmVhdXRpZnVsTmFtZShuYW1lKTtcblxuICAgIGlmIChicm93c2VyTmFtZSkgcmV0dXJuIHRoaXMucmV0cmlldmVWZXJzaW9uKGJyb3dzZXJOYW1lLCB1c2VyQWdlbnQpO1xuXG4gICAgbGV0IGZvdW5kID1cblx0XHRcdHVzZXJBZ2VudC5tYXRjaChcblx0XHRcdCAgICAvKG9wZXJhfGNocm9tZXxzYWZhcml8ZmlyZWZveHxtc2llfHRyaWRlbnQoPz1cXC8pKVxcLz9cXHMqKFxcZCspL2ksXG5cdFx0XHQpIHx8IFtdO1xuXG4gICAgZm91bmQgPSBmb3VuZFsyXSA/XG5cdFx0XHRbZm91bmRbMV0sIGZvdW5kWzJdXSA6XG5cdFx0XHRbbmF2LmFwcE5hbWUsIG5hdi5hcHBWZXJzaW9uLCAnLT8nXTtcblxuICAgIGxldCB0ZW1wO1xuICAgIGlmICgodGVtcCA9IHVzZXJBZ2VudC5tYXRjaCgvdmVyc2lvblxcLyhcXGQrKS9pKSkgIT09IG51bGwpIHtcbiAgICAgIGZvdW5kLnNwbGljZSgxLCAxLCB0ZW1wWzFdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gTnVtYmVyKGZvdW5kWzFdKTtcbiAgfSxcblxuICAvKipcblx0ICogRGV0ZWN0cyBicm93c2VyIG5hbWUgJiB2ZXJzaW9uXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBuYXZcblx0ICogQHJldHVybiB7b2JqZWN0fSBicm93c2VyIG5hbWUgJiB2ZXJzaW9uXG5cdCAqL1xuICBkZXRlY3RCcm93c2VyTmFtZUFuZFZlcnNpb246IGZ1bmN0aW9uKG5hdjogYW55KSB7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMuZGV0ZWN0QnJvd3Nlck5hbWUobmF2LnVzZXJBZ2VudCk7XG4gICAgaWYgKCFuYW1lKSByZXR1cm4ge25hbWU6ICd1bmtub3duJywgdmVyc2lvbjogJ3Vua25vd24nfTtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHZlcnNpb246IHRoaXMuZGV0ZWN0QnJvd3NlclZlcnNpb24obmF2LCBuYW1lKSxcbiAgICB9O1xuICB9LFxufTtcbiIsIi8vIGltcG9ydCB7VURBQ29uc29sZUxvZ2dlciwgVURBRXJyb3JMb2dnZXJ9IGZyb20gJy4uL2NvbmZpZy9lcnJvci1sb2cnO1xuXG5jb25zdCBVREFDbGlja09iamVjdHM6IGFueSA9IFtdO1xuY29uc3QgVURBUmVtb3ZlZENsaWNrT2JqZWN0czogYW55ID0gW107XG5cbi8vIGFkZGluZyB0aGUgY2xpY2tvYmplY3RzIHRoYXQgd2VyZSBpZGVudGlmaWVkLlxuZXhwb3J0IGZ1bmN0aW9uIFVEQUFkZE5ld0VsZW1lbnQobm9kZTogSFRNTEVsZW1lbnQpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjbGlja09iamVjdDogYW55ID0ge2VsZW1lbnQ6IG5vZGV9O1xuXG4gICAgLy8gY2hlY2tpbmcgd2hldGhlciB0aGUgZWxlbWVudCBpcyB3aW5kb3cgb3Igbm90XG4gICAgaWYgKGNsaWNrT2JqZWN0LmVsZW1lbnQgPT09IHdpbmRvdykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRhZyA9IGNsaWNrT2JqZWN0LmVsZW1lbnQudGFnTmFtZTtcbiAgICBpZiAoXG4gICAgICB0YWcgJiZcblx0XHRcdCh0YWcudG9Mb3dlckNhc2UoKSA9PT0gJ2JvZHknIHx8XG5cdFx0XHRcdHRhZy50b0xvd2VyQ2FzZSgpID09PSAnZG9jdW1lbnQnIHx8XG5cdFx0XHRcdHRhZy50b0xvd2VyQ2FzZSgpID09PSAnd2luZG93JyB8fFxuXHRcdFx0XHR0YWcudG9Mb3dlckNhc2UoKSA9PT0gJ2h0bWwnKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGNsaWNrT2JqZWN0LmVsZW1lbnQuaGFzQXR0cmlidXRlICYmXG5cdFx0XHRjbGlja09iamVjdC5lbGVtZW50Lmhhc0F0dHJpYnV0ZSgnbmlzdC12b2ljZScpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgXG4gICAgZm9yIChjb25zdCBpIG9mIFVEQUNsaWNrT2JqZWN0cykge1xuICAgICAgaWYgKGkuZWxlbWVudC5pc1NhbWVOb2RlKGNsaWNrT2JqZWN0LmVsZW1lbnQpKSB7XG4gICAgICAgIC8vIHRvZG8sIGRpc2N1c3MgLCBob3cgYmV0dGVyIHRvIGNhbGwgYWN0aW9ucywgaWYgbXVsdGlwbGUgYWN0aW9ucyBzaG91bGQgYmUgc3RvcmVkLCBvciBzZWxlY3RvciBiZXR0ZXIuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGlja09iamVjdC5pZCA9IFVEQUNsaWNrT2JqZWN0cy5sZW5ndGg7XG4gICAgVURBQ2xpY2tPYmplY3RzLnB1c2goY2xpY2tPYmplY3QpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc3QgaHRtbGVsZW1lbnQgPSBub2RlLmlubmVySFRNTDtcbiAgICAvLyBVREFFcnJvckxvZ2dlci5lcnJvcihcbiAgICAvLyAgICAgJ1VuYWJsZSB0byBwcm9jZXNzIGNsaWNrYWJsZSBvYmplY3QgLSAnICsgaHRtbGVsZW1lbnQsXG4gICAgLy8gICAgIGUsXG4gICAgLy8gKTtcbiAgfVxufVxuXG4vLyBwcm9jZXNzaW5nIG5vZGUgZnJvbSBtdXRhdGlvbiBhbmQgdGhlbiBzZW5kIHRvIGNsaWNrYm9qZWN0cyBhZGRpdGlvblxuZXhwb3J0IGZ1bmN0aW9uIFVEQVByb2Nlc3NOb2RlKG5vZGU6IEhUTUxFbGVtZW50KSB7XG4gIGNvbnN0IHByb2Nlc3NjaGlsZHJlbiA9IHRydWU7XG5cbiAgaWYgKG5vZGUub25jbGljayAhPSB1bmRlZmluZWQpIHtcbiAgICBVREFBZGROZXdFbGVtZW50KG5vZGUpO1xuICB9XG5cbiAgLy8gc3dpdGNoZWQgdG8gc3dpdGNoIGNhc2UgY29uZGl0aW9uIGZyb20gaWYgY29uZGl0aW9uXG4gIGlmIChub2RlLnRhZ05hbWUpIHtcbiAgICBzd2l0Y2ggKG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICBjYXNlICdhJzpcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCAmJiBub2RlPy5ocmVmICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBVREFBZGROZXdFbGVtZW50KG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaW5wdXQnOlxuICAgICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgY2FzZSAnb3B0aW9uJzpcbiAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgIFVEQUFkZE5ld0VsZW1lbnQobm9kZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYnV0dG9uJzpcbiAgICAgICAgaWYgKG5vZGUuaGFzQXR0cmlidXRlKCduZy1jbGljaycpIHx8IG5vZGUuaGFzQXR0cmlidXRlKCdvbmNsaWNrJykpIHtcbiAgICAgICAgICBVREFBZGROZXdFbGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIG5vZGUuaGFzQXR0cmlidXRlKCd0eXBlJykgJiZcblx0XHRcdFx0XHRub2RlLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnc3VibWl0J1xuICAgICAgICApIHtcbiAgICAgICAgICBVREFBZGROZXdFbGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIG5vZGUuY2xhc3NMaXN0ICYmXG5cdFx0XHRcdFx0KG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdleHBhbmQtYnV0dG9uJykgfHxcblx0XHRcdFx0XHRcdG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdidG4tcGlsbCcpKVxuICAgICAgICApIHtcbiAgICAgICAgICBVREFBZGROZXdFbGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vVURBQ29uc29sZUxvZ2dlci5pbmZvKHtub2RlfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzcGFuJzpcbiAgICAgICAgaWYgKG5vZGUuY2xhc3NMaXN0ICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3QyLXNlbGVjdGlvbicpKSB7XG4gICAgICAgICAgVURBQWRkTmV3RWxlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBub2RlLmhhc0F0dHJpYnV0ZSgnbmctY2xpY2snKSB8fFxuXHRcdFx0XHRcdG5vZGUuaGFzQXR0cmlidXRlKCdvbmNsaWNrJylcbiAgICAgICAgKSB7XG4gICAgICAgICAgVURBQWRkTmV3RWxlbWVudChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgLy8gZml4IGZvciBlZGl0b3IgaXNzdWVcbiAgICAgIGNhc2UgJ2NrZWRpdG9yJzpcbiAgICAgICAgVURBQWRkTmV3RWxlbWVudChub2RlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkaXYnOlxuICAgICAgICBpZiAobm9kZS5oYXNBdHRyaWJ1dGUoJ25nLWNsaWNrJykgfHwgbm9kZS5oYXNBdHRyaWJ1dGUoJ29uY2xpY2snKSkge1xuICAgICAgICAgIFVEQUFkZE5ld0VsZW1lbnQobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKG5vZGUuY2xhc3NMaXN0ICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdkcm9wZG93bi10b2dnbGUnKSkge1xuICAgIFVEQUFkZE5ld0VsZW1lbnQobm9kZSk7XG4gIH1cblxuICBpZiAobm9kZS5jaGlsZHJlbiAmJiBub2RlPy5jaGlsZHJlbj8ubGVuZ3RoICYmIHByb2Nlc3NjaGlsZHJlbikge1xuICAgIGZvciAoY29uc3QgaSBvZiBBcnJheS5mcm9tKG5vZGU/LmNoaWxkcmVuKSkge1xuICAgICAgVURBUHJvY2Vzc05vZGUoaSBhcyBIVE1MRWxlbWVudCk7XG4gICAgfVxuICB9XG59XG5cbi8vIHJlbW92YWwgb2YgY2xpY2tib2plY3RzIHZpYSBtdXRhdGlvbiBvYnNlcnZlclxuZXhwb3J0IGZ1bmN0aW9uIFVEQVByb2Nlc3NSZW1vdmVkTm9kZShub2RlOiBhbnkpIHtcbiAgbGV0IF9pbmRleCA9IDA7XG4gIGZvciAoY29uc3QgaiBvZiBVREFDbGlja09iamVjdHMpIHtcbiAgICBpZiAobm9kZS5pc0VxdWFsTm9kZShqLmVsZW1lbnQpKSB7XG4gICAgICBsZXQgYWRkdG9yZW1vdmVub2RlcyA9IHRydWU7XG4gICAgICAvLyByZW1vdmVkY2xpY2tvYmplY3Rjb3VudGVyOlxuICAgICAgZm9yIChjb25zdCBrIG9mIFVEQVJlbW92ZWRDbGlja09iamVjdHMpIHtcbiAgICAgICAgaWYgKG5vZGUuaXNFcXVhbE5vZGUoay5lbGVtZW50KSkge1xuICAgICAgICAgIGFkZHRvcmVtb3Zlbm9kZXMgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGFkZHRvcmVtb3Zlbm9kZXMpIHtcbiAgICAgICAgVURBUmVtb3ZlZENsaWNrT2JqZWN0cy5wdXNoKGopO1xuICAgICAgfVxuICAgICAgVURBQ2xpY2tPYmplY3RzLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgX2luZGV4Kys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICBmb3IgKGNvbnN0IGkgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgVURBUHJvY2Vzc1JlbW92ZWROb2RlKGkpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gVURBZGlnZXN0TWVzc2FnZSh0ZXh0bWVzc2FnZTogc3RyaW5nLCBhbGdvcml0aG06IGFueSkge1xuICBjb25zdCBlbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG4gIGNvbnN0IGRhdGEgPSBlbmNvZGVyLmVuY29kZSh0ZXh0bWVzc2FnZSk7XG4gIGNvbnN0IGhhc2ggPSBhd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdChhbGdvcml0aG0sIGRhdGEpO1xuICBjb25zdCBoYXNoQXJyYXkgPSBBcnJheS5mcm9tKG5ldyBVaW50OEFycmF5KGhhc2gpKTsgLy8gY29udmVydCBidWZmZXIgdG8gYnl0ZSBhcnJheVxuICBjb25zdCBoYXNoSGV4ID0gaGFzaEFycmF5XG4gICAgICAubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKVxuICAgICAgLmpvaW4oJycpOyAvLyBjb252ZXJ0IGJ5dGVzIHRvIGhleCBzdHJpbmdcbiAgcmV0dXJuIGhhc2hIZXg7XG59XG5cbmxldCBVREFMYXN0TXV0YXRpb25UaW1lID0gMDtcbi8vIG11dGF0aW9uIG9ic2VydmVyIGluaXRpYWxpemF0aW9uIGFuZCBhZGRpbmcgdGhlIGxvZ2ljIHRvIHByb2Nlc3MgdGhlIGNsaWNrb2JqZWN0c1xuZXhwb3J0IGNvbnN0IERTQV9PQlNFUlZFUiA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKG11dGF0aW9ucykge1xuICAvLyBVREFDb25zb2xlTG9nZ2VyLmluZm8oJy0tLS0tLS0tLS0tLSBkZXRlY3RlZCBjbGlja2VkIG9iamVjdHMtLS0tLS0tLS0tLS0tJyk7XG4gIC8vIFVEQUNvbnNvbGVMb2dnZXIuaW5mbyhVREFDbGlja09iamVjdHMpO1xuICBtdXRhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihtdXRhdGlvbikge1xuICAgIGlmIChtdXRhdGlvbi5yZW1vdmVkTm9kZXMubGVuZ3RoKSB7XG4gICAgICBbXS5zb21lLmNhbGwobXV0YXRpb24ucmVtb3ZlZE5vZGVzLCBVREFQcm9jZXNzUmVtb3ZlZE5vZGUpO1xuICAgIH1cbiAgICBpZiAoIW11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFtdLnNvbWUuY2FsbChtdXRhdGlvbi5hZGRlZE5vZGVzLCBVREFQcm9jZXNzTm9kZSk7XG4gIH0pO1xuICAvLyBVREFDb25zb2xlTG9nZ2VyLmluZm8oJy0tLS0tLS0tLS0tLSByZW1vdmVkIGNsaWNrZWQgb2JqZWN0cy0tLS0tLS0tLS0tLS0nKTtcbiAgLy8gVURBQ29uc29sZUxvZ2dlci5pbmZvKFVEQUNsaWNrT2JqZWN0cyk7XG4gIFVEQUxhc3RNdXRhdGlvblRpbWUgPSBEYXRlLm5vdygpO1xufSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7VURBQ29uc29sZUxvZ2dlcn0gZnJvbSAnLi4vY29uZmlnL2Vycm9yLWxvZyc7XG5pbXBvcnQge1VEQUFkZE5ld0VsZW1lbnQsIERTQV9PQlNFUlZFUn0gZnJvbSAnLi4vdXRpbC9pbmRleCc7XG4vLyBpbXBvcnQgeyBVREFVc2VyQXV0aERhdGEgfSBmcm9tICcuL21vZHVsZXMvYXV0aERhdGEnXG5pbXBvcnQge1VEQUJyb3dzZXJDaGVja30gZnJvbSAnLi4vbW9kdWxlcy9icm93c2VyQ2hlY2snO1xuXG5jb25zdCBVREFCcm93c2VyTmFtZSA9IFVEQUJyb3dzZXJDaGVjay5kZXRlY3RCcm93c2VyTmFtZUFuZFZlcnNpb24obmF2aWdhdG9yKTtcbmNvbnN0IFVEQUFsbG93ZWRCcm93c2VycyA9IFsnY2hyb21lJywgJ2VkZ2UnXTtcbmNvbnN0IGlzVURBQWxsb3dlZCA9IFVEQUFsbG93ZWRCcm93c2Vycy5pbmRleE9mKFxuICAgIFVEQUJyb3dzZXJOYW1lPy5uYW1lPy50b0xvd2VyQ2FzZSgpLFxuKTtcblxuaWYgKGlzVURBQWxsb3dlZCA8IDApIHtcbiAgLy8gVURBQ29uc29sZUxvZ2dlci5pbmZvKCdVREEgbGlua3Mgc2NyaXB0IG5vdCBsb2FkZWQnKTtcbn0gZWxzZSB7XG4gIC8vIGFkZGluZyB0aGUgY2xpY2sgb2JqZWN0IHRoYXQgaXMgcmVnaXN0ZXJlZCB2aWEgamF2YXNjcmlwdFxuICBFdmVudFRhcmdldC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IChmdW5jdGlvbihhZGRFdmVudExpc3RlbmVyKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2NsaWNrJykge1xuICAgICAgICBVREFBZGROZXdFbGVtZW50KGVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpO1xuICAgICAgfVxuICAgICAgYWRkRXZlbnRMaXN0ZW5lci5jYWxsKGVsZW1lbnQsIGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgIH07XG4gIH0pKEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyKTtcblxuICAvLyBzdGFydGluZyB0aGUgbXV0YXRpb24gb2JzZXJ2ZXJcbiAgRFNBX09CU0VSVkVSLm9ic2VydmUoZG9jdW1lbnQsIHtcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgfSk7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=`;