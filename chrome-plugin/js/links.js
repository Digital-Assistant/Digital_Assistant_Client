var UDALinkScriptloaded = UDALinkScriptloaded || false;
// if(!UDALinkScriptloaded) {
    let UDAUserAuthData = {id: null, email: null, restrict_add_delete: false, role: 'default'};
    var udaauthdata = {
        set id(val){
            UDAUserAuthData.id = val;
            var sessionevent = new CustomEvent("UDAClearSessionData", {detail: {data: "clearsession"}, bubbles: false, cancelable: false});
            document.dispatchEvent(sessionevent);
        },
        get id() {
            return UDAUserAuthData.id;
        },
        set email(val) {
            UDAUserAuthData.email = val;
            var sessionevent = new CustomEvent("UDAClearSessionData", {detail: {data: "clearsession"}, bubbles: false, cancelable: false});
            document.dispatchEvent(sessionevent);
        },
        get email() {
            return UDAUserAuthData.email;
        },
        set userRole(val) {
            UDAUserAuthData.role = val;
            var sessionevent = new CustomEvent("UDAClearSessionData", {detail: {data: "clearsession"}, bubbles: false, cancelable: false});
            document.dispatchEvent(sessionevent);
        },
        get userRole() {
            return UDAUserAuthData.role;
        },
        set restrict_add_delete(val) {
            UDAUserAuthData.restrict_add_delete = val;
            var sessionevent = new CustomEvent("UDADisableButton", {detail: {data: "UDADisableButton"}, bubbles: false, cancelable: false});
            document.dispatchEvent(sessionevent);
        },
        get restrict_add_delete() {
            return UDAUserAuthData.restrict_add_delete;
        }
    };
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
    const UDA_API_URL = (UDADebug) ? "http://localhost:11080/voiceapi" : "https://udantest.nistapp.ai/voiceapi"; //this variable exists in background.js file also
    const EXTENSION_VERSION = true;
    let UDAIgnorePatterns = [{"patterntype": "nist-voice", "patternvalue": "any"}];
    let UDASitePatterns = [];
    let UDARemovedClickObjects = [];
    let UDALastMutationTime = 0;
    let UDALastIndexTime = 0;
    let UDALogLevel = 0;

    /*****
     *
     * Browser detect code starts
     * Extracted the code from https://github.com/pure-js/browser-detection/blob/master/src/browser-detection.js
     *
     */

    var UDABrowserCheck = {
        /**
         * Detects Chrome browser
         * @param {string} userAgent
         * @return {boolean}
         */
        isChrome: function (userAgent) {
            return userAgent.includes('Chrome') &&
                !userAgent.includes('Chromium') &&
                !userAgent.includes('OPR') &&
                !userAgent.includes('Edge') &&
                !userAgent.includes('Edg') &&
                !userAgent.includes('SamsungBrowser');
        },

        /**
         * Detects Safari browser
         * @param {string} userAgent
         * @return {boolean}
         */
        isSafari: function (userAgent) {
            return userAgent.includes('Safari') &&
                !userAgent.includes('Chrome') &&
                !userAgent.includes('Chromium') &&
                !userAgent.includes('Edg') &&
                !userAgent.includes('Android');
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
            return (/trident/i.test(userAgent));
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
            return userAgent.includes('Android') &&
                !userAgent.includes('Chrome') &&
                userAgent.includes('AppleWebKit');
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
            if (this.isChrome(userAgent)) return 'Chrome';
            if (this.isSafari(userAgent)) return 'Safari';
            if (this.isUCBrowser(userAgent)) return 'UC Browser';
            if (this.isFirefox(userAgent)) return 'Firefox';
            if (this.isIE(userAgent)) return 'IE';
            if (this.isOpera(userAgent)) return 'Opera';
            if (this.isSamsungInternet(userAgent)) return 'Samsung Internet';
            if (this.isAndroidBrowser(userAgent)) return 'Android Browser';
            if (this.isEdge(userAgent)) return 'Edge';
        },

        /**
         * Retrieve browser version
         * @param {string} name
         * @param {string} str
         * @return {number} browser version
         */
        retrieveVersion: function (name, str) {
            name = name + '/';
            const start = str.indexOf(name);
            let preNum = str.substring(start + name.length);
            const index = preNum.indexOf(' ');
            if (index > 0) preNum = preNum.substring(0, index);
            let end;

            if (preNum.indexOf('.', 2) > 0) {
                end = preNum.indexOf('.', 2);
            } else {
                end = preNum.indexOf('.', 1);
            }

            const num = preNum.substring(0, end);
            return Number(num);
        },

        /**
         * Returns Association
         * @param {string} name
         * @return {string} browser name
         */
        getBeautifulName: function (name) {
            let browserName;
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
            const {userAgent} = nav;

            switch (name) {
                case 'IE': {
                    const temp = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
                    return Number(temp[1]) || null;
                }

                case 'Edge': {
                    const temp = userAgent.match(/\b(Edge|Edgios|Edga|Edg)\/(\d+)/);
                    return Number(temp[2]);
                }
            }

            const browserName = this.getBeautifulName(name);

            if (browserName) return this.retrieveVersion(browserName, userAgent);

            let found = userAgent.match(
                /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
            ) || [];

            found = found[2] ? [found[1],
                found[2]] : [nav.appName, nav.appVersion, '-?'];

            let temp;
            if ((temp = userAgent.match(/version\/(\d+)/i))
                !== null) found.splice(1, 1, temp[1]);

            return Number(found[1]);
        },

        /**
         * Detects browser name & version
         * @param {object} nav
         * @return {object} browser name & version
         */
        detectBrowserNameAndVersion: function (nav) {
            const name = this.detectBrowserName(nav.userAgent);

            return {
                name: name,
                version: this.detectBrowserVersion(nav, name),
            };
        }
    }
    /****
     *
     * Broswer detect code ends
     *
     */

    let UDABrowserName = UDABrowserCheck.detectBrowserNameAndVersion(navigator);
    let UDAAllowedBrowsers = ['chrome','edge'];
    let isUDAAllowed = UDAAllowedBrowsers.indexOf(UDABrowserName.name.toLowerCase());

    if (isUDAAllowed < 0) {
        console.log('UDA links script not loaded');
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

        // adding the clickobjects that were identified.
        function UDAAddNewElement(node) {
            let clickObject = {element: node}

            //checking whether the element is window or not
            if (clickObject.element === window) {
                return;
            }

            let tag = clickObject.element.tagName;
            if (tag && (tag.toLowerCase() === "body" || tag.toLowerCase() === "document" || tag.toLowerCase() === "window" || tag.toLowerCase() === "html")) {
                return;
            }

            if (clickObject.element.hasAttribute && clickObject.element.hasAttribute('nist-voice')) {
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
        }

        // processing node from mutation and then send to clickbojects addition
        function UDAProcessNode(node) {
            var processchildren = true;

            if (node.onclick !== undefined) {
                UDAAddNewElement(node);
            }

            // switched to switch case condition from if condition
            if (node.tagName) {
                switch (node.tagName.toLowerCase()) {
                    case 'a':
                        if (node.href !== undefined) {
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
                        } else if (node.hasAttribute('type') && node.getAttribute('type') === 'submit') {
                            UDAAddNewElement(node);
                        } else if (node.classList && (node.classList.contains('expand-button') || node.classList.contains('btn-pill'))) {
                            UDAAddNewElement(node);
                        } else {
                            if (UDALogLevel > 0) {
                                console.log({node: node});
                            }
                        }
                        break;
                    case 'span':
                        if (node.classList && node.classList.contains('select2-selection')) {
                            UDAAddNewElement(node);
                        }
                        break;
                    // fix for editor issue
                    case 'ckeditor':
                        UDAAddNewElement(node);
                        break;
                }
            }

            if (node.classList && node.classList.contains("dropdown-toggle")) {
                UDAAddNewElement(node);
            }

            if (node.children && processchildren) {
                for (var i = 0; i < node.children.length; i++) {
                    UDAProcessNode(node.children[i]);
                }
            }
        }

        // removal of clickbojects via mutation observer
        function UDAProcessRemovedNode(node) {
            for (var j = 0; j < UDAClickObjects.length; j++) {
                if (node.isEqualNode(UDAClickObjects[j].element)) {
                    let addtoremovenodes = true;
                    removedclickobjectcounter:
                        for (var k = 0; k < UDARemovedClickObjects.length; k++) {
                            if (node.isEqualNode(UDARemovedClickObjects[k].element)) {
                                addtoremovenodes = false;
                                break;
                            }
                        }
                    if (addtoremovenodes) {
                        UDARemovedClickObjects.push(UDAClickObjects[j]);
                    }
                    UDAClickObjects.splice(j, 1);
                    break;
                }
            }
            if (node.children) {
                for (var i = 0; i < node.children.length; i++) {
                    UDAProcessRemovedNode(node.children[i]);
                }
            }
        }

        //mutation observer initialization and adding the logic to process the clickobjects
        var dsa_observer = new MutationObserver(function (mutations) {
            if (UDALogLevel > 1) {
                console.log('------------ detected clicked objects-------------');
                console.log(UDAClickObjects);
            }
            mutations.forEach(function (mutation) {
                if (mutation.removedNodes.length) {
                    [].some.call(mutation.removedNodes, UDAProcessRemovedNode);
                }
                if (!mutation.addedNodes.length) {
                    return;
                }
                [].some.call(mutation.addedNodes, UDAProcessNode);
            });
            if (UDALogLevel > 1) {
                console.log('------------ removed clicked objects-------------');
                console.log(UDARemovedClickObjects);
            }
            UDALastMutationTime = Date.now();
        });

        // starting the mutation observer
        dsa_observer.observe(document, {
            childList: true,
            subtree: true
        });
    }
// }
