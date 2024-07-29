import { UDACustomCss } from "../modules/customCss";

/**
 * Sets up the initial state of the `UDACustomCss` object before each test.
 *
 * This `beforeEach` block resets the `src` and `loaded` properties of the `UDACustomCss` object to their initial values before each test is run. This ensures that the tests are independent and do not rely on the state of the `UDACustomCss` object from previous tests.
 */
describe("UDACustomCss", () => {
  beforeEach(() => {
    // Reset the UDACustomCss object before each test
    UDACustomCss.src = "";
    UDACustomCss.loaded = false;
  });

  /**
   * Tests that the `UDACustomCss` component is in its initial state, with an empty `src` property and `loaded` property set to `false`.
   *
   * This test verifies that the `UDACustomCss` component is in its expected initial state before any updates are made.
   */
  test("initial state", () => {
    expect(UDACustomCss.src).toBe("");
    expect(UDACustomCss.loaded).toBe(false);
  });

  /**
   * Tests that the `UDACustomCss` component correctly updates the `url` property and sets the `loaded` property to `true` when the `url` property is set to a new value.
   *
   * This test verifies that the `UDACustomCss` component can handle updates to the `url` property and correctly updates the `loaded` property to indicate that the CSS has been loaded.
   */
  test("setting url property", () => {
    const testUrl = "https://example.com/style.css";
    UDACustomCss.url = testUrl;

    expect(UDACustomCss.src).toBe(testUrl);
    expect(UDACustomCss.loaded).toBe(true);
  });

  /**
   * Tests that the `UDACustomCss` component correctly returns the current value of the `url` property.
   *
   * This test verifies that the `UDACustomCss` component correctly updates the `url` property when the `src` property is set to a new value.
   */
  test("getting url property", () => {
    const testUrl = "https://example.com/style.css";
    UDACustomCss.src = testUrl;

    expect(UDACustomCss.url).toBe(testUrl);
  });

  /**
   * Tests that the `UDACustomCss` component correctly dispatches a `UDALoadCustomCSS` event each time the `url` property is updated.
   *
   * This test verifies that the `UDACustomCss` component dispatches the expected custom event when the `url` property is set to different values.
   */
  test("custom event dispatch when setting url", () => {
    const mockDispatchEvent = jest.spyOn(document, "dispatchEvent");

    const testUrl = "https://example.com/style.css";

    UDACustomCss.url = testUrl;

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
 * Tests that the `UDACustomCss` component correctly maintains the `loaded` property as `true` even when the `url` property is set to different values.
 *
 * This test verifies that the `UDACustomCss` component can handle multiple updates to the `url` property without affecting the `loaded` property.
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
 * Tests that setting the `url` property to an empty string correctly updates the `src` property to the same value, and sets the `loaded` property to `false`.
 *
 * This test verifies that the `UDACustomCss` component can handle an empty string value for the `url` property, and that it correctly updates the `src` and `loaded` properties accordingly.
 */
test("setting url to empty string", () => {
  UDACustomCss.url = "";
  expect(UDACustomCss.src).toBe("");
  expect(UDACustomCss.loaded).toBe(false);
});

/**
 * Tests that setting the `url` property to `null` or `undefined` correctly updates the `src` property to the same value, and sets the `loaded` property to `false`.
 *
 * This test verifies that the `UDACustomCss` component can handle non-string values for the `url` property, and that it correctly updates the `src` and `loaded` properties accordingly.
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
 * Tests that the `UDACustomCss` component correctly dispatches a `UDALoadCustomCSS` event each time the `url` property is updated.
 *
 * This test verifies that the `UDACustomCss` component dispatches the expected custom event when the `url` property is set to different values.
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
 * Tests that the `loaded` property remains `true` after multiple updates to the `url` property.
 *
 * This test verifies that the `UDACustomCss` component correctly maintains the `loaded` property as `true` even when the `url` property is set to different values.
 */
test("loaded property remains true after multiple url sets", () => {
  UDACustomCss.url = "https://example.com/style1.css";
  expect(UDACustomCss.loaded).toBe(true);

  UDACustomCss.url = "https://example.com/style2.css";
  expect(UDACustomCss.loaded).toBe(true);
});

/**
 * Tests that setting the `url` property to a URL with special characters (e.g. query parameters, fragment identifier) still updates the `src` property to the same value, and sets the `loaded` property to `true`.
 *
 * This test verifies that the `UDACustomCss` component can handle URLs with special characters, and that it correctly updates the `src` and `loaded` properties accordingly.
 */
test("setting url with special characters", () => {
  const specialUrl =
    "https://example.com/style.css?version=1&theme=dark#section";
  UDACustomCss.url = specialUrl;
  expect(UDACustomCss.src).toBe(specialUrl);
  expect(UDACustomCss.loaded).toBe(true);
});

/**
 * Tests that setting the `url` property to a non-string value still updates the `src` property to the same value, and sets the `loaded` property to `true`.
 *
 * This test verifies that the `UDACustomCss` component can handle non-string values for the `url` property, and that it correctly updates the `src` and `loaded` properties accordingly.
 */
test("setting url with non-string value", () => {
  UDACustomCss.url = 123 as any;
  expect(UDACustomCss.src).toBe(123);
  expect(UDACustomCss.loaded).toBe(true);
});

/**
 * Tests that setting the `src` property directly updates the `url` property to the same value.
 *
 * This test verifies that modifying the `src` property directly, without going through the `url` property, still updates the `url` property to the same value.
 */
test("getting url after direct src modification", () => {
  UDACustomCss.src = "https://example.com/direct.css";
  expect(UDACustomCss.url).toBe("https://example.com/direct.css");
});

/**
 * Tests that the `loaded` property remains `false` if the `url` property is not set.
 *
 * This test verifies that setting the `src` property directly does not affect the `loaded` property, which should only be set to `true` when the `url` property is set to a valid URL.
 */
test("loaded property remains false if url is not set", () => {
  expect(UDACustomCss.loaded).toBe(false);
  UDACustomCss.src = "https://example.com/style.css";
  expect(UDACustomCss.loaded).toBe(false);
});

/**
 * Tests that the `dispatchEvent` method is called with the expected detail object when the `UDACustomCss.url` property is set.
 *
 * The detail object should contain a `data` property with the value `"UDALoadCustomCSS"`.
 */
test("custom event detail structure", () => {
  const mockDispatchEvent = jest.spyOn(document, "dispatchEvent");
  UDACustomCss.url = "https://example.com/style.css";

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
 * Resets the `UDACustomCss.url` and `UDACustomCss.loaded` properties to their default values before each test.
 */
describe("UDACustomCss", () => {
  beforeEach(() => {
    UDACustomCss.url = "";
    UDACustomCss.loaded = false;
  });

  /**
   * Tests that setting the `UDACustomCss.url` property to a valid string URL sets the `url` property to the provided value and the `loaded` property to `true`.
   */
  test("should set valid string URL", () => {
    const validUrl = "https://example.com/style.css";
    UDACustomCss.url = validUrl;
    expect(UDACustomCss.url).toBe(validUrl);
    expect(UDACustomCss.loaded).toBe(true);
  });

  /**
   * Tests that setting the `UDACustomCss.url` property to `null` sets the `url` property to `null` and the `loaded` property to `false`.
   */
  test("should set URL to null", () => {
    UDACustomCss.url = null;
    expect(UDACustomCss.url).toBeNull();
    expect(UDACustomCss.loaded).toBe(false);
  });

  /**
   * Tests that setting the `UDACustomCss.url` property to `undefined` sets the `url` property to `undefined` and the `loaded` property to `false`.
   */
  test("should set URL to undefined", () => {
    UDACustomCss.url = undefined;
    expect(UDACustomCss.url).toBeUndefined();
    expect(UDACustomCss.loaded).toBe(false);
  });

  /**
   * Tests that setting the `UDACustomCss.url` property to an invalid URL type (e.g. a number) throws an error.
   */
  test("should throw error for invalid URL type", () => {
    const invalidUrl = 123;
    expect(() => {
      UDACustomCss.url = invalidUrl as any;
    }).toThrow("Invalid URL type. Expected string, null, or undefined.");
    expect(UDACustomCss.url).toBe("");
    expect(UDACustomCss.loaded).toBe(false);
  });

  /**
   * Tests that setting the `UDACustomCss.url` property to a valid URL dispatches a custom "UDALoadCustomCSS" event.
   */
  test("should dispatch custom event when valid URL is set", () => {
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
    const dispatchEventSpy = jest.spyOn(document, "dispatchEvent");
    /**
     * Tests that setting the `UDACustomCss.url` property to `null` does not dispatch a custom "UDALoadCustomCSS" event.
     */
    UDACustomCss.url = null;
    expect(dispatchEventSpy).not.toHaveBeenCalled();
  });
});
