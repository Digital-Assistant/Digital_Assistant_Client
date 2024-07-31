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
  /**
   * This block of code sets up a test suite for the `UDACustomCss` class. It includes a `beforeEach` hook that creates a spy on the `document.dispatchEvent` method, and an `afterEach` hook that clears all mocks.
   */
  describe("UDACustomCss", () => {
    let dispatchEventSpy: jest.SpyInstance;

    beforeEach(() => {
      dispatchEventSpy = jest.spyOn(document, "dispatchEvent");
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    /**
     * Tests that setting the `UDACustomCss.url` property to a valid URL dispatches a custom "UDALoadCustomCSS" event.
     * This test verifies that when a valid URL is set for the `UDACustomCss.url` property, the `dispatchEvent` method is called with a `CustomEvent` object that has a `type` of "UDALoadCustomCSS" and a `detail` object with a `data` property set to "UDALoadCustomCSS".
     */
    test("should set url and dispatch event when valid string is provided", () => {
      UDACustomCss.url = "https://example.com/style.css";
      expect(UDACustomCss.url).toBe("https://example.com/style.css");
      expect(UDACustomCss.loaded).toBe(true);
      expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
    });

    /**
     * Tests that setting the `UDACustomCss.url` property to `null` clears the `url` property, sets the `loaded` property to `false`, and does not dispatch a custom "UDALoadCustomCSS" event.
     */
    test("should clear url and not dispatch event when null is provided", () => {
      UDACustomCss.url = null;
      expect(UDACustomCss.url).toBe("");
      expect(UDACustomCss.loaded).toBe(false);
      expect(dispatchEventSpy).not.toHaveBeenCalled();
    });

    /**
     * Tests that setting the `UDACustomCss.url` property to `undefined` clears the `url` property and sets the `loaded` property to `false`, without dispatching a custom "UDALoadCustomCSS" event.
     */
    test("should clear url and not dispatch event when undefined is provided", () => {
      UDACustomCss.url = undefined;
      expect(UDACustomCss.url).toBe("");
      expect(UDACustomCss.loaded).toBe(false);
      expect(dispatchEventSpy).not.toHaveBeenCalled();
    });
    /**
     * Tests that the `UDACustomCss` class correctly throws an error and does not update the `url` or `loaded` properties when an invalid type is provided for the `url` property.
     * The test attempts to set the `url` property to a number, which should throw an error. It then verifies that the `url` and `loaded` properties were not changed, and that the `dispatchEvent` method was not called.
     */

    test("should throw error and not change state when invalid type is provided", () => {
      const originalUrl = UDACustomCss.url;
      const originalLoaded = UDACustomCss.loaded;

      expect(() => {
        // @ts-ignore: Intentionally passing invalid type for testing
        UDACustomCss.url = 123;
      }).toThrow("Invalid URL type. Expected string, null, or undefined.");

      expect(UDACustomCss.url).toBe(originalUrl);
      expect(UDACustomCss.loaded).toBe(originalLoaded);
      expect(dispatchEventSpy).not.toHaveBeenCalled();
    });

    /**
     * Tests that the `UDACustomCss` class correctly updates the `url` property and does not dispatch a `CustomEvent` when an empty string is provided.
     * The test sets the `url` property to an empty string, and then verifies that the `url` property was updated to an empty string, that the `loaded` property is `false`, and that the `dispatchEvent` method was not called.
     */
    test("should not dispatch event when empty string is provided", () => {
      UDACustomCss.url = "";
      expect(UDACustomCss.url).toBe("");
      expect(UDACustomCss.loaded).toBe(false);
      expect(dispatchEventSpy).not.toHaveBeenCalled();
    });
  });
  /**
   * Tests that the `UDACustomCss` class correctly updates the `url` property and dispatches a `CustomEvent` when the `url` property is changed from `null` to a valid string.
   * The test sets the `url` property to `null`, then sets it to a valid string. It then verifies that the `url` property was updated to the new value, that the `loaded` property is `true`, and that the `dispatchEvent` method was called with a `CustomEvent`.
   */

  describe("UDACustomCss", () => {
    // ... (keep existing test cases)

    test("should update url and dispatch event when changing from null to valid string", () => {
      UDACustomCss.url = null;
      UDACustomCss.url = "https://example.com/new-style.css";
      expect(UDACustomCss.url).toBe("https://example.com/new-style.css");
      expect(UDACustomCss.loaded).toBe(true);
      expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
    });

    /**
     * Tests that the `UDACustomCss` class correctly updates the `url` property and does not dispatch a `CustomEvent` when the `url` property is changed from a valid string to `null`.
     * The test sets the `url` property to a valid string, clears the `dispatchEventSpy` mock, then sets the `url` property to `null`.
     * It then verifies that the `url` property was updated to an empty string, that the `loaded` property is `false`, and that the `dispatchEvent` method was not called.
     */
    test("should update url and not dispatch event when changing from valid string to null", () => {
      UDACustomCss.url = "https://example.com/style.css";
      dispatchEventSpy.mockClear();
      UDACustomCss.url = null;
      expect(UDACustomCss.url).toBe("");
      expect(UDACustomCss.loaded).toBe(false);
      expect(dispatchEventSpy).not.toHaveBeenCalled();
    });

    /**
     * Tests that the `UDACustomCss` class correctly updates the `url` property and dispatches a `CustomEvent` when the `url` property is changed between valid string values.
     * The test sets the `url` property to one valid string, clears the `dispatchEventSpy` mock, then sets the `url` property to a different valid string.
     * It then verifies that the `url` property was updated to the new value, that the `loaded` property is `true`, and that the `dispatchEvent` method was called with a `CustomEvent`.
     */
    test("should update url and dispatch event when changing between valid strings", () => {
      UDACustomCss.url = "https://example.com/style1.css";
      dispatchEventSpy.mockClear();
      UDACustomCss.url = "https://example.com/style2.css";
      expect(UDACustomCss.url).toBe("https://example.com/style2.css");
      expect(UDACustomCss.loaded).toBe(true);
      expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
    });

    /**
     * Tests that the `UDACustomCss` class correctly handles leading and trailing whitespace in the `url` property.
     * The test sets the `url` property to a string with leading and trailing whitespace, and then verifies that the
     * `url` property retains the whitespace, that the `loaded` property is set to `true`, and that the `dispatchEvent`
     * method was called with a `CustomEvent`.
     */
    test("should handle leading/trailing whitespace in url", () => {
      UDACustomCss.url = "  https://example.com/style.css  ";
      expect(UDACustomCss.url).toBe("  https://example.com/style.css  ");
      expect(UDACustomCss.loaded).toBe(true);
      expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
    });

    /**
     * Tests that the `UDACustomCss` class logs an error to the console when an exception occurs while setting the `url` property.
     * This test intentionally passes an invalid type (`123`) to the `url` property to trigger the error handling.
     * The test then verifies that the console error function was called with the expected error message and an `Error` object.
     */
    test("should log error to console when exception occurs", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      // @ts-ignore: Intentionally passing invalid type for testing
      UDACustomCss.url = 123;
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error setting UDACustomCss URL:",
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("UDACustomCss", () => {
    // ... (keep existing test cases)

    test("should handle very long URLs", () => {
      const longUrl = "https://example.com/" + "a".repeat(2000) + ".css";
      UDACustomCss.url = longUrl;
      expect(UDACustomCss.url).toBe(longUrl);
      expect(UDACustomCss.loaded).toBe(true);
      expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
    });

    /**
     * Tests that the `UDACustomCss` class correctly handles URLs with special characters, such as spaces and query parameters.
     * The test sets the `url` property to a URL with various special characters, and then verifies that the `url` property
     * is set correctly, that the `loaded` property is set to `true`, and that the `dispatchEvent` method was called with a
     * `CustomEvent`.
     */
    test("should handle URLs with special characters", () => {
      const specialUrl =
        "https://example.com/style%20with%20spaces.css?param=value&special=!@#$%^&*()";
      UDACustomCss.url = specialUrl;
      expect(UDACustomCss.url).toBe(specialUrl);
      expect(UDACustomCss.loaded).toBe(true);
      expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
    });
    /**
     * Tests that the `UDACustomCss` class correctly handles setting the `url` property multiple times in succession.
     * The test sets the `url` property to three different values, and then verifies that the final `url` property
     * matches the last value set, that the `loaded` property is set to `true`, and that the `dispatchEvent`
     * method was called three times.
     */

    test("should handle setting url multiple times in succession", () => {
      UDACustomCss.url = "https://example.com/style1.css";
      UDACustomCss.url = "https://example.com/style2.css";
      UDACustomCss.url = "https://example.com/style3.css";
      expect(UDACustomCss.url).toBe("https://example.com/style3.css");
      expect(UDACustomCss.loaded).toBe(true);
      expect(dispatchEventSpy).toHaveBeenCalledTimes(3);
    });

    /**
     * Tests that the `UDACustomCss` class maintains its state when the `url` property is accessed without being set.
     * This test sets the `url` property to an initial value, then checks that the current `url` and `loaded` properties
     * match the initial values after accessing the `url` property.
     */
    test("should maintain state when getting url without setting", () => {
      UDACustomCss.url = "https://example.com/initial.css";
      const initialUrl = UDACustomCss.url;
      const initialLoaded = UDACustomCss.loaded;

      const currentUrl = UDACustomCss.url;

      expect(currentUrl).toBe(initialUrl);
      expect(UDACustomCss.loaded).toBe(initialLoaded);
    });
  });
});
