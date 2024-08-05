/**
 * Imports the UDAErrorLogger utility for logging errors.
 */
import { UDAErrorLogger } from "../config/error-log";

/**
 * Checks if the given user agent string represents a Chrome browser.
 * @param userAgent - The user agent string to check.
 * @returns `true` if the user agent represents Chrome, `false` otherwise.
 */
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
      UDAErrorLogger.error(`Error in isChrome: ${error.message}`, error);
      return false;
    }
  },

  /**
   * Checks if the given user agent string represents a Safari browser.
   * @param userAgent - The user agent string to check.
   * @returns `true` if the user agent represents Safari, `false` otherwise.
   */
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
      UDAErrorLogger.error(`Error in isSafari: ${error.message}`, error);
      return false;
    }
  },

  /**
   * Checks if the given user agent string represents a UC Browser.
   * @param userAgent - The user agent string to check.
   * @returns `true` if the user agent represents UC Browser, `false` otherwise.
   */
  isUCBrowser: function (userAgent: string): boolean {
    try {
      return userAgent.includes("UCBrowser");
    } catch (error) {
      UDAErrorLogger.error(`Error in isUCBrowser: ${error.message}`, error);
      return false;
    }
  },

  /**
   * Checks if the given user agent string represents a Firefox browser.
   * @param userAgent - The user agent string to check.
   * @returns `true` if the user agent represents Firefox, `false` otherwise.
   */
  isFirefox: function (userAgent: string): boolean {
    try {
      return userAgent.includes("Firefox") && !userAgent.includes("Seamonkey");
    } catch (error) {
      UDAErrorLogger.error(`Error in isFirefox: ${error.message}`, error);
      return false;
    }
  },

  /**
   * Checks if the given user agent string represents an Internet Explorer browser.
   * @param userAgent - The user agent string to check.
   * @returns `true` if the user agent represents Internet Explorer, `false` otherwise.
   */
  isIE: function (userAgent: string): boolean {
    try {
      return /trident/i.test(userAgent);
    } catch (error) {
      UDAErrorLogger.error(`Error in isIE: ${error.message}`, error);
      return false;
    }
  },

  /**
   * Checks if the given user agent string represents an Opera browser.
   * @param userAgent - The user agent string to check.
   * @returns `true` if the user agent represents Opera, `false` otherwise.
   */
  isOpera: function (userAgent: string): boolean {
    try {
      return userAgent.includes("OPR");
    } catch (error) {
      UDAErrorLogger.error(`Error in isOpera: ${error.message}`, error);
      return false;
    }
  },

  /**
   * Checks if the given user agent string represents a Samsung Internet browser.
   * @param userAgent - The user agent string to check.
   * @returns `true` if the user agent represents Samsung Internet, `false` otherwise.
   */
  isSamsungInternet: function (userAgent: string): boolean {
    try {
      return userAgent.includes("SamsungBrowser");
    } catch (error) {
      UDAErrorLogger.error(
        `Error in isSamsungInternet: ${error.message}`,
        error
      );
      return false;
    }
  },

  /**
   * Checks if the given user agent string represents an Android browser.
   * @param userAgent - The user agent string to check.
   * @returns `true` if the user agent represents an Android browser, `false` otherwise.
   */
  isAndroidBrowser: function (userAgent: string): boolean {
    try {
      return (
        userAgent.includes("Android") &&
        !userAgent.includes("Chrome") &&
        userAgent.includes("AppleWebKit")
      );
    } catch (error) {
      UDAErrorLogger.error(
        `Error in isAndroidBrowser: ${error.message}`,
        error
      );
      return false;
    }
  },

  /**
   * Checks if the given user agent string represents an Edge browser.
   * @param userAgent - The user agent string to check.
   * @returns `true` if the user agent represents Edge, `false` otherwise.
   */
  isEdge: function (userAgent: string): boolean {
    try {
      return !!userAgent.match(/\b(Edge|Edgios|Edga|Edg)\/(\d+)/);
    } catch (error) {
      UDAErrorLogger.error(`Error in isEdge: ${error.message}`, error);
      return false;
    }
  },

  /**
   * Detects the name of the browser based on the given user agent string.
   * @param userAgent - The user agent string to check.
   * @returns The name of the browser, or `undefined` if the browser could not be detected.
   */
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
    } catch (error) {
      UDAErrorLogger.error(
        `Error in detectBrowserName: ${error.message}`,
        error
      );
    }
  },

  /**
   * Retrieves the version number from a given user agent string for a specified browser name.
   * @param name - The name of the browser to retrieve the version for.
   * @param str - The user agent string to parse.
   * @returns The version number as a number, or `null` if the version could not be determined.
   */
  retrieveVersion: function (name: string, str: string): number | null {
    try {
      name = name + "/";
      const start = str.indexOf(name);
      let preNum = str.substring(start + name.length);
      const index = preNum.indexOf(" ");
      if (index > 0) preNum = preNum.substring(0, index);
      let end;

      if (preNum.indexOf(".", 2) > 0) {
        end = preNum.indexOf(".", 2);
      } else {
        end = preNum.indexOf(".", 1);
      }

      const num = preNum.substring(0, end);
      return Number(num);
    } catch (error) {
      UDAErrorLogger.error(`Error in retrieveVersion: ${error.message}`, error);
      return null;
    }
  },

  /**
   * Retrieves the "beautiful" name for a given browser name.
   * @param name - The name of the browser to get the beautiful name for.
   * @returns The beautiful name of the browser, or `undefined` if the name could not be mapped.
   */
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
      UDAErrorLogger.error(
        `Error in getBeautifulName: ${error.message}`,
        error
      );
    }
  },

  /**
   * Detects the browser version based on the provided user agent string.
   * @param nav - The browser navigation object containing the user agent string.
   * @param name - The name of the browser to detect the version for.
   * @returns The version number as a number, or `null` if the version could not be determined.
   */
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

      return Number(found[1]);
    } catch (error) {
      UDAErrorLogger.error(
        `Error in detectBrowserVersion: ${error.message}`,
        error
      );
      return null;
    }
  },

  /**
   * Detects the name and version of the browser based on the provided navigation object.
   * @param nav - The browser navigation object containing the user agent string.
   * @returns An object with the detected browser name and version, or "unknown" if the name or version could not be determined.
   */
  detectBrowserNameAndVersion: function (nav: any): {
    name: string;
    version: string | number;
  } {
    try {
      const name = this.detectBrowserName(nav.userAgent);
      if (!name) return { name: "unknown", version: "unknown" };
      return {
        name: name,
        version: this.detectBrowserVersion(nav, name) || "unknown",
      };
    } catch (error) {
      UDAErrorLogger.error(
        `Error in detectBrowserNameAndVersion: ${error.message}`,
        error
      );
      return { name: "unknown", version: "unknown" };
    }
  },
};
