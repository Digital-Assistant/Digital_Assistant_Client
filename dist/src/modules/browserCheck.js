export const UDABrowserCheck = {
    /**
       * Detects Chrome browser
       * @param {string} userAgent
       * @return {boolean}
       */
    isChrome: function (userAgent) {
        return (userAgent.includes('Chrome') &&
            !userAgent.includes('Chromium') &&
            !userAgent.includes('OPR') &&
            !userAgent.includes('Edge') &&
            !userAgent.includes('Edg') &&
            !userAgent.includes('SamsungBrowser'));
    },
    /**
       * Detects Safari browser
       * @param {string} userAgent
       * @return {boolean}
       */
    isSafari: function (userAgent) {
        return (userAgent.includes('Safari') &&
            !userAgent.includes('Chrome') &&
            !userAgent.includes('Chromium') &&
            !userAgent.includes('Edg') &&
            !userAgent.includes('Android'));
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
        return /trident/i.test(userAgent);
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
        return (userAgent.includes('Android') &&
            !userAgent.includes('Chrome') &&
            userAgent.includes('AppleWebKit'));
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
        if (this.isChrome(userAgent))
            return 'Chrome';
        if (this.isSafari(userAgent))
            return 'Safari';
        if (this.isUCBrowser(userAgent))
            return 'UC Browser';
        if (this.isFirefox(userAgent))
            return 'Firefox';
        if (this.isIE(userAgent))
            return 'IE';
        if (this.isOpera(userAgent))
            return 'Opera';
        if (this.isSamsungInternet(userAgent))
            return 'Samsung Internet';
        if (this.isAndroidBrowser(userAgent))
            return 'Android Browser';
        if (this.isEdge(userAgent))
            return 'Edge';
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
        if (index > 0)
            preNum = preNum.substring(0, index);
        let end;
        if (preNum.indexOf('.', 2) > 0) {
            end = preNum.indexOf('.', 2);
        }
        else {
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
        const { userAgent } = nav;
        switch (name) {
            case 'IE': {
                const _temp1 = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
                return Number(_temp1[1]) || null;
            }
            case 'Edge': {
                const _temp2 = userAgent.match(/\b(Edge|Edgios|Edga|Edg)\/(\d+)/);
                return Number(_temp2[2]);
            }
        }
        const browserName = this.getBeautifulName(name);
        if (browserName)
            return this.retrieveVersion(browserName, userAgent);
        let found = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        found = found[2] ?
            [found[1], found[2]] :
            [nav.appName, nav.appVersion, '-?'];
        let temp;
        if ((temp = userAgent.match(/version\/(\d+)/i)) !== null) {
            found.splice(1, 1, temp[1]);
        }
        return Number(found[1]);
    },
    /**
       * Detects browser name & version
       * @param {object} nav
       * @return {object} browser name & version
       */
    detectBrowserNameAndVersion: function (nav) {
        const name = this.detectBrowserName(nav.userAgent);
        if (!name)
            return { name: 'unknown', version: 'unknown' };
        return {
            name: name,
            version: this.detectBrowserVersion(nav, name),
        };
    },
};
//# sourceMappingURL=browserCheck.js.map