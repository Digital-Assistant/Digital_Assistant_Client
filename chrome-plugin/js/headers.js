(function webpackUniversalModuleDefinition(root, factory) {
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
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
/*!***************************!*\
  !*** ./src/sdk/header.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module './util/index'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './modules/browserCheck'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
var _a;

// import { UDAUserAuthData } from './modules/authData'

var UDABrowserName = Object(function webpackMissingModule() { var e = new Error("Cannot find module './modules/browserCheck'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(navigator);
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
                Object(function webpackMissingModule() { var e = new Error("Cannot find module './util/index'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(element);
            }
            addEventListener.call(element, arguments[0], arguments[1], arguments[2]);
        };
    })(EventTarget.prototype.addEventListener);
    // starting the mutation observer
    Object(function webpackMissingModule() { var e = new Error("Cannot find module './util/index'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(document, {
        childList: true,
        subtree: true,
    });
}

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlL2hlYWRlcnMuanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87O1VDVkE7VUFDQTs7Ozs7V0NEQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ0w0RDtBQUM1RCx1REFBdUQ7QUFDQTtBQUV2RCxJQUFNLGNBQWMsR0FBRyxxSkFBMkMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM5RSxJQUFNLGtCQUFrQixHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLElBQU0sWUFBWSxHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FDM0Msb0JBQWMsYUFBZCxjQUFjLHVCQUFkLGNBQWMsQ0FBRSxJQUFJLDBDQUFFLFdBQVcsRUFBRSxDQUN0QyxDQUFDO0FBRUYsSUFBSSxZQUFZLEdBQUcsQ0FBQyxFQUFFO0lBQ3BCLHdEQUF3RDtDQUN6RDtLQUFNO0lBQ0wsNERBQTREO0lBQzVELFdBQVcsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxVQUFTLGdCQUFnQjtRQUNqRSxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDckIsT0FBTztZQUNMLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sRUFBRTtnQkFDNUIsMklBQWdCLENBQUMsT0FBc0IsQ0FBQyxDQUFDO2FBQzFDO1lBQ0QsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNFLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUUzQyxpQ0FBaUM7SUFDakMsMklBQW9CLENBQUMsUUFBUSxFQUFFO1FBQzdCLFNBQVMsRUFBRSxJQUFJO1FBQ2YsT0FBTyxFQUFFLElBQUk7S0FDZCxDQUFDLENBQUM7Q0FDSiIsInNvdXJjZXMiOlsid2VicGFjazovL0xpYnJhcnlOYW1lL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9MaWJyYXJ5TmFtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9MaWJyYXJ5TmFtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0xpYnJhcnlOYW1lLy4vc3JjL3Nkay9oZWFkZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJMaWJyYXJ5TmFtZVwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJMaWJyYXJ5TmFtZVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJMaWJyYXJ5TmFtZVwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsICgpID0+IHtcbnJldHVybiAiLCIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHtVREFDb25zb2xlTG9nZ2VyfSBmcm9tICcuL2NvbmZpZy9lcnJvci1sb2cnO1xuaW1wb3J0IHtVREFBZGROZXdFbGVtZW50LCBEU0FfT0JTRVJWRVJ9IGZyb20gJy4vdXRpbC9pbmRleCc7XG4vLyBpbXBvcnQgeyBVREFVc2VyQXV0aERhdGEgfSBmcm9tICcuL21vZHVsZXMvYXV0aERhdGEnXG5pbXBvcnQge1VEQUJyb3dzZXJDaGVja30gZnJvbSAnLi9tb2R1bGVzL2Jyb3dzZXJDaGVjayc7XG5cbmNvbnN0IFVEQUJyb3dzZXJOYW1lID0gVURBQnJvd3NlckNoZWNrLmRldGVjdEJyb3dzZXJOYW1lQW5kVmVyc2lvbihuYXZpZ2F0b3IpO1xuY29uc3QgVURBQWxsb3dlZEJyb3dzZXJzID0gWydjaHJvbWUnLCAnZWRnZSddO1xuY29uc3QgaXNVREFBbGxvd2VkID0gVURBQWxsb3dlZEJyb3dzZXJzLmluZGV4T2YoXG4gICAgVURBQnJvd3Nlck5hbWU/Lm5hbWU/LnRvTG93ZXJDYXNlKCksXG4pO1xuXG5pZiAoaXNVREFBbGxvd2VkIDwgMCkge1xuICAvLyBVREFDb25zb2xlTG9nZ2VyLmluZm8oJ1VEQSBsaW5rcyBzY3JpcHQgbm90IGxvYWRlZCcpO1xufSBlbHNlIHtcbiAgLy8gYWRkaW5nIHRoZSBjbGljayBvYmplY3QgdGhhdCBpcyByZWdpc3RlcmVkIHZpYSBqYXZhc2NyaXB0XG4gIEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gKGZ1bmN0aW9uKGFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoYXJndW1lbnRzWzBdID09PSAnY2xpY2snKSB7XG4gICAgICAgIFVEQUFkZE5ld0VsZW1lbnQoZWxlbWVudCBhcyBIVE1MRWxlbWVudCk7XG4gICAgICB9XG4gICAgICBhZGRFdmVudExpc3RlbmVyLmNhbGwoZWxlbWVudCwgYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgfTtcbiAgfSkoRXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIpO1xuXG4gIC8vIHN0YXJ0aW5nIHRoZSBtdXRhdGlvbiBvYnNlcnZlclxuICBEU0FfT0JTRVJWRVIub2JzZXJ2ZShkb2N1bWVudCwge1xuICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICBzdWJ0cmVlOiB0cnVlLFxuICB9KTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==