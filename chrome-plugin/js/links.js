var UDALinkScriptloaded = UDALinkScriptloaded || false;
// if(!UDALinkScriptloaded) {
    console.log('defining');
    let udaauthdata = {id: null, email: null};
    let dsaClickObjects = [];
    let dsaSessionID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const voicedebug = false; //this variable exists in background.js file also
    const DSA_POST_INTERVAL = 1000; //in milliseconds, each minute
    const DSA_API_URL = (voicedebug) ? "http://localhost:11080/voiceapi" : "https://voicetest.nistapp.com/voiceapi"; //this variable exists in background.js file also
    const EXTENSION_VERSION = true;
    let ignorepatterns = [{"patterntype": "nist-voice", "patternvalue": "any"}];
    let sitepatterns = [];
    let removedclickobjects = [];
    let lastmutationtime = 0;
    let lastindextime = 0;
    let logLevel = 0;

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
            return userAgent.includes('Edge') && userAgent.includes('Chrome');
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
                    const temp = userAgent.match(/\b(Edge)\/(\d+)/);
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
    let UDAAllowedBrowsers = ['chrome'];
    let isUDAAllowed = UDAAllowedBrowsers.indexOf(UDABrowserName.name.toLowerCase());

    if (isUDAAllowed < 0) {
        console.log('UDA links script not loaded');
    } else {

        // adding the click object that is registered via javascript
        EventTarget.prototype.addEventListener = function (addEventListener) {
            return function () {
                if (arguments[0] === "click") {
                    dsaAddNewElement(this);
                }
                addEventListener.call(this, arguments[0], arguments[1], arguments[2]);
            }
        }(EventTarget.prototype.addEventListener);

        // adding the clickobjects that were identified.
        function dsaAddNewElement(node) {
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

            for (var i = 0; i < dsaClickObjects.length; i++) {
                if (dsaClickObjects[i].element.isSameNode(clickObject.element)) {
                    //todo, discuss , how better to call actions, if multiple actions should be stored, or selector better.
                    return;
                }
            }

            clickObject.id = dsaClickObjects.length;
            dsaClickObjects.push(clickObject);
        }

        // processing node from mutation and then send to clickbojects addition
        function dsaProcessNode(node) {
            var processchildren = true;

            if (node.onclick != undefined) {
                dsaAddNewElement(node);
            }

            // switched to switch case condition from if condition
            if (node.tagName) {
                switch (node.tagName.toLowerCase()) {
                    case 'a':
                        if (node.href !== undefined) {
                            dsaAddNewElement(node);
                        }
                        break;
                    case 'input':
                    case 'textarea':
                    case 'option':
                    case 'select':
                        dsaAddNewElement(node);
                        break;
                    case 'button':
                        if (node.hasAttribute('ng-click') || node.hasAttribute('onclick')) {
                            dsaAddNewElement(node);
                        } else if (node.hasAttribute('type') && node.getAttribute('type') === 'submit') {
                            dsaAddNewElement(node);
                        } else if (node.classList && (node.classList.contains('expand-button') || node.classList.contains('btn-pill'))) {
                            dsaAddNewElement(node);
                        } else {
                            if (logLevel > 0) {
                                console.log({node: node});
                            }
                        }
                        break;
                    case 'span':
                        if (node.classList && node.classList.contains('select2-selection')) {
                            dsaAddNewElement(node);
                        }
                        break;
                    // fix for editor issue
                    case 'ckeditor':
                        dsaAddNewElement(node);
                        break;
                }
            }

            if (node.classList && node.classList.contains("dropdown-toggle")) {
                dsaAddNewElement(node);
            }

            if (node.children && processchildren) {
                for (var i = 0; i < node.children.length; i++) {
                    dsaProcessNode(node.children[i]);
                }
            }
        }

        // removal of clickbojects via mutation observer
        function dsaProcessRemovedNode(node) {
            for (var j = 0; j < dsaClickObjects.length; j++) {
                if (node.isEqualNode(dsaClickObjects[j].element)) {
                    let addtoremovenodes = true;
                    removedclickobjectcounter:
                        for (var k = 0; k < removedclickobjects.length; k++) {
                            if (node.isEqualNode(removedclickobjects[k].element)) {
                                addtoremovenodes = false;
                                break;
                            }
                        }
                    if (addtoremovenodes) {
                        removedclickobjects.push(dsaClickObjects[j]);
                    }
                    dsaClickObjects.splice(j, 1);
                    break;
                }
            }
            if (node.children) {
                for (var i = 0; i < node.children.length; i++) {
                    dsaProcessRemovedNode(node.children[i]);
                }
            }
        }

        //mutation observer initialization and adding the logic to process the clickobjects
        var dsa_observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.removedNodes.length) {
                    if (logLevel > 1) {
                        console.log(dsaClickObjects);
                    }
                    [].some.call(mutation.removedNodes, dsaProcessRemovedNode);
                    if (logLevel > 1) {
                        console.log(removedclickobjects);
                    }
                }
                if (!mutation.addedNodes.length) {
                    return;
                }
                [].some.call(mutation.addedNodes, dsaProcessNode);
            });
            lastmutationtime = Date.now();
        });

        // starting the mutation observer
        dsa_observer.observe(document, {
            childList: true,
            subtree: true
        });
    }
// }
