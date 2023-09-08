var UdanLibrary;
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/util/UDADigestMessage.ts":
/*!**************************************!*\
  !*** ./src/util/UDADigestMessage.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UDADigestMessage": function() { return /* binding */ UDADigestMessage; }
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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "invokeApi": function() { return /* binding */ invokeApi; }
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!***************************!*\
  !*** ./src/Background.js ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_UDADigestMessage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/UDADigestMessage */ "./src/util/UDADigestMessage.ts");
/* harmony import */ var _util_invokeApi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/invokeApi */ "./src/util/invokeApi.ts");


function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


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
chrome.tabs.onActivated.addListener(function (activeInfo) {
  activeTabId = activeInfo.tabId;
});

//login with chrome identity functionality
function loginWithChrome() {
  return _loginWithChrome.apply(this, arguments);
} //send the sessiondata to the webpage functionality
function _loginWithChrome() {
  _loginWithChrome = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          sessionData.authenticationsource = "google";
          chrome.identity.getProfileUserInfo({
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
  return _loginWithChrome.apply(this, arguments);
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
          return chrome.tabs.sendMessage(tab.id, {
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
          return chrome.tabs.sendMessage(tab.id, {
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
          return chrome.tabs.query(queryOptions);
        case 3:
          tab = _context8.sent[0];
          if (!tab) {
            _context8.next = 8;
            break;
          }
          return _context8.abrupt("return", tab);
        case 8:
          _context8.next = 10;
          return chrome.tabs.get(activeTabId);
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
chrome.runtime.onMessage.addListener( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(request, sender, sendResponse) {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!(request.action === "getusersessiondata")) {
            _context2.next = 4;
            break;
          }
          chrome.storage.local.get([cookieName], /*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(storedSessionData) {
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    if (!chrome.runtime.lastError) {
                      _context.next = 4;
                      break;
                    }
                    console.log('failed to read stored session data');
                    _context.next = 30;
                    break;
                  case 4:
                    if (!(storedSessionData.hasOwnProperty("sessionkey") && storedSessionData["sessionKey"] && _typeof(storedSessionData["sessionKey"]) != 'object')) {
                      _context.next = 15;
                      break;
                    }
                    sessionData = storedSessionData;
                    if (!(storedSessionData.hasOwnProperty('authenticated') && storedSessionData.authenticated)) {
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
                    return loginWithChrome();
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
                    return loginWithChrome();
                  case 24:
                    _context.next = 30;
                    break;
                  case 26:
                    _context.next = 28;
                    return getSessionKey(false);
                  case 28:
                    _context.next = 30;
                    return loginWithChrome();
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
          _context2.next = 16;
          break;
        case 4:
          if (!(request.action === "authtenicate")) {
            _context2.next = 9;
            break;
          }
          _context2.next = 7;
          return loginWithChrome();
        case 7:
          _context2.next = 16;
          break;
        case 9:
          if (!(request.action === "Debugvalueset")) {
            _context2.next = 13;
            break;
          }
          UDADebug = request.data;
          _context2.next = 16;
          break;
        case 13:
          if (!(request.action === "createSession")) {
            _context2.next = 16;
            break;
          }
          _context2.next = 16;
          return keycloakStore(request.data);
        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

//storing the data to the chrome storage
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
          return chrome.storage.local.set(storageData);
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
} //binding the sessionkey and chrome identity id
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
/*chrome.declarativeNetRequest.onHeadersReceived.addListener(
	onHeadersReceived, onHeaderFilter, ['blocking', 'responseHeaders']
);*/

/**
 * Store keycloak data in chrome extension storage for retrival for other sites
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