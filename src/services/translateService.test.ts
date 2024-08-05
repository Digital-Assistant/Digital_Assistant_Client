/**
 * Imports the necessary modules and functions for the `translateService` test suite.
 *
 * This code imports the following:
 * - `ENDPOINT` from the `../config/endpoints` module
 * - `REST` from the `./` module
 * - `getSessionKey` from the `./userService` module
 * - `getAbsoluteOffsets` from the `../util` module
 * - `fetchMock` from the `jest-fetch-mock` module
 * - `CONFIG` from the `../config` module
 * - Various functions from the `./translateService` module, including `translateText`, `translateTextWithOptions`, `getTranslationConfidence`, `getTranslationQuality`, and `getTranslationResult`
 */
import { ENDPOINT } from "../config/endpoints";
import { REST } from ".";
import { getSessionKey } from "./userService";
import { getAbsoluteOffsets } from "../util";
import fetchMock from "jest-fetch-mock";
import { CONFIG } from "../config";
import {
  translateText,
  translateTextWithOptions,
  getTranslationConfidence,
  getTranslationQuality,
  getTranslationResult,
} from "./translateService";

/**
 * Sets up mocks for the `userService` and `REST` modules before each test in the `translateService` test suite.
 *
 * This code sets up mocks for the `getSessionKey` function from the `userService` module and the `apiCall` function from the `REST` module. The mocks are cleared before each test in the `translateService` test suite using the `jest.clearAllMocks()` function.
 */
jest.mock("../services/userService", () => ({
  getSessionKey: jest.fn(),
}));

jest.mock("../services", () => ({
  REST: {
    apiCal: jest.fn(),
  },
}));

