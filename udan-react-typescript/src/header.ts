
import { UDAConsoleLogger, UDALog4jsLogger } from './config/error-log';
import { UDAdigestMessage,UDAAddNewElement,UDAProcessNode,DSA_OBSERVER } from './util';
import { UDAUserAuthData } from './modules/authData'
import {UDABrowserCheck} from './modules/browserCheck'

let UDALinkScriptloaded = false;
// if(!UDALinkScriptloaded) {
    /**
     *
     * @param textmessage
     * @param algorithm
     * @returns {Promise<ArrayBuffer>}
     * @constructor
     *
     * This is used for encrypting text messages as specified in the docs
     * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
     *
     */
    
    let UDACustomCss = {
        src:'',
        loaded: false,
        set url(val) {
            this.src = val;
            var cssevent = new CustomEvent("UDALoadCustomCSS", {detail: {data: "UDALoadCustomCSS"}, bubbles: false, cancelable: false});
            document.dispatchEvent(cssevent);
            this.loaded = true;
        },
        get url(){
            return this.src;
        }
    };

    let UDAClickObjects = [];
    let UDASessionID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const UDADebug = false; //this variable exists in background.js file also
    const UDA_POST_INTERVAL = 1000; //in milliseconds, each minute
    let UDA_DOMAIN = "https://udantest.nistapp.ai";
    let UDA_API_URL = (UDADebug) ? "http://localhost:11080/voiceapi" : UDA_DOMAIN+"/voiceapi"; //this variable exists in background.js file also
    const UDA_Environment = {
        current:'TEST',
        set Environment(value) {
            this.current = value.toString().toUpperCase();
            if(this.current==='PROD'){
                UDA_DOMAIN = "https://udan.nistapp.ai";
            } else {
                UDA_DOMAIN = "https://udantest.nistapp.ai";
            }
            UDA_API_URL = UDA_DOMAIN+"/voiceapi";
        },
        get Environment() {
            return this.current;
        }
    };

    let UDABrowserName = UDABrowserCheck.detectBrowserNameAndVersion(navigator);
    let UDAAllowedBrowsers = ['chrome','edge'];
    let isUDAAllowed = UDAAllowedBrowsers.indexOf(UDABrowserName?.name?.toLowerCase());

    if (isUDAAllowed < 0) {
        UDAConsoleLogger.info('UDA links script not loaded');
    } else {
        // adding the click object that is registered via javascript
        EventTarget.prototype.addEventListener = function (addEventListener) {
            return function () {
                if (arguments[0] === "click") {
                    UDAAddNewElement(this);
                }
                addEventListener.call(this, arguments[0], arguments[1], arguments[2]);
            }
        }(EventTarget.prototype.addEventListener);


        // starting the mutation observer
        DSA_OBSERVER.observe(document, {
            childList: true,
            subtree: true
        });
    }
// }