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
/******/ 	var __webpack_modules__ = ({

/***/ "./src/config/index.ts":
/*!*****************************!*\
  !*** ./src/config/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CONFIG": () => (/* binding */ CONFIG)
/* harmony export */ });
var CONFIG = {
    current: 'TEST',
    UDADebug: false,
    UDA_DOMAIN: "https://udantest.nistapp.ai",
    UDA_API_URL: "https://udantest.nistapp.ai/voiceapi",
    UDASessionID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    UDA_POST_INTERVAL: 1000,
    UDALastMutationTime: 0,
    UDALogLevel: 0,
    set Environment(value) {
        this.current = value.toString().toUpperCase();
        if (this.current === 'PROD') {
            this.UDA_DOMAIN = "https://udan.nistapp.ai";
        }
        else {
            this.UDA_DOMAIN = "https://udantest.nistapp.ai";
        }
        this.UDA_API_URL = this.UDA_DOMAIN + "/voiceapi";
    },
    get Environment() {
        return this.current;
    }
};


/***/ }),

/***/ "./src/modules/authData.ts":
/*!*********************************!*\
  !*** ./src/modules/authData.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UDAUserAuthData": () => (/* binding */ UDAUserAuthData),
/* harmony export */   "udaauthdata": () => (/* binding */ udaauthdata)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./src/util/index.ts");

var UDAUserAuthData = { id: '', email: '', restrict_add_delete: false, role: 'default', permissions: '' };
var udaauthdata = {
    set id(val) {
        if (!val)
            return;
        (0,_util__WEBPACK_IMPORTED_MODULE_0__.UDAdigestMessage)(val, "SHA-512").then(function (encrypted) {
            UDAUserAuthData.id = encrypted;
            var sessionEvent = new CustomEvent("UDAClearSessionData", { detail: { data: "clearsession" }, bubbles: false, cancelable: false });
            document.dispatchEvent(sessionEvent);
        });
    },
    get id() {
        return UDAUserAuthData.id;
    },
    set email(val) {
        (0,_util__WEBPACK_IMPORTED_MODULE_0__.UDAdigestMessage)(val, "SHA-512").then(function (encrypted) {
            UDAUserAuthData.email = encrypted;
            var sessionEvent = new CustomEvent("UDAClearSessionData", { detail: { data: "clearsession" }, bubbles: false, cancelable: false });
            document.dispatchEvent(sessionEvent);
        });
    },
    get email() {
        return UDAUserAuthData.email;
    },
    set userRole(val) {
        UDAUserAuthData.role = val;
        var sessionEvent = new CustomEvent("UDAClearSessionData", { detail: { data: "clearsession" }, bubbles: false, cancelable: false });
        document.dispatchEvent(sessionEvent);
    },
    get userRole() {
        return UDAUserAuthData.role;
    },
    set restrict_add_delete(val) {
        UDAUserAuthData.restrict_add_delete = val;
        var sessionEvent = new CustomEvent("UDADisableButton", { detail: { data: "UDADisableButton" }, bubbles: false, cancelable: false });
        document.dispatchEvent(sessionEvent);
    },
    get restrict_add_delete() {
        return UDAUserAuthData.restrict_add_delete;
    },
    set permissions(val) {
        UDAUserAuthData.permissions = val;
    },
    get permissions() {
        return UDAUserAuthData.permissions;
    }
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
/*!***********************************!*\
  !*** ./src/sdk/Voicepluginsdk.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_authData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/authData */ "./src/modules/authData.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config */ "./src/config/index.ts");


/*
Voice plugin Javascript SDK Library
IMPORTANT NOTE: Copying this library and hosting it locally is strongly discouraged.
 */
// creating the sdk variable
if (typeof UDAPluginSDK === 'undefined') {
	var UDABadBrowser=false;
	if(navigator.appName.indexOf("Internet Explorer") !== -1){
		UDABadBrowser=(navigator.appVersion.indexOf("MSIE 1") === -1);
	}
	var UDASpeechRecognitionAvailable=false;
	let UDAVoiceRecognition;
	
	const UDA_POST_INTERVAL = _config__WEBPACK_IMPORTED_MODULE_1__.CONFIG.UDA_POST_INTERVAL;
	let UDALastMutationTime = _config__WEBPACK_IMPORTED_MODULE_1__.CONFIG.UDALastMutationTime;
	// initializing voice recognition library
	if(!window.hasOwnProperty("webkitSpeechRecognition")){
		UDASpeechRecognitionAvailable=false;
	} else {
		UDASpeechRecognitionAvailable=true;
		UDAVoiceRecognition = window.webkitSpeechRecognition;
	}

	// listening for user session data from extension call
	document.addEventListener("UDAUserSessionData", function(data) {
		UDAPluginSDK.createsession(JSON.parse(data.detail.data));
	});

	// Clearing user session in case if the id gets changed
	document.addEventListener("UDAClearSessionData", function(data){
		UDAPluginSDK.clearSession();
	});

	/**
	 * Disabling record button when the attribute is set to true.
	 */
	document.addEventListener("UDADisableButton", function(data) {
		UDAPluginSDK.disableRecordButton();
	});

	document.addEventListener("UDAAuthenticatedUserSessionData", function(data) {
		UDAPluginSDK.createsession(JSON.parse(data.detail.data));
		UDAPluginSDK.openmodal(true);
	});

	document.addEventListener("UDAAlertMessageData", function(data) {
		alert(JSON.parse(data.detail.data));
	});

	/**
	 * Load custom theme to plugin
	 */
	document.addEventListener("UDALoadCustomCSS", function(data) {
		UDAPluginSDK.loadCssScript(UDACustomCss.src);
	});

	const UDADebug = {};
	let UDADebugSetEvent = new CustomEvent("UDADebugSetEvent", {detail: {data: {action:'Debugvalueset',value:UDADebug}}, bubbles: false, cancelable: false});
	document.dispatchEvent(UDADebugSetEvent);

	// initializing the sdk variable need to change to a new variable in future.
	const UDA_API_URL = _config__WEBPACK_IMPORTED_MODULE_1__.CONFIG.UDA_API_URL, UDALogLevel = _config__WEBPACK_IMPORTED_MODULE_1__.CONFIG.UDALogLevel, isUDAAllowed = 1, UDAClickObjects = [];
	let UDALastIndexTime = 0;
	let UDASessionID = null;

	var UDAPluginSDK={
		sdkUrl: "/",
		apihost: UDA_API_URL,
		totalScripts: 0,
		scriptsCompleted:0,
		totalotherScripts:0,
		totalotherScriptsCompleted:0,
		functionsToRunWhenReady: [],
		jqueryready: false,
		request:{},
		userdata:{},
		ignoreelements : ["script","h1","h2","h3","link","noscript","style"],
		availablenavtabs : [],
		htmlindex : [],
		textfromspeech : "",
		nodeid : 0,
		speechrecognitionavailable: false,
		SpeechRecognition : [],
        recognition : {},
		targetNode : [],
		updatesOccur : true,
		updatecounter : 0,
		lastupdatecounter : 0,
		menuitems: [],
		extensionpath:document?.currentScript?.src?.toString()?.replace("js/Voicepluginsdk.js",""),
		indexnewnodes:false,
		previousurl:"",
		currenturl:"",
		sessionID:"",
		sessiondata:{sessionkey:"",authenticated:false,authenticationsource:"",authdata:{}, csp: {cspenabled: false, udanallowed: true, domain: ''}},
		cookiename:"nist-voice-usersessionid",
		recordingcookiename:"nistsequence",
		recordedsequenceids:[],
		recordclicknodecookiename:"nistclickrecord",
		cookieexpires:365,
		addedtoslidingdiv:false,
		elastic:{apiurl:"http://localhost:9200",indexname:"nistapp",currentpage:0,querystring:""},
		navigationcookiename:"nistnavshow",
		autoplay:false,
		processcount:0,
		totalcount:0,
		rerenderhtml:true,
		processingnodes:false,
		processedclickobjectscount:0,
		recording:false,
		addcustomcssdomains:["app.vantagecircle.co.in","app.vantagecircle.com","dashboard.vantagecircle.com","dashboard.vantagecircle.co.in"],
		containersections:[],
		lastclickednode:'',
		lastclickedtime:'',
		maxstringlength:40,
		confirmednode:false,
		ignoreattributes: [
			'translate','draggable','spellcheck','tabindex','clientHeight','clientLeft','clientTop','clientWidth',
			'offsetHeight','offsetLeft','offsetTop','offsetWidth','scrollHeight','scrollLeft','scrollTop','scrollWidth',
			'baseURI','isConnected','ariaPressed', 'aria-pressed', 'nodePosition', 'outerHTML', 'innerHTML', 'style',
			'aria-controls', 'aria-activedescendant', 'ariaExpanded', 'autocomplete', 'aria-expanded', 'aria-owns', 'formAction',
			'ng-star-inserted', 'ng-star', 'aria-describedby', 'width', 'height', 'x', 'y', 'selectionStart', 'selectionEnd', 'required', 'validationMessage', 'selectionDirection',
			'naturalWidth', 'naturalHeight', 'complete', '_indexOf', 'value', 'defaultValue', 'min', 'max', 'nodeInfo'
		],
		innerTextWeight: 5,
		logLevel: UDALogLevel,
		playNextAction: true,
		forceReindex: false,
		searchText: null,
		searchInProgress: false,
		ignoreNodesFromIndexing: ['ng-dropdown-panel','ckeditor','fusioncharts','ngb-datepicker','ngx-daterangepicker-material','uda-panel','mat-datepicker-content','ng-select'],
		ignoreNodesContainingClassNames:['cke_dialog_container','cke_notifications_area','gldp-default','ajs-layer','aui-list','herknl'],
		cancelRecordingDuringRecordingNodes: [],
		addClickToSpecialNodes: ['ng-select', 'ngb-datepicker'],
		ignoreClicksOnSpecialNodes: ['ngx-daterangepicker-material'],
		customNameForSpecialNodes: {'ngb-datepicker': 'Date selector','mat-datepicker-content': 'Date selector', 'ngx-daterangepicker-material': 'Date Range Selector'},
		specialInputClickClassNames: ['ghx-dropdown-trigger','aui-list'],
		tooltipDisplayedNodes: [],
		// replay variables
		autoplayCompleted: false,
		autoplayPaused: false,
		// manual click variables
		invokedActionManually: false,
		// personal node ignore attributes
		personalNodeIgnoreAttributes: [
			'innerText', 'innerHTML', 'outerText', 'outerHTML', 'nodeValue', 'src', 'naturalWidth', 'naturalHeight', 'currentSrc'
		],
		clickeOn: '',
		invokingnode: null,
		currentPage:'search',
		navigatedToNextPage: {check: false, url: ''},
		popperInstance: null,
		//Azure content moderator attributes
		profanity: {
			enabled: true,
			provider: 'azure',
			config: {
				key1: '',
				key2: '',
				endPoint: 'https://nistapp-content-moderator.cognitiveservices.azure.com/contentmoderator/moderate/v1.0/ProcessText/Screen',
				region: 'eastus'
			}
		},
        multilingual: {
			enabled: true,
		    searchInLang: 'en-US',
            selectedLang: 'en-US',
            displayText: '',
            translatedText: '',
            translate: {
		        provider: 'google',
                apikey: '',
                translateTo: 'en',
                apiurl: 'https://translation.googleapis.com/language/translate/v2'
		    }
        },
		set enableMultilingual(val){
			this.multilingual.enabled = val;
			this.showhtml();
		},
		get enableMultilingual() {
			return UDAPluginSDK.multilingual.enabled;
		},
		// BCP list of languages
		bcplang :
			[
				['Afrikaans',       ['af-ZA']],
				['አማርኛ',           ['am-ET']],
				['Azərbaycanca',    ['az-AZ']],
				['বাংলা',            ['bn-BD', 'বাংলাদেশ'], ['bn-IN', 'ভারত']],
				['Bahasa Indonesia',['id-ID']],
				['Bahasa Melayu',   ['ms-MY']],
				['Català',          ['ca-ES']],
				['Čeština',         ['cs-CZ']],
				['Dansk',           ['da-DK']],
				['Deutsch',         ['de-DE']],
				['English',         ['en-AU', 'Australia'], ['en-CA', 'Canada'], ['en-IN', 'India'], ['en-KE', 'Kenya'], ['en-TZ', 'Tanzania'], ['en-GH', 'Ghana'], ['en-NZ', 'New Zealand'], ['en-NG', 'Nigeria'], ['en-ZA', 'South Africa'], ['en-PH', 'Philippines'], ['en-GB', 'United Kingdom'], ['en-US', 'United States']],
				['Español',         ['es-AR', 'Argentina'], ['es-BO', 'Bolivia'], ['es-CL', 'Chile'], ['es-CO', 'Colombia'], ['es-CR', 'Costa Rica'], ['es-EC', 'Ecuador'], ['es-SV', 'El Salvador'], ['es-ES', 'España'], ['es-US', 'Estados Unidos'], ['es-GT', 'Guatemala'], ['es-HN', 'Honduras'], ['es-MX', 'México'], ['es-NI', 'Nicaragua'], ['es-PA', 'Panamá'], ['es-PY', 'Paraguay'], ['es-PE', 'Perú'], ['es-PR', 'Puerto Rico'], ['es-DO', 'República Dominicana'], ['es-UY', 'Uruguay'], ['es-VE', 'Venezuela']],
				['Euskara',         ['eu-ES']],
				['Filipino',        ['fil-PH']],
				['Français',        ['fr-FR']],
				['Basa Jawa',       ['jv-ID']],
				['Galego',          ['gl-ES']],
				['ગુજરાતી',           ['gu-IN']],
				['Hrvatski',        ['hr-HR']],
				['IsiZulu',         ['zu-ZA']],
				['Íslenska',        ['is-IS']],
				['Italiano',        ['it-IT', 'Italia'], ['it-CH', 'Svizzera']],
				['ಕನ್ನಡ',             ['kn-IN']],
				['ភាសាខ្មែរ',          ['km-KH']],
				['Latviešu',        ['lv-LV']],
				['Lietuvių',        ['lt-LT']],
				['മലയാളം',          ['ml-IN']],
				['मराठी',             ['mr-IN']],
				['Magyar',          ['hu-HU']],
				['ລາວ',              ['lo-LA']],
				['Nederlands',      ['nl-NL']],
				['नेपाली भाषा',        ['ne-NP']],
				['Norsk bokmål',    ['nb-NO']],
				['Polski',          ['pl-PL']],
				['Português',       ['pt-BR', 'Brasil'], ['pt-PT', 'Portugal']],
				['Română',          ['ro-RO']],
				['සිංහල',          ['si-LK']],
				['Slovenščina',     ['sl-SI']],
				['Basa Sunda',      ['su-ID']],
				['Slovenčina',      ['sk-SK']],
				['Suomi',           ['fi-FI']],
				['Svenska',         ['sv-SE']],
				['Kiswahili',       ['sw-TZ', 'Tanzania'], ['sw-KE', 'Kenya']],
				['ქართული',       ['ka-GE']],
				['Հայերեն',          ['hy-AM']],
				['தமிழ்',            ['ta-IN', 'இந்தியா'], ['ta-SG', 'சிங்கப்பூர்'], ['ta-LK', 'இலங்கை'], ['ta-MY', 'மலேசியா']],
				['తెలుగు',           ['te-IN']],
				['Tiếng Việt',      ['vi-VN']],
				['Türkçe',          ['tr-TR']],
				['اُردُو',            ['ur-PK', 'پاکستان'], ['ur-IN', 'بھارت']],
				['Ελληνικά',         ['el-GR']],
				['български',         ['bg-BG']],
				['Pусский',          ['ru-RU']],
				['Српски',           ['sr-RS']],
				['Українська',        ['uk-UA']],
				['한국어',            ['ko-KR']],
				['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'], ['cmn-Hans-HK', '普通话 (香港)'], ['cmn-Hant-TW', '中文 (台灣)'], ['yue-Hant-HK', '粵語 (香港)']],
				['日本語',           ['ja-JP']],
				['हिन्दी',             ['hi-IN']],
				['ภาษาไทย',         ['th-TH']]
			],
		// Flag to enable node type detection
		enableNodeTypeChangeSelection: false,
		set enableNodeTypeSelection(val){
			this.enableNodeTypeChangeSelection = val;
			this.showhtml();
		},
		get enableNodeTypeSelection() {
			return UDAPluginSDK.multilingual.enabled;
		},
		cspUserAcceptance: {storageName: 'uda-csp-user-consent',data:{proceed: true}},
		screenAcceptance: { storageName: 'uda-user-screen-consent', data: { proceed: true } },
				// constructor for the sdk class which will be initialized on loading of the variable.
		init: function() {

			if(!this.checkBrowser()){
				////UDAConsoleLogger.info('UDA panel not added');
				return;
			}

			// loading jquery if not available
			if(typeof jQuery === "undefined") {
				// loading jquery from installed extension path
				this.loadScript(this.extensionpath+"js/jquery-3.4.1.min.js");
			} else {
				// load other scripts if jquery available
				this.jqueryready=true;
				this.otherscripts();
			}
		},
		inArray:function(value, object){
			return jQuery.inArray(value, object);
		},
		// check browser and allow only for chrome
		checkBrowser: function(){
			if(isUDAAllowed < 0){
				return false;
			} else {
				return true;
			}
		},

		//adding required script functionality to the head of the page.
		loadScript: function(url) {

			var script = document.createElement("script");
			script.type = "text/javascript";

			if (script.readyState){
				script.onreadystatechange = function(){
					if (script.readyState === "loaded" || script.readyState === "complete"){
						script.onreadystatechange = null;
						UDAPluginSDK.scriptsCompleted++;
						if (typeof jQuery !== 'undefined') {
							this.jqueryready=true;
							UDAPluginSDK.otherscripts();
						}
					}
				};
			} else {
				script.onload = function(){
					UDAPluginSDK.scriptsCompleted++;
					if (typeof jQuery !== 'undefined') {
						this.jqueryready=true;
						if(this.ready !== true){
							UDAPluginSDK.otherscripts();
						}
					}
				};
			}

			script.src = url;
			document.getElementsByTagName("head")[0].appendChild(script);
		},
		loadOtherScript: function(url) {
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = url;
			if (script.readyState){
				script.onreadystatechange = function(){
					if (script.readyState === "loaded" || script.readyState === "complete"){
						script.onreadystatechange = null;
						UDAPluginSDK.totalotherScriptsCompleted++;
						if (UDAPluginSDK.totalotherScriptsCompleted === UDAPluginSDK.totalotherScripts) {
							UDAPluginSDK.allReady();
						}
					}
				};
			} else {
				script.onload = function(){
					UDAPluginSDK.totalotherScriptsCompleted++;
					if (UDAPluginSDK.totalotherScriptsCompleted === UDAPluginSDK.totalotherScripts) {
						UDAPluginSDK.allReady();
					}
				};
			}
			document.body.appendChild(script);
		},
		loadCssScript: function(url) {
			var script = document.createElement("link");
			script.rel="stylesheet";
			script.type = "text/css";
			script.href = url;
			document.getElementsByTagName("head")[0].appendChild(script);
		},
		otherscripts: function(){
			this.totalotherScripts=1;
			this.loadCssScript(this.extensionpath+"css/uda-v1.css");

			this.loadOtherScript(this.extensionpath+"js/domJSON.js");
			// todo make css loading dynamic based on css file availability
			if(this.inArray(window.location.host,this.addcustomcssdomains) !== -1){
				this.loadCssScript(this.extensionpath+"css/"+window.location.host+".css");
			}
			if(window.location.host === 'localhost:4200' && window.location.path && window.location.path.includes('portal')){
				this.loadCssScript(this.extensionpath+"css/dashboard.vantagecircle.com.css");
			}
			if(window.location.host.includes('vantagecircle')){
				if(window.location.path && window.location.path.includes('portal')) {
					this.loadCssScript(this.extensionpath + "css/dashboard.vantagecircle.com.css");
				} else {
					this.loadCssScript(this.extensionpath + "css/app.vantagecircle.com.css");
				}
			}
			this.loadCssScript(this.extensionpath+"css/"+window.location.host+".css");
			/*
			* Popper script injection to the page.
			* Forcing the popper extension to be version 2 even if popper of version 1 exists
			* */
			if(typeof Popper === 'undefined'){
				this.totalotherScripts++;
				this.loadOtherScript(this.extensionpath+"js/popper.min.js");
			} else {
				this.totalotherScripts++;
				this.loadOtherScript(this.extensionpath+"js/popper.min.js");
			}
		},
		allReady: function() {
			// execute the parsing method after everything is ready.
			this.onReady();
		},
		onReady: function () {

			// check user session exists and create if not available
			if(typeof isUDASdk === 'undefined') {
				this.checkuserkeyexists();
			}

			// adding speech recognition functionality based on the library availability
			if(UDASpeechRecognitionAvailable){
				this.recognition = new UDAVoiceRecognition();
				// setting up the language
				this.recognition.lang = this.multilingual.selectedLang;
				this.speechrecognitionavailable = true;

				this.recognition.onstart = function() {
					textfromspeech = "";
				};

				this.recognition.onspeechend = function() {

				};

				this.recognition.onerror = function(event) {
					if(event.error === 'no-speech') {
						alert('No speech was detected. Try again.');
					}
				};

				this.recognition.onresult = function(event) {
					if (event.results.length > 0) {
						var current = event.resultIndex;
						// Get a transcript of what was said.
						var transcript = event.results[current][0].transcript;
						jQuery("#uda-search-input").val(transcript);
						UDAPluginSDK.searchinelastic();
						UDAPluginSDK.recognition.stop();
						jQuery("#uda-voice-icon-stop").hide();
						jQuery("#uda-voice-icon-start").show();
					}
				};
			}

			//check for multilngual key
			if(this.multilingual.translate.apikey !== '') {
				this.multilingual.enabled = true;
			} else {
				this.multilingual.enabled = false;
			}

			//check for profanity key
			if(this.profanity.config.key1 || this.profanity.config.key2) {
				this.profanity.enabled = true;
			} else {
				this.profanity.enabled = false;
			}

			this.ready = true;

			// listen for when to start the indexing of the dom based on the clicknodes availability
			document.addEventListener("Indexnodes", function(data) {
				if(data.detail.data==="indexclicknodes") {
					UDAPluginSDK.indexclicknodes();
				} else if(data.detail.data==="indexnewclicknodes") {
					UDAPluginSDK.indexnewclicknodes();
				}
			});

			// We need to wait till all dom content is loaded. We initially used a standard wait time but shifted to
			//      use https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
			//      This still produces some discrepancy where it hangs up the web page.
			//      This needs to be improved at some point.
			window.addEventListener('load', (event) => {
				// delaying rendering of uda panel by 2seconds in order to wait for the page dom to complete
				setTimeout(function (){
					UDAPluginSDK.modifybodyhtml();
				},2000);
			});
		},
        /**
         * setting selected language to the webkitspeech
         */
        changeLanguage: function() {
            let langCode='en-US'
            langCode = jQuery('#uda-lang-select').val();
            this.multilingual.selectedLang = langCode;
            if(UDASpeechRecognitionAvailable){
              this.recognition.lang = langCode;
            }
        },
		checkuserkeyexists:function(){
			var sessionevent = new CustomEvent("RequestUDASessionData", {detail: {data: "getusersessiondata"}, bubbles: false, cancelable: false});
			document.dispatchEvent(sessionevent);
		},
		createsession:function(data){
        	// UDASessionID=data.sessionkey;
			this.sessiondata=data;
			this.sessionID=data.sessionkey;
			_modules_authData__WEBPACK_IMPORTED_MODULE_0__.UDAUserAuthData.id = data.authdata.id;
			_modules_authData__WEBPACK_IMPORTED_MODULE_0__.UDAUserAuthData.email = data.authdata.email;
			this.recorddocumentclick();
		},
		clearSession: function(){
			this.sessionID = "";
			this.sessiondata = {sessionkey:"",authenticated:false,authenticationsource:"",authdata:{}};
			this.closemodal();
		},
		modifybodyhtml:function(){
			var html='<div id="uda-btn" nist-voice="true"></div><div id="uda-html-container" style="display: none;"><div id="uda-html-content" nist-voice="true"></div></div><div id="uda-alerthtml-container" nist-voice="true"></div>';

			jQuery(document.body).prepend(html);

			if(typeof isUDASdk === 'undefined') {
				jQuery(window).trigger('resize').promise().done(function () {
					UDAPluginSDK.indexclicknodes();
					UDAPluginSDK.addbuttonhtml();
				});
			} else {
				UDAPluginSDK.indexclicknodes();
				UDAPluginSDK.addbuttonhtml();
			}
			setInterval(function () {
				if(UDALastIndexTime!==0 && UDALastIndexTime<UDALastMutationTime) {
					UDAPluginSDK.indexnewclicknodes();
				}
			},UDA_POST_INTERVAL);
		},
		addbuttonhtml:function(){
        	let udaIconDisabled = false;
        	let udaIconDisabledByCsp = false;

			const screenSize = this.getScreenSize();

			if(screenSize.resolution.height < 1080){

				jQuery("#uda-btn").html('');
				let screenAcceptance = this.getstoragedata(this.screenAcceptance.storageName);
				if(screenAcceptance){
					screenAcceptance = JSON.parse(screenAcceptance);
					if(!screenAcceptance.proceed){
						udaIconDisabled='udaIconDisabled';
					}
				} else {
					this.showAlert(this.screenAcceptance, "UDAN is not tested below 1920 x 1080 resolution. Do you want to still use UDAN?", true);
					return;
				}
			}

			if(this.sessiondata.csp.cspenabled && !this.sessiondata.csp.udanallowed){
				jQuery("#uda-btn").html('');
				let cspUserAcceptance = this.getstoragedata(this.cspUserAcceptance.storageName);
				if(cspUserAcceptance){
					cspUserAcceptance = JSON.parse(cspUserAcceptance);
					if(!cspUserAcceptance.proceed){
						udaIconDisabled='udaIconDisabled';
						udaIconDisabledByCsp=true;
					}
				} else {
					this.showCspAlert("This site's security policies may prevent UDAN from running well. Do you want to continue?");
					return;
				}
			}

			jQuery("#uda-btn").unbind("click").html("");
			var buttonhtml	=	'<div class="uda-nistapp-logo '+udaIconDisabled+'">'
								+'	<div class="uda-icon" style="text-align: center;">'
								+'		<img src="'+this.extensionpath+'images/icons/nist-logo.png">'
								+'		<p style="padding:0; margin:0px;color: #303f9f; font-weight: bold; font-size: 11px;">UDAN(Beta)</p>'
								+'		<span>'
								+'			<img src="'+this.extensionpath+'images/icons/backarrow-orange.png">'
								+'		</span>'
								+'	</div>'
								+'</div>';
			var modal =jQuery("#uda-btn");
			modal.append(buttonhtml);
			if(!udaIconDisabled) {
				modal.click(function () {
					UDAPluginSDK.openmodal(true);
				});
				if (this.rerenderhtml) {
					this.showhtml();
				}
			} else {
				if(udaIconDisabledByCsp){
					modal.click(function () {
						UDAPluginSDK.showAlert(UDAPluginSDK.cspUserAcceptance, 'Do you want to enable "Universal Digital Assistant by Nistapp', true, 'Enable', 'Keep suspended');
					});
				}
			}
		},
		rightPanelHtml: function(){
			var html = 	'<uda-panel>'
						+'<div class="uda-page-right-bar">'
						+'<div>'
							+'<div class="uda-ribbon-arrow" id="uda-close-panel"><img src="'+this.extensionpath+'images/icons/right-arrow.png"></div>'
							+'<div class="uda-icon-txt">'
								+'<img src="'+this.extensionpath+'images/icons/nist-logo.png"><span class="uda-help-bg-tooltip">Need Help?</span>'
							+'</div>'
							+'<div class="uda-icon-txt">'
							+'	<span class="" style="color: #303f9f; font-weight: bold;">UDAN(Beta)</span>'
							+'</div>'
							+'<div class="uda-container" style="text-align: center; margin-top: 10px;">'
								+'<div class="uda-search-div">'
									+'<button class="uda-mic-btn" style="border-radius: 5px 0px 0px 5px;" id="uda-voice-icon-start">'
									+'</button>'
									+'<button class="uda-stop-btn-bg" style="border-radius: 5px 0px 0px 5px; display:none;" id="uda-voice-icon-stop">'
									+'</button>'
									+'<input type="text" name="uda-search-input" class="uda-input-cntrl" placeholder="search..." id="uda-search-input" />'
									+'<button class="uda-search-btn" id="uda-search-btn" style="border-radius: 0px 5px 5px 0px;"></button>'
								+'</div>'
                            +((this.multilingual.enabled)?'<select name="uda-lang-select" id="uda-lang-select" onchange="UDAPluginSDK.changeLanguage();"></select>':'')
							+'</div>'
						+'</div>'
						+'<hr style="border:1px solid #969696; width:100%;">'
						+'<div class="uda-container uda-clear uda-cards-scroller" id="uda-content-container">'
						+'</div>'
						+'<div>'
							+'<div class="uda-footer-bar">'
								+'<div class="uda-container">'
									+'<div class="uda-dropdown" id="uda-advanced-btn">'
										+'<button class="uda-advanced-btn">'
										+'<span>Advanced</span>'
										+'</button>'
										+'<div class="uda-advanced-btn-content">'
											+'<a id="uda-advance-section">New Sequence </a>'
											// +'<a><img src="'+this.extensionpath+'images/icons/new-record.png" width="23px" height="23px"><span> New Record</span></a>'
										+'</div>'
									+'</div>'
								+'</div>'
								+'<br>'
								+'<div class="uda-container" style="border-top:1px solid #969696; margin-top: 30px;">'
									+'<div class="uda-footer-left">Copyrights Reserved 2021.</div>'
									+'<div class="uda-footer-right" style="padding-top:5px; text-align:right;">'
										+'<a href="https://udan.nistapp.ai" target="_blank">Know More </a>'
										+'<img src="'+this.extensionpath+'images/icons/nist-logo.png" width="15px" height="15px;">'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>'
					+'</div>'
					+'</uda-panel>';

			return html;
		},
		addvoicesearchmodal:function(addnisticon=true){
			jQuery("#uda-html-content").html(this.rightPanelHtml());
			//rendering language list
			if(this.multilingual.enabled) {
				this.bcplang.forEach(langcode => {
					if (langcode.length > 2) {
						langcode.forEach((sublang, sublangindex) => {
							if (sublangindex !== 0) {
								if (this.multilingual.selectedLang.toLowerCase() === sublang[0].toLowerCase()) {
									jQuery('#uda-lang-select').append('<option value="' + sublang[0] + '" selected>' + langcode[0] + ' - ' + sublang[1] + '</option>');
								} else {
									jQuery('#uda-lang-select').append('<option value="' + sublang[0] + '">' + langcode[0] + ' - ' + sublang[1] + '</option>');
								}
							}
						});
					} else {
						if (this.multilingual.selectedLang.toLowerCase() == langcode[1].toString().toLowerCase()) {
							jQuery('#uda-lang-select').append('<option value="' + langcode[1] + '" selected>' + langcode[0] + '</option>');
						} else {
							jQuery('#uda-lang-select').append('<option value="' + langcode[1] + '">' + langcode[0] + '</option>');
						}
					}
				});
			}
			jQuery("#uda-close-panel").click(function(){
				UDAPluginSDK.closemodal();
			});
			jQuery("#voicesearch").click(function(){
				UDAPluginSDK.searchinelastic();
			});
			jQuery("#uda-search-input").keydown(function (e) {
				if (e.keyCode === 13) {
					jQuery("#uda-content-container").html("");
					UDAPluginSDK.searchinelastic();
					return false;
				}
			});
			jQuery("#uda-search-btn").click(function(){
				UDAPluginSDK.searchinelastic();
			});
			if(UDASpeechRecognitionAvailable){
				jQuery("#uda-voice-icon-start").click(function () {
					jQuery("#uda-content-container").html("");
					UDAPluginSDK.recognition.start();
					jQuery("#uda-voice-icon-start").hide();
					jQuery("#uda-voice-icon-stop").show();
				});
				jQuery("#uda-voice-icon-stop").click(function () {
					UDAPluginSDK.recognition.stop();
					jQuery("#uda-voice-icon-stop").hide();
					jQuery("#uda-voice-icon-start").show();
				});
			} else {
				jQuery("#uda-voice-icon-start").hide();
				jQuery("#uda-voice-icon-stop").hide();
			}
			if(addnisticon) {
				if(!_modules_authData__WEBPACK_IMPORTED_MODULE_0__.UDAUserAuthData.restrict_add_delete) {
					jQuery('#uda-advanced-btn').show();
					jQuery("#uda-advance-section").click(function () {
						UDAPluginSDK.showadvancedhtml();
					});
				}
			} else {
				jQuery('#uda-advanced-btn').hide();
			}
		},
		/**
		 * Adding alert modal html
		 */
		showCspAlert: function(content='',addbtn=false){
			let html='<div id="udaModal" class="udamodal">'
					+'	<div class="udamodal-content">'
					+'		<div class="udamodal-header">'
					+'			<span class="udaclose">&times;</span>'
					+'			<h3>UDA Alert</h3>'
					+'		</div>'
					+'		<div class="udamodal-body">'
					+'			<p>'+content+'</p>'
					+'		</div>'
					+'		<div class="udamodal-footer">'
					+'			<button class="udacontinueBtn " id="udacontinueBtn">Continue with errors</button>'
					+'			<button class="udacloseBtn" id="udacloseBtn">Exit UDAN</button>'
					+'		</div>'
					+'	</div>'
					+'</div>';

			jQuery("#uda-alerthtml-container").html(html);
			// Get the modal
			var modal = document.getElementById("udaModal");

			// Get the <span> element that closes the modal
			var span = document.getElementsByClassName("udaclose")[0];
			var closeBtn = document.getElementById('udacloseBtn');
			var continueBtn = document.getElementById('udacontinueBtn');

			closeBtn.onclick=function(){
				modal.style.display = "none";
				UDAPluginSDK.cspDecline();
			}
			// When the user clicks on <span> (x), close the modal
			span.onclick = function() {
				modal.style.display = "none";
				UDAPluginSDK.cspDecline();
			}

			modal.style.display = "block";

			continueBtn.onclick=function (){
				modal.style.display = "none";
				UDAPluginSDK.cspAcceptance();
			};

		},
		cspDecline: function(){
			let cspuseracceptance = this.getstoragedata(this.cspUserAcceptance.storageName);
			if(cspuseracceptance){
				if(!cspuseracceptance.proceed){
					this.cspUserAcceptance.data.proceed = false;
				}
			} else {
				this.cspUserAcceptance.data.proceed = false;
			}
			this.createstoragedata(this.cspUserAcceptance.storageName, JSON.stringify(this.cspUserAcceptance.data));
			this.addbuttonhtml();
		},
		cspAcceptance: function(){
			let cspuseracceptance = this.getstoragedata(this.cspUserAcceptance.storageName);
			if(cspuseracceptance){
				if(!cspuseracceptance.proceed){
					this.cspUserAcceptance.data.proceed = true;
				}
			} else {
				this.cspUserAcceptance.data.proceed = true;
			}
			this.createstoragedata(this.cspUserAcceptance.storageName, JSON.stringify(this.cspUserAcceptance.data));
			this.addbuttonhtml();
		},
		getAlertHtml: function(content, addContinueBtn=true, continueText='Continue with errors', exitText='Exit UDAN'){
			let footerHtml = '';
			if(addContinueBtn){
				footerHtml 	='			<button class="udacontinueBtn " id="udacontinueBtn">'+continueText+'</button>'
							+'			<button class="udacloseBtn" id="udacloseBtn">'+exitText+'</button>';
			} else {
				footerHtml ='			<button class="udacloseBtn" id="udacloseBtn">'+exitText+'</button>';
			}
			let html='<div id="udaModal" class="udamodal">'
				+'	<div class="udamodal-content">'
				+'		<div class="udamodal-header">'
				+'			<span class="udaclose">&times;</span>'
				+'			<h3>UDA Alert</h3>'
				+'		</div>'
				+'		<div class="udamodal-body">'
				+'			<p>'+content+'</p>'
				+'		</div>'
				+'		<div class="udamodal-footer">'
				+			footerHtml
				+'		</div>'
				+'	</div>'
				+'</div>';
			return html
		},
		showAlert: function(storageName, content='', addContinueBtn=false, continueText='Continue', exitText='Close'){
			let html=this.getAlertHtml(content, addContinueBtn, continueText, exitText);

			jQuery("#uda-alerthtml-container").html(html);

			var modal = document.getElementById("udaModal");
			var span = document.getElementsByClassName("udaclose")[0];
			var closeBtn = document.getElementById('udacloseBtn');
			var continueBtn = document.getElementById('udacontinueBtn');

			closeBtn.onclick=function(){
				modal.style.display = "none";
				if(storageName) {
					UDAPluginSDK.alertDecline(storageName);
				}
			}

			span.onclick = function() {
				modal.style.display = "none";
				if(storageName) {
					UDAPluginSDK.alertDecline(storageName);
				}
			}

			modal.style.display = "block";

			if(addContinueBtn) {
				continueBtn.onclick = function () {
					modal.style.display = "none";
					if (storageName) {
						UDAPluginSDK.alertAcceptance(storageName);
					}
				};
			}
		},
		alertDecline: function(storageName){
			let data = this.getstoragedata(storageName.storageName);
			if(data){
				if(!data.proceed){
					storageName.data.proceed = false;
				}
			} else {
				storageName.data.proceed = false;
			}
			this.createstoragedata(storageName.storageName, JSON.stringify(storageName.data));
			this.addbuttonhtml();
		},
		alertAcceptance: function(storageName){
			let acceptance = this.getstoragedata(storageName.storageName);
			let proceed = false;
			if(acceptance){
				if(!acceptance.proceed){
					storageName.data.proceed = true;
				}
			} else {
				storageName.data.proceed = true;
			}
			this.createstoragedata(storageName.storageName, JSON.stringify(storageName.data));
			this.addbuttonhtml();
		},
		//opening the UDA screen
		openmodal:function(focus=false){
        	if(this.sessiondata.authenticated) {
				jQuery("#uda-btn").hide();
				jQuery('#uda-html-container').show();
				var searchinput=jQuery("#uda-search-input");
				searchinput.val("");
				if (focus) {
					searchinput.focus();
				}
				let bodychildren = document.body.childNodes;
				if (bodychildren.length > 0) {
					bodychildren.forEach(function (childnode, childnodeindex) {
						if (childnode.classList && childnode.classList.contains("container")) {
							UDAPluginSDK.containersections.push(childnodeindex);
							childnode.classList.remove("container");
						}
						if (childnode.nodeType === Node.ELEMENT_NODE && (childnode.id !== 'uda-btn' && childnode.id !== 'uda-html-container') && childnode.nodeName.toLowerCase() !== 'script' && childnode.nodeName.toLowerCase() !== 'noscript' && childnode.nodeName.toLowerCase() !== 'style') {
							if (childnode.classList && !childnode.classList.contains("uda-original-content")) {
								childnode.classList.add("uda-original-content");
							}
						}
					});
				}
			} else {
				var sessionevent = new CustomEvent("RequestUDASessionData", {detail: {data: "authtenicate"}, bubbles: false, cancelable: false});
				document.dispatchEvent(sessionevent);
			}
		},
		//closing the UDA screen
		closemodal:function(){
			jQuery("#uda-advance-section").show();
			jQuery('#uda-html-container').hide();
			this.recordedsequenceids=[];
			jQuery("#uda-btn").show();
			var navcookiedata = {shownav: false, data: {}, autoplay:false, pause:false, stop:false, navcompleted:false, navigateddata:[],searchterm:''};
			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
			// this.cancelrecordingsequence(false);
			let bodychildren = document.body.childNodes;
			if (bodychildren.length > 0) {
				bodychildren.forEach(function (childnode, childnodeindex) {
					if (childnode.nodeType === Node.ELEMENT_NODE && (childnode.id !== 'uda-btn' && childnode.id !== 'uda-html-container') && childnode.nodeName.toLowerCase() !== 'script' && childnode.nodeName.toLowerCase() !== 'noscript' && childnode.nodeName.toLowerCase() !== 'style') {
						if (childnode.classList && childnode.classList.contains("uda-original-content")) {
							childnode.classList.remove("uda-original-content");
						}
					}
					if (UDAPluginSDK.containersections.length > 0 && UDAPluginSDK.inArray(childnodeindex, UDAPluginSDK.containersections) !== -1) {
						childnode.classList.add("container");
					}
				});
			}
		},
		//render the required html for showing up the proper html
		showhtml:function(){
			this.rerenderhtml=false;
			var addnisticon=true;
			var checkrecording = this.getstoragedata(this.recordingcookiename);
			if(checkrecording){
				var checkrecordingdata=JSON.parse(checkrecording);
				if(checkrecordingdata.hasOwnProperty("recording") && checkrecordingdata.recording){
					addnisticon=false;
					this.recording=true;
					this.openmodal(false);
				} else {
					this.recording = false;
				}
			}
			if(addnisticon){
				this.addvoicesearchmodal(addnisticon);
				var navigationcookie=this.getstoragedata(this.navigationcookiename);
				if(navigationcookie){
					var navigationcookiedata = JSON.parse(navigationcookie);
					if(navigationcookiedata.shownav) {
						this.openmodal();
						if(navigationcookiedata.autoplay){
							this.autoplay=true;
							if(!this.playNextAction) {
								return;
							}
						}
						this.showselectedrow(navigationcookiedata.data,navigationcookiedata.data.id,true, navigationcookiedata);
					} else {
						this.searchinelastic('');
					}
				} else {
					////UDAConsoleLogger.info('here at showhtml function');
					this.searchinelastic('');
				}
			} else {
				this.addvoicesearchmodal(addnisticon);
				this.showrecordedresults();
			}
			this.disableRecordButton();
		},
		// indexing all nodes after all the clicknodes are available
		indexclicknodes: function(){
			this.processcount=UDAClickObjects.length;
			this.previousurl=this.currenturl=window.location.href;
			this.processingnodes=true;
			// indexing nodes has been called for adding click detection
			this.indexdom(document.body);
			this.processedclickobjectscount=this.processcount;
			this.totalcount=UDAClickObjects.length;
			this.processingnodes=false;
			if(this.processcount<this.totalcount){
				//	todo refine the processing nodes.
				this.indexnewclicknodes();
				return;
			}
			UDALastIndexTime=Date.now();
		},
		// indexing new clicknodes after new html got loaded
		indexnewclicknodes: async function(){
			if(this.processingnodes){
				return;
			}
			this.processcount=UDAClickObjects.length;
			if(UDALastIndexTime!==0 && UDALastIndexTime>UDALastMutationTime){
				return;
			}
			UDALastIndexTime=Date.now();
			this.processingnodes=true;
			if(await this.removefromhtmlindex()) {
				this.indexnewnodes = true;
				this.currenturl = window.location.href;
				this.indexdom(document.body);
				this.processedclickobjectscount = this.processcount;
				this.processingnodes = false;
				this.totalcount = UDAClickObjects.length;
			}
			if(this.processcount<this.totalcount){
				//todo new nodes added need to reprocess
				////UDAConsoleLogger.info('Need to do the processing');
			}
			if(this.navigatedToNextPage.check && this.navigatedToNextPage.url === window.location.href){
				setTimeout(function(){UDAPluginSDK.showhtml();}, 5000);
				this.navigatedToNextPage.check = false;
			}
		},
		removefromhtmlindex:async function(){
			if (this.forceReindex) {
				this.htmlindex = [];
				this.forceReindex = false;
				return Promise.resolve(1);
			}
			if(this.htmlindex.length>0){
				let newhtmlindex=[];
				let htmlindexlength=this.htmlindex.length;
				for(var htmli=0;htmli<htmlindexlength;htmli++) {
					let checknode=this.htmlindex[htmli];
					let removedclickobjectslength=UDARemovedClickObjects.length;
					let foundremovedindexednode=-1;
					for (var k = 0; k < removedclickobjectslength; k++) {
						if(UDARemovedClickObjects[k].element === window){
							continue;
						}
						let removedclickobject=UDARemovedClickObjects[k].element;

						if (checknode['element-data'].isSameNode(removedclickobject)) {
							foundremovedindexednode=k;
							break;
						}
					}
					if(foundremovedindexednode===-1){
						newhtmlindex.push(checknode);
					} else {
						UDARemovedClickObjects.splice(foundremovedindexednode,1);
					}
				}
				this.htmlindex=newhtmlindex;
				return Promise.resolve(1);
			}
		},
		// indexing functionality for the entire dom
		indexdom: function( node, ret=false, parentnode="", textlabel="", hasparentnodeclick=false, parentclicknode= null ) {
			switch (node.nodeType) {
				case Node.ELEMENT_NODE:

					if(!ret && parentnode!=="") {
						try{
							node = this.indexnode(node, parentnode, hasparentnodeclick, false, parentclicknode);
						} catch (e) {
							UDAErrorLogger.error('Unable to index node '+node.nodeName+' got exception '+e);
							return node;
						}

					}

					node.haschildclick=false;

					// Checking for ignore nodes during indexing
					if (this.inArray(node.nodeName.toLowerCase(), this.ignoreNodesFromIndexing) !== -1) {
						if(node.nodeName.toLowerCase() === 'ckeditor' && node.childNodes.length>2 && this.recording){
							let addToolTip = true;
							for(let checknode of this.tooltipDisplayedNodes){
								if(node.isSameNode(checknode)) {
									addToolTip = false;
								}
							}
							if(addToolTip) {
								this.tooltipDisplayedNodes.push(node);
								this.addToolTip(node, node, false, false, false, false, 'We have detected a rich text editor. To record this in your sequence, Please click on the editor menu. We are unable to record clicks on the text area.', false, false);
							}
						} else if(!node.hasclick && this.inArray(node.nodeName.toLowerCase(), this.addClickToSpecialNodes) !== -1 && this.inArray(node.nodeName.toLowerCase(), this.ignoreClicksOnSpecialNodes) === -1){
							////UDAConsoleLogger.info('Child nodes ignored for node and added click to: ' + node.nodeName);
							this.addClickToNode(node);
						} else if(this.cancelRecordingDuringRecordingNodes.indexOf(node.nodeName.toLowerCase()) !== -1) {
							// this.addClickToNode(node);
						} else {
							////UDAConsoleLogger.info('Child nodes ignored for node: ' + node.nodeName);
						}
					} else if(node.classList && ((node.classList.contains('select2-container--open') && !node.classList.contains('select2-container--focus')))){
					//	do nothing as we are not going to deal with special classes
						////UDAConsoleLogger.info('unwanted indexing prevention');
					} else if(node.nodeName.toLowerCase() === "div" && (node.hasAttribute("uib-datepicker-popup-wrap") || (node.id && node.id==='recognize_modal'))){
						// fix for not indexing datepicker popup and nominate popup
						//UDAConsoleLogger.info('date picker in javascript');
					} else if(node.nodeName.toLowerCase() === "span" && (node.classList.contains("radio") && node.classList.contains("replacement"))){
						this.addClickToNode(node);
					} else if(this.checkCssClassNames(node)){
						//UDAConsoleLogger.info({cssIgnoredNode:node}, 3);
						// this.addClickToNode(node);
					} else if(node.hasChildNodes()){
						var childnodes =  node.childNodes;
						var hasparentclick = false;
						if(node.hasOwnProperty("hasclick") || hasparentnodeclick){
							hasparentclick=true;
							if(parentclicknode===""){
								parentclicknode=node;
							}
						}

						if(childnodes.length>0){
							for (var i=0;i<childnodes.length;i++){
								var childnode=childnodes[i];
								this.nodeid++;
								if(this.ignoreelements.indexOf(childnode.nodeName.toLowerCase())===-1) {
									if(ret){
										if(textlabel===""){
											textlabel = this.indexdom(childnode, ret, node, textlabel);
										}else {
											textlabel += " " + this.indexdom(childnode, ret, node, textlabel);
										}
									} else {
										try {
											node.childNodes[i] = this.indexdom(childnode, ret, node, "", hasparentclick, parentclicknode);
										}catch(e){}
										if(node.childNodes[i].hasOwnProperty("hasclick") && node.childNodes[i].hasclick){
											node.haschildclick=true;
										}
										if(hasparentclick && node.childNodes[i].hasOwnProperty("haschildclick") && node.childNodes[i].haschildclick){
											node.haschildclick=true;
										}
									}
								}
							}
						}
					}

					// add click to node to send what user has clicked.
					// known scenario that node has parent click
					if(node.hasOwnProperty("hasclick") && node.hasclick && (node.nodeName.toLowerCase()==="select" || !node.haschildclick)){
						node=this.addClickToNode(node);
					} else if(node.hasOwnProperty("hasclick") && node.hasclick && node.haschildclick){
						node=this.addClickToNode(node,true);
					}

					break;
				case Node.TEXT_NODE:
					if(node.nodeValue!=="") {
						textlabel = node.nodeValue;
					}
					break;
			}

			if(ret && textlabel!==""){
				return textlabel;
			} else if(!ret) {
				return node;
			}
		},
		//check css classnames for ignoring
		checkCssClassNames:function(node){
			let cssClassExist=false;
			if(this.ignoreNodesContainingClassNames.length>0){
				for(const classname of this.ignoreNodesContainingClassNames) {
					if(node.classList.contains(classname)){
						cssClassExist=true;
					}
				}
			}
			return cssClassExist;
		},
		// Check for each node and then match it with the available clicknodes which are identified by links.js
		indexnode: function(node, parentnode, hasparentnodeclick=false, fromdocumentclick=false, parentclicknode=""){
			var elementdata = {"element-type": "", "element-labels" : [], "element-action" : "", "element-path" : "","element-url":"", "element-data":[],"menu-items":[]};

			var clickobjectexists=false;
			var udaClickObject={};

			if(node.hasAttribute("nist-voice") && node.getAttribute("nist-voice")){
				return node;
			}

			if(node.hasAttribute("uda-added") && node.getAttribute("uda-added")){
				return node;
			}

			if(node.nodeName.toLowerCase() === 'mat-checkbox'){
				return node;
			}

			if(this.inArray(node.nodeName.toLowerCase(), this.ignoreClicksOnSpecialNodes) !== -1){
				return node;
			}

			if(parentnode.classList && parentnode.classList.contains("tab-content")){
				node.displaytype = "tab-content";
				node.tabid = node.id;
			}

			// Multiple clicks are recorded for select2-selection class. select2-selection--multiple
			// This will create a problem during playback. We should record only one click to avoid this problem
			if(node.classList && (node.classList.contains("select2-search__field") || node.classList.contains('cdk-overlay-backdrop') || node.classList.contains('cdk-overlay-pane'))) {
				//UDAConsoleLogger.info(node.classList);
				return node;
			}

			if(node.hasAttribute('disabled')){
				return node;
			}

			if(node.hasAttribute('readOnly')){
				// return node;
			}

			if(this.htmlindex.length>0){
				for(var htmli=0;htmli<this.htmlindex.length;htmli++){
					if(node.isSameNode(this.htmlindex[htmli]['element-data'])){
						node.hasclick=true;
						return node;
					}
				}
			}

			for (var i = 0; i < UDAClickObjects.length; i++) {
				if(UDAClickObjects[i].element===window){
					continue;
				}
				if (node.isSameNode(UDAClickObjects[i].element)) {
					clickobjectexists = true;
					udaClickObject = UDAClickObjects[i];
				}
			}

			if(this.inArray(node.nodeName.toLowerCase(), this.ignoreNodesFromIndexing) !== -1) {
				//UDAConsoleLogger.info({indexingnode: node});
			}

			if(node.hasAttribute("type") && node.getAttribute("type") === "hidden"){
				return node;
			}

			if(fromdocumentclick){
				clickobjectexists = true;
				udaClickObject = node;
			}

			if(clickobjectexists){
				node.hasclick=true;
				elementdata["element-type"] = node.nodeName.toLowerCase();
				elementdata["element-url"] =  window.location.href;

				if(parentnode.classList && parentnode.classList.contains("tab-content")){
					node.displaytype = "tab-content";
				}

				if(elementdata["element-labels"].length===0){
					elementdata["element-labels"] = this.getInputLabels(node,[],1);
				}

				if(elementdata["element-labels"].length===0){
					return node;
				}

				if((node.hasOwnProperty("displaytype") && node.displaytype==="tab-content") || (node.hasOwnProperty("navtype") && node.navtype==="navtab")){
					for(var j=0;j<this.menuitems.length;j++){
						var menuitem=this.menuitems[j];
						if(menuitem.refid === node.tabid) {
							if(menuitem.menunode.hasOwnProperty("path")){
								node.path =  menuitem.menunode.path+">"+menuitem.name;
							}else {
								node.path = menuitem.name;
							}
							if(node.hasOwnProperty("menuitems")){
								node.menuitems.push(menuitem);
							} else {
								node.menuitems=[];
								node.menuitems.push(menuitem);
							}
						}
					}
				}

				if(elementdata["element-path"]==="") {
					if (node.hasOwnProperty("path")) {
						elementdata["element-path"] = node.path;
					}
				}

				if(node.getAttribute("data-toggle") && node.getAttribute("data-toggle")==="tab"){
					node.navtype="navtab";
					elementdata["element-action"] = "navtab";
				}

				let uda_custom = {hasparentclick: false, parentnode: {}, domJson: domJSON.toJSON(node)};
				if(hasparentnodeclick) {
					uda_custom.hasparentclick = true;
					uda_custom.parentnode = parentnode;
				}
				node.uda_custom = uda_custom;

				elementdata["element-data"] = node;
				elementdata["clickobject"] = udaClickObject;

				this.htmlindex.push(elementdata);
			}

			return node;
		},
		// getting the text for the clicknodes.
		getInputLabels: function(node, inputlabels, iterationno, iterate=true, getchildlabels=true, fromclick=false, iteratelimit=3, ignorenode=[]){

			if(Array.isArray(ignorenode)){
				ignorenode=node;
			}

			if((node.nodeName.toLowerCase() === "select" || node.nodeName.toLowerCase() === "checkbox") && iterate && inputlabels.length===0){
				iterationno++;
				inputlabels = this.getInputLabels(node.parentNode, inputlabels, iterationno, iterate, true, fromclick, iteratelimit, ignorenode);
				if(fromclick) {
					//todo need to rework
				}
			}

			if(node.nodeName.toLowerCase() === "input" || node.nodeName.toLowerCase() === "textarea" || node.nodeName.toLowerCase() === "img"){

				if(node.getAttribute("placeholder") && node.getAttribute("placeholder")!=="") {
					inputlabels.push({"text":node.getAttribute("placeholder").toString(),"match":false});
				}
				if(node.getAttribute("type") && (node.getAttribute("type").toLowerCase()==="submit" || node.getAttribute("type").toLowerCase()==="file")) {
					if(node.getAttribute("value")){
						inputlabels.push({"text":node.getAttribute("value").toString(),"match":false});
						iterate=false;
					}
				}
				if(node.getAttribute("alt")){
					inputlabels.push({"text":node.getAttribute("alt").toString(),"match":false});
				}
			}

			if(getchildlabels && node.childNodes.length>0){
				var childnodes = node.childNodes;
				childnodes.forEach(function (childnode, key) {
					if(childnode.nodeName.toLowerCase() !=="script" && childnode.nodeName.toLowerCase() !== "select" && childnode.nodeName.toLowerCase() !== '#comment') {
						var textcontent = childnode.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
						if (textcontent !== "" && ignorenode.isSameNode(childnode) === false) {
							inputlabels.push({"text": textcontent, "match": false});
						}
					}
				});
			}

			if(inputlabels.length===0 && node.getAttribute("data-tooltip")){
				inputlabels.push({"text":node.getAttribute("data-tooltip").toString(),"match":false});
			}

			if(inputlabels.length===0 && node.getAttribute("aria-label")){
				inputlabels.push({"text":node.getAttribute("aria-label").toString(),"match":false});
			}

			//todo fix for image tags
			if(iterate && node.nodeName.toLowerCase() !== "img" && inputlabels.length === 0 && iterationno<=iteratelimit){
				iterationno++;
				inputlabels = this.getInputLabels(node.parentNode,[], iterationno, iterate, getchildlabels, fromclick, iteratelimit);
			}

			if(inputlabels.length===0 && node.id!==""){
				inputlabels.push({"text":(node.nodeName.toLowerCase()+"-"+node.id),"match":false});
			}else if(inputlabels.length===0 && node.hasAttribute("class") && node.className && node.className!==""){
				var classname=node.className.toString();
				inputlabels.push({"text":(node.nodeName.toLowerCase()+"-"+classname.replace(" ","-")),"match":false});
			} else if(inputlabels.length===0){
				inputlabels.push({"text":(node.nodeName.toLowerCase()),"match":false});
			}

			return inputlabels;
		},
		getsingleinputlabel: function(parentnode, inputlabel){
			var childnodes = parentnode.childNodes;

			childnodes.forEach(function (childnode, key) {
				if(inputlabel === ""){
					inputlabel = childnode.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
				}
			});

			if(inputlabel === ""){
				inputlabel = this.getinputlabel(parentnode.parentNode,"");
			}

			return inputlabel;
		},
		addClickToNode:function(node, confirmdialog=false){
        	try{
				if(node.hasOwnProperty("addedclickrecord") && node.addedclickrecord===true){
					return;
				}

				var nodename=node.nodeName.toLowerCase();
				switch (nodename) {
					case "select":
						jQuery(node).on({"focus":function(event){
								UDAPluginSDK.recorduserclick(node, false,false, event, confirmdialog);
							}
						});
						break;
					case "input":
						if(!node.hasAttribute("type")){
							jQuery(node).click(function (event) {
								UDAPluginSDK.recorduserclick(node, false, false, event, confirmdialog);
							});
							return;
						}
						var inputtype=node.getAttribute("type").toLowerCase();
						switch (inputtype) {
							case "email":
							case "text":
							case "button":
							case "checkbox":
							case "color":
							case "date":
							case "datetime-local":
							case "file":
							case "hidden":
							case "image":
							case "month":
							case "number":
							case "password":
							case "radio":
							case "range":
							case "reset":
							case "search":
							case "submit":
							case "tel":
							case "text":
							case "time":
							case "url":
							case "week":
								jQuery(node).click(function (event) {
									UDAPluginSDK.recorduserclick(node, false, false, event, confirmdialog);
								});
								break;
							default:
								jQuery(node).click(function (event) {
									UDAPluginSDK.recorduserclick(node, false, false, event, confirmdialog);
								});
								break;
						}
						break;
					case "mat-select":
						jQuery(node).click(function (event) {
							UDAPluginSDK.recorduserclick(node, false, false, event, confirmdialog);
						});
						break;
					case 'tr':
						jQuery(node).click(function (event) {
							UDAPluginSDK.recorduserclick(node, false, false, event, confirmdialog);
						});
						break;
					default:
						jQuery(node).click(function (event) {
							UDAPluginSDK.recorduserclick(node, false, false, event, confirmdialog);
						});
						break;
				}
				node.addedclickrecord=true;
				return node;
			} catch (e) {
				UDAErrorLogger.error('Unable to add click to node '+ node.outerHTML+' '+ e);
			}

		},
		//matching the action of the node and invoking whether to click or focus
		matchaction:function(data,close=true,selectednode){
			if(close) {
				this.closemodal();
			}
			var node=data["element-data"];
			var timetoinvoke=1000;

			if(!this.playNextAction) {
				return;
			}

			//UDAConsoleLogger.info({invokingnode: node});

			// remove added tooltips before invoking
			// let tooltipnodes = jQuery('.uda-tooltip');
			let tooltipnodes = document.getElementsByClassName('uda-tooltip');
			if (tooltipnodes.length > 0) {
				jQuery('.uda-tooltip').each(function() {
					jQuery(this).find('.uda-tooltip-text-content').remove();
					jQuery(this).removeClass('uda-tooltip');
				});
			}

			jQuery('.uda-tooltip-text-content').each(function() {
				jQuery(this).remove();
			});

			this.simulateHover(node);

			var navigationcookie=this.getstoragedata(this.navigationcookiename);
			var navigationcookiedata = null;
			if(navigationcookie) {
				navigationcookiedata = JSON.parse(navigationcookie);
			}

			// perform click action based on the input given

			const recordedNodeData = JSON.parse(selectednode.objectdata);
			if(recordedNodeData.meta && recordedNodeData.meta.selectedElement && recordedNodeData.meta.selectedElement.systemTag.trim() != 'others'){
				let performedAction = this.mapSelectedElementAction(node, selectednode, navigationcookiedata, recordedNodeData);
				if(performedAction){
					return;
				}
			}

			if(this.inArray(node.nodeName.toLowerCase(), this.ignoreNodesFromIndexing) !== -1) {
				this.addToolTip(node, node.parentNode, selectednode, navigationcookiedata, false, false, false);
				return;
			}

			switch (node.nodeName.toLowerCase()) {
				case "input":
					// functionality for detecting multi select box and highlighting the recorded node
					if (node.classList && (node.classList.contains('select2-search__field') || node.classList.contains('mat-autocomplete-trigger'))){
						this.addToolTip(node, node.parentNode.parentNode.parentNode.parentNode.parentNode, selectednode, navigationcookiedata, false, true);
					} else if(node.hasAttribute('role') && (node.getAttribute('role')==='combobox')) {
						this.addToolTip(node, node.parentNode.parentNode.parentNode.parentNode, selectednode, navigationcookiedata, false, false, true);
					} else if(node.hasAttribute('type') && (node.getAttribute('type')==='checkbox' || node.getAttribute('type')==='radio') && node.classList && (node.classList.contains('mat-checkbox-input') || node.classList.contains('mat-radio-input'))) {
						this.addToolTip(node, node.parentNode.parentNode, selectednode, navigationcookiedata, false, false, true);
					} else if(node.hasAttribute('type')){
						switch (node.getAttribute('type').toLowerCase()) {
							case 'checkbox':
								if(node.parentNode && node.parentNode.classList && node.parentNode.classList.contains('vc_checkbox')) {
									this.addToolTip(node, node.parentNode, selectednode, navigationcookiedata, false, false, true);
								} else {
									this.addToolTip(node, node.parentNode.parentNode, selectednode, navigationcookiedata, false, false, true);
								}
								break;
							case 'radio':
								if(node.parentNode && node.parentNode.classList && node.parentNode.classList.contains('vc_label')) {
									this.addToolTip(node, node.parentNode, selectednode, navigationcookiedata, false, false, true);
								} else {
									this.addToolTip(node, node.parentNode.parentNode, selectednode, navigationcookiedata, false, false, true);
								}
								break;
							case 'submit':
								node.click();
								this.invokenextitem(node, timetoinvoke, navigationcookiedata);
								this.showselectedrow(navigationcookiedata.data,navigationcookiedata.data.id,true, navigationcookiedata);
                            	break;
							case 'text':
								if(node.attributes && node.attributes.length>0 && (node.hasAttribute('ngxdaterangepickermd'))) {
									this.addToolTip(node, node.parentNode, selectednode, navigationcookiedata, false, false, false);
								} else if(node.attributes && node.attributes.length>0 && (node.hasAttribute('uib-datepicker-popup'))) {
									this.addToolTip(node, node.parentNode.parentNode, selectednode, navigationcookiedata, true, false);
								} else {
									this.addToolTip(node, node.parentNode, selectednode, navigationcookiedata, false, true, true);
								}
								break;
							default:
								this.addToolTip(node, node.parentNode, selectednode, navigationcookiedata, false, false, true);
								break;
						}
					} else {
						this.addToolTip(node, node.parentNode, selectednode, navigationcookiedata, false, false, true);
					}
					break;
				case "textarea":
					this.playNextAction = false;
					this.addToolTip(node, node.parentNode, selectednode, navigationcookiedata, false, false, true);
					break;
				case "select":
					// this.addToolTip(node, node.parentNode, navigationcookiedata, false, false, true);
					this.addToolTip(node, node, selectednode, navigationcookiedata, false, false, true);
					break;
				case "option":
					this.addToolTip(node, node.parentNode, selectednode, navigationcookiedata, false, false, true);
					break;
				case "checkbox":
					this.addToolTip(node, node, selectednode, navigationcookiedata, false, false, true);
					break;
				// Additional processing for calendar selection
				case "button":
					if(node.hasAttribute('aria-label') && node.getAttribute('aria-label').toLowerCase() === 'open calendar') {
						this.addToolTip(node, node.parentNode, selectednode, navigationcookiedata, true, false);
					} else if(node.classList && node.classList.contains('btn-pill')) {
						node.click();
						this.invokenextitem(node, timetoinvoke, navigationcookiedata);
					} else {
						node.click();
						this.invokenextitem(node, timetoinvoke, navigationcookiedata);
					}
					break;
				case 'span':
					if (node.classList && node.classList.contains('select2-selection')) {
						this.addToolTip(node, node.parentNode.parentNode, selectednode, navigationcookiedata, true, false);
					} else if(node.classList.contains("radio") && node.classList.contains("replacement")){
						this.addToolTip(node, node.parentNode.parentNode, selectednode, navigationcookiedata, false, false, true);
					} else {
						node.click();
						this.invokenextitem(node, timetoinvoke, navigationcookiedata);
					}
					break;
				case 'div':
					if(node.classList && (node.classList.contains('mat-form-field-flex') || node.classList.contains('mat-select-trigger'))) {
						this.addToolTip(node, node.parentNode.parentNode, selectednode, navigationcookiedata, true, false);
					} else {
						node.click();
						this.invokenextitem(node, timetoinvoke, navigationcookiedata);
					}
					break;
				//	fix for text editor during playback
				case 'ckeditor':
					this.addToolTip(node, node, selectednode, navigationcookiedata, true, false);
					break;
				case 'ng-select':
					this.addToolTip(node, node, selectednode, navigationcookiedata, false, false);
					break;
				default:
					// check for special input nodes and add tooltip
					let specialInputNode = false;
					node.classList.forEach(val => {
						if(UDAPluginSDK.inArray(val, UDAPluginSDK.specialInputClickClassNames) !== -1){
							specialInputNode = true;
						}
					});
					if(specialInputNode){
						this.addToolTip(node, node, selectednode, navigationcookiedata, true, false);
					} else {
						node.click();
					}
					this.invokenextitem(node, timetoinvoke, navigationcookiedata);
					break;
			}
		},
		//perform action based on selected node type
		mapSelectedElementAction: function(node, recordedNode, navigationCookieData, recordedNodeData){
			// this.addToolTip(node, node.parentNode, selectednode, navigationcookiedata, false, false, false);
			let performedAction = false;
			switch (recordedNodeData.meta.selectedElement.systemTag){
				case 'text':
				case 'date':
				case 'range':
				case 'file':
				case 'telephone':
				case 'email':
				case 'number':
				case 'password':
					this.addToolTip(node, node.parentNode, recordedNode, navigationCookieData, false, true, true);
					performedAction = true;
					break;
				case 'singleChoice':
					this.addToolTip(node, node.parentNode, recordedNode, navigationCookieData, false, false, true);
					performedAction = true;
					break;
				case 'multipleChoice':
					this.addToolTip(node, node.parentNode, recordedNode, navigationCookieData, false, false, true);
					performedAction = true;
					break;
				case 'button':
					node.click();
					this.invokenextitem(node, 1000, navigationCookieData);
					this.showselectedrow(navigationCookieData.data,navigationCookieData.data.id,true, navigationCookieData);
					performedAction = true;
					break;
				case "dropDown":
					this.addToolTip(node, node, recordedNode, navigationCookieData, false, false, true);
					performedAction = true;
					break;
				case "textArea":
					this.addToolTip(node, node.parentNode, recordedNode, navigationCookieData, false, false, true);
					performedAction = true;
					break;
			}
			return performedAction;
		},
		//add tooltip display
		addToolTip:function(invokingnode, tooltipnode, recordeddata=null, navigationcookiedata, enableClick=false, enableFocus=false, enableIntroJs=false, message= 'Please input the value and then click on', showButtons=true) {

			//UDAConsoleLogger.info(this.invokingnode);

			if(recordeddata !== null) {
				let recordednodedata = JSON.parse(recordeddata.objectdata);
				if(recordednodedata.hasOwnProperty('meta') && recordednodedata.meta.hasOwnProperty('tooltipInfo') && recordednodedata.meta.tooltipInfo != ''){
					message = recordednodedata.meta.tooltipInfo;
				}
			}

			/*if(this.invokingnode && this.invokingnode.isEqualNode(invokingnode)){
				return;
			} else {
				this.invokingnode = invokingnode;
			}*/

			this.invokingnode = invokingnode;

			this.playNextAction = false;

			if(navigationcookiedata) {
				if (navigationcookiedata && navigationcookiedata.autoplay) {
					this.autoplay = false;
					this.autoplayPaused = true;
					this.toggleautoplay(navigationcookiedata);
				} else {
					this.showselectedrow(navigationcookiedata.data, navigationcookiedata.data.id, true, navigationcookiedata);
				}
			}

			let toolTipContentSection	=	message
										+'<br/>';
			if(showButtons) {
				toolTipContentSection +=	'<button class="uda-tutorial-btn" style="margin-top:10px; margin-right: 5px;" type="button" uda-added="true" onclick="UDAPluginSDK.resumePlay();">Continue</button>'
											+ '<button class="uda-tutorial-exit-btn" style="margin-top:10px;" type="button" uda-added="true" id="uda-autoplay-exit">Exit</button>';
			}

			let toolTipContentElement = document.createElement('div');
			toolTipContentElement.innerHTML = toolTipContentSection.trim();
			toolTipContentElement.classList.add('uda-tooltip-text-content');

			let tooltipDivElement = document.createElement('div');
			tooltipDivElement.classList.add('uda-tooltip');
			tooltipDivElement.innerHTML = '<div id="uda-arrow" class="uda-arrow" data-popper-arrow></div>';
			tooltipDivElement.prepend(toolTipContentElement);

			document.body.appendChild(tooltipDivElement);

			/**
			 * calculating node position from here
			 */
			let toolTipPosistionClass = this.getTooltipPositionClass(tooltipnode, tooltipDivElement);

			this.popperInstance = Popper.createPopper(tooltipnode, tooltipDivElement,{
				placement: toolTipPosistionClass,
				modifiers: [
					{
						name: 'offset',
						options: {
							offset: [0, 20],
						},
					},
				],
			});

			jQuery("#uda-autoplay-exit").click(function () {
				UDAPluginSDK.backToSearchResultsPage(navigationcookiedata);
			});

			jQuery('html, body').animate({
				scrollTop: (jQuery(invokingnode).offset().top - 250)
			}, 2000, function(){
				if(enableFocus){
					invokingnode.focus();
				}
				if(enableClick){
					invokingnode.click();
				}
			});
		},
		/**
		 * tooltip placement calculation
		 */
		getScreenSize: function() {
			let page = {height: 0, width: 0};
			let screen = {height: 0, width: 0};
			let body = document.body,
				html = document.documentElement;

			const docEl = document.documentElement;
			const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
			const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

			let resolution = {height: 0, width: 0};

			page.height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
			page.width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
			if (window.innerWidth !== undefined) {
				screen.width = window.innerWidth * 0.75;
				screen.height = window.innerHeight;
				// return { width: (window.innerWidth*0.75), height: window.innerHeight };
			} else {
				const D = document.documentElement;
				screen.width = D.clientWidth;
				screen.height = D.clientHeight * 0.75;
				// return { width: D.clientWidth*0.75, height: D.clientHeight };
			}
			resolution.height = window.screen.height;
			resolution.width = window.screen.width;
			let windowProperties = {page: page, screen: screen, scrollInfo: {scrollTop: scrollTop, scrollLeft: scrollLeft}, resolution};
			return windowProperties;
		},
		//get node position on the page
		getNodeCoordinates: function(element, windowSize) {
			const x = element.getBoundingClientRect();
			let result = {
				top: x.top + windowSize.scrollInfo.scrollTop,
				width: x.width,
				height: x.height,
				left: x.left + windowSize.scrollInfo.scrollLeft,
				actualPos: x
			};
			return result;
		},
		getTooltipPositionClass: function (targetElement, tooltipElement) {
			const availablePositions = ["right", "top", "left", "bottom"].slice();

			const screenSize = this.getScreenSize();
			const tooltipPos = this.getNodeCoordinates(tooltipElement, screenSize);
			const targetElementRect = targetElement.getBoundingClientRect();

			let finalCssClass = "right";

			//UDAConsoleLogger.info('---------------- Screen info ------------------');
			//UDAConsoleLogger.info(screenSize);
			//UDAConsoleLogger.info(tooltipPos);
			//UDAConsoleLogger.info(targetElementRect);
			//UDAConsoleLogger.info('---------------- Screen info ------------------');

			// Check for space to the right
			if (targetElementRect.right + tooltipPos.width > screenSize.screen.width) {
				this.removeFromArray(availablePositions, "right");
			}

			// Check for space above
			if (targetElementRect.top - tooltipPos.height < 0) {
				this.removeFromArray(availablePositions, "top");
			}

			// Check for space to the left
			if (targetElementRect.left - tooltipPos.width < 0) {
				this.removeFromArray(availablePositions, "left");
			}

			// Check for space below
			if (targetElementRect.bottom + tooltipPos.height > screenSize.page.height) {
				this.removeFromArray(availablePositions, "bottom");
			}

			if (availablePositions.length > 0) {
				finalCssClass = availablePositions[0];
			}

			return finalCssClass;
		},
		removeFromArray: function(array, value) {
			if (array.includes(value)) {
				array.splice(array.indexOf(value), 1);
			}
		},
		//Continue functionality invoke
		resumePlay: function(){
			let tooltipnodes = jQuery('.uda-tooltip');
			if (tooltipnodes.length > 0) {
				jQuery('.uda-tooltip').remove();
				this.popperInstance.destroy();
			}
			this.playNextAction = true;
			var navigationcookie=this.getstoragedata(this.navigationcookiename);
			var navigationcookiedata = null;
			if(navigationcookie) {
				navigationcookiedata = JSON.parse(navigationcookie);
			}
			this.toggleautoplay(navigationcookiedata);
		},
		//invoke the click of next item
		invokenextitem:function(node, timeToInvoke, navigationCookieData){
			let link=false;
			timeToInvoke=timeToInvoke+4000;
			if(typeof node.href !== 'undefined' && node.href !== ''){
				if(typeof node.target !== 'undefined' && node.target==='_blank'){
					this.toggleautoplay(navigationCookieData);
				} else {
					let hostname = window.location.protocol + "//" + window.location.host+window.location.pathname;
					let href = node.href.substr(hostname.length);
					if(href!=='' && href !== "#") {
						link = true;
						this.navigatedToNextPage.check = true;
						this.navigatedToNextPage.url = node.href;
					}
				}
			}

			if(!link) {
				//UDAConsoleLogger.info(node,2);
				setTimeout(function(){UDAPluginSDK.showhtml();}, timeToInvoke);
			} else {
				timeToInvoke=timeToInvoke+3000;
				setTimeout(function(){UDAPluginSDK.showhtml();}, timeToInvoke);
			}
		},
		//simulate hover functionality
		simulateHover: function(node){
			var event = new MouseEvent('mouseover', {
				'view': window,
				'bubbles': true,
				'cancelable': true
			});
			var canceled = !node.dispatchEvent(event);
			if (canceled) {
				// A handler called preventDefault.
				//UDAConsoleLogger.info('hover cancelled');
			} else {
				// None of the handlers called preventDefault.
				//UDAConsoleLogger.info('hover not cancelled');
			}

		},
		//firing an event if event available for the node. Currently not implemented
		eventFire:function(el, etype){
			if (el.fireEvent) {
				el.fireEvent('on' + etype);
			} else {
				var evObj = document.createEvent('Events');
				evObj.initEvent(etype, true, false);
				el.dispatchEvent(evObj);
			}
		},
		//adding user click to the processing node.
		recorduserclick:function(node, fromdocument=false, selectchange=false, event, confirmdialog=false, hasparentclick = false){

			try {

				let specialInputNode = false;

				if(fromdocument){
					// todo from document click functionality;
				}

				if(!this.recording){
					return ;
				}

				if(this.autoplay){
					this.forceReindex = true;
					UDAPluginSDK.indexnewclicknodes();
					return true;
				}

				if(node.hasAttribute("nist-voice")){
					return true;
				}

				if(this.lastclickednode!=='' && node.isSameNode(this.lastclickednode)){
					return ;
				}

				if(this.lastclickedtime===Date.now()){
					return ;
				}

				// fix for file upload click and node which is hidden
				if(node.style && node.style.display && node.style.display === 'none'){
					let specialClassExists = false;
					node.classList.forEach((val) => {
						if(UDAPluginSDK.inArray(val, UDAPluginSDK.specialInputClickClassNames) !== -1){
							specialClassExists = true;
							specialInputNode = true;
						}
					});
					if(!specialClassExists) {
						return;
					}
				}

				//UDAConsoleLogger.info('-----------------------------clicked node--------------------------------');
				//UDAConsoleLogger.info({clickednode: node});
				//UDAConsoleLogger.info('-----------------------------clicked node--------------------------------');

				if(this.recording && this.inArray(node.nodeName.toLowerCase(), this.ignoreClicksOnSpecialNodes) !== -1){
					return ;
				} else if(this.recording && this.cancelRecordingDuringRecordingNodes.indexOf(node.nodeName.toLowerCase()) !== -1) {
					alert('Sorry currently we do not support this '+node.nodeName+' selector. Please re-record the sequence without selecting '+node.nodeName+' selector');
					this.recording=false;
					this.cancelrecordingsequence();
					this.showadvancedhtml();
					return ;
				} else if(this.recording && (node.parentNode && node.parentNode.hasAttribute("ng-controller") && node.parentNode.getAttribute("ng-controller")==='recognize_modal')) {
					// fix for nominate recording functionality.
					alert('Sorry currently we do not support this Nominate feature. Please re-record the sequence without selecting Nominate feature');
					this.recording=false;
					this.cancelrecordingsequence();
					this.showadvancedhtml();
					return ;
				} else if(node.hasAttribute('ng-click') && node.getAttribute('ng-click')){
					let ngclick=node.getAttribute('ng-click');
					if(ngclick.indexOf('clickNotoficationBell') !== -1){
						alert('Sorry currently we do not support this notifications. Please re-record the sequence without selecting Notifications');
						this.lastclickednode = node.parentNode;
						this.recording=false;
						this.cancelrecordingsequence(false);
						this.showadvancedhtml();
						return ;
					}
				}

				// processing document click
				var processclick=true;
				if(fromdocument && this.htmlindex.length>0){
					for(var i=0;i<this.htmlindex.length;i++){
						var processnode=this.htmlindex[i];
						if(node.isSameNode(processnode['element-data'])){
							processclick=false;
						}
					}
				}

				if(processclick===false){
					return true;
				}

				// var domjson = domJSON.toJSON(node);
				if (node.hasOwnProperty('uda_custom') && node.uda_custom.domJson) {
					var domjson = node.uda_custom.domJson;
					domjson.meta = {};
					//fix for position issue #89
					if(domjson.node.nodeInfo.nodePosition.x === 0 && domjson.node.nodeInfo.nodePosition.y === 0) {
						var domjson1 = domJSON.toJSON(node);
						domjson.node.nodeInfo.nodePosition = domjson1.node.nodeInfo.nodePosition;
					}
				} else {
					return ;
				}

				if(this.inArray(node.nodeName.toLowerCase(), this.ignoreNodesFromIndexing) !== -1 && this.customNameForSpecialNodes.hasOwnProperty(node.nodeName.toLowerCase())){
					domjson.meta.displayText = this.customNameForSpecialNodes[node.nodeName.toLowerCase()];
				}

				// check for special nodes
				if(specialInputNode){
					domjson.meta.isPersonal = true;
				}

				// adding default system detected html element type in metadata
				if(this.enableNodeTypeChangeSelection) {
					domjson.meta.systemDetected = this.mapClickedElementToHtmlFormElement(node);
					if (domjson.meta.systemDetected.inputElement !== 'others') {
						domjson.meta.selectedElement = domjson.meta.systemDetected;
					}
				}

				if(node.nodeName.toLowerCase()==="input" && node.getAttribute("type")==="radio"){
					var postdata = {
						domain: window.location.host,
						urlpath: window.location.pathname,
						sessionid: this.sessionID,
						clickednodename: "",
						html5: 0,
						clickedpath: "",
						objectdata: ""
					};
					var cache = [];
					var stringifiednode=JSON.stringify(domjson.node, function(key, value) {
						if (typeof value === 'object' && value !== null) {
							if (cache.indexOf(value) !== -1) {
								// Duplicate reference found, discard key
								return;
							}
							// Store value in our collection
							cache.push(value);
						}
						return value;
					});
					cache = null;
					domjson.node=JSON.parse(stringifiednode);
					postdata.objectdata=JSON.stringify(domjson);
				} else {
					var postdata = {
						domain: window.location.host,
						urlpath: window.location.pathname,
						sessionid: this.sessionID,
						clickednodename: "",
						html5: 0,
						clickedpath: "",
						objectdata: JSON.stringify(domjson)
					};
				}
				postdata.clickednodename = this.getclickedinputlabels(node, fromdocument, selectchange);

				// for known scenarios prompt user for input
				if(confirmdialog && this.recording && !this.confirmednode && !this.autoplay){
					this.confirmParentClick(node, fromdocument, selectchange, event, postdata);
					return true;
				} else if(confirmdialog && !this.recording) {
					return true;
				}

				this.rerenderhtml=true;
				this.addclickedrecordcookie(postdata.clickednodename);
				this.lastclickednode=node;
				this.lastclickedtime=Date.now();
				var outputdata = JSON.stringify(postdata);
				var xhr = new XMLHttpRequest();
				xhr.open("POST", UDA_API_URL+"/user/clickednode", false);
				xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
				xhr.onload = function(event){
					if(xhr.status === 200){
						UDAPluginSDK.confirmednode = false;
						// rerender html if recording is enabled.
						if(UDAPluginSDK.recording) {
							setTimeout(function () {
								UDAPluginSDK.showhtml();
							}, UDA_POST_INTERVAL);
						}
					}
				};
				xhr.send(outputdata);

				// reindexing whole document again for collapsable nodes
				if(this.recording) {
					//UDAConsoleLogger.info('----------------------------collapsable node---------------------------------');
					//UDAConsoleLogger.info({indexedpos: node.uda_custom.domJson.node.nodeInfo.nodePosition});
					//UDAConsoleLogger.info({domjson: domjson.node.nodeInfo.nodePosition});
					//UDAConsoleLogger.info('----------------------------collapsable node---------------------------------');

					if (node.hasAttribute('mattreenodetoggle')) {
						this.forceReindex = true;
						UDAPluginSDK.indexnewclicknodes();
					} else {
						//processing new clicknodes if available after the click action.
						setTimeout(function () {
							this.forceReindex = true;
							UDAPluginSDK.indexnewclicknodes();
						}, UDA_POST_INTERVAL);
					}
				}
			} catch (e) {
				UDAErrorLogger.error('Unable to record '+node.outerHTML+' '+ e);
			}
		},
		confirmParentClick:function(node, fromdocument, selectchange, event, postdata) {
			let prevClickText = this.getclickedinputlabels(this.lastclickednode, fromdocument, selectchange);
			if(node.hasChildNodes()) {
				var childTextExists = this.processparentchildnodes(node, prevClickText);
				if(!childTextExists) {
					// truncating text to max 120char
					let displayText = ((postdata.clickednodename.length > 120) ? (postdata.clickednodename.substr(0, 120) + '...') : (postdata.clickednodename) );
					let confirmDialog = confirm("Did you click on: " + displayText);
					if (confirmDialog === true) {
						UDAPluginSDK.confirmednode = true;
						UDAPluginSDK.recorduserclick(node, fromdocument, selectchange, event, false);
					}
					return false;
				} else {
					return false;
				}
			}
		},
		processparentchildnodes:function(node, prevtext) {
			var childtextexists = false;
			for(const childnode of node.childNodes) {
				if (childnode.nodeType === Node.ELEMENT_NODE) {
					if (this.lastclickednode && childnode.isSameNode(this.lastclickednode)) {
						childtextexists = true;
						break;
					}
					let childtext = this.getclickedinputlabels(childnode);
					if(prevtext === childtext) {
						childtextexists = true;
						break;
					} else if(childnode.hasChildNodes()){
						childtextexists = this.processparentchildnodes(childnode, prevtext);
						if(childtextexists) {
							break;
						}
					}
				}
			}
			return childtextexists
		},
		//getting input label for the clicked node
		getclickedinputlabels:function(node, fromdocument=false, selectchange=false){
			//UDAConsoleLogger.info({node: node});

			if (!node) {
				return null;
			}
			var inputlabels="";
			var nodename=node.nodeName.toLowerCase();
			switch (nodename) {
				case "select":
					if(selectchange) {
						inputlabels = jQuery(node).find(":selected").text();
					} else {
						var textlabels = this.getInputLabels(node, [], 1, true, false, true);
						if (textlabels.length > 0) {
							var labels = [];
							for (var j = 0; j < textlabels.length; j++) {
								labels.push(textlabels[j].text);
							}
							inputlabels = labels.toString();
						}
					}
					break;
				case "input":
					if(!node.hasAttribute("type")){
						var textlabels = this.getInputLabels(node, [], 1, true, true, true);
						if (textlabels.length > 0) {
							var labels = [];
							for (var j = 0; j < textlabels.length; j++) {
								labels.push(textlabels[j].text);
							}
							inputlabels = labels.toString();
						}
					} else {
						switch (node.getAttribute("type").toLowerCase()) {
							default:
								var textlabels = this.getInputLabels(node, [], 1, true, true, true);
								if (textlabels.length > 0) {
									var labels = [];
									for (var j = 0; j < textlabels.length; j++) {
										labels.push(textlabels[j].text);
									}
									inputlabels = labels.toString();
								}
						}
						break;
					}
				case "textarea":
					var textlabels = this.getInputLabels(node, [], 1, true, true, true);
					if (textlabels.length > 0) {
						var labels = [];
						for (var j = 0; j < textlabels.length; j++) {
							labels.push(textlabels[j].text);
						}
						inputlabels = labels.toString();
					}
					break;
				case "img":
					var textlabels = this.getInputLabels(node, [], 1, true, false, true);
					if (textlabels.length > 0) {
						var labels = [];
						for (var j = 0; j < textlabels.length; j++) {
							labels.push(textlabels[j].text);
						}
						inputlabels = labels.toString();
					}
					break;
				default:
					var textlabels = this.getInputLabels(node, [], 1, false, true, true);
					if (textlabels.length > 0) {
						var labels = [];
						for (var j = 0; j < textlabels.length; j++) {
							labels.push(textlabels[j].text);
						}
						inputlabels = labels.toString();
					}
			}
			//UDAConsoleLogger.info(inputlabels);
			return inputlabels;
		},
		//record page click todo functionality
		recorddocumentclick:function(){
			jQuery(document).ready(function(){
				document.body.addEventListener('click', function (event) { }, false);
			});
		},
		//adding current timestamp to the required actions under recording functionality
		gettimestamp:function(buttonclicked){
			if(buttonclicked !== "") {
				var result = Date.now();
				if(buttonclicked==="start"){
					this.startrecordingsequence(result);
				} else if(buttonclicked==="stop"){
					this.stoprecordingsequence(result);
				}
			}
		},
		//show recorded results in UDA screen
		showrecordedresults:function(){
			var recordingcookie = this.getstoragedata(this.recordingcookiename);
			var starttime=null;
			var endtime=Date.now();
			if(recordingcookie){
				var recordingcookiedata=JSON.parse(recordingcookie);
				starttime=recordingcookiedata.starttime;
			} else {
				return false;
			}

			jQuery("#uda-content-container").html("");

			if(this.clickeOn && this.clickeOn === 'record-btn'){
				UDAPluginSDK.addrecordresultshtml([]);
				this.clickeOn = '';
				return ;
			}

			var xhr = new XMLHttpRequest();
			xhr.open("GET", UDA_API_URL+"/clickevents/fetchrecorddata?start="+starttime+"&end="+endtime+"&sessionid="+UDAPluginSDK.sessionID+"&domain="+recordingcookiedata.domain, true);
			xhr.onload = function(event){
				if(xhr.status === 200){
					UDAPluginSDK.addrecordresultshtml(JSON.parse(xhr.response));
				}
			};
			xhr.send();
		},
		//start recording the user click to form a sequence
		startrecordingsequence:function(currenttimestamp){
			var recordingcookie = this.getstoragedata(this.recordingcookiename);
			if (recordingcookie) {
				var recordingcookiedata = JSON.parse(recordingcookie);
				recordingcookiedata.starttime = currenttimestamp;
				recordingcookiedata.recording = true;
				recordingcookiedata.endtime = null;
			} else {
				var recordingcookiedata = {recording: true, starttime: currenttimestamp, endtime: null};
			}
			recordingcookiedata.domain = window.location.host;
			this.createstoragedata(this.recordingcookiename,JSON.stringify(recordingcookiedata));

			this.clickeOn = 'record-btn';

			this.showhtml();

			//add analtytics
			this.recordclick('recordingstart',recordingcookiedata.domain);
		},
		//stop recording sequence that has been started and show recorded results
		stoprecordingsequence:function(currenttimestamp){
			var recordingcookie = this.getstoragedata(this.recordingcookiename);
			if(recordingcookie){
				var recordingcookiedata=JSON.parse(recordingcookie);
				recordingcookiedata.endtime=currenttimestamp;
				recordingcookiedata.recording=false;
			} else {
				return false;
			}
			this.createstoragedata(this.recordingcookiename,JSON.stringify(recordingcookiedata));

			//add analtytics
			this.recordclick('recordingstop',recordingcookiedata.domain);

			this.showhtml();
			jQuery("#uda-content-container").html("");
			var xhr = new XMLHttpRequest();
			xhr.open("GET", UDA_API_URL+"/clickevents/fetchrecorddata?start="+recordingcookiedata.starttime+"&end="+recordingcookiedata.endtime+"&sessionid="+UDAPluginSDK.sessionID+"&domain="+recordingcookiedata.domain, true);
			xhr.onload = function(event){
				if(xhr.status === 200){
					UDAPluginSDK.addrecordresultshtml(JSON.parse(xhr.response));
				}
			};
			xhr.send();
		},
		//cancel the recording sequence
		cancelrecordingsequence:function(render=true){
			// jQuery('#uda-advanced-btn').hide();
			var recordingcookie = this.getstoragedata(this.recordingcookiename);
			if(recordingcookie){
				var recordingcookiedata=JSON.parse(recordingcookie);
				if(!recordingcookiedata.recording){
					return false;
				}
				recordingcookiedata.endtime=Date.now();
				recordingcookiedata.recording=false;
			} else {
				return false;
			}
			this.createstoragedata(this.recordingcookiename,JSON.stringify(recordingcookiedata));
			var navcookiedata = {shownav: false, data: {}, autoplay:false, pause:false, stop:false, navcompleted:false, navigateddata:[],searchterm:''};
			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));

			let tooltipnodes = document.getElementsByClassName('uda-tooltip');
			if (tooltipnodes.length > 0) {
				jQuery('.uda-tooltip').remove();
				this.popperInstance.destroy();
			}

			//add analtytics
			this.recordclick('recordingcancel',recordingcookiedata.domain);
			this.currentPage='cancelrecording';
			if(render) {
				this.showhtml();
			}
		},
		//show sequence list html
		addrecordresultshtml:function(data){
			if(data.length>0) {
				this.recordedsequenceids=data;
				jQuery("#uda-content-container").html(this.renderRecordedSequenceHtml());
				for(var i=0;i<data.length;i++){
					// modification for personal button addition
					if(i===(data.length-1)){
						this.renderrecordresultrow(data[i],i,true);
					} else {
						this.renderrecordresultrow(data[i],i,false);
					}
				}
			} else {
				jQuery("#uda-content-container").html(this.renderEmptyRecordedSequenceHtml());
			}

			this.openmodal(false);
		},
		renderRecordedSequenceHtml: function(){
			var html =	'<div class="uda-card-details">'
						+'	<h5>Recorded Sequence</h5>'
						+'	<hr style="border:1px solid #969696; width:100%;">'
						+'	<ul class="uda-recording" id="uda-recorded-results">'
						+'	</ul>'

						+'	<hr style="border:1px solid #969696; width:100%;">'

						+'	<div style="text-align:left;">'
						+'		<input type="text" id="uda-recorded-name" name="uda-save-recorded[]" class="uda-form-input" placeholder="Enter Label">'
						+'		<div id="uda-sequence-names"></div>'
						+'		<div style="margin-bottom:10px;">'
						+'			<button class="add-btn" onclick="UDAPluginSDK.addSequenceNameRow();">+ Add Label</button>'
						+'		</div>'
						+'		<br>'
						+'		<br>'
						+'		<div style="margin-top: 10px; max-width:100%;">'
						+'			<button class="uda-record-btn" onclick="UDAPluginSDK.cancelrecordingsequence();"><span>Cancel and Exit</span></button>'
						+'			<button class="uda-tutorial-btn" onclick="UDAPluginSDK.submitrecordedlabel();" style="float: right; padding:5px 20px;">Submit</button>'
						+'		</div>'

						+'	</div>'
						+'</div>';

						/*+'	<div class="uda-recording" style="text-align: center;">'
						+'	<table id="uda-sequence-names"><tr>'
						+'		<td><input type="text" id="uda-recorded-name" name="uda-save-recorded[]" class="uda-form-input" placeholder="Enter Label"></td>'
						+'		<td><button class="uda-tutorial-btn" onclick="UDAPluginSDK.addSequenceNameRow();">Add</button></td>'
						+'	</tr></table>'
						+'		<button class="uda-record-btn" onclick="UDAPluginSDK.cancelrecordingsequence();"><span>Cancel and Exit</span></button>'
						+'		<button class="uda-tutorial-btn" onclick="UDAPluginSDK.submitrecordedlabel();">Submit</button>'
						+'	</div>'
						+'</div>';*/
			return html;
		},
		//Add new sequence name row
		addSequenceNameRow: function(){
			/*let html='<tr>'
					+'	<td><input type="text" name="uda-save-recorded[]" class="uda-form-input" placeholder="Enter Label"></td>'
					+'	<td><button class="uda-tutorial-btn uda-remove-row">Remove</button></td>'
					+'</tr>';*/
			let html	='<div>'
						+'		<input type="text" id="uda-recorded-name" name="uda-save-recorded[]" class="uda-form-input uda-form-input-reduced" placeholder="Enter Label">'
						+'		<span>'
						+'			<button class="delete-btn uda-remove-row"><img src="'+ this.extensionpath+'images/icons/delete.png"></button>'
						+'		</span>'
						+'</div>';

			jQuery('#uda-sequence-names').append(html);
			jQuery("#uda-sequence-names").on('click','.uda-remove-row',function(){
				jQuery(this).parent().parent().remove();
			});
		},
		renderEmptyRecordedSequenceHtml: function(){
			var html =	'<div class="uda-card-details">'
						// +'<span class="uda-close-icon">×</span>'
						+'	<h5>Recorded Sequence</h5>'
						+'	<hr>'
						+'	<h5>Please navigate in the page to record.</h5>'
						+'	<br />'
						+'	<div class="uda-recording" style="text-align: center;">'
						// +'		<input type="text" id="uda-recorded-name" name="uda-save-recorded" class="uda-form-input" placeholder="Enter Label">'
						+'		<button class="uda-record-btn" onclick="UDAPluginSDK.cancelrecordingsequence();"><span>Cancel and Exit</span></button>'
						// +'		<button class="uda-tutorial-btn" onclick="UDAPluginSDK.submitrecordedlabel();">Submit</button>'
						+'	</div>'
						+'</div>';
			return html;
		},
		//render record row html of the sequence
		renderrecordresultrow:function(data,index, showPersonalButton=false){
			index++;
			// let clickedname=((data.clickednodename.length>this.maxstringlength)?data.clickednodename.substr(0,this.maxstringlength)+'...':data.clickednodename);
			let nodeData = JSON.parse(data.objectdata);
			var originalName = '';
			if(nodeData.meta.hasOwnProperty('displayText') && nodeData.meta.displayText !== ''){
				var clickedname = ((nodeData.meta.displayText.length > this.maxstringlength) ? nodeData.meta.displayText.substr(0, this.maxstringlength) + '...' : nodeData.meta.displayText);
				originalName = nodeData.meta.displayText;
			} else {
				var clickedname = ((data.clickednodename.length > this.maxstringlength) ? data.clickednodename.substr(0, this.maxstringlength) + '...' : data.clickednodename);
				originalName = data.clickednodename;
			}
			// let clickedname=data.clickednodename;
			//adding personal tooltips
			let tooltipBtn = '';
			if(showPersonalButton) {
				tooltipBtn = this.showTooltipEditSection(nodeData);
			}
			// personal button appearance
			if(showPersonalButton){
				// clickedname=((data.clickednodename.length>(this.maxstringlength-24))?data.clickednodename.substr(0,(this.maxstringlength-24))+'...':data.clickednodename);
				var editBtn = 	'			<span>'
								+'				<button class="uda-tutorial-btn" style="padding:0px;" type="button" id="uda-edit-clickedname"><img src="'+this.extensionpath+'images/icons/edit.png"></button>'
								+'			</span>'
								+'			<input type="text" id="uda-edited-name" name="uda-edited-name" class="uda-form-input" placeholder="Enter Name" value="'+originalName+'" style="display: none;">';
				if(nodeData.meta.hasOwnProperty('isPersonal') && nodeData.meta.isPersonal){
					// var personalHtml = '&nbsp; &nbsp; (personal)';
					var personalHtml = '&nbsp; &nbsp;<input type="checkbox" id="isPersonal" checked /> <label style="font-size:14px;">Personal Information</label>';
				} else {
					var personalHtml = '&nbsp; &nbsp;<input type="checkbox" id="isPersonal" /> <label style="font-size:14px;">Personal Information</label>';
				}
				personalHtml += '			<span style="position: relative; top: 0px;"><img src="'+this.extensionpath+'images/icons/info.png" title="select this box if this field / text contains personal information like name / username. We need to ignore personal information while processing."></span>';

				// adding clicked element type
				let selectedElementHtml = (this.enableNodeTypeChangeSelection)?'Clicked on : <select name="UDASelectedElement" id="UDASelectedElement"></select>':'';

				var html =	'<li class="uda-recorded-label-editable"><i>'
								+clickedname
								// +editBtn
								+'<br />'
								+'</i>'
								+personalHtml
								+'<br />'
								+tooltipBtn
								+'<br />'
								+selectedElementHtml
							+'</li>';
				var element = jQuery(html);
				jQuery("#uda-recorded-results").append(element);
				jQuery("#isPersonal").click(function (){
					UDAPluginSDK.personalNode(data);
				});
				var beforeEditText = originalName;
				jQuery("#uda-edit-clickedname").click(function (){
					jQuery("#uda-edited-name").show();
				});
				jQuery('#uda-edited-name').blur(function() {
					let editedName = jQuery("#uda-edited-name").val();
					if(editedName.trim() !== '' && beforeEditText.trim() != editedName.trim()){
						UDAPluginSDK.editAndSave(data, editedName);
					}
				});
				jQuery("#uda-edited-name").keydown(function (e) {
					if (e.keyCode === 13) {
						let editedName = jQuery("#uda-edited-name").val();
						if(editedName.trim() !== '' && beforeEditText.trim() != editedName.trim()){
							UDAPluginSDK.editAndSave(data, editedName);
						}
					}
				});
				if(tooltipBtn) {
					jQuery("#uda-edit-tooltip").click(function (){
						// UDAPluginSDK.showTooltipInput(data);
						jQuery("#uda-edited-tooltip").show();
					});
					/*jQuery('#uda-edited-tooltip').blur(function() {
						let editedName = jQuery("#uda-edited-tooltip").val();
						if(editedName.trim() !== '' && beforeEditText.trim() != editedName.trim()){
							UDAPluginSDK.editAndSaveTooltip(data, editedName);
						}
					});*/
					jQuery("#uda-edited-tooltip").keydown(function (e) {
						if (e.keyCode === 13) {
							let editedName = jQuery("#uda-edited-tooltip").val();
							if(editedName.trim() !== '' && beforeEditText.trim() != editedName.trim()){
								UDAPluginSDK.editAndSaveTooltip(data, editedName);
							}
						}
					});
					jQuery("#uda-tooltip-save").click(function (){
						let editedName = jQuery("#uda-edited-tooltip").val();
						if(editedName.trim() !== '' && beforeEditText.trim() != editedName.trim()){
							UDAPluginSDK.editAndSaveTooltip(data, editedName);
						}
					});
				}

				//	Add dropdown selection of user clicked node for improvements #209
				if(this.enableNodeTypeChangeSelection) {
					let selectedElement = {inputElement: '', inputType: '', displayName: 'Please Select'};
					if (nodeData.meta.hasOwnProperty('selectedElement') && nodeData.meta.selectedElement) {
						selectedElement = nodeData.meta.selectedElement;
					}
					var $UDASelectedElementHtml = jQuery('#UDASelectedElement');
					if (selectedElement.inputElement === '') {
						var $option = jQuery("<option/>", {
							value: JSON.stringify(selectedElement),
							text: selectedElement.displayName,
							selected: true
						});
						$UDASelectedElementHtml.append($option);
					}
					for (let htmlFormElement of this.fetchHtmlFormElements()) {
						var $option = jQuery("<option/>", {
							value: JSON.stringify(htmlFormElement),
							text: htmlFormElement.displayName,
							selected: (htmlFormElement.systemTag === selectedElement.systemTag)
						});
						$UDASelectedElementHtml.append($option);
					}
					$UDASelectedElementHtml.on('change', function (e) {
						var optionSelected = jQuery("option:selected", this);
						var valueSelected = JSON.parse(this.value);
						UDAPluginSDK.editAndSaveSelectedHtmlElement(data, valueSelected);
					});
				}
			} else {
				clickedname += (nodeData.meta.hasOwnProperty('isPersonal') && nodeData.meta.isPersonal)?'&nbsp; &nbsp;(personal)':'';
				var html = '<li><i>' +
					clickedname +
					'</i></li>';
				var element = jQuery(html);
				jQuery("#uda-recorded-results").append(element);
			}
		},
		// available html form elements
		fetchHtmlFormElements: function(){
			return [
				{inputElement: 'input', inputType: ['text','search','url'], displayName: 'Simple Text', systemTag: 'text'},
				{inputElement: 'input', inputType: 'checkbox', displayName: 'Multiple Select', systemTag: 'multipleChoice'},
				{inputElement: 'input', inputType: 'radio', displayName: 'Single Select', systemTag: 'singleChoice'},
				{inputElement: 'input', inputType: 'number', displayName: 'Number Field', systemTag: 'number'},
				{inputElement: 'input', inputType: ['date','time'], displayName: 'Date and/or Time Field', systemTag: 'date'},
				{inputElement: 'input', inputType: 'email', displayName: 'Email Field', systemTag: 'email'},
				{inputElement: 'input', inputType: 'password', displayName: 'Password Field', systemTag: 'password'},
				{inputElement: 'input', inputType: 'range', displayName: 'Range Field', systemTag: 'range'},
				{inputElement: 'input', inputType: 'tel', displayName: 'Telephone Field', systemTag: 'telephone'},
				{inputElement: 'input', inputType: 'file', displayName: 'File Selection', systemTag: 'file'},
				// {inputElement: 'input', inputType: 'color', displayName: 'Color Selection'},
				// {inputElement: 'input', inputType: 'datetime-local', displayName: 'Local Date Selection'},
				// {inputElement: 'input', inputType: 'hidden', displayName: 'Hidden Field'},
				// {inputElement: 'input', inputType: 'image', displayName: 'Image Field'},
				// {inputElement: 'input', inputType: 'month', displayName: 'Month Field'},
				// {inputElement: 'input', inputType: 'reset', displayName: 'Reset Field'},
				// {inputElement: 'input', inputType: 'search', displayName: 'Search Field'},
				// {inputElement: 'input', inputType: 'time', displayName: 'Time Field'},
				// {inputElement: 'input', inputType: 'url', displayName: 'URL Field'},
				// {inputElement: 'input', inputType: 'week', displayName: 'Week Field'},
				{inputElement: ['select','option', 'optgroup'], inputType: 'select', displayName: 'Dropdown Field', systemTag: 'dropDown'},
				// {inputElement: 'option', inputType: 'option', displayName: 'Dropdown Option'},
				// {inputElement: 'optgroup', inputType: 'optgroup', displayName: 'Dropdown Option Group'},
				{inputElement: 'textarea', inputType: 'textarea', displayName: 'Large Text Area', systemTag: 'textArea'},
				{inputElement: ['input','button'], inputType: ['button', 'submit'], displayName: 'Button', systemTag: 'button'},
				// {inputElement: 'button', inputType: 'submit', displayName: 'Submit Field'},
				// {inputElement: 'input', inputType: 'button', displayName: 'Button Field'},
				// {inputElement: 'input', inputType: 'submit', displayName: 'Submit Field'},
				// {inputElement: 'output', inputType: 'output', displayName: 'Output Field'},
				// {inputElement: 'datalist ', inputType: 'datalist', displayName: 'Datalist Field'},
				{inputElement: 'a ', inputType: 'href', displayName: 'Link', systemTag: 'link'},
				{inputElement: 'others', inputType: 'others', displayName: 'Unrecognized', systemTag: 'others'},
			];
		},
		// map current element to html element
		mapClickedElementToHtmlFormElement: function(node){
			let htmlFormElements = this.fetchHtmlFormElements();
			let selectedFormElement = {inputElement: 'others', inputType: 'others', displayName: 'Other HTML Element'};
			for(let htmlFormElement of htmlFormElements) {
				if(Array.isArray(htmlFormElement.inputElement) && htmlFormElement.inputElement.indexOf(node.nodeName.toLowerCase()) != -1){
					if(Array.isArray(htmlFormElement.inputType) && node.hasAttribute('type') && htmlFormElement.inputType.indexOf(node.getAttribute('type')) !== -1){
						selectedFormElement = htmlFormElement;
					} else if (!Array.isArray(htmlFormElement.inputType) && htmlFormElement.inputElement.indexOf(node.nodeName.toLowerCase()) != -1) {
						selectedFormElement = htmlFormElement;
					}
				} else if(htmlFormElement.inputElement === 'input') {
					if(Array.isArray(htmlFormElement.inputType) && node.hasAttribute('type') && htmlFormElement.inputType.indexOf(node.getAttribute('type')) !== -1){
						selectedFormElement = htmlFormElement;
					} else if (!Array.isArray(htmlFormElement.inputType) && htmlFormElement.inputElement === node.nodeName.toLowerCase() && node.hasAttribute('type') && node.getAttribute('type') === htmlFormElement.inputType) {
						selectedFormElement = htmlFormElement;
					}
				} else if (htmlFormElement.inputElement === node.nodeName.toLowerCase()) {
					selectedFormElement = htmlFormElement;
				}
			}
			return selectedFormElement;
		},
		// save selected html element
		editAndSaveSelectedHtmlElement: function(data, value) {
			let nodeData = JSON.parse(data.objectdata);
			if(value.inputElement===''){
				return;
			}
			if(nodeData.meta && Object.keys(nodeData.meta).length >= 1) {
				nodeData.meta.selectedElement = value;
			} else {
				nodeData.meta = {};
				nodeData.meta.selectedElement = value;
			}
			data.objectdata = JSON.stringify(nodeData);
			var outputdata = JSON.stringify(data);
			var xhr = new XMLHttpRequest();
			xhr.open("POST", UDA_API_URL+"/user/updateclickednode");
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.onload = function(event){
				UDAPluginSDK.showhtml();
			};
			xhr.send(outputdata);
		},
		//customizing tooltip text function
		showTooltipEditSection: function(nodeData){
			try {
				let node=nodeData.node;
				let toolTipText = '';
				if (nodeData.meta.hasOwnProperty('tooltipInfo') && nodeData.meta.tooltipInfo) {
					toolTipText = nodeData.meta.tooltipInfo;
				}
				/*let tooltipBtnHtml 	='			<span>'
                                    + '				<button class="uda-tutorial-btn" style="padding:0px;" type="button" id="uda-edit-tooltip">'+((toolTipText)?'Edit Tooltip':'Add Tooltip')+'</button>'
                                    + '			</span>';
                let tooltipsection = (toolTipText) +'&nbsp;&nbsp;'+ tooltipBtnHtml + '<input type="text" id="uda-edited-tooltip" name="uda-edited-tooltip" class="uda-form-input" placeholder="Enter text" value="' + toolTipText + '" style="display: none;">';*/
				let tooltipBtnHtml 	= '	<div class="uda-recording" style="text-align: center;">'
					+'		<input type="text" id="uda-edited-tooltip" name="uda-edited-tooltip" class="uda-form-input" placeholder="Custom Tooltip (Optional)" style="width:68% !important;" value="'+toolTipText+'">'
					+'		<span>'
					+'			<button class="delete-btn" style="color:#fff;" id="uda-tooltip-save">Save</button>'
					+'		</span>'
					+'	</div>';
				let tooltipsection = tooltipBtnHtml;
				switch (node.nodeName.toLowerCase()) {
					case "input":
					case "textarea":
					case "select":
					case "option":
					case "checkbox":
						return tooltipsection;
						break;
					case "button":
						//typeof node.hasAttribute !== 'undefined' &&
						if(typeof node.hasAttribute !== 'undefined' && node.hasAttribute('aria-label') && node.getAttribute('aria-label').toLowerCase() === 'open calendar') {
							return tooltipsection;
						} else {
							return '';
						}
						break;
					case 'span':
						if (node.className && node.className.indexOf('select2-selection') !== -1) {
							return tooltipsection;
						} else {
							return '';
						}
						break;
					case 'div':
						if(node.className && (node.className.indexOf('mat-form-field-flex') !== -1 || node.className.indexOf('mat-select-trigger') !== -1)) {
							return tooltipsection;
						} else {
							return '';
						}
						break;
					case 'ckeditor':
						return tooltipsection;
						break;
					case 'ng-select':
						return tooltipsection;
						break;
					default:
						return "";
						break;
				}
			} catch (e) {
				console.log(e);
				UDAErrorLogger.error('Error at showTooltipEditSection. '+ e);
			}
		},
		editAndSaveTooltip: function(data, value) {
			let nodeData = JSON.parse(data.objectdata);
			if(nodeData.meta && nodeData.meta.hasOwnProperty("displayText")){
				nodeData.meta.tooltipInfo = value;
			} else if(nodeData.meta && Object.keys(nodeData.meta).length >= 1) {
				nodeData.meta.tooltipInfo = value;
			} else {
				nodeData.meta = {};
				nodeData.meta.tooltipInfo = value;
			}
			data.objectdata = JSON.stringify(nodeData);
			var outputdata = JSON.stringify(data);
			var xhr = new XMLHttpRequest();
			xhr.open("POST", UDA_API_URL+"/user/updateclickednode");
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.onload = function(event){
				UDAPluginSDK.showhtml();
			};
			xhr.send(outputdata);
		},
		//personal modification button clicked
		personalNode:function(data){
			let nodeData = JSON.parse(data.objectdata);
			if(nodeData.meta.hasOwnProperty("isPersonal")){
				if(nodeData.meta.isPersonal) {
					nodeData.meta.isPersonal = false;
				} else {
					nodeData.meta.isPersonal = true;
				}
			} else {
				nodeData.meta.isPersonal = true;
			}
			data.objectdata = JSON.stringify(nodeData);
			var outputdata = JSON.stringify(data);
			var xhr = new XMLHttpRequest();
			xhr.open("POST", UDA_API_URL+"/user/updateclickednode");
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.onload = function(event){
				UDAPluginSDK.showhtml();
			};
			xhr.send(outputdata);
		},
		//edit modification button clicked
		editAndSave:function(data, value){
			let nodeData = JSON.parse(data.objectdata);
			if(nodeData.meta && nodeData.meta.hasOwnProperty("displayText")){
				nodeData.meta.displayText = value;
			} else {
				nodeData.meta = {};
				nodeData.meta.displayText = value;
			}
			data.objectdata = JSON.stringify(nodeData);
			var outputdata = JSON.stringify(data);
			var xhr = new XMLHttpRequest();
			xhr.open("POST", UDA_API_URL+"/user/updateclickednode");
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.onload = function(event){
				UDAPluginSDK.showhtml();
			};
			xhr.send(outputdata);
		},
		// submit functionality of the recorded sequence.
		submitrecordedlabel:function(submittype="recording"){
			// var sequencename=jQuery("#uda-recorded-name").val();
			let sequencenames = [];
			var sequencenamearray=jQuery("input[name='uda-save-recorded[]']").map(function (){
				// detect for profanity
				let sequencename = this.value;
				if(UDAPluginSDK.profanity.enabled) {
					sequencename = UDAPluginSDK.checkProfanity(sequencename);
				}
				sequencename = sequencename.trim();
				sequencenames.push(sequencename);
			});
			let sequencename = JSON.stringify(sequencenames);
			var sequencelistdata={name:"",domain:window.location.host,usersessionid:this.sessiondata.authdata.id.toString(),userclicknodelist:[].toString(),userclicknodesSet:this.recordedsequenceids,isValid:1,isIgnored:0};
			if(submittype==='recording') {
				if (sequencename === '') {
					alert('Please enter proper label');
					jQuery("#uda-recorded-name").focus();
					return false;
				}
			} else if(submittype === 'invalid'){
				if(sequencename===''){
					sequencename="Declared as not valid sequence by user";
				}
				sequencelistdata.isValid=0;
			} else if(submittype === 'ignore'){
				if(sequencename===''){
					sequencename="Ignored by user";
				}
				sequencelistdata.isValid=0;
				sequencelistdata.isIgnored=1;
			}

			var sequenceids = [];
			for(var i=0;i<this.recordedsequenceids.length;i++){
				sequenceids.push(this.recordedsequenceids[i].id);
			}
			sequencelistdata.name=sequencename;
			sequencelistdata.userclicknodelist=sequenceids.toString();
			this.cancelrecordingsequence(false);
			this.currentPage='SequenceSubmitted';
			this.showhtml();
			var xhr = new XMLHttpRequest();
			xhr.open("POST", UDA_API_URL + "/clickevents/recordsequencedata", true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.onload = function(event){
				if(xhr.status === 200){
					UDAPluginSDK.showSelectedSequence(JSON.parse(xhr.response))
				}
			};
			xhr.send(JSON.stringify(sequencelistdata));
		},
		/**
		 * Profanity detection
		 * @constructor
		 * @param {string} label - Label of the recorded sequence
		 */
		checkProfanity: function(label){
			if(!this.profanity.enabled){
				return label;
			}
			switch (this.profanity.provider.toLowerCase()){
				case 'azure':
					var xhr = new XMLHttpRequest();
					xhr.open("POST", this.profanity.config.endPoint, false);
					xhr.setRequestHeader('Content-Type', 'text/plain');
					xhr.setRequestHeader('Ocp-Apim-Subscription-Key', this.profanity.config.key1);
					xhr.onload = function(event){
						if(xhr.status === 200){
							let response = JSON.parse(xhr.response);
							if (response.Terms && response.Terms.length>0) {
								response.Terms.forEach(function (term, termindex) {
									label = label.replaceAll(term.Term, '');
								});
							}
						}
					};
					xhr.send(label);
					break;
			}
			return label;
		},
		// adding the last clicked record to the storage
		addclickedrecordcookie:function(clickednodename){
			this.createstoragedata(this.recordclicknodecookiename,clickednodename);
		},
		// search from elastic functionality
		searchinelastic:function(searchterm=''){

			if(this.currentPage==='cancelrecording'){
				jQuery('#uda-advanced-btn').hide();
			} else if(this.currentPage==='SequenceSubmitted'){
				return ;
			} else if(!_modules_authData__WEBPACK_IMPORTED_MODULE_0__.UDAUserAuthData.restrict_add_delete) {
				jQuery('#uda-advanced-btn').show();
				jQuery("#uda-advance-section").show();
			}

			this.currentPage='advanced';

			if(searchterm) {
				var searchtext = searchterm;
			} else {
				var searchtext = jQuery("#uda-search-input").val();
			}
            // translating from other language to english
			if(this.multilingual.selectedLang !== this.multilingual.searchInLang) {
                let posturl = '';
                switch (this.multilingual.translate.provider){
                    case 'google':
                        posturl = this.multilingual.translate.apiurl+'?key='+encodeURIComponent(this.multilingual.translate.apikey)+'&target=en&q='+encodeURIComponent(searchtext);
                        break;
                }
                var translatexhr = new XMLHttpRequest();
                translatexhr.open("POST", posturl, false);
                translatexhr.onload = function(event){
                    if(translatexhr.status === 200){
                        let translateddata = JSON.parse(translatexhr.response);
                        if(translateddata.data.translations.length>0) {
                            searchtext = translateddata.data.translations[0].translatedText;
                        }
                    } else {
                        //UDAConsoleLogger.info(JSON.parse(translatexhr.response));
                    }
                };
                translatexhr.onerror = function(){
                };
                translatexhr.send();
            }

			this.cancelrecordingsequence(true);

			this.renderMessage('Loading Please Wait...');


			if (this.searchInProgress === true) {
				alert('Previous search in progress');
				return false;
			}

			if (this.autoplay) {
				this.searchInProgress = false;
				return false;
			}

			//UDAConsoleLogger.info(searchtext);

			this.searchText = searchtext;
			this.searchInProgress = true;

			//add analtytics
			this.recordclick('search',searchtext);

			var xhr = new XMLHttpRequest();
			let searchUrl = "/clickevents/sequence/search?query="+searchtext+"&domain="+encodeURI(window.location.host);
			if(this.enableNodeTypeChangeSelection){
				searchUrl +='&enabledNodeTypeSelection=true';
			}
			xhr.open("GET", UDA_API_URL + searchUrl, false);
			xhr.onload = function(event){
				if(xhr.status === 200){
					UDAPluginSDK.searchInProgress=false;
					UDAPluginSDK.renderSearchResults(JSON.parse(xhr.response));
				} else {
					UDAPluginSDK.renderMessage();
				}
			};
			// xhr.addEventListener("error", UDAPluginSDK.renderMessage());

			xhr.onerror = function(){
				console.log(xhr.status);
				UDAPluginSDK.renderMessage();
			};
			xhr.send();
		},
		//rendering search results screen
		renderSearchResults:function(data){

			if(!_modules_authData__WEBPACK_IMPORTED_MODULE_0__.UDAUserAuthData.restrict_add_delete) {
				jQuery('#uda-advanced-btn').show();
				jQuery("#uda-advance-section").show();
			}

			var matchnodes = data;
			if(matchnodes.length>0){
				jQuery("#uda-content-container").html('');
				for(var k=0;k<matchnodes.length;k++){
					if(matchnodes[k].hasOwnProperty("deleted") && matchnodes[k].deleted===0) {
						this.renderSequenceRow(matchnodes[k], k);
					} else if(!matchnodes[k].hasOwnProperty("deleted")) {
						this.renderSequenceRow(matchnodes[k], k);
					}
				}
			} else {
				this.renderEmptySearchResults();
			}
		},
		// rendering empty results html
		renderEmptySearchResults: function(){
			this.searchInProgress=false;
			jQuery("#uda-content-container").html(this.getEmptyResultsHtml());
		},
		getEmptyResultsHtml: function() {
			let html =	'<div class="uda-no-results">'
						+'	<svg class="uda-no-src" xmlns="http://www.w3.org/2000/svg" id="Capa_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><g><path d="m317 90c-57.891 0-105 47.109-105 105s47.109 105 105 105 105-47.109 105-105-47.109-105-105-105zm51.211 135-21.211 21.211-30-30-30 30-21.211-21.211 30-30-30-30 21.211-21.211 30 30 30-30 21.211 21.211-30 30z"/><path d="m317 0c-107.52 0-195 87.48-195 195 0 48.371 17.809 92.591 47.08 126.709l-23.086 23.086-21.211-21.211-111.631 111.629c-17.534 17.534-17.534 46.069-.015 63.633l.015.015c17.549 17.52 46.124 17.523 63.633-.015l111.631-111.629-21.211-21.211 23.086-23.086c34.118 29.271 78.338 47.08 126.709 47.08 107.52 0 195-87.48 195-195s-87.48-195-195-195zm0 330c-74.443 0-135-60.557-135-135s60.557-135 135-135 135 60.557 135 135-60.557 135-135 135z"/></g></svg>'
						+'	<p>No results found</p>'
						+'</div>';
			return html;
		},
		renderMessage: function(message='Something went wrong please try again later.'){
			this.searchInProgress=false;
			jQuery("#uda-content-container").html(this.getMessageHtml(message));
		},
		getMessageHtml: function(message) {
			let html =	'<div class="uda-no-results">'
				+'	<svg class="uda-no-src" xmlns="http://www.w3.org/2000/svg" id="Capa_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><g><path d="m317 90c-57.891 0-105 47.109-105 105s47.109 105 105 105 105-47.109 105-105-47.109-105-105-105zm51.211 135-21.211 21.211-30-30-30 30-21.211-21.211 30-30-30-30 21.211-21.211 30 30 30-30 21.211 21.211-30 30z"/><path d="m317 0c-107.52 0-195 87.48-195 195 0 48.371 17.809 92.591 47.08 126.709l-23.086 23.086-21.211-21.211-111.631 111.629c-17.534 17.534-17.534 46.069-.015 63.633l.015.015c17.549 17.52 46.124 17.523 63.633-.015l111.631-111.629-21.211-21.211 23.086-23.086c34.118 29.271 78.338 47.08 126.709 47.08 107.52 0 195-87.48 195-195s-87.48-195-195-195zm0 330c-74.443 0-135-60.557-135-135s60.557-135 135-135 135 60.557 135 135-60.557 135-135 135z"/></g></svg>'
				+'	<p>'+message+'</p>'
				+'</div>';
			return html;
		},
		//rendering each row html of the search result
		renderSequenceRow:function(data){
			var element=jQuery(this.getRowHtml(data));
			element.click(function () {
				UDAPluginSDK.showSelectedSequence(data);
			});
			jQuery("#uda-content-container").append(element);
		},
		//Sequence row html
		getRowHtml: function(data){
			var path='';
			for(var i=0;i<data.userclicknodesSet.length;i++){
				if(path!==''){
					path +=' >> ';
				}
				path += data.userclicknodesSet[i].clickednodename;
			}
			let sequencename = '';
			try{
				sequencename = JSON.parse(data.name)[0];
			} catch (e) {
				sequencename = data.name.toString();
			}
			var html =	'<div class="uda-card">'
						+'	<h5>'+sequencename+'</h5>'
						+'	<i>'+path+'</i>'
						+'</div>';
			return html;
		},
		//selected search result functionality
		showSelectedSequence:function(data){
			var navcookiedata = {shownav: true, data: data, autoplay:false, pause:false, stop:false, navcompleted:false, navigateddata:[],searchterm:''};
			navcookiedata.searchterm=jQuery("#uda-search-input").val();
			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
			this.autoplay = false;
			this.showselectedrow(data,data.id,true, navcookiedata);
			this.invokedActionManually=false;
			//add analtytics
			this.recordclick('sequencerecord',data.name.toString(),data.id);
		},
		// renderSelectedSequenceHtml: fu
		renderSelectedSequenceHtml: function (data, isPlaying){
			let playpausebutton = '';
			if(isPlaying) {
				playpausebutton = '			<div class="uda-loading-bar animate" id="nist-autoplay">'
								+'   			 <span>'
								+'      			<img src="'+this.extensionpath+'images/icons/pause.png">'
								+'    			</span>'
								+'  		</div>';
			} else {
				playpausebutton = '			<div class="uda-loading-bar" id="nist-autoplay">'
								+'   			 <span>'
								+'      			<img src="'+this.extensionpath+'images/icons/play.png">'
								+'    			</span>'
								+'  		</div>';
			}
			let sequencename = '';
			let sequencenames = '';
			try{
				let sequencenamesArray = JSON.parse(data.name)
				sequencename = sequencenamesArray[0];
				/*if(sequencenamesArray.length > 1) {
					sequencenamesArray.splice(0, 1);
					sequencenames = sequencenamesArray.join('<br /> or <br />');
				}*/
			} catch (e) {
				sequencename = data.name.toString();
			}
			var html =	'<div class="uda-card-details" style="border-bottom-left-radius: 0px; border-bottom-right-radius: 0px;">'
						+'    <div class="uda-card-btns">'
						// +'        <button class="uda-play-btn" '+((isPlaying)?'disabled="disabled"':'id="nist-autoplay"')+'><img src="'+this.extensionpath+'images/icons/play-icon.png"></button>'
						// +'        <button class="uda-stop-btn" '+((!isPlaying)?'disabled="disabled"':'id="nist-autoplay"')+'><img src="'+this.extensionpath+'images/icons/stop-icon.png"></button>'
						+	playpausebutton
						+'    </div>'
						+'    <div class="uda-card-right-dbl-arrow" id="uda-backto-search"><img src="'+this.extensionpath+'images/icons/right-duble-arrow.png"></div>'
						+'    <h5>'+sequencename+'</h5>'
						+((sequencenames)?'	<h6> or <br /> '+sequencenames+'</h6>':'')
						+'    <hr>'
						+'    <ul class="uda-suggestion-list" id="uda-sequence-steps">'
						+'    </ul>'
						+'</div>'
						+'<div class="uda-details-footer">'
						+'    <div class="uda-details-footer-left uda-trash-img" id="uda-delete-sequence">'
						+'    </div>'
						+'    <div class="uda-details-footer-right">'
						// +'    	<div class="like-img-bg uda-like-img" style="border-left: 1px solid #dce0f7;" id="uda-upvote">'
						// +'   	</div>'
						// +'    	<div class="dislike-img-bg uda-dislike-img" id="uda-downvote">'
						// +'   	</div>'
						+'    </div>'
						+'</div>';
			return html;
		},
		//showing the selected search result screen functionality
		showselectedrow:function(data,index,shownodelist=false, navcookiedata={}){
			if(shownodelist && navcookiedata.data.userclicknodesSet.length===navcookiedata.navigateddata.length){
				navcookiedata.navcompleted=true;
			}
			var isPlaying =  false;

			this.currentPage='SelectedSequence';

			if(shownodelist) {
				if (navcookiedata.navcompleted) {
					this.autoplayCompleted = true;
				} else {
					if(navcookiedata.autoplay) {
						isPlaying = true;
					}
				}
			}

			var element=jQuery(this.renderSelectedSequenceHtml(data, isPlaying));
			jQuery("#uda-content-container").html(element);
			var performactionnode=false;
			for(var i=0;i<data.userclicknodesSet.length;i++){
				var visited = -1;
				if(navcookiedata.navigateddata.length>0) {
					visited = this.inArray(data.userclicknodesSet[i].id, navcookiedata.navigateddata);
				}
				if(navcookiedata.autoplay && (!navcookiedata.pause || !navcookiedata.stop)){
					if(visited===-1 && !performactionnode){
						performactionnode=data.userclicknodesSet[i];
					}
				}
				jQuery("#uda-sequence-steps").append(this.rendersteps(data.userclicknodesSet[i], visited, navcookiedata));
			}

			if(this.sessionID && data.usersessionid && (this.sessionID.toString()===data.usersessionid.toString() || (this.sessiondata.authdata.hasOwnProperty('id') && this.sessiondata.authdata.id.toString()===data.usersessionid.toString()))){
				jQuery("#uda-delete-sequence").click(function () {
					UDAPluginSDK.deleteSequence(data);
				});
			} else {
				jQuery("#uda-delete-sequence").hide();
			}

			jQuery('#uda-upvote').click(function () {
				UDAPluginSDK.addvote("up",data);
			});
			jQuery('#uda-downvote').click(function () {
				UDAPluginSDK.addvote("down",data);
			});

			jQuery("#nist-autoplay").click(function () {
				UDAPluginSDK.toggleautoplay(navcookiedata);
			});

			// need to improve the autoplay functionality.
			if(typeof performactionnode=="object" && this.autoplay) {
				if(this.playNextAction) {
					this.performclickaction(performactionnode, navcookiedata);
				}
			} else if(this.autoplay){
				this.autoplayPaused = false;
				this.toggleautoplay(navcookiedata);
			}
			jQuery("#uda-backto-search").click(function () {
				UDAPluginSDK.backToSearchResultsPage(navcookiedata);
			});
		},
		backToSearchResultsPage: function(navcookiedata){
			UDAPluginSDK.autoplay = false;
			UDAPluginSDK.searchInProgress=false;
			UDAPluginSDK.autoplayPaused=false;
			UDAPluginSDK.playNextAction=true;
			UDAPluginSDK.backtosearchresults(navcookiedata);
			let tooltipnodes = document.getElementsByClassName('uda-tooltip');
			if (tooltipnodes.length > 0) {
				jQuery('.uda-tooltip').remove();
				this.popperInstance.destroy();
			}
		},
		//showing the sequence steps html
		rendersteps:function(data,visited=false, navcookiedata={}){
			// adding elipses if textlength is greater than specified characters
			// display personal tag for the personal nodes
			let clickedname = '';
			let nodeData = JSON.parse(data.objectdata);
			if(nodeData.meta.hasOwnProperty('displayText') && nodeData.meta.displayText !== ''){
				clickedname = ((nodeData.meta.displayText.length > this.maxstringlength) ? nodeData.meta.displayText.substr(0, this.maxstringlength) + '...' : nodeData.meta.displayText);
			} else {
				clickedname = ((data.clickednodename.length > this.maxstringlength) ? data.clickednodename.substr(0, this.maxstringlength) + '...' : data.clickednodename);
			}
			if(nodeData.meta.hasOwnProperty('isPersonal') && nodeData.meta.isPersonal){
				clickedname=((data.clickednodename.length>(this.maxstringlength-26))?data.clickednodename.substr(0,(this.maxstringlength-26))+'... (personal)':data.clickednodename);
			}
			var clickedtext = clickedname;
			if(visited>-1) {
				var template = jQuery("<li class='completed'><i>" + clickedtext + "</i></li>");
			} else {
				var template = jQuery("<li class='inactive'><i>" + clickedtext + "</i></li>");
			}
			if(visited === -1) {
				template.click(function () {
					UDAPluginSDK.invokedActionManually = true;
					UDAPluginSDK.performclickaction(data,navcookiedata);
				});
			}
			return template;
		},
		//perform click action of the sequence steps
		performclickaction:function(selectednode,navcookiedata){
			const matchNodes = [];
			let originalNode = {};
			if(selectednode.objectdata) {
				originalNode = JSON.parse(selectednode.objectdata);
				//UDAConsoleLogger.info({recordedNode: originalNode.node});
				if(selectednode && this.htmlindex.length>0){
					// personal tag check
					let isPersonalNode = false;
					if(originalNode.meta.hasOwnProperty('isPersonal') && originalNode.meta.isPersonal){
						isPersonalNode = true;
					}
					for(let searchNode of this.htmlindex){
						let searchLabelExists = false;
						let compareNode = domJSON.toJSON(searchNode["element-data"]);
						// compare recorded node with personal node tag or not
						let match = this.comparenodes(compareNode.node,originalNode.node, isPersonalNode);

						if ((match.matched+15) >= match.count) {
							//UDAConsoleLogger.info('-----------------------------Matching node-----------------------------');
							//UDAConsoleLogger.info(match);
							//UDAConsoleLogger.info(Math.abs((match.matched) - match.count));
							//UDAConsoleLogger.info(match.innerChildNodes * this.innerTextWeight);
							//UDAConsoleLogger.info('Matched ' + match.matched + ' out of ' + match.count);
							//UDAConsoleLogger.info({node: compareNode.node, htmlNode: searchNode["element-data"]});
							//UDAConsoleLogger.info({recordedNode: JSON.parse(selectednode.objectdata)});
							//UDAConsoleLogger.info('-----------------------------Matching node-----------------------------');
						}

						// we are incrementing 'matched' by 'innerTextWeight' for 'this' node and every child node and we are matching innerchildcounts that were returned from comparenodes
						if(compareNode.node.nodeName === originalNode.node.nodeName) {
							if (match.innerTextFlag && Math.abs((match.matched) - match.count) <= (match.innerChildNodes * this.innerTextWeight)) {
								searchLabelExists = true;
							} else if (match.matched === match.count) {
								searchLabelExists = true;
							} else if (originalNode.node.nodeName === 'CKEDITOR' && (match.matched + 1) >= match.count) {
								// fix for editor playback
								searchLabelExists = true;
							}
						}

						if(searchLabelExists){
							let matchNodeExists = false;
							if(matchNodes.length>0){
								for(let j=0; j<matchNodes.length; j++){
									if(matchNodes[j].originalNode["element-data"].isSameNode(searchNode["element-data"])){
										matchNodeExists=true;
									}
								}
							}

							if(matchNodeExists===false) {
								matchNodes.push({originalNode: searchNode, domJson: compareNode.node});
							}
						}
					}
				}
			}

			if(matchNodes.length === 1){
				if(this.updatenavcookiedata(navcookiedata,selectednode.id)){
					this.matchaction(matchNodes[0].originalNode,false,selectednode);
				}

			} else if(matchNodes.length>1) {
				//todo need to perform some user intervention
				// for multiple matching nodes compare labels of the clickable nodes to get exact node match
				let finalMatchNode = null;
				let finalMatchNodes = [];

				if(matchNodes.length>1){
					//UDAConsoleLogger.info('---------------------------recorded node-------------------------------');
					//UDAConsoleLogger.info('recordednode label:'+selectednode.clickednodename,2);
					//UDAConsoleLogger.info('---------------------------recorded node-------------------------------');
				}

				//UDAConsoleLogger.info('-----------------------------matched nodes-----------------------------');
				//UDAConsoleLogger.info(matchNodes,2);
				//UDAConsoleLogger.info('-----------------------------matched nodes-----------------------------');

				matchNodes.forEach(function (matchNode, matchnodeindex) {
					if(matchNode.originalNode.hasOwnProperty("element-data")) {
						const inputLabels = UDAPluginSDK.getclickedinputlabels(matchNode.originalNode["element-data"]);
						//UDAConsoleLogger.info('----------------------------input labels------------------------------');
						//UDAConsoleLogger.info(matchNode,2);
						//UDAConsoleLogger.info(inputLabels, 2);
						//UDAConsoleLogger.info('----------------------------input labels------------------------------');
						if (inputLabels === selectednode.clickednodename) {
							finalMatchNodes.push(matchNode);
						} else if(matchNode.originalNode["element-data"].classList && matchNode.originalNode["element-data"].classList.contains('expand-button')){
							// collapsable buttons are treated as matched nodes to check distance for further processing
							finalMatchNodes.push(matchNode);
						}
					}
				});

				if(finalMatchNodes.length===0 && matchNodes.length>=1){
					finalMatchNodes = matchNodes;
				}

				// process matching nodes after comparing labels
				if (finalMatchNodes.length === 1) {
					finalMatchNode = finalMatchNodes[0].originalNode;
				} else if(finalMatchNodes.length > 1) {
					// compare element positions as there are multiple matching nodes with same labels
					if(finalMatchNodes.length>1) {
						//UDAConsoleLogger.info('------------------------------Multiple nodes found comparing nearnode----------------------------');
						//UDAConsoleLogger.info({recordedNode: originalNode.node});
						//UDAConsoleLogger.info(finalMatchNodes);
						//UDAConsoleLogger.info('------------------------------Multiple nodes found comparing nearnode----------------------------');
					}
					finalMatchNode = this.processDistanceOfNodes(finalMatchNodes, originalNode.node);
				}

				if(finalMatchNode && finalMatchNode.hasOwnProperty("element-data")) {
					//UDAConsoleLogger.info('---------------------------Final matched node-------------------------------');
					//UDAConsoleLogger.info({finalMatchNode: finalMatchNode});
					//UDAConsoleLogger.info('---------------------------Final matched node-------------------------------');

					if(this.updatenavcookiedata(navcookiedata,selectednode.id)) {
						this.matchaction(finalMatchNode, false, selectednode);
					}
				} else {
					//UDAConsoleLogger.info('Unable to find final matchnode with distance calculation');
					UDAErrorLogger.error('Unable to find final matchnode with distance calculation for '+originalNode.node.nodeName+' Recorded id is: '+selectednode.id);
					alert("Nistapp UDA ran into a problem and will exit");
					if(navcookiedata && navcookiedata.autoplay) {
						this.autoplay = false;
						this.autoplayPaused = true;
						this.toggleautoplay(navcookiedata);
					}
				}

			} else {
				alert("Nistapp UDA ran into a problem and will exit");
				if(navcookiedata && navcookiedata.autoplay) {
					this.autoplay = false;
					this.autoplayPaused = true;
					this.toggleautoplay(navcookiedata);
				}
			}
		},
		//comparing nodes of indexed and the sequence step selected
		comparenodes:function(comparenode, originalnode, isPersonalNode=false, match={count:0, matched:0, unmatched:[], innerTextFlag: false, innerChildNodes: 0}){
			// sum the childnodes
			if(comparenode.hasOwnProperty('childNodes')) {
				match.innerChildNodes = match.innerChildNodes + comparenode.childNodes.length;
			}
			for(let key in originalnode){
				if(this.ignoreattributes.indexOf(key)!==-1){
					continue;
				} else if(key.indexOf('_ngcontent') !== -1 || key.indexOf('jQuery') !== -1 || key.indexOf('__zone_symbol__') !== -1){
					continue;
				} else {
					match.count++;
				}
				if(comparenode.hasOwnProperty(key) && (typeof originalnode[key] === 'object') && (typeof comparenode[key] === 'object')){
					match.matched++;
					match=this.comparenodes(comparenode[key], originalnode[key], isPersonalNode, match);
				} else if(comparenode.hasOwnProperty(key) && Array.isArray(originalnode[key]) && originalnode[key].length>0 && Array.isArray(comparenode[key]) && comparenode[key].length>0){
					match.matched++;
					if(comparenode[key].length===originalnode[key].length) {
						match.matched++;
						for (var i = 0; i < originalnode[key].length; i++) {
							match=this.comparenodes(comparenode[key][i], originalnode[key][i], isPersonalNode, match);
						}
					}
				} else if((key === 'class' || key === 'className') && originalnode.hasOwnProperty(key) && comparenode.hasOwnProperty(key)) {
					// fix for calendar issue
					comparenode[key] = comparenode[key].replace(' ng-star-inserted','');
					originalnode[key] = originalnode[key].replace(' ng-star-inserted','');
					if (comparenode[key]===originalnode[key]) {
						match.matched++;
					} else {
						// jaro wrinker comparision for classname
						let weight = this.JaroWrinker(originalnode[key], comparenode[key]);
						if(weight > 0.90) {
							match.matched++;
						} else {
							match.unmatched.push({
								key: key,
								compareNodeValues: comparenode[key],
								recordedNodeValues: originalnode[key]
							});
						}
					}
				} else if(key === 'innerText' && originalnode.hasOwnProperty(key) && comparenode.hasOwnProperty(key) && (comparenode[key].trim() === originalnode[key].trim())) {
					// matching inner text should be weighted more. We will add an arbitrarily large number - innerTextWeight.
					// since this will match for every child node, we need to accommodate this logic whenever 'comparenodes' is called
					//UDAConsoleLogger.info(comparenode[key].trim());
					//UDAConsoleLogger.info(originalnode[key].trim());
					match.innerTextFlag = true;
					match.matched = match.matched + this.innerTextWeight;
					// match.matched++;
				} else if(comparenode.hasOwnProperty(key) && comparenode[key]===originalnode[key]){
					match.matched++;
				} else if(comparenode.hasOwnProperty(key) && comparenode[key]!==originalnode[key] && key==='href' && originalnode[key].indexOf(comparenode[key])!==-1){
					match.matched++;
				} else if(comparenode.hasOwnProperty(key) && (key === 'id' || key === 'name') && comparenode[key]!==originalnode[key]){
					let weight = this.JaroWrinker(originalnode[key], comparenode[key]);
					if(weight>0.90) {
						match.matched++;
					}
				}
				// matching personal node key value pairs for personal tag true
				else if (isPersonalNode && this.personalNodeIgnoreAttributes.indexOf(key)!==-1) {
					// make inner text flag to true if personal tag is true
					if(key==='innerText'){
						match.innerTextFlag = true;
						match.matched = match.matched + this.innerTextWeight;
					} else {
						match.matched++;
					}
				} else {
					match.unmatched.push({key: key, compareNodeValues: comparenode[key], recordedNodeValues: originalnode[key]});
				}
			}
			return match;
		},
		JaroWrinker: function (s1, s2) {
			var m = 0;

			// Exit early if either are empty.
			if ( s1.length === 0 || s2.length === 0 ) {
				return 0;
			}

			// Exit early if they're an exact match.
			if ( s1 === s2 ) {
				return 1;
			}

			var range     = (Math.floor(Math.max(s1.length, s2.length) / 2)) - 1,
				s1Matches = new Array(s1.length),
				s2Matches = new Array(s2.length);

			for ( i = 0; i < s1.length; i++ ) {
				var low  = (i >= range) ? i - range : 0,
					high = (i + range <= s2.length) ? (i + range) : (s2.length - 1);

				for ( j = low; j <= high; j++ ) {
					if ( s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j] ) {
						++m;
						s1Matches[i] = s2Matches[j] = true;
						break;
					}
				}
			}

			// Exit early if no matches were found.
			if ( m === 0 ) {
				return 0;
			}

			// Count the transpositions.
			var k = n_trans = 0;

			for ( i = 0; i < s1.length; i++ ) {
				if ( s1Matches[i] === true ) {
					for ( j = k; j < s2.length; j++ ) {
						if ( s2Matches[j] === true ) {
							k = j + 1;
							break;
						}
					}

					if ( s1[i] !== s2[j] ) {
						++n_trans;
					}
				}
			}

			var weight = (m / s1.length + m / s2.length + (m - (n_trans / 2)) / m) / 3,
				l      = 0,
				p      = 0.1;

			if ( weight > 0.7 ) {
				while ( s1[l] === s2[l] && l < 4 ) {
					++l;
				}

				weight = weight + l * p * (1 - weight);
			}

			return weight;
		},
		// getting distance between recorded node and matching nodes of same labels
		processDistanceOfNodes: function(matchingnodes, selectedNode) {
			if (selectedNode.hasOwnProperty('nodeInfo') && matchingnodes.length>1) {
				let leastDistanceNode = null;
				let leastDistance = -1;
				//UDAConsoleLogger.info('------------ processing distance ------------------');
				matchingnodes.forEach((node) => {
					if (node.originalNode['element-data'].hasAttribute('aria-label')
						&& node.originalNode['element-data'].getAttribute('aria-label').toLowerCase() === 'open calendar') {
						// let dist = this.getDistance(selectedNode.nodePosition, node.originalNode['element-data'].uda_custom.domJson.node.nodePosition);
						let domJsonData = domJSON.toJSON(node.originalNode['element-data']);
						let dist = this.getDistance(selectedNode.nodeInfo, domJsonData.node.nodeInfo);
						//UDAConsoleLogger.info(selectedNode.nodeInfo);
						//UDAConsoleLogger.info(node.originalNode['element-data'].uda_custom.domJson.node.nodeInfo);
						//UDAConsoleLogger.info(domJsonData.node.nodeInfo);
						//UDAConsoleLogger.info(dist);
						// default adding first element as least distance and then comparing with last distance calculated
						if(leastDistance === -1) {
							leastDistance = dist;
							leastDistanceNode = node.originalNode;
						} else if (dist < leastDistance) {
							leastDistance = dist;
							leastDistanceNode = node.originalNode;
						}
					} else if (node.domJson.hasOwnProperty('nodeInfo')) {
						//UDAConsoleLogger.info('----------------Distance between nodes--------------');
						//UDAConsoleLogger.info(selectedNode.nodeInfo);
						//UDAConsoleLogger.info(node.domJson.nodeInfo);
						//UDAConsoleLogger.info('----------------Distance between nodes--------------');
						let dist = this.getDistance(selectedNode.nodeInfo, node.domJson.nodeInfo);
						// default adding first element as least distance and then comparing with last distance calculated
						if(leastDistance === -1) {
							leastDistance = dist;
							leastDistanceNode = node.originalNode;
						} else if (dist < leastDistance) {
							leastDistance = dist;
							leastDistanceNode = node.originalNode;
						}
					}
				});
				return leastDistanceNode;
			} else {
				return false;
			}
		},
		/**
		 * calculate distance between selected node and matching node
		 * @param1: recorded node
		 * @param2: comparing node
 		 */
		getDistance: function (node1, node2) {
			let dist;
			if(node1.hasOwnProperty('screen') && node2.hasOwnProperty('screen')) {
				if (node1.screen.width >= node2.screen.width) {
					const x = node1.nodePagePosition.left - (node2.nodePagePosition.left * (node2.screen.width / node1.screen.width))
					const y = node1.nodePagePosition.top - (node2.nodePagePosition.top * (node2.screen.height / node1.screen.height))
				} else {
					// const x = node1.nodePosition.x - node2.nodePosition.x;
					// const y = node1.nodePosition.y - node2.nodePosition.y;
					const x = node1.nodePagePosition.left - node2.nodePagePosition.left;
					const y = node1.nodePagePosition.top - node2.nodePagePosition.top;
					dist = Math.abs(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
				}
			} else {
				const x = node1.nodePosition.x - node2.nodePosition.x;
				const y = node1.nodePosition.y - node2.nodePosition.y;
				dist = Math.abs(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
			}
			return dist;
		},
		//adding data to the storage
		createstoragedata:function(key,value){
			try {
				window.localStorage.setItem(key, value);
				return true;
			} catch (e) {
				return false;
			}
		},
		//getting the data from the storage
		getstoragedata:function(key){
			try {
				var result=window.localStorage.getItem(key);
				return result;
			} catch (e) {
				return false;
			}
		},
		//delete sequence list functionality for the owner
		deleteSequence:function(data){
			let sequencename = '';
			try{
				let sequencenamesArray = JSON.parse(data.name)
				sequencename = sequencenamesArray[0];
			} catch (e) {
				sequencename = data.name.toString();
			}
			var confirmdialog=confirm("Are you sure want to delete "+sequencename);
			if(confirmdialog === true){
				UDAPluginSDK.confirmdelete(data);
			}
		},
		//confirmation for the deletion of the sequence list
		confirmdelete:function (data) {
			// var senddata=JSON.stringify({usersessionid:this.UDASessionID,id:data.id});
			var senddata=JSON.stringify({usersessionid:this.sessiondata.authdata.id,id:data.id});
			var xhr = new XMLHttpRequest();
			xhr.open("POST", UDA_API_URL + "/clickevents/sequence/delete", false);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.onload = function(event){
				if(xhr.status === 200){
					UDAPluginSDK.searchinelastic();
				}
			};
			xhr.send(senddata);
		},
		//adding vote functionality
		addvote:function(votetype,data){
			var senddata={"usersessionid": this.sessionID, "sequenceid" : data.id, "upvote":0, "downvote":0};
			if(votetype==="up"){
				senddata.upvote=1;
			} else if(votetype==="down"){
				senddata.downvote=1;
			}
			var xhr = new XMLHttpRequest();
			xhr.open("POST", UDA_API_URL + "/clickevents/sequence/addvote", true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.send(JSON.stringify(senddata));
		},
		//autoplay functionality to stop and play
		toggleautoplay:function(navcookiedata){
			if(navcookiedata.autoplay){
				navcookiedata.autoplay=false;
				this.autoplay=false;
				//add analtytics
				this.recordclick('stop',navcookiedata.data.name.toString(),navcookiedata.data.id);
			} else {
				navcookiedata.autoplay=true;
				this.autoplay=true;
				this.playNextAction = true;
				//add analtytics
				this.recordclick('play',navcookiedata.data.name.toString(),navcookiedata.data.id);
				// issue fix for replay
				if(!this.autoplayPaused && (this.autoplayCompleted || this.invokedActionManually)) {
					navcookiedata.navigateddata = [];
					navcookiedata.navcompleted = false;
					this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
				}
			}

			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
			this.showselectedrow(navcookiedata.data,navcookiedata.data.id,true, navcookiedata);
		},
		//updating the navigated data
		updatenavcookiedata:function(navcookiedata,selectednodeid){
			navcookiedata.navigateddata.push(selectednodeid);
			return this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata));
		},
		//back to search results functionality
		backtosearchresults:function (navcookiedata) {
			if(navcookiedata.searchterm!==''){
				var navcookiedata1 = {shownav: false, data: {}, autoplay:false, pause:false, stop:false, navcompleted:false, navigateddata:[],searchterm:navcookiedata.searchterm};
			} else {
				var navcookiedata1 = {shownav: false, data: {}, autoplay:false, pause:false, stop:false, navcompleted:false, navigateddata:[],searchterm:""};
			}
			this.createstoragedata(this.navigationcookiename,JSON.stringify(navcookiedata1));
			this.autoplay=false;
			jQuery("#uda-search-input").val(navcookiedata.searchterm);

			//add analtytics
			this.recordclick('back',navcookiedata.data.name.toString(),navcookiedata.data.id);

			this.searchinelastic(navcookiedata.searchterm);
		},
		recordclick:function (clicktype='sequencerecord',clickedname='',recordid=0) {
			var senddata={usersessionid:this.sessionID,clicktype:clicktype,clickedname:clickedname,recordid:recordid};
			var xhr = new XMLHttpRequest();
			xhr.open("PUT", UDA_API_URL + "/clickevents/userclick", true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			xhr.send(JSON.stringify(senddata));
		},
		showadvancedhtml:function(){
			this.currentPage='advanced';
			jQuery("#uda-advance-section").hide();
			jQuery("#uda-content-container").html('');
			jQuery("#uda-content-container").append(this.getAdvancedHtml());
			jQuery("#uda-enable-record").click(function () {
				UDAPluginSDK.gettimestamp("start");
			});
			jQuery("#nistvoiceback").click(function () {
				UDAPluginSDK.backtomodal();
			});
			var xhr = new XMLHttpRequest();
			xhr.open("GET", UDA_API_URL + "/clickevents/suggested?domain="+encodeURI(window.location.host), true);
			xhr.onload = function(event){
				if(xhr.status === 200){
					UDAPluginSDK.showsuggestedhtml(JSON.parse(xhr.response));
				}
			};
			// xhr.send();
		},
		// advanced html
		getAdvancedHtml: function (){
			var html =	'<div class="uda-card-details">'
							// +'<div><button class="uda-tutorial-btn" type="button">Tutorial</button></div>'
							// +'<hr>'
							+'<span class="uda-close-icon" onclick="UDAPluginSDK.searchinelastic();">×</span>'
							+'<h5>Create your own action</h5>'
							+'<div><button class="uda-record-btn" id="uda-enable-record"><span>Rec</span></button></div>'
						+'</div>';
			return html;
		},
		showsuggestedhtml:function(data){
			if(data.length>0) {
				this.recordedsequenceids = data;
				var html = '   <div class="voice-suggesion-card">' +
					'		<div class="voice-card-left">' +
					'			<h4>Our AI detected this sequence. <br /> Do you want to name it? <br /><span style="color:#ff4800;font-weight:bold;">(Beta version: Not reliable)</span></h4>' +
					'			<ul id="uda-recorded-results" class="voice-sugggesion-bullet">' +
					'			</ul>' +
					'			<div>' +
					'				<input id="uda-recorded-name" type="text" name="uda-recorded-name" class="voice-save-recrded-inpt" placeholder="Enter label" nist-voice="true">' +
					'				<button onclick="UDAPluginSDK.submitrecordedlabel(\'recording\');" class="voice-submit-btn">Submit</button><button class="voice-cancel-btn" onclick="UDAPluginSDK.submitrecordedlabel(\'invalid\');">Invalid Sequence</button><button class="voice-cancel-btn" onclick="UDAPluginSDK.submitrecordedlabel(\'ignore\');">Ignore</button>' +
					'			</div>' +
					'		</div>' +
					'	</div>';

				jQuery("#uda-content-container").append(html);
				for (var i = 0; i < data.length; i++) {
					this.renderrecordresultrow(data[i], i);
				}
			}
		},
		backtomodal:function(){
			jQuery("#uda-advance-section").show();
			jQuery("#uda-content-container").html('');
		},
		/**
		 * disabling functionality to show the button or not.
		 */
		disableRecordButton: function(){
			if(_modules_authData__WEBPACK_IMPORTED_MODULE_0__.UDAUserAuthData.restrict_add_delete) {
				jQuery("#uda-advanced-btn").hide();
			} else {
				jQuery("#uda-advanced-btn").show();
			}
		}
	};
	UDAPluginSDK.init();
}

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNILHNCQUFzQiwwQ0FBMEMsZUFBZTtBQUMvRSxzQkFBc0IsZ0RBQWdELGlCQUFpQjtBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsSUFBSTtBQUNKLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLGdFQUFnRSxTQUFTLDJCQUEyQixvQ0FBb0M7QUFDeEk7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHLGlFQUFrQjtBQUNyQixHQUFHLG9FQUFxQjtBQUN4QjtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0EsR0FBRztBQUNIO0FBQ0EseUdBQXlHO0FBQ3pHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQ7QUFDM0Q7QUFDQSxpQ0FBaUMsV0FBVyxnQkFBZ0IsbUJBQW1CLGdCQUFnQjtBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELGtCQUFrQjtBQUNsRTtBQUNBLCtEQUErRCxpQkFBaUI7QUFDaEY7QUFDQSw2RUFBNkU7QUFDN0U7QUFDQSxrRkFBa0YsYUFBYTtBQUMvRjtBQUNBO0FBQ0Esb0dBQW9HO0FBQ3BHO0FBQ0EsdUpBQXVKO0FBQ3ZKO0FBQ0E7QUFDQSw2Q0FBNkMsV0FBVztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBFQUEwRSxpQkFBaUI7QUFDM0Y7QUFDQSxpRUFBaUUsaUJBQWlCO0FBQ2xGO0FBQ0Esa0dBQWtHO0FBQ2xHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxrRkFBbUM7QUFDM0M7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtB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Q0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLG1CQUFtQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLGtCQUFrQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHdCQUF3QjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTREO0FBQzVEO0FBQ0E7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O0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQ7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJEO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQ7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxrQ0FBa0M7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLLFNBQVMsa0ZB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QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLHdCQUF3QjtBQUNsRCxLQUFLO0FBQ0wsMEJBQTBCLHdCQUF3QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLDJEQUEyRDtBQUMzRDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhFQUE4RTtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEdBQTRHLGlCQUFpQjtBQUM3SDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJFQUEyRSxrSUFBa0ksa0hBQWtIO0FBQy9UO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsaUJBQWlCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLGtGQUFtQztBQUN6QztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9MaWJyYXJ5TmFtZS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vTGlicmFyeU5hbWUvLi9zcmMvY29uZmlnL2luZGV4LnRzIiwid2VicGFjazovL0xpYnJhcnlOYW1lLy4vc3JjL21vZHVsZXMvYXV0aERhdGEudHMiLCJ3ZWJwYWNrOi8vTGlicmFyeU5hbWUvLi9zcmMvdXRpbC9pbmRleC50cyIsIndlYnBhY2s6Ly9MaWJyYXJ5TmFtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9MaWJyYXJ5TmFtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vTGlicmFyeU5hbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9MaWJyYXJ5TmFtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0xpYnJhcnlOYW1lLy4vc3JjL3Nkay9Wb2ljZXBsdWdpbnNkay5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIkxpYnJhcnlOYW1lXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkxpYnJhcnlOYW1lXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkxpYnJhcnlOYW1lXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgKCkgPT4ge1xucmV0dXJuICIsIiAgXHJcbmV4cG9ydCBjb25zdCBDT05GSUcgPSB7XHJcbiAgICBjdXJyZW50OiAnVEVTVCcsXHJcbiAgICBVREFEZWJ1ZzogZmFsc2UsXHJcbiAgICBVREFfRE9NQUlOOiBcImh0dHBzOi8vdWRhbnRlc3QubmlzdGFwcC5haVwiLFxyXG4gICAgVURBX0FQSV9VUkw6IFwiaHR0cHM6Ly91ZGFudGVzdC5uaXN0YXBwLmFpL3ZvaWNlYXBpXCIsXHJcbiAgICBVREFTZXNzaW9uSUQ6IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCAxNSkgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTUpLFxyXG4gICAgVURBX1BPU1RfSU5URVJWQUw6IDEwMDAsXHJcbiAgICBVREFMYXN0TXV0YXRpb25UaW1lOiAwLFxyXG4gICAgVURBTG9nTGV2ZWw6MCxcclxuICAgIHNldCBFbnZpcm9ubWVudCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudCA9IHZhbHVlLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKTtcclxuICAgICAgICBpZih0aGlzLmN1cnJlbnQ9PT0nUFJPRCcpe1xyXG4gICAgICAgICAgICB0aGlzLlVEQV9ET01BSU4gPSBcImh0dHBzOi8vdWRhbi5uaXN0YXBwLmFpXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5VREFfRE9NQUlOID0gXCJodHRwczovL3VkYW50ZXN0Lm5pc3RhcHAuYWlcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5VREFfQVBJX1VSTCA9IHRoaXMuVURBX0RPTUFJTitcIi92b2ljZWFwaVwiO1xyXG4gICAgfSxcclxuICAgIGdldCBFbnZpcm9ubWVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVURBZGlnZXN0TWVzc2FnZSB9IGZyb20gJy4uL3V0aWwnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFVEQVVzZXJBdXRoRGF0YSA9IHsgaWQ6ICcnLCBlbWFpbDogJycsIHJlc3RyaWN0X2FkZF9kZWxldGU6IGZhbHNlLCByb2xlOiAnZGVmYXVsdCcsIHBlcm1pc3Npb25zOiAnJyB9O1xyXG5cclxuZXhwb3J0IGNvbnN0IHVkYWF1dGhkYXRhID0ge1xyXG4gICAgc2V0IGlkKHZhbCkge1xyXG4gICAgICAgIGlmICghdmFsKSByZXR1cm47XHJcbiAgICAgICAgVURBZGlnZXN0TWVzc2FnZSh2YWwsIFwiU0hBLTUxMlwiKS50aGVuKChlbmNyeXB0ZWQ6c3RyaW5nKT0+e1xyXG4gICAgICAgICAgICBVREFVc2VyQXV0aERhdGEuaWQgPSBlbmNyeXB0ZWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlc3Npb25FdmVudCA9IG5ldyBDdXN0b21FdmVudChcIlVEQUNsZWFyU2Vzc2lvbkRhdGFcIiwge2RldGFpbDoge2RhdGE6IFwiY2xlYXJzZXNzaW9uXCJ9LCBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2V9KTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChzZXNzaW9uRXZlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGdldCBpZCgpIHtcclxuICAgICAgICByZXR1cm4gVURBVXNlckF1dGhEYXRhLmlkO1xyXG4gICAgfSxcclxuICAgIHNldCBlbWFpbCh2YWwpIHtcclxuICAgICAgICBVREFkaWdlc3RNZXNzYWdlKHZhbCwgXCJTSEEtNTEyXCIpLnRoZW4oZW5jcnlwdGVkPT57XHJcbiAgICAgICAgICAgIFVEQVVzZXJBdXRoRGF0YS5lbWFpbCA9IGVuY3J5cHRlZDtcclxuICAgICAgICAgICAgY29uc3Qgc2Vzc2lvbkV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiVURBQ2xlYXJTZXNzaW9uRGF0YVwiLCB7ZGV0YWlsOiB7ZGF0YTogXCJjbGVhcnNlc3Npb25cIn0sIGJ1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZX0pO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KHNlc3Npb25FdmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0IGVtYWlsKCkge1xyXG4gICAgICAgIHJldHVybiBVREFVc2VyQXV0aERhdGEuZW1haWw7XHJcbiAgICB9LFxyXG4gICAgc2V0IHVzZXJSb2xlKHZhbCkge1xyXG4gICAgICAgIFVEQVVzZXJBdXRoRGF0YS5yb2xlID0gdmFsO1xyXG4gICAgICAgIHZhciBzZXNzaW9uRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJVREFDbGVhclNlc3Npb25EYXRhXCIsIHtkZXRhaWw6IHtkYXRhOiBcImNsZWFyc2Vzc2lvblwifSwgYnViYmxlczogZmFsc2UsIGNhbmNlbGFibGU6IGZhbHNlfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChzZXNzaW9uRXZlbnQpO1xyXG4gICAgfSxcclxuICAgIGdldCB1c2VyUm9sZSgpIHtcclxuICAgICAgICByZXR1cm4gVURBVXNlckF1dGhEYXRhLnJvbGU7XHJcbiAgICB9LFxyXG4gICAgc2V0IHJlc3RyaWN0X2FkZF9kZWxldGUodmFsKSB7XHJcbiAgICAgICAgVURBVXNlckF1dGhEYXRhLnJlc3RyaWN0X2FkZF9kZWxldGUgPSB2YWw7XHJcbiAgICAgICAgdmFyIHNlc3Npb25FdmVudCA9IG5ldyBDdXN0b21FdmVudChcIlVEQURpc2FibGVCdXR0b25cIiwge2RldGFpbDoge2RhdGE6IFwiVURBRGlzYWJsZUJ1dHRvblwifSwgYnViYmxlczogZmFsc2UsIGNhbmNlbGFibGU6IGZhbHNlfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChzZXNzaW9uRXZlbnQpO1xyXG4gICAgfSxcclxuICAgIGdldCByZXN0cmljdF9hZGRfZGVsZXRlKCkge1xyXG4gICAgICAgIHJldHVybiBVREFVc2VyQXV0aERhdGEucmVzdHJpY3RfYWRkX2RlbGV0ZTtcclxuICAgIH0sXHJcbiAgICBzZXQgcGVybWlzc2lvbnModmFsKSB7XHJcbiAgICAgICAgVURBVXNlckF1dGhEYXRhLnBlcm1pc3Npb25zID0gdmFsO1xyXG4gICAgfSxcclxuICAgIGdldCBwZXJtaXNzaW9ucygpIHtcclxuICAgICAgICByZXR1cm4gVURBVXNlckF1dGhEYXRhLnBlcm1pc3Npb25zO1xyXG4gICAgfVxyXG59OyIsIi8vIGltcG9ydCB7VURBQ29uc29sZUxvZ2dlciwgVURBRXJyb3JMb2dnZXJ9IGZyb20gJy4uL2NvbmZpZy9lcnJvci1sb2cnO1xuXG5jb25zdCBVREFDbGlja09iamVjdHM6IGFueSA9IFtdO1xuY29uc3QgVURBUmVtb3ZlZENsaWNrT2JqZWN0czogYW55ID0gW107XG5cbi8vIGFkZGluZyB0aGUgY2xpY2tvYmplY3RzIHRoYXQgd2VyZSBpZGVudGlmaWVkLlxuZXhwb3J0IGZ1bmN0aW9uIFVEQUFkZE5ld0VsZW1lbnQobm9kZTogSFRNTEVsZW1lbnQpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjbGlja09iamVjdDogYW55ID0ge2VsZW1lbnQ6IG5vZGV9O1xuXG4gICAgLy8gY2hlY2tpbmcgd2hldGhlciB0aGUgZWxlbWVudCBpcyB3aW5kb3cgb3Igbm90XG4gICAgaWYgKGNsaWNrT2JqZWN0LmVsZW1lbnQgPT09IHdpbmRvdykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRhZyA9IGNsaWNrT2JqZWN0LmVsZW1lbnQudGFnTmFtZTtcbiAgICBpZiAoXG4gICAgICB0YWcgJiZcblx0XHRcdCh0YWcudG9Mb3dlckNhc2UoKSA9PT0gJ2JvZHknIHx8XG5cdFx0XHRcdHRhZy50b0xvd2VyQ2FzZSgpID09PSAnZG9jdW1lbnQnIHx8XG5cdFx0XHRcdHRhZy50b0xvd2VyQ2FzZSgpID09PSAnd2luZG93JyB8fFxuXHRcdFx0XHR0YWcudG9Mb3dlckNhc2UoKSA9PT0gJ2h0bWwnKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGNsaWNrT2JqZWN0LmVsZW1lbnQuaGFzQXR0cmlidXRlICYmXG5cdFx0XHRjbGlja09iamVjdC5lbGVtZW50Lmhhc0F0dHJpYnV0ZSgnbmlzdC12b2ljZScpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgXG4gICAgZm9yIChjb25zdCBpIG9mIFVEQUNsaWNrT2JqZWN0cykge1xuICAgICAgaWYgKGkuZWxlbWVudC5pc1NhbWVOb2RlKGNsaWNrT2JqZWN0LmVsZW1lbnQpKSB7XG4gICAgICAgIC8vIHRvZG8sIGRpc2N1c3MgLCBob3cgYmV0dGVyIHRvIGNhbGwgYWN0aW9ucywgaWYgbXVsdGlwbGUgYWN0aW9ucyBzaG91bGQgYmUgc3RvcmVkLCBvciBzZWxlY3RvciBiZXR0ZXIuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGlja09iamVjdC5pZCA9IFVEQUNsaWNrT2JqZWN0cy5sZW5ndGg7XG4gICAgVURBQ2xpY2tPYmplY3RzLnB1c2goY2xpY2tPYmplY3QpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc3QgaHRtbGVsZW1lbnQgPSBub2RlLmlubmVySFRNTDtcbiAgICAvLyBVREFFcnJvckxvZ2dlci5lcnJvcihcbiAgICAvLyAgICAgJ1VuYWJsZSB0byBwcm9jZXNzIGNsaWNrYWJsZSBvYmplY3QgLSAnICsgaHRtbGVsZW1lbnQsXG4gICAgLy8gICAgIGUsXG4gICAgLy8gKTtcbiAgfVxufVxuXG4vLyBwcm9jZXNzaW5nIG5vZGUgZnJvbSBtdXRhdGlvbiBhbmQgdGhlbiBzZW5kIHRvIGNsaWNrYm9qZWN0cyBhZGRpdGlvblxuZXhwb3J0IGZ1bmN0aW9uIFVEQVByb2Nlc3NOb2RlKG5vZGU6IEhUTUxFbGVtZW50KSB7XG4gIGNvbnN0IHByb2Nlc3NjaGlsZHJlbiA9IHRydWU7XG5cbiAgaWYgKG5vZGUub25jbGljayAhPSB1bmRlZmluZWQpIHtcbiAgICBVREFBZGROZXdFbGVtZW50KG5vZGUpO1xuICB9XG5cbiAgLy8gc3dpdGNoZWQgdG8gc3dpdGNoIGNhc2UgY29uZGl0aW9uIGZyb20gaWYgY29uZGl0aW9uXG4gIGlmIChub2RlLnRhZ05hbWUpIHtcbiAgICBzd2l0Y2ggKG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICBjYXNlICdhJzpcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCAmJiBub2RlPy5ocmVmICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBVREFBZGROZXdFbGVtZW50KG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaW5wdXQnOlxuICAgICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgY2FzZSAnb3B0aW9uJzpcbiAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgIFVEQUFkZE5ld0VsZW1lbnQobm9kZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYnV0dG9uJzpcbiAgICAgICAgaWYgKG5vZGUuaGFzQXR0cmlidXRlKCduZy1jbGljaycpIHx8IG5vZGUuaGFzQXR0cmlidXRlKCdvbmNsaWNrJykpIHtcbiAgICAgICAgICBVREFBZGROZXdFbGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIG5vZGUuaGFzQXR0cmlidXRlKCd0eXBlJykgJiZcblx0XHRcdFx0XHRub2RlLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnc3VibWl0J1xuICAgICAgICApIHtcbiAgICAgICAgICBVREFBZGROZXdFbGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIG5vZGUuY2xhc3NMaXN0ICYmXG5cdFx0XHRcdFx0KG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdleHBhbmQtYnV0dG9uJykgfHxcblx0XHRcdFx0XHRcdG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdidG4tcGlsbCcpKVxuICAgICAgICApIHtcbiAgICAgICAgICBVREFBZGROZXdFbGVtZW50KG5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vVURBQ29uc29sZUxvZ2dlci5pbmZvKHtub2RlfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzcGFuJzpcbiAgICAgICAgaWYgKG5vZGUuY2xhc3NMaXN0ICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3QyLXNlbGVjdGlvbicpKSB7XG4gICAgICAgICAgVURBQWRkTmV3RWxlbWVudChub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBub2RlLmhhc0F0dHJpYnV0ZSgnbmctY2xpY2snKSB8fFxuXHRcdFx0XHRcdG5vZGUuaGFzQXR0cmlidXRlKCdvbmNsaWNrJylcbiAgICAgICAgKSB7XG4gICAgICAgICAgVURBQWRkTmV3RWxlbWVudChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgLy8gZml4IGZvciBlZGl0b3IgaXNzdWVcbiAgICAgIGNhc2UgJ2NrZWRpdG9yJzpcbiAgICAgICAgVURBQWRkTmV3RWxlbWVudChub2RlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkaXYnOlxuICAgICAgICBpZiAobm9kZS5oYXNBdHRyaWJ1dGUoJ25nLWNsaWNrJykgfHwgbm9kZS5oYXNBdHRyaWJ1dGUoJ29uY2xpY2snKSkge1xuICAgICAgICAgIFVEQUFkZE5ld0VsZW1lbnQobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKG5vZGUuY2xhc3NMaXN0ICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdkcm9wZG93bi10b2dnbGUnKSkge1xuICAgIFVEQUFkZE5ld0VsZW1lbnQobm9kZSk7XG4gIH1cblxuICBpZiAobm9kZS5jaGlsZHJlbiAmJiBub2RlPy5jaGlsZHJlbj8ubGVuZ3RoICYmIHByb2Nlc3NjaGlsZHJlbikge1xuICAgIGZvciAoY29uc3QgaSBvZiBBcnJheS5mcm9tKG5vZGU/LmNoaWxkcmVuKSkge1xuICAgICAgVURBUHJvY2Vzc05vZGUoaSBhcyBIVE1MRWxlbWVudCk7XG4gICAgfVxuICB9XG59XG5cbi8vIHJlbW92YWwgb2YgY2xpY2tib2plY3RzIHZpYSBtdXRhdGlvbiBvYnNlcnZlclxuZXhwb3J0IGZ1bmN0aW9uIFVEQVByb2Nlc3NSZW1vdmVkTm9kZShub2RlOiBhbnkpIHtcbiAgbGV0IF9pbmRleCA9IDA7XG4gIGZvciAoY29uc3QgaiBvZiBVREFDbGlja09iamVjdHMpIHtcbiAgICBpZiAobm9kZS5pc0VxdWFsTm9kZShqLmVsZW1lbnQpKSB7XG4gICAgICBsZXQgYWRkdG9yZW1vdmVub2RlcyA9IHRydWU7XG4gICAgICAvLyByZW1vdmVkY2xpY2tvYmplY3Rjb3VudGVyOlxuICAgICAgZm9yIChjb25zdCBrIG9mIFVEQVJlbW92ZWRDbGlja09iamVjdHMpIHtcbiAgICAgICAgaWYgKG5vZGUuaXNFcXVhbE5vZGUoay5lbGVtZW50KSkge1xuICAgICAgICAgIGFkZHRvcmVtb3Zlbm9kZXMgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGFkZHRvcmVtb3Zlbm9kZXMpIHtcbiAgICAgICAgVURBUmVtb3ZlZENsaWNrT2JqZWN0cy5wdXNoKGopO1xuICAgICAgfVxuICAgICAgVURBQ2xpY2tPYmplY3RzLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgX2luZGV4Kys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICBmb3IgKGNvbnN0IGkgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgVURBUHJvY2Vzc1JlbW92ZWROb2RlKGkpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gVURBZGlnZXN0TWVzc2FnZSh0ZXh0bWVzc2FnZTogc3RyaW5nLCBhbGdvcml0aG06IGFueSkge1xuICBjb25zdCBlbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG4gIGNvbnN0IGRhdGEgPSBlbmNvZGVyLmVuY29kZSh0ZXh0bWVzc2FnZSk7XG4gIGNvbnN0IGhhc2ggPSBhd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdChhbGdvcml0aG0sIGRhdGEpO1xuICBjb25zdCBoYXNoQXJyYXkgPSBBcnJheS5mcm9tKG5ldyBVaW50OEFycmF5KGhhc2gpKTsgLy8gY29udmVydCBidWZmZXIgdG8gYnl0ZSBhcnJheVxuICBjb25zdCBoYXNoSGV4ID0gaGFzaEFycmF5XG4gICAgICAubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKVxuICAgICAgLmpvaW4oJycpOyAvLyBjb252ZXJ0IGJ5dGVzIHRvIGhleCBzdHJpbmdcbiAgcmV0dXJuIGhhc2hIZXg7XG59XG5cbmxldCBVREFMYXN0TXV0YXRpb25UaW1lID0gMDtcbi8vIG11dGF0aW9uIG9ic2VydmVyIGluaXRpYWxpemF0aW9uIGFuZCBhZGRpbmcgdGhlIGxvZ2ljIHRvIHByb2Nlc3MgdGhlIGNsaWNrb2JqZWN0c1xuZXhwb3J0IGNvbnN0IERTQV9PQlNFUlZFUiA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKG11dGF0aW9ucykge1xuICAvLyBVREFDb25zb2xlTG9nZ2VyLmluZm8oJy0tLS0tLS0tLS0tLSBkZXRlY3RlZCBjbGlja2VkIG9iamVjdHMtLS0tLS0tLS0tLS0tJyk7XG4gIC8vIFVEQUNvbnNvbGVMb2dnZXIuaW5mbyhVREFDbGlja09iamVjdHMpO1xuICBtdXRhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihtdXRhdGlvbikge1xuICAgIGlmIChtdXRhdGlvbi5yZW1vdmVkTm9kZXMubGVuZ3RoKSB7XG4gICAgICBbXS5zb21lLmNhbGwobXV0YXRpb24ucmVtb3ZlZE5vZGVzLCBVREFQcm9jZXNzUmVtb3ZlZE5vZGUpO1xuICAgIH1cbiAgICBpZiAoIW11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFtdLnNvbWUuY2FsbChtdXRhdGlvbi5hZGRlZE5vZGVzLCBVREFQcm9jZXNzTm9kZSk7XG4gIH0pO1xuICAvLyBVREFDb25zb2xlTG9nZ2VyLmluZm8oJy0tLS0tLS0tLS0tLSByZW1vdmVkIGNsaWNrZWQgb2JqZWN0cy0tLS0tLS0tLS0tLS0nKTtcbiAgLy8gVURBQ29uc29sZUxvZ2dlci5pbmZvKFVEQUNsaWNrT2JqZWN0cyk7XG4gIFVEQUxhc3RNdXRhdGlvblRpbWUgPSBEYXRlLm5vdygpO1xufSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFVEQVVzZXJBdXRoRGF0YSB9IGZyb20gJy4uL21vZHVsZXMvYXV0aERhdGEnO1xyXG5pbXBvcnQge0NPTkZJR30gZnJvbSAnLi4vY29uZmlnJ1xyXG4vKlxyXG5Wb2ljZSBwbHVnaW4gSmF2YXNjcmlwdCBTREsgTGlicmFyeVxyXG5JTVBPUlRBTlQgTk9URTogQ29weWluZyB0aGlzIGxpYnJhcnkgYW5kIGhvc3RpbmcgaXQgbG9jYWxseSBpcyBzdHJvbmdseSBkaXNjb3VyYWdlZC5cclxuICovXHJcbi8vIGNyZWF0aW5nIHRoZSBzZGsgdmFyaWFibGVcclxuaWYgKHR5cGVvZiBVREFQbHVnaW5TREsgPT09ICd1bmRlZmluZWQnKSB7XHJcblx0dmFyIFVEQUJhZEJyb3dzZXI9ZmFsc2U7XHJcblx0aWYobmF2aWdhdG9yLmFwcE5hbWUuaW5kZXhPZihcIkludGVybmV0IEV4cGxvcmVyXCIpICE9PSAtMSl7XHJcblx0XHRVREFCYWRCcm93c2VyPShuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwiTVNJRSAxXCIpID09PSAtMSk7XHJcblx0fVxyXG5cdHZhciBVREFTcGVlY2hSZWNvZ25pdGlvbkF2YWlsYWJsZT1mYWxzZTtcclxuXHRsZXQgVURBVm9pY2VSZWNvZ25pdGlvbjtcclxuXHRcclxuXHRjb25zdCBVREFfUE9TVF9JTlRFUlZBTCA9IENPTkZJRy5VREFfUE9TVF9JTlRFUlZBTDtcclxuXHRsZXQgVURBTGFzdE11dGF0aW9uVGltZSA9IENPTkZJRy5VREFMYXN0TXV0YXRpb25UaW1lO1xyXG5cdC8vIGluaXRpYWxpemluZyB2b2ljZSByZWNvZ25pdGlvbiBsaWJyYXJ5XHJcblx0aWYoIXdpbmRvdy5oYXNPd25Qcm9wZXJ0eShcIndlYmtpdFNwZWVjaFJlY29nbml0aW9uXCIpKXtcclxuXHRcdFVEQVNwZWVjaFJlY29nbml0aW9uQXZhaWxhYmxlPWZhbHNlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRVREFTcGVlY2hSZWNvZ25pdGlvbkF2YWlsYWJsZT10cnVlO1xyXG5cdFx0VURBVm9pY2VSZWNvZ25pdGlvbiA9IHdpbmRvdy53ZWJraXRTcGVlY2hSZWNvZ25pdGlvbjtcclxuXHR9XHJcblxyXG5cdC8vIGxpc3RlbmluZyBmb3IgdXNlciBzZXNzaW9uIGRhdGEgZnJvbSBleHRlbnNpb24gY2FsbFxyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJVREFVc2VyU2Vzc2lvbkRhdGFcIiwgZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0VURBUGx1Z2luU0RLLmNyZWF0ZXNlc3Npb24oSlNPTi5wYXJzZShkYXRhLmRldGFpbC5kYXRhKSk7XHJcblx0fSk7XHJcblxyXG5cdC8vIENsZWFyaW5nIHVzZXIgc2Vzc2lvbiBpbiBjYXNlIGlmIHRoZSBpZCBnZXRzIGNoYW5nZWRcclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiVURBQ2xlYXJTZXNzaW9uRGF0YVwiLCBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFVEQVBsdWdpblNESy5jbGVhclNlc3Npb24oKTtcclxuXHR9KTtcclxuXHJcblx0LyoqXHJcblx0ICogRGlzYWJsaW5nIHJlY29yZCBidXR0b24gd2hlbiB0aGUgYXR0cmlidXRlIGlzIHNldCB0byB0cnVlLlxyXG5cdCAqL1xyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJVREFEaXNhYmxlQnV0dG9uXCIsIGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFVEQVBsdWdpblNESy5kaXNhYmxlUmVjb3JkQnV0dG9uKCk7XHJcblx0fSk7XHJcblxyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJVREFBdXRoZW50aWNhdGVkVXNlclNlc3Npb25EYXRhXCIsIGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFVEQVBsdWdpblNESy5jcmVhdGVzZXNzaW9uKEpTT04ucGFyc2UoZGF0YS5kZXRhaWwuZGF0YSkpO1xyXG5cdFx0VURBUGx1Z2luU0RLLm9wZW5tb2RhbCh0cnVlKTtcclxuXHR9KTtcclxuXHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIlVEQUFsZXJ0TWVzc2FnZURhdGFcIiwgZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0YWxlcnQoSlNPTi5wYXJzZShkYXRhLmRldGFpbC5kYXRhKSk7XHJcblx0fSk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIExvYWQgY3VzdG9tIHRoZW1lIHRvIHBsdWdpblxyXG5cdCAqL1xyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJVREFMb2FkQ3VzdG9tQ1NTXCIsIGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFVEQVBsdWdpblNESy5sb2FkQ3NzU2NyaXB0KFVEQUN1c3RvbUNzcy5zcmMpO1xyXG5cdH0pO1xyXG5cclxuXHRjb25zdCBVREFEZWJ1ZyA9IHt9O1xyXG5cdGxldCBVREFEZWJ1Z1NldEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiVURBRGVidWdTZXRFdmVudFwiLCB7ZGV0YWlsOiB7ZGF0YToge2FjdGlvbjonRGVidWd2YWx1ZXNldCcsdmFsdWU6VURBRGVidWd9fSwgYnViYmxlczogZmFsc2UsIGNhbmNlbGFibGU6IGZhbHNlfSk7XHJcblx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChVREFEZWJ1Z1NldEV2ZW50KTtcclxuXHJcblx0Ly8gaW5pdGlhbGl6aW5nIHRoZSBzZGsgdmFyaWFibGUgbmVlZCB0byBjaGFuZ2UgdG8gYSBuZXcgdmFyaWFibGUgaW4gZnV0dXJlLlxyXG5cdGNvbnN0IFVEQV9BUElfVVJMID0gQ09ORklHLlVEQV9BUElfVVJMLCBVREFMb2dMZXZlbCA9IENPTkZJRy5VREFMb2dMZXZlbCwgaXNVREFBbGxvd2VkID0gMSwgVURBQ2xpY2tPYmplY3RzID0gW107XHJcblx0bGV0IFVEQUxhc3RJbmRleFRpbWUgPSAwO1xyXG5cdGxldCBVREFTZXNzaW9uSUQgPSBudWxsO1xyXG5cclxuXHR2YXIgVURBUGx1Z2luU0RLPXtcclxuXHRcdHNka1VybDogXCIvXCIsXHJcblx0XHRhcGlob3N0OiBVREFfQVBJX1VSTCxcclxuXHRcdHRvdGFsU2NyaXB0czogMCxcclxuXHRcdHNjcmlwdHNDb21wbGV0ZWQ6MCxcclxuXHRcdHRvdGFsb3RoZXJTY3JpcHRzOjAsXHJcblx0XHR0b3RhbG90aGVyU2NyaXB0c0NvbXBsZXRlZDowLFxyXG5cdFx0ZnVuY3Rpb25zVG9SdW5XaGVuUmVhZHk6IFtdLFxyXG5cdFx0anF1ZXJ5cmVhZHk6IGZhbHNlLFxyXG5cdFx0cmVxdWVzdDp7fSxcclxuXHRcdHVzZXJkYXRhOnt9LFxyXG5cdFx0aWdub3JlZWxlbWVudHMgOiBbXCJzY3JpcHRcIixcImgxXCIsXCJoMlwiLFwiaDNcIixcImxpbmtcIixcIm5vc2NyaXB0XCIsXCJzdHlsZVwiXSxcclxuXHRcdGF2YWlsYWJsZW5hdnRhYnMgOiBbXSxcclxuXHRcdGh0bWxpbmRleCA6IFtdLFxyXG5cdFx0dGV4dGZyb21zcGVlY2ggOiBcIlwiLFxyXG5cdFx0bm9kZWlkIDogMCxcclxuXHRcdHNwZWVjaHJlY29nbml0aW9uYXZhaWxhYmxlOiBmYWxzZSxcclxuXHRcdFNwZWVjaFJlY29nbml0aW9uIDogW10sXHJcbiAgICAgICAgcmVjb2duaXRpb24gOiB7fSxcclxuXHRcdHRhcmdldE5vZGUgOiBbXSxcclxuXHRcdHVwZGF0ZXNPY2N1ciA6IHRydWUsXHJcblx0XHR1cGRhdGVjb3VudGVyIDogMCxcclxuXHRcdGxhc3R1cGRhdGVjb3VudGVyIDogMCxcclxuXHRcdG1lbnVpdGVtczogW10sXHJcblx0XHRleHRlbnNpb25wYXRoOmRvY3VtZW50Py5jdXJyZW50U2NyaXB0Py5zcmM/LnRvU3RyaW5nKCk/LnJlcGxhY2UoXCJqcy9Wb2ljZXBsdWdpbnNkay5qc1wiLFwiXCIpLFxyXG5cdFx0aW5kZXhuZXdub2RlczpmYWxzZSxcclxuXHRcdHByZXZpb3VzdXJsOlwiXCIsXHJcblx0XHRjdXJyZW50dXJsOlwiXCIsXHJcblx0XHRzZXNzaW9uSUQ6XCJcIixcclxuXHRcdHNlc3Npb25kYXRhOntzZXNzaW9ua2V5OlwiXCIsYXV0aGVudGljYXRlZDpmYWxzZSxhdXRoZW50aWNhdGlvbnNvdXJjZTpcIlwiLGF1dGhkYXRhOnt9LCBjc3A6IHtjc3BlbmFibGVkOiBmYWxzZSwgdWRhbmFsbG93ZWQ6IHRydWUsIGRvbWFpbjogJyd9fSxcclxuXHRcdGNvb2tpZW5hbWU6XCJuaXN0LXZvaWNlLXVzZXJzZXNzaW9uaWRcIixcclxuXHRcdHJlY29yZGluZ2Nvb2tpZW5hbWU6XCJuaXN0c2VxdWVuY2VcIixcclxuXHRcdHJlY29yZGVkc2VxdWVuY2VpZHM6W10sXHJcblx0XHRyZWNvcmRjbGlja25vZGVjb29raWVuYW1lOlwibmlzdGNsaWNrcmVjb3JkXCIsXHJcblx0XHRjb29raWVleHBpcmVzOjM2NSxcclxuXHRcdGFkZGVkdG9zbGlkaW5nZGl2OmZhbHNlLFxyXG5cdFx0ZWxhc3RpYzp7YXBpdXJsOlwiaHR0cDovL2xvY2FsaG9zdDo5MjAwXCIsaW5kZXhuYW1lOlwibmlzdGFwcFwiLGN1cnJlbnRwYWdlOjAscXVlcnlzdHJpbmc6XCJcIn0sXHJcblx0XHRuYXZpZ2F0aW9uY29va2llbmFtZTpcIm5pc3RuYXZzaG93XCIsXHJcblx0XHRhdXRvcGxheTpmYWxzZSxcclxuXHRcdHByb2Nlc3Njb3VudDowLFxyXG5cdFx0dG90YWxjb3VudDowLFxyXG5cdFx0cmVyZW5kZXJodG1sOnRydWUsXHJcblx0XHRwcm9jZXNzaW5nbm9kZXM6ZmFsc2UsXHJcblx0XHRwcm9jZXNzZWRjbGlja29iamVjdHNjb3VudDowLFxyXG5cdFx0cmVjb3JkaW5nOmZhbHNlLFxyXG5cdFx0YWRkY3VzdG9tY3NzZG9tYWluczpbXCJhcHAudmFudGFnZWNpcmNsZS5jby5pblwiLFwiYXBwLnZhbnRhZ2VjaXJjbGUuY29tXCIsXCJkYXNoYm9hcmQudmFudGFnZWNpcmNsZS5jb21cIixcImRhc2hib2FyZC52YW50YWdlY2lyY2xlLmNvLmluXCJdLFxyXG5cdFx0Y29udGFpbmVyc2VjdGlvbnM6W10sXHJcblx0XHRsYXN0Y2xpY2tlZG5vZGU6JycsXHJcblx0XHRsYXN0Y2xpY2tlZHRpbWU6JycsXHJcblx0XHRtYXhzdHJpbmdsZW5ndGg6NDAsXHJcblx0XHRjb25maXJtZWRub2RlOmZhbHNlLFxyXG5cdFx0aWdub3JlYXR0cmlidXRlczogW1xyXG5cdFx0XHQndHJhbnNsYXRlJywnZHJhZ2dhYmxlJywnc3BlbGxjaGVjaycsJ3RhYmluZGV4JywnY2xpZW50SGVpZ2h0JywnY2xpZW50TGVmdCcsJ2NsaWVudFRvcCcsJ2NsaWVudFdpZHRoJyxcclxuXHRcdFx0J29mZnNldEhlaWdodCcsJ29mZnNldExlZnQnLCdvZmZzZXRUb3AnLCdvZmZzZXRXaWR0aCcsJ3Njcm9sbEhlaWdodCcsJ3Njcm9sbExlZnQnLCdzY3JvbGxUb3AnLCdzY3JvbGxXaWR0aCcsXHJcblx0XHRcdCdiYXNlVVJJJywnaXNDb25uZWN0ZWQnLCdhcmlhUHJlc3NlZCcsICdhcmlhLXByZXNzZWQnLCAnbm9kZVBvc2l0aW9uJywgJ291dGVySFRNTCcsICdpbm5lckhUTUwnLCAnc3R5bGUnLFxyXG5cdFx0XHQnYXJpYS1jb250cm9scycsICdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLCAnYXJpYUV4cGFuZGVkJywgJ2F1dG9jb21wbGV0ZScsICdhcmlhLWV4cGFuZGVkJywgJ2FyaWEtb3ducycsICdmb3JtQWN0aW9uJyxcclxuXHRcdFx0J25nLXN0YXItaW5zZXJ0ZWQnLCAnbmctc3RhcicsICdhcmlhLWRlc2NyaWJlZGJ5JywgJ3dpZHRoJywgJ2hlaWdodCcsICd4JywgJ3knLCAnc2VsZWN0aW9uU3RhcnQnLCAnc2VsZWN0aW9uRW5kJywgJ3JlcXVpcmVkJywgJ3ZhbGlkYXRpb25NZXNzYWdlJywgJ3NlbGVjdGlvbkRpcmVjdGlvbicsXHJcblx0XHRcdCduYXR1cmFsV2lkdGgnLCAnbmF0dXJhbEhlaWdodCcsICdjb21wbGV0ZScsICdfaW5kZXhPZicsICd2YWx1ZScsICdkZWZhdWx0VmFsdWUnLCAnbWluJywgJ21heCcsICdub2RlSW5mbydcclxuXHRcdF0sXHJcblx0XHRpbm5lclRleHRXZWlnaHQ6IDUsXHJcblx0XHRsb2dMZXZlbDogVURBTG9nTGV2ZWwsXHJcblx0XHRwbGF5TmV4dEFjdGlvbjogdHJ1ZSxcclxuXHRcdGZvcmNlUmVpbmRleDogZmFsc2UsXHJcblx0XHRzZWFyY2hUZXh0OiBudWxsLFxyXG5cdFx0c2VhcmNoSW5Qcm9ncmVzczogZmFsc2UsXHJcblx0XHRpZ25vcmVOb2Rlc0Zyb21JbmRleGluZzogWyduZy1kcm9wZG93bi1wYW5lbCcsJ2NrZWRpdG9yJywnZnVzaW9uY2hhcnRzJywnbmdiLWRhdGVwaWNrZXInLCduZ3gtZGF0ZXJhbmdlcGlja2VyLW1hdGVyaWFsJywndWRhLXBhbmVsJywnbWF0LWRhdGVwaWNrZXItY29udGVudCcsJ25nLXNlbGVjdCddLFxyXG5cdFx0aWdub3JlTm9kZXNDb250YWluaW5nQ2xhc3NOYW1lczpbJ2NrZV9kaWFsb2dfY29udGFpbmVyJywnY2tlX25vdGlmaWNhdGlvbnNfYXJlYScsJ2dsZHAtZGVmYXVsdCcsJ2Fqcy1sYXllcicsJ2F1aS1saXN0JywnaGVya25sJ10sXHJcblx0XHRjYW5jZWxSZWNvcmRpbmdEdXJpbmdSZWNvcmRpbmdOb2RlczogW10sXHJcblx0XHRhZGRDbGlja1RvU3BlY2lhbE5vZGVzOiBbJ25nLXNlbGVjdCcsICduZ2ItZGF0ZXBpY2tlciddLFxyXG5cdFx0aWdub3JlQ2xpY2tzT25TcGVjaWFsTm9kZXM6IFsnbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbCddLFxyXG5cdFx0Y3VzdG9tTmFtZUZvclNwZWNpYWxOb2RlczogeyduZ2ItZGF0ZXBpY2tlcic6ICdEYXRlIHNlbGVjdG9yJywnbWF0LWRhdGVwaWNrZXItY29udGVudCc6ICdEYXRlIHNlbGVjdG9yJywgJ25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwnOiAnRGF0ZSBSYW5nZSBTZWxlY3Rvcid9LFxyXG5cdFx0c3BlY2lhbElucHV0Q2xpY2tDbGFzc05hbWVzOiBbJ2doeC1kcm9wZG93bi10cmlnZ2VyJywnYXVpLWxpc3QnXSxcclxuXHRcdHRvb2x0aXBEaXNwbGF5ZWROb2RlczogW10sXHJcblx0XHQvLyByZXBsYXkgdmFyaWFibGVzXHJcblx0XHRhdXRvcGxheUNvbXBsZXRlZDogZmFsc2UsXHJcblx0XHRhdXRvcGxheVBhdXNlZDogZmFsc2UsXHJcblx0XHQvLyBtYW51YWwgY2xpY2sgdmFyaWFibGVzXHJcblx0XHRpbnZva2VkQWN0aW9uTWFudWFsbHk6IGZhbHNlLFxyXG5cdFx0Ly8gcGVyc29uYWwgbm9kZSBpZ25vcmUgYXR0cmlidXRlc1xyXG5cdFx0cGVyc29uYWxOb2RlSWdub3JlQXR0cmlidXRlczogW1xyXG5cdFx0XHQnaW5uZXJUZXh0JywgJ2lubmVySFRNTCcsICdvdXRlclRleHQnLCAnb3V0ZXJIVE1MJywgJ25vZGVWYWx1ZScsICdzcmMnLCAnbmF0dXJhbFdpZHRoJywgJ25hdHVyYWxIZWlnaHQnLCAnY3VycmVudFNyYydcclxuXHRcdF0sXHJcblx0XHRjbGlja2VPbjogJycsXHJcblx0XHRpbnZva2luZ25vZGU6IG51bGwsXHJcblx0XHRjdXJyZW50UGFnZTonc2VhcmNoJyxcclxuXHRcdG5hdmlnYXRlZFRvTmV4dFBhZ2U6IHtjaGVjazogZmFsc2UsIHVybDogJyd9LFxyXG5cdFx0cG9wcGVySW5zdGFuY2U6IG51bGwsXHJcblx0XHQvL0F6dXJlIGNvbnRlbnQgbW9kZXJhdG9yIGF0dHJpYnV0ZXNcclxuXHRcdHByb2Zhbml0eToge1xyXG5cdFx0XHRlbmFibGVkOiB0cnVlLFxyXG5cdFx0XHRwcm92aWRlcjogJ2F6dXJlJyxcclxuXHRcdFx0Y29uZmlnOiB7XHJcblx0XHRcdFx0a2V5MTogJycsXHJcblx0XHRcdFx0a2V5MjogJycsXHJcblx0XHRcdFx0ZW5kUG9pbnQ6ICdodHRwczovL25pc3RhcHAtY29udGVudC1tb2RlcmF0b3IuY29nbml0aXZlc2VydmljZXMuYXp1cmUuY29tL2NvbnRlbnRtb2RlcmF0b3IvbW9kZXJhdGUvdjEuMC9Qcm9jZXNzVGV4dC9TY3JlZW4nLFxyXG5cdFx0XHRcdHJlZ2lvbjogJ2Vhc3R1cydcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuICAgICAgICBtdWx0aWxpbmd1YWw6IHtcclxuXHRcdFx0ZW5hYmxlZDogdHJ1ZSxcclxuXHRcdCAgICBzZWFyY2hJbkxhbmc6ICdlbi1VUycsXHJcbiAgICAgICAgICAgIHNlbGVjdGVkTGFuZzogJ2VuLVVTJyxcclxuICAgICAgICAgICAgZGlzcGxheVRleHQ6ICcnLFxyXG4gICAgICAgICAgICB0cmFuc2xhdGVkVGV4dDogJycsXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZToge1xyXG5cdFx0ICAgICAgICBwcm92aWRlcjogJ2dvb2dsZScsXHJcbiAgICAgICAgICAgICAgICBhcGlrZXk6ICcnLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlVG86ICdlbicsXHJcbiAgICAgICAgICAgICAgICBhcGl1cmw6ICdodHRwczovL3RyYW5zbGF0aW9uLmdvb2dsZWFwaXMuY29tL2xhbmd1YWdlL3RyYW5zbGF0ZS92MidcclxuXHRcdCAgICB9XHJcbiAgICAgICAgfSxcclxuXHRcdHNldCBlbmFibGVNdWx0aWxpbmd1YWwodmFsKXtcclxuXHRcdFx0dGhpcy5tdWx0aWxpbmd1YWwuZW5hYmxlZCA9IHZhbDtcclxuXHRcdFx0dGhpcy5zaG93aHRtbCgpO1xyXG5cdFx0fSxcclxuXHRcdGdldCBlbmFibGVNdWx0aWxpbmd1YWwoKSB7XHJcblx0XHRcdHJldHVybiBVREFQbHVnaW5TREsubXVsdGlsaW5ndWFsLmVuYWJsZWQ7XHJcblx0XHR9LFxyXG5cdFx0Ly8gQkNQIGxpc3Qgb2YgbGFuZ3VhZ2VzXHJcblx0XHRiY3BsYW5nIDpcclxuXHRcdFx0W1xyXG5cdFx0XHRcdFsnQWZyaWthYW5zJywgICAgICAgWydhZi1aQSddXSxcclxuXHRcdFx0XHRbJ+GKoOGIm+GIreGKmycsICAgICAgICAgICBbJ2FtLUVUJ11dLFxyXG5cdFx0XHRcdFsnQXrJmXJiYXljYW5jYScsICAgIFsnYXotQVonXV0sXHJcblx0XHRcdFx0Wyfgpqzgpr7gpoLgprLgpr4nLCAgICAgICAgICAgIFsnYm4tQkQnLCAn4Kas4Ka+4KaC4Kay4Ka+4Kam4KeH4Ka2J10sIFsnYm4tSU4nLCAn4Kat4Ka+4Kaw4KakJ11dLFxyXG5cdFx0XHRcdFsnQmFoYXNhIEluZG9uZXNpYScsWydpZC1JRCddXSxcclxuXHRcdFx0XHRbJ0JhaGFzYSBNZWxheXUnLCAgIFsnbXMtTVknXV0sXHJcblx0XHRcdFx0WydDYXRhbMOgJywgICAgICAgICAgWydjYS1FUyddXSxcclxuXHRcdFx0XHRbJ8SMZcWhdGluYScsICAgICAgICAgWydjcy1DWiddXSxcclxuXHRcdFx0XHRbJ0RhbnNrJywgICAgICAgICAgIFsnZGEtREsnXV0sXHJcblx0XHRcdFx0WydEZXV0c2NoJywgICAgICAgICBbJ2RlLURFJ11dLFxyXG5cdFx0XHRcdFsnRW5nbGlzaCcsICAgICAgICAgWydlbi1BVScsICdBdXN0cmFsaWEnXSwgWydlbi1DQScsICdDYW5hZGEnXSwgWydlbi1JTicsICdJbmRpYSddLCBbJ2VuLUtFJywgJ0tlbnlhJ10sIFsnZW4tVFonLCAnVGFuemFuaWEnXSwgWydlbi1HSCcsICdHaGFuYSddLCBbJ2VuLU5aJywgJ05ldyBaZWFsYW5kJ10sIFsnZW4tTkcnLCAnTmlnZXJpYSddLCBbJ2VuLVpBJywgJ1NvdXRoIEFmcmljYSddLCBbJ2VuLVBIJywgJ1BoaWxpcHBpbmVzJ10sIFsnZW4tR0InLCAnVW5pdGVkIEtpbmdkb20nXSwgWydlbi1VUycsICdVbml0ZWQgU3RhdGVzJ11dLFxyXG5cdFx0XHRcdFsnRXNwYcOxb2wnLCAgICAgICAgIFsnZXMtQVInLCAnQXJnZW50aW5hJ10sIFsnZXMtQk8nLCAnQm9saXZpYSddLCBbJ2VzLUNMJywgJ0NoaWxlJ10sIFsnZXMtQ08nLCAnQ29sb21iaWEnXSwgWydlcy1DUicsICdDb3N0YSBSaWNhJ10sIFsnZXMtRUMnLCAnRWN1YWRvciddLCBbJ2VzLVNWJywgJ0VsIFNhbHZhZG9yJ10sIFsnZXMtRVMnLCAnRXNwYcOxYSddLCBbJ2VzLVVTJywgJ0VzdGFkb3MgVW5pZG9zJ10sIFsnZXMtR1QnLCAnR3VhdGVtYWxhJ10sIFsnZXMtSE4nLCAnSG9uZHVyYXMnXSwgWydlcy1NWCcsICdNw6l4aWNvJ10sIFsnZXMtTkknLCAnTmljYXJhZ3VhJ10sIFsnZXMtUEEnLCAnUGFuYW3DoSddLCBbJ2VzLVBZJywgJ1BhcmFndWF5J10sIFsnZXMtUEUnLCAnUGVyw7onXSwgWydlcy1QUicsICdQdWVydG8gUmljbyddLCBbJ2VzLURPJywgJ1JlcMO6YmxpY2EgRG9taW5pY2FuYSddLCBbJ2VzLVVZJywgJ1VydWd1YXknXSwgWydlcy1WRScsICdWZW5lenVlbGEnXV0sXHJcblx0XHRcdFx0WydFdXNrYXJhJywgICAgICAgICBbJ2V1LUVTJ11dLFxyXG5cdFx0XHRcdFsnRmlsaXBpbm8nLCAgICAgICAgWydmaWwtUEgnXV0sXHJcblx0XHRcdFx0WydGcmFuw6dhaXMnLCAgICAgICAgWydmci1GUiddXSxcclxuXHRcdFx0XHRbJ0Jhc2EgSmF3YScsICAgICAgIFsnanYtSUQnXV0sXHJcblx0XHRcdFx0WydHYWxlZ28nLCAgICAgICAgICBbJ2dsLUVTJ11dLFxyXG5cdFx0XHRcdFsn4KqX4KuB4Kqc4Kqw4Kq+4Kqk4KuAJywgICAgICAgICAgIFsnZ3UtSU4nXV0sXHJcblx0XHRcdFx0WydIcnZhdHNraScsICAgICAgICBbJ2hyLUhSJ11dLFxyXG5cdFx0XHRcdFsnSXNpWnVsdScsICAgICAgICAgWyd6dS1aQSddXSxcclxuXHRcdFx0XHRbJ8ONc2xlbnNrYScsICAgICAgICBbJ2lzLUlTJ11dLFxyXG5cdFx0XHRcdFsnSXRhbGlhbm8nLCAgICAgICAgWydpdC1JVCcsICdJdGFsaWEnXSwgWydpdC1DSCcsICdTdml6emVyYSddXSxcclxuXHRcdFx0XHRbJ+CyleCyqOCzjeCyqOCyoScsICAgICAgICAgICAgIFsna24tSU4nXV0sXHJcblx0XHRcdFx0Wyfhnpfhnrbhnp/hnrbhnoHhn5Lhnpjhn4LhnponLCAgICAgICAgICBbJ2ttLUtIJ11dLFxyXG5cdFx0XHRcdFsnTGF0dmllxaF1JywgICAgICAgIFsnbHYtTFYnXV0sXHJcblx0XHRcdFx0WydMaWV0dXZpxbMnLCAgICAgICAgWydsdC1MVCddXSxcclxuXHRcdFx0XHRbJ+C0ruC0suC0r+C0vuC0s+C0gicsICAgICAgICAgIFsnbWwtSU4nXV0sXHJcblx0XHRcdFx0WyfgpK7gpLDgpL7gpKDgpYAnLCAgICAgICAgICAgICBbJ21yLUlOJ11dLFxyXG5cdFx0XHRcdFsnTWFneWFyJywgICAgICAgICAgWydodS1IVSddXSxcclxuXHRcdFx0XHRbJ+C6peC6suC6pycsICAgICAgICAgICAgICBbJ2xvLUxBJ11dLFxyXG5cdFx0XHRcdFsnTmVkZXJsYW5kcycsICAgICAgWydubC1OTCddXSxcclxuXHRcdFx0XHRbJ+CkqOClh+CkquCkvuCksuClgCDgpK3gpL7gpLfgpL4nLCAgICAgICAgWyduZS1OUCddXSxcclxuXHRcdFx0XHRbJ05vcnNrIGJva23DpWwnLCAgICBbJ25iLU5PJ11dLFxyXG5cdFx0XHRcdFsnUG9sc2tpJywgICAgICAgICAgWydwbC1QTCddXSxcclxuXHRcdFx0XHRbJ1BvcnR1Z3XDqnMnLCAgICAgICBbJ3B0LUJSJywgJ0JyYXNpbCddLCBbJ3B0LVBUJywgJ1BvcnR1Z2FsJ11dLFxyXG5cdFx0XHRcdFsnUm9tw6JuxIMnLCAgICAgICAgICBbJ3JvLVJPJ11dLFxyXG5cdFx0XHRcdFsn4LeD4LeS4LaC4LeE4La9JywgICAgICAgICAgWydzaS1MSyddXSxcclxuXHRcdFx0XHRbJ1Nsb3ZlbsWhxI1pbmEnLCAgICAgWydzbC1TSSddXSxcclxuXHRcdFx0XHRbJ0Jhc2EgU3VuZGEnLCAgICAgIFsnc3UtSUQnXV0sXHJcblx0XHRcdFx0WydTbG92ZW7EjWluYScsICAgICAgWydzay1TSyddXSxcclxuXHRcdFx0XHRbJ1N1b21pJywgICAgICAgICAgIFsnZmktRkknXV0sXHJcblx0XHRcdFx0WydTdmVuc2thJywgICAgICAgICBbJ3N2LVNFJ11dLFxyXG5cdFx0XHRcdFsnS2lzd2FoaWxpJywgICAgICAgWydzdy1UWicsICdUYW56YW5pYSddLCBbJ3N3LUtFJywgJ0tlbnlhJ11dLFxyXG5cdFx0XHRcdFsn4YOl4YOQ4YOg4YOX4YOj4YOa4YOYJywgICAgICAgWydrYS1HRSddXSxcclxuXHRcdFx0XHRbJ9WA1aHVtdWl1oDVpdW2JywgICAgICAgICAgWydoeS1BTSddXSxcclxuXHRcdFx0XHRbJ+CupOCuruCuv+CutOCvjScsICAgICAgICAgICAgWyd0YS1JTicsICfgrofgrqjgr43grqTgrr/grq/grr4nXSwgWyd0YS1TRycsICfgrprgrr/grpngr43grpXgrqrgr43grqrgr4LgrrDgr40nXSwgWyd0YS1MSycsICfgrofgrrLgrpngr43grpXgr4gnXSwgWyd0YS1NWScsICfgrq7grrLgr4fgrprgrr/grq/grr4nXV0sXHJcblx0XHRcdFx0WyfgsKTgsYbgsLLgsYHgsJfgsYEnLCAgICAgICAgICAgWyd0ZS1JTiddXSxcclxuXHRcdFx0XHRbJ1Rp4bq/bmcgVmnhu4d0JywgICAgICBbJ3ZpLVZOJ11dLFxyXG5cdFx0XHRcdFsnVMO8cmvDp2UnLCAgICAgICAgICBbJ3RyLVRSJ11dLFxyXG5cdFx0XHRcdFsn2KfZj9ix2K/Zj9mIJywgICAgICAgICAgICBbJ3VyLVBLJywgJ9m+2Kfaqdiz2KrYp9mGJ10sIFsndXItSU4nLCAn2Kjavtin2LHYqiddXSxcclxuXHRcdFx0XHRbJ86VzrvOu863zr3Ouc66zqwnLCAgICAgICAgIFsnZWwtR1InXV0sXHJcblx0XHRcdFx0WyfQsdGK0LvQs9Cw0YDRgdC60LgnLCAgICAgICAgIFsnYmctQkcnXV0sXHJcblx0XHRcdFx0WydQ0YPRgdGB0LrQuNC5JywgICAgICAgICAgWydydS1SVSddXSxcclxuXHRcdFx0XHRbJ9Ch0YDQv9GB0LrQuCcsICAgICAgICAgICBbJ3NyLVJTJ11dLFxyXG5cdFx0XHRcdFsn0KPQutGA0LDRl9C90YHRjNC60LAnLCAgICAgICAgWyd1ay1VQSddXSxcclxuXHRcdFx0XHRbJ+2VnOq1reyWtCcsICAgICAgICAgICAgWydrby1LUiddXSxcclxuXHRcdFx0XHRbJ+S4reaWhycsICAgICAgICAgICAgIFsnY21uLUhhbnMtQ04nLCAn5pmu6YCa6K+dICjkuK3lm73lpKfpmYYpJ10sIFsnY21uLUhhbnMtSEsnLCAn5pmu6YCa6K+dICjpppnmuK8pJ10sIFsnY21uLUhhbnQtVFcnLCAn5Lit5paHICjlj7DngaMpJ10sIFsneXVlLUhhbnQtSEsnLCAn57K16KqeICjpppnmuK8pJ11dLFxyXG5cdFx0XHRcdFsn5pel5pys6KqeJywgICAgICAgICAgIFsnamEtSlAnXV0sXHJcblx0XHRcdFx0WyfgpLngpL/gpKjgpY3gpKbgpYAnLCAgICAgICAgICAgICBbJ2hpLUlOJ11dLFxyXG5cdFx0XHRcdFsn4Lig4Liy4Lip4Liy4LmE4LiX4LiiJywgICAgICAgICBbJ3RoLVRIJ11dXHJcblx0XHRcdF0sXHJcblx0XHQvLyBGbGFnIHRvIGVuYWJsZSBub2RlIHR5cGUgZGV0ZWN0aW9uXHJcblx0XHRlbmFibGVOb2RlVHlwZUNoYW5nZVNlbGVjdGlvbjogZmFsc2UsXHJcblx0XHRzZXQgZW5hYmxlTm9kZVR5cGVTZWxlY3Rpb24odmFsKXtcclxuXHRcdFx0dGhpcy5lbmFibGVOb2RlVHlwZUNoYW5nZVNlbGVjdGlvbiA9IHZhbDtcclxuXHRcdFx0dGhpcy5zaG93aHRtbCgpO1xyXG5cdFx0fSxcclxuXHRcdGdldCBlbmFibGVOb2RlVHlwZVNlbGVjdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIFVEQVBsdWdpblNESy5tdWx0aWxpbmd1YWwuZW5hYmxlZDtcclxuXHRcdH0sXHJcblx0XHRjc3BVc2VyQWNjZXB0YW5jZToge3N0b3JhZ2VOYW1lOiAndWRhLWNzcC11c2VyLWNvbnNlbnQnLGRhdGE6e3Byb2NlZWQ6IHRydWV9fSxcclxuXHRcdHNjcmVlbkFjY2VwdGFuY2U6IHsgc3RvcmFnZU5hbWU6ICd1ZGEtdXNlci1zY3JlZW4tY29uc2VudCcsIGRhdGE6IHsgcHJvY2VlZDogdHJ1ZSB9IH0sXHJcblx0XHRcdFx0Ly8gY29uc3RydWN0b3IgZm9yIHRoZSBzZGsgY2xhc3Mgd2hpY2ggd2lsbCBiZSBpbml0aWFsaXplZCBvbiBsb2FkaW5nIG9mIHRoZSB2YXJpYWJsZS5cclxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0aWYoIXRoaXMuY2hlY2tCcm93c2VyKCkpe1xyXG5cdFx0XHRcdC8vLy9VREFDb25zb2xlTG9nZ2VyLmluZm8oJ1VEQSBwYW5lbCBub3QgYWRkZWQnKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGxvYWRpbmcganF1ZXJ5IGlmIG5vdCBhdmFpbGFibGVcclxuXHRcdFx0aWYodHlwZW9mIGpRdWVyeSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRcdC8vIGxvYWRpbmcganF1ZXJ5IGZyb20gaW5zdGFsbGVkIGV4dGVuc2lvbiBwYXRoXHJcblx0XHRcdFx0dGhpcy5sb2FkU2NyaXB0KHRoaXMuZXh0ZW5zaW9ucGF0aCtcImpzL2pxdWVyeS0zLjQuMS5taW4uanNcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gbG9hZCBvdGhlciBzY3JpcHRzIGlmIGpxdWVyeSBhdmFpbGFibGVcclxuXHRcdFx0XHR0aGlzLmpxdWVyeXJlYWR5PXRydWU7XHJcblx0XHRcdFx0dGhpcy5vdGhlcnNjcmlwdHMoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGluQXJyYXk6ZnVuY3Rpb24odmFsdWUsIG9iamVjdCl7XHJcblx0XHRcdHJldHVybiBqUXVlcnkuaW5BcnJheSh2YWx1ZSwgb2JqZWN0KTtcclxuXHRcdH0sXHJcblx0XHQvLyBjaGVjayBicm93c2VyIGFuZCBhbGxvdyBvbmx5IGZvciBjaHJvbWVcclxuXHRcdGNoZWNrQnJvd3NlcjogZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoaXNVREFBbGxvd2VkIDwgMCl7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vYWRkaW5nIHJlcXVpcmVkIHNjcmlwdCBmdW5jdGlvbmFsaXR5IHRvIHRoZSBoZWFkIG9mIHRoZSBwYWdlLlxyXG5cdFx0bG9hZFNjcmlwdDogZnVuY3Rpb24odXJsKSB7XHJcblxyXG5cdFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuXHRcdFx0c2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xyXG5cclxuXHRcdFx0aWYgKHNjcmlwdC5yZWFkeVN0YXRlKXtcclxuXHRcdFx0XHRzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdGlmIChzY3JpcHQucmVhZHlTdGF0ZSA9PT0gXCJsb2FkZWRcIiB8fCBzY3JpcHQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKXtcclxuXHRcdFx0XHRcdFx0c2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XHJcblx0XHRcdFx0XHRcdFVEQVBsdWdpblNESy5zY3JpcHRzQ29tcGxldGVkKys7XHJcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgalF1ZXJ5ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuanF1ZXJ5cmVhZHk9dHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRVREFQbHVnaW5TREsub3RoZXJzY3JpcHRzKCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0VURBUGx1Z2luU0RLLnNjcmlwdHNDb21wbGV0ZWQrKztcclxuXHRcdFx0XHRcdGlmICh0eXBlb2YgalF1ZXJ5ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmpxdWVyeXJlYWR5PXRydWU7XHJcblx0XHRcdFx0XHRcdGlmKHRoaXMucmVhZHkgIT09IHRydWUpe1xyXG5cdFx0XHRcdFx0XHRcdFVEQVBsdWdpblNESy5vdGhlcnNjcmlwdHMoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNjcmlwdC5zcmMgPSB1cmw7XHJcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG5cdFx0fSxcclxuXHRcdGxvYWRPdGhlclNjcmlwdDogZnVuY3Rpb24odXJsKSB7XHJcblx0XHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG5cdFx0XHRzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XHJcblx0XHRcdHNjcmlwdC5zcmMgPSB1cmw7XHJcblx0XHRcdGlmIChzY3JpcHQucmVhZHlTdGF0ZSl7XHJcblx0XHRcdFx0c2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRpZiAoc2NyaXB0LnJlYWR5U3RhdGUgPT09IFwibG9hZGVkXCIgfHwgc2NyaXB0LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIil7XHJcblx0XHRcdFx0XHRcdHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRVREFQbHVnaW5TREsudG90YWxvdGhlclNjcmlwdHNDb21wbGV0ZWQrKztcclxuXHRcdFx0XHRcdFx0aWYgKFVEQVBsdWdpblNESy50b3RhbG90aGVyU2NyaXB0c0NvbXBsZXRlZCA9PT0gVURBUGx1Z2luU0RLLnRvdGFsb3RoZXJTY3JpcHRzKSB7XHJcblx0XHRcdFx0XHRcdFx0VURBUGx1Z2luU0RLLmFsbFJlYWR5KCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0VURBUGx1Z2luU0RLLnRvdGFsb3RoZXJTY3JpcHRzQ29tcGxldGVkKys7XHJcblx0XHRcdFx0XHRpZiAoVURBUGx1Z2luU0RLLnRvdGFsb3RoZXJTY3JpcHRzQ29tcGxldGVkID09PSBVREFQbHVnaW5TREsudG90YWxvdGhlclNjcmlwdHMpIHtcclxuXHRcdFx0XHRcdFx0VURBUGx1Z2luU0RLLmFsbFJlYWR5KCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcblx0XHR9LFxyXG5cdFx0bG9hZENzc1NjcmlwdDogZnVuY3Rpb24odXJsKSB7XHJcblx0XHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcclxuXHRcdFx0c2NyaXB0LnJlbD1cInN0eWxlc2hlZXRcIjtcclxuXHRcdFx0c2NyaXB0LnR5cGUgPSBcInRleHQvY3NzXCI7XHJcblx0XHRcdHNjcmlwdC5ocmVmID0gdXJsO1xyXG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuXHRcdH0sXHJcblx0XHRvdGhlcnNjcmlwdHM6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHRoaXMudG90YWxvdGhlclNjcmlwdHM9MTtcclxuXHRcdFx0dGhpcy5sb2FkQ3NzU2NyaXB0KHRoaXMuZXh0ZW5zaW9ucGF0aCtcImNzcy91ZGEtdjEuY3NzXCIpO1xyXG5cclxuXHRcdFx0dGhpcy5sb2FkT3RoZXJTY3JpcHQodGhpcy5leHRlbnNpb25wYXRoK1wianMvZG9tSlNPTi5qc1wiKTtcclxuXHRcdFx0Ly8gdG9kbyBtYWtlIGNzcyBsb2FkaW5nIGR5bmFtaWMgYmFzZWQgb24gY3NzIGZpbGUgYXZhaWxhYmlsaXR5XHJcblx0XHRcdGlmKHRoaXMuaW5BcnJheSh3aW5kb3cubG9jYXRpb24uaG9zdCx0aGlzLmFkZGN1c3RvbWNzc2RvbWFpbnMpICE9PSAtMSl7XHJcblx0XHRcdFx0dGhpcy5sb2FkQ3NzU2NyaXB0KHRoaXMuZXh0ZW5zaW9ucGF0aCtcImNzcy9cIit3aW5kb3cubG9jYXRpb24uaG9zdCtcIi5jc3NcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYod2luZG93LmxvY2F0aW9uLmhvc3QgPT09ICdsb2NhbGhvc3Q6NDIwMCcgJiYgd2luZG93LmxvY2F0aW9uLnBhdGggJiYgd2luZG93LmxvY2F0aW9uLnBhdGguaW5jbHVkZXMoJ3BvcnRhbCcpKXtcclxuXHRcdFx0XHR0aGlzLmxvYWRDc3NTY3JpcHQodGhpcy5leHRlbnNpb25wYXRoK1wiY3NzL2Rhc2hib2FyZC52YW50YWdlY2lyY2xlLmNvbS5jc3NcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYod2luZG93LmxvY2F0aW9uLmhvc3QuaW5jbHVkZXMoJ3ZhbnRhZ2VjaXJjbGUnKSl7XHJcblx0XHRcdFx0aWYod2luZG93LmxvY2F0aW9uLnBhdGggJiYgd2luZG93LmxvY2F0aW9uLnBhdGguaW5jbHVkZXMoJ3BvcnRhbCcpKSB7XHJcblx0XHRcdFx0XHR0aGlzLmxvYWRDc3NTY3JpcHQodGhpcy5leHRlbnNpb25wYXRoICsgXCJjc3MvZGFzaGJvYXJkLnZhbnRhZ2VjaXJjbGUuY29tLmNzc1wiKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5sb2FkQ3NzU2NyaXB0KHRoaXMuZXh0ZW5zaW9ucGF0aCArIFwiY3NzL2FwcC52YW50YWdlY2lyY2xlLmNvbS5jc3NcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMubG9hZENzc1NjcmlwdCh0aGlzLmV4dGVuc2lvbnBhdGgrXCJjc3MvXCIrd2luZG93LmxvY2F0aW9uLmhvc3QrXCIuY3NzXCIpO1xyXG5cdFx0XHQvKlxyXG5cdFx0XHQqIFBvcHBlciBzY3JpcHQgaW5qZWN0aW9uIHRvIHRoZSBwYWdlLlxyXG5cdFx0XHQqIEZvcmNpbmcgdGhlIHBvcHBlciBleHRlbnNpb24gdG8gYmUgdmVyc2lvbiAyIGV2ZW4gaWYgcG9wcGVyIG9mIHZlcnNpb24gMSBleGlzdHNcclxuXHRcdFx0KiAqL1xyXG5cdFx0XHRpZih0eXBlb2YgUG9wcGVyID09PSAndW5kZWZpbmVkJyl7XHJcblx0XHRcdFx0dGhpcy50b3RhbG90aGVyU2NyaXB0cysrO1xyXG5cdFx0XHRcdHRoaXMubG9hZE90aGVyU2NyaXB0KHRoaXMuZXh0ZW5zaW9ucGF0aCtcImpzL3BvcHBlci5taW4uanNcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy50b3RhbG90aGVyU2NyaXB0cysrO1xyXG5cdFx0XHRcdHRoaXMubG9hZE90aGVyU2NyaXB0KHRoaXMuZXh0ZW5zaW9ucGF0aCtcImpzL3BvcHBlci5taW4uanNcIik7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRhbGxSZWFkeTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIGV4ZWN1dGUgdGhlIHBhcnNpbmcgbWV0aG9kIGFmdGVyIGV2ZXJ5dGhpbmcgaXMgcmVhZHkuXHJcblx0XHRcdHRoaXMub25SZWFkeSgpO1xyXG5cdFx0fSxcclxuXHRcdG9uUmVhZHk6IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdC8vIGNoZWNrIHVzZXIgc2Vzc2lvbiBleGlzdHMgYW5kIGNyZWF0ZSBpZiBub3QgYXZhaWxhYmxlXHJcblx0XHRcdGlmKHR5cGVvZiBpc1VEQVNkayA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHR0aGlzLmNoZWNrdXNlcmtleWV4aXN0cygpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBhZGRpbmcgc3BlZWNoIHJlY29nbml0aW9uIGZ1bmN0aW9uYWxpdHkgYmFzZWQgb24gdGhlIGxpYnJhcnkgYXZhaWxhYmlsaXR5XHJcblx0XHRcdGlmKFVEQVNwZWVjaFJlY29nbml0aW9uQXZhaWxhYmxlKXtcclxuXHRcdFx0XHR0aGlzLnJlY29nbml0aW9uID0gbmV3IFVEQVZvaWNlUmVjb2duaXRpb24oKTtcclxuXHRcdFx0XHQvLyBzZXR0aW5nIHVwIHRoZSBsYW5ndWFnZVxyXG5cdFx0XHRcdHRoaXMucmVjb2duaXRpb24ubGFuZyA9IHRoaXMubXVsdGlsaW5ndWFsLnNlbGVjdGVkTGFuZztcclxuXHRcdFx0XHR0aGlzLnNwZWVjaHJlY29nbml0aW9uYXZhaWxhYmxlID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0dGhpcy5yZWNvZ25pdGlvbi5vbnN0YXJ0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR0ZXh0ZnJvbXNwZWVjaCA9IFwiXCI7XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0dGhpcy5yZWNvZ25pdGlvbi5vbnNwZWVjaGVuZCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHR0aGlzLnJlY29nbml0aW9uLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRcdFx0aWYoZXZlbnQuZXJyb3IgPT09ICduby1zcGVlY2gnKSB7XHJcblx0XHRcdFx0XHRcdGFsZXJ0KCdObyBzcGVlY2ggd2FzIGRldGVjdGVkLiBUcnkgYWdhaW4uJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0dGhpcy5yZWNvZ25pdGlvbi5vbnJlc3VsdCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoZXZlbnQucmVzdWx0cy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdHZhciBjdXJyZW50ID0gZXZlbnQucmVzdWx0SW5kZXg7XHJcblx0XHRcdFx0XHRcdC8vIEdldCBhIHRyYW5zY3JpcHQgb2Ygd2hhdCB3YXMgc2FpZC5cclxuXHRcdFx0XHRcdFx0dmFyIHRyYW5zY3JpcHQgPSBldmVudC5yZXN1bHRzW2N1cnJlbnRdWzBdLnRyYW5zY3JpcHQ7XHJcblx0XHRcdFx0XHRcdGpRdWVyeShcIiN1ZGEtc2VhcmNoLWlucHV0XCIpLnZhbCh0cmFuc2NyaXB0KTtcclxuXHRcdFx0XHRcdFx0VURBUGx1Z2luU0RLLnNlYXJjaGluZWxhc3RpYygpO1xyXG5cdFx0XHRcdFx0XHRVREFQbHVnaW5TREsucmVjb2duaXRpb24uc3RvcCgpO1xyXG5cdFx0XHRcdFx0XHRqUXVlcnkoXCIjdWRhLXZvaWNlLWljb24tc3RvcFwiKS5oaWRlKCk7XHJcblx0XHRcdFx0XHRcdGpRdWVyeShcIiN1ZGEtdm9pY2UtaWNvbi1zdGFydFwiKS5zaG93KCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly9jaGVjayBmb3IgbXVsdGlsbmd1YWwga2V5XHJcblx0XHRcdGlmKHRoaXMubXVsdGlsaW5ndWFsLnRyYW5zbGF0ZS5hcGlrZXkgIT09ICcnKSB7XHJcblx0XHRcdFx0dGhpcy5tdWx0aWxpbmd1YWwuZW5hYmxlZCA9IHRydWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5tdWx0aWxpbmd1YWwuZW5hYmxlZCA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL2NoZWNrIGZvciBwcm9mYW5pdHkga2V5XHJcblx0XHRcdGlmKHRoaXMucHJvZmFuaXR5LmNvbmZpZy5rZXkxIHx8IHRoaXMucHJvZmFuaXR5LmNvbmZpZy5rZXkyKSB7XHJcblx0XHRcdFx0dGhpcy5wcm9mYW5pdHkuZW5hYmxlZCA9IHRydWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5wcm9mYW5pdHkuZW5hYmxlZCA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnJlYWR5ID0gdHJ1ZTtcclxuXHJcblx0XHRcdC8vIGxpc3RlbiBmb3Igd2hlbiB0byBzdGFydCB0aGUgaW5kZXhpbmcgb2YgdGhlIGRvbSBiYXNlZCBvbiB0aGUgY2xpY2tub2RlcyBhdmFpbGFiaWxpdHlcclxuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkluZGV4bm9kZXNcIiwgZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRcdGlmKGRhdGEuZGV0YWlsLmRhdGE9PT1cImluZGV4Y2xpY2tub2Rlc1wiKSB7XHJcblx0XHRcdFx0XHRVREFQbHVnaW5TREsuaW5kZXhjbGlja25vZGVzKCk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKGRhdGEuZGV0YWlsLmRhdGE9PT1cImluZGV4bmV3Y2xpY2tub2Rlc1wiKSB7XHJcblx0XHRcdFx0XHRVREFQbHVnaW5TREsuaW5kZXhuZXdjbGlja25vZGVzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIFdlIG5lZWQgdG8gd2FpdCB0aWxsIGFsbCBkb20gY29udGVudCBpcyBsb2FkZWQuIFdlIGluaXRpYWxseSB1c2VkIGEgc3RhbmRhcmQgd2FpdCB0aW1lIGJ1dCBzaGlmdGVkIHRvXHJcblx0XHRcdC8vICAgICAgdXNlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XaW5kb3cvbG9hZF9ldmVudFxyXG5cdFx0XHQvLyAgICAgIFRoaXMgc3RpbGwgcHJvZHVjZXMgc29tZSBkaXNjcmVwYW5jeSB3aGVyZSBpdCBoYW5ncyB1cCB0aGUgd2ViIHBhZ2UuXHJcblx0XHRcdC8vICAgICAgVGhpcyBuZWVkcyB0byBiZSBpbXByb3ZlZCBhdCBzb21lIHBvaW50LlxyXG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xyXG5cdFx0XHRcdC8vIGRlbGF5aW5nIHJlbmRlcmluZyBvZiB1ZGEgcGFuZWwgYnkgMnNlY29uZHMgaW4gb3JkZXIgdG8gd2FpdCBmb3IgdGhlIHBhZ2UgZG9tIHRvIGNvbXBsZXRlXHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKXtcclxuXHRcdFx0XHRcdFVEQVBsdWdpblNESy5tb2RpZnlib2R5aHRtbCgpO1xyXG5cdFx0XHRcdH0sMjAwMCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBzZXR0aW5nIHNlbGVjdGVkIGxhbmd1YWdlIHRvIHRoZSB3ZWJraXRzcGVlY2hcclxuICAgICAgICAgKi9cclxuICAgICAgICBjaGFuZ2VMYW5ndWFnZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBsYW5nQ29kZT0nZW4tVVMnXHJcbiAgICAgICAgICAgIGxhbmdDb2RlID0galF1ZXJ5KCcjdWRhLWxhbmctc2VsZWN0JykudmFsKCk7XHJcbiAgICAgICAgICAgIHRoaXMubXVsdGlsaW5ndWFsLnNlbGVjdGVkTGFuZyA9IGxhbmdDb2RlO1xyXG4gICAgICAgICAgICBpZihVREFTcGVlY2hSZWNvZ25pdGlvbkF2YWlsYWJsZSl7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZWNvZ25pdGlvbi5sYW5nID0gbGFuZ0NvZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cdFx0Y2hlY2t1c2Vya2V5ZXhpc3RzOmZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBzZXNzaW9uZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJSZXF1ZXN0VURBU2Vzc2lvbkRhdGFcIiwge2RldGFpbDoge2RhdGE6IFwiZ2V0dXNlcnNlc3Npb25kYXRhXCJ9LCBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2V9KTtcclxuXHRcdFx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChzZXNzaW9uZXZlbnQpO1xyXG5cdFx0fSxcclxuXHRcdGNyZWF0ZXNlc3Npb246ZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgXHQvLyBVREFTZXNzaW9uSUQ9ZGF0YS5zZXNzaW9ua2V5O1xyXG5cdFx0XHR0aGlzLnNlc3Npb25kYXRhPWRhdGE7XHJcblx0XHRcdHRoaXMuc2Vzc2lvbklEPWRhdGEuc2Vzc2lvbmtleTtcclxuXHRcdFx0VURBVXNlckF1dGhEYXRhLmlkID0gZGF0YS5hdXRoZGF0YS5pZDtcclxuXHRcdFx0VURBVXNlckF1dGhEYXRhLmVtYWlsID0gZGF0YS5hdXRoZGF0YS5lbWFpbDtcclxuXHRcdFx0dGhpcy5yZWNvcmRkb2N1bWVudGNsaWNrKCk7XHJcblx0XHR9LFxyXG5cdFx0Y2xlYXJTZXNzaW9uOiBmdW5jdGlvbigpe1xyXG5cdFx0XHR0aGlzLnNlc3Npb25JRCA9IFwiXCI7XHJcblx0XHRcdHRoaXMuc2Vzc2lvbmRhdGEgPSB7c2Vzc2lvbmtleTpcIlwiLGF1dGhlbnRpY2F0ZWQ6ZmFsc2UsYXV0aGVudGljYXRpb25zb3VyY2U6XCJcIixhdXRoZGF0YTp7fX07XHJcblx0XHRcdHRoaXMuY2xvc2Vtb2RhbCgpO1xyXG5cdFx0fSxcclxuXHRcdG1vZGlmeWJvZHlodG1sOmZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBodG1sPSc8ZGl2IGlkPVwidWRhLWJ0blwiIG5pc3Qtdm9pY2U9XCJ0cnVlXCI+PC9kaXY+PGRpdiBpZD1cInVkYS1odG1sLWNvbnRhaW5lclwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj48ZGl2IGlkPVwidWRhLWh0bWwtY29udGVudFwiIG5pc3Qtdm9pY2U9XCJ0cnVlXCI+PC9kaXY+PC9kaXY+PGRpdiBpZD1cInVkYS1hbGVydGh0bWwtY29udGFpbmVyXCIgbmlzdC12b2ljZT1cInRydWVcIj48L2Rpdj4nO1xyXG5cclxuXHRcdFx0alF1ZXJ5KGRvY3VtZW50LmJvZHkpLnByZXBlbmQoaHRtbCk7XHJcblxyXG5cdFx0XHRpZih0eXBlb2YgaXNVREFTZGsgPT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0alF1ZXJ5KHdpbmRvdykudHJpZ2dlcigncmVzaXplJykucHJvbWlzZSgpLmRvbmUoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0VURBUGx1Z2luU0RLLmluZGV4Y2xpY2tub2RlcygpO1xyXG5cdFx0XHRcdFx0VURBUGx1Z2luU0RLLmFkZGJ1dHRvbmh0bWwoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRVREFQbHVnaW5TREsuaW5kZXhjbGlja25vZGVzKCk7XHJcblx0XHRcdFx0VURBUGx1Z2luU0RLLmFkZGJ1dHRvbmh0bWwoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYoVURBTGFzdEluZGV4VGltZSE9PTAgJiYgVURBTGFzdEluZGV4VGltZTxVREFMYXN0TXV0YXRpb25UaW1lKSB7XHJcblx0XHRcdFx0XHRVREFQbHVnaW5TREsuaW5kZXhuZXdjbGlja25vZGVzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFVEQV9QT1NUX0lOVEVSVkFMKTtcclxuXHRcdH0sXHJcblx0XHRhZGRidXR0b25odG1sOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHRsZXQgdWRhSWNvbkRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgXHRsZXQgdWRhSWNvbkRpc2FibGVkQnlDc3AgPSBmYWxzZTtcclxuXHJcblx0XHRcdGNvbnN0IHNjcmVlblNpemUgPSB0aGlzLmdldFNjcmVlblNpemUoKTtcclxuXHJcblx0XHRcdGlmKHNjcmVlblNpemUucmVzb2x1dGlvbi5oZWlnaHQgPCAxMDgwKXtcclxuXHJcblx0XHRcdFx0alF1ZXJ5KFwiI3VkYS1idG5cIikuaHRtbCgnJyk7XHJcblx0XHRcdFx0bGV0IHNjcmVlbkFjY2VwdGFuY2UgPSB0aGlzLmdldHN0b3JhZ2VkYXRhKHRoaXMuc2NyZWVuQWNjZXB0YW5jZS5zdG9yYWdlTmFtZSk7XHJcblx0XHRcdFx0aWYoc2NyZWVuQWNjZXB0YW5jZSl7XHJcblx0XHRcdFx0XHRzY3JlZW5BY2NlcHRhbmNlID0gSlNPTi5wYXJzZShzY3JlZW5BY2NlcHRhbmNlKTtcclxuXHRcdFx0XHRcdGlmKCFzY3JlZW5BY2NlcHRhbmNlLnByb2NlZWQpe1xyXG5cdFx0XHRcdFx0XHR1ZGFJY29uRGlzYWJsZWQ9J3VkYUljb25EaXNhYmxlZCc7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuc2hvd0FsZXJ0KHRoaXMuc2NyZWVuQWNjZXB0YW5jZSwgXCJVREFOIGlzIG5vdCB0ZXN0ZWQgYmVsb3cgMTkyMCB4IDEwODAgcmVzb2x1dGlvbi4gRG8geW91IHdhbnQgdG8gc3RpbGwgdXNlIFVEQU4/XCIsIHRydWUpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYodGhpcy5zZXNzaW9uZGF0YS5jc3AuY3NwZW5hYmxlZCAmJiAhdGhpcy5zZXNzaW9uZGF0YS5jc3AudWRhbmFsbG93ZWQpe1xyXG5cdFx0XHRcdGpRdWVyeShcIiN1ZGEtYnRuXCIpLmh0bWwoJycpO1xyXG5cdFx0XHRcdGxldCBjc3BVc2VyQWNjZXB0YW5jZSA9IHRoaXMuZ2V0c3RvcmFnZWRhdGEodGhpcy5jc3BVc2VyQWNjZXB0YW5jZS5zdG9yYWdlTmFtZSk7XHJcblx0XHRcdFx0aWYoY3NwVXNlckFjY2VwdGFuY2Upe1xyXG5cdFx0XHRcdFx0Y3NwVXNlckFjY2VwdGFuY2UgPSBKU09OLnBhcnNlKGNzcFVzZXJBY2NlcHRhbmNlKTtcclxuXHRcdFx0XHRcdGlmKCFjc3BVc2VyQWNjZXB0YW5jZS5wcm9jZWVkKXtcclxuXHRcdFx0XHRcdFx0dWRhSWNvbkRpc2FibGVkPSd1ZGFJY29uRGlzYWJsZWQnO1xyXG5cdFx0XHRcdFx0XHR1ZGFJY29uRGlzYWJsZWRCeUNzcD10cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLnNob3dDc3BBbGVydChcIlRoaXMgc2l0ZSdzIHNlY3VyaXR5IHBvbGljaWVzIG1heSBwcmV2ZW50IFVEQU4gZnJvbSBydW5uaW5nIHdlbGwuIERvIHlvdSB3YW50IHRvIGNvbnRpbnVlP1wiKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGpRdWVyeShcIiN1ZGEtYnRuXCIpLnVuYmluZChcImNsaWNrXCIpLmh0bWwoXCJcIik7XHJcblx0XHRcdHZhciBidXR0b25odG1sXHQ9XHQnPGRpdiBjbGFzcz1cInVkYS1uaXN0YXBwLWxvZ28gJyt1ZGFJY29uRGlzYWJsZWQrJ1wiPidcclxuXHRcdFx0XHRcdFx0XHRcdCsnXHQ8ZGl2IGNsYXNzPVwidWRhLWljb25cIiBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjtcIj4nXHJcblx0XHRcdFx0XHRcdFx0XHQrJ1x0XHQ8aW1nIHNyYz1cIicrdGhpcy5leHRlbnNpb25wYXRoKydpbWFnZXMvaWNvbnMvbmlzdC1sb2dvLnBuZ1wiPidcclxuXHRcdFx0XHRcdFx0XHRcdCsnXHRcdDxwIHN0eWxlPVwicGFkZGluZzowOyBtYXJnaW46MHB4O2NvbG9yOiAjMzAzZjlmOyBmb250LXdlaWdodDogYm9sZDsgZm9udC1zaXplOiAxMXB4O1wiPlVEQU4oQmV0YSk8L3A+J1xyXG5cdFx0XHRcdFx0XHRcdFx0KydcdFx0PHNwYW4+J1xyXG5cdFx0XHRcdFx0XHRcdFx0KydcdFx0XHQ8aW1nIHNyYz1cIicrdGhpcy5leHRlbnNpb25wYXRoKydpbWFnZXMvaWNvbnMvYmFja2Fycm93LW9yYW5nZS5wbmdcIj4nXHJcblx0XHRcdFx0XHRcdFx0XHQrJ1x0XHQ8L3NwYW4+J1xyXG5cdFx0XHRcdFx0XHRcdFx0KydcdDwvZGl2PidcclxuXHRcdFx0XHRcdFx0XHRcdCsnPC9kaXY+JztcclxuXHRcdFx0dmFyIG1vZGFsID1qUXVlcnkoXCIjdWRhLWJ0blwiKTtcclxuXHRcdFx0bW9kYWwuYXBwZW5kKGJ1dHRvbmh0bWwpO1xyXG5cdFx0XHRpZighdWRhSWNvbkRpc2FibGVkKSB7XHJcblx0XHRcdFx0bW9kYWwuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0VURBUGx1Z2luU0RLLm9wZW5tb2RhbCh0cnVlKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRpZiAodGhpcy5yZXJlbmRlcmh0bWwpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2hvd2h0bWwoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYodWRhSWNvbkRpc2FibGVkQnlDc3Ape1xyXG5cdFx0XHRcdFx0bW9kYWwuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRVREFQbHVnaW5TREsuc2hvd0FsZXJ0KFVEQVBsdWdpblNESy5jc3BVc2VyQWNjZXB0YW5jZSwgJ0RvIHlvdSB3YW50IHRvIGVuYWJsZSBcIlVuaXZlcnNhbCBEaWdpdGFsIEFzc2lzdGFudCBieSBOaXN0YXBwJywgdHJ1ZSwgJ0VuYWJsZScsICdLZWVwIHN1c3BlbmRlZCcpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0cmlnaHRQYW5lbEh0bWw6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBodG1sID0gXHQnPHVkYS1wYW5lbD4nXHJcblx0XHRcdFx0XHRcdCsnPGRpdiBjbGFzcz1cInVkYS1wYWdlLXJpZ2h0LWJhclwiPidcclxuXHRcdFx0XHRcdFx0Kyc8ZGl2PidcclxuXHRcdFx0XHRcdFx0XHQrJzxkaXYgY2xhc3M9XCJ1ZGEtcmliYm9uLWFycm93XCIgaWQ9XCJ1ZGEtY2xvc2UtcGFuZWxcIj48aW1nIHNyYz1cIicrdGhpcy5leHRlbnNpb25wYXRoKydpbWFnZXMvaWNvbnMvcmlnaHQtYXJyb3cucG5nXCI+PC9kaXY+J1xyXG5cdFx0XHRcdFx0XHRcdCsnPGRpdiBjbGFzcz1cInVkYS1pY29uLXR4dFwiPidcclxuXHRcdFx0XHRcdFx0XHRcdCsnPGltZyBzcmM9XCInK3RoaXMuZXh0ZW5zaW9ucGF0aCsnaW1hZ2VzL2ljb25zL25pc3QtbG9nby5wbmdcIj48c3BhbiBjbGFzcz1cInVkYS1oZWxwLWJnLXRvb2x0aXBcIj5OZWVkIEhlbHA/PC9zcGFuPidcclxuXHRcdFx0XHRcdFx0XHQrJzwvZGl2PidcclxuXHRcdFx0XHRcdFx0XHQrJzxkaXYgY2xhc3M9XCJ1ZGEtaWNvbi10eHRcIj4nXHJcblx0XHRcdFx0XHRcdFx0KydcdDxzcGFuIGNsYXNzPVwiXCIgc3R5bGU9XCJjb2xvcjogIzMwM2Y5ZjsgZm9udC13ZWlnaHQ6IGJvbGQ7XCI+VURBTihCZXRhKTwvc3Bhbj4nXHJcblx0XHRcdFx0XHRcdFx0Kyc8L2Rpdj4nXHJcblx0XHRcdFx0XHRcdFx0Kyc8ZGl2IGNsYXNzPVwidWRhLWNvbnRhaW5lclwiIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyOyBtYXJnaW4tdG9wOiAxMHB4O1wiPidcclxuXHRcdFx0XHRcdFx0XHRcdCsnPGRpdiBjbGFzcz1cInVkYS1zZWFyY2gtZGl2XCI+J1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQrJzxidXR0b24gY2xhc3M9XCJ1ZGEtbWljLWJ0blwiIHN0eWxlPVwiYm9yZGVyLXJhZGl1czogNXB4IDBweCAwcHggNXB4O1wiIGlkPVwidWRhLXZvaWNlLWljb24tc3RhcnRcIj4nXHJcblx0XHRcdFx0XHRcdFx0XHRcdCsnPC9idXR0b24+J1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQrJzxidXR0b24gY2xhc3M9XCJ1ZGEtc3RvcC1idG4tYmdcIiBzdHlsZT1cImJvcmRlci1yYWRpdXM6IDVweCAwcHggMHB4IDVweDsgZGlzcGxheTpub25lO1wiIGlkPVwidWRhLXZvaWNlLWljb24tc3RvcFwiPidcclxuXHRcdFx0XHRcdFx0XHRcdFx0Kyc8L2J1dHRvbj4nXHJcblx0XHRcdFx0XHRcdFx0XHRcdCsnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInVkYS1zZWFyY2gtaW5wdXRcIiBjbGFzcz1cInVkYS1pbnB1dC1jbnRybFwiIHBsYWNlaG9sZGVyPVwic2VhcmNoLi4uXCIgaWQ9XCJ1ZGEtc2VhcmNoLWlucHV0XCIgLz4nXHJcblx0XHRcdFx0XHRcdFx0XHRcdCsnPGJ1dHRvbiBjbGFzcz1cInVkYS1zZWFyY2gtYnRuXCIgaWQ9XCJ1ZGEtc2VhcmNoLWJ0blwiIHN0eWxlPVwiYm9yZGVyLXJhZGl1czogMHB4IDVweCA1cHggMHB4O1wiPjwvYnV0dG9uPidcclxuXHRcdFx0XHRcdFx0XHRcdCsnPC9kaXY+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKygodGhpcy5tdWx0aWxpbmd1YWwuZW5hYmxlZCk/JzxzZWxlY3QgbmFtZT1cInVkYS1sYW5nLXNlbGVjdFwiIGlkPVwidWRhLWxhbmctc2VsZWN0XCIgb25jaGFuZ2U9XCJVREFQbHVnaW5TREsuY2hhbmdlTGFuZ3VhZ2UoKTtcIj48L3NlbGVjdD4nOicnKVxyXG5cdFx0XHRcdFx0XHRcdCsnPC9kaXY+J1xyXG5cdFx0XHRcdFx0XHQrJzwvZGl2PidcclxuXHRcdFx0XHRcdFx0Kyc8aHIgc3R5bGU9XCJib3JkZXI6MXB4IHNvbGlkICM5Njk2OTY7IHdpZHRoOjEwMCU7XCI+J1xyXG5cdFx0XHRcdFx0XHQrJzxkaXYgY2xhc3M9XCJ1ZGEtY29udGFpbmVyIHVkYS1jbGVhciB1ZGEtY2FyZHMtc2Nyb2xsZXJcIiBpZD1cInVkYS1jb250ZW50LWNvbnRhaW5lclwiPidcclxuXHRcdFx0XHRcdFx0Kyc8L2Rpdj4nXHJcblx0XHRcdFx0XHRcdCsnPGRpdj4nXHJcblx0XHRcdFx0XHRcdFx0Kyc8ZGl2IGNsYXNzPVwidWRhLWZvb3Rlci1iYXJcIj4nXHJcblx0XHRcdFx0XHRcdFx0XHQrJzxkaXYgY2xhc3M9XCJ1ZGEtY29udGFpbmVyXCI+J1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQrJzxkaXYgY2xhc3M9XCJ1ZGEtZHJvcGRvd25cIiBpZD1cInVkYS1hZHZhbmNlZC1idG5cIj4nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Kyc8YnV0dG9uIGNsYXNzPVwidWRhLWFkdmFuY2VkLWJ0blwiPidcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrJzxzcGFuPkFkdmFuY2VkPC9zcGFuPidcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrJzwvYnV0dG9uPidcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrJzxkaXYgY2xhc3M9XCJ1ZGEtYWR2YW5jZWQtYnRuLWNvbnRlbnRcIj4nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQrJzxhIGlkPVwidWRhLWFkdmFuY2Utc2VjdGlvblwiPk5ldyBTZXF1ZW5jZSA8L2E+J1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gKyc8YT48aW1nIHNyYz1cIicrdGhpcy5leHRlbnNpb25wYXRoKydpbWFnZXMvaWNvbnMvbmV3LXJlY29yZC5wbmdcIiB3aWR0aD1cIjIzcHhcIiBoZWlnaHQ9XCIyM3B4XCI+PHNwYW4+IE5ldyBSZWNvcmQ8L3NwYW4+PC9hPidcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrJzwvZGl2PidcclxuXHRcdFx0XHRcdFx0XHRcdFx0Kyc8L2Rpdj4nXHJcblx0XHRcdFx0XHRcdFx0XHQrJzwvZGl2PidcclxuXHRcdFx0XHRcdFx0XHRcdCsnPGJyPidcclxuXHRcdFx0XHRcdFx0XHRcdCsnPGRpdiBjbGFzcz1cInVkYS1jb250YWluZXJcIiBzdHlsZT1cImJvcmRlci10b3A6MXB4IHNvbGlkICM5Njk2OTY7IG1hcmdpbi10b3A6IDMwcHg7XCI+J1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQrJzxkaXYgY2xhc3M9XCJ1ZGEtZm9vdGVyLWxlZnRcIj5Db3B5cmlnaHRzIFJlc2VydmVkIDIwMjEuPC9kaXY+J1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQrJzxkaXYgY2xhc3M9XCJ1ZGEtZm9vdGVyLXJpZ2h0XCIgc3R5bGU9XCJwYWRkaW5nLXRvcDo1cHg7IHRleHQtYWxpZ246cmlnaHQ7XCI+J1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsnPGEgaHJlZj1cImh0dHBzOi8vdWRhbi5uaXN0YXBwLmFpXCIgdGFyZ2V0PVwiX2JsYW5rXCI+S25vdyBNb3JlIDwvYT4nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Kyc8aW1nIHNyYz1cIicrdGhpcy5leHRlbnNpb25wYXRoKydpbWFnZXMvaWNvbnMvbmlzdC1sb2dvLnBuZ1wiIHdpZHRoPVwiMTVweFwiIGhlaWdodD1cIjE1cHg7XCI+J1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQrJzwvZGl2PidcclxuXHRcdFx0XHRcdFx0XHRcdCsnPC9kaXY+J1xyXG5cdFx0XHRcdFx0XHRcdCsnPC9kaXY+J1xyXG5cdFx0XHRcdFx0XHQrJzwvZGl2PidcclxuXHRcdFx0XHRcdCsnPC9kaXY+J1xyXG5cdFx0XHRcdFx0Kyc8L3VkYS1wYW5lbD4nO1xyXG5cclxuXHRcdFx0cmV0dXJuIGh0bWw7XHJcblx0XHR9LFxyXG5cdFx0YWRkdm9pY2VzZWFyY2htb2RhbDpmdW5jdGlvbihhZGRuaXN0aWNvbj10cnVlKXtcclxuXHRcdFx0alF1ZXJ5KFwiI3VkYS1odG1sLWNvbnRlbnRcIikuaHRtbCh0aGlzLnJpZ2h0UGFuZWxIdG1sKCkpO1xyXG5cdFx0XHQvL3JlbmRlcmluZyBsYW5ndWFnZSBsaXN0XHJcblx0XHRcdGlmKHRoaXMubXVsdGlsaW5ndWFsLmVuYWJsZWQpIHtcclxuXHRcdFx0XHR0aGlzLmJjcGxhbmcuZm9yRWFjaChsYW5nY29kZSA9PiB7XHJcblx0XHRcdFx0XHRpZiAobGFuZ2NvZGUubGVuZ3RoID4gMikge1xyXG5cdFx0XHRcdFx0XHRsYW5nY29kZS5mb3JFYWNoKChzdWJsYW5nLCBzdWJsYW5naW5kZXgpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoc3VibGFuZ2luZGV4ICE9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAodGhpcy5tdWx0aWxpbmd1YWwuc2VsZWN0ZWRMYW5nLnRvTG93ZXJDYXNlKCkgPT09IHN1YmxhbmdbMF0udG9Mb3dlckNhc2UoKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRqUXVlcnkoJyN1ZGEtbGFuZy1zZWxlY3QnKS5hcHBlbmQoJzxvcHRpb24gdmFsdWU9XCInICsgc3VibGFuZ1swXSArICdcIiBzZWxlY3RlZD4nICsgbGFuZ2NvZGVbMF0gKyAnIC0gJyArIHN1YmxhbmdbMV0gKyAnPC9vcHRpb24+Jyk7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRqUXVlcnkoJyN1ZGEtbGFuZy1zZWxlY3QnKS5hcHBlbmQoJzxvcHRpb24gdmFsdWU9XCInICsgc3VibGFuZ1swXSArICdcIj4nICsgbGFuZ2NvZGVbMF0gKyAnIC0gJyArIHN1YmxhbmdbMV0gKyAnPC9vcHRpb24+Jyk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLm11bHRpbGluZ3VhbC5zZWxlY3RlZExhbmcudG9Mb3dlckNhc2UoKSA9PSBsYW5nY29kZVsxXS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkpIHtcclxuXHRcdFx0XHRcdFx0XHRqUXVlcnkoJyN1ZGEtbGFuZy1zZWxlY3QnKS5hcHBlbmQoJzxvcHRpb24gdmFsdWU9XCInICsgbGFuZ2NvZGVbMV0gKyAnXCIgc2VsZWN0ZWQ+JyArIGxhbmdjb2RlWzBdICsgJzwvb3B0aW9uPicpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGpRdWVyeSgnI3VkYS1sYW5nLXNlbGVjdCcpLmFwcGVuZCgnPG9wdGlvbiB2YWx1ZT1cIicgKyBsYW5nY29kZVsxXSArICdcIj4nICsgbGFuZ2NvZGVbMF0gKyAnPC9vcHRpb24+Jyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRqUXVlcnkoXCIjdWRhLWNsb3NlLXBhbmVsXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0VURBUGx1Z2luU0RLLmNsb3NlbW9kYWwoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGpRdWVyeShcIiN2b2ljZXNlYXJjaFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFVEQVBsdWdpblNESy5zZWFyY2hpbmVsYXN0aWMoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGpRdWVyeShcIiN1ZGEtc2VhcmNoLWlucHV0XCIpLmtleWRvd24oZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0XHRpZiAoZS5rZXlDb2RlID09PSAxMykge1xyXG5cdFx0XHRcdFx0alF1ZXJ5KFwiI3VkYS1jb250ZW50LWNvbnRhaW5lclwiKS5odG1sKFwiXCIpO1xyXG5cdFx0XHRcdFx0VURBUGx1Z2luU0RLLnNlYXJjaGluZWxhc3RpYygpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdGpRdWVyeShcIiN1ZGEtc2VhcmNoLWJ0blwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFVEQVBsdWdpblNESy5zZWFyY2hpbmVsYXN0aWMoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGlmKFVEQVNwZWVjaFJlY29nbml0aW9uQXZhaWxhYmxlKXtcclxuXHRcdFx0XHRqUXVlcnkoXCIjdWRhLXZvaWNlLWljb24tc3RhcnRcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0alF1ZXJ5KFwiI3VkYS1jb250ZW50LWNvbnRhaW5lclwiKS5odG1sKFwiXCIpO1xyXG5cdFx0XHRcdFx0VURBUGx1Z2luU0RLLnJlY29nbml0aW9uLnN0YXJ0KCk7XHJcblx0XHRcdFx0XHRqUXVlcnkoXCIjdWRhLXZvaWNlLWljb24tc3RhcnRcIikuaGlkZSgpO1xyXG5cdFx0XHRcdFx0alF1ZXJ5KFwiI3VkYS12b2ljZS1pY29uLXN0b3BcIikuc2hvdygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGpRdWVyeShcIiN1ZGEtdm9pY2UtaWNvbi1zdG9wXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFVEQVBsdWdpblNESy5yZWNvZ25pdGlvbi5zdG9wKCk7XHJcblx0XHRcdFx0XHRqUXVlcnkoXCIjdWRhLXZvaWNlLWljb24tc3RvcFwiKS5oaWRlKCk7XHJcblx0XHRcdFx0XHRqUXVlcnkoXCIjdWRhLXZvaWNlLWljb24tc3RhcnRcIikuc2hvdygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGpRdWVyeShcIiN1ZGEtdm9pY2UtaWNvbi1zdGFydFwiKS5oaWRlKCk7XHJcblx0XHRcdFx0alF1ZXJ5KFwiI3VkYS12b2ljZS1pY29uLXN0b3BcIikuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGFkZG5pc3RpY29uKSB7XHJcblx0XHRcdFx0aWYoIVVEQVVzZXJBdXRoRGF0YS5yZXN0cmljdF9hZGRfZGVsZXRlKSB7XHJcblx0XHRcdFx0XHRqUXVlcnkoJyN1ZGEtYWR2YW5jZWQtYnRuJykuc2hvdygpO1xyXG5cdFx0XHRcdFx0alF1ZXJ5KFwiI3VkYS1hZHZhbmNlLXNlY3Rpb25cIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRVREFQbHVnaW5TREsuc2hvd2FkdmFuY2VkaHRtbCgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGpRdWVyeSgnI3VkYS1hZHZhbmNlZC1idG4nKS5oaWRlKCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHQvKipcclxuXHRcdCAqIEFkZGluZyBhbGVydCBtb2RhbCBodG1sXHJcblx0XHQgKi9cclxuXHRcdHNob3dDc3BBbGVydDogZnVuY3Rpb24oY29udGVudD0nJyxhZGRidG49ZmFsc2Upe1xyXG5cdFx0XHRsZXQgaHRtbD0nPGRpdiBpZD1cInVkYU1vZGFsXCIgY2xhc3M9XCJ1ZGFtb2RhbFwiPidcclxuXHRcdFx0XHRcdCsnXHQ8ZGl2IGNsYXNzPVwidWRhbW9kYWwtY29udGVudFwiPidcclxuXHRcdFx0XHRcdCsnXHRcdDxkaXYgY2xhc3M9XCJ1ZGFtb2RhbC1oZWFkZXJcIj4nXHJcblx0XHRcdFx0XHQrJ1x0XHRcdDxzcGFuIGNsYXNzPVwidWRhY2xvc2VcIj4mdGltZXM7PC9zcGFuPidcclxuXHRcdFx0XHRcdCsnXHRcdFx0PGgzPlVEQSBBbGVydDwvaDM+J1xyXG5cdFx0XHRcdFx0KydcdFx0PC9kaXY+J1xyXG5cdFx0XHRcdFx0KydcdFx0PGRpdiBjbGFzcz1cInVkYW1vZGFsLWJvZHlcIj4nXHJcblx0XHRcdFx0XHQrJ1x0XHRcdDxwPicrY29udGVudCsnPC9wPidcclxuXHRcdFx0XHRcdCsnXHRcdDwvZGl2PidcclxuXHRcdFx0XHRcdCsnXHRcdDxkaXYgY2xhc3M9XCJ1ZGFtb2RhbC1mb290ZXJcIj4nXHJcblx0XHRcdFx0XHQrJ1x0XHRcdDxidXR0b24gY2xhc3M9XCJ1ZGFjb250aW51ZUJ0biBcIiBpZD1cInVkYWNvbnRpbnVlQnRuXCI+Q29udGludWUgd2l0aCBlcnJvcnM8L2J1dHRvbj4nXHJcblx0XHRcdFx0XHQrJ1x0XHRcdDxidXR0b24gY2xhc3M9XCJ1ZGFjbG9zZUJ0blwiIGlkPVwidWRhY2xvc2VCdG5cIj5FeGl0IFVEQU48L2J1dHRvbj4nXHJcblx0XHRcdFx0XHQrJ1x0XHQ8L2Rpdj4nXHJcblx0XHRcdFx0XHQrJ1x0PC9kaXY+J1xyXG5cdFx0XHRcdFx0Kyc8L2Rpdj4nO1xyXG5cclxuXHRcdFx0alF1ZXJ5KFwiI3VkYS1hbGVydGh0bWwtY29udGFpbmVyXCIpLmh0bWwoaHRtbCk7XHJcblx0XHRcdC8vIEdldCB0aGUgbW9kYWxcclxuXHRcdFx0dmFyIG1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1ZGFNb2RhbFwiKTtcclxuXHJcblx0XHRcdC8vIEdldCB0aGUgPHNwYW4+IGVsZW1lbnQgdGhhdCBjbG9zZXMgdGhlIG1vZGFsXHJcblx0XHRcdHZhciBzcGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInVkYWNsb3NlXCIpWzBdO1xyXG5cdFx0XHR2YXIgY2xvc2VCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndWRhY2xvc2VCdG4nKTtcclxuXHRcdFx0dmFyIGNvbnRpbnVlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VkYWNvbnRpbnVlQnRuJyk7XHJcblxyXG5cdFx0XHRjbG9zZUJ0bi5vbmNsaWNrPWZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0bW9kYWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cdFx0XHRcdFVEQVBsdWdpblNESy5jc3BEZWNsaW5lKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gV2hlbiB0aGUgdXNlciBjbGlja3Mgb24gPHNwYW4+ICh4KSwgY2xvc2UgdGhlIG1vZGFsXHJcblx0XHRcdHNwYW4ub25jbGljayA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdG1vZGFsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHRcdFx0XHRVREFQbHVnaW5TREsuY3NwRGVjbGluZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRtb2RhbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG5cclxuXHRcdFx0Y29udGludWVCdG4ub25jbGljaz1mdW5jdGlvbiAoKXtcclxuXHRcdFx0XHRtb2RhbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblx0XHRcdFx0VURBUGx1Z2luU0RLLmNzcEFjY2VwdGFuY2UoKTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9LFxyXG5cdFx0Y3NwRGVjbGluZTogZnVuY3Rpb24oKXtcclxuXHRcdFx0bGV0IGNzcHVzZXJhY2NlcHRhbmNlID0gdGhpcy5nZXRzdG9yYWdlZGF0YSh0aGlzLmNzcFVzZXJBY2NlcHRhbmNlLnN0b3JhZ2VOYW1lKTtcclxuXHRcdFx0aWYoY3NwdXNlcmFjY2VwdGFuY2Upe1xyXG5cdFx0XHRcdGlmKCFjc3B1c2VyYWNjZXB0YW5jZS5wcm9jZWVkKXtcclxuXHRcdFx0XHRcdHRoaXMuY3NwVXNlckFjY2VwdGFuY2UuZGF0YS5wcm9jZWVkID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuY3NwVXNlckFjY2VwdGFuY2UuZGF0YS5wcm9jZWVkID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5jcmVhdGVzdG9yYWdlZGF0YSh0aGlzLmNzcFVzZXJBY2NlcHRhbmNlLnN0b3JhZ2VOYW1lLCBKU09OLnN0cmluZ2lmeSh0aGlzLmNzcFVzZXJBY2NlcHRhbmNlLmRhdGEpKTtcclxuXHRcdFx0dGhpcy5hZGRidXR0b25odG1sKCk7XHJcblx0XHR9LFxyXG5cdFx0Y3NwQWNjZXB0YW5jZTogZnVuY3Rpb24oKXtcclxuXHRcdFx0bGV0IGNzcHVzZXJhY2NlcHRhbmNlID0gdGhpcy5nZXRzdG9yYWdlZGF0YSh0aGlzLmNzcFVzZXJBY2NlcHRhbmNlLnN0b3JhZ2VOYW1lKTtcclxuXHRcdFx0aWYoY3NwdXNlcmFjY2VwdGFuY2Upe1xyXG5cdFx0XHRcdGlmKCFjc3B1c2VyYWNjZXB0YW5jZS5wcm9jZWVkKXtcclxuXHRcdFx0XHRcdHRoaXMuY3NwVXNlckFjY2VwdGFuY2UuZGF0YS5wcm9jZWVkID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5jc3BVc2VyQWNjZXB0YW5jZS5kYXRhLnByb2NlZWQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuY3JlYXRlc3RvcmFnZWRhdGEodGhpcy5jc3BVc2VyQWNjZXB0YW5jZS5zdG9yYWdlTmFtZSwgSlNPTi5zdHJpbmdpZnkodGhpcy5jc3BVc2VyQWNjZXB0YW5jZS5kYXRhKSk7XHJcblx0XHRcdHRoaXMuYWRkYnV0dG9uaHRtbCgpO1xyXG5cdFx0fSxcclxuXHRcdGdldEFsZXJ0SHRtbDogZnVuY3Rpb24oY29udGVudCwgYWRkQ29udGludWVCdG49dHJ1ZSwgY29udGludWVUZXh0PSdDb250aW51ZSB3aXRoIGVycm9ycycsIGV4aXRUZXh0PSdFeGl0IFVEQU4nKXtcclxuXHRcdFx0bGV0IGZvb3Rlckh0bWwgPSAnJztcclxuXHRcdFx0aWYoYWRkQ29udGludWVCdG4pe1xyXG5cdFx0XHRcdGZvb3Rlckh0bWwgXHQ9J1x0XHRcdDxidXR0b24gY2xhc3M9XCJ1ZGFjb250aW51ZUJ0biBcIiBpZD1cInVkYWNvbnRpbnVlQnRuXCI+Jytjb250aW51ZVRleHQrJzwvYnV0dG9uPidcclxuXHRcdFx0XHRcdFx0XHQrJ1x0XHRcdDxidXR0b24gY2xhc3M9XCJ1ZGFjbG9zZUJ0blwiIGlkPVwidWRhY2xvc2VCdG5cIj4nK2V4aXRUZXh0Kyc8L2J1dHRvbj4nO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZvb3Rlckh0bWwgPSdcdFx0XHQ8YnV0dG9uIGNsYXNzPVwidWRhY2xvc2VCdG5cIiBpZD1cInVkYWNsb3NlQnRuXCI+JytleGl0VGV4dCsnPC9idXR0b24+JztcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgaHRtbD0nPGRpdiBpZD1cInVkYU1vZGFsXCIgY2xhc3M9XCJ1ZGFtb2RhbFwiPidcclxuXHRcdFx0XHQrJ1x0PGRpdiBjbGFzcz1cInVkYW1vZGFsLWNvbnRlbnRcIj4nXHJcblx0XHRcdFx0KydcdFx0PGRpdiBjbGFzcz1cInVkYW1vZGFsLWhlYWRlclwiPidcclxuXHRcdFx0XHQrJ1x0XHRcdDxzcGFuIGNsYXNzPVwidWRhY2xvc2VcIj4mdGltZXM7PC9zcGFuPidcclxuXHRcdFx0XHQrJ1x0XHRcdDxoMz5VREEgQWxlcnQ8L2gzPidcclxuXHRcdFx0XHQrJ1x0XHQ8L2Rpdj4nXHJcblx0XHRcdFx0KydcdFx0PGRpdiBjbGFzcz1cInVkYW1vZGFsLWJvZHlcIj4nXHJcblx0XHRcdFx0KydcdFx0XHQ8cD4nK2NvbnRlbnQrJzwvcD4nXHJcblx0XHRcdFx0KydcdFx0PC9kaXY+J1xyXG5cdFx0XHRcdCsnXHRcdDxkaXYgY2xhc3M9XCJ1ZGFtb2RhbC1mb290ZXJcIj4nXHJcblx0XHRcdFx0K1x0XHRcdGZvb3Rlckh0bWxcclxuXHRcdFx0XHQrJ1x0XHQ8L2Rpdj4nXHJcblx0XHRcdFx0KydcdDwvZGl2PidcclxuXHRcdFx0XHQrJzwvZGl2Pic7XHJcblx0XHRcdHJldHVybiBodG1sXHJcblx0XHR9LFxyXG5cdFx0c2hvd0FsZXJ0OiBmdW5jdGlvbihzdG9yYWdlTmFtZSwgY29udGVudD0nJywgYWRkQ29udGludWVCdG49ZmFsc2UsIGNvbnRpbnVlVGV4dD0nQ29udGludWUnLCBleGl0VGV4dD0nQ2xvc2UnKXtcclxuXHRcdFx0bGV0IGh0bWw9dGhpcy5nZXRBbGVydEh0bWwoY29udGVudCwgYWRkQ29udGludWVCdG4sIGNvbnRpbnVlVGV4dCwgZXhpdFRleHQpO1xyXG5cclxuXHRcdFx0alF1ZXJ5KFwiI3VkYS1hbGVydGh0bWwtY29udGFpbmVyXCIpLmh0bWwoaHRtbCk7XHJcblxyXG5cdFx0XHR2YXIgbW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVkYU1vZGFsXCIpO1xyXG5cdFx0XHR2YXIgc3BhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ1ZGFjbG9zZVwiKVswXTtcclxuXHRcdFx0dmFyIGNsb3NlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VkYWNsb3NlQnRuJyk7XHJcblx0XHRcdHZhciBjb250aW51ZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1ZGFjb250aW51ZUJ0bicpO1xyXG5cclxuXHRcdFx0Y2xvc2VCdG4ub25jbGljaz1mdW5jdGlvbigpe1xyXG5cdFx0XHRcdG1vZGFsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHRcdFx0XHRpZihzdG9yYWdlTmFtZSkge1xyXG5cdFx0XHRcdFx0VURBUGx1Z2luU0RLLmFsZXJ0RGVjbGluZShzdG9yYWdlTmFtZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzcGFuLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRtb2RhbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblx0XHRcdFx0aWYoc3RvcmFnZU5hbWUpIHtcclxuXHRcdFx0XHRcdFVEQVBsdWdpblNESy5hbGVydERlY2xpbmUoc3RvcmFnZU5hbWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bW9kYWwuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuXHJcblx0XHRcdGlmKGFkZENvbnRpbnVlQnRuKSB7XHJcblx0XHRcdFx0Y29udGludWVCdG4ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdG1vZGFsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHRcdFx0XHRcdGlmIChzdG9yYWdlTmFtZSkge1xyXG5cdFx0XHRcdFx0XHRVREFQbHVnaW5TREsuYWxlcnRBY2NlcHRhbmNlKHN0b3JhZ2VOYW1lKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0YWxlcnREZWNsaW5lOiBmdW5jdGlvbihzdG9yYWdlTmFtZSl7XHJcblx0XHRcdGxldCBkYXRhID0gdGhpcy5nZXRzdG9yYWdlZGF0YShzdG9yYWdlTmFtZS5zdG9yYWdlTmFtZSk7XHJcblx0XHRcdGlmKGRhdGEpe1xyXG5cdFx0XHRcdGlmKCFkYXRhLnByb2NlZWQpe1xyXG5cdFx0XHRcdFx0c3RvcmFnZU5hbWUuZGF0YS5wcm9jZWVkID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHN0b3JhZ2VOYW1lLmRhdGEucHJvY2VlZCA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuY3JlYXRlc3RvcmFnZWRhdGEoc3RvcmFnZU5hbWUuc3RvcmFnZU5hbWUsIEpTT04uc3RyaW5naWZ5KHN0b3JhZ2VOYW1lLmRhdGEpKTtcclxuXHRcdFx0dGhpcy5hZGRidXR0b25odG1sKCk7XHJcblx0XHR9LFxyXG5cdFx0YWxlcnRBY2NlcHRhbmNlOiBmdW5jdGlvbihzdG9yYWdlTmFtZSl7XHJcblx0XHRcdGxldCBhY2NlcHRhbmNlID0gdGhpcy5nZXRzdG9yYWdlZGF0YShzdG9yYWdlTmFtZS5zdG9yYWdlTmFtZSk7XHJcblx0XHRcdGxldCBwcm9jZWVkID0gZmFsc2U7XHJcblx0XHRcdGlmKGFjY2VwdGFuY2Upe1xyXG5cdFx0XHRcdGlmKCFhY2NlcHRhbmNlLnByb2NlZWQpe1xyXG5cdFx0XHRcdFx0c3RvcmFnZU5hbWUuZGF0YS5wcm9jZWVkID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c3RvcmFnZU5hbWUuZGF0YS5wcm9jZWVkID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmNyZWF0ZXN0b3JhZ2VkYXRhKHN0b3JhZ2VOYW1lLnN0b3JhZ2VOYW1lLCBKU09OLnN0cmluZ2lmeShzdG9yYWdlTmFtZS5kYXRhKSk7XHJcblx0XHRcdHRoaXMuYWRkYnV0dG9uaHRtbCgpO1xyXG5cdFx0fSxcclxuXHRcdC8vb3BlbmluZyB0aGUgVURBIHNjcmVlblxyXG5cdFx0b3Blbm1vZGFsOmZ1bmN0aW9uKGZvY3VzPWZhbHNlKXtcclxuICAgICAgICBcdGlmKHRoaXMuc2Vzc2lvbmRhdGEuYXV0aGVudGljYXRlZCkge1xyXG5cdFx0XHRcdGpRdWVyeShcIiN1ZGEtYnRuXCIpLmhpZGUoKTtcclxuXHRcdFx0XHRqUXVlcnkoJyN1ZGEtaHRtbC1jb250YWluZXInKS5zaG93KCk7XHJcblx0XHRcdFx0dmFyIHNlYXJjaGlucHV0PWpRdWVyeShcIiN1ZGEtc2VhcmNoLWlucHV0XCIpO1xyXG5cdFx0XHRcdHNlYXJjaGlucHV0LnZhbChcIlwiKTtcclxuXHRcdFx0XHRpZiAoZm9jdXMpIHtcclxuXHRcdFx0XHRcdHNlYXJjaGlucHV0LmZvY3VzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBib2R5Y2hpbGRyZW4gPSBkb2N1bWVudC5ib2R5LmNoaWxkTm9kZXM7XHJcblx0XHRcdFx0aWYgKGJvZHljaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRib2R5Y2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGRub2RlLCBjaGlsZG5vZGVpbmRleCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoY2hpbGRub2RlLmNsYXNzTGlzdCAmJiBjaGlsZG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY29udGFpbmVyXCIpKSB7XHJcblx0XHRcdFx0XHRcdFx0VURBUGx1Z2luU0RLLmNvbnRhaW5lcnNlY3Rpb25zLnB1c2goY2hpbGRub2RlaW5kZXgpO1xyXG5cdFx0XHRcdFx0XHRcdGNoaWxkbm9kZS5jbGFzc0xpc3QucmVtb3ZlKFwiY29udGFpbmVyXCIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChjaGlsZG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIChjaGlsZG5vZGUuaWQgIT09ICd1ZGEtYnRuJyAmJiBjaGlsZG5vZGUuaWQgIT09ICd1ZGEtaHRtbC1jb250YWluZXInKSAmJiBjaGlsZG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ3NjcmlwdCcgJiYgY2hpbGRub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09ICdub3NjcmlwdCcgJiYgY2hpbGRub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09ICdzdHlsZScpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoY2hpbGRub2RlLmNsYXNzTGlzdCAmJiAhY2hpbGRub2RlLmNsYXNzTGlzdC5jb250YWlucyhcInVkYS1vcmlnaW5hbC1jb250ZW50XCIpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRjaGlsZG5vZGUuY2xhc3NMaXN0LmFkZChcInVkYS1vcmlnaW5hbC1jb250ZW50XCIpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhciBzZXNzaW9uZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJSZXF1ZXN0VURBU2Vzc2lvbkRhdGFcIiwge2RldGFpbDoge2RhdGE6IFwiYXV0aHRlbmljYXRlXCJ9LCBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2V9KTtcclxuXHRcdFx0XHRkb2N1bWVudC5kaXNwYXRjaEV2ZW50KHNlc3Npb25ldmVudCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHQvL2Nsb3NpbmcgdGhlIFVEQSBzY3JlZW5cclxuXHRcdGNsb3NlbW9kYWw6ZnVuY3Rpb24oKXtcclxuXHRcdFx0alF1ZXJ5KFwiI3VkYS1hZHZhbmNlLXNlY3Rpb25cIikuc2hvdygpO1xyXG5cdFx0XHRqUXVlcnkoJyN1ZGEtaHRtbC1jb250YWluZXInKS5oaWRlKCk7XHJcblx0XHRcdHRoaXMucmVjb3JkZWRzZXF1ZW5jZWlkcz1bXTtcclxuXHRcdFx0alF1ZXJ5KFwiI3VkYS1idG5cIikuc2hvdygpO1xyXG5cdFx0XHR2YXIgbmF2Y29va2llZGF0YSA9IHtzaG93bmF2OiBmYWxzZSwgZGF0YToge30sIGF1dG9wbGF5OmZhbHNlLCBwYXVzZTpmYWxzZSwgc3RvcDpmYWxzZSwgbmF2Y29tcGxldGVkOmZhbHNlLCBuYXZpZ2F0ZWRkYXRhOltdLHNlYXJjaHRlcm06Jyd9O1xyXG5cdFx0XHR0aGlzLmNyZWF0ZXN0b3JhZ2VkYXRhKHRoaXMubmF2aWdhdGlvbmNvb2tpZW5hbWUsSlNPTi5zdHJpbmdpZnkobmF2Y29va2llZGF0YSkpO1xyXG5cdFx0XHQvLyB0aGlzLmNhbmNlbHJlY29yZGluZ3NlcXVlbmNlKGZhbHNlKTtcclxuXHRcdFx0bGV0IGJvZHljaGlsZHJlbiA9IGRvY3VtZW50LmJvZHkuY2hpbGROb2RlcztcclxuXHRcdFx0aWYgKGJvZHljaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Ym9keWNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkbm9kZSwgY2hpbGRub2RlaW5kZXgpIHtcclxuXHRcdFx0XHRcdGlmIChjaGlsZG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIChjaGlsZG5vZGUuaWQgIT09ICd1ZGEtYnRuJyAmJiBjaGlsZG5vZGUuaWQgIT09ICd1ZGEtaHRtbC1jb250YWluZXInKSAmJiBjaGlsZG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ3NjcmlwdCcgJiYgY2hpbGRub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09ICdub3NjcmlwdCcgJiYgY2hpbGRub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09ICdzdHlsZScpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNoaWxkbm9kZS5jbGFzc0xpc3QgJiYgY2hpbGRub2RlLmNsYXNzTGlzdC5jb250YWlucyhcInVkYS1vcmlnaW5hbC1jb250ZW50XCIpKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hpbGRub2RlLmNsYXNzTGlzdC5yZW1vdmUoXCJ1ZGEtb3JpZ2luYWwtY29udGVudFwiKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKFVEQVBsdWdpblNESy5jb250YWluZXJzZWN0aW9ucy5sZW5ndGggPiAwICYmIFVEQVBsdWdpblNESy5pbkFycmF5KGNoaWxkbm9kZWluZGV4LCBVREFQbHVnaW5TREsuY29udGFpbmVyc2VjdGlvbnMpICE9PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRjaGlsZG5vZGUuY2xhc3NMaXN0LmFkZChcImNvbnRhaW5lclwiKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdC8vcmVuZGVyIHRoZSByZXF1aXJlZCBodG1sIGZvciBzaG93aW5nIHVwIHRoZSBwcm9wZXIgaHRtbFxyXG5cdFx0c2hvd2h0bWw6ZnVuY3Rpb24oKXtcclxuXHRcdFx0dGhpcy5yZXJlbmRlcmh0bWw9ZmFsc2U7XHJcblx0XHRcdHZhciBhZGRuaXN0aWNvbj10cnVlO1xyXG5cdFx0XHR2YXIgY2hlY2tyZWNvcmRpbmcgPSB0aGlzLmdldHN0b3JhZ2VkYXRhKHRoaXMucmVjb3JkaW5nY29va2llbmFtZSk7XHJcblx0XHRcdGlmKGNoZWNrcmVjb3JkaW5nKXtcclxuXHRcdFx0XHR2YXIgY2hlY2tyZWNvcmRpbmdkYXRhPUpTT04ucGFyc2UoY2hlY2tyZWNvcmRpbmcpO1xyXG5cdFx0XHRcdGlmKGNoZWNrcmVjb3JkaW5nZGF0YS5oYXNPd25Qcm9wZXJ0eShcInJlY29yZGluZ1wiKSAmJiBjaGVja3JlY29yZGluZ2RhdGEucmVjb3JkaW5nKXtcclxuXHRcdFx0XHRcdGFkZG5pc3RpY29uPWZhbHNlO1xyXG5cdFx0XHRcdFx0dGhpcy5yZWNvcmRpbmc9dHJ1ZTtcclxuXHRcdFx0XHRcdHRoaXMub3Blbm1vZGFsKGZhbHNlKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5yZWNvcmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoYWRkbmlzdGljb24pe1xyXG5cdFx0XHRcdHRoaXMuYWRkdm9pY2VzZWFyY2htb2RhbChhZGRuaXN0aWNvbik7XHJcblx0XHRcdFx0dmFyIG5hdmlnYXRpb25jb29raWU9dGhpcy5nZXRzdG9yYWdlZGF0YSh0aGlzLm5hdmlnYXRpb25jb29raWVuYW1lKTtcclxuXHRcdFx0XHRpZihuYXZpZ2F0aW9uY29va2llKXtcclxuXHRcdFx0XHRcdHZhciBuYXZpZ2F0aW9uY29va2llZGF0YSA9IEpTT04ucGFyc2UobmF2aWdhdGlvbmNvb2tpZSk7XHJcblx0XHRcdFx0XHRpZihuYXZpZ2F0aW9uY29va2llZGF0YS5zaG93bmF2KSB7XHJcblx0XHRcdFx0XHRcdHRoaXMub3Blbm1vZGFsKCk7XHJcblx0XHRcdFx0XHRcdGlmKG5hdmlnYXRpb25jb29raWVkYXRhLmF1dG9wbGF5KXtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmF1dG9wbGF5PXRydWU7XHJcblx0XHRcdFx0XHRcdFx0aWYoIXRoaXMucGxheU5leHRBY3Rpb24pIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0dGhpcy5zaG93c2VsZWN0ZWRyb3cobmF2aWdhdGlvbmNvb2tpZWRhdGEuZGF0YSxuYXZpZ2F0aW9uY29va2llZGF0YS5kYXRhLmlkLHRydWUsIG5hdmlnYXRpb25jb29raWVkYXRhKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuc2VhcmNoaW5lbGFzdGljKCcnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8vL1VEQUNvbnNvbGVMb2dnZXIuaW5mbygnaGVyZSBhdCBzaG93aHRtbCBmdW5jdGlvbicpO1xyXG5cdFx0XHRcdFx0dGhpcy5zZWFyY2hpbmVsYXN0aWMoJycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmFkZHZvaWNlc2VhcmNobW9kYWwoYWRkbmlzdGljb24pO1xyXG5cdFx0XHRcdHRoaXMuc2hvd3JlY29yZGVkcmVzdWx0cygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuZGlzYWJsZVJlY29yZEJ1dHRvbigpO1xyXG5cdFx0fSxcclxuXHRcdC8vIGluZGV4aW5nIGFsbCBub2RlcyBhZnRlciBhbGwgdGhlIGNsaWNrbm9kZXMgYXJlIGF2YWlsYWJsZVxyXG5cdFx0aW5kZXhjbGlja25vZGVzOiBmdW5jdGlvbigpe1xyXG5cdFx0XHR0aGlzLnByb2Nlc3Njb3VudD1VREFDbGlja09iamVjdHMubGVuZ3RoO1xyXG5cdFx0XHR0aGlzLnByZXZpb3VzdXJsPXRoaXMuY3VycmVudHVybD13aW5kb3cubG9jYXRpb24uaHJlZjtcclxuXHRcdFx0dGhpcy5wcm9jZXNzaW5nbm9kZXM9dHJ1ZTtcclxuXHRcdFx0Ly8gaW5kZXhpbmcgbm9kZXMgaGFzIGJlZW4gY2FsbGVkIGZvciBhZGRpbmcgY2xpY2sgZGV0ZWN0aW9uXHJcblx0XHRcdHRoaXMuaW5kZXhkb20oZG9jdW1lbnQuYm9keSk7XHJcblx0XHRcdHRoaXMucHJvY2Vzc2VkY2xpY2tvYmplY3RzY291bnQ9dGhpcy5wcm9jZXNzY291bnQ7XHJcblx0XHRcdHRoaXMudG90YWxjb3VudD1VREFDbGlja09iamVjdHMubGVuZ3RoO1xyXG5cdFx0XHR0aGlzLnByb2Nlc3Npbmdub2Rlcz1mYWxzZTtcclxuXHRcdFx0aWYodGhpcy5wcm9jZXNzY291bnQ8dGhpcy50b3RhbGNvdW50KXtcclxuXHRcdFx0XHQvL1x0dG9kbyByZWZpbmUgdGhlIHByb2Nlc3Npbmcgbm9kZXMuXHJcblx0XHRcdFx0dGhpcy5pbmRleG5ld2NsaWNrbm9kZXMoKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0VURBTGFzdEluZGV4VGltZT1EYXRlLm5vdygpO1xyXG5cdFx0fSxcclxuXHRcdC8vIGluZGV4aW5nIG5ldyBjbGlja25vZGVzIGFmdGVyIG5ldyBodG1sIGdvdCBsb2FkZWRcclxuXHRcdGluZGV4bmV3Y2xpY2tub2RlczogYXN5bmMgZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYodGhpcy5wcm9jZXNzaW5nbm9kZXMpe1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLnByb2Nlc3Njb3VudD1VREFDbGlja09iamVjdHMubGVuZ3RoO1xyXG5cdFx0XHRpZihVREFMYXN0SW5kZXhUaW1lIT09MCAmJiBVREFMYXN0SW5kZXhUaW1lPlVEQUxhc3RNdXRhdGlvblRpbWUpe1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRVREFMYXN0SW5kZXhUaW1lPURhdGUubm93KCk7XHJcblx0XHRcdHRoaXMucHJvY2Vzc2luZ25vZGVzPXRydWU7XHJcblx0XHRcdGlmKGF3YWl0IHRoaXMucmVtb3ZlZnJvbWh0bWxpbmRleCgpKSB7XHJcblx0XHRcdFx0dGhpcy5pbmRleG5ld25vZGVzID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnR1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuXHRcdFx0XHR0aGlzLmluZGV4ZG9tKGRvY3VtZW50LmJvZHkpO1xyXG5cdFx0XHRcdHRoaXMucHJvY2Vzc2VkY2xpY2tvYmplY3RzY291bnQgPSB0aGlzLnByb2Nlc3Njb3VudDtcclxuXHRcdFx0XHR0aGlzLnByb2Nlc3Npbmdub2RlcyA9IGZhbHNlO1xyXG5cdFx0XHRcdHRoaXMudG90YWxjb3VudCA9IFVEQUNsaWNrT2JqZWN0cy5sZW5ndGg7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodGhpcy5wcm9jZXNzY291bnQ8dGhpcy50b3RhbGNvdW50KXtcclxuXHRcdFx0XHQvL3RvZG8gbmV3IG5vZGVzIGFkZGVkIG5lZWQgdG8gcmVwcm9jZXNzXHJcblx0XHRcdFx0Ly8vL1VEQUNvbnNvbGVMb2dnZXIuaW5mbygnTmVlZCB0byBkbyB0aGUgcHJvY2Vzc2luZycpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHRoaXMubmF2aWdhdGVkVG9OZXh0UGFnZS5jaGVjayAmJiB0aGlzLm5hdmlnYXRlZFRvTmV4dFBhZ2UudXJsID09PSB3aW5kb3cubG9jYXRpb24uaHJlZil7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1VEQVBsdWdpblNESy5zaG93aHRtbCgpO30sIDUwMDApO1xyXG5cdFx0XHRcdHRoaXMubmF2aWdhdGVkVG9OZXh0UGFnZS5jaGVjayA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0cmVtb3ZlZnJvbWh0bWxpbmRleDphc3luYyBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZiAodGhpcy5mb3JjZVJlaW5kZXgpIHtcclxuXHRcdFx0XHR0aGlzLmh0bWxpbmRleCA9IFtdO1xyXG5cdFx0XHRcdHRoaXMuZm9yY2VSZWluZGV4ID0gZmFsc2U7XHJcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0aGlzLmh0bWxpbmRleC5sZW5ndGg+MCl7XHJcblx0XHRcdFx0bGV0IG5ld2h0bWxpbmRleD1bXTtcclxuXHRcdFx0XHRsZXQgaHRtbGluZGV4bGVuZ3RoPXRoaXMuaHRtbGluZGV4Lmxlbmd0aDtcclxuXHRcdFx0XHRmb3IodmFyIGh0bWxpPTA7aHRtbGk8aHRtbGluZGV4bGVuZ3RoO2h0bWxpKyspIHtcclxuXHRcdFx0XHRcdGxldCBjaGVja25vZGU9dGhpcy5odG1saW5kZXhbaHRtbGldO1xyXG5cdFx0XHRcdFx0bGV0IHJlbW92ZWRjbGlja29iamVjdHNsZW5ndGg9VURBUmVtb3ZlZENsaWNrT2JqZWN0cy5sZW5ndGg7XHJcblx0XHRcdFx0XHRsZXQgZm91bmRyZW1vdmVkaW5kZXhlZG5vZGU9LTE7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IHJlbW92ZWRjbGlja29iamVjdHNsZW5ndGg7IGsrKykge1xyXG5cdFx0XHRcdFx0XHRpZihVREFSZW1vdmVkQ2xpY2tPYmplY3RzW2tdLmVsZW1lbnQgPT09IHdpbmRvdyl7XHJcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0bGV0IHJlbW92ZWRjbGlja29iamVjdD1VREFSZW1vdmVkQ2xpY2tPYmplY3RzW2tdLmVsZW1lbnQ7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoY2hlY2tub2RlWydlbGVtZW50LWRhdGEnXS5pc1NhbWVOb2RlKHJlbW92ZWRjbGlja29iamVjdCkpIHtcclxuXHRcdFx0XHRcdFx0XHRmb3VuZHJlbW92ZWRpbmRleGVkbm9kZT1rO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZihmb3VuZHJlbW92ZWRpbmRleGVkbm9kZT09PS0xKXtcclxuXHRcdFx0XHRcdFx0bmV3aHRtbGluZGV4LnB1c2goY2hlY2tub2RlKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFVEQVJlbW92ZWRDbGlja09iamVjdHMuc3BsaWNlKGZvdW5kcmVtb3ZlZGluZGV4ZWRub2RlLDEpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmh0bWxpbmRleD1uZXdodG1saW5kZXg7XHJcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgxKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdC8vIGluZGV4aW5nIGZ1bmN0aW9uYWxpdHkgZm9yIHRoZSBlbnRpcmUgZG9tXHJcblx0XHRpbmRleGRvbTogZnVuY3Rpb24oIG5vZGUsIHJldD1mYWxzZSwgcGFyZW50bm9kZT1cIlwiLCB0ZXh0bGFiZWw9XCJcIiwgaGFzcGFyZW50bm9kZWNsaWNrPWZhbHNlLCBwYXJlbnRjbGlja25vZGU9IG51bGwgKSB7XHJcblx0XHRcdHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xyXG5cdFx0XHRcdGNhc2UgTm9kZS5FTEVNRU5UX05PREU6XHJcblxyXG5cdFx0XHRcdFx0aWYoIXJldCAmJiBwYXJlbnRub2RlIT09XCJcIikge1xyXG5cdFx0XHRcdFx0XHR0cnl7XHJcblx0XHRcdFx0XHRcdFx0bm9kZSA9IHRoaXMuaW5kZXhub2RlKG5vZGUsIHBhcmVudG5vZGUsIGhhc3BhcmVudG5vZGVjbGljaywgZmFsc2UsIHBhcmVudGNsaWNrbm9kZSk7XHJcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdFx0XHRVREFFcnJvckxvZ2dlci5lcnJvcignVW5hYmxlIHRvIGluZGV4IG5vZGUgJytub2RlLm5vZGVOYW1lKycgZ290IGV4Y2VwdGlvbiAnK2UpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBub2RlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdG5vZGUuaGFzY2hpbGRjbGljaz1mYWxzZTtcclxuXHJcblx0XHRcdFx0XHQvLyBDaGVja2luZyBmb3IgaWdub3JlIG5vZGVzIGR1cmluZyBpbmRleGluZ1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaW5BcnJheShub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksIHRoaXMuaWdub3JlTm9kZXNGcm9tSW5kZXhpbmcpICE9PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRpZihub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdja2VkaXRvcicgJiYgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aD4yICYmIHRoaXMucmVjb3JkaW5nKXtcclxuXHRcdFx0XHRcdFx0XHRsZXQgYWRkVG9vbFRpcCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0Zm9yKGxldCBjaGVja25vZGUgb2YgdGhpcy50b29sdGlwRGlzcGxheWVkTm9kZXMpe1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYobm9kZS5pc1NhbWVOb2RlKGNoZWNrbm9kZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YWRkVG9vbFRpcCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZihhZGRUb29sVGlwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnRvb2x0aXBEaXNwbGF5ZWROb2Rlcy5wdXNoKG5vZGUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5hZGRUb29sVGlwKG5vZGUsIG5vZGUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCAnV2UgaGF2ZSBkZXRlY3RlZCBhIHJpY2ggdGV4dCBlZGl0b3IuIFRvIHJlY29yZCB0aGlzIGluIHlvdXIgc2VxdWVuY2UsIFBsZWFzZSBjbGljayBvbiB0aGUgZWRpdG9yIG1lbnUuIFdlIGFyZSB1bmFibGUgdG8gcmVjb3JkIGNsaWNrcyBvbiB0aGUgdGV4dCBhcmVhLicsIGZhbHNlLCBmYWxzZSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYoIW5vZGUuaGFzY2xpY2sgJiYgdGhpcy5pbkFycmF5KG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSwgdGhpcy5hZGRDbGlja1RvU3BlY2lhbE5vZGVzKSAhPT0gLTEgJiYgdGhpcy5pbkFycmF5KG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSwgdGhpcy5pZ25vcmVDbGlja3NPblNwZWNpYWxOb2RlcykgPT09IC0xKXtcclxuXHRcdFx0XHRcdFx0XHQvLy8vVURBQ29uc29sZUxvZ2dlci5pbmZvKCdDaGlsZCBub2RlcyBpZ25vcmVkIGZvciBub2RlIGFuZCBhZGRlZCBjbGljayB0bzogJyArIG5vZGUubm9kZU5hbWUpO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYWRkQ2xpY2tUb05vZGUobm9kZSk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZih0aGlzLmNhbmNlbFJlY29yZGluZ0R1cmluZ1JlY29yZGluZ05vZGVzLmluZGV4T2Yobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSAhPT0gLTEpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyB0aGlzLmFkZENsaWNrVG9Ob2RlKG5vZGUpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdC8vLy9VREFDb25zb2xlTG9nZ2VyLmluZm8oJ0NoaWxkIG5vZGVzIGlnbm9yZWQgZm9yIG5vZGU6ICcgKyBub2RlLm5vZGVOYW1lKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlIGlmKG5vZGUuY2xhc3NMaXN0ICYmICgobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdDItY29udGFpbmVyLS1vcGVuJykgJiYgIW5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3QyLWNvbnRhaW5lci0tZm9jdXMnKSkpKXtcclxuXHRcdFx0XHRcdC8vXHRkbyBub3RoaW5nIGFzIHdlIGFyZSBub3QgZ29pbmcgdG8gZGVhbCB3aXRoIHNwZWNpYWwgY2xhc3Nlc1xyXG5cdFx0XHRcdFx0XHQvLy8vVURBQ29uc29sZUxvZ2dlci5pbmZvKCd1bndhbnRlZCBpbmRleGluZyBwcmV2ZW50aW9uJyk7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImRpdlwiICYmIChub2RlLmhhc0F0dHJpYnV0ZShcInVpYi1kYXRlcGlja2VyLXBvcHVwLXdyYXBcIikgfHwgKG5vZGUuaWQgJiYgbm9kZS5pZD09PSdyZWNvZ25pemVfbW9kYWwnKSkpe1xyXG5cdFx0XHRcdFx0XHQvLyBmaXggZm9yIG5vdCBpbmRleGluZyBkYXRlcGlja2VyIHBvcHVwIGFuZCBub21pbmF0ZSBwb3B1cFxyXG5cdFx0XHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbygnZGF0ZSBwaWNrZXIgaW4gamF2YXNjcmlwdCcpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmKG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJzcGFuXCIgJiYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwicmFkaW9cIikgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoXCJyZXBsYWNlbWVudFwiKSkpe1xyXG5cdFx0XHRcdFx0XHR0aGlzLmFkZENsaWNrVG9Ob2RlKG5vZGUpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmKHRoaXMuY2hlY2tDc3NDbGFzc05hbWVzKG5vZGUpKXtcclxuXHRcdFx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oe2Nzc0lnbm9yZWROb2RlOm5vZGV9LCAzKTtcclxuXHRcdFx0XHRcdFx0Ly8gdGhpcy5hZGRDbGlja1RvTm9kZShub2RlKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZihub2RlLmhhc0NoaWxkTm9kZXMoKSl7XHJcblx0XHRcdFx0XHRcdHZhciBjaGlsZG5vZGVzID0gIG5vZGUuY2hpbGROb2RlcztcclxuXHRcdFx0XHRcdFx0dmFyIGhhc3BhcmVudGNsaWNrID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdGlmKG5vZGUuaGFzT3duUHJvcGVydHkoXCJoYXNjbGlja1wiKSB8fCBoYXNwYXJlbnRub2RlY2xpY2spe1xyXG5cdFx0XHRcdFx0XHRcdGhhc3BhcmVudGNsaWNrPXRydWU7XHJcblx0XHRcdFx0XHRcdFx0aWYocGFyZW50Y2xpY2tub2RlPT09XCJcIil7XHJcblx0XHRcdFx0XHRcdFx0XHRwYXJlbnRjbGlja25vZGU9bm9kZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGlmKGNoaWxkbm9kZXMubGVuZ3RoPjApe1xyXG5cdFx0XHRcdFx0XHRcdGZvciAodmFyIGk9MDtpPGNoaWxkbm9kZXMubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgY2hpbGRub2RlPWNoaWxkbm9kZXNbaV07XHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLm5vZGVpZCsrO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYodGhpcy5pZ25vcmVlbGVtZW50cy5pbmRleE9mKGNoaWxkbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKT09PS0xKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmKHJldCl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYodGV4dGxhYmVsPT09XCJcIil7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0ZXh0bGFiZWwgPSB0aGlzLmluZGV4ZG9tKGNoaWxkbm9kZSwgcmV0LCBub2RlLCB0ZXh0bGFiZWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1lbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRleHRsYWJlbCArPSBcIiBcIiArIHRoaXMuaW5kZXhkb20oY2hpbGRub2RlLCByZXQsIG5vZGUsIHRleHRsYWJlbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLmNoaWxkTm9kZXNbaV0gPSB0aGlzLmluZGV4ZG9tKGNoaWxkbm9kZSwgcmV0LCBub2RlLCBcIlwiLCBoYXNwYXJlbnRjbGljaywgcGFyZW50Y2xpY2tub2RlKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9Y2F0Y2goZSl7fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKG5vZGUuY2hpbGROb2Rlc1tpXS5oYXNPd25Qcm9wZXJ0eShcImhhc2NsaWNrXCIpICYmIG5vZGUuY2hpbGROb2Rlc1tpXS5oYXNjbGljayl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLmhhc2NoaWxkY2xpY2s9dHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoaGFzcGFyZW50Y2xpY2sgJiYgbm9kZS5jaGlsZE5vZGVzW2ldLmhhc093blByb3BlcnR5KFwiaGFzY2hpbGRjbGlja1wiKSAmJiBub2RlLmNoaWxkTm9kZXNbaV0uaGFzY2hpbGRjbGljayl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLmhhc2NoaWxkY2xpY2s9dHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBhZGQgY2xpY2sgdG8gbm9kZSB0byBzZW5kIHdoYXQgdXNlciBoYXMgY2xpY2tlZC5cclxuXHRcdFx0XHRcdC8vIGtub3duIHNjZW5hcmlvIHRoYXQgbm9kZSBoYXMgcGFyZW50IGNsaWNrXHJcblx0XHRcdFx0XHRpZihub2RlLmhhc093blByb3BlcnR5KFwiaGFzY2xpY2tcIikgJiYgbm9kZS5oYXNjbGljayAmJiAobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpPT09XCJzZWxlY3RcIiB8fCAhbm9kZS5oYXNjaGlsZGNsaWNrKSl7XHJcblx0XHRcdFx0XHRcdG5vZGU9dGhpcy5hZGRDbGlja1RvTm9kZShub2RlKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZihub2RlLmhhc093blByb3BlcnR5KFwiaGFzY2xpY2tcIikgJiYgbm9kZS5oYXNjbGljayAmJiBub2RlLmhhc2NoaWxkY2xpY2spe1xyXG5cdFx0XHRcdFx0XHRub2RlPXRoaXMuYWRkQ2xpY2tUb05vZGUobm9kZSx0cnVlKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIE5vZGUuVEVYVF9OT0RFOlxyXG5cdFx0XHRcdFx0aWYobm9kZS5ub2RlVmFsdWUhPT1cIlwiKSB7XHJcblx0XHRcdFx0XHRcdHRleHRsYWJlbCA9IG5vZGUubm9kZVZhbHVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHJldCAmJiB0ZXh0bGFiZWwhPT1cIlwiKXtcclxuXHRcdFx0XHRyZXR1cm4gdGV4dGxhYmVsO1xyXG5cdFx0XHR9IGVsc2UgaWYoIXJldCkge1xyXG5cdFx0XHRcdHJldHVybiBub2RlO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0Ly9jaGVjayBjc3MgY2xhc3NuYW1lcyBmb3IgaWdub3JpbmdcclxuXHRcdGNoZWNrQ3NzQ2xhc3NOYW1lczpmdW5jdGlvbihub2RlKXtcclxuXHRcdFx0bGV0IGNzc0NsYXNzRXhpc3Q9ZmFsc2U7XHJcblx0XHRcdGlmKHRoaXMuaWdub3JlTm9kZXNDb250YWluaW5nQ2xhc3NOYW1lcy5sZW5ndGg+MCl7XHJcblx0XHRcdFx0Zm9yKGNvbnN0IGNsYXNzbmFtZSBvZiB0aGlzLmlnbm9yZU5vZGVzQ29udGFpbmluZ0NsYXNzTmFtZXMpIHtcclxuXHRcdFx0XHRcdGlmKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzbmFtZSkpe1xyXG5cdFx0XHRcdFx0XHRjc3NDbGFzc0V4aXN0PXRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBjc3NDbGFzc0V4aXN0O1xyXG5cdFx0fSxcclxuXHRcdC8vIENoZWNrIGZvciBlYWNoIG5vZGUgYW5kIHRoZW4gbWF0Y2ggaXQgd2l0aCB0aGUgYXZhaWxhYmxlIGNsaWNrbm9kZXMgd2hpY2ggYXJlIGlkZW50aWZpZWQgYnkgbGlua3MuanNcclxuXHRcdGluZGV4bm9kZTogZnVuY3Rpb24obm9kZSwgcGFyZW50bm9kZSwgaGFzcGFyZW50bm9kZWNsaWNrPWZhbHNlLCBmcm9tZG9jdW1lbnRjbGljaz1mYWxzZSwgcGFyZW50Y2xpY2tub2RlPVwiXCIpe1xyXG5cdFx0XHR2YXIgZWxlbWVudGRhdGEgPSB7XCJlbGVtZW50LXR5cGVcIjogXCJcIiwgXCJlbGVtZW50LWxhYmVsc1wiIDogW10sIFwiZWxlbWVudC1hY3Rpb25cIiA6IFwiXCIsIFwiZWxlbWVudC1wYXRoXCIgOiBcIlwiLFwiZWxlbWVudC11cmxcIjpcIlwiLCBcImVsZW1lbnQtZGF0YVwiOltdLFwibWVudS1pdGVtc1wiOltdfTtcclxuXHJcblx0XHRcdHZhciBjbGlja29iamVjdGV4aXN0cz1mYWxzZTtcclxuXHRcdFx0dmFyIHVkYUNsaWNrT2JqZWN0PXt9O1xyXG5cclxuXHRcdFx0aWYobm9kZS5oYXNBdHRyaWJ1dGUoXCJuaXN0LXZvaWNlXCIpICYmIG5vZGUuZ2V0QXR0cmlidXRlKFwibmlzdC12b2ljZVwiKSl7XHJcblx0XHRcdFx0cmV0dXJuIG5vZGU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKG5vZGUuaGFzQXR0cmlidXRlKFwidWRhLWFkZGVkXCIpICYmIG5vZGUuZ2V0QXR0cmlidXRlKFwidWRhLWFkZGVkXCIpKXtcclxuXHRcdFx0XHRyZXR1cm4gbm9kZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnbWF0LWNoZWNrYm94Jyl7XHJcblx0XHRcdFx0cmV0dXJuIG5vZGU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHRoaXMuaW5BcnJheShub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksIHRoaXMuaWdub3JlQ2xpY2tzT25TcGVjaWFsTm9kZXMpICE9PSAtMSl7XHJcblx0XHRcdFx0cmV0dXJuIG5vZGU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBhcmVudG5vZGUuY2xhc3NMaXN0ICYmIHBhcmVudG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwidGFiLWNvbnRlbnRcIikpe1xyXG5cdFx0XHRcdG5vZGUuZGlzcGxheXR5cGUgPSBcInRhYi1jb250ZW50XCI7XHJcblx0XHRcdFx0bm9kZS50YWJpZCA9IG5vZGUuaWQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIE11bHRpcGxlIGNsaWNrcyBhcmUgcmVjb3JkZWQgZm9yIHNlbGVjdDItc2VsZWN0aW9uIGNsYXNzLiBzZWxlY3QyLXNlbGVjdGlvbi0tbXVsdGlwbGVcclxuXHRcdFx0Ly8gVGhpcyB3aWxsIGNyZWF0ZSBhIHByb2JsZW0gZHVyaW5nIHBsYXliYWNrLiBXZSBzaG91bGQgcmVjb3JkIG9ubHkgb25lIGNsaWNrIHRvIGF2b2lkIHRoaXMgcHJvYmxlbVxyXG5cdFx0XHRpZihub2RlLmNsYXNzTGlzdCAmJiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoXCJzZWxlY3QyLXNlYXJjaF9fZmllbGRcIikgfHwgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2Nkay1vdmVybGF5LWJhY2tkcm9wJykgfHwgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2Nkay1vdmVybGF5LXBhbmUnKSkpIHtcclxuXHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyhub2RlLmNsYXNzTGlzdCk7XHJcblx0XHRcdFx0cmV0dXJuIG5vZGU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKG5vZGUuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKXtcclxuXHRcdFx0XHRyZXR1cm4gbm9kZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYobm9kZS5oYXNBdHRyaWJ1dGUoJ3JlYWRPbmx5Jykpe1xyXG5cdFx0XHRcdC8vIHJldHVybiBub2RlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZih0aGlzLmh0bWxpbmRleC5sZW5ndGg+MCl7XHJcblx0XHRcdFx0Zm9yKHZhciBodG1saT0wO2h0bWxpPHRoaXMuaHRtbGluZGV4Lmxlbmd0aDtodG1saSsrKXtcclxuXHRcdFx0XHRcdGlmKG5vZGUuaXNTYW1lTm9kZSh0aGlzLmh0bWxpbmRleFtodG1saV1bJ2VsZW1lbnQtZGF0YSddKSl7XHJcblx0XHRcdFx0XHRcdG5vZGUuaGFzY2xpY2s9dHJ1ZTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIG5vZGU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IFVEQUNsaWNrT2JqZWN0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmKFVEQUNsaWNrT2JqZWN0c1tpXS5lbGVtZW50PT09d2luZG93KXtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAobm9kZS5pc1NhbWVOb2RlKFVEQUNsaWNrT2JqZWN0c1tpXS5lbGVtZW50KSkge1xyXG5cdFx0XHRcdFx0Y2xpY2tvYmplY3RleGlzdHMgPSB0cnVlO1xyXG5cdFx0XHRcdFx0dWRhQ2xpY2tPYmplY3QgPSBVREFDbGlja09iamVjdHNbaV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZih0aGlzLmluQXJyYXkobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLCB0aGlzLmlnbm9yZU5vZGVzRnJvbUluZGV4aW5nKSAhPT0gLTEpIHtcclxuXHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyh7aW5kZXhpbmdub2RlOiBub2RlfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKG5vZGUuaGFzQXR0cmlidXRlKFwidHlwZVwiKSAmJiBub2RlLmdldEF0dHJpYnV0ZShcInR5cGVcIikgPT09IFwiaGlkZGVuXCIpe1xyXG5cdFx0XHRcdHJldHVybiBub2RlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihmcm9tZG9jdW1lbnRjbGljayl7XHJcblx0XHRcdFx0Y2xpY2tvYmplY3RleGlzdHMgPSB0cnVlO1xyXG5cdFx0XHRcdHVkYUNsaWNrT2JqZWN0ID0gbm9kZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoY2xpY2tvYmplY3RleGlzdHMpe1xyXG5cdFx0XHRcdG5vZGUuaGFzY2xpY2s9dHJ1ZTtcclxuXHRcdFx0XHRlbGVtZW50ZGF0YVtcImVsZW1lbnQtdHlwZVwiXSA9IG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcclxuXHRcdFx0XHRlbGVtZW50ZGF0YVtcImVsZW1lbnQtdXJsXCJdID0gIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG5cclxuXHRcdFx0XHRpZihwYXJlbnRub2RlLmNsYXNzTGlzdCAmJiBwYXJlbnRub2RlLmNsYXNzTGlzdC5jb250YWlucyhcInRhYi1jb250ZW50XCIpKXtcclxuXHRcdFx0XHRcdG5vZGUuZGlzcGxheXR5cGUgPSBcInRhYi1jb250ZW50XCI7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZihlbGVtZW50ZGF0YVtcImVsZW1lbnQtbGFiZWxzXCJdLmxlbmd0aD09PTApe1xyXG5cdFx0XHRcdFx0ZWxlbWVudGRhdGFbXCJlbGVtZW50LWxhYmVsc1wiXSA9IHRoaXMuZ2V0SW5wdXRMYWJlbHMobm9kZSxbXSwxKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmKGVsZW1lbnRkYXRhW1wiZWxlbWVudC1sYWJlbHNcIl0ubGVuZ3RoPT09MCl7XHJcblx0XHRcdFx0XHRyZXR1cm4gbm9kZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmKChub2RlLmhhc093blByb3BlcnR5KFwiZGlzcGxheXR5cGVcIikgJiYgbm9kZS5kaXNwbGF5dHlwZT09PVwidGFiLWNvbnRlbnRcIikgfHwgKG5vZGUuaGFzT3duUHJvcGVydHkoXCJuYXZ0eXBlXCIpICYmIG5vZGUubmF2dHlwZT09PVwibmF2dGFiXCIpKXtcclxuXHRcdFx0XHRcdGZvcih2YXIgaj0wO2o8dGhpcy5tZW51aXRlbXMubGVuZ3RoO2orKyl7XHJcblx0XHRcdFx0XHRcdHZhciBtZW51aXRlbT10aGlzLm1lbnVpdGVtc1tqXTtcclxuXHRcdFx0XHRcdFx0aWYobWVudWl0ZW0ucmVmaWQgPT09IG5vZGUudGFiaWQpIHtcclxuXHRcdFx0XHRcdFx0XHRpZihtZW51aXRlbS5tZW51bm9kZS5oYXNPd25Qcm9wZXJ0eShcInBhdGhcIikpe1xyXG5cdFx0XHRcdFx0XHRcdFx0bm9kZS5wYXRoID0gIG1lbnVpdGVtLm1lbnVub2RlLnBhdGgrXCI+XCIrbWVudWl0ZW0ubmFtZTtcclxuXHRcdFx0XHRcdFx0XHR9ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRub2RlLnBhdGggPSBtZW51aXRlbS5uYW1lO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZihub2RlLmhhc093blByb3BlcnR5KFwibWVudWl0ZW1zXCIpKXtcclxuXHRcdFx0XHRcdFx0XHRcdG5vZGUubWVudWl0ZW1zLnB1c2gobWVudWl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRub2RlLm1lbnVpdGVtcz1bXTtcclxuXHRcdFx0XHRcdFx0XHRcdG5vZGUubWVudWl0ZW1zLnB1c2gobWVudWl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoZWxlbWVudGRhdGFbXCJlbGVtZW50LXBhdGhcIl09PT1cIlwiKSB7XHJcblx0XHRcdFx0XHRpZiAobm9kZS5oYXNPd25Qcm9wZXJ0eShcInBhdGhcIikpIHtcclxuXHRcdFx0XHRcdFx0ZWxlbWVudGRhdGFbXCJlbGVtZW50LXBhdGhcIl0gPSBub2RlLnBhdGg7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZihub2RlLmdldEF0dHJpYnV0ZShcImRhdGEtdG9nZ2xlXCIpICYmIG5vZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS10b2dnbGVcIik9PT1cInRhYlwiKXtcclxuXHRcdFx0XHRcdG5vZGUubmF2dHlwZT1cIm5hdnRhYlwiO1xyXG5cdFx0XHRcdFx0ZWxlbWVudGRhdGFbXCJlbGVtZW50LWFjdGlvblwiXSA9IFwibmF2dGFiXCI7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgdWRhX2N1c3RvbSA9IHtoYXNwYXJlbnRjbGljazogZmFsc2UsIHBhcmVudG5vZGU6IHt9LCBkb21Kc29uOiBkb21KU09OLnRvSlNPTihub2RlKX07XHJcblx0XHRcdFx0aWYoaGFzcGFyZW50bm9kZWNsaWNrKSB7XHJcblx0XHRcdFx0XHR1ZGFfY3VzdG9tLmhhc3BhcmVudGNsaWNrID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHVkYV9jdXN0b20ucGFyZW50bm9kZSA9IHBhcmVudG5vZGU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5vZGUudWRhX2N1c3RvbSA9IHVkYV9jdXN0b207XHJcblxyXG5cdFx0XHRcdGVsZW1lbnRkYXRhW1wiZWxlbWVudC1kYXRhXCJdID0gbm9kZTtcclxuXHRcdFx0XHRlbGVtZW50ZGF0YVtcImNsaWNrb2JqZWN0XCJdID0gdWRhQ2xpY2tPYmplY3Q7XHJcblxyXG5cdFx0XHRcdHRoaXMuaHRtbGluZGV4LnB1c2goZWxlbWVudGRhdGEpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gbm9kZTtcclxuXHRcdH0sXHJcblx0XHQvLyBnZXR0aW5nIHRoZSB0ZXh0IGZvciB0aGUgY2xpY2tub2Rlcy5cclxuXHRcdGdldElucHV0TGFiZWxzOiBmdW5jdGlvbihub2RlLCBpbnB1dGxhYmVscywgaXRlcmF0aW9ubm8sIGl0ZXJhdGU9dHJ1ZSwgZ2V0Y2hpbGRsYWJlbHM9dHJ1ZSwgZnJvbWNsaWNrPWZhbHNlLCBpdGVyYXRlbGltaXQ9MywgaWdub3Jlbm9kZT1bXSl7XHJcblxyXG5cdFx0XHRpZihBcnJheS5pc0FycmF5KGlnbm9yZW5vZGUpKXtcclxuXHRcdFx0XHRpZ25vcmVub2RlPW5vZGU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKChub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwic2VsZWN0XCIgfHwgbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImNoZWNrYm94XCIpICYmIGl0ZXJhdGUgJiYgaW5wdXRsYWJlbHMubGVuZ3RoPT09MCl7XHJcblx0XHRcdFx0aXRlcmF0aW9ubm8rKztcclxuXHRcdFx0XHRpbnB1dGxhYmVscyA9IHRoaXMuZ2V0SW5wdXRMYWJlbHMobm9kZS5wYXJlbnROb2RlLCBpbnB1dGxhYmVscywgaXRlcmF0aW9ubm8sIGl0ZXJhdGUsIHRydWUsIGZyb21jbGljaywgaXRlcmF0ZWxpbWl0LCBpZ25vcmVub2RlKTtcclxuXHRcdFx0XHRpZihmcm9tY2xpY2spIHtcclxuXHRcdFx0XHRcdC8vdG9kbyBuZWVkIHRvIHJld29ya1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlucHV0XCIgfHwgbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInRleHRhcmVhXCIgfHwgbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImltZ1wiKXtcclxuXHJcblx0XHRcdFx0aWYobm9kZS5nZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKSAmJiBub2RlLmdldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIpIT09XCJcIikge1xyXG5cdFx0XHRcdFx0aW5wdXRsYWJlbHMucHVzaCh7XCJ0ZXh0XCI6bm9kZS5nZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKS50b1N0cmluZygpLFwibWF0Y2hcIjpmYWxzZX0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihub2RlLmdldEF0dHJpYnV0ZShcInR5cGVcIikgJiYgKG5vZGUuZ2V0QXR0cmlidXRlKFwidHlwZVwiKS50b0xvd2VyQ2FzZSgpPT09XCJzdWJtaXRcIiB8fCBub2RlLmdldEF0dHJpYnV0ZShcInR5cGVcIikudG9Mb3dlckNhc2UoKT09PVwiZmlsZVwiKSkge1xyXG5cdFx0XHRcdFx0aWYobm9kZS5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSl7XHJcblx0XHRcdFx0XHRcdGlucHV0bGFiZWxzLnB1c2goe1widGV4dFwiOm5vZGUuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikudG9TdHJpbmcoKSxcIm1hdGNoXCI6ZmFsc2V9KTtcclxuXHRcdFx0XHRcdFx0aXRlcmF0ZT1mYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYobm9kZS5nZXRBdHRyaWJ1dGUoXCJhbHRcIikpe1xyXG5cdFx0XHRcdFx0aW5wdXRsYWJlbHMucHVzaCh7XCJ0ZXh0XCI6bm9kZS5nZXRBdHRyaWJ1dGUoXCJhbHRcIikudG9TdHJpbmcoKSxcIm1hdGNoXCI6ZmFsc2V9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGdldGNoaWxkbGFiZWxzICYmIG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg+MCl7XHJcblx0XHRcdFx0dmFyIGNoaWxkbm9kZXMgPSBub2RlLmNoaWxkTm9kZXM7XHJcblx0XHRcdFx0Y2hpbGRub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZG5vZGUsIGtleSkge1xyXG5cdFx0XHRcdFx0aWYoY2hpbGRub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09XCJzY3JpcHRcIiAmJiBjaGlsZG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gXCJzZWxlY3RcIiAmJiBjaGlsZG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gJyNjb21tZW50Jykge1xyXG5cdFx0XHRcdFx0XHR2YXIgdGV4dGNvbnRlbnQgPSBjaGlsZG5vZGUudGV4dENvbnRlbnQucmVwbGFjZSgvW1xcblxccl0rfFtcXHNdezIsfS9nLCAnICcpLnRyaW0oKTtcclxuXHRcdFx0XHRcdFx0aWYgKHRleHRjb250ZW50ICE9PSBcIlwiICYmIGlnbm9yZW5vZGUuaXNTYW1lTm9kZShjaGlsZG5vZGUpID09PSBmYWxzZSkge1xyXG5cdFx0XHRcdFx0XHRcdGlucHV0bGFiZWxzLnB1c2goe1widGV4dFwiOiB0ZXh0Y29udGVudCwgXCJtYXRjaFwiOiBmYWxzZX0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGlucHV0bGFiZWxzLmxlbmd0aD09PTAgJiYgbm9kZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRvb2x0aXBcIikpe1xyXG5cdFx0XHRcdGlucHV0bGFiZWxzLnB1c2goe1widGV4dFwiOm5vZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS10b29sdGlwXCIpLnRvU3RyaW5nKCksXCJtYXRjaFwiOmZhbHNlfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGlucHV0bGFiZWxzLmxlbmd0aD09PTAgJiYgbm9kZS5nZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIpKXtcclxuXHRcdFx0XHRpbnB1dGxhYmVscy5wdXNoKHtcInRleHRcIjpub2RlLmdldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIikudG9TdHJpbmcoKSxcIm1hdGNoXCI6ZmFsc2V9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly90b2RvIGZpeCBmb3IgaW1hZ2UgdGFnc1xyXG5cdFx0XHRpZihpdGVyYXRlICYmIG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gXCJpbWdcIiAmJiBpbnB1dGxhYmVscy5sZW5ndGggPT09IDAgJiYgaXRlcmF0aW9ubm88PWl0ZXJhdGVsaW1pdCl7XHJcblx0XHRcdFx0aXRlcmF0aW9ubm8rKztcclxuXHRcdFx0XHRpbnB1dGxhYmVscyA9IHRoaXMuZ2V0SW5wdXRMYWJlbHMobm9kZS5wYXJlbnROb2RlLFtdLCBpdGVyYXRpb25ubywgaXRlcmF0ZSwgZ2V0Y2hpbGRsYWJlbHMsIGZyb21jbGljaywgaXRlcmF0ZWxpbWl0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoaW5wdXRsYWJlbHMubGVuZ3RoPT09MCAmJiBub2RlLmlkIT09XCJcIil7XHJcblx0XHRcdFx0aW5wdXRsYWJlbHMucHVzaCh7XCJ0ZXh0XCI6KG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKStcIi1cIitub2RlLmlkKSxcIm1hdGNoXCI6ZmFsc2V9KTtcclxuXHRcdFx0fWVsc2UgaWYoaW5wdXRsYWJlbHMubGVuZ3RoPT09MCAmJiBub2RlLmhhc0F0dHJpYnV0ZShcImNsYXNzXCIpICYmIG5vZGUuY2xhc3NOYW1lICYmIG5vZGUuY2xhc3NOYW1lIT09XCJcIil7XHJcblx0XHRcdFx0dmFyIGNsYXNzbmFtZT1ub2RlLmNsYXNzTmFtZS50b1N0cmluZygpO1xyXG5cdFx0XHRcdGlucHV0bGFiZWxzLnB1c2goe1widGV4dFwiOihub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkrXCItXCIrY2xhc3NuYW1lLnJlcGxhY2UoXCIgXCIsXCItXCIpKSxcIm1hdGNoXCI6ZmFsc2V9KTtcclxuXHRcdFx0fSBlbHNlIGlmKGlucHV0bGFiZWxzLmxlbmd0aD09PTApe1xyXG5cdFx0XHRcdGlucHV0bGFiZWxzLnB1c2goe1widGV4dFwiOihub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpLFwibWF0Y2hcIjpmYWxzZX0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gaW5wdXRsYWJlbHM7XHJcblx0XHR9LFxyXG5cdFx0Z2V0c2luZ2xlaW5wdXRsYWJlbDogZnVuY3Rpb24ocGFyZW50bm9kZSwgaW5wdXRsYWJlbCl7XHJcblx0XHRcdHZhciBjaGlsZG5vZGVzID0gcGFyZW50bm9kZS5jaGlsZE5vZGVzO1xyXG5cclxuXHRcdFx0Y2hpbGRub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZG5vZGUsIGtleSkge1xyXG5cdFx0XHRcdGlmKGlucHV0bGFiZWwgPT09IFwiXCIpe1xyXG5cdFx0XHRcdFx0aW5wdXRsYWJlbCA9IGNoaWxkbm9kZS50ZXh0Q29udGVudC5yZXBsYWNlKC9bXFxuXFxyXSt8W1xcc117Mix9L2csICcgJykudHJpbSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpZihpbnB1dGxhYmVsID09PSBcIlwiKXtcclxuXHRcdFx0XHRpbnB1dGxhYmVsID0gdGhpcy5nZXRpbnB1dGxhYmVsKHBhcmVudG5vZGUucGFyZW50Tm9kZSxcIlwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGlucHV0bGFiZWw7XHJcblx0XHR9LFxyXG5cdFx0YWRkQ2xpY2tUb05vZGU6ZnVuY3Rpb24obm9kZSwgY29uZmlybWRpYWxvZz1mYWxzZSl7XHJcbiAgICAgICAgXHR0cnl7XHJcblx0XHRcdFx0aWYobm9kZS5oYXNPd25Qcm9wZXJ0eShcImFkZGVkY2xpY2tyZWNvcmRcIikgJiYgbm9kZS5hZGRlZGNsaWNrcmVjb3JkPT09dHJ1ZSl7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgbm9kZW5hbWU9bm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRcdHN3aXRjaCAobm9kZW5hbWUpIHtcclxuXHRcdFx0XHRcdGNhc2UgXCJzZWxlY3RcIjpcclxuXHRcdFx0XHRcdFx0alF1ZXJ5KG5vZGUpLm9uKHtcImZvY3VzXCI6ZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0XHRcdFx0XHRcdFx0VURBUGx1Z2luU0RLLnJlY29yZHVzZXJjbGljayhub2RlLCBmYWxzZSxmYWxzZSwgZXZlbnQsIGNvbmZpcm1kaWFsb2cpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSBcImlucHV0XCI6XHJcblx0XHRcdFx0XHRcdGlmKCFub2RlLmhhc0F0dHJpYnV0ZShcInR5cGVcIikpe1xyXG5cdFx0XHRcdFx0XHRcdGpRdWVyeShub2RlKS5jbGljayhmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFVEQVBsdWdpblNESy5yZWNvcmR1c2VyY2xpY2sobm9kZSwgZmFsc2UsIGZhbHNlLCBldmVudCwgY29uZmlybWRpYWxvZyk7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHZhciBpbnB1dHR5cGU9bm9kZS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRcdFx0XHRcdHN3aXRjaCAoaW5wdXR0eXBlKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSBcImVtYWlsXCI6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSBcInRleHRcIjpcclxuXHRcdFx0XHRcdFx0XHRjYXNlIFwiYnV0dG9uXCI6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSBcImNoZWNrYm94XCI6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSBcImNvbG9yXCI6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSBcImRhdGVcIjpcclxuXHRcdFx0XHRcdFx0XHRjYXNlIFwiZGF0ZXRpbWUtbG9jYWxcIjpcclxuXHRcdFx0XHRcdFx0XHRjYXNlIFwiZmlsZVwiOlxyXG5cdFx0XHRcdFx0XHRcdGNhc2UgXCJoaWRkZW5cIjpcclxuXHRcdFx0XHRcdFx0XHRjYXNlIFwiaW1hZ2VcIjpcclxuXHRcdFx0XHRcdFx0XHRjYXNlIFwibW9udGhcIjpcclxuXHRcdFx0XHRcdFx0XHRjYXNlIFwibnVtYmVyXCI6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSBcInBhc3N3b3JkXCI6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSBcInJhZGlvXCI6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSBcInJhbmdlXCI6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSBcInJlc2V0XCI6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSBcInNlYXJjaFwiOlxyXG5cdFx0XHRcdFx0XHRcdGNhc2UgXCJzdWJtaXRcIjpcclxuXHRcdFx0XHRcdFx0XHRjYXNlIFwidGVsXCI6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSBcInRleHRcIjpcclxuXHRcdFx0XHRcdFx0XHRjYXNlIFwidGltZVwiOlxyXG5cdFx0XHRcdFx0XHRcdGNhc2UgXCJ1cmxcIjpcclxuXHRcdFx0XHRcdFx0XHRjYXNlIFwid2Vla1wiOlxyXG5cdFx0XHRcdFx0XHRcdFx0alF1ZXJ5KG5vZGUpLmNsaWNrKGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRVREFQbHVnaW5TREsucmVjb3JkdXNlcmNsaWNrKG5vZGUsIGZhbHNlLCBmYWxzZSwgZXZlbnQsIGNvbmZpcm1kaWFsb2cpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRcdFx0alF1ZXJ5KG5vZGUpLmNsaWNrKGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRVREFQbHVnaW5TREsucmVjb3JkdXNlcmNsaWNrKG5vZGUsIGZhbHNlLCBmYWxzZSwgZXZlbnQsIGNvbmZpcm1kaWFsb2cpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgXCJtYXQtc2VsZWN0XCI6XHJcblx0XHRcdFx0XHRcdGpRdWVyeShub2RlKS5jbGljayhmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdFx0XHRVREFQbHVnaW5TREsucmVjb3JkdXNlcmNsaWNrKG5vZGUsIGZhbHNlLCBmYWxzZSwgZXZlbnQsIGNvbmZpcm1kaWFsb2cpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICd0cic6XHJcblx0XHRcdFx0XHRcdGpRdWVyeShub2RlKS5jbGljayhmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdFx0XHRVREFQbHVnaW5TREsucmVjb3JkdXNlcmNsaWNrKG5vZGUsIGZhbHNlLCBmYWxzZSwgZXZlbnQsIGNvbmZpcm1kaWFsb2cpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRqUXVlcnkobm9kZSkuY2xpY2soZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0XHRcdFx0VURBUGx1Z2luU0RLLnJlY29yZHVzZXJjbGljayhub2RlLCBmYWxzZSwgZmFsc2UsIGV2ZW50LCBjb25maXJtZGlhbG9nKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRub2RlLmFkZGVkY2xpY2tyZWNvcmQ9dHJ1ZTtcclxuXHRcdFx0XHRyZXR1cm4gbm9kZTtcclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFVEQUVycm9yTG9nZ2VyLmVycm9yKCdVbmFibGUgdG8gYWRkIGNsaWNrIHRvIG5vZGUgJysgbm9kZS5vdXRlckhUTUwrJyAnKyBlKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0sXHJcblx0XHQvL21hdGNoaW5nIHRoZSBhY3Rpb24gb2YgdGhlIG5vZGUgYW5kIGludm9raW5nIHdoZXRoZXIgdG8gY2xpY2sgb3IgZm9jdXNcclxuXHRcdG1hdGNoYWN0aW9uOmZ1bmN0aW9uKGRhdGEsY2xvc2U9dHJ1ZSxzZWxlY3RlZG5vZGUpe1xyXG5cdFx0XHRpZihjbG9zZSkge1xyXG5cdFx0XHRcdHRoaXMuY2xvc2Vtb2RhbCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBub2RlPWRhdGFbXCJlbGVtZW50LWRhdGFcIl07XHJcblx0XHRcdHZhciB0aW1ldG9pbnZva2U9MTAwMDtcclxuXHJcblx0XHRcdGlmKCF0aGlzLnBsYXlOZXh0QWN0aW9uKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyh7aW52b2tpbmdub2RlOiBub2RlfSk7XHJcblxyXG5cdFx0XHQvLyByZW1vdmUgYWRkZWQgdG9vbHRpcHMgYmVmb3JlIGludm9raW5nXHJcblx0XHRcdC8vIGxldCB0b29sdGlwbm9kZXMgPSBqUXVlcnkoJy51ZGEtdG9vbHRpcCcpO1xyXG5cdFx0XHRsZXQgdG9vbHRpcG5vZGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndWRhLXRvb2x0aXAnKTtcclxuXHRcdFx0aWYgKHRvb2x0aXBub2Rlcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0alF1ZXJ5KCcudWRhLXRvb2x0aXAnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0alF1ZXJ5KHRoaXMpLmZpbmQoJy51ZGEtdG9vbHRpcC10ZXh0LWNvbnRlbnQnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdGpRdWVyeSh0aGlzKS5yZW1vdmVDbGFzcygndWRhLXRvb2x0aXAnKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0alF1ZXJ5KCcudWRhLXRvb2x0aXAtdGV4dC1jb250ZW50JykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRqUXVlcnkodGhpcykucmVtb3ZlKCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5zaW11bGF0ZUhvdmVyKG5vZGUpO1xyXG5cclxuXHRcdFx0dmFyIG5hdmlnYXRpb25jb29raWU9dGhpcy5nZXRzdG9yYWdlZGF0YSh0aGlzLm5hdmlnYXRpb25jb29raWVuYW1lKTtcclxuXHRcdFx0dmFyIG5hdmlnYXRpb25jb29raWVkYXRhID0gbnVsbDtcclxuXHRcdFx0aWYobmF2aWdhdGlvbmNvb2tpZSkge1xyXG5cdFx0XHRcdG5hdmlnYXRpb25jb29raWVkYXRhID0gSlNPTi5wYXJzZShuYXZpZ2F0aW9uY29va2llKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gcGVyZm9ybSBjbGljayBhY3Rpb24gYmFzZWQgb24gdGhlIGlucHV0IGdpdmVuXHJcblxyXG5cdFx0XHRjb25zdCByZWNvcmRlZE5vZGVEYXRhID0gSlNPTi5wYXJzZShzZWxlY3RlZG5vZGUub2JqZWN0ZGF0YSk7XHJcblx0XHRcdGlmKHJlY29yZGVkTm9kZURhdGEubWV0YSAmJiByZWNvcmRlZE5vZGVEYXRhLm1ldGEuc2VsZWN0ZWRFbGVtZW50ICYmIHJlY29yZGVkTm9kZURhdGEubWV0YS5zZWxlY3RlZEVsZW1lbnQuc3lzdGVtVGFnLnRyaW0oKSAhPSAnb3RoZXJzJyl7XHJcblx0XHRcdFx0bGV0IHBlcmZvcm1lZEFjdGlvbiA9IHRoaXMubWFwU2VsZWN0ZWRFbGVtZW50QWN0aW9uKG5vZGUsIHNlbGVjdGVkbm9kZSwgbmF2aWdhdGlvbmNvb2tpZWRhdGEsIHJlY29yZGVkTm9kZURhdGEpO1xyXG5cdFx0XHRcdGlmKHBlcmZvcm1lZEFjdGlvbil7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZih0aGlzLmluQXJyYXkobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLCB0aGlzLmlnbm9yZU5vZGVzRnJvbUluZGV4aW5nKSAhPT0gLTEpIHtcclxuXHRcdFx0XHR0aGlzLmFkZFRvb2xUaXAobm9kZSwgbm9kZS5wYXJlbnROb2RlLCBzZWxlY3RlZG5vZGUsIG5hdmlnYXRpb25jb29raWVkYXRhLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN3aXRjaCAobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSB7XHJcblx0XHRcdFx0Y2FzZSBcImlucHV0XCI6XHJcblx0XHRcdFx0XHQvLyBmdW5jdGlvbmFsaXR5IGZvciBkZXRlY3RpbmcgbXVsdGkgc2VsZWN0IGJveCBhbmQgaGlnaGxpZ2h0aW5nIHRoZSByZWNvcmRlZCBub2RlXHJcblx0XHRcdFx0XHRpZiAobm9kZS5jbGFzc0xpc3QgJiYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3QyLXNlYXJjaF9fZmllbGQnKSB8fCBub2RlLmNsYXNzTGlzdC5jb250YWlucygnbWF0LWF1dG9jb21wbGV0ZS10cmlnZ2VyJykpKXtcclxuXHRcdFx0XHRcdFx0dGhpcy5hZGRUb29sVGlwKG5vZGUsIG5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLCBzZWxlY3RlZG5vZGUsIG5hdmlnYXRpb25jb29raWVkYXRhLCBmYWxzZSwgdHJ1ZSk7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYobm9kZS5oYXNBdHRyaWJ1dGUoJ3JvbGUnKSAmJiAobm9kZS5nZXRBdHRyaWJ1dGUoJ3JvbGUnKT09PSdjb21ib2JveCcpKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuYWRkVG9vbFRpcChub2RlLCBub2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUsIHNlbGVjdGVkbm9kZSwgbmF2aWdhdGlvbmNvb2tpZWRhdGEsIGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYobm9kZS5oYXNBdHRyaWJ1dGUoJ3R5cGUnKSAmJiAobm9kZS5nZXRBdHRyaWJ1dGUoJ3R5cGUnKT09PSdjaGVja2JveCcgfHwgbm9kZS5nZXRBdHRyaWJ1dGUoJ3R5cGUnKT09PSdyYWRpbycpICYmIG5vZGUuY2xhc3NMaXN0ICYmIChub2RlLmNsYXNzTGlzdC5jb250YWlucygnbWF0LWNoZWNrYm94LWlucHV0JykgfHwgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ21hdC1yYWRpby1pbnB1dCcpKSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmFkZFRvb2xUaXAobm9kZSwgbm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUsIHNlbGVjdGVkbm9kZSwgbmF2aWdhdGlvbmNvb2tpZWRhdGEsIGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYobm9kZS5oYXNBdHRyaWJ1dGUoJ3R5cGUnKSl7XHJcblx0XHRcdFx0XHRcdHN3aXRjaCAobm9kZS5nZXRBdHRyaWJ1dGUoJ3R5cGUnKS50b0xvd2VyQ2FzZSgpKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnY2hlY2tib3gnOlxyXG5cdFx0XHRcdFx0XHRcdFx0aWYobm9kZS5wYXJlbnROb2RlICYmIG5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QgJiYgbm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygndmNfY2hlY2tib3gnKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLmFkZFRvb2xUaXAobm9kZSwgbm9kZS5wYXJlbnROb2RlLCBzZWxlY3RlZG5vZGUsIG5hdmlnYXRpb25jb29raWVkYXRhLCBmYWxzZSwgZmFsc2UsIHRydWUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5hZGRUb29sVGlwKG5vZGUsIG5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLCBzZWxlY3RlZG5vZGUsIG5hdmlnYXRpb25jb29raWVkYXRhLCBmYWxzZSwgZmFsc2UsIHRydWUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAncmFkaW8nOlxyXG5cdFx0XHRcdFx0XHRcdFx0aWYobm9kZS5wYXJlbnROb2RlICYmIG5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QgJiYgbm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygndmNfbGFiZWwnKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLmFkZFRvb2xUaXAobm9kZSwgbm9kZS5wYXJlbnROb2RlLCBzZWxlY3RlZG5vZGUsIG5hdmlnYXRpb25jb29raWVkYXRhLCBmYWxzZSwgZmFsc2UsIHRydWUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5hZGRUb29sVGlwKG5vZGUsIG5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLCBzZWxlY3RlZG5vZGUsIG5hdmlnYXRpb25jb29raWVkYXRhLCBmYWxzZSwgZmFsc2UsIHRydWUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnc3VibWl0JzpcclxuXHRcdFx0XHRcdFx0XHRcdG5vZGUuY2xpY2soKTtcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuaW52b2tlbmV4dGl0ZW0obm9kZSwgdGltZXRvaW52b2tlLCBuYXZpZ2F0aW9uY29va2llZGF0YSk7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnNob3dzZWxlY3RlZHJvdyhuYXZpZ2F0aW9uY29va2llZGF0YS5kYXRhLG5hdmlnYXRpb25jb29raWVkYXRhLmRhdGEuaWQsdHJ1ZSwgbmF2aWdhdGlvbmNvb2tpZWRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRjYXNlICd0ZXh0JzpcclxuXHRcdFx0XHRcdFx0XHRcdGlmKG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoPjAgJiYgKG5vZGUuaGFzQXR0cmlidXRlKCduZ3hkYXRlcmFuZ2VwaWNrZXJtZCcpKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLmFkZFRvb2xUaXAobm9kZSwgbm9kZS5wYXJlbnROb2RlLCBzZWxlY3RlZG5vZGUsIG5hdmlnYXRpb25jb29raWVkYXRhLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZihub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aD4wICYmIChub2RlLmhhc0F0dHJpYnV0ZSgndWliLWRhdGVwaWNrZXItcG9wdXAnKSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5hZGRUb29sVGlwKG5vZGUsIG5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLCBzZWxlY3RlZG5vZGUsIG5hdmlnYXRpb25jb29raWVkYXRhLCB0cnVlLCBmYWxzZSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLmFkZFRvb2xUaXAobm9kZSwgbm9kZS5wYXJlbnROb2RlLCBzZWxlY3RlZG5vZGUsIG5hdmlnYXRpb25jb29raWVkYXRhLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5hZGRUb29sVGlwKG5vZGUsIG5vZGUucGFyZW50Tm9kZSwgc2VsZWN0ZWRub2RlLCBuYXZpZ2F0aW9uY29va2llZGF0YSwgZmFsc2UsIGZhbHNlLCB0cnVlKTtcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmFkZFRvb2xUaXAobm9kZSwgbm9kZS5wYXJlbnROb2RlLCBzZWxlY3RlZG5vZGUsIG5hdmlnYXRpb25jb29raWVkYXRhLCBmYWxzZSwgZmFsc2UsIHRydWUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBcInRleHRhcmVhXCI6XHJcblx0XHRcdFx0XHR0aGlzLnBsYXlOZXh0QWN0aW9uID0gZmFsc2U7XHJcblx0XHRcdFx0XHR0aGlzLmFkZFRvb2xUaXAobm9kZSwgbm9kZS5wYXJlbnROb2RlLCBzZWxlY3RlZG5vZGUsIG5hdmlnYXRpb25jb29raWVkYXRhLCBmYWxzZSwgZmFsc2UsIHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBcInNlbGVjdFwiOlxyXG5cdFx0XHRcdFx0Ly8gdGhpcy5hZGRUb29sVGlwKG5vZGUsIG5vZGUucGFyZW50Tm9kZSwgbmF2aWdhdGlvbmNvb2tpZWRhdGEsIGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XHJcblx0XHRcdFx0XHR0aGlzLmFkZFRvb2xUaXAobm9kZSwgbm9kZSwgc2VsZWN0ZWRub2RlLCBuYXZpZ2F0aW9uY29va2llZGF0YSwgZmFsc2UsIGZhbHNlLCB0cnVlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgXCJvcHRpb25cIjpcclxuXHRcdFx0XHRcdHRoaXMuYWRkVG9vbFRpcChub2RlLCBub2RlLnBhcmVudE5vZGUsIHNlbGVjdGVkbm9kZSwgbmF2aWdhdGlvbmNvb2tpZWRhdGEsIGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFwiY2hlY2tib3hcIjpcclxuXHRcdFx0XHRcdHRoaXMuYWRkVG9vbFRpcChub2RlLCBub2RlLCBzZWxlY3RlZG5vZGUsIG5hdmlnYXRpb25jb29raWVkYXRhLCBmYWxzZSwgZmFsc2UsIHRydWUpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Ly8gQWRkaXRpb25hbCBwcm9jZXNzaW5nIGZvciBjYWxlbmRhciBzZWxlY3Rpb25cclxuXHRcdFx0XHRjYXNlIFwiYnV0dG9uXCI6XHJcblx0XHRcdFx0XHRpZihub2RlLmhhc0F0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpICYmIG5vZGUuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJykudG9Mb3dlckNhc2UoKSA9PT0gJ29wZW4gY2FsZW5kYXInKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuYWRkVG9vbFRpcChub2RlLCBub2RlLnBhcmVudE5vZGUsIHNlbGVjdGVkbm9kZSwgbmF2aWdhdGlvbmNvb2tpZWRhdGEsIHRydWUsIGZhbHNlKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZihub2RlLmNsYXNzTGlzdCAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnYnRuLXBpbGwnKSkge1xyXG5cdFx0XHRcdFx0XHRub2RlLmNsaWNrKCk7XHJcblx0XHRcdFx0XHRcdHRoaXMuaW52b2tlbmV4dGl0ZW0obm9kZSwgdGltZXRvaW52b2tlLCBuYXZpZ2F0aW9uY29va2llZGF0YSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRub2RlLmNsaWNrKCk7XHJcblx0XHRcdFx0XHRcdHRoaXMuaW52b2tlbmV4dGl0ZW0obm9kZSwgdGltZXRvaW52b2tlLCBuYXZpZ2F0aW9uY29va2llZGF0YSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdzcGFuJzpcclxuXHRcdFx0XHRcdGlmIChub2RlLmNsYXNzTGlzdCAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0Mi1zZWxlY3Rpb24nKSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmFkZFRvb2xUaXAobm9kZSwgbm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUsIHNlbGVjdGVkbm9kZSwgbmF2aWdhdGlvbmNvb2tpZWRhdGEsIHRydWUsIGZhbHNlKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZihub2RlLmNsYXNzTGlzdC5jb250YWlucyhcInJhZGlvXCIpICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwicmVwbGFjZW1lbnRcIikpe1xyXG5cdFx0XHRcdFx0XHR0aGlzLmFkZFRvb2xUaXAobm9kZSwgbm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUsIHNlbGVjdGVkbm9kZSwgbmF2aWdhdGlvbmNvb2tpZWRhdGEsIGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRub2RlLmNsaWNrKCk7XHJcblx0XHRcdFx0XHRcdHRoaXMuaW52b2tlbmV4dGl0ZW0obm9kZSwgdGltZXRvaW52b2tlLCBuYXZpZ2F0aW9uY29va2llZGF0YSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdkaXYnOlxyXG5cdFx0XHRcdFx0aWYobm9kZS5jbGFzc0xpc3QgJiYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXQtZm9ybS1maWVsZC1mbGV4JykgfHwgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ21hdC1zZWxlY3QtdHJpZ2dlcicpKSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmFkZFRvb2xUaXAobm9kZSwgbm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUsIHNlbGVjdGVkbm9kZSwgbmF2aWdhdGlvbmNvb2tpZWRhdGEsIHRydWUsIGZhbHNlKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdG5vZGUuY2xpY2soKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5pbnZva2VuZXh0aXRlbShub2RlLCB0aW1ldG9pbnZva2UsIG5hdmlnYXRpb25jb29raWVkYXRhKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdC8vXHRmaXggZm9yIHRleHQgZWRpdG9yIGR1cmluZyBwbGF5YmFja1xyXG5cdFx0XHRcdGNhc2UgJ2NrZWRpdG9yJzpcclxuXHRcdFx0XHRcdHRoaXMuYWRkVG9vbFRpcChub2RlLCBub2RlLCBzZWxlY3RlZG5vZGUsIG5hdmlnYXRpb25jb29raWVkYXRhLCB0cnVlLCBmYWxzZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICduZy1zZWxlY3QnOlxyXG5cdFx0XHRcdFx0dGhpcy5hZGRUb29sVGlwKG5vZGUsIG5vZGUsIHNlbGVjdGVkbm9kZSwgbmF2aWdhdGlvbmNvb2tpZWRhdGEsIGZhbHNlLCBmYWxzZSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0Ly8gY2hlY2sgZm9yIHNwZWNpYWwgaW5wdXQgbm9kZXMgYW5kIGFkZCB0b29sdGlwXHJcblx0XHRcdFx0XHRsZXQgc3BlY2lhbElucHV0Tm9kZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0bm9kZS5jbGFzc0xpc3QuZm9yRWFjaCh2YWwgPT4ge1xyXG5cdFx0XHRcdFx0XHRpZihVREFQbHVnaW5TREsuaW5BcnJheSh2YWwsIFVEQVBsdWdpblNESy5zcGVjaWFsSW5wdXRDbGlja0NsYXNzTmFtZXMpICE9PSAtMSl7XHJcblx0XHRcdFx0XHRcdFx0c3BlY2lhbElucHV0Tm9kZSA9IHRydWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aWYoc3BlY2lhbElucHV0Tm9kZSl7XHJcblx0XHRcdFx0XHRcdHRoaXMuYWRkVG9vbFRpcChub2RlLCBub2RlLCBzZWxlY3RlZG5vZGUsIG5hdmlnYXRpb25jb29raWVkYXRhLCB0cnVlLCBmYWxzZSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRub2RlLmNsaWNrKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0aGlzLmludm9rZW5leHRpdGVtKG5vZGUsIHRpbWV0b2ludm9rZSwgbmF2aWdhdGlvbmNvb2tpZWRhdGEpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHQvL3BlcmZvcm0gYWN0aW9uIGJhc2VkIG9uIHNlbGVjdGVkIG5vZGUgdHlwZVxyXG5cdFx0bWFwU2VsZWN0ZWRFbGVtZW50QWN0aW9uOiBmdW5jdGlvbihub2RlLCByZWNvcmRlZE5vZGUsIG5hdmlnYXRpb25Db29raWVEYXRhLCByZWNvcmRlZE5vZGVEYXRhKXtcclxuXHRcdFx0Ly8gdGhpcy5hZGRUb29sVGlwKG5vZGUsIG5vZGUucGFyZW50Tm9kZSwgc2VsZWN0ZWRub2RlLCBuYXZpZ2F0aW9uY29va2llZGF0YSwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XHJcblx0XHRcdGxldCBwZXJmb3JtZWRBY3Rpb24gPSBmYWxzZTtcclxuXHRcdFx0c3dpdGNoIChyZWNvcmRlZE5vZGVEYXRhLm1ldGEuc2VsZWN0ZWRFbGVtZW50LnN5c3RlbVRhZyl7XHJcblx0XHRcdFx0Y2FzZSAndGV4dCc6XHJcblx0XHRcdFx0Y2FzZSAnZGF0ZSc6XHJcblx0XHRcdFx0Y2FzZSAncmFuZ2UnOlxyXG5cdFx0XHRcdGNhc2UgJ2ZpbGUnOlxyXG5cdFx0XHRcdGNhc2UgJ3RlbGVwaG9uZSc6XHJcblx0XHRcdFx0Y2FzZSAnZW1haWwnOlxyXG5cdFx0XHRcdGNhc2UgJ251bWJlcic6XHJcblx0XHRcdFx0Y2FzZSAncGFzc3dvcmQnOlxyXG5cdFx0XHRcdFx0dGhpcy5hZGRUb29sVGlwKG5vZGUsIG5vZGUucGFyZW50Tm9kZSwgcmVjb3JkZWROb2RlLCBuYXZpZ2F0aW9uQ29va2llRGF0YSwgZmFsc2UsIHRydWUsIHRydWUpO1xyXG5cdFx0XHRcdFx0cGVyZm9ybWVkQWN0aW9uID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3NpbmdsZUNob2ljZSc6XHJcblx0XHRcdFx0XHR0aGlzLmFkZFRvb2xUaXAobm9kZSwgbm9kZS5wYXJlbnROb2RlLCByZWNvcmRlZE5vZGUsIG5hdmlnYXRpb25Db29raWVEYXRhLCBmYWxzZSwgZmFsc2UsIHRydWUpO1xyXG5cdFx0XHRcdFx0cGVyZm9ybWVkQWN0aW9uID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ211bHRpcGxlQ2hvaWNlJzpcclxuXHRcdFx0XHRcdHRoaXMuYWRkVG9vbFRpcChub2RlLCBub2RlLnBhcmVudE5vZGUsIHJlY29yZGVkTm9kZSwgbmF2aWdhdGlvbkNvb2tpZURhdGEsIGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XHJcblx0XHRcdFx0XHRwZXJmb3JtZWRBY3Rpb24gPSB0cnVlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnYnV0dG9uJzpcclxuXHRcdFx0XHRcdG5vZGUuY2xpY2soKTtcclxuXHRcdFx0XHRcdHRoaXMuaW52b2tlbmV4dGl0ZW0obm9kZSwgMTAwMCwgbmF2aWdhdGlvbkNvb2tpZURhdGEpO1xyXG5cdFx0XHRcdFx0dGhpcy5zaG93c2VsZWN0ZWRyb3cobmF2aWdhdGlvbkNvb2tpZURhdGEuZGF0YSxuYXZpZ2F0aW9uQ29va2llRGF0YS5kYXRhLmlkLHRydWUsIG5hdmlnYXRpb25Db29raWVEYXRhKTtcclxuXHRcdFx0XHRcdHBlcmZvcm1lZEFjdGlvbiA9IHRydWU7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFwiZHJvcERvd25cIjpcclxuXHRcdFx0XHRcdHRoaXMuYWRkVG9vbFRpcChub2RlLCBub2RlLCByZWNvcmRlZE5vZGUsIG5hdmlnYXRpb25Db29raWVEYXRhLCBmYWxzZSwgZmFsc2UsIHRydWUpO1xyXG5cdFx0XHRcdFx0cGVyZm9ybWVkQWN0aW9uID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgXCJ0ZXh0QXJlYVwiOlxyXG5cdFx0XHRcdFx0dGhpcy5hZGRUb29sVGlwKG5vZGUsIG5vZGUucGFyZW50Tm9kZSwgcmVjb3JkZWROb2RlLCBuYXZpZ2F0aW9uQ29va2llRGF0YSwgZmFsc2UsIGZhbHNlLCB0cnVlKTtcclxuXHRcdFx0XHRcdHBlcmZvcm1lZEFjdGlvbiA9IHRydWU7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcGVyZm9ybWVkQWN0aW9uO1xyXG5cdFx0fSxcclxuXHRcdC8vYWRkIHRvb2x0aXAgZGlzcGxheVxyXG5cdFx0YWRkVG9vbFRpcDpmdW5jdGlvbihpbnZva2luZ25vZGUsIHRvb2x0aXBub2RlLCByZWNvcmRlZGRhdGE9bnVsbCwgbmF2aWdhdGlvbmNvb2tpZWRhdGEsIGVuYWJsZUNsaWNrPWZhbHNlLCBlbmFibGVGb2N1cz1mYWxzZSwgZW5hYmxlSW50cm9Kcz1mYWxzZSwgbWVzc2FnZT0gJ1BsZWFzZSBpbnB1dCB0aGUgdmFsdWUgYW5kIHRoZW4gY2xpY2sgb24nLCBzaG93QnV0dG9ucz10cnVlKSB7XHJcblxyXG5cdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyh0aGlzLmludm9raW5nbm9kZSk7XHJcblxyXG5cdFx0XHRpZihyZWNvcmRlZGRhdGEgIT09IG51bGwpIHtcclxuXHRcdFx0XHRsZXQgcmVjb3JkZWRub2RlZGF0YSA9IEpTT04ucGFyc2UocmVjb3JkZWRkYXRhLm9iamVjdGRhdGEpO1xyXG5cdFx0XHRcdGlmKHJlY29yZGVkbm9kZWRhdGEuaGFzT3duUHJvcGVydHkoJ21ldGEnKSAmJiByZWNvcmRlZG5vZGVkYXRhLm1ldGEuaGFzT3duUHJvcGVydHkoJ3Rvb2x0aXBJbmZvJykgJiYgcmVjb3JkZWRub2RlZGF0YS5tZXRhLnRvb2x0aXBJbmZvICE9ICcnKXtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgPSByZWNvcmRlZG5vZGVkYXRhLm1ldGEudG9vbHRpcEluZm87XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvKmlmKHRoaXMuaW52b2tpbmdub2RlICYmIHRoaXMuaW52b2tpbmdub2RlLmlzRXF1YWxOb2RlKGludm9raW5nbm9kZSkpe1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmludm9raW5nbm9kZSA9IGludm9raW5nbm9kZTtcclxuXHRcdFx0fSovXHJcblxyXG5cdFx0XHR0aGlzLmludm9raW5nbm9kZSA9IGludm9raW5nbm9kZTtcclxuXHJcblx0XHRcdHRoaXMucGxheU5leHRBY3Rpb24gPSBmYWxzZTtcclxuXHJcblx0XHRcdGlmKG5hdmlnYXRpb25jb29raWVkYXRhKSB7XHJcblx0XHRcdFx0aWYgKG5hdmlnYXRpb25jb29raWVkYXRhICYmIG5hdmlnYXRpb25jb29raWVkYXRhLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0XHR0aGlzLmF1dG9wbGF5ID0gZmFsc2U7XHJcblx0XHRcdFx0XHR0aGlzLmF1dG9wbGF5UGF1c2VkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlYXV0b3BsYXkobmF2aWdhdGlvbmNvb2tpZWRhdGEpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLnNob3dzZWxlY3RlZHJvdyhuYXZpZ2F0aW9uY29va2llZGF0YS5kYXRhLCBuYXZpZ2F0aW9uY29va2llZGF0YS5kYXRhLmlkLCB0cnVlLCBuYXZpZ2F0aW9uY29va2llZGF0YSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgdG9vbFRpcENvbnRlbnRTZWN0aW9uXHQ9XHRtZXNzYWdlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Kyc8YnIvPic7XHJcblx0XHRcdGlmKHNob3dCdXR0b25zKSB7XHJcblx0XHRcdFx0dG9vbFRpcENvbnRlbnRTZWN0aW9uICs9XHQnPGJ1dHRvbiBjbGFzcz1cInVkYS10dXRvcmlhbC1idG5cIiBzdHlsZT1cIm1hcmdpbi10b3A6MTBweDsgbWFyZ2luLXJpZ2h0OiA1cHg7XCIgdHlwZT1cImJ1dHRvblwiIHVkYS1hZGRlZD1cInRydWVcIiBvbmNsaWNrPVwiVURBUGx1Z2luU0RLLnJlc3VtZVBsYXkoKTtcIj5Db250aW51ZTwvYnV0dG9uPidcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCsgJzxidXR0b24gY2xhc3M9XCJ1ZGEtdHV0b3JpYWwtZXhpdC1idG5cIiBzdHlsZT1cIm1hcmdpbi10b3A6MTBweDtcIiB0eXBlPVwiYnV0dG9uXCIgdWRhLWFkZGVkPVwidHJ1ZVwiIGlkPVwidWRhLWF1dG9wbGF5LWV4aXRcIj5FeGl0PC9idXR0b24+JztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IHRvb2xUaXBDb250ZW50RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHR0b29sVGlwQ29udGVudEVsZW1lbnQuaW5uZXJIVE1MID0gdG9vbFRpcENvbnRlbnRTZWN0aW9uLnRyaW0oKTtcclxuXHRcdFx0dG9vbFRpcENvbnRlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3VkYS10b29sdGlwLXRleHQtY29udGVudCcpO1xyXG5cclxuXHRcdFx0bGV0IHRvb2x0aXBEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdHRvb2x0aXBEaXZFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3VkYS10b29sdGlwJyk7XHJcblx0XHRcdHRvb2x0aXBEaXZFbGVtZW50LmlubmVySFRNTCA9ICc8ZGl2IGlkPVwidWRhLWFycm93XCIgY2xhc3M9XCJ1ZGEtYXJyb3dcIiBkYXRhLXBvcHBlci1hcnJvdz48L2Rpdj4nO1xyXG5cdFx0XHR0b29sdGlwRGl2RWxlbWVudC5wcmVwZW5kKHRvb2xUaXBDb250ZW50RWxlbWVudCk7XHJcblxyXG5cdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXBEaXZFbGVtZW50KTtcclxuXHJcblx0XHRcdC8qKlxyXG5cdFx0XHQgKiBjYWxjdWxhdGluZyBub2RlIHBvc2l0aW9uIGZyb20gaGVyZVxyXG5cdFx0XHQgKi9cclxuXHRcdFx0bGV0IHRvb2xUaXBQb3Npc3Rpb25DbGFzcyA9IHRoaXMuZ2V0VG9vbHRpcFBvc2l0aW9uQ2xhc3ModG9vbHRpcG5vZGUsIHRvb2x0aXBEaXZFbGVtZW50KTtcclxuXHJcblx0XHRcdHRoaXMucG9wcGVySW5zdGFuY2UgPSBQb3BwZXIuY3JlYXRlUG9wcGVyKHRvb2x0aXBub2RlLCB0b29sdGlwRGl2RWxlbWVudCx7XHJcblx0XHRcdFx0cGxhY2VtZW50OiB0b29sVGlwUG9zaXN0aW9uQ2xhc3MsXHJcblx0XHRcdFx0bW9kaWZpZXJzOiBbXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdG5hbWU6ICdvZmZzZXQnLFxyXG5cdFx0XHRcdFx0XHRvcHRpb25zOiB7XHJcblx0XHRcdFx0XHRcdFx0b2Zmc2V0OiBbMCwgMjBdLFxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGpRdWVyeShcIiN1ZGEtYXV0b3BsYXktZXhpdFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VURBUGx1Z2luU0RLLmJhY2tUb1NlYXJjaFJlc3VsdHNQYWdlKG5hdmlnYXRpb25jb29raWVkYXRhKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRqUXVlcnkoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuXHRcdFx0XHRzY3JvbGxUb3A6IChqUXVlcnkoaW52b2tpbmdub2RlKS5vZmZzZXQoKS50b3AgLSAyNTApXHJcblx0XHRcdH0sIDIwMDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0aWYoZW5hYmxlRm9jdXMpe1xyXG5cdFx0XHRcdFx0aW52b2tpbmdub2RlLmZvY3VzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGVuYWJsZUNsaWNrKXtcclxuXHRcdFx0XHRcdGludm9raW5nbm9kZS5jbGljaygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0LyoqXHJcblx0XHQgKiB0b29sdGlwIHBsYWNlbWVudCBjYWxjdWxhdGlvblxyXG5cdFx0ICovXHJcblx0XHRnZXRTY3JlZW5TaXplOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0bGV0IHBhZ2UgPSB7aGVpZ2h0OiAwLCB3aWR0aDogMH07XHJcblx0XHRcdGxldCBzY3JlZW4gPSB7aGVpZ2h0OiAwLCB3aWR0aDogMH07XHJcblx0XHRcdGxldCBib2R5ID0gZG9jdW1lbnQuYm9keSxcclxuXHRcdFx0XHRodG1sID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG5cclxuXHRcdFx0Y29uc3QgZG9jRWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcblx0XHRcdGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2NFbC5zY3JvbGxUb3AgfHwgYm9keS5zY3JvbGxUb3A7XHJcblx0XHRcdGNvbnN0IHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jRWwuc2Nyb2xsTGVmdCB8fCBib2R5LnNjcm9sbExlZnQ7XHJcblxyXG5cdFx0XHRsZXQgcmVzb2x1dGlvbiA9IHtoZWlnaHQ6IDAsIHdpZHRoOiAwfTtcclxuXHJcblx0XHRcdHBhZ2UuaGVpZ2h0ID0gTWF0aC5tYXgoIGJvZHkuc2Nyb2xsSGVpZ2h0LCBib2R5Lm9mZnNldEhlaWdodCwgaHRtbC5jbGllbnRIZWlnaHQsIGh0bWwuc2Nyb2xsSGVpZ2h0LCBodG1sLm9mZnNldEhlaWdodCApO1xyXG5cdFx0XHRwYWdlLndpZHRoID0gTWF0aC5tYXgoYm9keS5zY3JvbGxXaWR0aCwgYm9keS5vZmZzZXRXaWR0aCwgaHRtbC5jbGllbnRXaWR0aCwgaHRtbC5zY3JvbGxXaWR0aCwgaHRtbC5vZmZzZXRXaWR0aCk7XHJcblx0XHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0c2NyZWVuLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggKiAwLjc1O1xyXG5cdFx0XHRcdHNjcmVlbi5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblx0XHRcdFx0Ly8gcmV0dXJuIHsgd2lkdGg6ICh3aW5kb3cuaW5uZXJXaWR0aCowLjc1KSwgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQgfTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb25zdCBEID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG5cdFx0XHRcdHNjcmVlbi53aWR0aCA9IEQuY2xpZW50V2lkdGg7XHJcblx0XHRcdFx0c2NyZWVuLmhlaWdodCA9IEQuY2xpZW50SGVpZ2h0ICogMC43NTtcclxuXHRcdFx0XHQvLyByZXR1cm4geyB3aWR0aDogRC5jbGllbnRXaWR0aCowLjc1LCBoZWlnaHQ6IEQuY2xpZW50SGVpZ2h0IH07XHJcblx0XHRcdH1cclxuXHRcdFx0cmVzb2x1dGlvbi5oZWlnaHQgPSB3aW5kb3cuc2NyZWVuLmhlaWdodDtcclxuXHRcdFx0cmVzb2x1dGlvbi53aWR0aCA9IHdpbmRvdy5zY3JlZW4ud2lkdGg7XHJcblx0XHRcdGxldCB3aW5kb3dQcm9wZXJ0aWVzID0ge3BhZ2U6IHBhZ2UsIHNjcmVlbjogc2NyZWVuLCBzY3JvbGxJbmZvOiB7c2Nyb2xsVG9wOiBzY3JvbGxUb3AsIHNjcm9sbExlZnQ6IHNjcm9sbExlZnR9LCByZXNvbHV0aW9ufTtcclxuXHRcdFx0cmV0dXJuIHdpbmRvd1Byb3BlcnRpZXM7XHJcblx0XHR9LFxyXG5cdFx0Ly9nZXQgbm9kZSBwb3NpdGlvbiBvbiB0aGUgcGFnZVxyXG5cdFx0Z2V0Tm9kZUNvb3JkaW5hdGVzOiBmdW5jdGlvbihlbGVtZW50LCB3aW5kb3dTaXplKSB7XHJcblx0XHRcdGNvbnN0IHggPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHRsZXQgcmVzdWx0ID0ge1xyXG5cdFx0XHRcdHRvcDogeC50b3AgKyB3aW5kb3dTaXplLnNjcm9sbEluZm8uc2Nyb2xsVG9wLFxyXG5cdFx0XHRcdHdpZHRoOiB4LndpZHRoLFxyXG5cdFx0XHRcdGhlaWdodDogeC5oZWlnaHQsXHJcblx0XHRcdFx0bGVmdDogeC5sZWZ0ICsgd2luZG93U2l6ZS5zY3JvbGxJbmZvLnNjcm9sbExlZnQsXHJcblx0XHRcdFx0YWN0dWFsUG9zOiB4XHJcblx0XHRcdH07XHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9LFxyXG5cdFx0Z2V0VG9vbHRpcFBvc2l0aW9uQ2xhc3M6IGZ1bmN0aW9uICh0YXJnZXRFbGVtZW50LCB0b29sdGlwRWxlbWVudCkge1xyXG5cdFx0XHRjb25zdCBhdmFpbGFibGVQb3NpdGlvbnMgPSBbXCJyaWdodFwiLCBcInRvcFwiLCBcImxlZnRcIiwgXCJib3R0b21cIl0uc2xpY2UoKTtcclxuXHJcblx0XHRcdGNvbnN0IHNjcmVlblNpemUgPSB0aGlzLmdldFNjcmVlblNpemUoKTtcclxuXHRcdFx0Y29uc3QgdG9vbHRpcFBvcyA9IHRoaXMuZ2V0Tm9kZUNvb3JkaW5hdGVzKHRvb2x0aXBFbGVtZW50LCBzY3JlZW5TaXplKTtcclxuXHRcdFx0Y29uc3QgdGFyZ2V0RWxlbWVudFJlY3QgPSB0YXJnZXRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuXHRcdFx0bGV0IGZpbmFsQ3NzQ2xhc3MgPSBcInJpZ2h0XCI7XHJcblxyXG5cdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbygnLS0tLS0tLS0tLS0tLS0tLSBTY3JlZW4gaW5mbyAtLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuXHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oc2NyZWVuU2l6ZSk7XHJcblx0XHRcdC8vVURBQ29uc29sZUxvZ2dlci5pbmZvKHRvb2x0aXBQb3MpO1xyXG5cdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyh0YXJnZXRFbGVtZW50UmVjdCk7XHJcblx0XHRcdC8vVURBQ29uc29sZUxvZ2dlci5pbmZvKCctLS0tLS0tLS0tLS0tLS0tIFNjcmVlbiBpbmZvIC0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG5cclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIHNwYWNlIHRvIHRoZSByaWdodFxyXG5cdFx0XHRpZiAodGFyZ2V0RWxlbWVudFJlY3QucmlnaHQgKyB0b29sdGlwUG9zLndpZHRoID4gc2NyZWVuU2l6ZS5zY3JlZW4ud2lkdGgpIHtcclxuXHRcdFx0XHR0aGlzLnJlbW92ZUZyb21BcnJheShhdmFpbGFibGVQb3NpdGlvbnMsIFwicmlnaHRcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIENoZWNrIGZvciBzcGFjZSBhYm92ZVxyXG5cdFx0XHRpZiAodGFyZ2V0RWxlbWVudFJlY3QudG9wIC0gdG9vbHRpcFBvcy5oZWlnaHQgPCAwKSB7XHJcblx0XHRcdFx0dGhpcy5yZW1vdmVGcm9tQXJyYXkoYXZhaWxhYmxlUG9zaXRpb25zLCBcInRvcFwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIHNwYWNlIHRvIHRoZSBsZWZ0XHJcblx0XHRcdGlmICh0YXJnZXRFbGVtZW50UmVjdC5sZWZ0IC0gdG9vbHRpcFBvcy53aWR0aCA8IDApIHtcclxuXHRcdFx0XHR0aGlzLnJlbW92ZUZyb21BcnJheShhdmFpbGFibGVQb3NpdGlvbnMsIFwibGVmdFwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQ2hlY2sgZm9yIHNwYWNlIGJlbG93XHJcblx0XHRcdGlmICh0YXJnZXRFbGVtZW50UmVjdC5ib3R0b20gKyB0b29sdGlwUG9zLmhlaWdodCA+IHNjcmVlblNpemUucGFnZS5oZWlnaHQpIHtcclxuXHRcdFx0XHR0aGlzLnJlbW92ZUZyb21BcnJheShhdmFpbGFibGVQb3NpdGlvbnMsIFwiYm90dG9tXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoYXZhaWxhYmxlUG9zaXRpb25zLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRmaW5hbENzc0NsYXNzID0gYXZhaWxhYmxlUG9zaXRpb25zWzBdO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZmluYWxDc3NDbGFzcztcclxuXHRcdH0sXHJcblx0XHRyZW1vdmVGcm9tQXJyYXk6IGZ1bmN0aW9uKGFycmF5LCB2YWx1ZSkge1xyXG5cdFx0XHRpZiAoYXJyYXkuaW5jbHVkZXModmFsdWUpKSB7XHJcblx0XHRcdFx0YXJyYXkuc3BsaWNlKGFycmF5LmluZGV4T2YodmFsdWUpLCAxKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdC8vQ29udGludWUgZnVuY3Rpb25hbGl0eSBpbnZva2VcclxuXHRcdHJlc3VtZVBsYXk6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGxldCB0b29sdGlwbm9kZXMgPSBqUXVlcnkoJy51ZGEtdG9vbHRpcCcpO1xyXG5cdFx0XHRpZiAodG9vbHRpcG5vZGVzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRqUXVlcnkoJy51ZGEtdG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMucG9wcGVySW5zdGFuY2UuZGVzdHJveSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMucGxheU5leHRBY3Rpb24gPSB0cnVlO1xyXG5cdFx0XHR2YXIgbmF2aWdhdGlvbmNvb2tpZT10aGlzLmdldHN0b3JhZ2VkYXRhKHRoaXMubmF2aWdhdGlvbmNvb2tpZW5hbWUpO1xyXG5cdFx0XHR2YXIgbmF2aWdhdGlvbmNvb2tpZWRhdGEgPSBudWxsO1xyXG5cdFx0XHRpZihuYXZpZ2F0aW9uY29va2llKSB7XHJcblx0XHRcdFx0bmF2aWdhdGlvbmNvb2tpZWRhdGEgPSBKU09OLnBhcnNlKG5hdmlnYXRpb25jb29raWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMudG9nZ2xlYXV0b3BsYXkobmF2aWdhdGlvbmNvb2tpZWRhdGEpO1xyXG5cdFx0fSxcclxuXHRcdC8vaW52b2tlIHRoZSBjbGljayBvZiBuZXh0IGl0ZW1cclxuXHRcdGludm9rZW5leHRpdGVtOmZ1bmN0aW9uKG5vZGUsIHRpbWVUb0ludm9rZSwgbmF2aWdhdGlvbkNvb2tpZURhdGEpe1xyXG5cdFx0XHRsZXQgbGluaz1mYWxzZTtcclxuXHRcdFx0dGltZVRvSW52b2tlPXRpbWVUb0ludm9rZSs0MDAwO1xyXG5cdFx0XHRpZih0eXBlb2Ygbm9kZS5ocmVmICE9PSAndW5kZWZpbmVkJyAmJiBub2RlLmhyZWYgIT09ICcnKXtcclxuXHRcdFx0XHRpZih0eXBlb2Ygbm9kZS50YXJnZXQgIT09ICd1bmRlZmluZWQnICYmIG5vZGUudGFyZ2V0PT09J19ibGFuaycpe1xyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVhdXRvcGxheShuYXZpZ2F0aW9uQ29va2llRGF0YSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGxldCBob3N0bmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIHdpbmRvdy5sb2NhdGlvbi5ob3N0K3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuXHRcdFx0XHRcdGxldCBocmVmID0gbm9kZS5ocmVmLnN1YnN0cihob3N0bmFtZS5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0aWYoaHJlZiE9PScnICYmIGhyZWYgIT09IFwiI1wiKSB7XHJcblx0XHRcdFx0XHRcdGxpbmsgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR0aGlzLm5hdmlnYXRlZFRvTmV4dFBhZ2UuY2hlY2sgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR0aGlzLm5hdmlnYXRlZFRvTmV4dFBhZ2UudXJsID0gbm9kZS5ocmVmO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoIWxpbmspIHtcclxuXHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyhub2RlLDIpO1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtVREFQbHVnaW5TREsuc2hvd2h0bWwoKTt9LCB0aW1lVG9JbnZva2UpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRpbWVUb0ludm9rZT10aW1lVG9JbnZva2UrMzAwMDtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7VURBUGx1Z2luU0RLLnNob3dodG1sKCk7fSwgdGltZVRvSW52b2tlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdC8vc2ltdWxhdGUgaG92ZXIgZnVuY3Rpb25hbGl0eVxyXG5cdFx0c2ltdWxhdGVIb3ZlcjogZnVuY3Rpb24obm9kZSl7XHJcblx0XHRcdHZhciBldmVudCA9IG5ldyBNb3VzZUV2ZW50KCdtb3VzZW92ZXInLCB7XHJcblx0XHRcdFx0J3ZpZXcnOiB3aW5kb3csXHJcblx0XHRcdFx0J2J1YmJsZXMnOiB0cnVlLFxyXG5cdFx0XHRcdCdjYW5jZWxhYmxlJzogdHJ1ZVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0dmFyIGNhbmNlbGVkID0gIW5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcblx0XHRcdGlmIChjYW5jZWxlZCkge1xyXG5cdFx0XHRcdC8vIEEgaGFuZGxlciBjYWxsZWQgcHJldmVudERlZmF1bHQuXHJcblx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oJ2hvdmVyIGNhbmNlbGxlZCcpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vIE5vbmUgb2YgdGhlIGhhbmRsZXJzIGNhbGxlZCBwcmV2ZW50RGVmYXVsdC5cclxuXHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbygnaG92ZXIgbm90IGNhbmNlbGxlZCcpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSxcclxuXHRcdC8vZmlyaW5nIGFuIGV2ZW50IGlmIGV2ZW50IGF2YWlsYWJsZSBmb3IgdGhlIG5vZGUuIEN1cnJlbnRseSBub3QgaW1wbGVtZW50ZWRcclxuXHRcdGV2ZW50RmlyZTpmdW5jdGlvbihlbCwgZXR5cGUpe1xyXG5cdFx0XHRpZiAoZWwuZmlyZUV2ZW50KSB7XHJcblx0XHRcdFx0ZWwuZmlyZUV2ZW50KCdvbicgKyBldHlwZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIGV2T2JqID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50cycpO1xyXG5cdFx0XHRcdGV2T2JqLmluaXRFdmVudChldHlwZSwgdHJ1ZSwgZmFsc2UpO1xyXG5cdFx0XHRcdGVsLmRpc3BhdGNoRXZlbnQoZXZPYmopO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0Ly9hZGRpbmcgdXNlciBjbGljayB0byB0aGUgcHJvY2Vzc2luZyBub2RlLlxyXG5cdFx0cmVjb3JkdXNlcmNsaWNrOmZ1bmN0aW9uKG5vZGUsIGZyb21kb2N1bWVudD1mYWxzZSwgc2VsZWN0Y2hhbmdlPWZhbHNlLCBldmVudCwgY29uZmlybWRpYWxvZz1mYWxzZSwgaGFzcGFyZW50Y2xpY2sgPSBmYWxzZSl7XHJcblxyXG5cdFx0XHR0cnkge1xyXG5cclxuXHRcdFx0XHRsZXQgc3BlY2lhbElucHV0Tm9kZSA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRpZihmcm9tZG9jdW1lbnQpe1xyXG5cdFx0XHRcdFx0Ly8gdG9kbyBmcm9tIGRvY3VtZW50IGNsaWNrIGZ1bmN0aW9uYWxpdHk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZighdGhpcy5yZWNvcmRpbmcpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmKHRoaXMuYXV0b3BsYXkpe1xyXG5cdFx0XHRcdFx0dGhpcy5mb3JjZVJlaW5kZXggPSB0cnVlO1xyXG5cdFx0XHRcdFx0VURBUGx1Z2luU0RLLmluZGV4bmV3Y2xpY2tub2RlcygpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZihub2RlLmhhc0F0dHJpYnV0ZShcIm5pc3Qtdm9pY2VcIikpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZih0aGlzLmxhc3RjbGlja2Vkbm9kZSE9PScnICYmIG5vZGUuaXNTYW1lTm9kZSh0aGlzLmxhc3RjbGlja2Vkbm9kZSkpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmKHRoaXMubGFzdGNsaWNrZWR0aW1lPT09RGF0ZS5ub3coKSl7XHJcblx0XHRcdFx0XHRyZXR1cm4gO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gZml4IGZvciBmaWxlIHVwbG9hZCBjbGljayBhbmQgbm9kZSB3aGljaCBpcyBoaWRkZW5cclxuXHRcdFx0XHRpZihub2RlLnN0eWxlICYmIG5vZGUuc3R5bGUuZGlzcGxheSAmJiBub2RlLnN0eWxlLmRpc3BsYXkgPT09ICdub25lJyl7XHJcblx0XHRcdFx0XHRsZXQgc3BlY2lhbENsYXNzRXhpc3RzID0gZmFsc2U7XHJcblx0XHRcdFx0XHRub2RlLmNsYXNzTGlzdC5mb3JFYWNoKCh2YWwpID0+IHtcclxuXHRcdFx0XHRcdFx0aWYoVURBUGx1Z2luU0RLLmluQXJyYXkodmFsLCBVREFQbHVnaW5TREsuc3BlY2lhbElucHV0Q2xpY2tDbGFzc05hbWVzKSAhPT0gLTEpe1xyXG5cdFx0XHRcdFx0XHRcdHNwZWNpYWxDbGFzc0V4aXN0cyA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0c3BlY2lhbElucHV0Tm9kZSA9IHRydWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aWYoIXNwZWNpYWxDbGFzc0V4aXN0cykge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1jbGlja2VkIG5vZGUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG5cdFx0XHRcdC8vVURBQ29uc29sZUxvZ2dlci5pbmZvKHtjbGlja2Vkbm9kZTogbm9kZX0pO1xyXG5cdFx0XHRcdC8vVURBQ29uc29sZUxvZ2dlci5pbmZvKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWNsaWNrZWQgbm9kZS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcblxyXG5cdFx0XHRcdGlmKHRoaXMucmVjb3JkaW5nICYmIHRoaXMuaW5BcnJheShub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksIHRoaXMuaWdub3JlQ2xpY2tzT25TcGVjaWFsTm9kZXMpICE9PSAtMSl7XHJcblx0XHRcdFx0XHRyZXR1cm4gO1xyXG5cdFx0XHRcdH0gZWxzZSBpZih0aGlzLnJlY29yZGluZyAmJiB0aGlzLmNhbmNlbFJlY29yZGluZ0R1cmluZ1JlY29yZGluZ05vZGVzLmluZGV4T2Yobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSAhPT0gLTEpIHtcclxuXHRcdFx0XHRcdGFsZXJ0KCdTb3JyeSBjdXJyZW50bHkgd2UgZG8gbm90IHN1cHBvcnQgdGhpcyAnK25vZGUubm9kZU5hbWUrJyBzZWxlY3Rvci4gUGxlYXNlIHJlLXJlY29yZCB0aGUgc2VxdWVuY2Ugd2l0aG91dCBzZWxlY3RpbmcgJytub2RlLm5vZGVOYW1lKycgc2VsZWN0b3InKTtcclxuXHRcdFx0XHRcdHRoaXMucmVjb3JkaW5nPWZhbHNlO1xyXG5cdFx0XHRcdFx0dGhpcy5jYW5jZWxyZWNvcmRpbmdzZXF1ZW5jZSgpO1xyXG5cdFx0XHRcdFx0dGhpcy5zaG93YWR2YW5jZWRodG1sKCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gO1xyXG5cdFx0XHRcdH0gZWxzZSBpZih0aGlzLnJlY29yZGluZyAmJiAobm9kZS5wYXJlbnROb2RlICYmIG5vZGUucGFyZW50Tm9kZS5oYXNBdHRyaWJ1dGUoXCJuZy1jb250cm9sbGVyXCIpICYmIG5vZGUucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoXCJuZy1jb250cm9sbGVyXCIpPT09J3JlY29nbml6ZV9tb2RhbCcpKSB7XHJcblx0XHRcdFx0XHQvLyBmaXggZm9yIG5vbWluYXRlIHJlY29yZGluZyBmdW5jdGlvbmFsaXR5LlxyXG5cdFx0XHRcdFx0YWxlcnQoJ1NvcnJ5IGN1cnJlbnRseSB3ZSBkbyBub3Qgc3VwcG9ydCB0aGlzIE5vbWluYXRlIGZlYXR1cmUuIFBsZWFzZSByZS1yZWNvcmQgdGhlIHNlcXVlbmNlIHdpdGhvdXQgc2VsZWN0aW5nIE5vbWluYXRlIGZlYXR1cmUnKTtcclxuXHRcdFx0XHRcdHRoaXMucmVjb3JkaW5nPWZhbHNlO1xyXG5cdFx0XHRcdFx0dGhpcy5jYW5jZWxyZWNvcmRpbmdzZXF1ZW5jZSgpO1xyXG5cdFx0XHRcdFx0dGhpcy5zaG93YWR2YW5jZWRodG1sKCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gO1xyXG5cdFx0XHRcdH0gZWxzZSBpZihub2RlLmhhc0F0dHJpYnV0ZSgnbmctY2xpY2snKSAmJiBub2RlLmdldEF0dHJpYnV0ZSgnbmctY2xpY2snKSl7XHJcblx0XHRcdFx0XHRsZXQgbmdjbGljaz1ub2RlLmdldEF0dHJpYnV0ZSgnbmctY2xpY2snKTtcclxuXHRcdFx0XHRcdGlmKG5nY2xpY2suaW5kZXhPZignY2xpY2tOb3RvZmljYXRpb25CZWxsJykgIT09IC0xKXtcclxuXHRcdFx0XHRcdFx0YWxlcnQoJ1NvcnJ5IGN1cnJlbnRseSB3ZSBkbyBub3Qgc3VwcG9ydCB0aGlzIG5vdGlmaWNhdGlvbnMuIFBsZWFzZSByZS1yZWNvcmQgdGhlIHNlcXVlbmNlIHdpdGhvdXQgc2VsZWN0aW5nIE5vdGlmaWNhdGlvbnMnKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5sYXN0Y2xpY2tlZG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XHJcblx0XHRcdFx0XHRcdHRoaXMucmVjb3JkaW5nPWZhbHNlO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmNhbmNlbHJlY29yZGluZ3NlcXVlbmNlKGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5zaG93YWR2YW5jZWRodG1sKCk7XHJcblx0XHRcdFx0XHRcdHJldHVybiA7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBwcm9jZXNzaW5nIGRvY3VtZW50IGNsaWNrXHJcblx0XHRcdFx0dmFyIHByb2Nlc3NjbGljaz10cnVlO1xyXG5cdFx0XHRcdGlmKGZyb21kb2N1bWVudCAmJiB0aGlzLmh0bWxpbmRleC5sZW5ndGg+MCl7XHJcblx0XHRcdFx0XHRmb3IodmFyIGk9MDtpPHRoaXMuaHRtbGluZGV4Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdFx0XHR2YXIgcHJvY2Vzc25vZGU9dGhpcy5odG1saW5kZXhbaV07XHJcblx0XHRcdFx0XHRcdGlmKG5vZGUuaXNTYW1lTm9kZShwcm9jZXNzbm9kZVsnZWxlbWVudC1kYXRhJ10pKXtcclxuXHRcdFx0XHRcdFx0XHRwcm9jZXNzY2xpY2s9ZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmKHByb2Nlc3NjbGljaz09PWZhbHNlKXtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gdmFyIGRvbWpzb24gPSBkb21KU09OLnRvSlNPTihub2RlKTtcclxuXHRcdFx0XHRpZiAobm9kZS5oYXNPd25Qcm9wZXJ0eSgndWRhX2N1c3RvbScpICYmIG5vZGUudWRhX2N1c3RvbS5kb21Kc29uKSB7XHJcblx0XHRcdFx0XHR2YXIgZG9tanNvbiA9IG5vZGUudWRhX2N1c3RvbS5kb21Kc29uO1xyXG5cdFx0XHRcdFx0ZG9tanNvbi5tZXRhID0ge307XHJcblx0XHRcdFx0XHQvL2ZpeCBmb3IgcG9zaXRpb24gaXNzdWUgIzg5XHJcblx0XHRcdFx0XHRpZihkb21qc29uLm5vZGUubm9kZUluZm8ubm9kZVBvc2l0aW9uLnggPT09IDAgJiYgZG9tanNvbi5ub2RlLm5vZGVJbmZvLm5vZGVQb3NpdGlvbi55ID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdHZhciBkb21qc29uMSA9IGRvbUpTT04udG9KU09OKG5vZGUpO1xyXG5cdFx0XHRcdFx0XHRkb21qc29uLm5vZGUubm9kZUluZm8ubm9kZVBvc2l0aW9uID0gZG9tanNvbjEubm9kZS5ub2RlSW5mby5ub2RlUG9zaXRpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiA7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZih0aGlzLmluQXJyYXkobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLCB0aGlzLmlnbm9yZU5vZGVzRnJvbUluZGV4aW5nKSAhPT0gLTEgJiYgdGhpcy5jdXN0b21OYW1lRm9yU3BlY2lhbE5vZGVzLmhhc093blByb3BlcnR5KG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkpe1xyXG5cdFx0XHRcdFx0ZG9tanNvbi5tZXRhLmRpc3BsYXlUZXh0ID0gdGhpcy5jdXN0b21OYW1lRm9yU3BlY2lhbE5vZGVzW25vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKV07XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBjaGVjayBmb3Igc3BlY2lhbCBub2Rlc1xyXG5cdFx0XHRcdGlmKHNwZWNpYWxJbnB1dE5vZGUpe1xyXG5cdFx0XHRcdFx0ZG9tanNvbi5tZXRhLmlzUGVyc29uYWwgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gYWRkaW5nIGRlZmF1bHQgc3lzdGVtIGRldGVjdGVkIGh0bWwgZWxlbWVudCB0eXBlIGluIG1ldGFkYXRhXHJcblx0XHRcdFx0aWYodGhpcy5lbmFibGVOb2RlVHlwZUNoYW5nZVNlbGVjdGlvbikge1xyXG5cdFx0XHRcdFx0ZG9tanNvbi5tZXRhLnN5c3RlbURldGVjdGVkID0gdGhpcy5tYXBDbGlja2VkRWxlbWVudFRvSHRtbEZvcm1FbGVtZW50KG5vZGUpO1xyXG5cdFx0XHRcdFx0aWYgKGRvbWpzb24ubWV0YS5zeXN0ZW1EZXRlY3RlZC5pbnB1dEVsZW1lbnQgIT09ICdvdGhlcnMnKSB7XHJcblx0XHRcdFx0XHRcdGRvbWpzb24ubWV0YS5zZWxlY3RlZEVsZW1lbnQgPSBkb21qc29uLm1ldGEuc3lzdGVtRGV0ZWN0ZWQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZihub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PT1cImlucHV0XCIgJiYgbm9kZS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpPT09XCJyYWRpb1wiKXtcclxuXHRcdFx0XHRcdHZhciBwb3N0ZGF0YSA9IHtcclxuXHRcdFx0XHRcdFx0ZG9tYWluOiB3aW5kb3cubG9jYXRpb24uaG9zdCxcclxuXHRcdFx0XHRcdFx0dXJscGF0aDogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLFxyXG5cdFx0XHRcdFx0XHRzZXNzaW9uaWQ6IHRoaXMuc2Vzc2lvbklELFxyXG5cdFx0XHRcdFx0XHRjbGlja2Vkbm9kZW5hbWU6IFwiXCIsXHJcblx0XHRcdFx0XHRcdGh0bWw1OiAwLFxyXG5cdFx0XHRcdFx0XHRjbGlja2VkcGF0aDogXCJcIixcclxuXHRcdFx0XHRcdFx0b2JqZWN0ZGF0YTogXCJcIlxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdHZhciBjYWNoZSA9IFtdO1xyXG5cdFx0XHRcdFx0dmFyIHN0cmluZ2lmaWVkbm9kZT1KU09OLnN0cmluZ2lmeShkb21qc29uLm5vZGUsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoY2FjaGUuaW5kZXhPZih2YWx1ZSkgIT09IC0xKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBEdXBsaWNhdGUgcmVmZXJlbmNlIGZvdW5kLCBkaXNjYXJkIGtleVxyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHQvLyBTdG9yZSB2YWx1ZSBpbiBvdXIgY29sbGVjdGlvblxyXG5cdFx0XHRcdFx0XHRcdGNhY2hlLnB1c2godmFsdWUpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0Y2FjaGUgPSBudWxsO1xyXG5cdFx0XHRcdFx0ZG9tanNvbi5ub2RlPUpTT04ucGFyc2Uoc3RyaW5naWZpZWRub2RlKTtcclxuXHRcdFx0XHRcdHBvc3RkYXRhLm9iamVjdGRhdGE9SlNPTi5zdHJpbmdpZnkoZG9tanNvbik7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHZhciBwb3N0ZGF0YSA9IHtcclxuXHRcdFx0XHRcdFx0ZG9tYWluOiB3aW5kb3cubG9jYXRpb24uaG9zdCxcclxuXHRcdFx0XHRcdFx0dXJscGF0aDogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLFxyXG5cdFx0XHRcdFx0XHRzZXNzaW9uaWQ6IHRoaXMuc2Vzc2lvbklELFxyXG5cdFx0XHRcdFx0XHRjbGlja2Vkbm9kZW5hbWU6IFwiXCIsXHJcblx0XHRcdFx0XHRcdGh0bWw1OiAwLFxyXG5cdFx0XHRcdFx0XHRjbGlja2VkcGF0aDogXCJcIixcclxuXHRcdFx0XHRcdFx0b2JqZWN0ZGF0YTogSlNPTi5zdHJpbmdpZnkoZG9tanNvbilcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHBvc3RkYXRhLmNsaWNrZWRub2RlbmFtZSA9IHRoaXMuZ2V0Y2xpY2tlZGlucHV0bGFiZWxzKG5vZGUsIGZyb21kb2N1bWVudCwgc2VsZWN0Y2hhbmdlKTtcclxuXHJcblx0XHRcdFx0Ly8gZm9yIGtub3duIHNjZW5hcmlvcyBwcm9tcHQgdXNlciBmb3IgaW5wdXRcclxuXHRcdFx0XHRpZihjb25maXJtZGlhbG9nICYmIHRoaXMucmVjb3JkaW5nICYmICF0aGlzLmNvbmZpcm1lZG5vZGUgJiYgIXRoaXMuYXV0b3BsYXkpe1xyXG5cdFx0XHRcdFx0dGhpcy5jb25maXJtUGFyZW50Q2xpY2sobm9kZSwgZnJvbWRvY3VtZW50LCBzZWxlY3RjaGFuZ2UsIGV2ZW50LCBwb3N0ZGF0YSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9IGVsc2UgaWYoY29uZmlybWRpYWxvZyAmJiAhdGhpcy5yZWNvcmRpbmcpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5yZXJlbmRlcmh0bWw9dHJ1ZTtcclxuXHRcdFx0XHR0aGlzLmFkZGNsaWNrZWRyZWNvcmRjb29raWUocG9zdGRhdGEuY2xpY2tlZG5vZGVuYW1lKTtcclxuXHRcdFx0XHR0aGlzLmxhc3RjbGlja2Vkbm9kZT1ub2RlO1xyXG5cdFx0XHRcdHRoaXMubGFzdGNsaWNrZWR0aW1lPURhdGUubm93KCk7XHJcblx0XHRcdFx0dmFyIG91dHB1dGRhdGEgPSBKU09OLnN0cmluZ2lmeShwb3N0ZGF0YSk7XHJcblx0XHRcdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0XHRcdHhoci5vcGVuKFwiUE9TVFwiLCBVREFfQVBJX1VSTCtcIi91c2VyL2NsaWNrZWRub2RlXCIsIGZhbHNlKTtcclxuXHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLTgnKTtcclxuXHRcdFx0XHR4aHIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0XHRcdFx0aWYoeGhyLnN0YXR1cyA9PT0gMjAwKXtcclxuXHRcdFx0XHRcdFx0VURBUGx1Z2luU0RLLmNvbmZpcm1lZG5vZGUgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0Ly8gcmVyZW5kZXIgaHRtbCBpZiByZWNvcmRpbmcgaXMgZW5hYmxlZC5cclxuXHRcdFx0XHRcdFx0aWYoVURBUGx1Z2luU0RLLnJlY29yZGluZykge1xyXG5cdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0VURBUGx1Z2luU0RLLnNob3dodG1sKCk7XHJcblx0XHRcdFx0XHRcdFx0fSwgVURBX1BPU1RfSU5URVJWQUwpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHR4aHIuc2VuZChvdXRwdXRkYXRhKTtcclxuXHJcblx0XHRcdFx0Ly8gcmVpbmRleGluZyB3aG9sZSBkb2N1bWVudCBhZ2FpbiBmb3IgY29sbGFwc2FibGUgbm9kZXNcclxuXHRcdFx0XHRpZih0aGlzLnJlY29yZGluZykge1xyXG5cdFx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1jb2xsYXBzYWJsZSBub2RlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcblx0XHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyh7aW5kZXhlZHBvczogbm9kZS51ZGFfY3VzdG9tLmRvbUpzb24ubm9kZS5ub2RlSW5mby5ub2RlUG9zaXRpb259KTtcclxuXHRcdFx0XHRcdC8vVURBQ29uc29sZUxvZ2dlci5pbmZvKHtkb21qc29uOiBkb21qc29uLm5vZGUubm9kZUluZm8ubm9kZVBvc2l0aW9ufSk7XHJcblx0XHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWNvbGxhcHNhYmxlIG5vZGUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuXHJcblx0XHRcdFx0XHRpZiAobm9kZS5oYXNBdHRyaWJ1dGUoJ21hdHRyZWVub2RldG9nZ2xlJykpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5mb3JjZVJlaW5kZXggPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRVREFQbHVnaW5TREsuaW5kZXhuZXdjbGlja25vZGVzKCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvL3Byb2Nlc3NpbmcgbmV3IGNsaWNrbm9kZXMgaWYgYXZhaWxhYmxlIGFmdGVyIHRoZSBjbGljayBhY3Rpb24uXHJcblx0XHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZm9yY2VSZWluZGV4ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRVREFQbHVnaW5TREsuaW5kZXhuZXdjbGlja25vZGVzKCk7XHJcblx0XHRcdFx0XHRcdH0sIFVEQV9QT1NUX0lOVEVSVkFMKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRVREFFcnJvckxvZ2dlci5lcnJvcignVW5hYmxlIHRvIHJlY29yZCAnK25vZGUub3V0ZXJIVE1MKycgJysgZSk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRjb25maXJtUGFyZW50Q2xpY2s6ZnVuY3Rpb24obm9kZSwgZnJvbWRvY3VtZW50LCBzZWxlY3RjaGFuZ2UsIGV2ZW50LCBwb3N0ZGF0YSkge1xyXG5cdFx0XHRsZXQgcHJldkNsaWNrVGV4dCA9IHRoaXMuZ2V0Y2xpY2tlZGlucHV0bGFiZWxzKHRoaXMubGFzdGNsaWNrZWRub2RlLCBmcm9tZG9jdW1lbnQsIHNlbGVjdGNoYW5nZSk7XHJcblx0XHRcdGlmKG5vZGUuaGFzQ2hpbGROb2RlcygpKSB7XHJcblx0XHRcdFx0dmFyIGNoaWxkVGV4dEV4aXN0cyA9IHRoaXMucHJvY2Vzc3BhcmVudGNoaWxkbm9kZXMobm9kZSwgcHJldkNsaWNrVGV4dCk7XHJcblx0XHRcdFx0aWYoIWNoaWxkVGV4dEV4aXN0cykge1xyXG5cdFx0XHRcdFx0Ly8gdHJ1bmNhdGluZyB0ZXh0IHRvIG1heCAxMjBjaGFyXHJcblx0XHRcdFx0XHRsZXQgZGlzcGxheVRleHQgPSAoKHBvc3RkYXRhLmNsaWNrZWRub2RlbmFtZS5sZW5ndGggPiAxMjApID8gKHBvc3RkYXRhLmNsaWNrZWRub2RlbmFtZS5zdWJzdHIoMCwgMTIwKSArICcuLi4nKSA6IChwb3N0ZGF0YS5jbGlja2Vkbm9kZW5hbWUpICk7XHJcblx0XHRcdFx0XHRsZXQgY29uZmlybURpYWxvZyA9IGNvbmZpcm0oXCJEaWQgeW91IGNsaWNrIG9uOiBcIiArIGRpc3BsYXlUZXh0KTtcclxuXHRcdFx0XHRcdGlmIChjb25maXJtRGlhbG9nID09PSB0cnVlKSB7XHJcblx0XHRcdFx0XHRcdFVEQVBsdWdpblNESy5jb25maXJtZWRub2RlID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0VURBUGx1Z2luU0RLLnJlY29yZHVzZXJjbGljayhub2RlLCBmcm9tZG9jdW1lbnQsIHNlbGVjdGNoYW5nZSwgZXZlbnQsIGZhbHNlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHByb2Nlc3NwYXJlbnRjaGlsZG5vZGVzOmZ1bmN0aW9uKG5vZGUsIHByZXZ0ZXh0KSB7XHJcblx0XHRcdHZhciBjaGlsZHRleHRleGlzdHMgPSBmYWxzZTtcclxuXHRcdFx0Zm9yKGNvbnN0IGNoaWxkbm9kZSBvZiBub2RlLmNoaWxkTm9kZXMpIHtcclxuXHRcdFx0XHRpZiAoY2hpbGRub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMubGFzdGNsaWNrZWRub2RlICYmIGNoaWxkbm9kZS5pc1NhbWVOb2RlKHRoaXMubGFzdGNsaWNrZWRub2RlKSkge1xyXG5cdFx0XHRcdFx0XHRjaGlsZHRleHRleGlzdHMgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxldCBjaGlsZHRleHQgPSB0aGlzLmdldGNsaWNrZWRpbnB1dGxhYmVscyhjaGlsZG5vZGUpO1xyXG5cdFx0XHRcdFx0aWYocHJldnRleHQgPT09IGNoaWxkdGV4dCkge1xyXG5cdFx0XHRcdFx0XHRjaGlsZHRleHRleGlzdHMgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH0gZWxzZSBpZihjaGlsZG5vZGUuaGFzQ2hpbGROb2RlcygpKXtcclxuXHRcdFx0XHRcdFx0Y2hpbGR0ZXh0ZXhpc3RzID0gdGhpcy5wcm9jZXNzcGFyZW50Y2hpbGRub2RlcyhjaGlsZG5vZGUsIHByZXZ0ZXh0KTtcclxuXHRcdFx0XHRcdFx0aWYoY2hpbGR0ZXh0ZXhpc3RzKSB7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGNoaWxkdGV4dGV4aXN0c1xyXG5cdFx0fSxcclxuXHRcdC8vZ2V0dGluZyBpbnB1dCBsYWJlbCBmb3IgdGhlIGNsaWNrZWQgbm9kZVxyXG5cdFx0Z2V0Y2xpY2tlZGlucHV0bGFiZWxzOmZ1bmN0aW9uKG5vZGUsIGZyb21kb2N1bWVudD1mYWxzZSwgc2VsZWN0Y2hhbmdlPWZhbHNlKXtcclxuXHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oe25vZGU6IG5vZGV9KTtcclxuXHJcblx0XHRcdGlmICghbm9kZSkge1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBpbnB1dGxhYmVscz1cIlwiO1xyXG5cdFx0XHR2YXIgbm9kZW5hbWU9bm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRzd2l0Y2ggKG5vZGVuYW1lKSB7XHJcblx0XHRcdFx0Y2FzZSBcInNlbGVjdFwiOlxyXG5cdFx0XHRcdFx0aWYoc2VsZWN0Y2hhbmdlKSB7XHJcblx0XHRcdFx0XHRcdGlucHV0bGFiZWxzID0galF1ZXJ5KG5vZGUpLmZpbmQoXCI6c2VsZWN0ZWRcIikudGV4dCgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dmFyIHRleHRsYWJlbHMgPSB0aGlzLmdldElucHV0TGFiZWxzKG5vZGUsIFtdLCAxLCB0cnVlLCBmYWxzZSwgdHJ1ZSk7XHJcblx0XHRcdFx0XHRcdGlmICh0ZXh0bGFiZWxzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgbGFiZWxzID0gW107XHJcblx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCB0ZXh0bGFiZWxzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRsYWJlbHMucHVzaCh0ZXh0bGFiZWxzW2pdLnRleHQpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpbnB1dGxhYmVscyA9IGxhYmVscy50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFwiaW5wdXRcIjpcclxuXHRcdFx0XHRcdGlmKCFub2RlLmhhc0F0dHJpYnV0ZShcInR5cGVcIikpe1xyXG5cdFx0XHRcdFx0XHR2YXIgdGV4dGxhYmVscyA9IHRoaXMuZ2V0SW5wdXRMYWJlbHMobm9kZSwgW10sIDEsIHRydWUsIHRydWUsIHRydWUpO1xyXG5cdFx0XHRcdFx0XHRpZiAodGV4dGxhYmVscy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGxhYmVscyA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgdGV4dGxhYmVscy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWxzLnB1c2godGV4dGxhYmVsc1tqXS50ZXh0KTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aW5wdXRsYWJlbHMgPSBsYWJlbHMudG9TdHJpbmcoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0c3dpdGNoIChub2RlLmdldEF0dHJpYnV0ZShcInR5cGVcIikudG9Mb3dlckNhc2UoKSkge1xyXG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgdGV4dGxhYmVscyA9IHRoaXMuZ2V0SW5wdXRMYWJlbHMobm9kZSwgW10sIDEsIHRydWUsIHRydWUsIHRydWUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHRleHRsYWJlbHMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgbGFiZWxzID0gW107XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgdGV4dGxhYmVscy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVscy5wdXNoKHRleHRsYWJlbHNbal0udGV4dCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0aW5wdXRsYWJlbHMgPSBsYWJlbHMudG9TdHJpbmcoKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRjYXNlIFwidGV4dGFyZWFcIjpcclxuXHRcdFx0XHRcdHZhciB0ZXh0bGFiZWxzID0gdGhpcy5nZXRJbnB1dExhYmVscyhub2RlLCBbXSwgMSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSk7XHJcblx0XHRcdFx0XHRpZiAodGV4dGxhYmVscy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdHZhciBsYWJlbHMgPSBbXTtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCB0ZXh0bGFiZWxzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0XHRcdFx0bGFiZWxzLnB1c2godGV4dGxhYmVsc1tqXS50ZXh0KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpbnB1dGxhYmVscyA9IGxhYmVscy50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBcImltZ1wiOlxyXG5cdFx0XHRcdFx0dmFyIHRleHRsYWJlbHMgPSB0aGlzLmdldElucHV0TGFiZWxzKG5vZGUsIFtdLCAxLCB0cnVlLCBmYWxzZSwgdHJ1ZSk7XHJcblx0XHRcdFx0XHRpZiAodGV4dGxhYmVscy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdHZhciBsYWJlbHMgPSBbXTtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCB0ZXh0bGFiZWxzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0XHRcdFx0bGFiZWxzLnB1c2godGV4dGxhYmVsc1tqXS50ZXh0KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpbnB1dGxhYmVscyA9IGxhYmVscy50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdHZhciB0ZXh0bGFiZWxzID0gdGhpcy5nZXRJbnB1dExhYmVscyhub2RlLCBbXSwgMSwgZmFsc2UsIHRydWUsIHRydWUpO1xyXG5cdFx0XHRcdFx0aWYgKHRleHRsYWJlbHMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHR2YXIgbGFiZWxzID0gW107XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgdGV4dGxhYmVscy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdFx0XHRcdGxhYmVscy5wdXNoKHRleHRsYWJlbHNbal0udGV4dCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aW5wdXRsYWJlbHMgPSBsYWJlbHMudG9TdHJpbmcoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyhpbnB1dGxhYmVscyk7XHJcblx0XHRcdHJldHVybiBpbnB1dGxhYmVscztcclxuXHRcdH0sXHJcblx0XHQvL3JlY29yZCBwYWdlIGNsaWNrIHRvZG8gZnVuY3Rpb25hbGl0eVxyXG5cdFx0cmVjb3JkZG9jdW1lbnRjbGljazpmdW5jdGlvbigpe1xyXG5cdFx0XHRqUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkgeyB9LCBmYWxzZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdC8vYWRkaW5nIGN1cnJlbnQgdGltZXN0YW1wIHRvIHRoZSByZXF1aXJlZCBhY3Rpb25zIHVuZGVyIHJlY29yZGluZyBmdW5jdGlvbmFsaXR5XHJcblx0XHRnZXR0aW1lc3RhbXA6ZnVuY3Rpb24oYnV0dG9uY2xpY2tlZCl7XHJcblx0XHRcdGlmKGJ1dHRvbmNsaWNrZWQgIT09IFwiXCIpIHtcclxuXHRcdFx0XHR2YXIgcmVzdWx0ID0gRGF0ZS5ub3coKTtcclxuXHRcdFx0XHRpZihidXR0b25jbGlja2VkPT09XCJzdGFydFwiKXtcclxuXHRcdFx0XHRcdHRoaXMuc3RhcnRyZWNvcmRpbmdzZXF1ZW5jZShyZXN1bHQpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZihidXR0b25jbGlja2VkPT09XCJzdG9wXCIpe1xyXG5cdFx0XHRcdFx0dGhpcy5zdG9wcmVjb3JkaW5nc2VxdWVuY2UocmVzdWx0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHQvL3Nob3cgcmVjb3JkZWQgcmVzdWx0cyBpbiBVREEgc2NyZWVuXHJcblx0XHRzaG93cmVjb3JkZWRyZXN1bHRzOmZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciByZWNvcmRpbmdjb29raWUgPSB0aGlzLmdldHN0b3JhZ2VkYXRhKHRoaXMucmVjb3JkaW5nY29va2llbmFtZSk7XHJcblx0XHRcdHZhciBzdGFydHRpbWU9bnVsbDtcclxuXHRcdFx0dmFyIGVuZHRpbWU9RGF0ZS5ub3coKTtcclxuXHRcdFx0aWYocmVjb3JkaW5nY29va2llKXtcclxuXHRcdFx0XHR2YXIgcmVjb3JkaW5nY29va2llZGF0YT1KU09OLnBhcnNlKHJlY29yZGluZ2Nvb2tpZSk7XHJcblx0XHRcdFx0c3RhcnR0aW1lPXJlY29yZGluZ2Nvb2tpZWRhdGEuc3RhcnR0aW1lO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0alF1ZXJ5KFwiI3VkYS1jb250ZW50LWNvbnRhaW5lclwiKS5odG1sKFwiXCIpO1xyXG5cclxuXHRcdFx0aWYodGhpcy5jbGlja2VPbiAmJiB0aGlzLmNsaWNrZU9uID09PSAncmVjb3JkLWJ0bicpe1xyXG5cdFx0XHRcdFVEQVBsdWdpblNESy5hZGRyZWNvcmRyZXN1bHRzaHRtbChbXSk7XHJcblx0XHRcdFx0dGhpcy5jbGlja2VPbiA9ICcnO1xyXG5cdFx0XHRcdHJldHVybiA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdFx0eGhyLm9wZW4oXCJHRVRcIiwgVURBX0FQSV9VUkwrXCIvY2xpY2tldmVudHMvZmV0Y2hyZWNvcmRkYXRhP3N0YXJ0PVwiK3N0YXJ0dGltZStcIiZlbmQ9XCIrZW5kdGltZStcIiZzZXNzaW9uaWQ9XCIrVURBUGx1Z2luU0RLLnNlc3Npb25JRCtcIiZkb21haW49XCIrcmVjb3JkaW5nY29va2llZGF0YS5kb21haW4sIHRydWUpO1xyXG5cdFx0XHR4aHIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0XHRcdGlmKHhoci5zdGF0dXMgPT09IDIwMCl7XHJcblx0XHRcdFx0XHRVREFQbHVnaW5TREsuYWRkcmVjb3JkcmVzdWx0c2h0bWwoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdHhoci5zZW5kKCk7XHJcblx0XHR9LFxyXG5cdFx0Ly9zdGFydCByZWNvcmRpbmcgdGhlIHVzZXIgY2xpY2sgdG8gZm9ybSBhIHNlcXVlbmNlXHJcblx0XHRzdGFydHJlY29yZGluZ3NlcXVlbmNlOmZ1bmN0aW9uKGN1cnJlbnR0aW1lc3RhbXApe1xyXG5cdFx0XHR2YXIgcmVjb3JkaW5nY29va2llID0gdGhpcy5nZXRzdG9yYWdlZGF0YSh0aGlzLnJlY29yZGluZ2Nvb2tpZW5hbWUpO1xyXG5cdFx0XHRpZiAocmVjb3JkaW5nY29va2llKSB7XHJcblx0XHRcdFx0dmFyIHJlY29yZGluZ2Nvb2tpZWRhdGEgPSBKU09OLnBhcnNlKHJlY29yZGluZ2Nvb2tpZSk7XHJcblx0XHRcdFx0cmVjb3JkaW5nY29va2llZGF0YS5zdGFydHRpbWUgPSBjdXJyZW50dGltZXN0YW1wO1xyXG5cdFx0XHRcdHJlY29yZGluZ2Nvb2tpZWRhdGEucmVjb3JkaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRyZWNvcmRpbmdjb29raWVkYXRhLmVuZHRpbWUgPSBudWxsO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhciByZWNvcmRpbmdjb29raWVkYXRhID0ge3JlY29yZGluZzogdHJ1ZSwgc3RhcnR0aW1lOiBjdXJyZW50dGltZXN0YW1wLCBlbmR0aW1lOiBudWxsfTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZWNvcmRpbmdjb29raWVkYXRhLmRvbWFpbiA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0O1xyXG5cdFx0XHR0aGlzLmNyZWF0ZXN0b3JhZ2VkYXRhKHRoaXMucmVjb3JkaW5nY29va2llbmFtZSxKU09OLnN0cmluZ2lmeShyZWNvcmRpbmdjb29raWVkYXRhKSk7XHJcblxyXG5cdFx0XHR0aGlzLmNsaWNrZU9uID0gJ3JlY29yZC1idG4nO1xyXG5cclxuXHRcdFx0dGhpcy5zaG93aHRtbCgpO1xyXG5cclxuXHRcdFx0Ly9hZGQgYW5hbHR5dGljc1xyXG5cdFx0XHR0aGlzLnJlY29yZGNsaWNrKCdyZWNvcmRpbmdzdGFydCcscmVjb3JkaW5nY29va2llZGF0YS5kb21haW4pO1xyXG5cdFx0fSxcclxuXHRcdC8vc3RvcCByZWNvcmRpbmcgc2VxdWVuY2UgdGhhdCBoYXMgYmVlbiBzdGFydGVkIGFuZCBzaG93IHJlY29yZGVkIHJlc3VsdHNcclxuXHRcdHN0b3ByZWNvcmRpbmdzZXF1ZW5jZTpmdW5jdGlvbihjdXJyZW50dGltZXN0YW1wKXtcclxuXHRcdFx0dmFyIHJlY29yZGluZ2Nvb2tpZSA9IHRoaXMuZ2V0c3RvcmFnZWRhdGEodGhpcy5yZWNvcmRpbmdjb29raWVuYW1lKTtcclxuXHRcdFx0aWYocmVjb3JkaW5nY29va2llKXtcclxuXHRcdFx0XHR2YXIgcmVjb3JkaW5nY29va2llZGF0YT1KU09OLnBhcnNlKHJlY29yZGluZ2Nvb2tpZSk7XHJcblx0XHRcdFx0cmVjb3JkaW5nY29va2llZGF0YS5lbmR0aW1lPWN1cnJlbnR0aW1lc3RhbXA7XHJcblx0XHRcdFx0cmVjb3JkaW5nY29va2llZGF0YS5yZWNvcmRpbmc9ZmFsc2U7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuY3JlYXRlc3RvcmFnZWRhdGEodGhpcy5yZWNvcmRpbmdjb29raWVuYW1lLEpTT04uc3RyaW5naWZ5KHJlY29yZGluZ2Nvb2tpZWRhdGEpKTtcclxuXHJcblx0XHRcdC8vYWRkIGFuYWx0eXRpY3NcclxuXHRcdFx0dGhpcy5yZWNvcmRjbGljaygncmVjb3JkaW5nc3RvcCcscmVjb3JkaW5nY29va2llZGF0YS5kb21haW4pO1xyXG5cclxuXHRcdFx0dGhpcy5zaG93aHRtbCgpO1xyXG5cdFx0XHRqUXVlcnkoXCIjdWRhLWNvbnRlbnQtY29udGFpbmVyXCIpLmh0bWwoXCJcIik7XHJcblx0XHRcdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdFx0eGhyLm9wZW4oXCJHRVRcIiwgVURBX0FQSV9VUkwrXCIvY2xpY2tldmVudHMvZmV0Y2hyZWNvcmRkYXRhP3N0YXJ0PVwiK3JlY29yZGluZ2Nvb2tpZWRhdGEuc3RhcnR0aW1lK1wiJmVuZD1cIityZWNvcmRpbmdjb29raWVkYXRhLmVuZHRpbWUrXCImc2Vzc2lvbmlkPVwiK1VEQVBsdWdpblNESy5zZXNzaW9uSUQrXCImZG9tYWluPVwiK3JlY29yZGluZ2Nvb2tpZWRhdGEuZG9tYWluLCB0cnVlKTtcclxuXHRcdFx0eGhyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuXHRcdFx0XHRpZih4aHIuc3RhdHVzID09PSAyMDApe1xyXG5cdFx0XHRcdFx0VURBUGx1Z2luU0RLLmFkZHJlY29yZHJlc3VsdHNodG1sKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHR4aHIuc2VuZCgpO1xyXG5cdFx0fSxcclxuXHRcdC8vY2FuY2VsIHRoZSByZWNvcmRpbmcgc2VxdWVuY2VcclxuXHRcdGNhbmNlbHJlY29yZGluZ3NlcXVlbmNlOmZ1bmN0aW9uKHJlbmRlcj10cnVlKXtcclxuXHRcdFx0Ly8galF1ZXJ5KCcjdWRhLWFkdmFuY2VkLWJ0bicpLmhpZGUoKTtcclxuXHRcdFx0dmFyIHJlY29yZGluZ2Nvb2tpZSA9IHRoaXMuZ2V0c3RvcmFnZWRhdGEodGhpcy5yZWNvcmRpbmdjb29raWVuYW1lKTtcclxuXHRcdFx0aWYocmVjb3JkaW5nY29va2llKXtcclxuXHRcdFx0XHR2YXIgcmVjb3JkaW5nY29va2llZGF0YT1KU09OLnBhcnNlKHJlY29yZGluZ2Nvb2tpZSk7XHJcblx0XHRcdFx0aWYoIXJlY29yZGluZ2Nvb2tpZWRhdGEucmVjb3JkaW5nKXtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmVjb3JkaW5nY29va2llZGF0YS5lbmR0aW1lPURhdGUubm93KCk7XHJcblx0XHRcdFx0cmVjb3JkaW5nY29va2llZGF0YS5yZWNvcmRpbmc9ZmFsc2U7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuY3JlYXRlc3RvcmFnZWRhdGEodGhpcy5yZWNvcmRpbmdjb29raWVuYW1lLEpTT04uc3RyaW5naWZ5KHJlY29yZGluZ2Nvb2tpZWRhdGEpKTtcclxuXHRcdFx0dmFyIG5hdmNvb2tpZWRhdGEgPSB7c2hvd25hdjogZmFsc2UsIGRhdGE6IHt9LCBhdXRvcGxheTpmYWxzZSwgcGF1c2U6ZmFsc2UsIHN0b3A6ZmFsc2UsIG5hdmNvbXBsZXRlZDpmYWxzZSwgbmF2aWdhdGVkZGF0YTpbXSxzZWFyY2h0ZXJtOicnfTtcclxuXHRcdFx0dGhpcy5jcmVhdGVzdG9yYWdlZGF0YSh0aGlzLm5hdmlnYXRpb25jb29raWVuYW1lLEpTT04uc3RyaW5naWZ5KG5hdmNvb2tpZWRhdGEpKTtcclxuXHJcblx0XHRcdGxldCB0b29sdGlwbm9kZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd1ZGEtdG9vbHRpcCcpO1xyXG5cdFx0XHRpZiAodG9vbHRpcG5vZGVzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRqUXVlcnkoJy51ZGEtdG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMucG9wcGVySW5zdGFuY2UuZGVzdHJveSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL2FkZCBhbmFsdHl0aWNzXHJcblx0XHRcdHRoaXMucmVjb3JkY2xpY2soJ3JlY29yZGluZ2NhbmNlbCcscmVjb3JkaW5nY29va2llZGF0YS5kb21haW4pO1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRQYWdlPSdjYW5jZWxyZWNvcmRpbmcnO1xyXG5cdFx0XHRpZihyZW5kZXIpIHtcclxuXHRcdFx0XHR0aGlzLnNob3dodG1sKCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHQvL3Nob3cgc2VxdWVuY2UgbGlzdCBodG1sXHJcblx0XHRhZGRyZWNvcmRyZXN1bHRzaHRtbDpmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0aWYoZGF0YS5sZW5ndGg+MCkge1xyXG5cdFx0XHRcdHRoaXMucmVjb3JkZWRzZXF1ZW5jZWlkcz1kYXRhO1xyXG5cdFx0XHRcdGpRdWVyeShcIiN1ZGEtY29udGVudC1jb250YWluZXJcIikuaHRtbCh0aGlzLnJlbmRlclJlY29yZGVkU2VxdWVuY2VIdG1sKCkpO1xyXG5cdFx0XHRcdGZvcih2YXIgaT0wO2k8ZGF0YS5sZW5ndGg7aSsrKXtcclxuXHRcdFx0XHRcdC8vIG1vZGlmaWNhdGlvbiBmb3IgcGVyc29uYWwgYnV0dG9uIGFkZGl0aW9uXHJcblx0XHRcdFx0XHRpZihpPT09KGRhdGEubGVuZ3RoLTEpKXtcclxuXHRcdFx0XHRcdFx0dGhpcy5yZW5kZXJyZWNvcmRyZXN1bHRyb3coZGF0YVtpXSxpLHRydWUpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5yZW5kZXJyZWNvcmRyZXN1bHRyb3coZGF0YVtpXSxpLGZhbHNlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0alF1ZXJ5KFwiI3VkYS1jb250ZW50LWNvbnRhaW5lclwiKS5odG1sKHRoaXMucmVuZGVyRW1wdHlSZWNvcmRlZFNlcXVlbmNlSHRtbCgpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5vcGVubW9kYWwoZmFsc2UpO1xyXG5cdFx0fSxcclxuXHRcdHJlbmRlclJlY29yZGVkU2VxdWVuY2VIdG1sOiBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgaHRtbCA9XHQnPGRpdiBjbGFzcz1cInVkYS1jYXJkLWRldGFpbHNcIj4nXHJcblx0XHRcdFx0XHRcdCsnXHQ8aDU+UmVjb3JkZWQgU2VxdWVuY2U8L2g1PidcclxuXHRcdFx0XHRcdFx0KydcdDxociBzdHlsZT1cImJvcmRlcjoxcHggc29saWQgIzk2OTY5Njsgd2lkdGg6MTAwJTtcIj4nXHJcblx0XHRcdFx0XHRcdCsnXHQ8dWwgY2xhc3M9XCJ1ZGEtcmVjb3JkaW5nXCIgaWQ9XCJ1ZGEtcmVjb3JkZWQtcmVzdWx0c1wiPidcclxuXHRcdFx0XHRcdFx0KydcdDwvdWw+J1xyXG5cclxuXHRcdFx0XHRcdFx0KydcdDxociBzdHlsZT1cImJvcmRlcjoxcHggc29saWQgIzk2OTY5Njsgd2lkdGg6MTAwJTtcIj4nXHJcblxyXG5cdFx0XHRcdFx0XHQrJ1x0PGRpdiBzdHlsZT1cInRleHQtYWxpZ246bGVmdDtcIj4nXHJcblx0XHRcdFx0XHRcdCsnXHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwidWRhLXJlY29yZGVkLW5hbWVcIiBuYW1lPVwidWRhLXNhdmUtcmVjb3JkZWRbXVwiIGNsYXNzPVwidWRhLWZvcm0taW5wdXRcIiBwbGFjZWhvbGRlcj1cIkVudGVyIExhYmVsXCI+J1xyXG5cdFx0XHRcdFx0XHQrJ1x0XHQ8ZGl2IGlkPVwidWRhLXNlcXVlbmNlLW5hbWVzXCI+PC9kaXY+J1xyXG5cdFx0XHRcdFx0XHQrJ1x0XHQ8ZGl2IHN0eWxlPVwibWFyZ2luLWJvdHRvbToxMHB4O1wiPidcclxuXHRcdFx0XHRcdFx0KydcdFx0XHQ8YnV0dG9uIGNsYXNzPVwiYWRkLWJ0blwiIG9uY2xpY2s9XCJVREFQbHVnaW5TREsuYWRkU2VxdWVuY2VOYW1lUm93KCk7XCI+KyBBZGQgTGFiZWw8L2J1dHRvbj4nXHJcblx0XHRcdFx0XHRcdCsnXHRcdDwvZGl2PidcclxuXHRcdFx0XHRcdFx0KydcdFx0PGJyPidcclxuXHRcdFx0XHRcdFx0KydcdFx0PGJyPidcclxuXHRcdFx0XHRcdFx0KydcdFx0PGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6IDEwcHg7IG1heC13aWR0aDoxMDAlO1wiPidcclxuXHRcdFx0XHRcdFx0KydcdFx0XHQ8YnV0dG9uIGNsYXNzPVwidWRhLXJlY29yZC1idG5cIiBvbmNsaWNrPVwiVURBUGx1Z2luU0RLLmNhbmNlbHJlY29yZGluZ3NlcXVlbmNlKCk7XCI+PHNwYW4+Q2FuY2VsIGFuZCBFeGl0PC9zcGFuPjwvYnV0dG9uPidcclxuXHRcdFx0XHRcdFx0KydcdFx0XHQ8YnV0dG9uIGNsYXNzPVwidWRhLXR1dG9yaWFsLWJ0blwiIG9uY2xpY2s9XCJVREFQbHVnaW5TREsuc3VibWl0cmVjb3JkZWRsYWJlbCgpO1wiIHN0eWxlPVwiZmxvYXQ6IHJpZ2h0OyBwYWRkaW5nOjVweCAyMHB4O1wiPlN1Ym1pdDwvYnV0dG9uPidcclxuXHRcdFx0XHRcdFx0KydcdFx0PC9kaXY+J1xyXG5cclxuXHRcdFx0XHRcdFx0KydcdDwvZGl2PidcclxuXHRcdFx0XHRcdFx0Kyc8L2Rpdj4nO1xyXG5cclxuXHRcdFx0XHRcdFx0LyorJ1x0PGRpdiBjbGFzcz1cInVkYS1yZWNvcmRpbmdcIiBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjtcIj4nXHJcblx0XHRcdFx0XHRcdCsnXHQ8dGFibGUgaWQ9XCJ1ZGEtc2VxdWVuY2UtbmFtZXNcIj48dHI+J1xyXG5cdFx0XHRcdFx0XHQrJ1x0XHQ8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJ1ZGEtcmVjb3JkZWQtbmFtZVwiIG5hbWU9XCJ1ZGEtc2F2ZS1yZWNvcmRlZFtdXCIgY2xhc3M9XCJ1ZGEtZm9ybS1pbnB1dFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgTGFiZWxcIj48L3RkPidcclxuXHRcdFx0XHRcdFx0KydcdFx0PHRkPjxidXR0b24gY2xhc3M9XCJ1ZGEtdHV0b3JpYWwtYnRuXCIgb25jbGljaz1cIlVEQVBsdWdpblNESy5hZGRTZXF1ZW5jZU5hbWVSb3coKTtcIj5BZGQ8L2J1dHRvbj48L3RkPidcclxuXHRcdFx0XHRcdFx0KydcdDwvdHI+PC90YWJsZT4nXHJcblx0XHRcdFx0XHRcdCsnXHRcdDxidXR0b24gY2xhc3M9XCJ1ZGEtcmVjb3JkLWJ0blwiIG9uY2xpY2s9XCJVREFQbHVnaW5TREsuY2FuY2VscmVjb3JkaW5nc2VxdWVuY2UoKTtcIj48c3Bhbj5DYW5jZWwgYW5kIEV4aXQ8L3NwYW4+PC9idXR0b24+J1xyXG5cdFx0XHRcdFx0XHQrJ1x0XHQ8YnV0dG9uIGNsYXNzPVwidWRhLXR1dG9yaWFsLWJ0blwiIG9uY2xpY2s9XCJVREFQbHVnaW5TREsuc3VibWl0cmVjb3JkZWRsYWJlbCgpO1wiPlN1Ym1pdDwvYnV0dG9uPidcclxuXHRcdFx0XHRcdFx0KydcdDwvZGl2PidcclxuXHRcdFx0XHRcdFx0Kyc8L2Rpdj4nOyovXHJcblx0XHRcdHJldHVybiBodG1sO1xyXG5cdFx0fSxcclxuXHRcdC8vQWRkIG5ldyBzZXF1ZW5jZSBuYW1lIHJvd1xyXG5cdFx0YWRkU2VxdWVuY2VOYW1lUm93OiBmdW5jdGlvbigpe1xyXG5cdFx0XHQvKmxldCBodG1sPSc8dHI+J1xyXG5cdFx0XHRcdFx0KydcdDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwidWRhLXNhdmUtcmVjb3JkZWRbXVwiIGNsYXNzPVwidWRhLWZvcm0taW5wdXRcIiBwbGFjZWhvbGRlcj1cIkVudGVyIExhYmVsXCI+PC90ZD4nXHJcblx0XHRcdFx0XHQrJ1x0PHRkPjxidXR0b24gY2xhc3M9XCJ1ZGEtdHV0b3JpYWwtYnRuIHVkYS1yZW1vdmUtcm93XCI+UmVtb3ZlPC9idXR0b24+PC90ZD4nXHJcblx0XHRcdFx0XHQrJzwvdHI+JzsqL1xyXG5cdFx0XHRsZXQgaHRtbFx0PSc8ZGl2PidcclxuXHRcdFx0XHRcdFx0KydcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJ1ZGEtcmVjb3JkZWQtbmFtZVwiIG5hbWU9XCJ1ZGEtc2F2ZS1yZWNvcmRlZFtdXCIgY2xhc3M9XCJ1ZGEtZm9ybS1pbnB1dCB1ZGEtZm9ybS1pbnB1dC1yZWR1Y2VkXCIgcGxhY2Vob2xkZXI9XCJFbnRlciBMYWJlbFwiPidcclxuXHRcdFx0XHRcdFx0KydcdFx0PHNwYW4+J1xyXG5cdFx0XHRcdFx0XHQrJ1x0XHRcdDxidXR0b24gY2xhc3M9XCJkZWxldGUtYnRuIHVkYS1yZW1vdmUtcm93XCI+PGltZyBzcmM9XCInKyB0aGlzLmV4dGVuc2lvbnBhdGgrJ2ltYWdlcy9pY29ucy9kZWxldGUucG5nXCI+PC9idXR0b24+J1xyXG5cdFx0XHRcdFx0XHQrJ1x0XHQ8L3NwYW4+J1xyXG5cdFx0XHRcdFx0XHQrJzwvZGl2Pic7XHJcblxyXG5cdFx0XHRqUXVlcnkoJyN1ZGEtc2VxdWVuY2UtbmFtZXMnKS5hcHBlbmQoaHRtbCk7XHJcblx0XHRcdGpRdWVyeShcIiN1ZGEtc2VxdWVuY2UtbmFtZXNcIikub24oJ2NsaWNrJywnLnVkYS1yZW1vdmUtcm93JyxmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGpRdWVyeSh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmUoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0cmVuZGVyRW1wdHlSZWNvcmRlZFNlcXVlbmNlSHRtbDogZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGh0bWwgPVx0JzxkaXYgY2xhc3M9XCJ1ZGEtY2FyZC1kZXRhaWxzXCI+J1xyXG5cdFx0XHRcdFx0XHQvLyArJzxzcGFuIGNsYXNzPVwidWRhLWNsb3NlLWljb25cIj7Dlzwvc3Bhbj4nXHJcblx0XHRcdFx0XHRcdCsnXHQ8aDU+UmVjb3JkZWQgU2VxdWVuY2U8L2g1PidcclxuXHRcdFx0XHRcdFx0KydcdDxocj4nXHJcblx0XHRcdFx0XHRcdCsnXHQ8aDU+UGxlYXNlIG5hdmlnYXRlIGluIHRoZSBwYWdlIHRvIHJlY29yZC48L2g1PidcclxuXHRcdFx0XHRcdFx0KydcdDxiciAvPidcclxuXHRcdFx0XHRcdFx0KydcdDxkaXYgY2xhc3M9XCJ1ZGEtcmVjb3JkaW5nXCIgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+J1xyXG5cdFx0XHRcdFx0XHQvLyArJ1x0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInVkYS1yZWNvcmRlZC1uYW1lXCIgbmFtZT1cInVkYS1zYXZlLXJlY29yZGVkXCIgY2xhc3M9XCJ1ZGEtZm9ybS1pbnB1dFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgTGFiZWxcIj4nXHJcblx0XHRcdFx0XHRcdCsnXHRcdDxidXR0b24gY2xhc3M9XCJ1ZGEtcmVjb3JkLWJ0blwiIG9uY2xpY2s9XCJVREFQbHVnaW5TREsuY2FuY2VscmVjb3JkaW5nc2VxdWVuY2UoKTtcIj48c3Bhbj5DYW5jZWwgYW5kIEV4aXQ8L3NwYW4+PC9idXR0b24+J1xyXG5cdFx0XHRcdFx0XHQvLyArJ1x0XHQ8YnV0dG9uIGNsYXNzPVwidWRhLXR1dG9yaWFsLWJ0blwiIG9uY2xpY2s9XCJVREFQbHVnaW5TREsuc3VibWl0cmVjb3JkZWRsYWJlbCgpO1wiPlN1Ym1pdDwvYnV0dG9uPidcclxuXHRcdFx0XHRcdFx0KydcdDwvZGl2PidcclxuXHRcdFx0XHRcdFx0Kyc8L2Rpdj4nO1xyXG5cdFx0XHRyZXR1cm4gaHRtbDtcclxuXHRcdH0sXHJcblx0XHQvL3JlbmRlciByZWNvcmQgcm93IGh0bWwgb2YgdGhlIHNlcXVlbmNlXHJcblx0XHRyZW5kZXJyZWNvcmRyZXN1bHRyb3c6ZnVuY3Rpb24oZGF0YSxpbmRleCwgc2hvd1BlcnNvbmFsQnV0dG9uPWZhbHNlKXtcclxuXHRcdFx0aW5kZXgrKztcclxuXHRcdFx0Ly8gbGV0IGNsaWNrZWRuYW1lPSgoZGF0YS5jbGlja2Vkbm9kZW5hbWUubGVuZ3RoPnRoaXMubWF4c3RyaW5nbGVuZ3RoKT9kYXRhLmNsaWNrZWRub2RlbmFtZS5zdWJzdHIoMCx0aGlzLm1heHN0cmluZ2xlbmd0aCkrJy4uLic6ZGF0YS5jbGlja2Vkbm9kZW5hbWUpO1xyXG5cdFx0XHRsZXQgbm9kZURhdGEgPSBKU09OLnBhcnNlKGRhdGEub2JqZWN0ZGF0YSk7XHJcblx0XHRcdHZhciBvcmlnaW5hbE5hbWUgPSAnJztcclxuXHRcdFx0aWYobm9kZURhdGEubWV0YS5oYXNPd25Qcm9wZXJ0eSgnZGlzcGxheVRleHQnKSAmJiBub2RlRGF0YS5tZXRhLmRpc3BsYXlUZXh0ICE9PSAnJyl7XHJcblx0XHRcdFx0dmFyIGNsaWNrZWRuYW1lID0gKChub2RlRGF0YS5tZXRhLmRpc3BsYXlUZXh0Lmxlbmd0aCA+IHRoaXMubWF4c3RyaW5nbGVuZ3RoKSA/IG5vZGVEYXRhLm1ldGEuZGlzcGxheVRleHQuc3Vic3RyKDAsIHRoaXMubWF4c3RyaW5nbGVuZ3RoKSArICcuLi4nIDogbm9kZURhdGEubWV0YS5kaXNwbGF5VGV4dCk7XHJcblx0XHRcdFx0b3JpZ2luYWxOYW1lID0gbm9kZURhdGEubWV0YS5kaXNwbGF5VGV4dDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgY2xpY2tlZG5hbWUgPSAoKGRhdGEuY2xpY2tlZG5vZGVuYW1lLmxlbmd0aCA+IHRoaXMubWF4c3RyaW5nbGVuZ3RoKSA/IGRhdGEuY2xpY2tlZG5vZGVuYW1lLnN1YnN0cigwLCB0aGlzLm1heHN0cmluZ2xlbmd0aCkgKyAnLi4uJyA6IGRhdGEuY2xpY2tlZG5vZGVuYW1lKTtcclxuXHRcdFx0XHRvcmlnaW5hbE5hbWUgPSBkYXRhLmNsaWNrZWRub2RlbmFtZTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBsZXQgY2xpY2tlZG5hbWU9ZGF0YS5jbGlja2Vkbm9kZW5hbWU7XHJcblx0XHRcdC8vYWRkaW5nIHBlcnNvbmFsIHRvb2x0aXBzXHJcblx0XHRcdGxldCB0b29sdGlwQnRuID0gJyc7XHJcblx0XHRcdGlmKHNob3dQZXJzb25hbEJ1dHRvbikge1xyXG5cdFx0XHRcdHRvb2x0aXBCdG4gPSB0aGlzLnNob3dUb29sdGlwRWRpdFNlY3Rpb24obm9kZURhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIHBlcnNvbmFsIGJ1dHRvbiBhcHBlYXJhbmNlXHJcblx0XHRcdGlmKHNob3dQZXJzb25hbEJ1dHRvbil7XHJcblx0XHRcdFx0Ly8gY2xpY2tlZG5hbWU9KChkYXRhLmNsaWNrZWRub2RlbmFtZS5sZW5ndGg+KHRoaXMubWF4c3RyaW5nbGVuZ3RoLTI0KSk/ZGF0YS5jbGlja2Vkbm9kZW5hbWUuc3Vic3RyKDAsKHRoaXMubWF4c3RyaW5nbGVuZ3RoLTI0KSkrJy4uLic6ZGF0YS5jbGlja2Vkbm9kZW5hbWUpO1xyXG5cdFx0XHRcdHZhciBlZGl0QnRuID0gXHQnXHRcdFx0PHNwYW4+J1xyXG5cdFx0XHRcdFx0XHRcdFx0KydcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJ1ZGEtdHV0b3JpYWwtYnRuXCIgc3R5bGU9XCJwYWRkaW5nOjBweDtcIiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJ1ZGEtZWRpdC1jbGlja2VkbmFtZVwiPjxpbWcgc3JjPVwiJyt0aGlzLmV4dGVuc2lvbnBhdGgrJ2ltYWdlcy9pY29ucy9lZGl0LnBuZ1wiPjwvYnV0dG9uPidcclxuXHRcdFx0XHRcdFx0XHRcdCsnXHRcdFx0PC9zcGFuPidcclxuXHRcdFx0XHRcdFx0XHRcdCsnXHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJ1ZGEtZWRpdGVkLW5hbWVcIiBuYW1lPVwidWRhLWVkaXRlZC1uYW1lXCIgY2xhc3M9XCJ1ZGEtZm9ybS1pbnB1dFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgTmFtZVwiIHZhbHVlPVwiJytvcmlnaW5hbE5hbWUrJ1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj4nO1xyXG5cdFx0XHRcdGlmKG5vZGVEYXRhLm1ldGEuaGFzT3duUHJvcGVydHkoJ2lzUGVyc29uYWwnKSAmJiBub2RlRGF0YS5tZXRhLmlzUGVyc29uYWwpe1xyXG5cdFx0XHRcdFx0Ly8gdmFyIHBlcnNvbmFsSHRtbCA9ICcmbmJzcDsgJm5ic3A7IChwZXJzb25hbCknO1xyXG5cdFx0XHRcdFx0dmFyIHBlcnNvbmFsSHRtbCA9ICcmbmJzcDsgJm5ic3A7PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwiaXNQZXJzb25hbFwiIGNoZWNrZWQgLz4gPGxhYmVsIHN0eWxlPVwiZm9udC1zaXplOjE0cHg7XCI+UGVyc29uYWwgSW5mb3JtYXRpb248L2xhYmVsPic7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHZhciBwZXJzb25hbEh0bWwgPSAnJm5ic3A7ICZuYnNwOzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cImlzUGVyc29uYWxcIiAvPiA8bGFiZWwgc3R5bGU9XCJmb250LXNpemU6MTRweDtcIj5QZXJzb25hbCBJbmZvcm1hdGlvbjwvbGFiZWw+JztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cGVyc29uYWxIdG1sICs9ICdcdFx0XHQ8c3BhbiBzdHlsZT1cInBvc2l0aW9uOiByZWxhdGl2ZTsgdG9wOiAwcHg7XCI+PGltZyBzcmM9XCInK3RoaXMuZXh0ZW5zaW9ucGF0aCsnaW1hZ2VzL2ljb25zL2luZm8ucG5nXCIgdGl0bGU9XCJzZWxlY3QgdGhpcyBib3ggaWYgdGhpcyBmaWVsZCAvIHRleHQgY29udGFpbnMgcGVyc29uYWwgaW5mb3JtYXRpb24gbGlrZSBuYW1lIC8gdXNlcm5hbWUuIFdlIG5lZWQgdG8gaWdub3JlIHBlcnNvbmFsIGluZm9ybWF0aW9uIHdoaWxlIHByb2Nlc3NpbmcuXCI+PC9zcGFuPic7XHJcblxyXG5cdFx0XHRcdC8vIGFkZGluZyBjbGlja2VkIGVsZW1lbnQgdHlwZVxyXG5cdFx0XHRcdGxldCBzZWxlY3RlZEVsZW1lbnRIdG1sID0gKHRoaXMuZW5hYmxlTm9kZVR5cGVDaGFuZ2VTZWxlY3Rpb24pPydDbGlja2VkIG9uIDogPHNlbGVjdCBuYW1lPVwiVURBU2VsZWN0ZWRFbGVtZW50XCIgaWQ9XCJVREFTZWxlY3RlZEVsZW1lbnRcIj48L3NlbGVjdD4nOicnO1xyXG5cclxuXHRcdFx0XHR2YXIgaHRtbCA9XHQnPGxpIGNsYXNzPVwidWRhLXJlY29yZGVkLWxhYmVsLWVkaXRhYmxlXCI+PGk+J1xyXG5cdFx0XHRcdFx0XHRcdFx0K2NsaWNrZWRuYW1lXHJcblx0XHRcdFx0XHRcdFx0XHQvLyArZWRpdEJ0blxyXG5cdFx0XHRcdFx0XHRcdFx0Kyc8YnIgLz4nXHJcblx0XHRcdFx0XHRcdFx0XHQrJzwvaT4nXHJcblx0XHRcdFx0XHRcdFx0XHQrcGVyc29uYWxIdG1sXHJcblx0XHRcdFx0XHRcdFx0XHQrJzxiciAvPidcclxuXHRcdFx0XHRcdFx0XHRcdCt0b29sdGlwQnRuXHJcblx0XHRcdFx0XHRcdFx0XHQrJzxiciAvPidcclxuXHRcdFx0XHRcdFx0XHRcdCtzZWxlY3RlZEVsZW1lbnRIdG1sXHJcblx0XHRcdFx0XHRcdFx0Kyc8L2xpPic7XHJcblx0XHRcdFx0dmFyIGVsZW1lbnQgPSBqUXVlcnkoaHRtbCk7XHJcblx0XHRcdFx0alF1ZXJ5KFwiI3VkYS1yZWNvcmRlZC1yZXN1bHRzXCIpLmFwcGVuZChlbGVtZW50KTtcclxuXHRcdFx0XHRqUXVlcnkoXCIjaXNQZXJzb25hbFwiKS5jbGljayhmdW5jdGlvbiAoKXtcclxuXHRcdFx0XHRcdFVEQVBsdWdpblNESy5wZXJzb25hbE5vZGUoZGF0YSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0dmFyIGJlZm9yZUVkaXRUZXh0ID0gb3JpZ2luYWxOYW1lO1xyXG5cdFx0XHRcdGpRdWVyeShcIiN1ZGEtZWRpdC1jbGlja2VkbmFtZVwiKS5jbGljayhmdW5jdGlvbiAoKXtcclxuXHRcdFx0XHRcdGpRdWVyeShcIiN1ZGEtZWRpdGVkLW5hbWVcIikuc2hvdygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGpRdWVyeSgnI3VkYS1lZGl0ZWQtbmFtZScpLmJsdXIoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRsZXQgZWRpdGVkTmFtZSA9IGpRdWVyeShcIiN1ZGEtZWRpdGVkLW5hbWVcIikudmFsKCk7XHJcblx0XHRcdFx0XHRpZihlZGl0ZWROYW1lLnRyaW0oKSAhPT0gJycgJiYgYmVmb3JlRWRpdFRleHQudHJpbSgpICE9IGVkaXRlZE5hbWUudHJpbSgpKXtcclxuXHRcdFx0XHRcdFx0VURBUGx1Z2luU0RLLmVkaXRBbmRTYXZlKGRhdGEsIGVkaXRlZE5hbWUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGpRdWVyeShcIiN1ZGEtZWRpdGVkLW5hbWVcIikua2V5ZG93bihmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcclxuXHRcdFx0XHRcdFx0bGV0IGVkaXRlZE5hbWUgPSBqUXVlcnkoXCIjdWRhLWVkaXRlZC1uYW1lXCIpLnZhbCgpO1xyXG5cdFx0XHRcdFx0XHRpZihlZGl0ZWROYW1lLnRyaW0oKSAhPT0gJycgJiYgYmVmb3JlRWRpdFRleHQudHJpbSgpICE9IGVkaXRlZE5hbWUudHJpbSgpKXtcclxuXHRcdFx0XHRcdFx0XHRVREFQbHVnaW5TREsuZWRpdEFuZFNhdmUoZGF0YSwgZWRpdGVkTmFtZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRpZih0b29sdGlwQnRuKSB7XHJcblx0XHRcdFx0XHRqUXVlcnkoXCIjdWRhLWVkaXQtdG9vbHRpcFwiKS5jbGljayhmdW5jdGlvbiAoKXtcclxuXHRcdFx0XHRcdFx0Ly8gVURBUGx1Z2luU0RLLnNob3dUb29sdGlwSW5wdXQoZGF0YSk7XHJcblx0XHRcdFx0XHRcdGpRdWVyeShcIiN1ZGEtZWRpdGVkLXRvb2x0aXBcIikuc2hvdygpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHQvKmpRdWVyeSgnI3VkYS1lZGl0ZWQtdG9vbHRpcCcpLmJsdXIoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdGxldCBlZGl0ZWROYW1lID0galF1ZXJ5KFwiI3VkYS1lZGl0ZWQtdG9vbHRpcFwiKS52YWwoKTtcclxuXHRcdFx0XHRcdFx0aWYoZWRpdGVkTmFtZS50cmltKCkgIT09ICcnICYmIGJlZm9yZUVkaXRUZXh0LnRyaW0oKSAhPSBlZGl0ZWROYW1lLnRyaW0oKSl7XHJcblx0XHRcdFx0XHRcdFx0VURBUGx1Z2luU0RLLmVkaXRBbmRTYXZlVG9vbHRpcChkYXRhLCBlZGl0ZWROYW1lKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7Ki9cclxuXHRcdFx0XHRcdGpRdWVyeShcIiN1ZGEtZWRpdGVkLXRvb2x0aXBcIikua2V5ZG93bihmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZS5rZXlDb2RlID09PSAxMykge1xyXG5cdFx0XHRcdFx0XHRcdGxldCBlZGl0ZWROYW1lID0galF1ZXJ5KFwiI3VkYS1lZGl0ZWQtdG9vbHRpcFwiKS52YWwoKTtcclxuXHRcdFx0XHRcdFx0XHRpZihlZGl0ZWROYW1lLnRyaW0oKSAhPT0gJycgJiYgYmVmb3JlRWRpdFRleHQudHJpbSgpICE9IGVkaXRlZE5hbWUudHJpbSgpKXtcclxuXHRcdFx0XHRcdFx0XHRcdFVEQVBsdWdpblNESy5lZGl0QW5kU2F2ZVRvb2x0aXAoZGF0YSwgZWRpdGVkTmFtZSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGpRdWVyeShcIiN1ZGEtdG9vbHRpcC1zYXZlXCIpLmNsaWNrKGZ1bmN0aW9uICgpe1xyXG5cdFx0XHRcdFx0XHRsZXQgZWRpdGVkTmFtZSA9IGpRdWVyeShcIiN1ZGEtZWRpdGVkLXRvb2x0aXBcIikudmFsKCk7XHJcblx0XHRcdFx0XHRcdGlmKGVkaXRlZE5hbWUudHJpbSgpICE9PSAnJyAmJiBiZWZvcmVFZGl0VGV4dC50cmltKCkgIT0gZWRpdGVkTmFtZS50cmltKCkpe1xyXG5cdFx0XHRcdFx0XHRcdFVEQVBsdWdpblNESy5lZGl0QW5kU2F2ZVRvb2x0aXAoZGF0YSwgZWRpdGVkTmFtZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly9cdEFkZCBkcm9wZG93biBzZWxlY3Rpb24gb2YgdXNlciBjbGlja2VkIG5vZGUgZm9yIGltcHJvdmVtZW50cyAjMjA5XHJcblx0XHRcdFx0aWYodGhpcy5lbmFibGVOb2RlVHlwZUNoYW5nZVNlbGVjdGlvbikge1xyXG5cdFx0XHRcdFx0bGV0IHNlbGVjdGVkRWxlbWVudCA9IHtpbnB1dEVsZW1lbnQ6ICcnLCBpbnB1dFR5cGU6ICcnLCBkaXNwbGF5TmFtZTogJ1BsZWFzZSBTZWxlY3QnfTtcclxuXHRcdFx0XHRcdGlmIChub2RlRGF0YS5tZXRhLmhhc093blByb3BlcnR5KCdzZWxlY3RlZEVsZW1lbnQnKSAmJiBub2RlRGF0YS5tZXRhLnNlbGVjdGVkRWxlbWVudCkge1xyXG5cdFx0XHRcdFx0XHRzZWxlY3RlZEVsZW1lbnQgPSBub2RlRGF0YS5tZXRhLnNlbGVjdGVkRWxlbWVudDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHZhciAkVURBU2VsZWN0ZWRFbGVtZW50SHRtbCA9IGpRdWVyeSgnI1VEQVNlbGVjdGVkRWxlbWVudCcpO1xyXG5cdFx0XHRcdFx0aWYgKHNlbGVjdGVkRWxlbWVudC5pbnB1dEVsZW1lbnQgPT09ICcnKSB7XHJcblx0XHRcdFx0XHRcdHZhciAkb3B0aW9uID0galF1ZXJ5KFwiPG9wdGlvbi8+XCIsIHtcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogSlNPTi5zdHJpbmdpZnkoc2VsZWN0ZWRFbGVtZW50KSxcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBzZWxlY3RlZEVsZW1lbnQuZGlzcGxheU5hbWUsXHJcblx0XHRcdFx0XHRcdFx0c2VsZWN0ZWQ6IHRydWVcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdCRVREFTZWxlY3RlZEVsZW1lbnRIdG1sLmFwcGVuZCgkb3B0aW9uKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGZvciAobGV0IGh0bWxGb3JtRWxlbWVudCBvZiB0aGlzLmZldGNoSHRtbEZvcm1FbGVtZW50cygpKSB7XHJcblx0XHRcdFx0XHRcdHZhciAkb3B0aW9uID0galF1ZXJ5KFwiPG9wdGlvbi8+XCIsIHtcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogSlNPTi5zdHJpbmdpZnkoaHRtbEZvcm1FbGVtZW50KSxcclxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBodG1sRm9ybUVsZW1lbnQuZGlzcGxheU5hbWUsXHJcblx0XHRcdFx0XHRcdFx0c2VsZWN0ZWQ6IChodG1sRm9ybUVsZW1lbnQuc3lzdGVtVGFnID09PSBzZWxlY3RlZEVsZW1lbnQuc3lzdGVtVGFnKVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0JFVEQVNlbGVjdGVkRWxlbWVudEh0bWwuYXBwZW5kKCRvcHRpb24pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0JFVEQVNlbGVjdGVkRWxlbWVudEh0bWwub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdFx0XHRcdHZhciBvcHRpb25TZWxlY3RlZCA9IGpRdWVyeShcIm9wdGlvbjpzZWxlY3RlZFwiLCB0aGlzKTtcclxuXHRcdFx0XHRcdFx0dmFyIHZhbHVlU2VsZWN0ZWQgPSBKU09OLnBhcnNlKHRoaXMudmFsdWUpO1xyXG5cdFx0XHRcdFx0XHRVREFQbHVnaW5TREsuZWRpdEFuZFNhdmVTZWxlY3RlZEh0bWxFbGVtZW50KGRhdGEsIHZhbHVlU2VsZWN0ZWQpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNsaWNrZWRuYW1lICs9IChub2RlRGF0YS5tZXRhLmhhc093blByb3BlcnR5KCdpc1BlcnNvbmFsJykgJiYgbm9kZURhdGEubWV0YS5pc1BlcnNvbmFsKT8nJm5ic3A7ICZuYnNwOyhwZXJzb25hbCknOicnO1xyXG5cdFx0XHRcdHZhciBodG1sID0gJzxsaT48aT4nICtcclxuXHRcdFx0XHRcdGNsaWNrZWRuYW1lICtcclxuXHRcdFx0XHRcdCc8L2k+PC9saT4nO1xyXG5cdFx0XHRcdHZhciBlbGVtZW50ID0galF1ZXJ5KGh0bWwpO1xyXG5cdFx0XHRcdGpRdWVyeShcIiN1ZGEtcmVjb3JkZWQtcmVzdWx0c1wiKS5hcHBlbmQoZWxlbWVudCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHQvLyBhdmFpbGFibGUgaHRtbCBmb3JtIGVsZW1lbnRzXHJcblx0XHRmZXRjaEh0bWxGb3JtRWxlbWVudHM6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHJldHVybiBbXHJcblx0XHRcdFx0e2lucHV0RWxlbWVudDogJ2lucHV0JywgaW5wdXRUeXBlOiBbJ3RleHQnLCdzZWFyY2gnLCd1cmwnXSwgZGlzcGxheU5hbWU6ICdTaW1wbGUgVGV4dCcsIHN5c3RlbVRhZzogJ3RleHQnfSxcclxuXHRcdFx0XHR7aW5wdXRFbGVtZW50OiAnaW5wdXQnLCBpbnB1dFR5cGU6ICdjaGVja2JveCcsIGRpc3BsYXlOYW1lOiAnTXVsdGlwbGUgU2VsZWN0Jywgc3lzdGVtVGFnOiAnbXVsdGlwbGVDaG9pY2UnfSxcclxuXHRcdFx0XHR7aW5wdXRFbGVtZW50OiAnaW5wdXQnLCBpbnB1dFR5cGU6ICdyYWRpbycsIGRpc3BsYXlOYW1lOiAnU2luZ2xlIFNlbGVjdCcsIHN5c3RlbVRhZzogJ3NpbmdsZUNob2ljZSd9LFxyXG5cdFx0XHRcdHtpbnB1dEVsZW1lbnQ6ICdpbnB1dCcsIGlucHV0VHlwZTogJ251bWJlcicsIGRpc3BsYXlOYW1lOiAnTnVtYmVyIEZpZWxkJywgc3lzdGVtVGFnOiAnbnVtYmVyJ30sXHJcblx0XHRcdFx0e2lucHV0RWxlbWVudDogJ2lucHV0JywgaW5wdXRUeXBlOiBbJ2RhdGUnLCd0aW1lJ10sIGRpc3BsYXlOYW1lOiAnRGF0ZSBhbmQvb3IgVGltZSBGaWVsZCcsIHN5c3RlbVRhZzogJ2RhdGUnfSxcclxuXHRcdFx0XHR7aW5wdXRFbGVtZW50OiAnaW5wdXQnLCBpbnB1dFR5cGU6ICdlbWFpbCcsIGRpc3BsYXlOYW1lOiAnRW1haWwgRmllbGQnLCBzeXN0ZW1UYWc6ICdlbWFpbCd9LFxyXG5cdFx0XHRcdHtpbnB1dEVsZW1lbnQ6ICdpbnB1dCcsIGlucHV0VHlwZTogJ3Bhc3N3b3JkJywgZGlzcGxheU5hbWU6ICdQYXNzd29yZCBGaWVsZCcsIHN5c3RlbVRhZzogJ3Bhc3N3b3JkJ30sXHJcblx0XHRcdFx0e2lucHV0RWxlbWVudDogJ2lucHV0JywgaW5wdXRUeXBlOiAncmFuZ2UnLCBkaXNwbGF5TmFtZTogJ1JhbmdlIEZpZWxkJywgc3lzdGVtVGFnOiAncmFuZ2UnfSxcclxuXHRcdFx0XHR7aW5wdXRFbGVtZW50OiAnaW5wdXQnLCBpbnB1dFR5cGU6ICd0ZWwnLCBkaXNwbGF5TmFtZTogJ1RlbGVwaG9uZSBGaWVsZCcsIHN5c3RlbVRhZzogJ3RlbGVwaG9uZSd9LFxyXG5cdFx0XHRcdHtpbnB1dEVsZW1lbnQ6ICdpbnB1dCcsIGlucHV0VHlwZTogJ2ZpbGUnLCBkaXNwbGF5TmFtZTogJ0ZpbGUgU2VsZWN0aW9uJywgc3lzdGVtVGFnOiAnZmlsZSd9LFxyXG5cdFx0XHRcdC8vIHtpbnB1dEVsZW1lbnQ6ICdpbnB1dCcsIGlucHV0VHlwZTogJ2NvbG9yJywgZGlzcGxheU5hbWU6ICdDb2xvciBTZWxlY3Rpb24nfSxcclxuXHRcdFx0XHQvLyB7aW5wdXRFbGVtZW50OiAnaW5wdXQnLCBpbnB1dFR5cGU6ICdkYXRldGltZS1sb2NhbCcsIGRpc3BsYXlOYW1lOiAnTG9jYWwgRGF0ZSBTZWxlY3Rpb24nfSxcclxuXHRcdFx0XHQvLyB7aW5wdXRFbGVtZW50OiAnaW5wdXQnLCBpbnB1dFR5cGU6ICdoaWRkZW4nLCBkaXNwbGF5TmFtZTogJ0hpZGRlbiBGaWVsZCd9LFxyXG5cdFx0XHRcdC8vIHtpbnB1dEVsZW1lbnQ6ICdpbnB1dCcsIGlucHV0VHlwZTogJ2ltYWdlJywgZGlzcGxheU5hbWU6ICdJbWFnZSBGaWVsZCd9LFxyXG5cdFx0XHRcdC8vIHtpbnB1dEVsZW1lbnQ6ICdpbnB1dCcsIGlucHV0VHlwZTogJ21vbnRoJywgZGlzcGxheU5hbWU6ICdNb250aCBGaWVsZCd9LFxyXG5cdFx0XHRcdC8vIHtpbnB1dEVsZW1lbnQ6ICdpbnB1dCcsIGlucHV0VHlwZTogJ3Jlc2V0JywgZGlzcGxheU5hbWU6ICdSZXNldCBGaWVsZCd9LFxyXG5cdFx0XHRcdC8vIHtpbnB1dEVsZW1lbnQ6ICdpbnB1dCcsIGlucHV0VHlwZTogJ3NlYXJjaCcsIGRpc3BsYXlOYW1lOiAnU2VhcmNoIEZpZWxkJ30sXHJcblx0XHRcdFx0Ly8ge2lucHV0RWxlbWVudDogJ2lucHV0JywgaW5wdXRUeXBlOiAndGltZScsIGRpc3BsYXlOYW1lOiAnVGltZSBGaWVsZCd9LFxyXG5cdFx0XHRcdC8vIHtpbnB1dEVsZW1lbnQ6ICdpbnB1dCcsIGlucHV0VHlwZTogJ3VybCcsIGRpc3BsYXlOYW1lOiAnVVJMIEZpZWxkJ30sXHJcblx0XHRcdFx0Ly8ge2lucHV0RWxlbWVudDogJ2lucHV0JywgaW5wdXRUeXBlOiAnd2VlaycsIGRpc3BsYXlOYW1lOiAnV2VlayBGaWVsZCd9LFxyXG5cdFx0XHRcdHtpbnB1dEVsZW1lbnQ6IFsnc2VsZWN0Jywnb3B0aW9uJywgJ29wdGdyb3VwJ10sIGlucHV0VHlwZTogJ3NlbGVjdCcsIGRpc3BsYXlOYW1lOiAnRHJvcGRvd24gRmllbGQnLCBzeXN0ZW1UYWc6ICdkcm9wRG93bid9LFxyXG5cdFx0XHRcdC8vIHtpbnB1dEVsZW1lbnQ6ICdvcHRpb24nLCBpbnB1dFR5cGU6ICdvcHRpb24nLCBkaXNwbGF5TmFtZTogJ0Ryb3Bkb3duIE9wdGlvbid9LFxyXG5cdFx0XHRcdC8vIHtpbnB1dEVsZW1lbnQ6ICdvcHRncm91cCcsIGlucHV0VHlwZTogJ29wdGdyb3VwJywgZGlzcGxheU5hbWU6ICdEcm9wZG93biBPcHRpb24gR3JvdXAnfSxcclxuXHRcdFx0XHR7aW5wdXRFbGVtZW50OiAndGV4dGFyZWEnLCBpbnB1dFR5cGU6ICd0ZXh0YXJlYScsIGRpc3BsYXlOYW1lOiAnTGFyZ2UgVGV4dCBBcmVhJywgc3lzdGVtVGFnOiAndGV4dEFyZWEnfSxcclxuXHRcdFx0XHR7aW5wdXRFbGVtZW50OiBbJ2lucHV0JywnYnV0dG9uJ10sIGlucHV0VHlwZTogWydidXR0b24nLCAnc3VibWl0J10sIGRpc3BsYXlOYW1lOiAnQnV0dG9uJywgc3lzdGVtVGFnOiAnYnV0dG9uJ30sXHJcblx0XHRcdFx0Ly8ge2lucHV0RWxlbWVudDogJ2J1dHRvbicsIGlucHV0VHlwZTogJ3N1Ym1pdCcsIGRpc3BsYXlOYW1lOiAnU3VibWl0IEZpZWxkJ30sXHJcblx0XHRcdFx0Ly8ge2lucHV0RWxlbWVudDogJ2lucHV0JywgaW5wdXRUeXBlOiAnYnV0dG9uJywgZGlzcGxheU5hbWU6ICdCdXR0b24gRmllbGQnfSxcclxuXHRcdFx0XHQvLyB7aW5wdXRFbGVtZW50OiAnaW5wdXQnLCBpbnB1dFR5cGU6ICdzdWJtaXQnLCBkaXNwbGF5TmFtZTogJ1N1Ym1pdCBGaWVsZCd9LFxyXG5cdFx0XHRcdC8vIHtpbnB1dEVsZW1lbnQ6ICdvdXRwdXQnLCBpbnB1dFR5cGU6ICdvdXRwdXQnLCBkaXNwbGF5TmFtZTogJ091dHB1dCBGaWVsZCd9LFxyXG5cdFx0XHRcdC8vIHtpbnB1dEVsZW1lbnQ6ICdkYXRhbGlzdCAnLCBpbnB1dFR5cGU6ICdkYXRhbGlzdCcsIGRpc3BsYXlOYW1lOiAnRGF0YWxpc3QgRmllbGQnfSxcclxuXHRcdFx0XHR7aW5wdXRFbGVtZW50OiAnYSAnLCBpbnB1dFR5cGU6ICdocmVmJywgZGlzcGxheU5hbWU6ICdMaW5rJywgc3lzdGVtVGFnOiAnbGluayd9LFxyXG5cdFx0XHRcdHtpbnB1dEVsZW1lbnQ6ICdvdGhlcnMnLCBpbnB1dFR5cGU6ICdvdGhlcnMnLCBkaXNwbGF5TmFtZTogJ1VucmVjb2duaXplZCcsIHN5c3RlbVRhZzogJ290aGVycyd9LFxyXG5cdFx0XHRdO1xyXG5cdFx0fSxcclxuXHRcdC8vIG1hcCBjdXJyZW50IGVsZW1lbnQgdG8gaHRtbCBlbGVtZW50XHJcblx0XHRtYXBDbGlja2VkRWxlbWVudFRvSHRtbEZvcm1FbGVtZW50OiBmdW5jdGlvbihub2RlKXtcclxuXHRcdFx0bGV0IGh0bWxGb3JtRWxlbWVudHMgPSB0aGlzLmZldGNoSHRtbEZvcm1FbGVtZW50cygpO1xyXG5cdFx0XHRsZXQgc2VsZWN0ZWRGb3JtRWxlbWVudCA9IHtpbnB1dEVsZW1lbnQ6ICdvdGhlcnMnLCBpbnB1dFR5cGU6ICdvdGhlcnMnLCBkaXNwbGF5TmFtZTogJ090aGVyIEhUTUwgRWxlbWVudCd9O1xyXG5cdFx0XHRmb3IobGV0IGh0bWxGb3JtRWxlbWVudCBvZiBodG1sRm9ybUVsZW1lbnRzKSB7XHJcblx0XHRcdFx0aWYoQXJyYXkuaXNBcnJheShodG1sRm9ybUVsZW1lbnQuaW5wdXRFbGVtZW50KSAmJiBodG1sRm9ybUVsZW1lbnQuaW5wdXRFbGVtZW50LmluZGV4T2Yobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSAhPSAtMSl7XHJcblx0XHRcdFx0XHRpZihBcnJheS5pc0FycmF5KGh0bWxGb3JtRWxlbWVudC5pbnB1dFR5cGUpICYmIG5vZGUuaGFzQXR0cmlidXRlKCd0eXBlJykgJiYgaHRtbEZvcm1FbGVtZW50LmlucHV0VHlwZS5pbmRleE9mKG5vZGUuZ2V0QXR0cmlidXRlKCd0eXBlJykpICE9PSAtMSl7XHJcblx0XHRcdFx0XHRcdHNlbGVjdGVkRm9ybUVsZW1lbnQgPSBodG1sRm9ybUVsZW1lbnQ7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KGh0bWxGb3JtRWxlbWVudC5pbnB1dFR5cGUpICYmIGh0bWxGb3JtRWxlbWVudC5pbnB1dEVsZW1lbnQuaW5kZXhPZihub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpICE9IC0xKSB7XHJcblx0XHRcdFx0XHRcdHNlbGVjdGVkRm9ybUVsZW1lbnQgPSBodG1sRm9ybUVsZW1lbnQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmKGh0bWxGb3JtRWxlbWVudC5pbnB1dEVsZW1lbnQgPT09ICdpbnB1dCcpIHtcclxuXHRcdFx0XHRcdGlmKEFycmF5LmlzQXJyYXkoaHRtbEZvcm1FbGVtZW50LmlucHV0VHlwZSkgJiYgbm9kZS5oYXNBdHRyaWJ1dGUoJ3R5cGUnKSAmJiBodG1sRm9ybUVsZW1lbnQuaW5wdXRUeXBlLmluZGV4T2Yobm9kZS5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSkgIT09IC0xKXtcclxuXHRcdFx0XHRcdFx0c2VsZWN0ZWRGb3JtRWxlbWVudCA9IGh0bWxGb3JtRWxlbWVudDtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkoaHRtbEZvcm1FbGVtZW50LmlucHV0VHlwZSkgJiYgaHRtbEZvcm1FbGVtZW50LmlucHV0RWxlbWVudCA9PT0gbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICYmIG5vZGUuaGFzQXR0cmlidXRlKCd0eXBlJykgJiYgbm9kZS5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gaHRtbEZvcm1FbGVtZW50LmlucHV0VHlwZSkge1xyXG5cdFx0XHRcdFx0XHRzZWxlY3RlZEZvcm1FbGVtZW50ID0gaHRtbEZvcm1FbGVtZW50O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoaHRtbEZvcm1FbGVtZW50LmlucHV0RWxlbWVudCA9PT0gbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSB7XHJcblx0XHRcdFx0XHRzZWxlY3RlZEZvcm1FbGVtZW50ID0gaHRtbEZvcm1FbGVtZW50O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gc2VsZWN0ZWRGb3JtRWxlbWVudDtcclxuXHRcdH0sXHJcblx0XHQvLyBzYXZlIHNlbGVjdGVkIGh0bWwgZWxlbWVudFxyXG5cdFx0ZWRpdEFuZFNhdmVTZWxlY3RlZEh0bWxFbGVtZW50OiBmdW5jdGlvbihkYXRhLCB2YWx1ZSkge1xyXG5cdFx0XHRsZXQgbm9kZURhdGEgPSBKU09OLnBhcnNlKGRhdGEub2JqZWN0ZGF0YSk7XHJcblx0XHRcdGlmKHZhbHVlLmlucHV0RWxlbWVudD09PScnKXtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYobm9kZURhdGEubWV0YSAmJiBPYmplY3Qua2V5cyhub2RlRGF0YS5tZXRhKS5sZW5ndGggPj0gMSkge1xyXG5cdFx0XHRcdG5vZGVEYXRhLm1ldGEuc2VsZWN0ZWRFbGVtZW50ID0gdmFsdWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bm9kZURhdGEubWV0YSA9IHt9O1xyXG5cdFx0XHRcdG5vZGVEYXRhLm1ldGEuc2VsZWN0ZWRFbGVtZW50ID0gdmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YS5vYmplY3RkYXRhID0gSlNPTi5zdHJpbmdpZnkobm9kZURhdGEpO1xyXG5cdFx0XHR2YXIgb3V0cHV0ZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG5cdFx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdHhoci5vcGVuKFwiUE9TVFwiLCBVREFfQVBJX1VSTCtcIi91c2VyL3VwZGF0ZWNsaWNrZWRub2RlXCIpO1xyXG5cdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLTgnKTtcclxuXHRcdFx0eGhyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuXHRcdFx0XHRVREFQbHVnaW5TREsuc2hvd2h0bWwoKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0eGhyLnNlbmQob3V0cHV0ZGF0YSk7XHJcblx0XHR9LFxyXG5cdFx0Ly9jdXN0b21pemluZyB0b29sdGlwIHRleHQgZnVuY3Rpb25cclxuXHRcdHNob3dUb29sdGlwRWRpdFNlY3Rpb246IGZ1bmN0aW9uKG5vZGVEYXRhKXtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRsZXQgbm9kZT1ub2RlRGF0YS5ub2RlO1xyXG5cdFx0XHRcdGxldCB0b29sVGlwVGV4dCA9ICcnO1xyXG5cdFx0XHRcdGlmIChub2RlRGF0YS5tZXRhLmhhc093blByb3BlcnR5KCd0b29sdGlwSW5mbycpICYmIG5vZGVEYXRhLm1ldGEudG9vbHRpcEluZm8pIHtcclxuXHRcdFx0XHRcdHRvb2xUaXBUZXh0ID0gbm9kZURhdGEubWV0YS50b29sdGlwSW5mbztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0LypsZXQgdG9vbHRpcEJ0bkh0bWwgXHQ9J1x0XHRcdDxzcGFuPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnXHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwidWRhLXR1dG9yaWFsLWJ0blwiIHN0eWxlPVwicGFkZGluZzowcHg7XCIgdHlwZT1cImJ1dHRvblwiIGlkPVwidWRhLWVkaXQtdG9vbHRpcFwiPicrKCh0b29sVGlwVGV4dCk/J0VkaXQgVG9vbHRpcCc6J0FkZCBUb29sdGlwJykrJzwvYnV0dG9uPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnXHRcdFx0PC9zcGFuPic7XHJcbiAgICAgICAgICAgICAgICBsZXQgdG9vbHRpcHNlY3Rpb24gPSAodG9vbFRpcFRleHQpICsnJm5ic3A7Jm5ic3A7JysgdG9vbHRpcEJ0bkh0bWwgKyAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJ1ZGEtZWRpdGVkLXRvb2x0aXBcIiBuYW1lPVwidWRhLWVkaXRlZC10b29sdGlwXCIgY2xhc3M9XCJ1ZGEtZm9ybS1pbnB1dFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgdGV4dFwiIHZhbHVlPVwiJyArIHRvb2xUaXBUZXh0ICsgJ1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj4nOyovXHJcblx0XHRcdFx0bGV0IHRvb2x0aXBCdG5IdG1sIFx0PSAnXHQ8ZGl2IGNsYXNzPVwidWRhLXJlY29yZGluZ1wiIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPidcclxuXHRcdFx0XHRcdCsnXHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwidWRhLWVkaXRlZC10b29sdGlwXCIgbmFtZT1cInVkYS1lZGl0ZWQtdG9vbHRpcFwiIGNsYXNzPVwidWRhLWZvcm0taW5wdXRcIiBwbGFjZWhvbGRlcj1cIkN1c3RvbSBUb29sdGlwIChPcHRpb25hbClcIiBzdHlsZT1cIndpZHRoOjY4JSAhaW1wb3J0YW50O1wiIHZhbHVlPVwiJyt0b29sVGlwVGV4dCsnXCI+J1xyXG5cdFx0XHRcdFx0KydcdFx0PHNwYW4+J1xyXG5cdFx0XHRcdFx0KydcdFx0XHQ8YnV0dG9uIGNsYXNzPVwiZGVsZXRlLWJ0blwiIHN0eWxlPVwiY29sb3I6I2ZmZjtcIiBpZD1cInVkYS10b29sdGlwLXNhdmVcIj5TYXZlPC9idXR0b24+J1xyXG5cdFx0XHRcdFx0KydcdFx0PC9zcGFuPidcclxuXHRcdFx0XHRcdCsnXHQ8L2Rpdj4nO1xyXG5cdFx0XHRcdGxldCB0b29sdGlwc2VjdGlvbiA9IHRvb2x0aXBCdG5IdG1sO1xyXG5cdFx0XHRcdHN3aXRjaCAobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSB7XHJcblx0XHRcdFx0XHRjYXNlIFwiaW5wdXRcIjpcclxuXHRcdFx0XHRcdGNhc2UgXCJ0ZXh0YXJlYVwiOlxyXG5cdFx0XHRcdFx0Y2FzZSBcInNlbGVjdFwiOlxyXG5cdFx0XHRcdFx0Y2FzZSBcIm9wdGlvblwiOlxyXG5cdFx0XHRcdFx0Y2FzZSBcImNoZWNrYm94XCI6XHJcblx0XHRcdFx0XHRcdHJldHVybiB0b29sdGlwc2VjdGlvbjtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIFwiYnV0dG9uXCI6XHJcblx0XHRcdFx0XHRcdC8vdHlwZW9mIG5vZGUuaGFzQXR0cmlidXRlICE9PSAndW5kZWZpbmVkJyAmJlxyXG5cdFx0XHRcdFx0XHRpZih0eXBlb2Ygbm9kZS5oYXNBdHRyaWJ1dGUgIT09ICd1bmRlZmluZWQnICYmIG5vZGUuaGFzQXR0cmlidXRlKCdhcmlhLWxhYmVsJykgJiYgbm9kZS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKS50b0xvd2VyQ2FzZSgpID09PSAnb3BlbiBjYWxlbmRhcicpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdG9vbHRpcHNlY3Rpb247XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuICcnO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnc3Bhbic6XHJcblx0XHRcdFx0XHRcdGlmIChub2RlLmNsYXNzTmFtZSAmJiBub2RlLmNsYXNzTmFtZS5pbmRleE9mKCdzZWxlY3QyLXNlbGVjdGlvbicpICE9PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiB0b29sdGlwc2VjdGlvbjtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJyc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdkaXYnOlxyXG5cdFx0XHRcdFx0XHRpZihub2RlLmNsYXNzTmFtZSAmJiAobm9kZS5jbGFzc05hbWUuaW5kZXhPZignbWF0LWZvcm0tZmllbGQtZmxleCcpICE9PSAtMSB8fCBub2RlLmNsYXNzTmFtZS5pbmRleE9mKCdtYXQtc2VsZWN0LXRyaWdnZXInKSAhPT0gLTEpKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRvb2x0aXBzZWN0aW9uO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAnJztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2NrZWRpdG9yJzpcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRvb2x0aXBzZWN0aW9uO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ25nLXNlbGVjdCc6XHJcblx0XHRcdFx0XHRcdHJldHVybiB0b29sdGlwc2VjdGlvbjtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJcIjtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRcdFx0VURBRXJyb3JMb2dnZXIuZXJyb3IoJ0Vycm9yIGF0IHNob3dUb29sdGlwRWRpdFNlY3Rpb24uICcrIGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0ZWRpdEFuZFNhdmVUb29sdGlwOiBmdW5jdGlvbihkYXRhLCB2YWx1ZSkge1xyXG5cdFx0XHRsZXQgbm9kZURhdGEgPSBKU09OLnBhcnNlKGRhdGEub2JqZWN0ZGF0YSk7XHJcblx0XHRcdGlmKG5vZGVEYXRhLm1ldGEgJiYgbm9kZURhdGEubWV0YS5oYXNPd25Qcm9wZXJ0eShcImRpc3BsYXlUZXh0XCIpKXtcclxuXHRcdFx0XHRub2RlRGF0YS5tZXRhLnRvb2x0aXBJbmZvID0gdmFsdWU7XHJcblx0XHRcdH0gZWxzZSBpZihub2RlRGF0YS5tZXRhICYmIE9iamVjdC5rZXlzKG5vZGVEYXRhLm1ldGEpLmxlbmd0aCA+PSAxKSB7XHJcblx0XHRcdFx0bm9kZURhdGEubWV0YS50b29sdGlwSW5mbyA9IHZhbHVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5vZGVEYXRhLm1ldGEgPSB7fTtcclxuXHRcdFx0XHRub2RlRGF0YS5tZXRhLnRvb2x0aXBJbmZvID0gdmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YS5vYmplY3RkYXRhID0gSlNPTi5zdHJpbmdpZnkobm9kZURhdGEpO1xyXG5cdFx0XHR2YXIgb3V0cHV0ZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG5cdFx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdHhoci5vcGVuKFwiUE9TVFwiLCBVREFfQVBJX1VSTCtcIi91c2VyL3VwZGF0ZWNsaWNrZWRub2RlXCIpO1xyXG5cdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLTgnKTtcclxuXHRcdFx0eGhyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuXHRcdFx0XHRVREFQbHVnaW5TREsuc2hvd2h0bWwoKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0eGhyLnNlbmQob3V0cHV0ZGF0YSk7XHJcblx0XHR9LFxyXG5cdFx0Ly9wZXJzb25hbCBtb2RpZmljYXRpb24gYnV0dG9uIGNsaWNrZWRcclxuXHRcdHBlcnNvbmFsTm9kZTpmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0bGV0IG5vZGVEYXRhID0gSlNPTi5wYXJzZShkYXRhLm9iamVjdGRhdGEpO1xyXG5cdFx0XHRpZihub2RlRGF0YS5tZXRhLmhhc093blByb3BlcnR5KFwiaXNQZXJzb25hbFwiKSl7XHJcblx0XHRcdFx0aWYobm9kZURhdGEubWV0YS5pc1BlcnNvbmFsKSB7XHJcblx0XHRcdFx0XHRub2RlRGF0YS5tZXRhLmlzUGVyc29uYWwgPSBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bm9kZURhdGEubWV0YS5pc1BlcnNvbmFsID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bm9kZURhdGEubWV0YS5pc1BlcnNvbmFsID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRkYXRhLm9iamVjdGRhdGEgPSBKU09OLnN0cmluZ2lmeShub2RlRGF0YSk7XHJcblx0XHRcdHZhciBvdXRwdXRkYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcblx0XHRcdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdFx0eGhyLm9wZW4oXCJQT1NUXCIsIFVEQV9BUElfVVJMK1wiL3VzZXIvdXBkYXRlY2xpY2tlZG5vZGVcIik7XHJcblx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOCcpO1xyXG5cdFx0XHR4aHIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0XHRcdFVEQVBsdWdpblNESy5zaG93aHRtbCgpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR4aHIuc2VuZChvdXRwdXRkYXRhKTtcclxuXHRcdH0sXHJcblx0XHQvL2VkaXQgbW9kaWZpY2F0aW9uIGJ1dHRvbiBjbGlja2VkXHJcblx0XHRlZGl0QW5kU2F2ZTpmdW5jdGlvbihkYXRhLCB2YWx1ZSl7XHJcblx0XHRcdGxldCBub2RlRGF0YSA9IEpTT04ucGFyc2UoZGF0YS5vYmplY3RkYXRhKTtcclxuXHRcdFx0aWYobm9kZURhdGEubWV0YSAmJiBub2RlRGF0YS5tZXRhLmhhc093blByb3BlcnR5KFwiZGlzcGxheVRleHRcIikpe1xyXG5cdFx0XHRcdG5vZGVEYXRhLm1ldGEuZGlzcGxheVRleHQgPSB2YWx1ZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRub2RlRGF0YS5tZXRhID0ge307XHJcblx0XHRcdFx0bm9kZURhdGEubWV0YS5kaXNwbGF5VGV4dCA9IHZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRhdGEub2JqZWN0ZGF0YSA9IEpTT04uc3RyaW5naWZ5KG5vZGVEYXRhKTtcclxuXHRcdFx0dmFyIG91dHB1dGRhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuXHRcdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0XHR4aHIub3BlbihcIlBPU1RcIiwgVURBX0FQSV9VUkwrXCIvdXNlci91cGRhdGVjbGlja2Vkbm9kZVwiKTtcclxuXHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04Jyk7XHJcblx0XHRcdHhoci5vbmxvYWQgPSBmdW5jdGlvbihldmVudCl7XHJcblx0XHRcdFx0VURBUGx1Z2luU0RLLnNob3dodG1sKCk7XHJcblx0XHRcdH07XHJcblx0XHRcdHhoci5zZW5kKG91dHB1dGRhdGEpO1xyXG5cdFx0fSxcclxuXHRcdC8vIHN1Ym1pdCBmdW5jdGlvbmFsaXR5IG9mIHRoZSByZWNvcmRlZCBzZXF1ZW5jZS5cclxuXHRcdHN1Ym1pdHJlY29yZGVkbGFiZWw6ZnVuY3Rpb24oc3VibWl0dHlwZT1cInJlY29yZGluZ1wiKXtcclxuXHRcdFx0Ly8gdmFyIHNlcXVlbmNlbmFtZT1qUXVlcnkoXCIjdWRhLXJlY29yZGVkLW5hbWVcIikudmFsKCk7XHJcblx0XHRcdGxldCBzZXF1ZW5jZW5hbWVzID0gW107XHJcblx0XHRcdHZhciBzZXF1ZW5jZW5hbWVhcnJheT1qUXVlcnkoXCJpbnB1dFtuYW1lPSd1ZGEtc2F2ZS1yZWNvcmRlZFtdJ11cIikubWFwKGZ1bmN0aW9uICgpe1xyXG5cdFx0XHRcdC8vIGRldGVjdCBmb3IgcHJvZmFuaXR5XHJcblx0XHRcdFx0bGV0IHNlcXVlbmNlbmFtZSA9IHRoaXMudmFsdWU7XHJcblx0XHRcdFx0aWYoVURBUGx1Z2luU0RLLnByb2Zhbml0eS5lbmFibGVkKSB7XHJcblx0XHRcdFx0XHRzZXF1ZW5jZW5hbWUgPSBVREFQbHVnaW5TREsuY2hlY2tQcm9mYW5pdHkoc2VxdWVuY2VuYW1lKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c2VxdWVuY2VuYW1lID0gc2VxdWVuY2VuYW1lLnRyaW0oKTtcclxuXHRcdFx0XHRzZXF1ZW5jZW5hbWVzLnB1c2goc2VxdWVuY2VuYW1lKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGxldCBzZXF1ZW5jZW5hbWUgPSBKU09OLnN0cmluZ2lmeShzZXF1ZW5jZW5hbWVzKTtcclxuXHRcdFx0dmFyIHNlcXVlbmNlbGlzdGRhdGE9e25hbWU6XCJcIixkb21haW46d2luZG93LmxvY2F0aW9uLmhvc3QsdXNlcnNlc3Npb25pZDp0aGlzLnNlc3Npb25kYXRhLmF1dGhkYXRhLmlkLnRvU3RyaW5nKCksdXNlcmNsaWNrbm9kZWxpc3Q6W10udG9TdHJpbmcoKSx1c2VyY2xpY2tub2Rlc1NldDp0aGlzLnJlY29yZGVkc2VxdWVuY2VpZHMsaXNWYWxpZDoxLGlzSWdub3JlZDowfTtcclxuXHRcdFx0aWYoc3VibWl0dHlwZT09PSdyZWNvcmRpbmcnKSB7XHJcblx0XHRcdFx0aWYgKHNlcXVlbmNlbmFtZSA9PT0gJycpIHtcclxuXHRcdFx0XHRcdGFsZXJ0KCdQbGVhc2UgZW50ZXIgcHJvcGVyIGxhYmVsJyk7XHJcblx0XHRcdFx0XHRqUXVlcnkoXCIjdWRhLXJlY29yZGVkLW5hbWVcIikuZm9jdXMoKTtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSBpZihzdWJtaXR0eXBlID09PSAnaW52YWxpZCcpe1xyXG5cdFx0XHRcdGlmKHNlcXVlbmNlbmFtZT09PScnKXtcclxuXHRcdFx0XHRcdHNlcXVlbmNlbmFtZT1cIkRlY2xhcmVkIGFzIG5vdCB2YWxpZCBzZXF1ZW5jZSBieSB1c2VyXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHNlcXVlbmNlbGlzdGRhdGEuaXNWYWxpZD0wO1xyXG5cdFx0XHR9IGVsc2UgaWYoc3VibWl0dHlwZSA9PT0gJ2lnbm9yZScpe1xyXG5cdFx0XHRcdGlmKHNlcXVlbmNlbmFtZT09PScnKXtcclxuXHRcdFx0XHRcdHNlcXVlbmNlbmFtZT1cIklnbm9yZWQgYnkgdXNlclwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRzZXF1ZW5jZWxpc3RkYXRhLmlzVmFsaWQ9MDtcclxuXHRcdFx0XHRzZXF1ZW5jZWxpc3RkYXRhLmlzSWdub3JlZD0xO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgc2VxdWVuY2VpZHMgPSBbXTtcclxuXHRcdFx0Zm9yKHZhciBpPTA7aTx0aGlzLnJlY29yZGVkc2VxdWVuY2VpZHMubGVuZ3RoO2krKyl7XHJcblx0XHRcdFx0c2VxdWVuY2VpZHMucHVzaCh0aGlzLnJlY29yZGVkc2VxdWVuY2VpZHNbaV0uaWQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHNlcXVlbmNlbGlzdGRhdGEubmFtZT1zZXF1ZW5jZW5hbWU7XHJcblx0XHRcdHNlcXVlbmNlbGlzdGRhdGEudXNlcmNsaWNrbm9kZWxpc3Q9c2VxdWVuY2VpZHMudG9TdHJpbmcoKTtcclxuXHRcdFx0dGhpcy5jYW5jZWxyZWNvcmRpbmdzZXF1ZW5jZShmYWxzZSk7XHJcblx0XHRcdHRoaXMuY3VycmVudFBhZ2U9J1NlcXVlbmNlU3VibWl0dGVkJztcclxuXHRcdFx0dGhpcy5zaG93aHRtbCgpO1xyXG5cdFx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdHhoci5vcGVuKFwiUE9TVFwiLCBVREFfQVBJX1VSTCArIFwiL2NsaWNrZXZlbnRzL3JlY29yZHNlcXVlbmNlZGF0YVwiLCB0cnVlKTtcclxuXHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcblx0XHRcdHhoci5vbmxvYWQgPSBmdW5jdGlvbihldmVudCl7XHJcblx0XHRcdFx0aWYoeGhyLnN0YXR1cyA9PT0gMjAwKXtcclxuXHRcdFx0XHRcdFVEQVBsdWdpblNESy5zaG93U2VsZWN0ZWRTZXF1ZW5jZShKU09OLnBhcnNlKHhoci5yZXNwb25zZSkpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHR4aHIuc2VuZChKU09OLnN0cmluZ2lmeShzZXF1ZW5jZWxpc3RkYXRhKSk7XHJcblx0XHR9LFxyXG5cdFx0LyoqXHJcblx0XHQgKiBQcm9mYW5pdHkgZGV0ZWN0aW9uXHJcblx0XHQgKiBAY29uc3RydWN0b3JcclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBsYWJlbCAtIExhYmVsIG9mIHRoZSByZWNvcmRlZCBzZXF1ZW5jZVxyXG5cdFx0ICovXHJcblx0XHRjaGVja1Byb2Zhbml0eTogZnVuY3Rpb24obGFiZWwpe1xyXG5cdFx0XHRpZighdGhpcy5wcm9mYW5pdHkuZW5hYmxlZCl7XHJcblx0XHRcdFx0cmV0dXJuIGxhYmVsO1xyXG5cdFx0XHR9XHJcblx0XHRcdHN3aXRjaCAodGhpcy5wcm9mYW5pdHkucHJvdmlkZXIudG9Mb3dlckNhc2UoKSl7XHJcblx0XHRcdFx0Y2FzZSAnYXp1cmUnOlxyXG5cdFx0XHRcdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0XHRcdFx0eGhyLm9wZW4oXCJQT1NUXCIsIHRoaXMucHJvZmFuaXR5LmNvbmZpZy5lbmRQb2ludCwgZmFsc2UpO1xyXG5cdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3BsYWluJyk7XHJcblx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcignT2NwLUFwaW0tU3Vic2NyaXB0aW9uLUtleScsIHRoaXMucHJvZmFuaXR5LmNvbmZpZy5rZXkxKTtcclxuXHRcdFx0XHRcdHhoci5vbmxvYWQgPSBmdW5jdGlvbihldmVudCl7XHJcblx0XHRcdFx0XHRcdGlmKHhoci5zdGF0dXMgPT09IDIwMCl7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXNwb25zZS5UZXJtcyAmJiByZXNwb25zZS5UZXJtcy5sZW5ndGg+MCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzcG9uc2UuVGVybXMuZm9yRWFjaChmdW5jdGlvbiAodGVybSwgdGVybWluZGV4KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsID0gbGFiZWwucmVwbGFjZUFsbCh0ZXJtLlRlcm0sICcnKTtcclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdHhoci5zZW5kKGxhYmVsKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBsYWJlbDtcclxuXHRcdH0sXHJcblx0XHQvLyBhZGRpbmcgdGhlIGxhc3QgY2xpY2tlZCByZWNvcmQgdG8gdGhlIHN0b3JhZ2VcclxuXHRcdGFkZGNsaWNrZWRyZWNvcmRjb29raWU6ZnVuY3Rpb24oY2xpY2tlZG5vZGVuYW1lKXtcclxuXHRcdFx0dGhpcy5jcmVhdGVzdG9yYWdlZGF0YSh0aGlzLnJlY29yZGNsaWNrbm9kZWNvb2tpZW5hbWUsY2xpY2tlZG5vZGVuYW1lKTtcclxuXHRcdH0sXHJcblx0XHQvLyBzZWFyY2ggZnJvbSBlbGFzdGljIGZ1bmN0aW9uYWxpdHlcclxuXHRcdHNlYXJjaGluZWxhc3RpYzpmdW5jdGlvbihzZWFyY2h0ZXJtPScnKXtcclxuXHJcblx0XHRcdGlmKHRoaXMuY3VycmVudFBhZ2U9PT0nY2FuY2VscmVjb3JkaW5nJyl7XHJcblx0XHRcdFx0alF1ZXJ5KCcjdWRhLWFkdmFuY2VkLWJ0bicpLmhpZGUoKTtcclxuXHRcdFx0fSBlbHNlIGlmKHRoaXMuY3VycmVudFBhZ2U9PT0nU2VxdWVuY2VTdWJtaXR0ZWQnKXtcclxuXHRcdFx0XHRyZXR1cm4gO1xyXG5cdFx0XHR9IGVsc2UgaWYoIVVEQVVzZXJBdXRoRGF0YS5yZXN0cmljdF9hZGRfZGVsZXRlKSB7XHJcblx0XHRcdFx0alF1ZXJ5KCcjdWRhLWFkdmFuY2VkLWJ0bicpLnNob3coKTtcclxuXHRcdFx0XHRqUXVlcnkoXCIjdWRhLWFkdmFuY2Utc2VjdGlvblwiKS5zaG93KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuY3VycmVudFBhZ2U9J2FkdmFuY2VkJztcclxuXHJcblx0XHRcdGlmKHNlYXJjaHRlcm0pIHtcclxuXHRcdFx0XHR2YXIgc2VhcmNodGV4dCA9IHNlYXJjaHRlcm07XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIHNlYXJjaHRleHQgPSBqUXVlcnkoXCIjdWRhLXNlYXJjaC1pbnB1dFwiKS52YWwoKTtcclxuXHRcdFx0fVxyXG4gICAgICAgICAgICAvLyB0cmFuc2xhdGluZyBmcm9tIG90aGVyIGxhbmd1YWdlIHRvIGVuZ2xpc2hcclxuXHRcdFx0aWYodGhpcy5tdWx0aWxpbmd1YWwuc2VsZWN0ZWRMYW5nICE9PSB0aGlzLm11bHRpbGluZ3VhbC5zZWFyY2hJbkxhbmcpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb3N0dXJsID0gJyc7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubXVsdGlsaW5ndWFsLnRyYW5zbGF0ZS5wcm92aWRlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZ29vZ2xlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zdHVybCA9IHRoaXMubXVsdGlsaW5ndWFsLnRyYW5zbGF0ZS5hcGl1cmwrJz9rZXk9JytlbmNvZGVVUklDb21wb25lbnQodGhpcy5tdWx0aWxpbmd1YWwudHJhbnNsYXRlLmFwaWtleSkrJyZ0YXJnZXQ9ZW4mcT0nK2VuY29kZVVSSUNvbXBvbmVudChzZWFyY2h0ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgdHJhbnNsYXRleGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGV4aHIub3BlbihcIlBPU1RcIiwgcG9zdHVybCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRleGhyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgICAgICAgICBpZih0cmFuc2xhdGV4aHIuc3RhdHVzID09PSAyMDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHJhbnNsYXRlZGRhdGEgPSBKU09OLnBhcnNlKHRyYW5zbGF0ZXhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRyYW5zbGF0ZWRkYXRhLmRhdGEudHJhbnNsYXRpb25zLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2h0ZXh0ID0gdHJhbnNsYXRlZGRhdGEuZGF0YS50cmFuc2xhdGlvbnNbMF0udHJhbnNsYXRlZFRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyhKU09OLnBhcnNlKHRyYW5zbGF0ZXhoci5yZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGV4aHIub25lcnJvciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRleGhyLnNlbmQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHRcdFx0dGhpcy5jYW5jZWxyZWNvcmRpbmdzZXF1ZW5jZSh0cnVlKTtcclxuXHJcblx0XHRcdHRoaXMucmVuZGVyTWVzc2FnZSgnTG9hZGluZyBQbGVhc2UgV2FpdC4uLicpO1xyXG5cclxuXHJcblx0XHRcdGlmICh0aGlzLnNlYXJjaEluUHJvZ3Jlc3MgPT09IHRydWUpIHtcclxuXHRcdFx0XHRhbGVydCgnUHJldmlvdXMgc2VhcmNoIGluIHByb2dyZXNzJyk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5hdXRvcGxheSkge1xyXG5cdFx0XHRcdHRoaXMuc2VhcmNoSW5Qcm9ncmVzcyA9IGZhbHNlO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oc2VhcmNodGV4dCk7XHJcblxyXG5cdFx0XHR0aGlzLnNlYXJjaFRleHQgPSBzZWFyY2h0ZXh0O1xyXG5cdFx0XHR0aGlzLnNlYXJjaEluUHJvZ3Jlc3MgPSB0cnVlO1xyXG5cclxuXHRcdFx0Ly9hZGQgYW5hbHR5dGljc1xyXG5cdFx0XHR0aGlzLnJlY29yZGNsaWNrKCdzZWFyY2gnLHNlYXJjaHRleHQpO1xyXG5cclxuXHRcdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0XHRsZXQgc2VhcmNoVXJsID0gXCIvY2xpY2tldmVudHMvc2VxdWVuY2Uvc2VhcmNoP3F1ZXJ5PVwiK3NlYXJjaHRleHQrXCImZG9tYWluPVwiK2VuY29kZVVSSSh3aW5kb3cubG9jYXRpb24uaG9zdCk7XHJcblx0XHRcdGlmKHRoaXMuZW5hYmxlTm9kZVR5cGVDaGFuZ2VTZWxlY3Rpb24pe1xyXG5cdFx0XHRcdHNlYXJjaFVybCArPScmZW5hYmxlZE5vZGVUeXBlU2VsZWN0aW9uPXRydWUnO1xyXG5cdFx0XHR9XHJcblx0XHRcdHhoci5vcGVuKFwiR0VUXCIsIFVEQV9BUElfVVJMICsgc2VhcmNoVXJsLCBmYWxzZSk7XHJcblx0XHRcdHhoci5vbmxvYWQgPSBmdW5jdGlvbihldmVudCl7XHJcblx0XHRcdFx0aWYoeGhyLnN0YXR1cyA9PT0gMjAwKXtcclxuXHRcdFx0XHRcdFVEQVBsdWdpblNESy5zZWFyY2hJblByb2dyZXNzPWZhbHNlO1xyXG5cdFx0XHRcdFx0VURBUGx1Z2luU0RLLnJlbmRlclNlYXJjaFJlc3VsdHMoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0VURBUGx1Z2luU0RLLnJlbmRlck1lc3NhZ2UoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdC8vIHhoci5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgVURBUGx1Z2luU0RLLnJlbmRlck1lc3NhZ2UoKSk7XHJcblxyXG5cdFx0XHR4aHIub25lcnJvciA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coeGhyLnN0YXR1cyk7XHJcblx0XHRcdFx0VURBUGx1Z2luU0RLLnJlbmRlck1lc3NhZ2UoKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0eGhyLnNlbmQoKTtcclxuXHRcdH0sXHJcblx0XHQvL3JlbmRlcmluZyBzZWFyY2ggcmVzdWx0cyBzY3JlZW5cclxuXHRcdHJlbmRlclNlYXJjaFJlc3VsdHM6ZnVuY3Rpb24oZGF0YSl7XHJcblxyXG5cdFx0XHRpZighVURBVXNlckF1dGhEYXRhLnJlc3RyaWN0X2FkZF9kZWxldGUpIHtcclxuXHRcdFx0XHRqUXVlcnkoJyN1ZGEtYWR2YW5jZWQtYnRuJykuc2hvdygpO1xyXG5cdFx0XHRcdGpRdWVyeShcIiN1ZGEtYWR2YW5jZS1zZWN0aW9uXCIpLnNob3coKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIG1hdGNobm9kZXMgPSBkYXRhO1xyXG5cdFx0XHRpZihtYXRjaG5vZGVzLmxlbmd0aD4wKXtcclxuXHRcdFx0XHRqUXVlcnkoXCIjdWRhLWNvbnRlbnQtY29udGFpbmVyXCIpLmh0bWwoJycpO1xyXG5cdFx0XHRcdGZvcih2YXIgaz0wO2s8bWF0Y2hub2Rlcy5sZW5ndGg7aysrKXtcclxuXHRcdFx0XHRcdGlmKG1hdGNobm9kZXNba10uaGFzT3duUHJvcGVydHkoXCJkZWxldGVkXCIpICYmIG1hdGNobm9kZXNba10uZGVsZXRlZD09PTApIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5yZW5kZXJTZXF1ZW5jZVJvdyhtYXRjaG5vZGVzW2tdLCBrKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZighbWF0Y2hub2Rlc1trXS5oYXNPd25Qcm9wZXJ0eShcImRlbGV0ZWRcIikpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5yZW5kZXJTZXF1ZW5jZVJvdyhtYXRjaG5vZGVzW2tdLCBrKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5yZW5kZXJFbXB0eVNlYXJjaFJlc3VsdHMoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdC8vIHJlbmRlcmluZyBlbXB0eSByZXN1bHRzIGh0bWxcclxuXHRcdHJlbmRlckVtcHR5U2VhcmNoUmVzdWx0czogZnVuY3Rpb24oKXtcclxuXHRcdFx0dGhpcy5zZWFyY2hJblByb2dyZXNzPWZhbHNlO1xyXG5cdFx0XHRqUXVlcnkoXCIjdWRhLWNvbnRlbnQtY29udGFpbmVyXCIpLmh0bWwodGhpcy5nZXRFbXB0eVJlc3VsdHNIdG1sKCkpO1xyXG5cdFx0fSxcclxuXHRcdGdldEVtcHR5UmVzdWx0c0h0bWw6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRsZXQgaHRtbCA9XHQnPGRpdiBjbGFzcz1cInVkYS1uby1yZXN1bHRzXCI+J1xyXG5cdFx0XHRcdFx0XHQrJ1x0PHN2ZyBjbGFzcz1cInVkYS1uby1zcmNcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgaWQ9XCJDYXBhXzFcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgNTEyIDUxMlwiIGhlaWdodD1cIjUxMlwiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiIHdpZHRoPVwiNTEyXCI+PGc+PHBhdGggZD1cIm0zMTcgOTBjLTU3Ljg5MSAwLTEwNSA0Ny4xMDktMTA1IDEwNXM0Ny4xMDkgMTA1IDEwNSAxMDUgMTA1LTQ3LjEwOSAxMDUtMTA1LTQ3LjEwOS0xMDUtMTA1LTEwNXptNTEuMjExIDEzNS0yMS4yMTEgMjEuMjExLTMwLTMwLTMwIDMwLTIxLjIxMS0yMS4yMTEgMzAtMzAtMzAtMzAgMjEuMjExLTIxLjIxMSAzMCAzMCAzMC0zMCAyMS4yMTEgMjEuMjExLTMwIDMwelwiLz48cGF0aCBkPVwibTMxNyAwYy0xMDcuNTIgMC0xOTUgODcuNDgtMTk1IDE5NSAwIDQ4LjM3MSAxNy44MDkgOTIuNTkxIDQ3LjA4IDEyNi43MDlsLTIzLjA4NiAyMy4wODYtMjEuMjExLTIxLjIxMS0xMTEuNjMxIDExMS42MjljLTE3LjUzNCAxNy41MzQtMTcuNTM0IDQ2LjA2OS0uMDE1IDYzLjYzM2wuMDE1LjAxNWMxNy41NDkgMTcuNTIgNDYuMTI0IDE3LjUyMyA2My42MzMtLjAxNWwxMTEuNjMxLTExMS42MjktMjEuMjExLTIxLjIxMSAyMy4wODYtMjMuMDg2YzM0LjExOCAyOS4yNzEgNzguMzM4IDQ3LjA4IDEyNi43MDkgNDcuMDggMTA3LjUyIDAgMTk1LTg3LjQ4IDE5NS0xOTVzLTg3LjQ4LTE5NS0xOTUtMTk1em0wIDMzMGMtNzQuNDQzIDAtMTM1LTYwLjU1Ny0xMzUtMTM1czYwLjU1Ny0xMzUgMTM1LTEzNSAxMzUgNjAuNTU3IDEzNSAxMzUtNjAuNTU3IDEzNS0xMzUgMTM1elwiLz48L2c+PC9zdmc+J1xyXG5cdFx0XHRcdFx0XHQrJ1x0PHA+Tm8gcmVzdWx0cyBmb3VuZDwvcD4nXHJcblx0XHRcdFx0XHRcdCsnPC9kaXY+JztcclxuXHRcdFx0cmV0dXJuIGh0bWw7XHJcblx0XHR9LFxyXG5cdFx0cmVuZGVyTWVzc2FnZTogZnVuY3Rpb24obWVzc2FnZT0nU29tZXRoaW5nIHdlbnQgd3JvbmcgcGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nKXtcclxuXHRcdFx0dGhpcy5zZWFyY2hJblByb2dyZXNzPWZhbHNlO1xyXG5cdFx0XHRqUXVlcnkoXCIjdWRhLWNvbnRlbnQtY29udGFpbmVyXCIpLmh0bWwodGhpcy5nZXRNZXNzYWdlSHRtbChtZXNzYWdlKSk7XHJcblx0XHR9LFxyXG5cdFx0Z2V0TWVzc2FnZUh0bWw6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcclxuXHRcdFx0bGV0IGh0bWwgPVx0JzxkaXYgY2xhc3M9XCJ1ZGEtbm8tcmVzdWx0c1wiPidcclxuXHRcdFx0XHQrJ1x0PHN2ZyBjbGFzcz1cInVkYS1uby1zcmNcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgaWQ9XCJDYXBhXzFcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgNTEyIDUxMlwiIGhlaWdodD1cIjUxMlwiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiIHdpZHRoPVwiNTEyXCI+PGc+PHBhdGggZD1cIm0zMTcgOTBjLTU3Ljg5MSAwLTEwNSA0Ny4xMDktMTA1IDEwNXM0Ny4xMDkgMTA1IDEwNSAxMDUgMTA1LTQ3LjEwOSAxMDUtMTA1LTQ3LjEwOS0xMDUtMTA1LTEwNXptNTEuMjExIDEzNS0yMS4yMTEgMjEuMjExLTMwLTMwLTMwIDMwLTIxLjIxMS0yMS4yMTEgMzAtMzAtMzAtMzAgMjEuMjExLTIxLjIxMSAzMCAzMCAzMC0zMCAyMS4yMTEgMjEuMjExLTMwIDMwelwiLz48cGF0aCBkPVwibTMxNyAwYy0xMDcuNTIgMC0xOTUgODcuNDgtMTk1IDE5NSAwIDQ4LjM3MSAxNy44MDkgOTIuNTkxIDQ3LjA4IDEyNi43MDlsLTIzLjA4NiAyMy4wODYtMjEuMjExLTIxLjIxMS0xMTEuNjMxIDExMS42MjljLTE3LjUzNCAxNy41MzQtMTcuNTM0IDQ2LjA2OS0uMDE1IDYzLjYzM2wuMDE1LjAxNWMxNy41NDkgMTcuNTIgNDYuMTI0IDE3LjUyMyA2My42MzMtLjAxNWwxMTEuNjMxLTExMS42MjktMjEuMjExLTIxLjIxMSAyMy4wODYtMjMuMDg2YzM0LjExOCAyOS4yNzEgNzguMzM4IDQ3LjA4IDEyNi43MDkgNDcuMDggMTA3LjUyIDAgMTk1LTg3LjQ4IDE5NS0xOTVzLTg3LjQ4LTE5NS0xOTUtMTk1em0wIDMzMGMtNzQuNDQzIDAtMTM1LTYwLjU1Ny0xMzUtMTM1czYwLjU1Ny0xMzUgMTM1LTEzNSAxMzUgNjAuNTU3IDEzNSAxMzUtNjAuNTU3IDEzNS0xMzUgMTM1elwiLz48L2c+PC9zdmc+J1xyXG5cdFx0XHRcdCsnXHQ8cD4nK21lc3NhZ2UrJzwvcD4nXHJcblx0XHRcdFx0Kyc8L2Rpdj4nO1xyXG5cdFx0XHRyZXR1cm4gaHRtbDtcclxuXHRcdH0sXHJcblx0XHQvL3JlbmRlcmluZyBlYWNoIHJvdyBodG1sIG9mIHRoZSBzZWFyY2ggcmVzdWx0XHJcblx0XHRyZW5kZXJTZXF1ZW5jZVJvdzpmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0dmFyIGVsZW1lbnQ9alF1ZXJ5KHRoaXMuZ2V0Um93SHRtbChkYXRhKSk7XHJcblx0XHRcdGVsZW1lbnQuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFVEQVBsdWdpblNESy5zaG93U2VsZWN0ZWRTZXF1ZW5jZShkYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGpRdWVyeShcIiN1ZGEtY29udGVudC1jb250YWluZXJcIikuYXBwZW5kKGVsZW1lbnQpO1xyXG5cdFx0fSxcclxuXHRcdC8vU2VxdWVuY2Ugcm93IGh0bWxcclxuXHRcdGdldFJvd0h0bWw6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHR2YXIgcGF0aD0nJztcclxuXHRcdFx0Zm9yKHZhciBpPTA7aTxkYXRhLnVzZXJjbGlja25vZGVzU2V0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdGlmKHBhdGghPT0nJyl7XHJcblx0XHRcdFx0XHRwYXRoICs9JyA+PiAnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRwYXRoICs9IGRhdGEudXNlcmNsaWNrbm9kZXNTZXRbaV0uY2xpY2tlZG5vZGVuYW1lO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBzZXF1ZW5jZW5hbWUgPSAnJztcclxuXHRcdFx0dHJ5e1xyXG5cdFx0XHRcdHNlcXVlbmNlbmFtZSA9IEpTT04ucGFyc2UoZGF0YS5uYW1lKVswXTtcclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdHNlcXVlbmNlbmFtZSA9IGRhdGEubmFtZS50b1N0cmluZygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBodG1sID1cdCc8ZGl2IGNsYXNzPVwidWRhLWNhcmRcIj4nXHJcblx0XHRcdFx0XHRcdCsnXHQ8aDU+JytzZXF1ZW5jZW5hbWUrJzwvaDU+J1xyXG5cdFx0XHRcdFx0XHQrJ1x0PGk+JytwYXRoKyc8L2k+J1xyXG5cdFx0XHRcdFx0XHQrJzwvZGl2Pic7XHJcblx0XHRcdHJldHVybiBodG1sO1xyXG5cdFx0fSxcclxuXHRcdC8vc2VsZWN0ZWQgc2VhcmNoIHJlc3VsdCBmdW5jdGlvbmFsaXR5XHJcblx0XHRzaG93U2VsZWN0ZWRTZXF1ZW5jZTpmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0dmFyIG5hdmNvb2tpZWRhdGEgPSB7c2hvd25hdjogdHJ1ZSwgZGF0YTogZGF0YSwgYXV0b3BsYXk6ZmFsc2UsIHBhdXNlOmZhbHNlLCBzdG9wOmZhbHNlLCBuYXZjb21wbGV0ZWQ6ZmFsc2UsIG5hdmlnYXRlZGRhdGE6W10sc2VhcmNodGVybTonJ307XHJcblx0XHRcdG5hdmNvb2tpZWRhdGEuc2VhcmNodGVybT1qUXVlcnkoXCIjdWRhLXNlYXJjaC1pbnB1dFwiKS52YWwoKTtcclxuXHRcdFx0dGhpcy5jcmVhdGVzdG9yYWdlZGF0YSh0aGlzLm5hdmlnYXRpb25jb29raWVuYW1lLEpTT04uc3RyaW5naWZ5KG5hdmNvb2tpZWRhdGEpKTtcclxuXHRcdFx0dGhpcy5hdXRvcGxheSA9IGZhbHNlO1xyXG5cdFx0XHR0aGlzLnNob3dzZWxlY3RlZHJvdyhkYXRhLGRhdGEuaWQsdHJ1ZSwgbmF2Y29va2llZGF0YSk7XHJcblx0XHRcdHRoaXMuaW52b2tlZEFjdGlvbk1hbnVhbGx5PWZhbHNlO1xyXG5cdFx0XHQvL2FkZCBhbmFsdHl0aWNzXHJcblx0XHRcdHRoaXMucmVjb3JkY2xpY2soJ3NlcXVlbmNlcmVjb3JkJyxkYXRhLm5hbWUudG9TdHJpbmcoKSxkYXRhLmlkKTtcclxuXHRcdH0sXHJcblx0XHQvLyByZW5kZXJTZWxlY3RlZFNlcXVlbmNlSHRtbDogZnVcclxuXHRcdHJlbmRlclNlbGVjdGVkU2VxdWVuY2VIdG1sOiBmdW5jdGlvbiAoZGF0YSwgaXNQbGF5aW5nKXtcclxuXHRcdFx0bGV0IHBsYXlwYXVzZWJ1dHRvbiA9ICcnO1xyXG5cdFx0XHRpZihpc1BsYXlpbmcpIHtcclxuXHRcdFx0XHRwbGF5cGF1c2VidXR0b24gPSAnXHRcdFx0PGRpdiBjbGFzcz1cInVkYS1sb2FkaW5nLWJhciBhbmltYXRlXCIgaWQ9XCJuaXN0LWF1dG9wbGF5XCI+J1xyXG5cdFx0XHRcdFx0XHRcdFx0KycgICBcdFx0XHQgPHNwYW4+J1xyXG5cdFx0XHRcdFx0XHRcdFx0KycgICAgICBcdFx0XHQ8aW1nIHNyYz1cIicrdGhpcy5leHRlbnNpb25wYXRoKydpbWFnZXMvaWNvbnMvcGF1c2UucG5nXCI+J1xyXG5cdFx0XHRcdFx0XHRcdFx0KycgICAgXHRcdFx0PC9zcGFuPidcclxuXHRcdFx0XHRcdFx0XHRcdCsnICBcdFx0PC9kaXY+JztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRwbGF5cGF1c2VidXR0b24gPSAnXHRcdFx0PGRpdiBjbGFzcz1cInVkYS1sb2FkaW5nLWJhclwiIGlkPVwibmlzdC1hdXRvcGxheVwiPidcclxuXHRcdFx0XHRcdFx0XHRcdCsnICAgXHRcdFx0IDxzcGFuPidcclxuXHRcdFx0XHRcdFx0XHRcdCsnICAgICAgXHRcdFx0PGltZyBzcmM9XCInK3RoaXMuZXh0ZW5zaW9ucGF0aCsnaW1hZ2VzL2ljb25zL3BsYXkucG5nXCI+J1xyXG5cdFx0XHRcdFx0XHRcdFx0KycgICAgXHRcdFx0PC9zcGFuPidcclxuXHRcdFx0XHRcdFx0XHRcdCsnICBcdFx0PC9kaXY+JztcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgc2VxdWVuY2VuYW1lID0gJyc7XHJcblx0XHRcdGxldCBzZXF1ZW5jZW5hbWVzID0gJyc7XHJcblx0XHRcdHRyeXtcclxuXHRcdFx0XHRsZXQgc2VxdWVuY2VuYW1lc0FycmF5ID0gSlNPTi5wYXJzZShkYXRhLm5hbWUpXHJcblx0XHRcdFx0c2VxdWVuY2VuYW1lID0gc2VxdWVuY2VuYW1lc0FycmF5WzBdO1xyXG5cdFx0XHRcdC8qaWYoc2VxdWVuY2VuYW1lc0FycmF5Lmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0XHRcdHNlcXVlbmNlbmFtZXNBcnJheS5zcGxpY2UoMCwgMSk7XHJcblx0XHRcdFx0XHRzZXF1ZW5jZW5hbWVzID0gc2VxdWVuY2VuYW1lc0FycmF5LmpvaW4oJzxiciAvPiBvciA8YnIgLz4nKTtcclxuXHRcdFx0XHR9Ki9cclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdHNlcXVlbmNlbmFtZSA9IGRhdGEubmFtZS50b1N0cmluZygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBodG1sID1cdCc8ZGl2IGNsYXNzPVwidWRhLWNhcmQtZGV0YWlsc1wiIHN0eWxlPVwiYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMHB4OyBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMHB4O1wiPidcclxuXHRcdFx0XHRcdFx0KycgICAgPGRpdiBjbGFzcz1cInVkYS1jYXJkLWJ0bnNcIj4nXHJcblx0XHRcdFx0XHRcdC8vICsnICAgICAgICA8YnV0dG9uIGNsYXNzPVwidWRhLXBsYXktYnRuXCIgJysoKGlzUGxheWluZyk/J2Rpc2FibGVkPVwiZGlzYWJsZWRcIic6J2lkPVwibmlzdC1hdXRvcGxheVwiJykrJz48aW1nIHNyYz1cIicrdGhpcy5leHRlbnNpb25wYXRoKydpbWFnZXMvaWNvbnMvcGxheS1pY29uLnBuZ1wiPjwvYnV0dG9uPidcclxuXHRcdFx0XHRcdFx0Ly8gKycgICAgICAgIDxidXR0b24gY2xhc3M9XCJ1ZGEtc3RvcC1idG5cIiAnKygoIWlzUGxheWluZyk/J2Rpc2FibGVkPVwiZGlzYWJsZWRcIic6J2lkPVwibmlzdC1hdXRvcGxheVwiJykrJz48aW1nIHNyYz1cIicrdGhpcy5leHRlbnNpb25wYXRoKydpbWFnZXMvaWNvbnMvc3RvcC1pY29uLnBuZ1wiPjwvYnV0dG9uPidcclxuXHRcdFx0XHRcdFx0K1x0cGxheXBhdXNlYnV0dG9uXHJcblx0XHRcdFx0XHRcdCsnICAgIDwvZGl2PidcclxuXHRcdFx0XHRcdFx0KycgICAgPGRpdiBjbGFzcz1cInVkYS1jYXJkLXJpZ2h0LWRibC1hcnJvd1wiIGlkPVwidWRhLWJhY2t0by1zZWFyY2hcIj48aW1nIHNyYz1cIicrdGhpcy5leHRlbnNpb25wYXRoKydpbWFnZXMvaWNvbnMvcmlnaHQtZHVibGUtYXJyb3cucG5nXCI+PC9kaXY+J1xyXG5cdFx0XHRcdFx0XHQrJyAgICA8aDU+JytzZXF1ZW5jZW5hbWUrJzwvaDU+J1xyXG5cdFx0XHRcdFx0XHQrKChzZXF1ZW5jZW5hbWVzKT8nXHQ8aDY+IG9yIDxiciAvPiAnK3NlcXVlbmNlbmFtZXMrJzwvaDY+JzonJylcclxuXHRcdFx0XHRcdFx0KycgICAgPGhyPidcclxuXHRcdFx0XHRcdFx0KycgICAgPHVsIGNsYXNzPVwidWRhLXN1Z2dlc3Rpb24tbGlzdFwiIGlkPVwidWRhLXNlcXVlbmNlLXN0ZXBzXCI+J1xyXG5cdFx0XHRcdFx0XHQrJyAgICA8L3VsPidcclxuXHRcdFx0XHRcdFx0Kyc8L2Rpdj4nXHJcblx0XHRcdFx0XHRcdCsnPGRpdiBjbGFzcz1cInVkYS1kZXRhaWxzLWZvb3RlclwiPidcclxuXHRcdFx0XHRcdFx0KycgICAgPGRpdiBjbGFzcz1cInVkYS1kZXRhaWxzLWZvb3Rlci1sZWZ0IHVkYS10cmFzaC1pbWdcIiBpZD1cInVkYS1kZWxldGUtc2VxdWVuY2VcIj4nXHJcblx0XHRcdFx0XHRcdCsnICAgIDwvZGl2PidcclxuXHRcdFx0XHRcdFx0KycgICAgPGRpdiBjbGFzcz1cInVkYS1kZXRhaWxzLWZvb3Rlci1yaWdodFwiPidcclxuXHRcdFx0XHRcdFx0Ly8gKycgICAgXHQ8ZGl2IGNsYXNzPVwibGlrZS1pbWctYmcgdWRhLWxpa2UtaW1nXCIgc3R5bGU9XCJib3JkZXItbGVmdDogMXB4IHNvbGlkICNkY2UwZjc7XCIgaWQ9XCJ1ZGEtdXB2b3RlXCI+J1xyXG5cdFx0XHRcdFx0XHQvLyArJyAgIFx0PC9kaXY+J1xyXG5cdFx0XHRcdFx0XHQvLyArJyAgICBcdDxkaXYgY2xhc3M9XCJkaXNsaWtlLWltZy1iZyB1ZGEtZGlzbGlrZS1pbWdcIiBpZD1cInVkYS1kb3dudm90ZVwiPidcclxuXHRcdFx0XHRcdFx0Ly8gKycgICBcdDwvZGl2PidcclxuXHRcdFx0XHRcdFx0KycgICAgPC9kaXY+J1xyXG5cdFx0XHRcdFx0XHQrJzwvZGl2Pic7XHJcblx0XHRcdHJldHVybiBodG1sO1xyXG5cdFx0fSxcclxuXHRcdC8vc2hvd2luZyB0aGUgc2VsZWN0ZWQgc2VhcmNoIHJlc3VsdCBzY3JlZW4gZnVuY3Rpb25hbGl0eVxyXG5cdFx0c2hvd3NlbGVjdGVkcm93OmZ1bmN0aW9uKGRhdGEsaW5kZXgsc2hvd25vZGVsaXN0PWZhbHNlLCBuYXZjb29raWVkYXRhPXt9KXtcclxuXHRcdFx0aWYoc2hvd25vZGVsaXN0ICYmIG5hdmNvb2tpZWRhdGEuZGF0YS51c2VyY2xpY2tub2Rlc1NldC5sZW5ndGg9PT1uYXZjb29raWVkYXRhLm5hdmlnYXRlZGRhdGEubGVuZ3RoKXtcclxuXHRcdFx0XHRuYXZjb29raWVkYXRhLm5hdmNvbXBsZXRlZD10cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBpc1BsYXlpbmcgPSAgZmFsc2U7XHJcblxyXG5cdFx0XHR0aGlzLmN1cnJlbnRQYWdlPSdTZWxlY3RlZFNlcXVlbmNlJztcclxuXHJcblx0XHRcdGlmKHNob3dub2RlbGlzdCkge1xyXG5cdFx0XHRcdGlmIChuYXZjb29raWVkYXRhLm5hdmNvbXBsZXRlZCkge1xyXG5cdFx0XHRcdFx0dGhpcy5hdXRvcGxheUNvbXBsZXRlZCA9IHRydWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmKG5hdmNvb2tpZWRhdGEuYXV0b3BsYXkpIHtcclxuXHRcdFx0XHRcdFx0aXNQbGF5aW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBlbGVtZW50PWpRdWVyeSh0aGlzLnJlbmRlclNlbGVjdGVkU2VxdWVuY2VIdG1sKGRhdGEsIGlzUGxheWluZykpO1xyXG5cdFx0XHRqUXVlcnkoXCIjdWRhLWNvbnRlbnQtY29udGFpbmVyXCIpLmh0bWwoZWxlbWVudCk7XHJcblx0XHRcdHZhciBwZXJmb3JtYWN0aW9ubm9kZT1mYWxzZTtcclxuXHRcdFx0Zm9yKHZhciBpPTA7aTxkYXRhLnVzZXJjbGlja25vZGVzU2V0Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHRcdHZhciB2aXNpdGVkID0gLTE7XHJcblx0XHRcdFx0aWYobmF2Y29va2llZGF0YS5uYXZpZ2F0ZWRkYXRhLmxlbmd0aD4wKSB7XHJcblx0XHRcdFx0XHR2aXNpdGVkID0gdGhpcy5pbkFycmF5KGRhdGEudXNlcmNsaWNrbm9kZXNTZXRbaV0uaWQsIG5hdmNvb2tpZWRhdGEubmF2aWdhdGVkZGF0YSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKG5hdmNvb2tpZWRhdGEuYXV0b3BsYXkgJiYgKCFuYXZjb29raWVkYXRhLnBhdXNlIHx8ICFuYXZjb29raWVkYXRhLnN0b3ApKXtcclxuXHRcdFx0XHRcdGlmKHZpc2l0ZWQ9PT0tMSAmJiAhcGVyZm9ybWFjdGlvbm5vZGUpe1xyXG5cdFx0XHRcdFx0XHRwZXJmb3JtYWN0aW9ubm9kZT1kYXRhLnVzZXJjbGlja25vZGVzU2V0W2ldO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRqUXVlcnkoXCIjdWRhLXNlcXVlbmNlLXN0ZXBzXCIpLmFwcGVuZCh0aGlzLnJlbmRlcnN0ZXBzKGRhdGEudXNlcmNsaWNrbm9kZXNTZXRbaV0sIHZpc2l0ZWQsIG5hdmNvb2tpZWRhdGEpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYodGhpcy5zZXNzaW9uSUQgJiYgZGF0YS51c2Vyc2Vzc2lvbmlkICYmICh0aGlzLnNlc3Npb25JRC50b1N0cmluZygpPT09ZGF0YS51c2Vyc2Vzc2lvbmlkLnRvU3RyaW5nKCkgfHwgKHRoaXMuc2Vzc2lvbmRhdGEuYXV0aGRhdGEuaGFzT3duUHJvcGVydHkoJ2lkJykgJiYgdGhpcy5zZXNzaW9uZGF0YS5hdXRoZGF0YS5pZC50b1N0cmluZygpPT09ZGF0YS51c2Vyc2Vzc2lvbmlkLnRvU3RyaW5nKCkpKSl7XHJcblx0XHRcdFx0alF1ZXJ5KFwiI3VkYS1kZWxldGUtc2VxdWVuY2VcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0VURBUGx1Z2luU0RLLmRlbGV0ZVNlcXVlbmNlKGRhdGEpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGpRdWVyeShcIiN1ZGEtZGVsZXRlLXNlcXVlbmNlXCIpLmhpZGUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0alF1ZXJ5KCcjdWRhLXVwdm90ZScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRVREFQbHVnaW5TREsuYWRkdm90ZShcInVwXCIsZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRqUXVlcnkoJyN1ZGEtZG93bnZvdGUnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VURBUGx1Z2luU0RLLmFkZHZvdGUoXCJkb3duXCIsZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0alF1ZXJ5KFwiI25pc3QtYXV0b3BsYXlcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFVEQVBsdWdpblNESy50b2dnbGVhdXRvcGxheShuYXZjb29raWVkYXRhKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBuZWVkIHRvIGltcHJvdmUgdGhlIGF1dG9wbGF5IGZ1bmN0aW9uYWxpdHkuXHJcblx0XHRcdGlmKHR5cGVvZiBwZXJmb3JtYWN0aW9ubm9kZT09XCJvYmplY3RcIiAmJiB0aGlzLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0aWYodGhpcy5wbGF5TmV4dEFjdGlvbikge1xyXG5cdFx0XHRcdFx0dGhpcy5wZXJmb3JtY2xpY2thY3Rpb24ocGVyZm9ybWFjdGlvbm5vZGUsIG5hdmNvb2tpZWRhdGEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIGlmKHRoaXMuYXV0b3BsYXkpe1xyXG5cdFx0XHRcdHRoaXMuYXV0b3BsYXlQYXVzZWQgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLnRvZ2dsZWF1dG9wbGF5KG5hdmNvb2tpZWRhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGpRdWVyeShcIiN1ZGEtYmFja3RvLXNlYXJjaFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VURBUGx1Z2luU0RLLmJhY2tUb1NlYXJjaFJlc3VsdHNQYWdlKG5hdmNvb2tpZWRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRiYWNrVG9TZWFyY2hSZXN1bHRzUGFnZTogZnVuY3Rpb24obmF2Y29va2llZGF0YSl7XHJcblx0XHRcdFVEQVBsdWdpblNESy5hdXRvcGxheSA9IGZhbHNlO1xyXG5cdFx0XHRVREFQbHVnaW5TREsuc2VhcmNoSW5Qcm9ncmVzcz1mYWxzZTtcclxuXHRcdFx0VURBUGx1Z2luU0RLLmF1dG9wbGF5UGF1c2VkPWZhbHNlO1xyXG5cdFx0XHRVREFQbHVnaW5TREsucGxheU5leHRBY3Rpb249dHJ1ZTtcclxuXHRcdFx0VURBUGx1Z2luU0RLLmJhY2t0b3NlYXJjaHJlc3VsdHMobmF2Y29va2llZGF0YSk7XHJcblx0XHRcdGxldCB0b29sdGlwbm9kZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd1ZGEtdG9vbHRpcCcpO1xyXG5cdFx0XHRpZiAodG9vbHRpcG5vZGVzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRqUXVlcnkoJy51ZGEtdG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMucG9wcGVySW5zdGFuY2UuZGVzdHJveSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0Ly9zaG93aW5nIHRoZSBzZXF1ZW5jZSBzdGVwcyBodG1sXHJcblx0XHRyZW5kZXJzdGVwczpmdW5jdGlvbihkYXRhLHZpc2l0ZWQ9ZmFsc2UsIG5hdmNvb2tpZWRhdGE9e30pe1xyXG5cdFx0XHQvLyBhZGRpbmcgZWxpcHNlcyBpZiB0ZXh0bGVuZ3RoIGlzIGdyZWF0ZXIgdGhhbiBzcGVjaWZpZWQgY2hhcmFjdGVyc1xyXG5cdFx0XHQvLyBkaXNwbGF5IHBlcnNvbmFsIHRhZyBmb3IgdGhlIHBlcnNvbmFsIG5vZGVzXHJcblx0XHRcdGxldCBjbGlja2VkbmFtZSA9ICcnO1xyXG5cdFx0XHRsZXQgbm9kZURhdGEgPSBKU09OLnBhcnNlKGRhdGEub2JqZWN0ZGF0YSk7XHJcblx0XHRcdGlmKG5vZGVEYXRhLm1ldGEuaGFzT3duUHJvcGVydHkoJ2Rpc3BsYXlUZXh0JykgJiYgbm9kZURhdGEubWV0YS5kaXNwbGF5VGV4dCAhPT0gJycpe1xyXG5cdFx0XHRcdGNsaWNrZWRuYW1lID0gKChub2RlRGF0YS5tZXRhLmRpc3BsYXlUZXh0Lmxlbmd0aCA+IHRoaXMubWF4c3RyaW5nbGVuZ3RoKSA/IG5vZGVEYXRhLm1ldGEuZGlzcGxheVRleHQuc3Vic3RyKDAsIHRoaXMubWF4c3RyaW5nbGVuZ3RoKSArICcuLi4nIDogbm9kZURhdGEubWV0YS5kaXNwbGF5VGV4dCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y2xpY2tlZG5hbWUgPSAoKGRhdGEuY2xpY2tlZG5vZGVuYW1lLmxlbmd0aCA+IHRoaXMubWF4c3RyaW5nbGVuZ3RoKSA/IGRhdGEuY2xpY2tlZG5vZGVuYW1lLnN1YnN0cigwLCB0aGlzLm1heHN0cmluZ2xlbmd0aCkgKyAnLi4uJyA6IGRhdGEuY2xpY2tlZG5vZGVuYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihub2RlRGF0YS5tZXRhLmhhc093blByb3BlcnR5KCdpc1BlcnNvbmFsJykgJiYgbm9kZURhdGEubWV0YS5pc1BlcnNvbmFsKXtcclxuXHRcdFx0XHRjbGlja2VkbmFtZT0oKGRhdGEuY2xpY2tlZG5vZGVuYW1lLmxlbmd0aD4odGhpcy5tYXhzdHJpbmdsZW5ndGgtMjYpKT9kYXRhLmNsaWNrZWRub2RlbmFtZS5zdWJzdHIoMCwodGhpcy5tYXhzdHJpbmdsZW5ndGgtMjYpKSsnLi4uIChwZXJzb25hbCknOmRhdGEuY2xpY2tlZG5vZGVuYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgY2xpY2tlZHRleHQgPSBjbGlja2VkbmFtZTtcclxuXHRcdFx0aWYodmlzaXRlZD4tMSkge1xyXG5cdFx0XHRcdHZhciB0ZW1wbGF0ZSA9IGpRdWVyeShcIjxsaSBjbGFzcz0nY29tcGxldGVkJz48aT5cIiArIGNsaWNrZWR0ZXh0ICsgXCI8L2k+PC9saT5cIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIHRlbXBsYXRlID0galF1ZXJ5KFwiPGxpIGNsYXNzPSdpbmFjdGl2ZSc+PGk+XCIgKyBjbGlja2VkdGV4dCArIFwiPC9pPjwvbGk+XCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHZpc2l0ZWQgPT09IC0xKSB7XHJcblx0XHRcdFx0dGVtcGxhdGUuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0VURBUGx1Z2luU0RLLmludm9rZWRBY3Rpb25NYW51YWxseSA9IHRydWU7XHJcblx0XHRcdFx0XHRVREFQbHVnaW5TREsucGVyZm9ybWNsaWNrYWN0aW9uKGRhdGEsbmF2Y29va2llZGF0YSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRlbXBsYXRlO1xyXG5cdFx0fSxcclxuXHRcdC8vcGVyZm9ybSBjbGljayBhY3Rpb24gb2YgdGhlIHNlcXVlbmNlIHN0ZXBzXHJcblx0XHRwZXJmb3JtY2xpY2thY3Rpb246ZnVuY3Rpb24oc2VsZWN0ZWRub2RlLG5hdmNvb2tpZWRhdGEpe1xyXG5cdFx0XHRjb25zdCBtYXRjaE5vZGVzID0gW107XHJcblx0XHRcdGxldCBvcmlnaW5hbE5vZGUgPSB7fTtcclxuXHRcdFx0aWYoc2VsZWN0ZWRub2RlLm9iamVjdGRhdGEpIHtcclxuXHRcdFx0XHRvcmlnaW5hbE5vZGUgPSBKU09OLnBhcnNlKHNlbGVjdGVkbm9kZS5vYmplY3RkYXRhKTtcclxuXHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyh7cmVjb3JkZWROb2RlOiBvcmlnaW5hbE5vZGUubm9kZX0pO1xyXG5cdFx0XHRcdGlmKHNlbGVjdGVkbm9kZSAmJiB0aGlzLmh0bWxpbmRleC5sZW5ndGg+MCl7XHJcblx0XHRcdFx0XHQvLyBwZXJzb25hbCB0YWcgY2hlY2tcclxuXHRcdFx0XHRcdGxldCBpc1BlcnNvbmFsTm9kZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0aWYob3JpZ2luYWxOb2RlLm1ldGEuaGFzT3duUHJvcGVydHkoJ2lzUGVyc29uYWwnKSAmJiBvcmlnaW5hbE5vZGUubWV0YS5pc1BlcnNvbmFsKXtcclxuXHRcdFx0XHRcdFx0aXNQZXJzb25hbE5vZGUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Zm9yKGxldCBzZWFyY2hOb2RlIG9mIHRoaXMuaHRtbGluZGV4KXtcclxuXHRcdFx0XHRcdFx0bGV0IHNlYXJjaExhYmVsRXhpc3RzID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdGxldCBjb21wYXJlTm9kZSA9IGRvbUpTT04udG9KU09OKHNlYXJjaE5vZGVbXCJlbGVtZW50LWRhdGFcIl0pO1xyXG5cdFx0XHRcdFx0XHQvLyBjb21wYXJlIHJlY29yZGVkIG5vZGUgd2l0aCBwZXJzb25hbCBub2RlIHRhZyBvciBub3RcclxuXHRcdFx0XHRcdFx0bGV0IG1hdGNoID0gdGhpcy5jb21wYXJlbm9kZXMoY29tcGFyZU5vZGUubm9kZSxvcmlnaW5hbE5vZGUubm9kZSwgaXNQZXJzb25hbE5vZGUpO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKChtYXRjaC5tYXRjaGVkKzE1KSA+PSBtYXRjaC5jb3VudCkge1xyXG5cdFx0XHRcdFx0XHRcdC8vVURBQ29uc29sZUxvZ2dlci5pbmZvKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLU1hdGNoaW5nIG5vZGUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG5cdFx0XHRcdFx0XHRcdC8vVURBQ29uc29sZUxvZ2dlci5pbmZvKG1hdGNoKTtcclxuXHRcdFx0XHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyhNYXRoLmFicygobWF0Y2gubWF0Y2hlZCkgLSBtYXRjaC5jb3VudCkpO1xyXG5cdFx0XHRcdFx0XHRcdC8vVURBQ29uc29sZUxvZ2dlci5pbmZvKG1hdGNoLmlubmVyQ2hpbGROb2RlcyAqIHRoaXMuaW5uZXJUZXh0V2VpZ2h0KTtcclxuXHRcdFx0XHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbygnTWF0Y2hlZCAnICsgbWF0Y2gubWF0Y2hlZCArICcgb3V0IG9mICcgKyBtYXRjaC5jb3VudCk7XHJcblx0XHRcdFx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oe25vZGU6IGNvbXBhcmVOb2RlLm5vZGUsIGh0bWxOb2RlOiBzZWFyY2hOb2RlW1wiZWxlbWVudC1kYXRhXCJdfSk7XHJcblx0XHRcdFx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oe3JlY29yZGVkTm9kZTogSlNPTi5wYXJzZShzZWxlY3RlZG5vZGUub2JqZWN0ZGF0YSl9KTtcclxuXHRcdFx0XHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1NYXRjaGluZyBub2RlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gd2UgYXJlIGluY3JlbWVudGluZyAnbWF0Y2hlZCcgYnkgJ2lubmVyVGV4dFdlaWdodCcgZm9yICd0aGlzJyBub2RlIGFuZCBldmVyeSBjaGlsZCBub2RlIGFuZCB3ZSBhcmUgbWF0Y2hpbmcgaW5uZXJjaGlsZGNvdW50cyB0aGF0IHdlcmUgcmV0dXJuZWQgZnJvbSBjb21wYXJlbm9kZXNcclxuXHRcdFx0XHRcdFx0aWYoY29tcGFyZU5vZGUubm9kZS5ub2RlTmFtZSA9PT0gb3JpZ2luYWxOb2RlLm5vZGUubm9kZU5hbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAobWF0Y2guaW5uZXJUZXh0RmxhZyAmJiBNYXRoLmFicygobWF0Y2gubWF0Y2hlZCkgLSBtYXRjaC5jb3VudCkgPD0gKG1hdGNoLmlubmVyQ2hpbGROb2RlcyAqIHRoaXMuaW5uZXJUZXh0V2VpZ2h0KSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0c2VhcmNoTGFiZWxFeGlzdHMgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAobWF0Y2gubWF0Y2hlZCA9PT0gbWF0Y2guY291bnQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHNlYXJjaExhYmVsRXhpc3RzID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKG9yaWdpbmFsTm9kZS5ub2RlLm5vZGVOYW1lID09PSAnQ0tFRElUT1InICYmIChtYXRjaC5tYXRjaGVkICsgMSkgPj0gbWF0Y2guY291bnQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGZpeCBmb3IgZWRpdG9yIHBsYXliYWNrXHJcblx0XHRcdFx0XHRcdFx0XHRzZWFyY2hMYWJlbEV4aXN0cyA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRpZihzZWFyY2hMYWJlbEV4aXN0cyl7XHJcblx0XHRcdFx0XHRcdFx0bGV0IG1hdGNoTm9kZUV4aXN0cyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdGlmKG1hdGNoTm9kZXMubGVuZ3RoPjApe1xyXG5cdFx0XHRcdFx0XHRcdFx0Zm9yKGxldCBqPTA7IGo8bWF0Y2hOb2Rlcy5sZW5ndGg7IGorKyl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmKG1hdGNoTm9kZXNbal0ub3JpZ2luYWxOb2RlW1wiZWxlbWVudC1kYXRhXCJdLmlzU2FtZU5vZGUoc2VhcmNoTm9kZVtcImVsZW1lbnQtZGF0YVwiXSkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1hdGNoTm9kZUV4aXN0cz10cnVlO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZihtYXRjaE5vZGVFeGlzdHM9PT1mYWxzZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0bWF0Y2hOb2Rlcy5wdXNoKHtvcmlnaW5hbE5vZGU6IHNlYXJjaE5vZGUsIGRvbUpzb246IGNvbXBhcmVOb2RlLm5vZGV9KTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKG1hdGNoTm9kZXMubGVuZ3RoID09PSAxKXtcclxuXHRcdFx0XHRpZih0aGlzLnVwZGF0ZW5hdmNvb2tpZWRhdGEobmF2Y29va2llZGF0YSxzZWxlY3RlZG5vZGUuaWQpKXtcclxuXHRcdFx0XHRcdHRoaXMubWF0Y2hhY3Rpb24obWF0Y2hOb2Rlc1swXS5vcmlnaW5hbE5vZGUsZmFsc2Usc2VsZWN0ZWRub2RlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYobWF0Y2hOb2Rlcy5sZW5ndGg+MSkge1xyXG5cdFx0XHRcdC8vdG9kbyBuZWVkIHRvIHBlcmZvcm0gc29tZSB1c2VyIGludGVydmVudGlvblxyXG5cdFx0XHRcdC8vIGZvciBtdWx0aXBsZSBtYXRjaGluZyBub2RlcyBjb21wYXJlIGxhYmVscyBvZiB0aGUgY2xpY2thYmxlIG5vZGVzIHRvIGdldCBleGFjdCBub2RlIG1hdGNoXHJcblx0XHRcdFx0bGV0IGZpbmFsTWF0Y2hOb2RlID0gbnVsbDtcclxuXHRcdFx0XHRsZXQgZmluYWxNYXRjaE5vZGVzID0gW107XHJcblxyXG5cdFx0XHRcdGlmKG1hdGNoTm9kZXMubGVuZ3RoPjEpe1xyXG5cdFx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXJlY29yZGVkIG5vZGUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcblx0XHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbygncmVjb3JkZWRub2RlIGxhYmVsOicrc2VsZWN0ZWRub2RlLmNsaWNrZWRub2RlbmFtZSwyKTtcclxuXHRcdFx0XHRcdC8vVURBQ29uc29sZUxvZ2dlci5pbmZvKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1yZWNvcmRlZCBub2RlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tbWF0Y2hlZCBub2Rlcy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcblx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8obWF0Y2hOb2RlcywyKTtcclxuXHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1tYXRjaGVkIG5vZGVzLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuXHJcblx0XHRcdFx0bWF0Y2hOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChtYXRjaE5vZGUsIG1hdGNobm9kZWluZGV4KSB7XHJcblx0XHRcdFx0XHRpZihtYXRjaE5vZGUub3JpZ2luYWxOb2RlLmhhc093blByb3BlcnR5KFwiZWxlbWVudC1kYXRhXCIpKSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGlucHV0TGFiZWxzID0gVURBUGx1Z2luU0RLLmdldGNsaWNrZWRpbnB1dGxhYmVscyhtYXRjaE5vZGUub3JpZ2luYWxOb2RlW1wiZWxlbWVudC1kYXRhXCJdKTtcclxuXHRcdFx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1pbnB1dCBsYWJlbHMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuXHRcdFx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8obWF0Y2hOb2RlLDIpO1xyXG5cdFx0XHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyhpbnB1dExhYmVscywgMik7XHJcblx0XHRcdFx0XHRcdC8vVURBQ29uc29sZUxvZ2dlci5pbmZvKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0taW5wdXQgbGFiZWxzLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcblx0XHRcdFx0XHRcdGlmIChpbnB1dExhYmVscyA9PT0gc2VsZWN0ZWRub2RlLmNsaWNrZWRub2RlbmFtZSkge1xyXG5cdFx0XHRcdFx0XHRcdGZpbmFsTWF0Y2hOb2Rlcy5wdXNoKG1hdGNoTm9kZSk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZihtYXRjaE5vZGUub3JpZ2luYWxOb2RlW1wiZWxlbWVudC1kYXRhXCJdLmNsYXNzTGlzdCAmJiBtYXRjaE5vZGUub3JpZ2luYWxOb2RlW1wiZWxlbWVudC1kYXRhXCJdLmNsYXNzTGlzdC5jb250YWlucygnZXhwYW5kLWJ1dHRvbicpKXtcclxuXHRcdFx0XHRcdFx0XHQvLyBjb2xsYXBzYWJsZSBidXR0b25zIGFyZSB0cmVhdGVkIGFzIG1hdGNoZWQgbm9kZXMgdG8gY2hlY2sgZGlzdGFuY2UgZm9yIGZ1cnRoZXIgcHJvY2Vzc2luZ1xyXG5cdFx0XHRcdFx0XHRcdGZpbmFsTWF0Y2hOb2Rlcy5wdXNoKG1hdGNoTm9kZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0aWYoZmluYWxNYXRjaE5vZGVzLmxlbmd0aD09PTAgJiYgbWF0Y2hOb2Rlcy5sZW5ndGg+PTEpe1xyXG5cdFx0XHRcdFx0ZmluYWxNYXRjaE5vZGVzID0gbWF0Y2hOb2RlcztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIHByb2Nlc3MgbWF0Y2hpbmcgbm9kZXMgYWZ0ZXIgY29tcGFyaW5nIGxhYmVsc1xyXG5cdFx0XHRcdGlmIChmaW5hbE1hdGNoTm9kZXMubGVuZ3RoID09PSAxKSB7XHJcblx0XHRcdFx0XHRmaW5hbE1hdGNoTm9kZSA9IGZpbmFsTWF0Y2hOb2Rlc1swXS5vcmlnaW5hbE5vZGU7XHJcblx0XHRcdFx0fSBlbHNlIGlmKGZpbmFsTWF0Y2hOb2Rlcy5sZW5ndGggPiAxKSB7XHJcblx0XHRcdFx0XHQvLyBjb21wYXJlIGVsZW1lbnQgcG9zaXRpb25zIGFzIHRoZXJlIGFyZSBtdWx0aXBsZSBtYXRjaGluZyBub2RlcyB3aXRoIHNhbWUgbGFiZWxzXHJcblx0XHRcdFx0XHRpZihmaW5hbE1hdGNoTm9kZXMubGVuZ3RoPjEpIHtcclxuXHRcdFx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLU11bHRpcGxlIG5vZGVzIGZvdW5kIGNvbXBhcmluZyBuZWFybm9kZS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuXHRcdFx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oe3JlY29yZGVkTm9kZTogb3JpZ2luYWxOb2RlLm5vZGV9KTtcclxuXHRcdFx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oZmluYWxNYXRjaE5vZGVzKTtcclxuXHRcdFx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLU11bHRpcGxlIG5vZGVzIGZvdW5kIGNvbXBhcmluZyBuZWFybm9kZS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGZpbmFsTWF0Y2hOb2RlID0gdGhpcy5wcm9jZXNzRGlzdGFuY2VPZk5vZGVzKGZpbmFsTWF0Y2hOb2Rlcywgb3JpZ2luYWxOb2RlLm5vZGUpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoZmluYWxNYXRjaE5vZGUgJiYgZmluYWxNYXRjaE5vZGUuaGFzT3duUHJvcGVydHkoXCJlbGVtZW50LWRhdGFcIikpIHtcclxuXHRcdFx0XHRcdC8vVURBQ29uc29sZUxvZ2dlci5pbmZvKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1GaW5hbCBtYXRjaGVkIG5vZGUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcblx0XHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyh7ZmluYWxNYXRjaE5vZGU6IGZpbmFsTWF0Y2hOb2RlfSk7XHJcblx0XHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tRmluYWwgbWF0Y2hlZCBub2RlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG5cclxuXHRcdFx0XHRcdGlmKHRoaXMudXBkYXRlbmF2Y29va2llZGF0YShuYXZjb29raWVkYXRhLHNlbGVjdGVkbm9kZS5pZCkpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5tYXRjaGFjdGlvbihmaW5hbE1hdGNoTm9kZSwgZmFsc2UsIHNlbGVjdGVkbm9kZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vVURBQ29uc29sZUxvZ2dlci5pbmZvKCdVbmFibGUgdG8gZmluZCBmaW5hbCBtYXRjaG5vZGUgd2l0aCBkaXN0YW5jZSBjYWxjdWxhdGlvbicpO1xyXG5cdFx0XHRcdFx0VURBRXJyb3JMb2dnZXIuZXJyb3IoJ1VuYWJsZSB0byBmaW5kIGZpbmFsIG1hdGNobm9kZSB3aXRoIGRpc3RhbmNlIGNhbGN1bGF0aW9uIGZvciAnK29yaWdpbmFsTm9kZS5ub2RlLm5vZGVOYW1lKycgUmVjb3JkZWQgaWQgaXM6ICcrc2VsZWN0ZWRub2RlLmlkKTtcclxuXHRcdFx0XHRcdGFsZXJ0KFwiTmlzdGFwcCBVREEgcmFuIGludG8gYSBwcm9ibGVtIGFuZCB3aWxsIGV4aXRcIik7XHJcblx0XHRcdFx0XHRpZihuYXZjb29raWVkYXRhICYmIG5hdmNvb2tpZWRhdGEuYXV0b3BsYXkpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5hdXRvcGxheSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmF1dG9wbGF5UGF1c2VkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0dGhpcy50b2dnbGVhdXRvcGxheShuYXZjb29raWVkYXRhKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFsZXJ0KFwiTmlzdGFwcCBVREEgcmFuIGludG8gYSBwcm9ibGVtIGFuZCB3aWxsIGV4aXRcIik7XHJcblx0XHRcdFx0aWYobmF2Y29va2llZGF0YSAmJiBuYXZjb29raWVkYXRhLmF1dG9wbGF5KSB7XHJcblx0XHRcdFx0XHR0aGlzLmF1dG9wbGF5ID0gZmFsc2U7XHJcblx0XHRcdFx0XHR0aGlzLmF1dG9wbGF5UGF1c2VkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlYXV0b3BsYXkobmF2Y29va2llZGF0YSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0Ly9jb21wYXJpbmcgbm9kZXMgb2YgaW5kZXhlZCBhbmQgdGhlIHNlcXVlbmNlIHN0ZXAgc2VsZWN0ZWRcclxuXHRcdGNvbXBhcmVub2RlczpmdW5jdGlvbihjb21wYXJlbm9kZSwgb3JpZ2luYWxub2RlLCBpc1BlcnNvbmFsTm9kZT1mYWxzZSwgbWF0Y2g9e2NvdW50OjAsIG1hdGNoZWQ6MCwgdW5tYXRjaGVkOltdLCBpbm5lclRleHRGbGFnOiBmYWxzZSwgaW5uZXJDaGlsZE5vZGVzOiAwfSl7XHJcblx0XHRcdC8vIHN1bSB0aGUgY2hpbGRub2Rlc1xyXG5cdFx0XHRpZihjb21wYXJlbm9kZS5oYXNPd25Qcm9wZXJ0eSgnY2hpbGROb2RlcycpKSB7XHJcblx0XHRcdFx0bWF0Y2guaW5uZXJDaGlsZE5vZGVzID0gbWF0Y2guaW5uZXJDaGlsZE5vZGVzICsgY29tcGFyZW5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yKGxldCBrZXkgaW4gb3JpZ2luYWxub2RlKXtcclxuXHRcdFx0XHRpZih0aGlzLmlnbm9yZWF0dHJpYnV0ZXMuaW5kZXhPZihrZXkpIT09LTEpe1xyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0fSBlbHNlIGlmKGtleS5pbmRleE9mKCdfbmdjb250ZW50JykgIT09IC0xIHx8IGtleS5pbmRleE9mKCdqUXVlcnknKSAhPT0gLTEgfHwga2V5LmluZGV4T2YoJ19fem9uZV9zeW1ib2xfXycpICE9PSAtMSl7XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bWF0Y2guY291bnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoY29tcGFyZW5vZGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAodHlwZW9mIG9yaWdpbmFsbm9kZVtrZXldID09PSAnb2JqZWN0JykgJiYgKHR5cGVvZiBjb21wYXJlbm9kZVtrZXldID09PSAnb2JqZWN0Jykpe1xyXG5cdFx0XHRcdFx0bWF0Y2gubWF0Y2hlZCsrO1xyXG5cdFx0XHRcdFx0bWF0Y2g9dGhpcy5jb21wYXJlbm9kZXMoY29tcGFyZW5vZGVba2V5XSwgb3JpZ2luYWxub2RlW2tleV0sIGlzUGVyc29uYWxOb2RlLCBtYXRjaCk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKGNvbXBhcmVub2RlLmhhc093blByb3BlcnR5KGtleSkgJiYgQXJyYXkuaXNBcnJheShvcmlnaW5hbG5vZGVba2V5XSkgJiYgb3JpZ2luYWxub2RlW2tleV0ubGVuZ3RoPjAgJiYgQXJyYXkuaXNBcnJheShjb21wYXJlbm9kZVtrZXldKSAmJiBjb21wYXJlbm9kZVtrZXldLmxlbmd0aD4wKXtcclxuXHRcdFx0XHRcdG1hdGNoLm1hdGNoZWQrKztcclxuXHRcdFx0XHRcdGlmKGNvbXBhcmVub2RlW2tleV0ubGVuZ3RoPT09b3JpZ2luYWxub2RlW2tleV0ubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdG1hdGNoLm1hdGNoZWQrKztcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBvcmlnaW5hbG5vZGVba2V5XS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdG1hdGNoPXRoaXMuY29tcGFyZW5vZGVzKGNvbXBhcmVub2RlW2tleV1baV0sIG9yaWdpbmFsbm9kZVtrZXldW2ldLCBpc1BlcnNvbmFsTm9kZSwgbWF0Y2gpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmKChrZXkgPT09ICdjbGFzcycgfHwga2V5ID09PSAnY2xhc3NOYW1lJykgJiYgb3JpZ2luYWxub2RlLmhhc093blByb3BlcnR5KGtleSkgJiYgY29tcGFyZW5vZGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG5cdFx0XHRcdFx0Ly8gZml4IGZvciBjYWxlbmRhciBpc3N1ZVxyXG5cdFx0XHRcdFx0Y29tcGFyZW5vZGVba2V5XSA9IGNvbXBhcmVub2RlW2tleV0ucmVwbGFjZSgnIG5nLXN0YXItaW5zZXJ0ZWQnLCcnKTtcclxuXHRcdFx0XHRcdG9yaWdpbmFsbm9kZVtrZXldID0gb3JpZ2luYWxub2RlW2tleV0ucmVwbGFjZSgnIG5nLXN0YXItaW5zZXJ0ZWQnLCcnKTtcclxuXHRcdFx0XHRcdGlmIChjb21wYXJlbm9kZVtrZXldPT09b3JpZ2luYWxub2RlW2tleV0pIHtcclxuXHRcdFx0XHRcdFx0bWF0Y2gubWF0Y2hlZCsrO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly8gamFybyB3cmlua2VyIGNvbXBhcmlzaW9uIGZvciBjbGFzc25hbWVcclxuXHRcdFx0XHRcdFx0bGV0IHdlaWdodCA9IHRoaXMuSmFyb1dyaW5rZXIob3JpZ2luYWxub2RlW2tleV0sIGNvbXBhcmVub2RlW2tleV0pO1xyXG5cdFx0XHRcdFx0XHRpZih3ZWlnaHQgPiAwLjkwKSB7XHJcblx0XHRcdFx0XHRcdFx0bWF0Y2gubWF0Y2hlZCsrO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdG1hdGNoLnVubWF0Y2hlZC5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRcdGtleToga2V5LFxyXG5cdFx0XHRcdFx0XHRcdFx0Y29tcGFyZU5vZGVWYWx1ZXM6IGNvbXBhcmVub2RlW2tleV0sXHJcblx0XHRcdFx0XHRcdFx0XHRyZWNvcmRlZE5vZGVWYWx1ZXM6IG9yaWdpbmFsbm9kZVtrZXldXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2UgaWYoa2V5ID09PSAnaW5uZXJUZXh0JyAmJiBvcmlnaW5hbG5vZGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBjb21wYXJlbm9kZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIChjb21wYXJlbm9kZVtrZXldLnRyaW0oKSA9PT0gb3JpZ2luYWxub2RlW2tleV0udHJpbSgpKSkge1xyXG5cdFx0XHRcdFx0Ly8gbWF0Y2hpbmcgaW5uZXIgdGV4dCBzaG91bGQgYmUgd2VpZ2h0ZWQgbW9yZS4gV2Ugd2lsbCBhZGQgYW4gYXJiaXRyYXJpbHkgbGFyZ2UgbnVtYmVyIC0gaW5uZXJUZXh0V2VpZ2h0LlxyXG5cdFx0XHRcdFx0Ly8gc2luY2UgdGhpcyB3aWxsIG1hdGNoIGZvciBldmVyeSBjaGlsZCBub2RlLCB3ZSBuZWVkIHRvIGFjY29tbW9kYXRlIHRoaXMgbG9naWMgd2hlbmV2ZXIgJ2NvbXBhcmVub2RlcycgaXMgY2FsbGVkXHJcblx0XHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyhjb21wYXJlbm9kZVtrZXldLnRyaW0oKSk7XHJcblx0XHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyhvcmlnaW5hbG5vZGVba2V5XS50cmltKCkpO1xyXG5cdFx0XHRcdFx0bWF0Y2guaW5uZXJUZXh0RmxhZyA9IHRydWU7XHJcblx0XHRcdFx0XHRtYXRjaC5tYXRjaGVkID0gbWF0Y2gubWF0Y2hlZCArIHRoaXMuaW5uZXJUZXh0V2VpZ2h0O1xyXG5cdFx0XHRcdFx0Ly8gbWF0Y2gubWF0Y2hlZCsrO1xyXG5cdFx0XHRcdH0gZWxzZSBpZihjb21wYXJlbm9kZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGNvbXBhcmVub2RlW2tleV09PT1vcmlnaW5hbG5vZGVba2V5XSl7XHJcblx0XHRcdFx0XHRtYXRjaC5tYXRjaGVkKys7XHJcblx0XHRcdFx0fSBlbHNlIGlmKGNvbXBhcmVub2RlLmhhc093blByb3BlcnR5KGtleSkgJiYgY29tcGFyZW5vZGVba2V5XSE9PW9yaWdpbmFsbm9kZVtrZXldICYmIGtleT09PSdocmVmJyAmJiBvcmlnaW5hbG5vZGVba2V5XS5pbmRleE9mKGNvbXBhcmVub2RlW2tleV0pIT09LTEpe1xyXG5cdFx0XHRcdFx0bWF0Y2gubWF0Y2hlZCsrO1xyXG5cdFx0XHRcdH0gZWxzZSBpZihjb21wYXJlbm9kZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIChrZXkgPT09ICdpZCcgfHwga2V5ID09PSAnbmFtZScpICYmIGNvbXBhcmVub2RlW2tleV0hPT1vcmlnaW5hbG5vZGVba2V5XSl7XHJcblx0XHRcdFx0XHRsZXQgd2VpZ2h0ID0gdGhpcy5KYXJvV3JpbmtlcihvcmlnaW5hbG5vZGVba2V5XSwgY29tcGFyZW5vZGVba2V5XSk7XHJcblx0XHRcdFx0XHRpZih3ZWlnaHQ+MC45MCkge1xyXG5cdFx0XHRcdFx0XHRtYXRjaC5tYXRjaGVkKys7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIG1hdGNoaW5nIHBlcnNvbmFsIG5vZGUga2V5IHZhbHVlIHBhaXJzIGZvciBwZXJzb25hbCB0YWcgdHJ1ZVxyXG5cdFx0XHRcdGVsc2UgaWYgKGlzUGVyc29uYWxOb2RlICYmIHRoaXMucGVyc29uYWxOb2RlSWdub3JlQXR0cmlidXRlcy5pbmRleE9mKGtleSkhPT0tMSkge1xyXG5cdFx0XHRcdFx0Ly8gbWFrZSBpbm5lciB0ZXh0IGZsYWcgdG8gdHJ1ZSBpZiBwZXJzb25hbCB0YWcgaXMgdHJ1ZVxyXG5cdFx0XHRcdFx0aWYoa2V5PT09J2lubmVyVGV4dCcpe1xyXG5cdFx0XHRcdFx0XHRtYXRjaC5pbm5lclRleHRGbGFnID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0bWF0Y2gubWF0Y2hlZCA9IG1hdGNoLm1hdGNoZWQgKyB0aGlzLmlubmVyVGV4dFdlaWdodDtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdG1hdGNoLm1hdGNoZWQrKztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bWF0Y2gudW5tYXRjaGVkLnB1c2goe2tleToga2V5LCBjb21wYXJlTm9kZVZhbHVlczogY29tcGFyZW5vZGVba2V5XSwgcmVjb3JkZWROb2RlVmFsdWVzOiBvcmlnaW5hbG5vZGVba2V5XX0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbWF0Y2g7XHJcblx0XHR9LFxyXG5cdFx0SmFyb1dyaW5rZXI6IGZ1bmN0aW9uIChzMSwgczIpIHtcclxuXHRcdFx0dmFyIG0gPSAwO1xyXG5cclxuXHRcdFx0Ly8gRXhpdCBlYXJseSBpZiBlaXRoZXIgYXJlIGVtcHR5LlxyXG5cdFx0XHRpZiAoIHMxLmxlbmd0aCA9PT0gMCB8fCBzMi5sZW5ndGggPT09IDAgKSB7XHJcblx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIEV4aXQgZWFybHkgaWYgdGhleSdyZSBhbiBleGFjdCBtYXRjaC5cclxuXHRcdFx0aWYgKCBzMSA9PT0gczIgKSB7XHJcblx0XHRcdFx0cmV0dXJuIDE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciByYW5nZSAgICAgPSAoTWF0aC5mbG9vcihNYXRoLm1heChzMS5sZW5ndGgsIHMyLmxlbmd0aCkgLyAyKSkgLSAxLFxyXG5cdFx0XHRcdHMxTWF0Y2hlcyA9IG5ldyBBcnJheShzMS5sZW5ndGgpLFxyXG5cdFx0XHRcdHMyTWF0Y2hlcyA9IG5ldyBBcnJheShzMi5sZW5ndGgpO1xyXG5cclxuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCBzMS5sZW5ndGg7IGkrKyApIHtcclxuXHRcdFx0XHR2YXIgbG93ICA9IChpID49IHJhbmdlKSA/IGkgLSByYW5nZSA6IDAsXHJcblx0XHRcdFx0XHRoaWdoID0gKGkgKyByYW5nZSA8PSBzMi5sZW5ndGgpID8gKGkgKyByYW5nZSkgOiAoczIubGVuZ3RoIC0gMSk7XHJcblxyXG5cdFx0XHRcdGZvciAoIGogPSBsb3c7IGogPD0gaGlnaDsgaisrICkge1xyXG5cdFx0XHRcdFx0aWYgKCBzMU1hdGNoZXNbaV0gIT09IHRydWUgJiYgczJNYXRjaGVzW2pdICE9PSB0cnVlICYmIHMxW2ldID09PSBzMltqXSApIHtcclxuXHRcdFx0XHRcdFx0KyttO1xyXG5cdFx0XHRcdFx0XHRzMU1hdGNoZXNbaV0gPSBzMk1hdGNoZXNbal0gPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIEV4aXQgZWFybHkgaWYgbm8gbWF0Y2hlcyB3ZXJlIGZvdW5kLlxyXG5cdFx0XHRpZiAoIG0gPT09IDAgKSB7XHJcblx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIENvdW50IHRoZSB0cmFuc3Bvc2l0aW9ucy5cclxuXHRcdFx0dmFyIGsgPSBuX3RyYW5zID0gMDtcclxuXHJcblx0XHRcdGZvciAoIGkgPSAwOyBpIDwgczEubGVuZ3RoOyBpKysgKSB7XHJcblx0XHRcdFx0aWYgKCBzMU1hdGNoZXNbaV0gPT09IHRydWUgKSB7XHJcblx0XHRcdFx0XHRmb3IgKCBqID0gazsgaiA8IHMyLmxlbmd0aDsgaisrICkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIHMyTWF0Y2hlc1tqXSA9PT0gdHJ1ZSApIHtcclxuXHRcdFx0XHRcdFx0XHRrID0gaiArIDE7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoIHMxW2ldICE9PSBzMltqXSApIHtcclxuXHRcdFx0XHRcdFx0KytuX3RyYW5zO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHdlaWdodCA9IChtIC8gczEubGVuZ3RoICsgbSAvIHMyLmxlbmd0aCArIChtIC0gKG5fdHJhbnMgLyAyKSkgLyBtKSAvIDMsXHJcblx0XHRcdFx0bCAgICAgID0gMCxcclxuXHRcdFx0XHRwICAgICAgPSAwLjE7XHJcblxyXG5cdFx0XHRpZiAoIHdlaWdodCA+IDAuNyApIHtcclxuXHRcdFx0XHR3aGlsZSAoIHMxW2xdID09PSBzMltsXSAmJiBsIDwgNCApIHtcclxuXHRcdFx0XHRcdCsrbDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHdlaWdodCA9IHdlaWdodCArIGwgKiBwICogKDEgLSB3ZWlnaHQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gd2VpZ2h0O1xyXG5cdFx0fSxcclxuXHRcdC8vIGdldHRpbmcgZGlzdGFuY2UgYmV0d2VlbiByZWNvcmRlZCBub2RlIGFuZCBtYXRjaGluZyBub2RlcyBvZiBzYW1lIGxhYmVsc1xyXG5cdFx0cHJvY2Vzc0Rpc3RhbmNlT2ZOb2RlczogZnVuY3Rpb24obWF0Y2hpbmdub2Rlcywgc2VsZWN0ZWROb2RlKSB7XHJcblx0XHRcdGlmIChzZWxlY3RlZE5vZGUuaGFzT3duUHJvcGVydHkoJ25vZGVJbmZvJykgJiYgbWF0Y2hpbmdub2Rlcy5sZW5ndGg+MSkge1xyXG5cdFx0XHRcdGxldCBsZWFzdERpc3RhbmNlTm9kZSA9IG51bGw7XHJcblx0XHRcdFx0bGV0IGxlYXN0RGlzdGFuY2UgPSAtMTtcclxuXHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbygnLS0tLS0tLS0tLS0tIHByb2Nlc3NpbmcgZGlzdGFuY2UgLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcblx0XHRcdFx0bWF0Y2hpbmdub2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAobm9kZS5vcmlnaW5hbE5vZGVbJ2VsZW1lbnQtZGF0YSddLmhhc0F0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpXHJcblx0XHRcdFx0XHRcdCYmIG5vZGUub3JpZ2luYWxOb2RlWydlbGVtZW50LWRhdGEnXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKS50b0xvd2VyQ2FzZSgpID09PSAnb3BlbiBjYWxlbmRhcicpIHtcclxuXHRcdFx0XHRcdFx0Ly8gbGV0IGRpc3QgPSB0aGlzLmdldERpc3RhbmNlKHNlbGVjdGVkTm9kZS5ub2RlUG9zaXRpb24sIG5vZGUub3JpZ2luYWxOb2RlWydlbGVtZW50LWRhdGEnXS51ZGFfY3VzdG9tLmRvbUpzb24ubm9kZS5ub2RlUG9zaXRpb24pO1xyXG5cdFx0XHRcdFx0XHRsZXQgZG9tSnNvbkRhdGEgPSBkb21KU09OLnRvSlNPTihub2RlLm9yaWdpbmFsTm9kZVsnZWxlbWVudC1kYXRhJ10pO1xyXG5cdFx0XHRcdFx0XHRsZXQgZGlzdCA9IHRoaXMuZ2V0RGlzdGFuY2Uoc2VsZWN0ZWROb2RlLm5vZGVJbmZvLCBkb21Kc29uRGF0YS5ub2RlLm5vZGVJbmZvKTtcclxuXHRcdFx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oc2VsZWN0ZWROb2RlLm5vZGVJbmZvKTtcclxuXHRcdFx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8obm9kZS5vcmlnaW5hbE5vZGVbJ2VsZW1lbnQtZGF0YSddLnVkYV9jdXN0b20uZG9tSnNvbi5ub2RlLm5vZGVJbmZvKTtcclxuXHRcdFx0XHRcdFx0Ly9VREFDb25zb2xlTG9nZ2VyLmluZm8oZG9tSnNvbkRhdGEubm9kZS5ub2RlSW5mbyk7XHJcblx0XHRcdFx0XHRcdC8vVURBQ29uc29sZUxvZ2dlci5pbmZvKGRpc3QpO1xyXG5cdFx0XHRcdFx0XHQvLyBkZWZhdWx0IGFkZGluZyBmaXJzdCBlbGVtZW50IGFzIGxlYXN0IGRpc3RhbmNlIGFuZCB0aGVuIGNvbXBhcmluZyB3aXRoIGxhc3QgZGlzdGFuY2UgY2FsY3VsYXRlZFxyXG5cdFx0XHRcdFx0XHRpZihsZWFzdERpc3RhbmNlID09PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRcdGxlYXN0RGlzdGFuY2UgPSBkaXN0O1xyXG5cdFx0XHRcdFx0XHRcdGxlYXN0RGlzdGFuY2VOb2RlID0gbm9kZS5vcmlnaW5hbE5vZGU7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZGlzdCA8IGxlYXN0RGlzdGFuY2UpIHtcclxuXHRcdFx0XHRcdFx0XHRsZWFzdERpc3RhbmNlID0gZGlzdDtcclxuXHRcdFx0XHRcdFx0XHRsZWFzdERpc3RhbmNlTm9kZSA9IG5vZGUub3JpZ2luYWxOb2RlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKG5vZGUuZG9tSnNvbi5oYXNPd25Qcm9wZXJ0eSgnbm9kZUluZm8nKSkge1xyXG5cdFx0XHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbygnLS0tLS0tLS0tLS0tLS0tLURpc3RhbmNlIGJldHdlZW4gbm9kZXMtLS0tLS0tLS0tLS0tLScpO1xyXG5cdFx0XHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyhzZWxlY3RlZE5vZGUubm9kZUluZm8pO1xyXG5cdFx0XHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbyhub2RlLmRvbUpzb24ubm9kZUluZm8pO1xyXG5cdFx0XHRcdFx0XHQvL1VEQUNvbnNvbGVMb2dnZXIuaW5mbygnLS0tLS0tLS0tLS0tLS0tLURpc3RhbmNlIGJldHdlZW4gbm9kZXMtLS0tLS0tLS0tLS0tLScpO1xyXG5cdFx0XHRcdFx0XHRsZXQgZGlzdCA9IHRoaXMuZ2V0RGlzdGFuY2Uoc2VsZWN0ZWROb2RlLm5vZGVJbmZvLCBub2RlLmRvbUpzb24ubm9kZUluZm8pO1xyXG5cdFx0XHRcdFx0XHQvLyBkZWZhdWx0IGFkZGluZyBmaXJzdCBlbGVtZW50IGFzIGxlYXN0IGRpc3RhbmNlIGFuZCB0aGVuIGNvbXBhcmluZyB3aXRoIGxhc3QgZGlzdGFuY2UgY2FsY3VsYXRlZFxyXG5cdFx0XHRcdFx0XHRpZihsZWFzdERpc3RhbmNlID09PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRcdGxlYXN0RGlzdGFuY2UgPSBkaXN0O1xyXG5cdFx0XHRcdFx0XHRcdGxlYXN0RGlzdGFuY2VOb2RlID0gbm9kZS5vcmlnaW5hbE5vZGU7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZGlzdCA8IGxlYXN0RGlzdGFuY2UpIHtcclxuXHRcdFx0XHRcdFx0XHRsZWFzdERpc3RhbmNlID0gZGlzdDtcclxuXHRcdFx0XHRcdFx0XHRsZWFzdERpc3RhbmNlTm9kZSA9IG5vZGUub3JpZ2luYWxOb2RlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuIGxlYXN0RGlzdGFuY2VOb2RlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdC8qKlxyXG5cdFx0ICogY2FsY3VsYXRlIGRpc3RhbmNlIGJldHdlZW4gc2VsZWN0ZWQgbm9kZSBhbmQgbWF0Y2hpbmcgbm9kZVxyXG5cdFx0ICogQHBhcmFtMTogcmVjb3JkZWQgbm9kZVxyXG5cdFx0ICogQHBhcmFtMjogY29tcGFyaW5nIG5vZGVcclxuIFx0XHQgKi9cclxuXHRcdGdldERpc3RhbmNlOiBmdW5jdGlvbiAobm9kZTEsIG5vZGUyKSB7XHJcblx0XHRcdGxldCBkaXN0O1xyXG5cdFx0XHRpZihub2RlMS5oYXNPd25Qcm9wZXJ0eSgnc2NyZWVuJykgJiYgbm9kZTIuaGFzT3duUHJvcGVydHkoJ3NjcmVlbicpKSB7XHJcblx0XHRcdFx0aWYgKG5vZGUxLnNjcmVlbi53aWR0aCA+PSBub2RlMi5zY3JlZW4ud2lkdGgpIHtcclxuXHRcdFx0XHRcdGNvbnN0IHggPSBub2RlMS5ub2RlUGFnZVBvc2l0aW9uLmxlZnQgLSAobm9kZTIubm9kZVBhZ2VQb3NpdGlvbi5sZWZ0ICogKG5vZGUyLnNjcmVlbi53aWR0aCAvIG5vZGUxLnNjcmVlbi53aWR0aCkpXHJcblx0XHRcdFx0XHRjb25zdCB5ID0gbm9kZTEubm9kZVBhZ2VQb3NpdGlvbi50b3AgLSAobm9kZTIubm9kZVBhZ2VQb3NpdGlvbi50b3AgKiAobm9kZTIuc2NyZWVuLmhlaWdodCAvIG5vZGUxLnNjcmVlbi5oZWlnaHQpKVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBjb25zdCB4ID0gbm9kZTEubm9kZVBvc2l0aW9uLnggLSBub2RlMi5ub2RlUG9zaXRpb24ueDtcclxuXHRcdFx0XHRcdC8vIGNvbnN0IHkgPSBub2RlMS5ub2RlUG9zaXRpb24ueSAtIG5vZGUyLm5vZGVQb3NpdGlvbi55O1xyXG5cdFx0XHRcdFx0Y29uc3QgeCA9IG5vZGUxLm5vZGVQYWdlUG9zaXRpb24ubGVmdCAtIG5vZGUyLm5vZGVQYWdlUG9zaXRpb24ubGVmdDtcclxuXHRcdFx0XHRcdGNvbnN0IHkgPSBub2RlMS5ub2RlUGFnZVBvc2l0aW9uLnRvcCAtIG5vZGUyLm5vZGVQYWdlUG9zaXRpb24udG9wO1xyXG5cdFx0XHRcdFx0ZGlzdCA9IE1hdGguYWJzKE1hdGguc3FydChNYXRoLnBvdyh4LCAyKSArIE1hdGgucG93KHksIDIpKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbnN0IHggPSBub2RlMS5ub2RlUG9zaXRpb24ueCAtIG5vZGUyLm5vZGVQb3NpdGlvbi54O1xyXG5cdFx0XHRcdGNvbnN0IHkgPSBub2RlMS5ub2RlUG9zaXRpb24ueSAtIG5vZGUyLm5vZGVQb3NpdGlvbi55O1xyXG5cdFx0XHRcdGRpc3QgPSBNYXRoLmFicyhNYXRoLnNxcnQoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBkaXN0O1xyXG5cdFx0fSxcclxuXHRcdC8vYWRkaW5nIGRhdGEgdG8gdGhlIHN0b3JhZ2VcclxuXHRcdGNyZWF0ZXN0b3JhZ2VkYXRhOmZ1bmN0aW9uKGtleSx2YWx1ZSl7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0d2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0Ly9nZXR0aW5nIHRoZSBkYXRhIGZyb20gdGhlIHN0b3JhZ2VcclxuXHRcdGdldHN0b3JhZ2VkYXRhOmZ1bmN0aW9uKGtleSl7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dmFyIHJlc3VsdD13aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0Ly9kZWxldGUgc2VxdWVuY2UgbGlzdCBmdW5jdGlvbmFsaXR5IGZvciB0aGUgb3duZXJcclxuXHRcdGRlbGV0ZVNlcXVlbmNlOmZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRsZXQgc2VxdWVuY2VuYW1lID0gJyc7XHJcblx0XHRcdHRyeXtcclxuXHRcdFx0XHRsZXQgc2VxdWVuY2VuYW1lc0FycmF5ID0gSlNPTi5wYXJzZShkYXRhLm5hbWUpXHJcblx0XHRcdFx0c2VxdWVuY2VuYW1lID0gc2VxdWVuY2VuYW1lc0FycmF5WzBdO1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0c2VxdWVuY2VuYW1lID0gZGF0YS5uYW1lLnRvU3RyaW5nKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIGNvbmZpcm1kaWFsb2c9Y29uZmlybShcIkFyZSB5b3Ugc3VyZSB3YW50IHRvIGRlbGV0ZSBcIitzZXF1ZW5jZW5hbWUpO1xyXG5cdFx0XHRpZihjb25maXJtZGlhbG9nID09PSB0cnVlKXtcclxuXHRcdFx0XHRVREFQbHVnaW5TREsuY29uZmlybWRlbGV0ZShkYXRhKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdC8vY29uZmlybWF0aW9uIGZvciB0aGUgZGVsZXRpb24gb2YgdGhlIHNlcXVlbmNlIGxpc3RcclxuXHRcdGNvbmZpcm1kZWxldGU6ZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0Ly8gdmFyIHNlbmRkYXRhPUpTT04uc3RyaW5naWZ5KHt1c2Vyc2Vzc2lvbmlkOnRoaXMuVURBU2Vzc2lvbklELGlkOmRhdGEuaWR9KTtcclxuXHRcdFx0dmFyIHNlbmRkYXRhPUpTT04uc3RyaW5naWZ5KHt1c2Vyc2Vzc2lvbmlkOnRoaXMuc2Vzc2lvbmRhdGEuYXV0aGRhdGEuaWQsaWQ6ZGF0YS5pZH0pO1xyXG5cdFx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdHhoci5vcGVuKFwiUE9TVFwiLCBVREFfQVBJX1VSTCArIFwiL2NsaWNrZXZlbnRzL3NlcXVlbmNlL2RlbGV0ZVwiLCBmYWxzZSk7XHJcblx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOCcpO1xyXG5cdFx0XHR4aHIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0XHRcdGlmKHhoci5zdGF0dXMgPT09IDIwMCl7XHJcblx0XHRcdFx0XHRVREFQbHVnaW5TREsuc2VhcmNoaW5lbGFzdGljKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHR4aHIuc2VuZChzZW5kZGF0YSk7XHJcblx0XHR9LFxyXG5cdFx0Ly9hZGRpbmcgdm90ZSBmdW5jdGlvbmFsaXR5XHJcblx0XHRhZGR2b3RlOmZ1bmN0aW9uKHZvdGV0eXBlLGRhdGEpe1xyXG5cdFx0XHR2YXIgc2VuZGRhdGE9e1widXNlcnNlc3Npb25pZFwiOiB0aGlzLnNlc3Npb25JRCwgXCJzZXF1ZW5jZWlkXCIgOiBkYXRhLmlkLCBcInVwdm90ZVwiOjAsIFwiZG93bnZvdGVcIjowfTtcclxuXHRcdFx0aWYodm90ZXR5cGU9PT1cInVwXCIpe1xyXG5cdFx0XHRcdHNlbmRkYXRhLnVwdm90ZT0xO1xyXG5cdFx0XHR9IGVsc2UgaWYodm90ZXR5cGU9PT1cImRvd25cIil7XHJcblx0XHRcdFx0c2VuZGRhdGEuZG93bnZvdGU9MTtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdHhoci5vcGVuKFwiUE9TVFwiLCBVREFfQVBJX1VSTCArIFwiL2NsaWNrZXZlbnRzL3NlcXVlbmNlL2FkZHZvdGVcIiwgdHJ1ZSk7XHJcblx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOCcpO1xyXG5cdFx0XHR4aHIuc2VuZChKU09OLnN0cmluZ2lmeShzZW5kZGF0YSkpO1xyXG5cdFx0fSxcclxuXHRcdC8vYXV0b3BsYXkgZnVuY3Rpb25hbGl0eSB0byBzdG9wIGFuZCBwbGF5XHJcblx0XHR0b2dnbGVhdXRvcGxheTpmdW5jdGlvbihuYXZjb29raWVkYXRhKXtcclxuXHRcdFx0aWYobmF2Y29va2llZGF0YS5hdXRvcGxheSl7XHJcblx0XHRcdFx0bmF2Y29va2llZGF0YS5hdXRvcGxheT1mYWxzZTtcclxuXHRcdFx0XHR0aGlzLmF1dG9wbGF5PWZhbHNlO1xyXG5cdFx0XHRcdC8vYWRkIGFuYWx0eXRpY3NcclxuXHRcdFx0XHR0aGlzLnJlY29yZGNsaWNrKCdzdG9wJyxuYXZjb29raWVkYXRhLmRhdGEubmFtZS50b1N0cmluZygpLG5hdmNvb2tpZWRhdGEuZGF0YS5pZCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bmF2Y29va2llZGF0YS5hdXRvcGxheT10cnVlO1xyXG5cdFx0XHRcdHRoaXMuYXV0b3BsYXk9dHJ1ZTtcclxuXHRcdFx0XHR0aGlzLnBsYXlOZXh0QWN0aW9uID0gdHJ1ZTtcclxuXHRcdFx0XHQvL2FkZCBhbmFsdHl0aWNzXHJcblx0XHRcdFx0dGhpcy5yZWNvcmRjbGljaygncGxheScsbmF2Y29va2llZGF0YS5kYXRhLm5hbWUudG9TdHJpbmcoKSxuYXZjb29raWVkYXRhLmRhdGEuaWQpO1xyXG5cdFx0XHRcdC8vIGlzc3VlIGZpeCBmb3IgcmVwbGF5XHJcblx0XHRcdFx0aWYoIXRoaXMuYXV0b3BsYXlQYXVzZWQgJiYgKHRoaXMuYXV0b3BsYXlDb21wbGV0ZWQgfHwgdGhpcy5pbnZva2VkQWN0aW9uTWFudWFsbHkpKSB7XHJcblx0XHRcdFx0XHRuYXZjb29raWVkYXRhLm5hdmlnYXRlZGRhdGEgPSBbXTtcclxuXHRcdFx0XHRcdG5hdmNvb2tpZWRhdGEubmF2Y29tcGxldGVkID0gZmFsc2U7XHJcblx0XHRcdFx0XHR0aGlzLmNyZWF0ZXN0b3JhZ2VkYXRhKHRoaXMubmF2aWdhdGlvbmNvb2tpZW5hbWUsSlNPTi5zdHJpbmdpZnkobmF2Y29va2llZGF0YSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5jcmVhdGVzdG9yYWdlZGF0YSh0aGlzLm5hdmlnYXRpb25jb29raWVuYW1lLEpTT04uc3RyaW5naWZ5KG5hdmNvb2tpZWRhdGEpKTtcclxuXHRcdFx0dGhpcy5zaG93c2VsZWN0ZWRyb3cobmF2Y29va2llZGF0YS5kYXRhLG5hdmNvb2tpZWRhdGEuZGF0YS5pZCx0cnVlLCBuYXZjb29raWVkYXRhKTtcclxuXHRcdH0sXHJcblx0XHQvL3VwZGF0aW5nIHRoZSBuYXZpZ2F0ZWQgZGF0YVxyXG5cdFx0dXBkYXRlbmF2Y29va2llZGF0YTpmdW5jdGlvbihuYXZjb29raWVkYXRhLHNlbGVjdGVkbm9kZWlkKXtcclxuXHRcdFx0bmF2Y29va2llZGF0YS5uYXZpZ2F0ZWRkYXRhLnB1c2goc2VsZWN0ZWRub2RlaWQpO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5jcmVhdGVzdG9yYWdlZGF0YSh0aGlzLm5hdmlnYXRpb25jb29raWVuYW1lLEpTT04uc3RyaW5naWZ5KG5hdmNvb2tpZWRhdGEpKTtcclxuXHRcdH0sXHJcblx0XHQvL2JhY2sgdG8gc2VhcmNoIHJlc3VsdHMgZnVuY3Rpb25hbGl0eVxyXG5cdFx0YmFja3Rvc2VhcmNocmVzdWx0czpmdW5jdGlvbiAobmF2Y29va2llZGF0YSkge1xyXG5cdFx0XHRpZihuYXZjb29raWVkYXRhLnNlYXJjaHRlcm0hPT0nJyl7XHJcblx0XHRcdFx0dmFyIG5hdmNvb2tpZWRhdGExID0ge3Nob3duYXY6IGZhbHNlLCBkYXRhOiB7fSwgYXV0b3BsYXk6ZmFsc2UsIHBhdXNlOmZhbHNlLCBzdG9wOmZhbHNlLCBuYXZjb21wbGV0ZWQ6ZmFsc2UsIG5hdmlnYXRlZGRhdGE6W10sc2VhcmNodGVybTpuYXZjb29raWVkYXRhLnNlYXJjaHRlcm19O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhciBuYXZjb29raWVkYXRhMSA9IHtzaG93bmF2OiBmYWxzZSwgZGF0YToge30sIGF1dG9wbGF5OmZhbHNlLCBwYXVzZTpmYWxzZSwgc3RvcDpmYWxzZSwgbmF2Y29tcGxldGVkOmZhbHNlLCBuYXZpZ2F0ZWRkYXRhOltdLHNlYXJjaHRlcm06XCJcIn07XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5jcmVhdGVzdG9yYWdlZGF0YSh0aGlzLm5hdmlnYXRpb25jb29raWVuYW1lLEpTT04uc3RyaW5naWZ5KG5hdmNvb2tpZWRhdGExKSk7XHJcblx0XHRcdHRoaXMuYXV0b3BsYXk9ZmFsc2U7XHJcblx0XHRcdGpRdWVyeShcIiN1ZGEtc2VhcmNoLWlucHV0XCIpLnZhbChuYXZjb29raWVkYXRhLnNlYXJjaHRlcm0pO1xyXG5cclxuXHRcdFx0Ly9hZGQgYW5hbHR5dGljc1xyXG5cdFx0XHR0aGlzLnJlY29yZGNsaWNrKCdiYWNrJyxuYXZjb29raWVkYXRhLmRhdGEubmFtZS50b1N0cmluZygpLG5hdmNvb2tpZWRhdGEuZGF0YS5pZCk7XHJcblxyXG5cdFx0XHR0aGlzLnNlYXJjaGluZWxhc3RpYyhuYXZjb29raWVkYXRhLnNlYXJjaHRlcm0pO1xyXG5cdFx0fSxcclxuXHRcdHJlY29yZGNsaWNrOmZ1bmN0aW9uIChjbGlja3R5cGU9J3NlcXVlbmNlcmVjb3JkJyxjbGlja2VkbmFtZT0nJyxyZWNvcmRpZD0wKSB7XHJcblx0XHRcdHZhciBzZW5kZGF0YT17dXNlcnNlc3Npb25pZDp0aGlzLnNlc3Npb25JRCxjbGlja3R5cGU6Y2xpY2t0eXBlLGNsaWNrZWRuYW1lOmNsaWNrZWRuYW1lLHJlY29yZGlkOnJlY29yZGlkfTtcclxuXHRcdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0XHR4aHIub3BlbihcIlBVVFwiLCBVREFfQVBJX1VSTCArIFwiL2NsaWNrZXZlbnRzL3VzZXJjbGlja1wiLCB0cnVlKTtcclxuXHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04Jyk7XHJcblx0XHRcdHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHNlbmRkYXRhKSk7XHJcblx0XHR9LFxyXG5cdFx0c2hvd2FkdmFuY2VkaHRtbDpmdW5jdGlvbigpe1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRQYWdlPSdhZHZhbmNlZCc7XHJcblx0XHRcdGpRdWVyeShcIiN1ZGEtYWR2YW5jZS1zZWN0aW9uXCIpLmhpZGUoKTtcclxuXHRcdFx0alF1ZXJ5KFwiI3VkYS1jb250ZW50LWNvbnRhaW5lclwiKS5odG1sKCcnKTtcclxuXHRcdFx0alF1ZXJ5KFwiI3VkYS1jb250ZW50LWNvbnRhaW5lclwiKS5hcHBlbmQodGhpcy5nZXRBZHZhbmNlZEh0bWwoKSk7XHJcblx0XHRcdGpRdWVyeShcIiN1ZGEtZW5hYmxlLXJlY29yZFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VURBUGx1Z2luU0RLLmdldHRpbWVzdGFtcChcInN0YXJ0XCIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0alF1ZXJ5KFwiI25pc3R2b2ljZWJhY2tcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFVEQVBsdWdpblNESy5iYWNrdG9tb2RhbCgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0XHR4aHIub3BlbihcIkdFVFwiLCBVREFfQVBJX1VSTCArIFwiL2NsaWNrZXZlbnRzL3N1Z2dlc3RlZD9kb21haW49XCIrZW5jb2RlVVJJKHdpbmRvdy5sb2NhdGlvbi5ob3N0KSwgdHJ1ZSk7XHJcblx0XHRcdHhoci5vbmxvYWQgPSBmdW5jdGlvbihldmVudCl7XHJcblx0XHRcdFx0aWYoeGhyLnN0YXR1cyA9PT0gMjAwKXtcclxuXHRcdFx0XHRcdFVEQVBsdWdpblNESy5zaG93c3VnZ2VzdGVkaHRtbChKU09OLnBhcnNlKHhoci5yZXNwb25zZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0Ly8geGhyLnNlbmQoKTtcclxuXHRcdH0sXHJcblx0XHQvLyBhZHZhbmNlZCBodG1sXHJcblx0XHRnZXRBZHZhbmNlZEh0bWw6IGZ1bmN0aW9uICgpe1xyXG5cdFx0XHR2YXIgaHRtbCA9XHQnPGRpdiBjbGFzcz1cInVkYS1jYXJkLWRldGFpbHNcIj4nXHJcblx0XHRcdFx0XHRcdFx0Ly8gKyc8ZGl2PjxidXR0b24gY2xhc3M9XCJ1ZGEtdHV0b3JpYWwtYnRuXCIgdHlwZT1cImJ1dHRvblwiPlR1dG9yaWFsPC9idXR0b24+PC9kaXY+J1xyXG5cdFx0XHRcdFx0XHRcdC8vICsnPGhyPidcclxuXHRcdFx0XHRcdFx0XHQrJzxzcGFuIGNsYXNzPVwidWRhLWNsb3NlLWljb25cIiBvbmNsaWNrPVwiVURBUGx1Z2luU0RLLnNlYXJjaGluZWxhc3RpYygpO1wiPsOXPC9zcGFuPidcclxuXHRcdFx0XHRcdFx0XHQrJzxoNT5DcmVhdGUgeW91ciBvd24gYWN0aW9uPC9oNT4nXHJcblx0XHRcdFx0XHRcdFx0Kyc8ZGl2PjxidXR0b24gY2xhc3M9XCJ1ZGEtcmVjb3JkLWJ0blwiIGlkPVwidWRhLWVuYWJsZS1yZWNvcmRcIj48c3Bhbj5SZWM8L3NwYW4+PC9idXR0b24+PC9kaXY+J1xyXG5cdFx0XHRcdFx0XHQrJzwvZGl2Pic7XHJcblx0XHRcdHJldHVybiBodG1sO1xyXG5cdFx0fSxcclxuXHRcdHNob3dzdWdnZXN0ZWRodG1sOmZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRpZihkYXRhLmxlbmd0aD4wKSB7XHJcblx0XHRcdFx0dGhpcy5yZWNvcmRlZHNlcXVlbmNlaWRzID0gZGF0YTtcclxuXHRcdFx0XHR2YXIgaHRtbCA9ICcgICA8ZGl2IGNsYXNzPVwidm9pY2Utc3VnZ2VzaW9uLWNhcmRcIj4nICtcclxuXHRcdFx0XHRcdCdcdFx0PGRpdiBjbGFzcz1cInZvaWNlLWNhcmQtbGVmdFwiPicgK1xyXG5cdFx0XHRcdFx0J1x0XHRcdDxoND5PdXIgQUkgZGV0ZWN0ZWQgdGhpcyBzZXF1ZW5jZS4gPGJyIC8+IERvIHlvdSB3YW50IHRvIG5hbWUgaXQ/IDxiciAvPjxzcGFuIHN0eWxlPVwiY29sb3I6I2ZmNDgwMDtmb250LXdlaWdodDpib2xkO1wiPihCZXRhIHZlcnNpb246IE5vdCByZWxpYWJsZSk8L3NwYW4+PC9oND4nICtcclxuXHRcdFx0XHRcdCdcdFx0XHQ8dWwgaWQ9XCJ1ZGEtcmVjb3JkZWQtcmVzdWx0c1wiIGNsYXNzPVwidm9pY2Utc3VnZ2dlc2lvbi1idWxsZXRcIj4nICtcclxuXHRcdFx0XHRcdCdcdFx0XHQ8L3VsPicgK1xyXG5cdFx0XHRcdFx0J1x0XHRcdDxkaXY+JyArXHJcblx0XHRcdFx0XHQnXHRcdFx0XHQ8aW5wdXQgaWQ9XCJ1ZGEtcmVjb3JkZWQtbmFtZVwiIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInVkYS1yZWNvcmRlZC1uYW1lXCIgY2xhc3M9XCJ2b2ljZS1zYXZlLXJlY3JkZWQtaW5wdFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgbGFiZWxcIiBuaXN0LXZvaWNlPVwidHJ1ZVwiPicgK1xyXG5cdFx0XHRcdFx0J1x0XHRcdFx0PGJ1dHRvbiBvbmNsaWNrPVwiVURBUGx1Z2luU0RLLnN1Ym1pdHJlY29yZGVkbGFiZWwoXFwncmVjb3JkaW5nXFwnKTtcIiBjbGFzcz1cInZvaWNlLXN1Ym1pdC1idG5cIj5TdWJtaXQ8L2J1dHRvbj48YnV0dG9uIGNsYXNzPVwidm9pY2UtY2FuY2VsLWJ0blwiIG9uY2xpY2s9XCJVREFQbHVnaW5TREsuc3VibWl0cmVjb3JkZWRsYWJlbChcXCdpbnZhbGlkXFwnKTtcIj5JbnZhbGlkIFNlcXVlbmNlPC9idXR0b24+PGJ1dHRvbiBjbGFzcz1cInZvaWNlLWNhbmNlbC1idG5cIiBvbmNsaWNrPVwiVURBUGx1Z2luU0RLLnN1Ym1pdHJlY29yZGVkbGFiZWwoXFwnaWdub3JlXFwnKTtcIj5JZ25vcmU8L2J1dHRvbj4nICtcclxuXHRcdFx0XHRcdCdcdFx0XHQ8L2Rpdj4nICtcclxuXHRcdFx0XHRcdCdcdFx0PC9kaXY+JyArXHJcblx0XHRcdFx0XHQnXHQ8L2Rpdj4nO1xyXG5cclxuXHRcdFx0XHRqUXVlcnkoXCIjdWRhLWNvbnRlbnQtY29udGFpbmVyXCIpLmFwcGVuZChodG1sKTtcclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdHRoaXMucmVuZGVycmVjb3JkcmVzdWx0cm93KGRhdGFbaV0sIGkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGJhY2t0b21vZGFsOmZ1bmN0aW9uKCl7XHJcblx0XHRcdGpRdWVyeShcIiN1ZGEtYWR2YW5jZS1zZWN0aW9uXCIpLnNob3coKTtcclxuXHRcdFx0alF1ZXJ5KFwiI3VkYS1jb250ZW50LWNvbnRhaW5lclwiKS5odG1sKCcnKTtcclxuXHRcdH0sXHJcblx0XHQvKipcclxuXHRcdCAqIGRpc2FibGluZyBmdW5jdGlvbmFsaXR5IHRvIHNob3cgdGhlIGJ1dHRvbiBvciBub3QuXHJcblx0XHQgKi9cclxuXHRcdGRpc2FibGVSZWNvcmRCdXR0b246IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKFVEQVVzZXJBdXRoRGF0YS5yZXN0cmljdF9hZGRfZGVsZXRlKSB7XHJcblx0XHRcdFx0alF1ZXJ5KFwiI3VkYS1hZHZhbmNlZC1idG5cIikuaGlkZSgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGpRdWVyeShcIiN1ZGEtYWR2YW5jZWQtYnRuXCIpLnNob3coKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblx0VURBUGx1Z2luU0RLLmluaXQoKTtcclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=