import { UDACustomCss } from "../modules/customCss";

/**
 * Resets the UDACustomCss object before each test in the suite.
 * This ensures a clean state for each test, preventing any unintended
 * side effects from previous tests.
 */
describe("UDACustomCss", () => {
  beforeEach(() => {
    // Reset the UDACustomCss object before each test
    UDACustomCss.src = "";
    UDACustomCss.loaded = false;
  });

  /**
   * Tests the initial state of the UDACustomCss object, ensuring that the `src` property is an empty string and the `loaded` property is `false`.
   */
  test("initial state", () => {
    expect(UDACustomCss.src).toBe("");
    expect(UDACustomCss.loaded).toBe(false);
  });
  /**
   * Tests setting the `url` property of the `UDACustomCss` object and verifies that the `src` property is updated with the provided URL, and the `loaded` property is set to `true`.
   */

  test("setting url property", () => {
    const testUrl = "https://example.com/style.css";
    UDACustomCss.url = testUrl;

    expect(UDACustomCss.src).toBe(testUrl);
    expect(UDACustomCss.loaded).toBe(true);
  });
  /**
   * Tests getting the `url` property of the `UDACustomCss` object, ensuring that it returns the expected URL value.
   */

  test("getting url property", () => {
    const testUrl = "https://example.com/style.css";
    UDACustomCss.src = testUrl;

    expect(UDACustomCss.url).toBe(testUrl);
  });

  /**
   * Tests that the `UDACustomCss` object dispatches a custom event with the expected properties when the `url` property is set.
   */
  test("custom event dispatch when setting url", () => {
    const mockDispatchEvent = jest.spyOn(document, "dispatchEvent");
    /**
     * Defines a test URL for use in the UDACustomCss tests.
     */
    const testUrl = "https://example.com/style.css";

    UDACustomCss.url = testUrl;

    /**
     * Asserts that the `mockDispatchEvent` function was called with the expected arguments, which should include an object containing the expected properties for the custom event that was dispatched.
     */
    expect(mockDispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "UDALoadCustomCSS",
        detail: { data: "UDALoadCustomCSS" },
        bubbles: false,
        cancelable: false,
      })
    );

    mockDispatchEvent.mockRestore();
  });
});
/**
 * Tests setting the `url` property of the `UDACustomCss` object multiple times and verifies that the `src` property is updated with the latest provided URL, and the `loaded` property remains `true`.
 */

test("setting url multiple times", () => {
  const url1 = "https://example.com/style1.css";
  const url2 = "https://example.com/style2.css";

  UDACustomCss.url = url1;
  expect(UDACustomCss.src).toBe(url1);
  expect(UDACustomCss.loaded).toBe(true);

  UDACustomCss.url = url2;
  expect(UDACustomCss.src).toBe(url2);
  expect(UDACustomCss.loaded).toBe(true);
});

/**
 * Tests that setting the `url` property of the `UDACustomCss` object to an empty string updates the `src` property to an empty string, while the `loaded` property remains `true`.
 */
test("setting url to empty string", () => {
  UDACustomCss.url = "";
  expect(UDACustomCss.src).toBe("");
  expect(UDACustomCss.loaded).toBe(false);
});
/**
 * Tests that setting the `url` property of the `UDACustomCss` object to `null` or `undefined` updates the `src` property to the corresponding value, while the `loaded` property remains `true`.
 */

test("setting url to null or undefined", () => {
  UDACustomCss.url = null as any;
  expect(UDACustomCss.src).toBe(null);
  expect(UDACustomCss.loaded).toBe(false);

  UDACustomCss.url = undefined as any;
  expect(UDACustomCss.src).toBe(undefined);
  expect(UDACustomCss.loaded).toBe(false);
});

/**
 * Tests that the `dispatchEvent` method is called the expected number of times when the `url` property of the `UDACustomCss` object is set multiple times.
 */
test("event dispatch count", () => {
  const mockDispatchEvent = jest.spyOn(document, "dispatchEvent");

  UDACustomCss.url = "https://example.com/style1.css";
  UDACustomCss.url = "https://example.com/style2.css";
  UDACustomCss.url = "https://example.com/style3.css";

  expect(mockDispatchEvent).toHaveBeenCalledTimes(3);

  mockDispatchEvent.mockRestore();
});
/**
 * Tests that the `loaded` property of the `UDACustomCss` object remains `true` after setting the `url` property multiple times.
 */

test("loaded property remains true after multiple url sets", () => {
  UDACustomCss.url = "https://example.com/style1.css";
  expect(UDACustomCss.loaded).toBe(true);

  UDACustomCss.url = "https://example.com/style2.css";
  expect(UDACustomCss.loaded).toBe(true);
});

/**
 * Tests that setting the `url` property of the `UDACustomCss` object to a string with special characters (e.g. query parameters, hash fragment) updates the `src` property to the same value, while the `loaded` property remains `true`.
 */
test("setting url with special characters", () => {
  const specialUrl =
    "https://example.com/style.css?version=1&theme=dark#section";
  UDACustomCss.url = specialUrl;
  expect(UDACustomCss.src).toBe(specialUrl);
  expect(UDACustomCss.loaded).toBe(true);
});

/**
 * Tests that setting the `url` property of the `UDACustomCss` object to a non-string value updates the `src` property to the same value, while the `loaded` property remains `true`.
 */
test("setting url with non-string value", () => {
  UDACustomCss.url = 123 as any;
  expect(UDACustomCss.src).toBe(123);
  expect(UDACustomCss.loaded).toBe(true);
});

/**
 * Tests that setting the `src` property of the `UDACustomCss` object directly updates the `url` property to the same value.
 */
