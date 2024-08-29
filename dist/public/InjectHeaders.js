var _a;
let s = document.createElement('script');
let scriptpath = (_a = chrome === null || chrome === void 0 ? void 0 : chrome.runtime) === null || _a === void 0 ? void 0 : _a.getURL("assets/UDAHeaders.js");
s.src = scriptpath;
s.onload = function () {
};
(document.head || document.documentElement).appendChild(s);
