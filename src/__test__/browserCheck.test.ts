import { UDABrowserCheck } from "../modules/browserCheck";

/**
 * Tests the `isChrome` method of the `UDABrowserCheck` class, which checks if the given user agent string belongs to the Chrome browser.
 *
 * @param {string} userAgent - The user agent string to be tested.
 * @returns {boolean} `true` if the user agent belongs to Chrome, `false` otherwise.
 */
describe("UDABrowserCheck", () => {
  describe("isChrome", () => {
    it("should return true for Chrome user agent", () => {
      const userAgent =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
      expect(UDABrowserCheck.isChrome(userAgent)).toBe(true);
    });

    /**
     * Tests that the `isChrome` method of the `UDABrowserCheck` class correctly returns `false` for a non-Chrome user agent string.
     *
     * @param {string} userAgent - The user agent string to be tested.
     * @returns {void}
     */
    it("should return false for non-Chrome user agent", () => {
      const userAgent =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36";
      expect(UDABrowserCheck.isChrome(userAgent)).toBe(false);
    });
  });

  /**
   * Tests that the `isSafari` method of the `UDABrowserCheck` class correctly returns `true` for a Safari user agent string.
   *
   * @param {string} userAgent - The user agent string to be tested.
   * @returns {void}
   */
  describe("isSafari", () => {
    it("should return true for Safari user agent", () => {
      const userAgent =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15";
      expect(UDABrowserCheck.isSafari(userAgent)).toBe(true);
    });

    /**
     * Tests that the `isSafari` method of the `UDABrowserCheck` class correctly returns `false` for a non-Safari user agent string.
     *
     * @param {string} userAgent - The user agent string to be tested.
     * @returns {void}
     */
    it("should return false for non-Safari user agent", () => {
      const userAgent =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
      expect(UDABrowserCheck.isSafari(userAgent)).toBe(false);
    });
  });

  // Add similar test cases for other browser detection methods

  /**
   * Tests that the `detectBrowserName` function correctly detects the name of the Chrome browser.
   *
   * @param {string} userAgent - The user agent string to be tested.
   * @returns {void}
   */
  describe("detectBrowserName", () => {
    it("should detect Chrome", () => {
      const userAgent =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
      expect(UDABrowserCheck.detectBrowserName(userAgent)).toBe("Chrome");
    });

    /**
     * Tests that the `detectBrowserName` function correctly detects the name of the Safari browser.
     */
    it("should detect Safari", () => {
      const userAgent =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15";
      expect(UDABrowserCheck.detectBrowserName(userAgent)).toBe("Safari");
    });

    // Add test cases for other browsers
  });

  describe("retrieveVersion", () => {
    it("should retrieve the correct version number", () => {
      const name = "Chrome";
      const str =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
      expect(UDABrowserCheck.retrieveVersion(name, str)).toBe(91);
    });
  });

  /**
   * Tests that the `detectBrowserVersion` function correctly detects the version of the Chrome browser.
   */
  describe("detectBrowserVersion", () => {
    it("should detect Chrome version", () => {
      const nav = {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      };
      expect(UDABrowserCheck.detectBrowserVersion(nav, "Chrome")).toBe(91);
    });

    /**
     * Tests that the `detectBrowserVersion` function correctly detects the version of the Edge browser.
     */
    it("should detect Edge version", () => {
      const nav = {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59",
      };
      expect(UDABrowserCheck.detectBrowserVersion(nav, "Edge")).toBe(91);
    });

    // Add test cases for other browsers
  });

  /**
   * Tests that the `detectBrowserNameAndVersion` function correctly detects the name and version of the Chrome browser.
   */
  describe("detectBrowserNameAndVersion", () => {
    it("should detect Chrome name and version", () => {
      const nav = {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      };
      expect(UDABrowserCheck.detectBrowserNameAndVersion(nav)).toEqual({
        name: "Chrome",
        version: 91,
      });
    });

    /**
     * Tests that the `detectBrowserNameAndVersion` function returns `{ name: "unknown", version: "unknown" }` when the user agent string is not recognized.
     */
    it("should return unknown for unrecognized browser", () => {
      const nav = {
        userAgent: "Unknown Browser",
      };
      expect(UDABrowserCheck.detectBrowserNameAndVersion(nav)).toEqual({
        name: "unknown",
        version: "unknown",
      });
    });
  });
});
// Add these to the existing test suite

/**
 * Tests that the `isUCBrowser` function returns `true` for a UC Browser user agent string.
 */
