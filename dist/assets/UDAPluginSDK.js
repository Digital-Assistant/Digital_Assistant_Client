var UdanLibrary;
/******/ (function() { // webpackBootstrap
var __webpack_exports__ = {};
/*!********************************!*\
  !*** ./src/injectPluginSDK.js ***!
  \********************************/
var _chrome, _chrome$runtime;
var s1 = document.createElement('script');
var scriptPath = (_chrome = chrome) === null || _chrome === void 0 ? void 0 : (_chrome$runtime = _chrome.runtime) === null || _chrome$runtime === void 0 ? void 0 : _chrome$runtime.getURL("assets/UDASdk.js");
s1.src = scriptPath;
s1.onload = function () {};
(document.body || document.documentElement).appendChild(s1);
document.addEventListener("RequestUDASessionData", function (data) {
  chrome.runtime.sendMessage({
    action: data.detail.data,
    data: data.detail.data
  });
});
document.addEventListener("UDADebugSetEvent", function (data) {
  chrome.runtime.sendMessage({
    action: data.detail.data.action,
    data: data.detail.data.value
  });
});

/**
 * create keycloak storage to chrome
 */
document.addEventListener("CreateUDASessionData", function (data) {
  chrome.runtime.sendMessage({
    action: data.detail.action,
    data: data.detail.data
  });
});
chrome.runtime.onMessage.addListener(function (request) {
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

/**
 * listener for removed additional data that was added by the frameworks
 */
document.addEventListener("UDANodeData", function (data) {
  console.log('nodedata listener at content script');
  console.log({
    node: data.relatedTarget
  });
});
UdanLibrary = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=UDAPluginSDK.js.map