test("getting url after direct src modification", () => {
  UDACustomCss.src = "https://example.com/direct.css";
  expect(UDACustomCss.url).toBe("https://example.com/direct.css");
});

/**
 * Tests that the `loaded` property of the `UDACustomCss` object remains `true` after setting the `src` property.
 * This ensures that the `loaded` property is not reset when the `src` property is updated directly.
 */
test("loaded property remains false if url is not set", () => {
  expect(UDACustomCss.loaded).toBe(false);
  UDACustomCss.src = "https://example.com/style.css";
  expect(UDACustomCss.loaded).toBe(false);
});

/**
 * Tests that a custom event with the expected detail structure is dispatched when the `UDACustomCss.url` property is set.
 * The event should have a `detail` property with an object containing a `data` property with the value `"UDALoadCustomCSS"`.
 */
test("custom event detail structure", () => {
  /**
   * Dispatches a custom event when the `UDACustomCss.url` property is set.
   * The event has a `detail` property with an object containing a `data` property with the value `"UDALoadCustomCSS"`.
   */
  const mockDispatchEvent = jest.spyOn(document, "dispatchEvent");
  UDACustomCss.url = "https://example.com/style.css";

  /**
   * Verifies that a custom event with the expected detail structure is dispatched when the `UDACustomCss.url` property is set.
   * The event should have a `detail` property with an object containing a `data` property with the value `"UDALoadCustomCSS"`.
   */
  expect(mockDispatchEvent).toHaveBeenCalledWith(
    expect.objectContaining({
      detail: expect.objectContaining({
        data: "UDALoadCustomCSS",
      }),
    })
  );

  mockDispatchEvent.mockRestore();
});

/**
 * Sets the initial state of the `UDACustomCss` object before each test.
 * This ensures a consistent starting point for the tests by resetting the `url` and `loaded` properties.
 */
describe("UDACustomCss", () => {
  beforeEach(() => {
    UDACustomCss.url = "";
    UDACustomCss.loaded = false;
  });

  /**
   * Tests that setting a valid string URL to the `UDACustomCss.url` property updates the `url` property and sets the `loaded` property to `true`.
   */
  test("should set valid string URL", () => {
    /**
     * Tests that setting a valid string URL to the `UDACustomCss.url` property updates the `url` property and sets the `loaded` property to `true`.
     */
    const validUrl = "https://example.com/style.css";
    UDACustomCss.url = validUrl;
    expect(UDACustomCss.url).toBe(validUrl);
    expect(UDACustomCss.loaded).toBe(true);
  });

  /**
   * Tests that setting the `UDACustomCss.url` property to `null` updates the `url` property to `null` and sets the `loaded` property to `false`.
   */
  test("should set URL to null", () => {
    /**
     * Tests that setting the `UDACustomCss.url` property to `null` updates the `url` property to `null` and sets the `loaded` property to `false`.
     */
    UDACustomCss.url = null;
    expect(UDACustomCss.url).toBeNull();
    expect(UDACustomCss.loaded).toBe(false);
  });

  /**
   * Tests that setting the `UDACustomCss.url` property to `undefined` updates the `url` property to `undefined` and sets the `loaded` property to `false`.
   */
  test("should set URL to undefined", () => {
    /**
     * Tests that setting the `UDACustomCss.url` property to `undefined` updates the `url` property to `undefined` and sets the `loaded` property to `false`.
     */
    UDACustomCss.url = undefined;
    expect(UDACustomCss.url).toBeUndefined();
    expect(UDACustomCss.loaded).toBe(false);
  });

  /**
   * Tests that setting the `UDACustomCss.url` property to an invalid URL type (e.g. a number) throws an error and updates the `url` and `loaded` properties accordingly.
   */
  test("should throw error for invalid URL type", () => {
    /**
     * Tests that setting the `UDACustomCss.url` property to an invalid URL type (e.g. a number) throws an error and updates the `url` and `loaded` properties accordingly.
     */
    const invalidUrl = 123;
    expect(() => {
      UDACustomCss.url = invalidUrl as any;
    }).toThrow("Invalid URL type. Expected string, null, or undefined.");
    expect(UDACustomCss.url).toBe("");
    expect(UDACustomCss.loaded).toBe(false);
  });

  /**
   * Tests that setting a valid string URL to the `UDACustomCss.url` property dispatches a custom "UDALoadCustomCSS" event with the detail data "UDALoadCustomCSS".
   */
  test("should dispatch custom event when valid URL is set", () => {
    /**
     * Tests that setting a valid string URL to the `UDACustomCss.url` property dispatches a custom "UDALoadCustomCSS" event with the detail data "UDALoadCustomCSS".
     */
    const dispatchEventSpy = jest.spyOn(document, "dispatchEvent");
    UDACustomCss.url = "https://example.com/style.css";
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "UDALoadCustomCSS",
        detail: { data: "UDALoadCustomCSS" },
      })
    );
  });

  /**
   * Tests that setting the `UDACustomCss.url` property to `null` does not dispatch a custom "UDALoadCustomCSS" event.
   */
  test("should not dispatch custom event when URL is set to null", () => {
    /**
     * Tests that setting the `UDACustomCss.url` property to `null` does not dispatch a custom "UDALoadCustomCSS" event.
     */
    /**
     * Spy on the `dispatchEvent` method of the `document` object to track when custom events are dispatched.
     */
    const dispatchEventSpy = jest.spyOn(document, "dispatchEvent");
    UDACustomCss.url = null;
    expect(dispatchEventSpy).not.toHaveBeenCalled();
  });
});