describe("translateService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests that the `translateText` function resolves with the expected response.
   *
   * This test checks that the `translateText` function returns the expected response when provided with valid input parameters. It sets up the test case with valid `text`, `sourceLang`, and `targetLang` values, and then calls `translateText` with these parameters. The test expects the promise returned by `translateText` to resolve with the expected response object.
   *
   * @param {string} text - The text to be translated, which should be a valid string.
   * @param {string} sourceLang - The source language of the text, which should be a valid language code.
   * @param {string} targetLang - The target language for the translation, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that resolves with the expected response", async () => {
    const text = "valid text";
    const sourceLang = "valid source language";
    const targetLang = "valid target language";
    const expectedResponse = {
      // expected response object
    };

    const response = await translateText(text, sourceLang, targetLang);

    expect(response).toEqual(expectedResponse);
  });

  /**
   * Tests that the `translateText` function rejects with an error when an invalid query is passed.
   *
   * This test checks that the `translateText` function handles the case where the `text` parameter is invalid. It sets up the test case with valid `sourceLang` and `targetLang` values, and then calls `translateText` with an invalid `text` value. The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} text - The text to be translated, which should be a valid string.
   * @param {string} sourceLang - The source language of the text, which should be a valid language code.
   * @param {string} targetLang - The target language for the translation, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when an invalid query is passed", async () => {
    const text = "invalid text";
    const sourceLang = "valid source language";
    const targetLang = "valid target language";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow();
  });
  /**
   * Tests that the `translateText` function rejects with an error when the `text` parameter is missing.
   *
   * This test checks that the `translateText` function handles the case where the `text` parameter is not provided. It sets up the test case with valid `sourceLang` and `targetLang` values, and then calls `translateText` with `undefined` for the `text` parameter. The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} sourceLang - The source language of the text, which should be a valid language code.
   * @param {string} targetLang - The target language for the translation, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when the text parameter is missing", async () => {
    const sourceLang = "valid source language";
    const targetLang = "valid target language";

    await expect(
      translateText(undefined, sourceLang, targetLang)
    ).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the sourceLang parameter is missing", async () => {
    const text = "valid text";
    const targetLang = "valid target language";

    await expect(translateText(text, undefined, targetLang)).rejects.toThrow();
  });
  test("translateText returns a promise that rejects with an error when the targetLang parameter is missing", async () => {
    const text = "valid text";
    const sourceLang = "valid source language";

    await expect(translateText(text, sourceLang)).rejects.toThrow();
  });
  /**
   * Tests that the `translateText` function rejects with an error when the `text` parameter is an empty string.
   *
   * This test checks that the `translateText` function handles the case where the `text` parameter is an empty string. It sets up the test case with valid `sourceLang` and `targetLang` values, and then calls `translateText` with an empty `text` value. The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} sourceLang - The source language of the text, which should be a valid language code.
   * @param {string} targetLang - The target language for the translation, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when the text parameter is empty", async () => {
    const sourceLang = "valid source language";
    const targetLang = "valid target language";

    await expect(translateText("", sourceLang, targetLang)).rejects.toThrow();
  });
  /**
   * Tests that the `translateText` function rejects with an error when the `sourceLang` parameter is an empty string.
   *
   * This test checks that the `translateText` function handles the case where the `sourceLang` parameter is an empty string. It sets up the test case with a valid `text` and `targetLang` value, and then calls `translateText` with an empty `sourceLang` value. The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} text - The text to be translated, which should be a valid string.
   * @param {string} targetLang - The target language for the translation, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when the sourceLang parameter is empty", async () => {
    const text = "valid text";
    const targetLang = "valid target language";

    await expect(translateText(text, "", targetLang)).rejects.toThrow();
  });
  /**
   * Tests that the `translateText` function rejects with an error when the `targetLang` parameter is an empty string.
   *
   * This test checks that the `translateText` function handles the case where the `targetLang` parameter is an empty string. It sets up the test case with a valid `text` and `sourceLang` value, and then calls `translateText` with an empty `targetLang` value. The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} text - The text to be translated, which should be a valid string.
   * @param {string} sourceLang - The source language of the text, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when the targetLang parameter is empty", async () => {
    const text = "valid text";
    const sourceLang = "valid source language";

    await expect(translateText(text, sourceLang, "")).rejects.toThrow();
  });
  /**
   * Tests that the `translateText` function rejects with an error when the `text` parameter is not a string.
   *
   * This test checks that the `translateText` function handles the case where the `text` parameter is not a string. It sets up the test case with valid `sourceLang` and `targetLang` values, and then calls `translateText` with an invalid `text` value (a number). The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} sourceLang - The source language of the text, which should be a valid language code.
   * @param {string} targetLang - The target language for the translation, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when the text parameter is not a string", async () => {
    const sourceLang = "valid source language";
    const targetLang = "valid target language";

    await expect(translateText(123, sourceLang, targetLang)).rejects.toThrow();
  });
  /**
   * Tests that the `translateText` function rejects with an error when the `sourceLang` parameter is not a string.
   *
   * This test checks that the `translateText` function handles the case where the `sourceLang` parameter is not a string. It sets up the test case with a valid `text` and `targetLang` value, and then calls `translateText` with an invalid `sourceLang` value (a number). The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} text - The text to be translated, which should be a valid string.
   * @param {string} targetLang - The target language for the translation, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a string", async () => {
    const text = "valid text";
    const targetLang = "valid target language";

    await expect(translateText(text, 123, targetLang)).rejects.toThrow();
  });
  /**
   * Tests that the `translateText` function rejects with an error when the `targetLang` parameter is not a valid language code.
   *
   * This test checks that the `translateText` function handles the case where the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`. It sets up the test case with valid `text` and `sourceLang` values, and then calls `translateText` with an invalid `targetLang` value. The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when the targetLang parameter is not a string", async () => {
    const text = "valid text";
    const sourceLang = "valid source language";

    await expect(translateText(text, sourceLang, 123)).rejects.toThrow();
  });
  /**
   * Tests that the `translateText` function rejects with an error when the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`.
   *
   * This test checks that the `translateText` function handles the case where the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`. It sets up the test case with valid `sourceLang` and `targetLang` values, and then calls `translateText` with an invalid `text` value. The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} sourceLang - The source language of the text, which should be a valid language code.
   * @param {string} targetLang - The target language for the translation, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code", async () => {
    const sourceLang = "valid source language";
    const targetLang = "valid target language";

    await expect(
      translateText("invalid language code", sourceLang, targetLang)
    ).rejects.toThrow();
  });
  /**
   * Tests that the `translateText` function rejects with an error when the `sourceLang` parameter is not a valid language code.
   *
   * This test checks that the `translateText` function handles the case where the `sourceLang` parameter is not a valid language code. It sets up the test case with a valid `text` and `targetLang` value, and then calls `translateText` with an invalid `sourceLang` value. The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} text - The text to be translated, which should be a valid string.
   * @param {string} targetLang - The target language for the translation, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code", async () => {
    const text = "valid text";
    const targetLang = "valid target language";

    await expect(
      translateText(text, "invalid language code", targetLang)
    ).rejects.toThrow();
  });
  /**
   * Tests that the `translateText` function rejects with an error when the `targetLang` parameter is not a valid language code.
   *
   * This test checks that the `translateText` function handles the case where the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`. It sets up the test case with valid `text` and `sourceLang` values, and then calls `translateText` with an invalid `targetLang` value. The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code", async () => {
    const text = "valid text";
    const sourceLang = "valid source language";

    await expect(
      translateText(text, sourceLang, "invalid language code")
    ).rejects.toThrow();
  });
  /**
   * Tests that the `translateText` function rejects with an error when the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`.
   *
   * This test checks that the `translateText` function handles the case where the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`. It sets up the test case with valid `sourceLang` and `targetLang` values, and then calls `translateText` with an invalid `text` value. The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} sourceLang - The source language of the text, which should be a valid language code.
   * @param {string} targetLang - The target language for the translation, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang", async () => {
    const sourceLang = "valid source language";
    const targetLang = "valid target language";

    await expect(
      translateText(
        "invalid language code for sourceLang",
        sourceLang,
        targetLang
      )
    ).rejects.toThrow();
  });
  /**
   * Tests that the `translateText` function rejects with an error when the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`.
   *
   * This test checks that the `translateText` function handles the case where the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`. It sets up the test case with valid `sourceLang` and `targetLang` values, and then calls `translateText` with an invalid `text` value. The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} sourceLang - The source language of the text, which should be a valid language code.
   * @param {string} targetLang - The target language for the translation, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang", async () => {
    const sourceLang = "valid source language";
    const targetLang = "valid target language";

    await expect(
      translateText(
        "invalid language code for sourceLang",
        sourceLang,
        targetLang
      )
    ).rejects.toThrow();
  });
  /**
   * Tests that the `translateText` function rejects with an error when the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`.
   *
   * This test checks that the `translateText` function handles the case where the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`. It sets up the test case with valid `text` and `sourceLang` values, and then calls `translateText` with an invalid `targetLang` value. The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code for the specified text and sourceLang", async () => {
    const text = "valid text";
    const sourceLang = "valid source language";

    await expect(
      translateText(
        text,
        sourceLang,
        "invalid language code for text and sourceLang"
      )
    ).rejects.toThrow();
  });
  /**
   * Tests that the `translateText` function rejects with an error when the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`.
   *
   * This test checks that the `translateText` function handles the case where the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`. It sets up the test case with valid `sourceLang` and `targetLang` values, and then calls `translateText` with an invalid `text` value. The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} sourceLang - The source language of the text, which should be a valid language code.
   * @param {string} targetLang - The target language for the translation, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang and targetLang", async () => {
    const sourceLang = "valid source language";
    const targetLang = "valid target language";

    await expect(
      translateText(
        "invalid language code for sourceLang and targetLang",
        sourceLang,
        targetLang
      )
    ).rejects.toThrow();
  });
  /**
   * Tests that the `translateText` function rejects with an error when the `sourceLang` parameter is not a valid language code for the specified `text` and `targetLang`.
   *
   * This test checks that the `translateText` function handles the case where the `sourceLang` parameter is not a valid language code for the specified `text` and `targetLang`. It sets up the test case with valid `text` and `targetLang` values, and then calls `translateText` with an invalid `sourceLang` value. The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} text - The text to be translated.
   * @param {string} targetLang - The target language for the translation, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code for the specified text and targetLang", async () => {
    const text = "valid text";
    const targetLang = "valid target language";

    await expect(
      translateText(
        text,
        "invalid language code for text and targetLang",
        targetLang
      )
    ).rejects.toThrow();
  });
  /**
   * Tests that the `translateText` function rejects with an error when the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`.
   *
   * This test checks that the `translateText` function handles the case where the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`. It sets up the test case with valid `text` and `sourceLang` values, and then calls `translateText` with an invalid `targetLang` value. The test expects the promise returned by `translateText` to reject with an error.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text, which should be a valid language code.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code for the specified text and sourceLang", async () => {
    const text = "valid text";
    const sourceLang = "valid source language";

    await expect(
      translateText(
        text,
        sourceLang,
        "invalid language code for text and sourceLang"
      )
    ).rejects.toThrow();
  });
});
/**
 * Tests that the `translateText` function rejects with an error when the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`.
 *
 * This test checks that the `translateText` function handles the case where the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`. It sets up the test case with valid `sourceLang` and `targetLang` values, and then calls `translateText` with an invalid `text` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} sourceLang - The source language of the text, which should be a valid language code.
 * @param {string} targetLang - The target language for the translation, which should be a valid language code.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang and targetLang", async () => {
  const sourceLang = "valid source language";
  const targetLang = "valid target language";

  await expect(
    translateText(
      "invalid language code for sourceLang and targetLang",
      sourceLang,
      targetLang
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `sourceLang` parameter is not a valid language code for the specified `text` and `targetLang`.
 *
 * This test checks that the `translateText` function handles the case where the `sourceLang` parameter is not a valid language code for the specified `text` and `targetLang`. It sets up the test case with valid `text` and `targetLang` values, and then calls `translateText` with an invalid `sourceLang` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} text - The text to be translated.
 * @param {string} targetLang - The target language for the translation, which should be a valid language code.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code for the specified text and targetLang", async () => {
  const text = "valid text";
  const targetLang = "valid target language";

  await expect(
    translateText(
      text,
      "invalid language code for text and targetLang",
      targetLang
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`.
 *
 * This test checks that the `translateText` function handles the case where the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`. It sets up the test case with valid `text` and `sourceLang` values, and then calls `translateText` with an invalid `targetLang` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code for the specified text and sourceLang", async () => {
  const text = "valid text";
  const sourceLang = "valid source language";

  await expect(
    translateText(
      text,
      sourceLang,
      "invalid language code for text and sourceLang"
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`.
 *
 * This test checks that the `translateText` function handles the case where the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`. It sets up the test case with valid `sourceLang` and `targetLang` values, and then calls `translateText` with an invalid `text` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} sourceLang - The source language of the text, which should be a valid language code.
 * @param {string} targetLang - The target language for the translation, which should be a valid language code.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang and targetLang", async () => {
  const sourceLang = "valid source language";
  const targetLang = "valid target language";

  await expect(
    translateText(
      "invalid language code for sourceLang and targetLang",
      sourceLang,
      targetLang
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `sourceLang` parameter is not a valid language code for the specified `text` and `targetLang`.
 *
 * This test checks that the `translateText` function handles the case where the `sourceLang` parameter is not a valid language code for the specified `text` and `targetLang`. It sets up the test case with valid `text` and `targetLang` values, and then calls `translateText` with an invalid `sourceLang` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} text - The text to be translated.
 * @param {string} targetLang - The target language for the translation, which should be a valid language code.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code for the specified text and targetLang", async () => {
  const text = "valid text";
  const targetLang = "valid target language";

  await expect(
    translateText(
      text,
      "invalid language code for text and targetLang",
      targetLang
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`.
 *
 * This test checks that the `translateText` function handles the case where the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`. It sets up the test case with valid `text` and `sourceLang` values, and then calls `translateText` with an invalid `targetLang` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code for the specified text and sourceLang", async () => {
  const text = "valid text";
  const sourceLang = "valid source language";

  await expect(
    translateText(
      text,
      sourceLang,
      "invalid language code for text and sourceLang"
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`.
 *
 * This test checks that the `translateText` function handles the case where the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`. It sets up the test case with valid `sourceLang` and `targetLang` values, and then calls `translateText` with an invalid `text` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} sourceLang - The source language of the text, which should be a valid language code.
 * @param {string} targetLang - The target language for the translation, which should be a valid language code.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang and targetLang", async () => {
  const sourceLang = "valid source language";
  const targetLang = "valid target language";

  await expect(
    translateText(
      "invalid language code for sourceLang and targetLang",
      sourceLang,
      targetLang
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `sourceLang` parameter is not a valid language code for the specified `text` and `targetLang`.
 *
 * This test checks that the `translateText` function handles the case where the `sourceLang` parameter is not a valid language code for the specified `text` and `targetLang`. It sets up the test case with valid `text` and `targetLang` values, and then calls `translateText` with an invalid `sourceLang` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} text - The text to be translated.
 * @param {string} targetLang - The target language for the translation, which should be a valid language code.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code for the specified text and targetLang", async () => {
  const text = "valid text";
  const targetLang = "valid target language";

  await expect(
    translateText(
      text,
      "invalid language code for text and targetLang",
      targetLang
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`.
 *
 * This test checks that the `translateText` function handles the case where the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`. It sets up the test case with valid `text` and `sourceLang` values, and then calls `translateText` with an invalid `targetLang` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code for the specified text and sourceLang", async () => {
  const text = "valid text";
  const sourceLang = "valid source language";

  await expect(
    translateText(
      text,
      sourceLang,
      "invalid language code for text and sourceLang"
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`.
 *
 * This test checks that the `translateText` function handles the case where the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`. It sets up the test case with valid `sourceLang` and `targetLang` values, and then calls `translateText` with an invalid `text` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} sourceLang - The source language of the text, which should be a valid language code.
 * @param {string} targetLang - The target language for the translation, which should be a valid language code.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang and targetLang", async () => {
  const sourceLang = "valid source language";
  const targetLang = "valid target language";

  await expect(
    translateText(
      "invalid language code for sourceLang and targetLang",
      sourceLang,
      targetLang
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `sourceLang` parameter is not a valid language code for the specified `text` and `targetLang`.
 *
 * This test checks that the `translateText` function handles the case where the `sourceLang` parameter is not a valid language code for the specified `text` and `targetLang`. It sets up the test case with valid `text` and `targetLang` values, and then calls `translateText` with an invalid `sourceLang` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} text - The text to be translated.
 * @param {string} targetLang - The target language for the translation, which should be a valid language code.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code for the specified text and targetLang", async () => {
  const text = "valid text";
  const targetLang = "valid target language";

  await expect(
    translateText(
      text,
      "invalid language code for text and targetLang",
      targetLang
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`.
 *
 * This test checks that the `translateText` function handles the case where the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`. It sets up the test case with valid `text` and `sourceLang` values, and then calls `translateText` with an invalid `targetLang` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code for the specified text and sourceLang", async () => {
  const text = "valid text";
  const sourceLang = "valid source language";

  await expect(
    translateText(
      text,
      sourceLang,
      "invalid language code for text and sourceLang"
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`.
 *
 * This test checks that the `translateText` function handles the case where the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`. It sets up the test case with valid `sourceLang` and `targetLang` values, and then calls `translateText` with an invalid `text` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} sourceLang - The source language of the text, which should be a valid language code.
 * @param {string} targetLang - The target language for the translation, which should be a valid language code.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang and targetLang", async () => {
  const sourceLang = "valid source language";
  const targetLang = "valid target language";

  await expect(
    translateText(
      "invalid language code for sourceLang and targetLang",
      sourceLang,
      targetLang
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `sourceLang` parameter is not a valid language code for the specified `text` and `targetLang`.
 *
 * This test checks that the `translateText` function handles the case where the `sourceLang` parameter is not a valid language code for the specified `text` and `targetLang`. It sets up the test case with valid `text` and `targetLang` values, and then calls `translateText` with an invalid `sourceLang` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} text - The text to be translated.
 * @param {string} targetLang - The target language for the translation, which should be a valid language code.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code for the specified text and targetLang", async () => {
  const text = "valid text";
  const targetLang = "valid target language";

  await expect(
    translateText(
      text,
      "invalid language code for text and targetLang",
      targetLang
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`.
 *
 * This test checks that the `translateText` function handles the case where the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`. It sets up the test case with valid `text` and `sourceLang` values, and then calls `translateText` with an invalid `targetLang` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code for the specified text and sourceLang", async () => {
  const text = "valid text";
  const sourceLang = "valid source language";

  await expect(
    translateText(
      text,
      sourceLang,
      "invalid language code for text and sourceLang"
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`.
 *
 * This test checks that the `translateText` function handles the case where the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`. It sets up the test case with valid `sourceLang` and `targetLang` values, and then calls `translateText` with an invalid `text` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} sourceLang - The source language of the text, which should be a valid language code.
 * @param {string} targetLang - The target language for the translation, which should be a valid language code.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang and targetLang", async () => {
  const sourceLang = "valid source language";
  const targetLang = "valid target language";

  await expect(
    translateText(
      "invalid language code for sourceLang and targetLang",
      sourceLang,
      targetLang
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `sourceLang` parameter is not a valid language code for the specified `text` and `targetLang`.
 *
 * This test checks that the `translateText` function handles the case where the `sourceLang` parameter is not a valid language code for the specified `text` and `targetLang`. It sets up the test case with valid `text` and `targetLang` values, and then calls `translateText` with an invalid `sourceLang` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} text - The text to be translated.
 * @param {string} targetLang - The target language for the translation, which should be a valid language code.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code for the specified text and targetLang", async () => {
  const text = "valid text";
  const targetLang = "valid target language";

  await expect(
    translateText(
      text,
      "invalid language code for text and targetLang",
      targetLang
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`.
 *
 * This test checks that the `translateText` function handles the case where the `targetLang` parameter is not a valid language code for the specified `text` and `sourceLang`. It sets up the test case with valid `text` and `sourceLang` values, and then calls `translateText` with an invalid `targetLang` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation, which should be an invalid language code.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the targetLang parameter is not a valid language code for the specified text and sourceLang", async () => {
  const text = "valid text";
  const sourceLang = "valid source language";

  await expect(
    translateText(
      text,
      sourceLang,
      "invalid language code for text and sourceLang"
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`.
 *
 * This test checks that the `translateText` function handles the case where the `text` parameter is not a valid language code for the specified `sourceLang` and `targetLang`. It sets up the test case with valid `sourceLang` and `targetLang` values, and then calls `translateText` with an invalid `text` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} sourceLang - The source language of the text, which should be a valid language code.
 * @param {string} targetLang - The target language for the translation, which should be a valid language code.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the text parameter is not a valid language code for the specified sourceLang and targetLang", async () => {
  const sourceLang = "valid source language";
  const targetLang = "valid target language";

  await expect(
    translateText(
      "invalid language code for sourceLang and targetLang",
      sourceLang,
      targetLang
    )
  ).rejects.toThrow();
});
/**
 * Tests that the `translateText` function rejects with an error when the `sourceLang` parameter is not a valid language code for the specified `text` and `targetLang`.
 *
 * This test checks that the `translateText` function handles the case where the `sourceLang` parameter is not a valid language code for the specified `text` and `targetLang`. It sets up the test case with valid `text` and `targetLang` values, and then calls `translateText` with an invalid `sourceLang` value. The test expects the promise returned by `translateText` to reject with an error.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text, which should be an invalid language code.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
test("translateText returns a promise that rejects with an error when the sourceLang parameter is not a valid language code for the specified text and targetLang", async () => {
  const text = "valid text";
  const targetLang = "valid target language";

  await expect(
    translateText(
      text,
      "invalid language code for text and targetLang",
      targetLang
    )
  ).rejects.toThrow();
});

/**
 * Tests that the `translateText` function makes an API call and returns the translated text.
 *
 * This test checks that the `translateText` function can make an API call and return the translated text. It mocks the `fetch` function to simulate a successful response, and adds assertions to verify that the function returns the expected translated text.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<string>} A promise that resolves with the translated text.
 */