describe("isUCBrowser", () => {
  it("should return true for UC Browser user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Linux; U; Android 8.1.0; en-US; Redmi Note 5 Pro Build/OPM1.171019.011) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.10.0.1163 Mobile Safari/537.36";
    expect(UDABrowserCheck.isUCBrowser(userAgent)).toBe(true);
  });

  /**
   * Tests that the `isUCBrowser` function returns `false` for a non-UC Browser user agent string.
   */
  it("should return false for non-UC Browser user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    expect(UDABrowserCheck.isUCBrowser(userAgent)).toBe(false);
  });
});

describe("isFirefox", () => {
  it("should return true for Firefox user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0";
    expect(UDABrowserCheck.isFirefox(userAgent)).toBe(true);
  });

  /**
   * Tests that the `isFirefox` function returns `false` for a non-Firefox user agent string.
   */
  it("should return false for non-Firefox user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    expect(UDABrowserCheck.isFirefox(userAgent)).toBe(false);
  });
});

/**
 * Tests that the `isIE` function returns `true` for an Internet Explorer user agent string.
 */
describe("isIE", () => {
  it("should return true for IE user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko";
    expect(UDABrowserCheck.isIE(userAgent)).toBe(true);
  });

  /**
   * Tests that the `isIE` function returns `false` for a non-IE browser user agent string.
   */
  it("should return false for non-IE user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    expect(UDABrowserCheck.isIE(userAgent)).toBe(false);
  });
});

/**
 * Tests that the `isOpera` function returns `true` for an Opera browser user agent string.
 */
describe("isOpera", () => {
  it("should return true for Opera user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 OPR/78.0.4093.153";
    expect(UDABrowserCheck.isOpera(userAgent)).toBe(true);
  });

  /**
   * Tests that the `isOpera` function returns `false` for a non-Opera browser user agent string.
   */
  it("should return false for non-Opera user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    expect(UDABrowserCheck.isOpera(userAgent)).toBe(false);
  });
});

/**
 * Tests that the `isSamsungInternet` function returns `true` for a Samsung Internet browser user agent string.
 */
describe("isSamsungInternet", () => {
  it("should return true for Samsung Internet user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36";
    /**
     * Tests that the `isSamsungInternet` function returns `true` for a Samsung Internet browser user agent string.
     */
    expect(UDABrowserCheck.isSamsungInternet(userAgent)).toBe(true);
  });

  /**
   * Tests that the `isSamsungInternet` function returns `false` for a non-Samsung Internet browser user agent string.
   */
  it("should return false for non-Samsung Internet user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    expect(UDABrowserCheck.isSamsungInternet(userAgent)).toBe(false);
  });
});

describe("isAndroidBrowser", () => {
  it("should return true for Android browser user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; KFTT Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30";
    expect(UDABrowserCheck.isAndroidBrowser(userAgent)).toBe(true);
  });

  /**
   * Tests that the `isAndroidBrowser` function returns `false` for a non-Android browser user agent string.
   */
  it("should return false for non-Android browser user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    expect(UDABrowserCheck.isAndroidBrowser(userAgent)).toBe(false);
  });
});

/**
 * Tests that the `isEdge` function returns `false` for a non-Edge user agent string.
 */
describe("isEdge", () => {
  it("should return true for Edge user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59";
    expect(UDABrowserCheck.isEdge(userAgent)).toBeTruthy();
  });

  it("should return false for non-Edge user agent", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    expect(UDABrowserCheck.isEdge(userAgent)).toBeFalsy();
  });
});

describe("getBeautifulName", () => {
  it("should return OPR for Opera", () => {
    expect(UDABrowserCheck.getBeautifulName("Opera")).toBe("OPR");
  });

  /**
   * Tests that the `getBeautifulName` function returns `"UCBrowser"` for the "UC Browser" browser name.
   */
  it("should return UCBrowser for UC Browser", () => {
    expect(UDABrowserCheck.getBeautifulName("UC Browser")).toBe("UCBrowser");
  });

  /**
   * Tests that the `getBeautifulName` function correctly returns "SamsungBrowser" for the "Samsung Internet" browser.
   */
  it("should return SamsungBrowser for Samsung Internet", () => {
    expect(UDABrowserCheck.getBeautifulName("Samsung Internet")).toBe(
      "SamsungBrowser"
    );
  });
  /**
   * Tests that the `getBeautifulName` function returns `undefined` for browser names that are not recognized.
   */

  it("should return undefined for other browsers", () => {
    expect(UDABrowserCheck.getBeautifulName("Chrome")).toBeUndefined();
  });
});
// Add these to the existing test suite

