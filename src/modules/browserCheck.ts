export const UDABrowserCheck = {
  isChrome: function (userAgent: string): boolean {
    try {
      return (
        userAgent.includes("Chrome") &&
        !userAgent.includes("Chromium") &&
        !userAgent.includes("OPR") &&
        !userAgent.includes("Edge") &&
        !userAgent.includes("Edg") &&
        !userAgent.includes("SamsungBrowser")
      );
    } catch (error) {
      console.error("Error in isChrome:", error);
      return false;
    }
  },

  isSafari: function (userAgent: string): boolean {
    try {
      return (
        userAgent.includes("Safari") &&
        !userAgent.includes("Chrome") &&
        !userAgent.includes("Chromium") &&
        !userAgent.includes("Edg") &&
        !userAgent.includes("Android")
      );
    } catch (error) {
      console.error("Error in isSafari:", error);
      return false;
    }
  },

  isUCBrowser: function (userAgent: string): boolean {
    try {
      return userAgent.includes("UCBrowser");
    } catch (error) {
      console.error("Error in isUCBrowser:", error);
      return false;
    }
  },

  isFirefox: function (userAgent: string): boolean {
    try {
      return userAgent.includes("Firefox") && !userAgent.includes("Seamonkey");
    } catch (error) {
      console.error("Error in isFirefox:", error);
      return false;
    }
  },

  isIE: function (userAgent: string): boolean {
    try {
      return /trident/i.test(userAgent);
    } catch (error) {
      console.error("Error in isIE:", error);
      return false;
    }
  },

  isOpera: function (userAgent: string): boolean {
    try {
      return userAgent.includes("OPR");
    } catch (error) {
      console.error("Error in isOpera:", error);
      return false;
    }
  },

  isSamsungInternet: function (userAgent: string): boolean {
    try {
      return userAgent.includes("SamsungBrowser");
    } catch (error) {
      console.error("Error in isSamsungInternet:", error);
      return false;
    }
  },

  isAndroidBrowser: function (userAgent: string): boolean {
    try {
      return (
        userAgent.includes("Android") &&
        !userAgent.includes("Chrome") &&
        userAgent.includes("AppleWebKit")
      );
    } catch (error) {
      console.error("Error in isAndroidBrowser:", error);
      return false;
    }
  },

  isEdge: function (userAgent: string): boolean {
    try {
      return !!userAgent.match(/\b(Edge|Edgios|Edga|Edg)\/(\d+)/);
    } catch (error) {
      console.error("Error in isEdge:", error);
      return false;
    }
  },

  detectBrowserName: function (userAgent: string): string | undefined {
    try {
      if (this.isChrome(userAgent)) return "Chrome";
      if (this.isSafari(userAgent)) return "Safari";
      if (this.isUCBrowser(userAgent)) return "UC Browser";
      if (this.isFirefox(userAgent)) return "Firefox";
      if (this.isIE(userAgent)) return "IE";
      if (this.isOpera(userAgent)) return "Opera";
      if (this.isSamsungInternet(userAgent)) return "Samsung Internet";
      if (this.isAndroidBrowser(userAgent)) return "Android Browser";
      if (this.isEdge(userAgent)) return "Edge";
      return undefined;
    } catch (error) {
      console.error("Error in detectBrowserName:", error);
      return undefined;
    }
  },

  retrieveVersion: function (name: string, str: string): number | null {
    try {
      name = name + "/";
      const start = str.indexOf(name);
      if (start === -1) return null;
      let preNum = str.substring(start + name.length);
      const index = preNum.indexOf(" ");
      if (index > 0) preNum = preNum.substring(0, index);
      let end = preNum.indexOf(".", 2);
      if (end === -1) end = preNum.indexOf(".", 1);
      if (end === -1) return null;
      const num = preNum.substring(0, end);
      return Number(num);
    } catch (error) {
      console.error("Error in retrieveVersion:", error);
      return null;
    }
  },

  getBeautifulName: function (name: string): string | undefined {
    try {
      switch (name) {
        case "Opera":
          return "OPR";
        case "UC Browser":
          return "UCBrowser";
        case "Samsung Internet":
          return "SamsungBrowser";
        default:
          return undefined;
      }
    } catch (error) {
      console.error("Error in getBeautifulName:", error);
      return undefined;
    }
  },

  detectBrowserVersion: function (nav: any, name: string): number | null {
    try {
      const { userAgent } = nav;

      switch (name) {
        case "IE": {
          const _temp1: any = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
          return Number(_temp1[1]) || null;
        }
        case "Edge": {
          const _temp2 = userAgent.match(/\b(Edge|Edgios|Edga|Edg)\/(\d+)/);
          return _temp2 ? Number(_temp2[2]) : null;
        }
      }

      const browserName = this.getBeautifulName(name);

      if (browserName) return this.retrieveVersion(browserName, userAgent);

      let found =
        userAgent.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];

      found = found[2]
        ? [found[1], found[2]]
        : [nav.appName, nav.appVersion, "-?"];

      let temp;
      if ((temp = userAgent.match(/version\/(\d+)/i)) !== null) {
        found.splice(1, 1, temp[1]);
      }

      return Number(found[1]) || null;
    } catch (error) {
      console.error("Error in detectBrowserVersion:", error);
      return null;
    }
  },

  detectBrowserNameAndVersion: function (nav: any): {
    name: string;
    version: string | number;
  } {
    try {
      const name = this.detectBrowserName(nav.userAgent);
      if (!name) return { name: "unknown", version: "unknown" };
      const version = this.detectBrowserVersion(nav, name);
      return {
        name: name,
        version: version !== null ? version : "unknown",
      };
    } catch (error) {
      console.error("Error in detectBrowserNameAndVersion:", error);
      return { name: "unknown", version: "unknown" };
    }
  },
};