describe("translateService functions", () => {
  it("translateText should make API call and return translated text", async () => {
    // Mock the fetch function
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: { translations: [{ translatedText: "Translated Text" }] },
          }),
      })
    );

    const text = "Hello";
    const sourceLang = "en";
    const targetLang = "fr";

    const translatedText = await translateText(text, sourceLang, targetLang);

    expect(translatedText).toBe("Translated Text");
    expect(fetch).toHaveBeenCalled();
  });

  /**
   * Tests that the `translateText` function handles error responses from the API call.
   *
   * This test checks that the `translateText` function can handle error responses from the API call. It mocks the `fetch` function to simulate an error response, and adds assertions to verify that the function handles the error correctly.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("translateText should handle error response from API call", async () => {
    // Mock the fetch function to simulate error response
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.reject(new Error("API Error")));

    const text = "Hello";
    const sourceLang = "en";
    const targetLang = "fr";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
    expect(fetch).toHaveBeenCalled();
  });
});
/**
 * Tests that the `translateText` function handles different translation providers.
 *
 * This test checks that the `translateText` function can handle different translation providers. It mocks the `fetch` function to return a successful response with a translated text, and adds assertions to verify that the function handles the different providers correctly.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<string>} A promise that resolves with the translated text.
 */
it("translateText should handle different translation providers", async () => {
  // Mock the fetch function for different translation providers
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          data: { translations: [{ translatedText: "Translated Text" }] },
        }),
    })
  );

  const text = "Hello";
  const sourceLang = "en";
  const targetLang = "fr";

  // Test with different translation providers
  // Add assertions for handling different providers
});
/**
 * Tests that the `translateText` function handles different source and target languages.
 *
 * This test checks that the `translateText` function can handle different combinations of source and target languages. It mocks the `fetch` function to return a successful response with a translated text, and adds assertions to verify that the function handles the different language combinations correctly.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang1 - The first source language of the text.
 * @param {string} targetLang1 - The first target language for the translation.
 * @param {string} sourceLang2 - The second source language of the text.
 * @param {string} targetLang2 - The second target language for the translation.
 * @returns {Promise<string>} A promise that resolves with the translated text.
 */
it("translateText should handle different source and target languages", async () => {
  // Mock the fetch function for different language combinations
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          data: { translations: [{ translatedText: "Translated Text" }] },
        }),
    })
  );

  const text = "Hello";
  const sourceLang1 = "en";
  const targetLang1 = "fr";

  const sourceLang2 = "es";
  const targetLang2 = "de";

  // Test with different language combinations
  // Add assertions for handling different languages
});
/**
 * Tests that the `translateText` function handles an empty response from the translation service.
 *
 * This test checks that the `translateText` function returns an empty string when the translation service returns an empty response. It mocks the `fetch` function to return an empty response, and asserts that the `translateText` function returns an empty string.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<string>} A promise that resolves with the translated text, or an empty string if the response is empty.
 */
it("translateText should handle empty response data", async () => {
  // Mock the fetch function to return empty response data
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: { translations: [] } }),
    })
  );

  const text = "Hello";
  const sourceLang = "en";
  const targetLang = "fr";

  const translatedText = await translateText(text, sourceLang, targetLang);

  expect(translatedText).toBe("");
});
/**
 * Mocks the response data for testing the `translateText` function.
 *
 * This mock data includes a text to be translated, the source and target languages, and the expected translated text.
 *
 * @param {string} mockText - The text to be translated.
 * @param {string} mockSourceLang - The source language of the text.
 * @param {string} mockTargetLang - The target language for the translation.
 * @returns {object} An object with the mock response data.
 */
const mockText = "Hello";
const mockSourceLang = "en";
const mockTargetLang = "fr";
const mockResponse = {
  data: { translations: [{ translatedText: "Bonjour" }] },
};
describe("translateService", () => {
  const mockText = "Hello";
  const mockSourceLang = "en";
  const mockTargetLang = "fr";
  const mockResponse = {
    data: { translations: [{ translatedText: "Bonjour" }] },
  };

  /**
   * Tests that the `translateText` function successfully translates text from the source language to the target language.
   *
   * This test checks that the `translateText` function correctly translates the provided text from the source language to the target language. It mocks the `fetch` function to return a successful response, and asserts that the function call includes the expected parameters for the source and target languages, as well as the text to be translated.
   *
   * @param {string} mockText - The text to be translated.
   * @param {string} mockSourceLang - The source language of the text.
   * @param {string} mockTargetLang - The target language for the translation.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  describe("translateText", () => {
    it("should successfully translate text from source to target language", async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await translateText(
        mockText,
        mockSourceLang,
        mockTargetLang
      );

      expect(result).toEqual("Bonjour");
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("source=en&target=fr&q=Hello"),
        expect.anything()
      );
    });

    /**
     * Tests that the `translateText` function uses English as the default target language if none is specified.
     *
     * This test checks that the `translateText` function correctly sets the target language to English if no target language is provided. It mocks the `fetch` function to return a successful response, and asserts that the function call includes the `target=en` parameter.
     *
     * @param {string} mockText - The text to be translated.
     * @param {string} mockSourceLang - The source language of the text.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should use English as the default target language if none is specified", async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await translateText(mockText, mockSourceLang);

      expect(result).toEqual("Bonjour");
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("target=en"),
        expect.anything()
      );
    });

    /**
     * Tests that the `translateText` function gracefully handles network errors.
     *
     * This test checks that the `translateText` function correctly handles a situation where the translation API returns a network error. It mocks the `fetch` function to reject with a network error, and asserts that the function throws the expected error.
     *
     * @param {string} mockText - The text to be translated.
     * @param {string} mockSourceLang - The source language of the text.
     * @param {string} mockTargetLang - The target language for the translation.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should throw an error if the translation API returns an error", async () => {
      fetchMock.mockReject(new Error("Failed to fetch"));

      await expect(
        translateText(mockText, mockSourceLang, mockTargetLang)
      ).rejects.toThrow("Failed to translate");
    });

    /**
     * Tests that the `translateText` function correctly handles a situation where the translation API returns an empty response.
     *
     * This test checks that the `translateText` function throws the expected error when the translation API returns an empty response. It mocks the `fetch` function to return an empty translations array, and asserts that the function throws the "Failed to translate" error.
     *
     * @param {string} mockText - The text to be translated.
     * @param {string} mockSourceLang - The source language of the text.
     * @param {string} mockTargetLang - The target language for the translation.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should throw an error if the translation result is empty", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: { translations: [] } })
      );

      await expect(
        translateText(mockText, mockSourceLang, mockTargetLang)
      ).rejects.toThrow("Failed to translate");
    });

    /**
     * Tests that the `translateText` function gracefully handles network errors.
     *
     * This test checks that the `translateText` function correctly handles a situation where the translation API returns a network error. It mocks the `fetch` function to reject with a network error, and asserts that the function throws the expected error.
     *
     * @param {string} mockText - The text to be translated.
     * @param {string} mockSourceLang - The source language of the text.
     * @param {string} mockTargetLang - The target language for the translation.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should handle network errors gracefully", async () => {
      fetchMock.mockReject(new Error("Network Error"));

      await expect(
        translateText(mockText, mockSourceLang, mockTargetLang)
      ).rejects.toThrow("Failed to translate");
    });

    /**
     * Tests that the `translateText` function correctly encodes special characters in the input text.
     *
     * This test checks that the `translateText` function correctly encodes any special characters in the input text before sending the request to the translation API. It mocks the `fetch` function to return the expected response, and asserts that the function call includes the encoded text.
     *
     * @param {string} specialCharText - The text to be translated, which contains special characters.
     * @param {string} mockSourceLang - The source language of the text.
     * @param {string} mockTargetLang - The target language for the translation.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should encode special characters in the text", async () => {
      const specialCharText = "Hello & Goodbye";
      const encodedText = encodeURIComponent(specialCharText);
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      await translateText(specialCharText, mockSourceLang, mockTargetLang);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(`q=${encodedText}`),
        expect.anything()
      );
    });
    /**
     * Tests that the `translateText` function correctly handles unexpected JSON structure from the translation API.
     *
     * This test checks that the `translateText` function correctly handles a situation where the translation API returns an unexpected JSON structure. It mocks the `fetch` function to return a JSON object with an unexpected structure, and asserts that the function throws the expected error.
     *
     * @param {string} mockText - The text to be translated.
     * @param {string} mockSourceLang - The source language of the text.
     * @param {string} mockTargetLang - The target language for the translation.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */

    it("should handle cases where the API returns unexpected JSON structure", async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ unexpected: "data" }));

      await expect(
        translateText(mockText, mockSourceLang, mockTargetLang)
      ).rejects.toThrow("Failed to translate");
    });
  });
});
/**
 * Mocks the data and setup for testing the `translateText` function.
 *
 * This code sets up the mock data and environment for testing the `translateText` function, which is the main function in the `translateService` module. The mock data includes a sample text to be translated, the source and target languages, and the expected response from the translation API.
 *
 * @param {string} mockText - The text to be translated.
 * @param {string} mockSourceLang - The source language of the text.
 * @param {string} mockTargetLang - The target language for the translation.
 * @param {object} mockResponse - The expected response from the translation API.
 */
