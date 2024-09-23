var UdanLibrary;
/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!******************************!*\
  !*** ./src/InjectHeaders.js ***!
  \******************************/
let s = document.createElement('script');
let scriptpath = chrome?.runtime?.getURL("assets/UDAHeaders.js");
s.src = scriptpath;
s.onload = function () {};
(document.head || document.documentElement).appendChild(s);
UdanLibrary = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=UDAInjectHeaders.js.map