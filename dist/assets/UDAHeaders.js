var UdanLibrary;
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/util/headers/addToClickObject.js":
/*!**********************************************!*\
  !*** ./src/util/headers/addToClickObject.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AddToClickObjects: function() { return /* binding */ AddToClickObjects; },
/* harmony export */   ignoreTags: function() { return /* binding */ ignoreTags; }
/* harmony export */ });
var ignoreTags = ["body", "document", "window", "html", "script", "style", "iframe", "doctype", "link", "svg", "path", "meta", "circle", "rect", "stop", "defs", "linearGradient", "g"];
var AddToClickObjects = function AddToClickObjects(node) {
  try {
    var _clickObject$element, _clickObject$element2;
    var clickObject = {
      element: node,
      id: ''
    };

    //checking whether the element is window or not
    if (clickObject.element === window) {
      return;
    }
    if (typeof (clickObject === null || clickObject === void 0 || (_clickObject$element = clickObject.element) === null || _clickObject$element === void 0 ? void 0 : _clickObject$element.tagName) === 'undefined') {
      return;
    }
    var tag = clickObject === null || clickObject === void 0 || (_clickObject$element2 = clickObject.element) === null || _clickObject$element2 === void 0 ? void 0 : _clickObject$element2.tagName;
    if (tag && ignoreTags.indexOf(tag.toLowerCase()) !== -1) {
      return;
    }
    if (node.classList && node.classList.contains('uda_exclude')) {
      return;
    }
    for (var i = 0; i < UDAClickObjects.length; i++) {
      if (UDAClickObjects[i].element.isSameNode(clickObject.element)) {
        //todo, discuss , how better to call actions, if multiple actions should be stored, or selector better.
        return;
      }
    }
    clickObject.id = UDAClickObjects.length;
    UDAClickObjects.push(clickObject);
  } catch (e) {
    console.log('Unable to process clickable object - ' + node, e);
  }
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!************************!*\
  !*** ./src/Headers.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_headers_addToClickObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/headers/addToClickObject */ "./src/util/headers/addToClickObject.js");
// adding the click object that is registered via javascript
window.UDAClickObjects = [];
window.UDARemovedClickObjects = [];

EventTarget.prototype.addEventListener = function (addEventListener) {
  return function () {
    if (arguments[0] === "click") {
      (0,_util_headers_addToClickObject__WEBPACK_IMPORTED_MODULE_0__.AddToClickObjects)(this);
    }
    addEventListener.call(this, arguments[0], arguments[1], arguments[2]);
  };
}(EventTarget.prototype.addEventListener);
}();
UdanLibrary = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=UDAHeaders.js.map