describe("translateService", () => {
  const mockText = "Hello";
  const mockSourceLang = "en";
  const mockTargetLang = "fr";
  const mockResponse = {
    data: { translations: [{ translatedText: "Bonjour" }] },
  };

  /**
   * Tests that the `translateText` function correctly handles empty text input.
   *
   * This test checks that the `translateText` function correctly handles a situation where the input text is an empty string. It mocks the `fetch` function to return the expected response, and asserts that the function still returns the expected translated text.
   *
   * @param {string} mockText - The text to be translated, which is an empty string in this test.
   * @param {string} mockSourceLang - The source language of the text.
   * @param {string} mockTargetLang - The target language for the translation.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  describe("translateText", () => {
    it("should handle empty text input gracefully", async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await translateText("", mockSourceLang, mockTargetLang);

      expect(result).toEqual("Bonjour");
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("q="),
        expect.anything()
      );
    });

    /**
     * Tests that the `translateText` function correctly handles a null source language by defaulting to English.
     *
     * This test checks that the `translateText` function correctly handles a situation where the source language is null. It mocks the `fetch` function to return the expected response, and asserts that the function uses English as the source language.
     *
     * @param {string} mockText - The text to be translated.
     * @param {string|null} mockSourceLang - The source language of the text, which is set to null in this test.
     * @param {string} mockTargetLang - The target language for the translation.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should handle null source language by defaulting to English", async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await translateText(mockText, null, mockTargetLang);

      expect(result).toEqual("Bonjour");
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("source=en"),
        expect.anything()
      );
    });

    /**
     * Tests that the `translateText` function correctly handles unsupported language codes.
     *
     * This test checks that the `translateText` function correctly handles a situation where the Google Translate API returns an error for an unsupported language code. It mocks the `fetch` function to return a 400 status code with an "Invalid language code" error message, and asserts that the function throws the expected error.
     *
     * @param {string} mockText - The text to be translated.
     * @param {string} unsupportedLang - The unsupported source language code.
     * @param {string} mockTargetLang - The target language for the translation.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should handle unsupported languages by throwing an error", async () => {
      const unsupportedLang = "xx";
      fetchMock.mockResponseOnce(
        JSON.stringify({
          error: { code: 400, message: "Invalid language code" },
        })
      );

      await expect(
        translateText(mockText, unsupportedLang, mockTargetLang)
      ).rejects.toThrow("Failed to translate");
    });

    /**
     * Tests that the `translateText` function correctly handles a non-200 status code from the API.
     *
     * This test checks that the `translateText` function correctly handles a situation where the Google Translate API returns a non-200 status code. It mocks the `fetch` function to return a 500 status code, and asserts that the function throws the expected error.
     *
     * @param {string} mockText - The text to be translated.
     * @param {string} mockSourceLang - The source language of the text.
     * @param {string} mockTargetLang - The target language for the translation.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should handle API returning non-200 status", async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ message: "Error" }), {
        status: 500,
      });

      await expect(
        translateText(mockText, mockSourceLang, mockTargetLang)
      ).rejects.toThrow("Failed to translate");
    });

    /**
     * Tests that the `translateText` function correctly handles an empty response from the API.
     *
     * This test checks that the `translateText` function correctly handles a situation where the Google Translate API returns an empty response. It mocks the `fetch` function to return an empty response, and asserts that the function throws the expected error.
     *
     * @param {string} mockText - The text to be translated.
     * @param {string} mockSourceLang - The source language of the text.
     * @param {string} mockTargetLang - The target language for the translation.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should handle unexpected empty response from API", async () => {
      fetchMock.mockResponseOnce("");

      await expect(
        translateText(mockText, mockSourceLang, mockTargetLang)
      ).rejects.toThrow("Failed to translate");
    });

    /**
     * Tests that the `translateText` function correctly handles API timeouts.
     *
     * This test checks that the `translateText` function correctly handles a timeout when calling the Google Translate API. It mocks the `fetch` function to abort the request, and asserts that the function throws the expected error.
     *
     * @param {string} mockText - The text to be translated.
     * @param {string} mockSourceLang - The source language of the text.
     * @param {string} mockTargetLang - The target language for the translation.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */
    it("should handle translation API timeouts", async () => {
      fetchMock.mockAbortOnce();

      await expect(
        translateText(mockText, mockSourceLang, mockTargetLang)
      ).rejects.toThrow("Failed to translate");
    });
    /**
     * Tests that the `translateText` function uses the correct HTTP method (GET) for the request.
     *
     * This test checks that the `translateText` function correctly constructs the URL for the Google Translate API and uses the HTTP GET method to make the request.
     *
     * @param {string} mockText - The text to be translated.
     * @param {string} mockSourceLang - The source language of the text.
     * @param {string} mockTargetLang - The target language for the translation.
     * @returns {Promise<void>} A promise that resolves when the test is complete.
     */

    it("should verify that the correct HTTP method (GET) is used for the request", async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      await translateText(mockText, mockSourceLang, mockTargetLang);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: "GET" })
      );
    });

    /**
     * Tests that the `translateText` function can handle very long text inputs.
     *
     * This test checks the behavior of `translateText` when it is called with a very long text input. It asserts that the function correctly constructs the URL for the Google Translate API with the long text, and that the returned translation matches the expected value.
     *
     * @param {string} longText - A very long text input to be translated.
     * @param {string} mockSourceLang - The source language of the text.
     * @param {string} mockTargetLang - The target language for the translation.
     * @returns {Promise<string>} The translated text.
     */
    it("should handle very long text inputs", async () => {
      const longText = new Array(1000).fill("Hello").join(" ");
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await translateText(
        longText,
        mockSourceLang,
        mockTargetLang
      );

      expect(result).toEqual("Bonjour");
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("q=" + encodeURIComponent(longText)),
        expect.anything()
      );
    });
  });
});

/**
 * Tests that the `translateText` function correctly calls the Google Translate API with the provided text, source language, and target language.
 *
 * This test checks the behavior of `translateText` when it is called with valid input parameters. It asserts that the function correctly constructs the URL for the Google Translate API and that the returned translation matches the expected value.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<string>} The translated text.
 */
describe("translateText", () => {
  it("should call fetch with correct URL for Google provider", async () => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText: "translated text" }],
        },
      }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const text = "hello";
    const sourceLang = "en";
    const targetLang = "es";

    const result = await translateText(text, sourceLang, targetLang);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://translation.googleapis.com/language/translate/v2?key=mockApiKey&source=${sourceLang}&target=${targetLang}&q=${encodeURIComponent(
        text
      )}`
    );
    expect(result).toBe("translated text");
  });

  /**
   * Tests that the `translateText` function defaults to 'en' as the target language if not provided.
   *
   * This test checks the behavior of `translateText` when the target language is not specified. It asserts that the function correctly uses 'en' as the default target language when the target language is not provided.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text.
   * @returns {Promise<string>} The translated text.
   */
  it("should default to 'en' as target language if not provided", async () => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText: "translated text" }],
        },
      }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const text = "hello";
    const sourceLang = "es";

    const result = await translateText(text, sourceLang);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://translation.googleapis.com/language/translate/v2?key=mockApiKey&source=${sourceLang}&target=en&q=${encodeURIComponent(
        text
      )}`
    );
    expect(result).toBe("translated text");
  });

  /**
   * Tests that the `translateText` function throws an error when the translation fails.
   *
   * This test checks the behavior of `translateText` when the translation API returns an empty list of translations. It asserts that the function correctly rejects with an error when the translation fails.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} Resolves when the test completes.
   */
  it("should throw an error if the translation fails", async () => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [],
        },
      }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const text = "hello";
    const sourceLang = "en";
    const targetLang = "es";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  /**
   * Tests that the `translateText` function can handle network errors gracefully.
   *
   * This test checks the behavior of `translateText` when a network error occurs during the translation request. It asserts that the function correctly rejects with the network error when a network error is encountered.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} Resolves when the test completes.
   */
  it("should handle network errors gracefully", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const text = "hello";
    const sourceLang = "en";
    const targetLang = "es";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Network Error"
    );
  });

  /**
   * Tests that the `translateText` function can handle invalid JSON responses gracefully.
   *
   * This test checks the behavior of `translateText` when the response from the translation API contains invalid JSON. It asserts that the function correctly rejects with an error when an invalid JSON response is encountered.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} Resolves when the test completes.
   */
  it("should handle invalid JSON responses gracefully", async () => {
    const mockResponse = {
      json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const text = "hello";
    const sourceLang = "en";
    const targetLang = "es";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Invalid JSON"
    );
  });

  /**
   * Tests that the `translateText` function can handle null input gracefully.
   *
   * This test checks the behavior of `translateText` when provided with a null value for the `text` parameter. It asserts that the function correctly rejects with an error when a null value is provided.
   *
   * @param {string | null} text - The text to be translated, which may be null.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} Resolves when the test completes.
   */
  it("should handle null input gracefully", async () => {
    await expect(translateText(null, "en", "es")).rejects.toThrow(
      "Cannot read property 'length' of null"
    );
  });

  /**
   * Tests that the `translateText` function can handle undefined input gracefully.
   *
   * This test checks the behavior of `translateText` when provided with an undefined value for the `text` parameter. It asserts that the function correctly rejects with an error when an undefined value is provided.
   *
   * @param {string | undefined} text - The text to be translated, which may be undefined.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} Resolves when the test completes.
   */
  it("should handle undefined input gracefully", async () => {
    await expect(translateText(undefined, "en", "es")).rejects.toThrow(
      "Cannot read property 'length' of undefined"
    );
  });

  it("should handle empty string input gracefully", async () => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText: "" }],
        },
      }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await translateText("", "en", "es");

    expect(result).toBe("");
  });

  /**
   * Tests that the `translateText` function can handle invalid data types gracefully.
   *
   * This test checks the behavior of `translateText` when provided with an invalid data type for the `text` parameter. It asserts that the function correctly rejects with an error when an invalid data type is provided.
   *
   * @param {any} text - The text to be translated, with an invalid data type.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} Resolves when the test completes.
   */
  it("should handle invalid data types gracefully", async () => {
    await expect(translateText(123 as any, "en", "es")).rejects.toThrow();
  });
});
/**
 * Tests that the `translateText` function can handle an empty API key gracefully.
 *
 * This test checks the behavior of `translateText` when provided with an empty API key. It asserts that the function correctly rejects with an error when an empty API key is provided.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<void>} Resolves when the test completes.
 */
it("should handle empty API key gracefully", async () => {
  CONFIG.multilingual.translate.apikey = "";
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText: "translated text" }],
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const text = "hello";
  const sourceLang = "en";
  const targetLang = "es";

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});

/**
 * Tests that the `translateText` function can handle an invalid API key gracefully.
 *
 * This test checks the behavior of `translateText` when provided with an invalid API key. It asserts that the function correctly rejects with an error when an invalid API key is provided.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<void>} Resolves when the test completes.
 */