describe("detectBrowserName", () => {
  it("should detect UC Browser", () => {
    const userAgent =
      "Mozilla/5.0 (Linux; U; Android 8.1.0; en-US; Redmi Note 5 Pro Build/OPM1.171019.011) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.10.0.1163 Mobile Safari/537.36";
    expect(UDABrowserCheck.detectBrowserName(userAgent)).toBe("UC Browser");
  });

  /**
   * Tests the detection of the Firefox browser from the user agent string.
   */
  it("should detect Firefox", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0";
    expect(UDABrowserCheck.detectBrowserName(userAgent)).toBe("Firefox");
  });

  /**
   * Tests the detection of the Internet Explorer browser from the user agent string.
   */
  it("should detect IE", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko";
    expect(UDABrowserCheck.detectBrowserName(userAgent)).toBe("IE");
  });

  /**
   * Tests the detection of the Opera browser from the user agent string.
   */
  it("should detect Opera", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 OPR/78.0.4093.153";
    expect(UDABrowserCheck.detectBrowserName(userAgent)).toBe("Opera");
  });

  /**
   * Tests the detection of the Samsung Internet browser from the user agent string.
   */
  it("should detect Samsung Internet", () => {
    const userAgent =
      "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36";
    expect(UDABrowserCheck.detectBrowserName(userAgent)).toBe(
      "Samsung Internet"
    );
  });

  /**
   * Tests the detection of the Android Browser from the user agent string.
   */
  it("should detect Android Browser", () => {
    const userAgent =
      "Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; KFTT Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30";
    expect(UDABrowserCheck.detectBrowserName(userAgent)).toBe(
      "Android Browser"
    );
  });
});

/**
 * Tests the retrieval of the Firefox browser version from the user agent string.
 * @param {string} name - The name of the browser to detect.
 * @param {string} str - The user agent string to parse.
 * @returns {number} The detected version of the browser.
 */
describe("retrieveVersion", () => {
  it("should retrieve version with two digits", () => {
    const name = "Firefox";
    const str =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0";
    expect(UDABrowserCheck.retrieveVersion(name, str)).toBe(89);
  });

  /**
   * Tests the retrieval of the Chrome browser version from the user agent string.
   * @param {string} name - The name of the browser to detect.
   * @param {string} str - The user agent string to parse.
   * @returns {number} The detected version of the browser.
   */
  it("should retrieve version with three digits", () => {
    const name = "Chrome";
    const str =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    expect(UDABrowserCheck.retrieveVersion(name, str)).toBe(91);
  });
});

/**
 * Tests the detection of the Internet Explorer (IE) browser version from the user agent string.
 */
describe("detectBrowserVersion", () => {
  it("should detect IE version", () => {
    const nav = {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko",
    };
    expect(UDABrowserCheck.detectBrowserVersion(nav, "IE")).toBe(11);
  });

  /**
   * Tests the detection of the Opera browser version from the user agent string.
   */
  it("should detect Opera version", () => {
    const nav = {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 OPR/78.0.4093.153",
    };
    expect(UDABrowserCheck.detectBrowserVersion(nav, "Opera")).toBe(78);
  });

  /**
   * Tests the detection of the UC Browser version from the user agent string.
   */
  it("should detect UC Browser version", () => {
    const nav = {
      userAgent:
        "Mozilla/5.0 (Linux; U; Android 8.1.0; en-US; Redmi Note 5 Pro Build/OPM1.171019.011) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.10.0.1163 Mobile Safari/537.36",
    };
    expect(UDABrowserCheck.detectBrowserVersion(nav, "UC Browser")).toBe(12);
  });
});

/**
 * Tests the detection of the Firefox browser name and version from the user agent string.
 */
describe("detectBrowserNameAndVersion", () => {
  it("should detect Firefox name and version", () => {
    const nav = {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    };
    expect(UDABrowserCheck.detectBrowserNameAndVersion(nav)).toEqual({
      name: "Firefox",
      version: 89,
    });
  });

  /**
   * Tests the detection of the Samsung Internet browser name and version from the user agent string.
   */
  it("should detect Samsung Internet name and version", () => {
    const nav = {
      userAgent:
        "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36",
    };
    expect(UDABrowserCheck.detectBrowserNameAndVersion(nav)).toEqual({
      name: "Samsung Internet",
      version: 10,
    });
  });
});
