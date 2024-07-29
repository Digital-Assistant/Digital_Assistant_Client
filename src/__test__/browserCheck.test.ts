/**
 * Imports the UDABrowserCheck module, which provides functions to detect the current browser type.
 */
import { UDABrowserCheck } from "../modules/browserCheck";

/**
 * Defines a set of user agent strings for various web browsers, which are used in the tests for the `UDABrowserCheck` module.
 */
describe("UDABrowserCheck", () => {
  /**
   * Defines a set of user agent strings for various web browsers, which are used in the tests for the `UDABrowserCheck` module.
   */
  const chromeUA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";
  const safariUA =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15";
  const ucBrowserUA =
    "Mozilla/5.0 (Linux; U; Android 4.2.2; en-US; Micromax A110 Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) UCBrowser/9.8.0.534 Mobile Safari/534.30";
  const firefoxUA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:54.0) Gecko/20100101 Firefox/54.0";
  const ieUA =
    "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)";
  const operaUA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 OPR/51.0.2830.55";
  const samsungInternetUA =
    "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36";
  const androidBrowserUA =
    "Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; HTC Sensation Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30";
  const edgeUA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246";

  /**
   * Tests the `isChrome` function, which detects whether the user's browser is the Google Chrome browser.
   *
   * This test verifies that the `isChrome` function correctly identifies the Chrome browser based on the provided user agent string.
   */
  test("isChrome", () => {
    expect(UDABrowserCheck.isChrome(chromeUA)).toBe(true);
    expect(UDABrowserCheck.isChrome(safariUA)).toBe(false);
  });

  /**
   * Tests the `isSafari` function, which detects whether the user's browser is the Safari browser.
   *
   * This test verifies that the `isSafari` function correctly identifies the Safari browser based on the provided user agent string.
   */
  test("isSafari", () => {
    expect(UDABrowserCheck.isSafari(safariUA)).toBe(true);
    expect(UDABrowserCheck.isSafari(chromeUA)).toBe(false);
  });

  /**
   * Tests the `isUCBrowser` function, which detects whether the user's browser is the UC Browser.
   *
   * This test verifies that the `isUCBrowser` function correctly identifies the UC Browser based on the provided user agent string.
   */
  test("isUCBrowser", () => {
    expect(UDABrowserCheck.isUCBrowser(ucBrowserUA)).toBe(true);
    expect(UDABrowserCheck.isUCBrowser(chromeUA)).toBe(false);
  });

  /**
   * Tests the `isFirefox` function, which detects whether the user's browser is the Mozilla Firefox browser.
   *
   * This test verifies that the `isFirefox` function correctly identifies the Firefox browser based on the provided user agent string.
   */
  test("isFirefox", () => {
    expect(UDABrowserCheck.isFirefox(firefoxUA)).toBe(true);
    expect(UDABrowserCheck.isFirefox(chromeUA)).toBe(false);
  });

  /**
   * Tests the `isIE` function, which detects whether the user's browser is Microsoft Internet Explorer.
   *
   * This test verifies that the `isIE` function correctly identifies Internet Explorer based on the provided user agent string.
   */
  test("isIE", () => {
    expect(UDABrowserCheck.isIE(ieUA)).toBe(true);
    expect(UDABrowserCheck.isIE(chromeUA)).toBe(false);
  });

  /**
   * Tests the `isOpera` function, which detects whether the user's browser is the Opera browser.
   *
   * This test verifies that the `isOpera` function correctly identifies the Opera browser based on the provided user agent string.
   */
  test("isOpera", () => {
    expect(UDABrowserCheck.isOpera(operaUA)).toBe(true);
    expect(UDABrowserCheck.isOpera(chromeUA)).toBe(false);
  });

  /**
   * Tests the `isSamsungInternet` function, which detects whether the user's browser is the Samsung Internet browser.
   *
   * This test verifies that the `isSamsungInternet` function correctly identifies the Samsung Internet browser based on the provided user agent string.
   */
  test("isSamsungInternet", () => {
    expect(UDABrowserCheck.isSamsungInternet(samsungInternetUA)).toBe(true);
    expect(UDABrowserCheck.isSamsungInternet(chromeUA)).toBe(false);
  });

  /**
   * Tests the `isAndroidBrowser` function, which detects whether the user's browser is the Android browser.
   *
   * This test verifies that the `isAndroidBrowser` function correctly identifies the Android browser based on the provided user agent string.
   */
  test("isAndroidBrowser", () => {
    expect(UDABrowserCheck.isAndroidBrowser(androidBrowserUA)).toBe(true);
    expect(UDABrowserCheck.isAndroidBrowser(chromeUA)).toBe(false);
  });

  /**
   * Tests the `isEdge` function, which detects whether the user's browser is Microsoft Edge.
   *
   * This test verifies that the `isEdge` function correctly identifies the Edge browser based on the provided user agent string.
   */
  test("isEdge", () => {
    expect(UDABrowserCheck.isEdge(edgeUA)).toBe(true);
    expect(UDABrowserCheck.isEdge(chromeUA)).toBe(false);
  });

  /**
   * Tests the `detectBrowserName` function, which detects the name of the user's browser.
   *
   * This test creates several sample user agent strings for different browsers, and verifies that the `detectBrowserName` function correctly identifies the browser name.
   */
  test("detectBrowserName", () => {
    expect(UDABrowserCheck.detectBrowserName(chromeUA)).toBe("Chrome");
    expect(UDABrowserCheck.detectBrowserName(safariUA)).toBe("Safari");
    expect(UDABrowserCheck.detectBrowserName(ucBrowserUA)).toBe("UC Browser");
    expect(UDABrowserCheck.detectBrowserName(firefoxUA)).toBe("Firefox");
    expect(UDABrowserCheck.detectBrowserName(ieUA)).toBe("IE");
    expect(UDABrowserCheck.detectBrowserName(operaUA)).toBe("Opera");
    expect(UDABrowserCheck.detectBrowserName(samsungInternetUA)).toBe(
      "Samsung Internet"
    );
    expect(UDABrowserCheck.detectBrowserName(androidBrowserUA)).toBe(
      "Android Browser"
    );
    expect(UDABrowserCheck.detectBrowserName(edgeUA)).toBe("Edge");
  });

  /**
   * Tests the `retrieveVersion` function, which detects the version of the user's browser.
   *
   * This test creates several sample user agent strings for different browsers, and verifies that the `retrieveVersion` function correctly identifies the browser version.
   */
  test("retrieveVersion", () => {
    expect(UDABrowserCheck.retrieveVersion("Chrome", chromeUA)).toBe(58);
    expect(UDABrowserCheck.retrieveVersion("Safari", safariUA)).toBe(13);
    expect(UDABrowserCheck.retrieveVersion("UCBrowser", ucBrowserUA)).toBe(9);
    expect(UDABrowserCheck.retrieveVersion("Firefox", firefoxUA)).toBe(54);
    expect(UDABrowserCheck.retrieveVersion("OPR", operaUA)).toBe(51);
    expect(
      UDABrowserCheck.retrieveVersion("SamsungBrowser", samsungInternetUA)
    ).toBe(10);
    expect(UDABrowserCheck.retrieveVersion("Edge", edgeUA)).toBe(12);
  });

  /**
   * Tests the `getBeautifulName` function, which returns a more readable name for certain browser names.
   *
   * This test verifies that the `getBeautifulName` function correctly maps certain browser names to their more readable counterparts.
   */
  test("getBeautifulName", () => {
    expect(UDABrowserCheck.getBeautifulName("Opera")).toBe("OPR");
    expect(UDABrowserCheck.getBeautifulName("UC Browser")).toBe("UCBrowser");
    expect(UDABrowserCheck.getBeautifulName("Samsung Internet")).toBe(
      "SamsungBrowser"
    );
    expect(UDABrowserCheck.getBeautifulName("Chrome")).toBeUndefined();
  });

  /**
   * Tests the `detectBrowserVersion` function, which detects the version of the user's browser.
   *
   * This test creates several sample user agent strings for different browsers, and verifies that the `detectBrowserVersion` function correctly identifies the browser version.
   */
  test("detectBrowserVersion", () => {
    expect(
      UDABrowserCheck.detectBrowserVersion(
        { userAgent: chromeUA, appName: "", appVersion: "" },
        "Chrome"
      )
    ).toBe(58);
    expect(
      UDABrowserCheck.detectBrowserVersion(
        { userAgent: safariUA, appName: "", appVersion: "" },
        "Safari"
      )
    ).toBe(13);
    expect(
      UDABrowserCheck.detectBrowserVersion(
        { userAgent: ucBrowserUA, appName: "", appVersion: "" },
        "UC Browser"
      )
    ).toBe(9);
    expect(
      UDABrowserCheck.detectBrowserVersion(
        { userAgent: firefoxUA, appName: "", appVersion: "" },
        "Firefox"
      )
    ).toBe(54);
    expect(
      UDABrowserCheck.detectBrowserVersion(
        { userAgent: ieUA, appName: "", appVersion: "" },
        "IE"
      )
    ).toBe(10);
    expect(
      UDABrowserCheck.detectBrowserVersion(
        { userAgent: operaUA, appName: "", appVersion: "" },
        "Opera"
      )
    ).toBe(51);
    expect(
      UDABrowserCheck.detectBrowserVersion(
        { userAgent: samsungInternetUA, appName: "", appVersion: "" },
        "Samsung Internet"
      )
    ).toBe(10);
    expect(
      UDABrowserCheck.detectBrowserVersion(
        { userAgent: edgeUA, appName: "", appVersion: "" },
        "Edge"
      )
    ).toBe(12);
  });

  /**
   * Tests the `detectBrowserNameAndVersion` function, which detects the name and version of the user's browser.
   *
   * This test creates several sample user agent strings for different browsers, and verifies that the `detectBrowserNameAndVersion` function correctly identifies the browser name and version.
   */
  test("detectBrowserNameAndVersion", () => {
    expect(
      UDABrowserCheck.detectBrowserNameAndVersion({
        userAgent: chromeUA,
        appName: "",
        appVersion: "",
      })
    ).toEqual({ name: "Chrome", version: 58 });
    expect(
      UDABrowserCheck.detectBrowserNameAndVersion({
        userAgent: safariUA,
        appName: "",
        appVersion: "",
      })
    ).toEqual({ name: "Safari", version: 13 });
    expect(
      UDABrowserCheck.detectBrowserNameAndVersion({
        userAgent: ucBrowserUA,
        appName: "",
        appVersion: "",
      })
    ).toEqual({ name: "UC Browser", version: 9 });
    expect(
      UDABrowserCheck.detectBrowserNameAndVersion({
        userAgent: firefoxUA,
        appName: "",
        appVersion: "",
      })
    ).toEqual({ name: "Firefox", version: 54 });
    expect(
      UDABrowserCheck.detectBrowserNameAndVersion({
        userAgent: ieUA,
        appName: "",
        appVersion: "",
      })
    ).toEqual({ name: "IE", version: 10 });
    expect(
      UDABrowserCheck.detectBrowserNameAndVersion({
        userAgent: operaUA,
        appName: "",
        appVersion: "",
      })
    ).toEqual({ name: "Opera", version: 51 });
    expect(
      UDABrowserCheck.detectBrowserNameAndVersion({
        userAgent: samsungInternetUA,
        appName: "",
        appVersion: "",
      })
    ).toEqual({ name: "Samsung Internet", version: 10 });
    expect(
      UDABrowserCheck.detectBrowserNameAndVersion({
        userAgent: edgeUA,
        appName: "",
        appVersion: "",
      })
    ).toEqual({ name: "Edge", version: 12 });
  });
  /**
   * Tests the `isChrome` function, which detects if the user agent string belongs to the Chrome browser.
   *
   * This test creates several sample user agent strings, some for Chrome and some for non-Chrome browsers, and verifies that the `isChrome` function correctly identifies the Chrome browser.
   */
  test("isChrome", () => {
    expect(
      UDABrowserCheck.isChrome(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      )
    ).toBe(true);
    expect(
      UDABrowserCheck.isChrome(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/58.0.3029.110 Safari/537.36"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isChrome(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) OPR/58.0.3029.110 Safari/537.36"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isChrome(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/58.0.3029.110 Safari/537.36"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isChrome(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/58.0.3029.110 Safari/537.36"
      )
    ).toBe(false);
  });
  /**
   * Tests the `isSafari` function, which detects if the user agent string belongs to the Safari browser.
   *
   * This test creates several sample user agent strings, some for Safari and some for non-Safari browsers, and verifies that the `isSafari` function correctly identifies the Safari browser.
   */
  test("isSafari", () => {
    expect(
      UDABrowserCheck.isSafari(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15"
      )
    ).toBe(true);
    expect(
      UDABrowserCheck.isSafari(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Chrome/605.1.15 Safari/605.1.15"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isSafari(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Chromium/605.1.15 Safari/605.1.15"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isSafari(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Edg/605.1.15 Safari/605.1.15"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isSafari(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Android/605.1.15 Safari/605.1.15"
      )
    ).toBe(false);
  });
  /**
   * Tests the `isUCBrowser` function, which detects if the user agent string belongs to the UC Browser.
   *
   * This test creates two sample user agent strings, one for UC Browser and one for a non-UC Browser, and verifies that the `isUCBrowser` function correctly identifies the UC Browser.
   */
  test("isUCBrowser", () => {
    expect(
      UDABrowserCheck.isUCBrowser(
        "Mozilla/5.0 (Linux; U; Android 4.4.2; zh-CN; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 UCBrowser/10.10.1.575 U3/0.8.0 Mobile Safari/537.36"
      )
    ).toBe(true);
    expect(
      UDABrowserCheck.isUCBrowser(
        "Mozilla/5.0 (Linux; U; Android 4.4.2; zh-CN; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/10.10.1.575 U3/0.8.0 Mobile Safari/537.36"
      )
    ).toBe(false);
  });
  /**
   * Tests the `isFirefox` function, which detects if the user agent string belongs to the Firefox browser.
   *
   * This test creates two sample user agent strings, one for Firefox and one for a non-Firefox browser, and verifies that the `isFirefox` function correctly identifies the Firefox browser.
   */
  test("isFirefox", () => {
    expect(
      UDABrowserCheck.isFirefox(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"
      )
    ).toBe(true);
    expect(
      UDABrowserCheck.isFirefox(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Seamonkey/89.0"
      )
    ).toBe(false);
  });
  /**
   * Tests the `isIE` function, which detects if the user agent string belongs to the Internet Explorer browser.
   *
   * This test creates two sample user agent strings, one for Internet Explorer and one for a non-IE browser, and verifies that the `isIE` function correctly identifies the Internet Explorer browser.
   */
  test("isIE", () => {
    expect(
      UDABrowserCheck.isIE(
        "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)"
      )
    ).toBe(true);
    expect(
      UDABrowserCheck.isIE(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      )
    ).toBe(false);
  });
  /**
   * Tests the `isOpera` function, which detects if the user agent string belongs to the Opera browser.
   *
   * This test creates two sample user agent strings, one for Opera and one for a non-Opera browser, and verifies that the `isOpera` function correctly identifies the Opera browser.
   */
  test("isOpera", () => {
    expect(
      UDABrowserCheck.isOpera(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 OPR/45.0.2552.898"
      )
    ).toBe(true);
    expect(
      UDABrowserCheck.isOpera(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      )
    ).toBe(false);
  });
  /**
   * Tests the `isSamsungInternet` function, which detects if the user agent string belongs to the Samsung Internet browser.
   *
   * This test creates two sample user agent strings, one for the Samsung Internet browser and one for a non-Samsung browser, and verifies that the `isSamsungInternet` function correctly identifies the Samsung Internet browser.
   */
  test("isSamsungInternet", () => {
    expect(
      UDABrowserCheck.isSamsungInternet(
        "Mozilla/5.0 (Linux; Android 10; SAMSUNG SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/13.2 Chrome/79.0.3945.136 Mobile Safari/537.36"
      )
    ).toBe(true);
    expect(
      UDABrowserCheck.isSamsungInternet(
        "Mozilla/5.0 (Linux; Android 10; SAMSUNG SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36"
      )
    ).toBe(false);
  });
  /**
   * Tests the `isAndroidBrowser` function, which detects if the user agent string belongs to an Android browser.
   *
   * This test creates two sample user agent strings, one for a Chrome-based Android browser and one for a non-Android browser, and verifies that the `isAndroidBrowser` function correctly identifies the Android browser.
   */
  test("isAndroidBrowser", () => {
    expect(
      UDABrowserCheck.isAndroidBrowser(
        "Mozilla/5.0 (Linux; Android 10; SAMSUNG SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isAndroidBrowser(
        "Mozilla/5.0 (Linux; Android 10; SAMSUNG SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.136 Mobile Safari/537.36"
      )
    ).toBe(true);
  });
  /**
   * Tests the `isEdge` function, which detects if the user agent string belongs to the Microsoft Edge browser.
   *
   * This test creates two sample user agent strings, one for Edge and one for Chrome, and verifies that the `isEdge` function correctly identifies the Edge browser.
   */
  test("isEdge", () => {
    expect(
      UDABrowserCheck.isEdge(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
      )
    ).toBe(true);
    expect(
      UDABrowserCheck.isEdge(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      )
    ).toBe(false);
  });
  /**
   * Tests the `detectBrowserName` function, which detects the name of the browser from the user agent string.
   *
   * This test creates several sample user agent strings and verifies that the `detectBrowserName` function correctly identifies the browser name for each one.
   */
  test("detectBrowserName", () => {
    expect(
      UDABrowserCheck.detectBrowserName(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      )
    ).toBe("Chrome");
    expect(
      UDABrowserCheck.detectBrowserName(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15"
      )
    ).toBe("Safari");
    expect(
      UDABrowserCheck.detectBrowserName(
        "Mozilla/5.0 (Linux; U; Android 4.4.2; zh-CN; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 UCBrowser/10.10.1.575 U3/0.8.0 Mobile Safari/537.36"
      )
    ).toBe("UC Browser");
    expect(
      UDABrowserCheck.detectBrowserName(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"
      )
    ).toBe("Firefox");
    expect(
      UDABrowserCheck.detectBrowserName(
        "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)"
      )
    ).toBe("IE");
    expect(
      UDABrowserCheck.detectBrowserName(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 OPR/45.0.2552.898"
      )
    ).toBe("Opera");
    expect(
      UDABrowserCheck.detectBrowserName(
        "Mozilla/5.0 (Linux; Android 10; SAMSUNG SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/13.2 Chrome/79.0.3945.136 Mobile Safari/537.36"
      )
    ).toBe("Samsung Internet");
    expect(
      UDABrowserCheck.detectBrowserName(
        "Mozilla/5.0 (Linux; Android 10; SAMSUNG SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.136 Mobile Safari/537.36"
      )
    ).toBe("Android Browser");
    expect(
      UDABrowserCheck.detectBrowserName(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
      )
    ).toBe("Edge");
  });

  /**
   * Tests the `detectBrowserVersion` function, which detects the version of the specified browser from the user agent string.
   *
   * This test creates a mock `navigator` object with a sample user agent string, and then calls the `detectBrowserVersion` function to verify that it correctly identifies the version of Chrome as 58, the version of Safari as 537, and that it returns `null` for other browsers.
   */
  test("detectBrowserVersion", () => {
    const nav = {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    };
    expect(UDABrowserCheck.detectBrowserVersion(nav, "Chrome")).toBe(58);
    expect(UDABrowserCheck.detectBrowserVersion(nav, "Safari")).toBe(537);
    expect(UDABrowserCheck.detectBrowserVersion(nav, "UC Browser")).toBe(null);
    expect(UDABrowserCheck.detectBrowserVersion(nav, "Firefox")).toBe(null);
    expect(UDABrowserCheck.detectBrowserVersion(nav, "IE")).toBe(null);
    expect(UDABrowserCheck.detectBrowserVersion(nav, "Opera")).toBe(null);
    expect(UDABrowserCheck.detectBrowserVersion(nav, "Samsung Internet")).toBe(
      null
    );
    expect(UDABrowserCheck.detectBrowserVersion(nav, "Android Browser")).toBe(
      null
    );
    expect(UDABrowserCheck.detectBrowserVersion(nav, "Edge")).toBe(null);
  });
  /**
   * Tests the `detectBrowserNameAndVersion` function, which detects the browser name and version from the user agent string.
   *
   * This test creates a mock `navigator` object with a sample user agent string, and then calls the `detectBrowserNameAndVersion` function to verify that it correctly identifies the browser name as "Chrome" and the version as 58.
   */
  test("detectBrowserNameAndVersion", () => {
    const nav = {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    };
    expect(UDABrowserCheck.detectBrowserNameAndVersion(nav)).toEqual({
      name: "Chrome",
      version: 58,
    });
  });

  /**
   * Tests that the `isChrome` function correctly identifies Chrome browser user agent strings.
   */
  test("isChrome with different user agent strings", () => {
    expect(
      UDABrowserCheck.isChrome(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      )
    ).toBe(true);
    expect(
      UDABrowserCheck.isChrome(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edg/109.0.0.0"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isChrome(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 OPR/45.0.2552.898"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isChrome(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 SamsungBrowser/13.2"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isChrome(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 UCBrowser/13.2.0.1216"
      )
    ).toBe(false);
  });
  /**
   * Tests that the `isSafari` function correctly identifies Safari browser user agent strings.
   */
  test("isSafari with different user agent strings", () => {
    expect(
      UDABrowserCheck.isSafari(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15"
      )
    ).toBe(true);
    expect(
      UDABrowserCheck.isSafari(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15 Chrome/87.0.4280.88"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isSafari(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15 Edg/87.0.664.66"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isSafari(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15 OPR/73.0.3856.344"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isSafari(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15 SamsungBrowser/13.2"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isSafari(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15 UCBrowser/13.2.0.1216"
      )
    ).toBe(false);
  });
  /**
   * Tests that the `isUCBrowser` function correctly identifies UC Browser user agent strings.
   */
  test("isUCBrowser with different user agent strings", () => {
    expect(
      UDABrowserCheck.isUCBrowser(
        "Mozilla/5.0 (Linux; U; Android 4.4.2; zh-CN; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 UCBrowser/10.10.1.575 U3/0.8.0 Mobile Safari/537.36"
      )
    ).toBe(true);
    expect(
      UDABrowserCheck.isUCBrowser(
        "Mozilla/5.0 (Linux; U; Android 4.4.2; zh-CN; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/10.10.1.575 U3/0.8.0 Mobile Safari/537.36"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isUCBrowser(
        "Mozilla/5.0 (Linux; U; Android 4.4.2; zh-CN; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Edg/10.10.1.575 U3/0.8.0 Mobile Safari/537.36"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isUCBrowser(
        "Mozilla/5.0 (Linux; U; Android 4.4.2; zh-CN; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 OPR/10.10.1.575 U3/0.8.0 Mobile Safari/537.36"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isUCBrowser(
        "Mozilla/5.0 (Linux; U; Android 4.4.2; zh-CN; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 SamsungBrowser/10.1.1.575 U3/0.8.0 Mobile Safari/537.36"
      )
    ).toBe(false);
  });
  /**
   * Tests that the `isFirefox` function correctly identifies Firefox browser user agent strings.
   */
  test("isFirefox with different user agent strings", () => {
    expect(
      UDABrowserCheck.isFirefox(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"
      )
    ).toBe(true);
    expect(
      UDABrowserCheck.isFirefox(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0 Chrome/89.0.4389.114"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isFirefox(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0 Edg/89.0.774.76"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isFirefox(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0 OPR/75.0.3969.149"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isFirefox(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0 SamsungBrowser/13.2"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isFirefox(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0 UCBrowser/13.2.0.1216"
      )
    ).toBe(false);
  });
  /**
   * Tests that the `isIE` function correctly identifies Internet Explorer browser user agent strings.
   */
  test("isIE with different user agent strings", () => {
    expect(
      UDABrowserCheck.isIE(
        "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)"
      )
    ).toBe(true);
    expect(
      UDABrowserCheck.isIE(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isIE(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isIE(
        "Mozilla/5.0 (Linux; U; Android 4.4.2; zh-CN; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 UCBrowser/10.10.1.575 U3/0.8.0 Mobile Safari/537.36"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isIE(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"
      )
    ).toBe(false);
  });
  /**
   * Tests that the `isOpera` function correctly identifies Opera browser user agent strings.
   */
  test("isOpera with different user agent strings", () => {
    expect(
      UDABrowserCheck.isOpera(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 OPR/45.0.2552.898"
      )
    ).toBe(true);
    expect(
      UDABrowserCheck.isOpera(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isOpera(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isOpera(
        "Mozilla/5.0 (Linux; U; Android 4.4.2; zh-CN; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 UCBrowser/10.10.1.575 U3/0.8.0 Mobile Safari/537.36"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isOpera(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"
      )
    ).toBe(false);
  });
  /**
   * Tests that the `isSamsungInternet` function correctly identifies Samsung Internet browser user agent strings.
   */
  test("isSamsungInternet with different user agent strings", () => {
    expect(
      UDABrowserCheck.isSamsungInternet(
        "Mozilla/5.0 (Linux; Android 10; SAMSUNG SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/13.2 Chrome/79.0.3945.136 Mobile Safari/537.36"
      )
    ).toBe(true);
    expect(
      UDABrowserCheck.isSamsungInternet(
        "Mozilla/5.0 (Linux; Android 10; SAMSUNG SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isSamsungInternet(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isSamsungInternet(
        "Mozilla/5.0 (Linux; U; Android 4.4.2; zh-CN; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 UCBrowser/10.10.1.575 U3/0.8.0 Mobile Safari/537.36"
      )
    ).toBe(false);
    expect(
      UDABrowserCheck.isSamsungInternet(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0"
      )
    ).toBe(false);
  });
  /**
   * Tests that the `isChrome` function returns `false` when the user agent string is empty.
   */
  test("isChrome with empty user agent string", () => {
    expect(UDABrowserCheck.isChrome("")).toBe(false);
  });
  /**
   * Tests that the `isSafari` function returns `false` when the user agent string is empty.
   */
  test("isSafari with empty user agent string", () => {
    expect(UDABrowserCheck.isSafari("")).toBe(false);
  });
  /**
   * Tests that the `isUCBrowser` function returns `false` when the user agent string is empty.
   */
  test("isUCBrowser with empty user agent string", () => {
    expect(UDABrowserCheck.isUCBrowser("")).toBe(false);
  });
  /**
   * Tests that the `isFirefox` function returns `false` when the user agent string is empty.
   */
  test("isFirefox with empty user agent string", () => {
    expect(UDABrowserCheck.isFirefox("")).toBe(false);
  });
  /**
   * Tests that the `isIE` function returns `false` when the user agent string is empty.
   */
  test("isIE with empty user agent string", () => {
    expect(UDABrowserCheck.isIE("")).toBe(false);
  });
  /**
   * Tests that the `isOpera` function returns `false` when the user agent string is empty.
   */
  test("isOpera with empty user agent string", () => {
    expect(UDABrowserCheck.isOpera("")).toBe(false);
  });
  /**
   * Tests that the `isSamsungInternet` function returns `false` when the user agent string is empty.
   */
  test("isSamsungInternet with empty user agent string", () => {
    expect(UDABrowserCheck.isSamsungInternet("")).toBe(false);
  });
  /**
   * Tests that the `isAndroidBrowser` function returns `false` when the user agent string is empty.
   */
  test("isAndroidBrowser with empty user agent string", () => {
    expect(UDABrowserCheck.isAndroidBrowser("")).toBe(false);
  });
  /**
   * Tests that the `isEdge` function returns `false` when the user agent string is empty.
   */
  test("isEdge with empty user agent string", () => {
    expect(UDABrowserCheck.isEdge("")).toBe(false);
  });
  /**
   * Tests the `detectBrowserName` function with an empty user agent string.
   * Verifies that the function returns `null` when the user agent string is empty.
   */
  test("detectBrowserName with empty user agent string", () => {
    expect(UDABrowserCheck.detectBrowserName("")).toBe(null);
  });
  /**
   * Tests the `detectBrowserVersion` function with an empty user agent string.
   * Verifies that the function returns `null` for all supported browser types when the user agent string is empty.
   */
  test("detectBrowserVersion with empty user agent string", () => {
    const nav = {
      userAgent: "",
    };
    expect(UDABrowserCheck.detectBrowserVersion(nav, "Chrome")).toBe(null);
    expect(UDABrowserCheck.detectBrowserVersion(nav, "Safari")).toBe(null);
    expect(UDABrowserCheck.detectBrowserVersion(nav, "UC Browser")).toBe(null);
    expect(UDABrowserCheck.detectBrowserVersion(nav, "Firefox")).toBe(null);
    expect(UDABrowserCheck.detectBrowserVersion(nav, "IE")).toBe(null);
    expect(UDABrowserCheck.detectBrowserVersion(nav, "Opera")).toBe(null);
    expect(UDABrowserCheck.detectBrowserVersion(nav, "Samsung Internet")).toBe(
      null
    );
    expect(UDABrowserCheck.detectBrowserVersion(nav, "Android Browser")).toBe(
      null
    );
    expect(UDABrowserCheck.detectBrowserVersion(nav, "Edge")).toBe(null);
  });
});