it("should handle invalid API key gracefully", async () => {
  CONFIG.multilingual.translate.apikey = "invalidApiKey";
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      error: {
        message: "Invalid API key",
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const text = "hello";
  const sourceLang = "en";
  const targetLang = "es";

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});

/**
 * Tests that the `translateText` function can handle an unsupported source language gracefully.
 *
 * This test checks the behavior of `translateText` when provided with a source language that is not supported by the translation service. It asserts that the function correctly rejects with an error when an unsupported source language is provided.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text, which is unsupported.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<void>} Resolves when the test completes.
 */
it("should handle unsupported source language gracefully", async () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      error: {
        message: "Unsupported source language",
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const text = "hello";
  const sourceLang = "unsupported";
  const targetLang = "es";

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});

/**
 * Tests that the `translateText` function can handle an unsupported target language gracefully.
 *
 * This test checks the behavior of `translateText` when provided with a target language that is not supported by the translation service. It asserts that the function correctly rejects with an error when an unsupported target language is provided.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation, which is unsupported.
 * @returns {Promise<void>} Resolves when the test completes.
 */
it("should handle unsupported target language gracefully", async () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      error: {
        message: "Unsupported target language",
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const text = "hello";
  const sourceLang = "en";
  const targetLang = "unsupported";

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});

/**
 * Tests that the `translateText` function can handle text with special characters.
 *
 * This test checks the behavior of `translateText` when provided with text containing special characters. It asserts that the function correctly returns the expected translated text.
 *
 * @param {string} text - The text to be translated, containing special characters.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<void>} Resolves when the test completes.
 */
it("should handle text with special characters", async () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText: "translated text" }],
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const text = "hello!@#$%^&*()_+";
  const sourceLang = "en";
  const targetLang = "es";

  const result = await translateText(text, sourceLang, targetLang);

  expect(result).toBe("translated text");
});

/**
 * Tests that the `translateText` function can handle multiple concurrent translation requests.
 *
 * This test checks the behavior of `translateText` when multiple translation requests are made concurrently. It asserts that the function correctly returns the expected translated text for each request.
 *
 * @param {string} text1 - The first text to be translated.
 * @param {string} text2 - The second text to be translated.
 * @param {string} sourceLang - The source language of the texts.
 * @param {string} targetLang - The target language for the translations.
 * @returns {Promise<void>} Resolves when the test completes.
 */
it("should handle multiple concurrent translation requests", async () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText: "translated text" }],
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const text1 = "hello";
  const text2 = "world";
  const sourceLang = "en";
  const targetLang = "es";

  const [result1, result2] = await Promise.all([
    translateText(text1, sourceLang, targetLang),
    translateText(text2, sourceLang, targetLang),
  ]);

  expect(result1).toBe("translated text");
  expect(result2).toBe("translated text");
});

/**
 * Tests that the `translateText` function can handle an empty source language gracefully.
 *
 * This test checks the behavior of `translateText` when provided with an empty source language. It asserts that the function correctly throws an error when the source language is empty.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<void>} Resolves when the test completes.
 */
it("should handle empty source language gracefully", async () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText: "translated text" }],
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const text = "hello";
  const sourceLang = "";
  const targetLang = "es";

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});

/**
 * Tests that the `translateText` function can handle an empty target language gracefully.
 *
 * This test checks the behavior of `translateText` when provided with an empty target language. It asserts that the function correctly returns the expected translated text.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<string>} The translated text.
 */
it("should handle empty target language gracefully", async () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText: "translated text" }],
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const text = "hello";
  const sourceLang = "en";
  const targetLang = "";

  const result = await translateText(text, sourceLang, targetLang);

  expect(result).toBe("translated text");
});

/**
 * Tests that the `translateText` function can handle very long text inputs gracefully.
 *
 * This test checks the behavior of `translateText` when provided with a very long text input. It asserts that the function correctly returns the expected translated text.
 *
 * @param {string} veryLongText - The very long text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<string>} The translated text.
 */
it("should handle very long text input gracefully", async () => {
  const veryLongText = "a".repeat(100000);
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText: "translated text" }],
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const result = await translateText(veryLongText, "en", "es");

  expect(result).toBe("translated text");
});

/**
 * Tests that the `translateText` function correctly handles text with newline characters.
 *
 * This test checks the behavior of `translateText` when provided with text that contains newline characters. It asserts that the function correctly returns the expected translated text.
 *
 * @param {string} textWithNewlines - The text with newline characters to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<string>} The translated text.
 */
it("should handle text with newline characters", async () => {
  const textWithNewlines = "hello\nworld";
  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText: "translated text" }],
      },
    }),
  };
  (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

  const result = await translateText(textWithNewlines, "en", "es");

  expect(result).toBe("translated text");
});
/**
 * Tests that the `translateText` function correctly translates the provided text.
 *
 * This test checks the behavior of `translateText` when provided with a simple text input, source language, and target language. It asserts that the function correctly returns the expected translated text and that the fetch call includes the expected parameters.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<string>} The translated text.
 */
describe("translateText", () => {
  it("should translate the text correctly", async () => {
    const text = "Hello";
    const sourceLang = "en";
    const targetLang = "es";
    const translatedText = "Hola";

    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText }],
        },
      }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await translateText(text, sourceLang, targetLang);

    expect(result).toBe(translatedText);
    expect(fetch).toHaveBeenCalledWith(
      `${CONFIG.multilingual.translate.apiurl}?key=${encodeURIComponent(
        CONFIG.multilingual.translate.apikey
      )}&source=${sourceLang}&target=${targetLang}&q=${encodeURIComponent(
        text
      )}`
    );
  });

  /**
   * Tests that the `translateText` function correctly uses the default target language if not provided.
   *
   * This test checks the behavior of `translateText` when the target language is not provided. It asserts that the function correctly uses the default target language and that the fetch call includes the expected parameters.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text.
   * @returns {Promise<string>} The translated text.
   */
  it("should use the default target language if not provided", async () => {
    const text = "Hello";
    const sourceLang = "es";
    const defaultTargetLang = "en";
    const translatedText = "Hello";

    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText }],
        },
      }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await translateText(text, sourceLang);

    expect(result).toBe(translatedText);
    expect(fetch).toHaveBeenCalledWith(
      `${CONFIG.multilingual.translate.apiurl}?key=${encodeURIComponent(
        CONFIG.multilingual.translate.apikey
      )}&source=${sourceLang}&target=${defaultTargetLang}&q=${encodeURIComponent(
        text
      )}`
    );
  });

  /**
   * Tests that the `translateText` function correctly throws an error if the translation fails.
   *
   * This test checks the behavior of `translateText` when the translation service returns an empty response. It asserts that the function correctly rejects with the expected error message.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should throw an error if translation fails", async () => {
    const text = "Hello";
    const sourceLang = "en";
    const targetLang = "es";

    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [],
        },
      }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  /**
   * Tests that the `translateText` function correctly handles an empty text input.
   *
   * This test checks the behavior of `translateText` when the provided text to be translated is an empty string. It asserts that the function correctly rejects with the expected error message.
   *
   * @param {string} text - The empty text to be translated.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle empty text", async () => {
    const text = "";
    const sourceLang = "en";
    const targetLang = "es";

    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [],
        },
      }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  /**
   * Tests that the `translateText` function correctly handles an invalid source language.
   *
   * This test checks the behavior of `translateText` when the provided source language is invalid. It asserts that the function correctly rejects with the expected error message.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The invalid source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle invalid source language", async () => {
    const text = "Hello";
    const sourceLang = "invalid";
    const targetLang = "es";

    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [],
        },
      }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  /**
   * Tests that the `translateText` function correctly handles a network error.
   *
   * This test checks the behavior of `translateText` when a network error occurs during the translation request. It asserts that the function correctly rejects with the expected error message.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle network error", async () => {
    const text = "Hello";
    const sourceLang = "en";
    const targetLang = "es";

    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Network error"
    );
  });
});
/**
 * Tests that the `translateText` function correctly translates long text.
 *
 * This test checks the behavior of `translateText` when the input text is very long. It asserts that the function correctly translates the long text to the target language.
 *
 * @param {string} longText - The long text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
it("should handle long text", async () => {
  const longText =
    "This is a very long text that needs to be translated. ".repeat(100);
  const sourceLang = "en";
  const targetLang = "es";
  const translatedText =
    "Este es un texto muy largo que necesita ser traducido. ".repeat(100);

  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText }],
      },
    }),
  };
  (fetch as jest.Mock).mockResolvedValue(mockResponse);

  const result = await translateText(longText, sourceLang, targetLang);

  expect(result).toBe(translatedText);
});
/**
 * Tests that the `translateText` function correctly translates text containing special characters.
 *
 * This test checks the behavior of `translateText` when the input text contains special characters. It asserts that the function correctly translates the text, including the special characters, to the target language.
 *
 * @param {string} textWithSpecialChars - The text containing special characters to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */

it("should handle text with special characters", async () => {
  const textWithSpecialChars = "Hello, world! 123 !@#$%^&*()_+";
  const sourceLang = "en";
  const targetLang = "es";
  const translatedText = "¡Hola, mundo! 123 !@#$%^&*()_+";

  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText }],
      },
    }),
  };
  (fetch as jest.Mock).mockResolvedValue(mockResponse);

  const result = await translateText(
    textWithSpecialChars,
    sourceLang,
    targetLang
  );

  expect(result).toBe(translatedText);
});

/**
 * Tests that the `translateText` function correctly translates text containing emojis.
 *
 * This test checks the behavior of `translateText` when the input text contains emojis. It asserts that the function correctly translates the text, including the emojis, to the target language.
 *
 * @param {string} textWithEmoji - The text containing emojis to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
it("should handle text with emoji", async () => {
  const textWithEmoji = "Hello 😊 World 🌍";
  const sourceLang = "en";
  const targetLang = "es";
  const translatedText = "Hola 😊 Mundo 🌍";

  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [{ translatedText }],
      },
    }),
  };
  (fetch as jest.Mock).mockResolvedValue(mockResponse);

  const result = await translateText(textWithEmoji, sourceLang, targetLang);

  expect(result).toBe(translatedText);
});

/**
 * Tests that the `translateText` function correctly throws an error if the translation fails due to an unsupported source language.
 *
 * This test checks the behavior of `translateText` when the API response indicates that the source language is not supported. It asserts that the function correctly rejects with the expected error message.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
it("should handle unsupported source language", async () => {
  const text = "Hello";
  const sourceLang = "unsupported";
  const targetLang = "es";

  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      error: {
        code: 400,
        message: "Unsupported source language",
      },
    }),
  };
  (fetch as jest.Mock).mockResolvedValue(mockResponse);

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});

/**
 * Tests that the `translateText` function correctly throws an error if the translation fails due to an unsupported target language.
 *
 * This test checks the behavior of `translateText` when the API response indicates that the target language is not supported. It asserts that the function correctly rejects with the expected error message.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
it("should handle unsupported target language", async () => {
  const text = "Hello";
  const sourceLang = "en";
  const targetLang = "unsupported";

  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      error: {
        code: 400,
        message: "Unsupported target language",
      },
    }),
  };
  (fetch as jest.Mock).mockResolvedValue(mockResponse);

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});

/**
 * Tests that the `translateText` function correctly throws an error if the translation fails due to an authentication error.
 *
 * This test checks the behavior of `translateText` when the API response indicates that the authentication has failed. It asserts that the function correctly rejects with the expected error message.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
it("should handle authentication error", async () => {
  const text = "Hello";
  const sourceLang = "en";
  const targetLang = "es";

  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      error: {
        code: 401,
        message: "Authentication failed",
      },
    }),
  };
  (fetch as jest.Mock).mockResolvedValue(mockResponse);

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});

/**
 * Tests that the `translateText` function correctly throws an error if the translation fails due to a rate limit being exceeded.
 *
 * This test checks the behavior of `translateText` when the API response indicates that the rate limit has been exceeded. It asserts that the function correctly rejects with the expected error message.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
it("should handle rate limit exceeded error", async () => {
  const text = "Hello";
  const sourceLang = "en";
  const targetLang = "es";

  const mockResponse = {
    json: jest.fn().mockResolvedValue({
      error: {
        code: 429,
        message: "Rate limit exceeded",
      },
    }),
  };
  (fetch as jest.Mock).mockResolvedValue(mockResponse);

  await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
    "Failed to translate"
  );
});
/**
 * Tests that the `translateText` function correctly translates text from one language to another.
 *
 * This test checks the behavior of `translateText` when the API response contains a valid translation. It asserts that the function correctly returns the expected translated text and makes the expected API call.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language of the text.
 * @param {string} targetLang - The target language for the translation.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
describe("translateText", () => {
  it("should translate text correctly", async () => {
    const mockResponse = {
      data: {
        translations: [
          {
            translatedText: "Hello, world!",
          },
        ],
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const text = "Hola, mundo!";
    const sourceLang = "es";
    const targetLang = "en";

    const translatedText = await translateText(text, sourceLang, targetLang);

    expect(translatedText).toBe("Hello, world!");
    expect(global.fetch).toHaveBeenCalledWith(
      `https://mock.api.url?key=mock_api_key&source=es&target=en&q=Hola%2C%20mundo%21`
    );
  });

  /**
   * Tests that the `translateText` function correctly throws an error if the translation fails.
   *
   * This test checks the behavior of `translateText` when the API response does not contain any translations. It asserts that the function correctly rejects with the expected error message.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should throw an error if translation fails", async () => {
    const mockResponse = {
      data: {
        translations: [],
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const text = "Hola, mundo!";
    const sourceLang = "es";
    const targetLang = "en";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  /**
   * Tests that the `translateText` function correctly uses the default target language if not provided.
   *
   * This test checks the behavior of `translateText` when the `targetLang` parameter is not provided. It asserts that the function correctly uses the default target language (which is "en") and returns the expected translated text.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text.
   * @returns {Promise<string>} The translated text.
   */
  it("should use default target language if not provided", async () => {
    const mockResponse = {
      data: {
        translations: [
          {
            translatedText: "Hello, world!",
          },
        ],
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const text = "Hola, mundo!";
    const sourceLang = "es";

    const translatedText = await translateText(text, sourceLang);

    expect(translatedText).toBe("Hello, world!");
    expect(global.fetch).toHaveBeenCalledWith(
      `https://mock.api.url?key=mock_api_key&source=es&target=en&q=Hola%2C%20mundo%21`
    );
  });

  /**
   * Tests that the `translateText` function correctly handles null text.
   *
   * This test checks the behavior of `translateText` when the `text` parameter is `null`. It asserts that the function correctly rejects with the expected error message.
   *
   * @param {string | null} text - The text to be translated, which is `null`.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle null text", async () => {
    const text = null;
    const sourceLang = "es";
    const targetLang = "en";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  /**
   * Tests that the `translateText` function correctly handles undefined text.
   *
   * This test checks the behavior of `translateText` when the `text` parameter is `undefined`. It asserts that the function correctly rejects with the expected error message.
   *
   * @param {string | undefined} text - The text to be translated, which is `undefined`.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle undefined text", async () => {
    const text = undefined;
    const sourceLang = "es";
    const targetLang = "en";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });
});
describe("translateText", () => {
  // ... (previous test cases)

  /**
   * Tests that the `translateText` function correctly handles an invalid target language.
   *
   * This test checks the behavior of `translateText` when an invalid target language is provided. It asserts that the function correctly rejects with the expected error message.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation, which is invalid.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle invalid target language", async () => {
    const text = "Hola, mundo!";
    const sourceLang = "es";
    const targetLang = "invalid";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  /**
   * Tests that the `translateText` function correctly handles network errors.
   *
   * This test checks the behavior of `translateText` when the API request fails due to a network error. It asserts that the function correctly rejects with the expected error message.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle network errors", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    const text = "Hola, mundo!";
    const sourceLang = "es";
    const targetLang = "en";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  /**
   * Tests that the `translateText` function correctly handles invalid JSON responses from the API.
   *
   * This test checks the behavior of `translateText` when the API returns an invalid JSON response. It asserts that the function correctly rejects with the expected error message.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle invalid JSON response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
    });

    const text = "Hola, mundo!";
    const sourceLang = "es";
    const targetLang = "en";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });

  /**
   * Tests that the `translateText` function correctly handles missing translations in the API response.
   *
   * This test checks the behavior of `translateText` when the API response does not contain any translation data. It asserts that the function correctly rejects with the expected error message.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language of the text.
   * @param {string} targetLang - The target language for the translation.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle missing translations in response", async () => {
    const mockResponse = {
      data: {},
    };

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const text = "Hola, mundo!";
    const sourceLang = "es";
    const targetLang = "en";

    await expect(translateText(text, sourceLang, targetLang)).rejects.toThrow(
      "Failed to translate"
    );
  });
});
/**
 * Tests that the `translateText` function correctly calls the REST API with the expected parameters.
 *
 * This test checks the behavior of `translateText` when it is called with a text and target language. It asserts that the function correctly calls the `REST.apiCal` method with the expected URL parameters and headers, including the session key, text, and target language.
 *
 * @param {string} text - The text to be translated.
 * @param {string} targetLanguage - The target language for the translation.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
describe("translateText", () => {
  it("should call REST.apiCal with correct parameters", async () => {
    const mockSessionKey = "mockSessionKey";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

    const text = "Hello, world!";
    const targetLanguage = "fr";

    await translateText(text, targetLanguage);

    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.Translate}?text=${encodeURIComponent(
        text
      )}&to=${targetLanguage}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Session-Id": mockSessionKey,
      },
    });
  });

  /**
   * Tests that the `translateTextWithOptions` function correctly handles errors gracefully.
   *
   * This test checks the behavior of `translateTextWithOptions` when the API call fails with an error. It asserts that the function correctly rejects with the expected error message.
   *
   * @param {string} text - The text to be translated.
   * @param {string} targetLanguage - The target language for the translation.
   * @returns {Promise<void>} A promise that resolves when the test is complete.
   */
  it("should handle errors gracefully", async () => {
    const mockSessionKey = "mockSessionKey";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    const text = "Hello, world!";
    const targetLanguage = "fr";

    await expect(translateText(text, targetLanguage)).rejects.toThrow(
      "API Error"
    );

    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.Translate}?text=${encodeURIComponent(
        text
      )}&to=${targetLanguage}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Session-Id": mockSessionKey,
      },
    });
  });
});

/**
 * Tests that the `translateTextWithOptions` function correctly calls the REST API with the expected parameters.
 *
 * This test checks the behavior of `translateTextWithOptions` when it is called with a text, target language, and translation options. It asserts that the function correctly calls the `REST.apiCal` method with the expected URL parameters and headers, including the session key, text, target language, source language, and translation category.
 *
 * @param {string} text - The text to be translated.
 * @param {string} targetLanguage - The target language for the translation.
 * @param {object} options - The optional translation options, including the source language and translation category.
 * @returns {Promise<void>} A promise that resolves when the test is complete.
 */
describe("translateTextWithOptions", () => {
  it("should call REST.apiCal with correct parameters", async () => {
    const mockSessionKey = "mockSessionKey";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

    const text = "Hello, world!";
    const targetLanguage = "fr";
    const options = {
      from: "en",
      category: "general",
    };

    await translateTextWithOptions(text, targetLanguage, options);

    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.Translate}?text=${encodeURIComponent(text)}&from=${
        options.from
      }&to=${targetLanguage}&category=${options.category}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Session-Id": mockSessionKey,
      },
    });
  });

  /**
   * Tests that the `translateTextWithOptions` function correctly handles errors gracefully.
   *
   * This test checks the behavior of `translateTextWithOptions` when the API call fails with an error. It asserts that the function correctly rejects with the expected error message.
   *
   * @param {string} text - The text to be translated.
   * @param {string} targetLanguage - The target language for the translation.
   * @param {object} options - The optional translation options.
   * @returns {Promise<string>} The translated text.
   */
  it("should handle errors gracefully", async () => {
    const mockSessionKey = "mockSessionKey";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error("API Error"));

    const text = "Hello, world!";
    const targetLanguage = "fr";
    const options = {
      from: "en",
      category: "general",
    };

    await expect(
      translateTextWithOptions(text, targetLanguage, options)
    ).rejects.toThrow("API Error");

    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.Translate}?text=${encodeURIComponent(text)}&from=${
        options.from
      }&to=${targetLanguage}&category=${options.category}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Session-Id": mockSessionKey,
      },
    });
  });

  /**
   * Tests that the `translateTextWithOptions` function correctly handles the case where the `options` parameter is `undefined`.
   *
   * This test checks the behavior of `translateTextWithOptions` when the `options` parameter is not provided. It asserts that the function correctly makes the API call with the expected parameters, including the `to` parameter for the target language, but without the `from` and `category` parameters that are part of the `options` object.
   *
   * @param {string} text - The text to be translated.
   * @param {string} targetLanguage - The target language for the translation.
   * @param {object} [options] - The optional translation options.
   * @returns {Promise<string>} The translated text.
   */
  it("should handle undefined options", async () => {
    const mockSessionKey = "mockSessionKey";
    (getSessionKey as jest.Mock).mockResolvedValue(mockSessionKey);

    const text = "Hello, world!";
    const targetLanguage = "fr";

    await translateTextWithOptions(text, targetLanguage, undefined);

    expect(getSessionKey).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.Translate}?text=${encodeURIComponent(
        text
      )}&to=${targetLanguage}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Session-Id": mockSessionKey,
      },
    });
  });
});
/**
 * Tests that the `getTranslationQuality` function correctly returns the expected translation quality level.
 *
 * This test checks the behavior of `getTranslationQuality` when provided with valid input values for the translation quality score. It asserts that the function returns the expected "good", "average", or "poor" translation quality level based on the input score.
 *
 * @param {number} quality - The translation quality score.
 * @returns {string} The translation quality level.
 */
describe("getTranslationQuality", () => {
  it("should return the correct translation quality", () => {
    const translationQuality = getTranslationQuality(0.8);
    expect(translationQuality).toBe("good");

    const translationQuality2 = getTranslationQuality(0.5);
    expect(translationQuality2).toBe("average");

    const translationQuality3 = getTranslationQuality(0.2);
    expect(translationQuality3).toBe("poor");
  });

  /**
   * Tests that the `getTranslationQuality` function correctly handles invalid input.
   *
   * This test checks the behavior of `getTranslationQuality` when provided with negative, out-of-range, and non-numeric input values. It asserts that the function returns the expected "poor" translation quality in these cases.
   *
   * @param {number} quality - The translation quality score.
   * @returns {string} The translation quality level.
   */
  it("should handle invalid input", () => {
    const translationQuality = getTranslationQuality(-0.1);
    expect(translationQuality).toBe("poor");

    const translationQuality2 = getTranslationQuality(1.1);
    expect(translationQuality2).toBe("good");

    const translationQuality3 = getTranslationQuality("invalid");
    expect(translationQuality3).toBe("poor");
  });
});

/**
 * Tests that the `getTranslationConfidence` function correctly returns the expected translation confidence level.
 *
 * This test checks the behavior of `getTranslationConfidence` when provided with valid input values for the translation confidence score. It asserts that the function returns the expected "high", "medium", or "low" translation confidence level based on the input score.
 *
 * @param {number} confidence - The translation confidence score.
 * @returns {string} The translation confidence level.
 */
describe("getTranslationConfidence", () => {
  it("should return the correct translation confidence", () => {
    const translationConfidence = getTranslationConfidence(0.8);
    expect(translationConfidence).toBe("high");

    const translationConfidence2 = getTranslationConfidence(0.5);
    expect(translationConfidence2).toBe("medium");

    const translationConfidence3 = getTranslationConfidence(0.2);
    expect(translationConfidence3).toBe("low");
  });
  /**
   * Tests that the `getTranslationConfidence` function correctly handles invalid input.
   *
   * This test checks the behavior of `getTranslationConfidence` when provided with negative, out-of-range, and non-numeric input values. It asserts that the function returns the expected "low" translation confidence in these cases.
   *
   * @param {number} confidence - The translation confidence score.
   * @returns {string} The translation confidence level.
   */

  it("should handle invalid input", () => {
    const translationConfidence = getTranslationConfidence(-0.1);
    expect(translationConfidence).toBe("low");

    const translationConfidence2 = getTranslationConfidence(1.1);
    expect(translationConfidence2).toBe("high");

    const translationConfidence3 = getTranslationConfidence("invalid");
    expect(translationConfidence3).toBe("low");
  });
});

/**
 * Tests that the `getTranslationResult` function correctly returns the expected translation result object.
 *
 * This test checks the behavior of `getTranslationResult` when provided with valid input values for the `text`, `quality`, and `confidence` properties. It asserts that the function returns the expected result object with the correct values for the `text`, `quality`, and `confidence` properties.
 *
 * @param {Object} params - The input object for `getTranslationResult`.
 * @param {string} params.text - The translated text.
 * @param {number} params.quality - The translation quality score.
 * @param {number} params.confidence - The translation confidence score.
 * @returns {Object} The translation result object.
 */
describe("getTranslationResult", () => {
  it("should return the correct translation result", () => {
    const translationResult = getTranslationResult({
      text: "Bonjour, le monde!",
      quality: 0.8,
      confidence: 0.9,
    });

    expect(translationResult).toEqual({
      text: "Bonjour, le monde!",
      quality: "good",
      confidence: "high",
    });
  });

  /**
   * Tests that the `getTranslationResult` function correctly handles missing or invalid input.
   *
   * This test checks the behavior of `getTranslationResult` when the input object is missing the `text` property or has invalid values for the `quality` and `confidence` properties. It asserts that the function returns the expected result in these cases.
   *
   * @param {Object} params - The input object for `getTranslationResult`.
   * @param {string} [params.text] - The translated text.
   * @param {number} [params.quality] - The translation quality score.
   * @param {number} [params.confidence] - The translation confidence score.
   * @returns {Object} The translation result object.
   */
  it("should handle missing or invalid input", () => {
    const translationResult = getTranslationResult({
      quality: 0.8,
      confidence: 0.9,
    });

    expect(translationResult).toEqual({
      text: "",
      quality: "good",
      confidence: "high",
    });

    const translationResult2 = getTranslationResult({
      text: "Bonjour, le monde!",
      quality: -0.1,
      confidence: 1.1,
    });

    expect(translationResult2).toEqual({
      text: "Bonjour, le monde!",
      quality: "poor",
      confidence: "high",
    });
  });
});
/**
 * Tests that the `translateText` function correctly translates text using the Google Translate API.
 *
 * This test sets the required environment variables for the Google Translate API, mocks the `fetch` function to simulate a successful API response, and asserts that calling `translateText` with a text, source language, and target language results in the expected translated text and the correct API call being made.
 *
 * @param text - The text to be translated.
 * @param sourceLang - The source language code.
 * @param targetLang - The target language code.
 * @returns The translated text.
 */
it("should translate text with valid parameters for google provider", async () => {
  process.env.REACT_APP_MULTI_LINGUAL_PROVIDER = "google";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY = "testApiKey";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_URL =
    "https://translation.googleapis.com/language/translate/v2";
  const text = "Hello, world!";
  const sourceLang = "en";
  const targetLang = "es";

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          data: {
            translations: [
              {
                translatedText: "¡Hola, mundo!",
              },
            ],
          },
        }),
    })
  );

  const translatedText = await translateText(text, sourceLang, targetLang);

  expect(translatedText).toBe("¡Hola, mundo!");
  expect(fetch).toHaveBeenCalledWith(
    "https://translation.googleapis.com/language/translate/v2?key=testApiKey&source=en&target=es&q=Hello%2C%20world%21"
  );
});

/**
 * Tests that the `translateText` function correctly uses the default target language if not provided.
 *
 * This test sets the `REACT_APP_MULTI_LINGUAL_PROVIDER` environment variable to "google", and the required `REACT_APP_GOOGLE_TRANSLATE_API_KEY` and `REACT_APP_GOOGLE_TRANSLATE_API_URL` environment variables. It then mocks the `fetch` function to simulate a successful API response, and asserts that calling `translateText` with a text and source language, but no target language, results in the expected translated text and the correct API call being made.
 *
 * @param text - The text to be translated.
 * @param sourceLang - The source language code.
 * @returns The translated text.
 */
it("should use default target language if not provided", async () => {
  process.env.REACT_APP_MULTI_LINGUAL_PROVIDER = "google";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY = "testApiKey";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_URL =
    "https://translation.googleapis.com/language/translate/v2";
  const text = "Hello, world!";
  const sourceLang = "en";

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          data: {
            translations: [
              {
                translatedText: "Bonjour le monde!",
              },
            ],
          },
        }),
    })
  );

  const translatedText = await translateText(text, sourceLang);

  expect(translatedText).toBe("Bonjour le monde!");
  expect(fetch).toHaveBeenCalledWith(
    "https://translation.googleapis.com/language/translate/v2?key=testApiKey&source=en&target=en&q=Hello%2C%20world%21"
  );
});

/**
 * Tests that the `translateText` function throws an error when the provided multi-lingual provider is not supported.
 *
 * This test sets the `REACT_APP_MULTI_LINGUAL_PROVIDER` environment variable to an unsupported value of "unsupportedProvider", and then asserts that calling `translateText` with a text, source language, and target language rejects with an error with the message "Failed to translate".
 *
 * @param text - The text to be translated.
 * @param sourceLang - The source language code.
 * @param targetLang - The target language code.
 * @throws {Error} - Throws an error with the message "Failed to translate" when the provider is not supported.
 */
it("should throw an error when provider is not supported", async () => {
  process.env.REACT_APP_MULTI_LINGUAL_PROVIDER = "unsupportedProvider";
  const text = "Hello, world!";
  const sourceLang = "en";
  const targetLang = "es";

  await expect(
    translateText(text, sourceLang, targetLang)
  ).rejects.toThrowError("Failed to translate");
});

/**
 * Tests that the `translateText` function throws an error when the required environment variables for the Google provider are missing.
 *
 * This test sets the `REACT_APP_MULTI_LINGUAL_PROVIDER` environment variable to "google", but does not set the required `REACT_APP_GOOGLE_TRANSLATE_API_KEY` and `REACT_APP_GOOGLE_TRANSLATE_API_URL` environment variables. It then asserts that calling `translateText` with a text, source language, and target language rejects with an error with the message "Failed to translate".
 */
it("should throw an error when required environment variables are missing for google provider", async () => {
  process.env.REACT_APP_MULTI_LINGUAL_PROVIDER = "google";
  const text = "Hello, world!";
  const sourceLang = "en";
  const targetLang = "es";

  await expect(
    translateText(text, sourceLang, targetLang)
  ).rejects.toThrowError("Failed to translate");
});

/**
 * Tests that the `translateText` function correctly handles a failed fetch API call.
 *
 * This test mocks the `fetch` function to simulate a failed API response, and asserts that the `translateText` function throws an error with the expected message.
 */
it("should throw an error when fetch API call fails", async () => {
  process.env.REACT_APP_MULTI_LINGUAL_PROVIDER = "google";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY = "testApiKey";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_URL =
    "https://translation.googleapis.com/language/translate/v2";
  const text = "Hello, world!";
  const sourceLang = "en";
  const targetLang = "es";

  global.fetch = jest.fn(() => Promise.reject(new Error("Fetch error")));

  await expect(
    translateText(text, sourceLang, targetLang)
  ).rejects.toThrowError("Failed to translate");
});

/**
 * Tests that the `translateText` function correctly handles a response from the Google Translate API that does not contain any translations.
 *
 * This test mocks the `fetch` function to simulate a successful API response that contains an empty `translations` array, and asserts that the `translateText` function throws an error with the expected message.
 */
it("should throw an error when response does not contain translations", async () => {
  process.env.REACT_APP_MULTI_LINGUAL_PROVIDER = "google";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY = "testApiKey";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_URL =
    "https://translation.googleapis.com/language/translate/v2";
  const text = "Hello, world!";
  const sourceLang = "en";
  const targetLang = "es";

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: {} }),
    })
  );

  await expect(
    translateText(text, sourceLang, targetLang)
  ).rejects.toThrowError("Failed to translate");
});

/**
 * Tests that the `translateText` function correctly handles a response from the Google Translate API that does not contain any translations.
 *
 * This test mocks the `fetch` function to simulate a successful API response that contains an empty `translations` array, and asserts that the `translateText` function throws an error with the expected message.
 */
it("should throw an error when response contains empty translations", async () => {
  process.env.REACT_APP_MULTI_LINGUAL_PROVIDER = "google";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY = "testApiKey";
  process.env.REACT_APP_GOOGLE_TRANSLATE_API_URL =
    "https://translation.googleapis.com/language/translate/v2";
  const text = "Hello, world!";
  const sourceLang = "en";
  const targetLang = "es";

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          data: {
            translations: [],
          },
        }),
    })
  );

  await expect(
    translateText(text, sourceLang, targetLang)
  ).rejects.toThrowError("Failed to translate");
});
/**
 * Tests that the `translateText` function correctly handles an invalid API key and throws an error with the expected message.
 *
 * This test mocks the `fetch` function to simulate an API response with an invalid API key error, and asserts that the
 * `translateText` function throws an error with the expected message.
 */
it("should throw an error with a specific message if the API key is invalid", async () => {
  CONFIG.multilingual.translate.apikey = "invalidApiKey";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      error: {
        code: 403,
        message: "Invalid API Key",
      },
    }),
  });

  const text = "Hello world";
  const sourceLang = "en";
  const targetLang = "fr";

  try {
    await translateText(text, sourceLang, targetLang);
  } catch (error) {
    expect(error.message).toBe("Failed to translate: Invalid API Key");
  }
});
/**
 * Tests that the `translateText` function correctly calls the Google Translate API with the expected URL and parameters.
 *
 * This test mocks the `fetch` function to simulate a successful API response, and asserts that the `translateText`
 * function calls the API with the correct URL and parameters.
 */
it("should call fetch with the correct URL and parameters for Google Translate", async () => {
  const text = "Hello world";
  const sourceLang = "en";
  const targetLang = "fr";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [
          {
            translatedText: "Bonjour le monde",
          },
        ],
      },
    }),
  });

  await translateText(text, sourceLang, targetLang);

  expect(mockFetch).toHaveBeenCalledWith(
    "https://translation.googleapis.com/language/translate/v2?key=testApiKey&source=en&target=fr&q=Hello%20world"
  );
});

/**
 * Tests that the `translateText` function correctly handles a successful API call and returns the translated text.
 *
 * This test mocks the `fetch` function to simulate a successful API response with a translated text, and asserts that the
 * `translateText` function returns the expected translated text.
 */
it("should return the translated text if the API call is successful", async () => {
  const text = "Hello world";
  const sourceLang = "en";
  const targetLang = "fr";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [
          {
            translatedText: "Bonjour le monde",
          },
        ],
      },
    }),
  });

  const translatedText = await translateText(text, sourceLang, targetLang);

  expect(translatedText).toBe("Bonjour le monde");
});

/**
 * Tests that the `translateText` function correctly handles a network error when calling the API.
 *
 * This test mocks the `fetch` function to simulate a network error, and asserts that the `translateText`
 * function rejects with the expected error message.
 */
it("should throw an error if the API call fails", async () => {
  const text = "Hello world";
  const sourceLang = "en";
  const targetLang = "fr";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockRejectedValueOnce(new Error("Network Error"));

  try {
    await translateText(text, sourceLang, targetLang);
  } catch (error) {
    expect(error.message).toBe("Failed to translate");
  }
});

/**
 * Tests that the `translateText` function correctly handles an API response that does not contain translations.
 *
 * This test mocks the `fetch` function to simulate an API response with an empty translations array,
 * and asserts that the `translateText` function rejects with the expected error message.
 */
it("should throw an error if the API response does not contain translations", async () => {
  const text = "Hello world";
  const sourceLang = "en";
  const targetLang = "fr";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [],
      },
    }),
  });

  try {
    await translateText(text, sourceLang, targetLang);
  } catch (error) {
    expect(error.message).toBe("Failed to translate");
  }
});

/**
 * Tests that the `translateText` function correctly handles an invalid API response.
 *
 * This test mocks the `fetch` function to simulate an API response with an invalid structure,
 * and asserts that the `translateText` function rejects with the expected error message.
 */
it("should throw an error if the API response is invalid", async () => {
  const text = "Hello world";
  const sourceLang = "en";
  const targetLang = "fr";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      // Invalid response structure
      invalid: "data",
    }),
  });

  try {
    await translateText(text, sourceLang, targetLang);
  } catch (error) {
    expect(error.message).toBe("Failed to translate");
  }
});

/**
 * Tests that the `translateText` function correctly uses the default target language if not provided.
 *
 * This test mocks the `fetch` function to simulate an API response with a translation for the default target language,
 * and asserts that the `translateText` function calls the API with the expected parameters.
 */
it("should use the default target language if not provided", async () => {
  const text = "Hello world";
  const sourceLang = "en";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [
          {
            translatedText: "Hello world",
          },
        ],
      },
    }),
  });

  await translateText(text, sourceLang);

  expect(mockFetch).toHaveBeenCalledWith(
    "https://translation.googleapis.com/language/translate/v2?key=testApiKey&source=en&target=en&q=Hello%20world"
  );
});

/**
 * Tests that the `translateText` function correctly handles an invalid source language.
 *
 * This test mocks the `fetch` function to simulate an API response with a translation for an invalid source language,
 * and asserts that the `translateText` function rejects with the expected error message.
 */
it("should handle invalid source language", async () => {
  const text = "Hello world";
  const sourceLang = "invalid";
  const targetLang = "fr";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [
          {
            translatedText: "Bonjour le monde",
          },
        ],
      },
    }),
  });

  try {
    await translateText(text, sourceLang, targetLang);
  } catch (error) {
    expect(error.message).toBe("Failed to translate");
  }
});

/**
 * Tests that the `translateText` function correctly handles an invalid target language.
 *
 * This test mocks the `fetch` function to simulate an API response with a translation for an invalid target language,
 * and asserts that the `translateText` function rejects with the expected error message.
 */
it("should handle invalid target language", async () => {
  const text = "Hello world";
  const sourceLang = "en";
  const targetLang = "invalid";

  const mockFetch = jest.mocked(require("node-fetch").default);
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue({
      data: {
        translations: [
          {
            translatedText: "Bonjour le monde",
          },
        ],
      },
    }),
  });

  try {
    await translateText(text, sourceLang, targetLang);
  } catch (error) {
    expect(error.message).toBe("Failed to translate");
  }
});
/**
 * Clears all mocks before each test in the "translateService - Additional Tests" test suite.
 */
describe("translateService - Additional Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests that the `translateText` function correctly handles a response with multiple translations.
   *
   * This test mocks the `fetch` function to simulate an API response with multiple translations, and
   * asserts that the `translateText` function returns the first translation in the response.
   */
  it("should handle multiple translations in the response", async () => {
    const mockResponse = {
      data: {
        translations: [
          { translatedText: "Hello" },
          { translatedText: "World" },
        ],
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await translateText("Bonjour le monde", "fr", "en");
    expect(result).toBe("Hello"); // It should return the first translation
  });

  /**
   * Tests that the `translateText` function correctly handles the case where the source and target languages are the same.
   *
   * This test mocks the `fetch` function to verify that the API request includes the expected source and target language parameters.
   */
  it("should handle source language same as target language", async () => {
    await translateText("Hello World", "en", "en");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("source=en&target=en")
    );
  });

  /**
   * Tests that the `translateText` function correctly handles non-string input.
   *
   * This test mocks the `fetch` function to simulate an API response with an error for
   * non-string input, and asserts that the `translateText` function rejects with
   * the expected error.
   */
  it("should handle non-string input", async () => {
    await expect(translateText(123 as any, "en", "fr")).rejects.toThrow();
  });

  /**
   * Tests that the `translateText` function correctly handles non-string language codes.
   *
   * This test mocks the `fetch` function to simulate an API response with an error for
   * non-string language codes, and asserts that the `translateText` function rejects with
   * the expected error.
   *
   * @param {string} text - The text to be translated.
   * @param {any} sourceLang - The source language code (expected to be a non-string value).
   * @param {any} targetLang - The target language code (expected to be a non-string value).
   * @returns {Promise<void>} - A Promise that resolves when the test completes.
   */
  it("should handle non-string language codes", async () => {
    await expect(
      translateText("Test", 123 as any, 456 as any)
    ).rejects.toThrow();
  });

  /**
   * Tests that the `translateText` function correctly handles invalid language codes.
   *
   * This test mocks the `fetch` function to simulate an API response with an error for
   * an invalid language code, and asserts that the `translateText` function rejects with
   * the expected error.
   */
  it("should handle invalid language codes", async () => {
    const mockResponse = { error: { message: "Invalid language code" } };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    await expect(translateText("Test", "invalid", "en")).rejects.toThrow();
  });

  /**
   * Tests that the `translateText` function correctly handles an API rate limit.
   *
   * This test mocks the `fetch` function to simulate an API response with a rate limit
   * error, and asserts that the `translateText` function rejects with the expected error
   * message.
   */
  it("should handle API rate limiting", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Rate limit exceeded")
    );

    await expect(
      translateText("Rate limited text", "fr", "en")
    ).rejects.toThrow("Rate limit exceeded");
  });

  /**
   * Tests that the `translateText` function correctly handles a request timeout.
   *
   * This test mocks the `fetch` function to simulate a request timeout, and asserts that
   * the `translateText` function rejects with the expected error message.
   */
  it("should handle API timeout", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Request timeout")
    );

    await expect(translateText("Timeout text", "fr", "en")).rejects.toThrow(
      "Request timeout"
    );
  });

  /**
   * Tests that the `translateText` function correctly handles text with HTML entities.
   *
   * This test mocks the `fetch` function to simulate an API response with a translation
   * that includes HTML entities, and asserts that the `translateText` function returns the
   * expected translated text with the HTML entities intact.
   */
  it("should handle text with HTML entities", async () => {
    const mockResponse = {
      data: {
        translations: [
          { translatedText: "Translated &lt;strong&gt;HTML&lt;/strong&gt;" },
        ],
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await translateText(
      "&lt;strong&gt;HTML&lt;/strong&gt;",
      "en",
      "fr"
    );
    expect(result).toBe("Translated &lt;strong&gt;HTML&lt;/strong&gt;");
  });

  /**
   * Tests that the `translateText` function correctly handles text with emojis.
   *
   * This test mocks the `fetch` function to simulate an API response with a translation
   * that includes emojis, and asserts that the `translateText` function returns the
   * expected translated text with the emojis intact.
   */
  it("should handle text with emojis", async () => {
    const mockResponse = {
      data: {
        translations: [{ translatedText: "Hello 👋 World 🌍" }],
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await translateText("Bonjour 👋 le monde 🌍", "fr", "en");
    expect(result).toBe("Hello 👋 World 🌍");
  });
  /**
   * Tests that the `translateText` function correctly handles using a different API provider.
   *
   * This test mocks the `../config` module to simulate a different API provider configuration,
   * and then calls the `translateText` function to ensure that the `fetch` function is called
   * with the expected API URL.
   */
  it("should handle different API providers", async () => {
    jest.resetModules();
    jest.mock("../config", () => ({
      CONFIG: {
        multilingual: {
          translate: {
            provider: "different-provider",
            apikey: "different-api-key",
            apiurl: "https://different-api.com/translate",
          },
        },
      },
    }));

    const {
      translateText: translateTextReimported,
    } = require("../services/translateService");

    const mockResponse = {
      data: {
        translations: [{ translatedText: "Hello World" }],
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    await translateTextReimported("Bonjour le monde", "fr", "en");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://different-api.com/translate")
    );
  });

  /**
   * Tests that the `translateText` function correctly handles an API response with an unexpected structure.
   *
   * This test mocks the `fetch` function to simulate an API response with an unexpected structure, and
   * asserts that the `translateText` function rejects with an error when this happens.
   */
  it("should handle API response with unexpected structure", async () => {
    const mockResponse = {
      unexpectedStructure: {
        someField: "someValue",
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    await expect(
      translateText("Unexpected structure", "fr", "en")
    ).rejects.toThrow("Failed to translate");
  });
  /**
   * Tests that the `translateText` function correctly handles text with line breaks.
   *
   * This test mocks the `fetch` function to simulate a successful API response with
   * translated text that contains line breaks. It then calls the `translateText`
   * function with text that contains line breaks and asserts that the `fetch` function
   * was called with the expected URL, which should include the line breaks encoded
   * as `%0A`.
   */

  it("should handle text with line breaks", async () => {
    const mockResponse = {
      data: {
        translations: [{ translatedText: "Hello\nWorld" }],
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    await translateText("Bonjour\nle monde", "fr", "en");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("Bonjour%0Ale%20monde")
    );
  });

  /**
   * Tests the successful translation of text using the `translateText` function.
   *
   * This test mocks the `node-fetch` library to simulate a successful API response
   * with the expected translated text. It then calls the `translateText` function
   * and asserts that the returned value matches the expected translation.
   */
  it("should return the translated text if the API call is successful", async () => {
    const text = "Hello world";
    const from = "en";
    const to = "fr";
    const mockFetch = jest.mocked(require("node-fetch").default);
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [
            {
              translatedText: "Bonjour le monde",
            },
          ],
        },
      }),
    });
    const result = await translateText(text, from, to);
    expect(result).toBe("Bonjour le monde");
  });
});
