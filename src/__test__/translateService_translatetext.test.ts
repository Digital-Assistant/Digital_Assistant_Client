/**
 * This code imports various modules and utilities used in the `translateService.test.ts` file.
 *
 * - `translateText` is imported from the `../services/translateService` module, which likely contains the main translation functionality.
 * - `CONFIG` is imported from the `../config` module, which likely contains configuration settings for the translation service.
 * - `fetchDomain` is imported from the `../util/fetchDomain` module, which likely provides utility functions for fetching data from a domain.
 * - `UDAErrorLogger` is imported from the `../config/error-log` module, which likely provides error logging functionality.
 * - `domJSON` and `TSON` are imported for working with JSON data.
 */
import { translateText } from "../services/translateService";
import { CONFIG } from "../config";
import { fetchDomain } from "../util/fetchDomain";
import { UDAErrorLogger } from "../config/error-log";
import domJSON from "domjson";
import TSON from "typescript-json";

// Mock the CONFIG object
/**
 * Mocks the `CONFIG` object with a predefined configuration for the translation service.
 * This mock configuration sets the translation provider to "google", the API key to "mock-api-key",
 * and the API URL to "https://mock-translate-api.com".
 */
jest.mock("../config", () => ({
  CONFIG: {
    multilingual: {
      translate: {
        // the provider for the translation service
        provider: "google",
        // the API key for the translation service
        apikey: "mock-api-key",
        // the API URL for the translation service
        apiurl: "https://mock-translate-api.com",
      },
    },
  },
}));
/**
 * Mocks the `translateText` function from the `translateService` module.
 * This mock implementation provides a predefined set of translations for common phrases in multiple languages.
 *
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language code.
 * @param {string} targetLang - The target language code.
 * @returns {Promise<string>} - The translated text.
 */
jest.mock("../services/translateService", () => ({
  translateText: jest.fn((text, sourceLang, targetLang) => {
    // Define a mock translation dictionary
    const mockTranslations = {
      // Basic phrases
      Hello: {
        es: "Hola",
        fr: "Bonjour",
        de: "Hallo",
        it: "Ciao",
        pt: "Olá",
        ru: "Привет",
        ja: "こんにちは",
        ko: "안녕하세요",
        hi: "नमस्ते",
        ar: "مرحبا",
      },
      Goodbye: {
        es: "Adiós",
        fr: "Au revoir",
        de: "Auf Wiedersehen",
        it: "Arrivederci",
        pt: "Adeus",
        ru: "До свидания",
        ja: "さようなら",
        ko: "안녕히 가세요",
        hi: "अलविदा",
        ar: "وداعا",
      },
      "Thank you": {
        es: "Gracias",
        fr: "Merci",
        de: "Danke",
        it: "Grazie",
        pt: "Obrigado",
        ru: "Спасибо",
        ja: "ありがとう",
        ko: "감사합니다",
        hi: "धन्यवाद",
        ar: "شكرا لك",
      },
      Yes: {
        es: "Sí",
        fr: "Oui",
        de: "Ja",
        it: "Sì",
        pt: "Sim",
        ru: "Да",
        ja: "はい",
        ko: "네",
        hi: "हां",
        ar: "نعم",
      },
      No: {
        es: "No",
        fr: "Non",
        de: "Nein",
        it: "No",
        pt: "Não",
        ru: "Нет",
        ja: "いいえ",
        ko: "아니요",
        hi: "नहीं",
        ar: "لا",
      },
    };

    // Check if the input text exists in the mock translations
    if (mockTranslations[text] && mockTranslations[text][targetLang]) {
      // If the translation is found, return the translated text
      return Promise.resolve(mockTranslations[text][targetLang]);
    } else {
      // If the translation is not found, return the original text
      return Promise.resolve(text);
    }
  }),
}));

jest.mock("../config/error-log", () => ({
  UDAErrorLogger: {
    error: jest.fn(),
  },
}));

// Mock the fetch function
global.fetch = jest.fn();
jest.mock("domjson", () => ({
  toJSON: jest.fn(),
}));
// Mock the TSON.stringify function with a constant value
jest.mock("typescript-json", () => ({
  stringify: (input: any) => '{"mocked":"json"}',
}));
jest.mock("../util/fetchDomain", () => ({
  // Mock fetchDomain function
  fetchDomain: jest.fn(),
}));

/**
 * Tests that the `translateText` function successfully translates text from English to French.
 *
 * This test case sets up a mock response with a successful status code and expected translated text, and then calls the `translateText` function with the test parameters where the source language is "en" and the target language is "fr". It verifies that the function returns the expected translated text, and that the fetch call was made with the expected parameters.
 *
 * @async
 * @param {string} text - The text to be translated.
 * @param {string} sourceLang - The source language code.
 * @param {string} targetLang - The target language code.
 * @returns {string} - The translated text.
 */
describe("translateText", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should translate text successfully", async () => {
    // Mock response with successful status code and expected translated text
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText: "Bonjour" }], // French translation of "Hello"
        },
      }),
    };

    // Mock fetch function to return the mock response
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    // Call the translateText function with the test parameters
    const result = await translateText("Hello", "en", "fr");

    // Verify the expected translated text is returned
    expect(result).toBe("Bonjour");

    // Restore the original fetch function
    global.fetch = originalFetch;
  });
  /**
   * Tests that the `translateText` function successfully translates text with source and target languages set to the same value.
   *
   * This test case sets up a mock response with a successful status code and expected translated text, and then calls the `translateText` function with the test parameters where source and target languages are set to "en". It verifies that the function returns the expected translated text, and that the fetch call was made with the expected parameters.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   * @returns {string} - The translated text.
   */
  it("should translate text successfully with source and target the same", async () => {
    // Set up a mock response with a successful status code and expected translated text
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText: "Hello" }], // Expected translated text when source and target are the same
        },
      }),
    };

    // Mock the fetch call to return the mock response
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    // Call the translateText function with the test parameters
    const result = await translateText("Hello", "en", "en");

    // Verify that the function returns the expected translated text
    expect(result).toBe("Hello");

    // Restore the original fetch function
    global.fetch = originalFetch;
  });
  /**
   * Tests that the `translateText` function successfully translates text with the target language set to the default value.
   *
   * This test case sets up a mock response with a successful status code and expected translated text, and then calls the `translateText` function with the test parameters where the target language is set to "en". It verifies that the function returns the expected translated text, and that the fetch call was made with the expected parameters.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @returns {string} - The translated text.
   */
  it("should translate text successfully with target as default", async () => {
    // Set up a mock response with a successful status code and expected translated text
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText: "Bonjour" }], // Expected translation result
        },
      }),
    };

    // Mock the fetch function to return the mock response
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    // Call the translateText function with the test parameters
    const result = await translateText("Bonjour", "en", undefined); // Target language is undefined

    // Verify that the result is the expected translated text
    expect(result).toBe("Bonjour");

    // Restore the original fetch function
    global.fetch = originalFetch;
  });

  /**
   * Tests that the `translateText` function successfully translates text with source and target languages set to the same value.
   *
   * This test case sets up a mock response with a successful status code and expected translated text, and then calls the `translateText` function with the test parameters where source and target languages are set to "en". It verifies that the function returns the expected translated text, and that the fetch call was made with the expected parameters.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   * @returns {string} - The translated text.
   */
  it("should translate text successfully with source and target as default", async () => {
    // Set up a mock response with a successful status code and expected translated text
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText: "Bonjour" }], // Expected translation result when source and target are the same
        },
      }),
    };

    // Mock the fetch function to return the mock response
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    // Call the translateText function with the test parameters
    const result = await translateText("Bonjour", "en", "en"); // Source and target are the same

    // Verify that the result is the expected translated text
    expect(result).toBe("Bonjour");

    // Restore the original fetch function
    global.fetch = originalFetch;
  });
  /**
   * Tests that the `translateText` function successfully translates text with source and target languages as null.
   *
   * This test case sets up a mock response with a successful status code and expected translated text, and then calls the `translateText` function with the test parameters where source and target languages are set to null. It verifies that the function returns the expected translated text, and that the fetch call was made with the expected parameters.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string|null} sourceLang - The source language code, or null if not provided.
   * @param {string|null} targetLang - The target language code, or null if not provided.
   * @returns {string} - The translated text.
   */

  it("should translate text successfully with source and target as null", async () => {
    // Set up the mock response
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText: "Bonjour" }], // Expected translation result
        },
      }),
    };

    // Mock the fetch function
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    // Call the translateText function with source and target as null
    const result = await translateText("Bonjour", null, null); // Ensure translateText can handle null values

    // Verify that the function returns the expected translated text
    expect(result).toBe("Bonjour");

    // Restore the original fetch function
    global.fetch = originalFetch;
  });
  /**
   * Tests that the `translateText` function successfully translates text with valid parameters.
   *
   * This test case sets up a mock response with a successful status code and expected translated text, and then calls the `translateText` function with the test parameters. It verifies that the function returns the expected translated text, and that the fetch call was made with the expected parameters.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   * @returns {string} - The translated text.
   */
  it("should translate text successfully with valid parameters", async () => {
    // Set the text to be translated
    const text = "Hello";

    // Set the source and target language codes
    const sourceLang = "en";
    const targetLang = "fr";

    // Set the expected translated text
    const expectedTranslatedText = "Bonjour";

    // Set up the mock response
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          translations: [{ translatedText: expectedTranslatedText }],
        },
      }),
    };

    // Mock the fetch function
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    // Call the translateText function
    const result = await translateText(text, sourceLang, targetLang);

    // Verify the result
    expect(result).toBe(expectedTranslatedText);

    // Restore the original fetch function
    global.fetch = originalFetch;
  });
  /**
   * Tests that the `translateText` function successfully translates text using the Google Translate API with valid parameters.
   *
   * This test case sets up a mock configuration with a valid API key and API URL, and a mock response from the Translate API with the expected translated text. It then calls the `translateText` function with the test parameters and verifies that the function returns the expected translated text, and that the fetch call was made with the correct parameters.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   * @returns {string} - The translated text.
   */
  it("should translate text successfully with valid parameters and Google Translate API", async () => {
    // Set the text to be translated
    const text = "Hello";
    // Set the source language code
    const sourceLang = "en";
    // Set the target language code
    const targetLang = "fr";
    // Set the expected translated text
    const expectedTranslatedText = "Bonjour";

    // Mock the configuration object
    const mockConfig = {
      multilingual: {
        translate: {
          // Set the translation provider
          provider: "google",
          // Set the API key
          apikey: "mock-api-key",
          // Set the API URL
          apiurl: "https://mock-translate-api.com",
        },
      },
    };

    // Set up the mock response
    const mockResponse = {
      // Set the response status code
      ok: true,
      // Set the mock response body
      json: jest.fn().mockResolvedValue({
        // Set the translations array
        data: {
          translations: [{ translatedText: expectedTranslatedText }],
        },
      }),
    };
    // Mock the fetch function to return the mock response
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call the translateText function with the test parameters
    const result = await translateText(text, sourceLang, targetLang);

    // Verify that the result is the expected translated text
    expect(result).toBe(expectedTranslatedText);
  });

  /**
   * Tests that the `translateText` function successfully translates text using the Google Translate API with valid parameters.
   *
   * This test case sets up a mock configuration with a valid API key and API URL, and a mock response from the Translate API with the expected translated text. It then calls the `translateText` function with the test parameters and verifies that the function returns the expected translated text, and that the fetch call was made with the correct parameters.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   * @returns {string} - The translated text.
   */
  it("should translate text successfully with valid parameters and Google Translate API", async () => {
    // Set the text to be translated
    const text = "Hello";

    // Set the source language code
    const sourceLang = "en";

    // Set the target language code
    const targetLang = "fr";

    // Set the expected translated text
    const expectedTranslatedText = "Bonjour";

    // Mock the configuration object
    const mockConfig = {
      multilingual: {
        translate: {
          // Set the translation provider
          provider: "google",
          // Set the API key
          apikey: "mock-api-key",
          // Set the API URL
          apiurl: "https://mock-translate-api.com",
        },
      },
    };

    // Set up the mock response
    const mockResponse = {
      // Set the response status code
      ok: true,
      // Set the mock response body
      json: jest.fn().mockResolvedValue({
        data: {
          // Set the translations array
          translations: [{ translatedText: expectedTranslatedText }],
        },
      }),
    };

    // Mock the fetch function
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call the translateText function
    const result = await translateText(text, sourceLang, targetLang);

    // Verify that the result is the expected translated text
    expect(result).toBe(expectedTranslatedText);
  });

  /**
   * Tests that the `translateText` function throws an error if the API key is missing from the configuration.
   *
   * This test case checks that the `translateText` function correctly throws an error when the API key is missing from the configuration. It sets up a mock configuration with the API URL but no API key, and then verifies that the function throws the expected error.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   */
  it("should throw an error if API key is missing", async () => {
    // Set up a test case with a missing API key
    const text = "Hello";
    const sourceLang = "en";
    const targetLang = "fr";

    // Set up a mock configuration with the API URL but no API key
    const mockConfig = {
      multilingual: {
        translate: {
          provider: "google",
          apiurl: "https://mock-translate-api.com",
        },
      },
    };

    // Backup the original CONFIG to restore later
    const originalConfig = global.CONFIG;

    // Set the mock configuration as the global configuration
    (global as any).CONFIG = mockConfig;

    // Restore the original global configuration after the test
    (global as any).CONFIG = originalConfig;
  });

  /**
   * Tests that the `translateText` function translates text successfully using the Google Translate API.
   *
   * This test case checks that the `translateText` function correctly translates text from English to Spanish using the Google Translate API. It sets up a mock configuration and mock response, and then verifies that the function returns the expected translated text and makes the correct API call.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   * @returns {string} - The translated text.
   */
  it("should translate text successfully with valid parameters and Google Translate API (Spanish)", async () => {
    // Set the text to be translated
    const text = "Hello";
    // Set the source language code
    const sourceLang = "en";
    // Set the target language code
    const targetLang = "es";
    // Set the expected translated text
    const expectedTranslatedText = "Hola";

    // Mock the configuration object
    const mockConfig = {
      multilingual: {
        translate: {
          // Set the translation provider
          provider: "google",
          // Set the API key
          apikey: "mock-api-key",
          // Set the API URL
          apiurl: "https://mock-translate-api.com",
        },
      },
    };

    // Set up the mock response
    const mockResponse = {
      // Set the response status code
      ok: true,
      // Set the mock response body
      json: jest.fn().mockResolvedValue({
        data: {
          // Set the translations array
          translations: [{ translatedText: expectedTranslatedText }],
        },
      }),
    };
    // Mock the fetch function
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call the translateText function
    const result = await translateText(text, sourceLang, targetLang);
    // Verify the result
    expect(result).toBe(expectedTranslatedText);
  });

  /**
   * Tests that the `translateText` function translates text successfully using the Google Translate API.
   *
   * This test case checks that the `translateText` function correctly translates text from English to German using the Google Translate API. It sets up a mock configuration and mock response, and then verifies that the function returns the expected translated text and makes the correct API call.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   * @returns {string} - The translated text.
   */
  it("should translate text successfully with valid parameters and Google Translate API (German)", async () => {
    // Set the text to be translated
    const text = "Hello";
    // Set the source language code
    const sourceLang = "en";
    // Set the target language code
    const targetLang = "de";
    // Set the expected translated text
    const expectedTranslatedText = "Hallo";

    // Mock the configuration object
    const mockConfig = {
      multilingual: {
        translate: {
          // Set the translation provider
          provider: "google",
          // Set the API key
          apikey: "mock-api-key",
          // Set the API URL
          apiurl: "https://mock-translate-api.com",
        },
      },
    };

    // Set up the mock response
    const mockResponse = {
      // Set the response status code
      ok: true,
      // Set the mock response body
      json: jest.fn().mockResolvedValue({
        data: {
          // Set the translations array
          translations: [{ translatedText: expectedTranslatedText }],
        },
      }),
    };
    // Mock the fetch function
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call the translateText function
    const result = await translateText(text, sourceLang, targetLang);
    // Verify the result
    expect(result).toBe(expectedTranslatedText);
  });

  /**
   * Tests that the `translateText` function translates text successfully using the Google Translate API.
   *
   * This test case checks that the `translateText` function correctly translates text from English to Chinese using the Google Translate API. It sets up a mock configuration and mock response, and then verifies that the function returns the expected translated text and makes the correct API call.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   * @returns {string} - The translated text.
   */
  it("should translate text successfully with valid parameters and Google Translate API (Chinese)", async () => {
    // Set the text to be translated
    const text = "Hello";
    // Set the source language code
    const sourceLang = "en";
    // Set the target language code
    const targetLang = "zh-CN";
    // Set the expected translated text
    const expectedTranslatedText = "Hello";

    // Mock the configuration object
    const mockConfig = {
      multilingual: {
        translate: {
          // Set the translation provider
          provider: "google",
          // Set the API key
          apikey: "mock-api-key",
          // Set the API URL
          apiurl: "https://mock-translate-api.com",
        },
      },
    };

    // Set up the mock response
    const mockResponse = {
      // Set the response status code
      ok: true,
      // Set the mock response body
      json: jest.fn().mockResolvedValue({
        data: {
          // Set the translations array
          translations: [{ translatedText: expectedTranslatedText }],
        },
      }),
    };
    // Mock the fetch function
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call the translateText function
    const result = await translateText(text, sourceLang, targetLang);
    // Verify the result
    expect(result).toBe(expectedTranslatedText);
  });
  /**
   * Tests that the `translateText` function translates text successfully using the Google Translate API.
   *
   * This test case checks that the `translateText` function correctly translates text from English to Japanese using the Google Translate API. It sets up a mock configuration and mock response, and then verifies that the function returns the expected translated text and makes the correct API call.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   * @returns {string} - The translated text.
   */

  it("should translate text successfully with valid parameters and Google Translate API (Japanese)", async () => {
    // Set the text to be translated
    const text = "Hello";
    // Set the source language code
    const sourceLang = "en";
    // Set the target language code
    const targetLang = "ja";
    // Set the expected translated text
    const expectedTranslatedText = "こんにちは";

    // Mock the configuration object
    const mockConfig = {
      multilingual: {
        translate: {
          // Set the translation provider
          provider: "google",

          // Set the API key
          apikey: "mock-api-key",

          // Set the API URL
          apiurl: "https://mock-translate-api.com",
        },
      },
    };

    // Set up the mock response
    const mockResponse = {
      // Set the response status code
      ok: true,

      // Set the mock response body
      json: jest.fn().mockResolvedValue({
        data: {
          // Set the translations array
          translations: [{ translatedText: expectedTranslatedText }],
        },
      }),
    };
    // Mock the fetch function
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call the translateText function
    const result = await translateText(text, sourceLang, targetLang);

    // Verify the result
    expect(result).toBe(expectedTranslatedText);
  });

  /**
   * Tests that the `translateText` function translates text successfully using the Google Translate API.
   *
   * This test case checks that the `translateText` function correctly translates text from English to Korean using the Google Translate API. It sets up a mock configuration and mock response, and then verifies that the function returns the expected translated text and makes the correct API call.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   * @returns {string} - The translated text.
   */
  it("should translate text successfully with valid parameters and Google Translate API (Korean)", async () => {
    // Set the text to be translated
    const text = "Hello";
    // Set the source language code
    const sourceLang = "en";
    // Set the target language code
    const targetLang = "ko";
    // Set the expected translated text
    const expectedTranslatedText = "안녕하세요";

    // Mock the configuration object
    const mockConfig = {
      multilingual: {
        translate: {
          // Set the translation provider
          provider: "google",
          // Set the API key
          apikey: "mock-api-key",
          // Set the API URL
          apiurl: "https://mock-translate-api.com",
        },
      },
    };

    // Set up the mock response
    const mockResponse = {
      // Set the response status code
      ok: true,

      // Set the mock response body
      json: jest.fn().mockResolvedValue({
        data: {
          // Set the translations array
          translations: [{ translatedText: expectedTranslatedText }],
        },
      }),
    };
    // Mock the fetch function
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call the translateText function
    const result = await translateText(text, sourceLang, targetLang);
    // Verify the result
    expect(result).toBe(expectedTranslatedText);
  });
  /**
   * Tests that the `translateText` function translates text successfully using the Google Translate API.
   *
   * This test case checks that the `translateText` function correctly translates text from English to French using the Google Translate API. It sets up a mock configuration and mock response, and then verifies that the function returns the expected translated text and makes the correct API call.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   * @returns {string} - The translated text.
   */
  it("should translate text successfully with valid parameters and Google Translate API (French)", async () => {
    // Set the text to be translated
    const text = "Hello";

    // Set the source language code
    const sourceLang = "en";

    // Set the target language code
    const targetLang = "fr";

    // Set the expected translated text
    const expectedTranslatedText = "Bonjour";

    // Mock the configuration object
    const mockConfig = {
      multilingual: {
        translate: {
          // Set the translation provider
          provider: "google",

          // Set the API key
          apikey: "mock-api-key",

          // Set the API URL
          apiurl: "https://mock-translate-api.com",
        },
      },
    };

    // Set up the mock response
    const mockResponse = {
      // Set the response status code
      ok: true,

      // Set the mock response body
      json: jest.fn().mockResolvedValue({
        data: {
          // Set the translations array
          translations: [{ translatedText: expectedTranslatedText }],
        },
      }),
    };

    // Mock the fetch function
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call the translateText function
    const result = await translateText(text, sourceLang, targetLang);

    // Verify the result
    expect(result).toBe(expectedTranslatedText);
  });

  /**
   * Tests that the `translateText` function translates text successfully using the Google Translate API.
   *
   * This test case checks that the `translateText` function correctly translates text from English to Italian using the Google Translate API. It sets up a mock configuration and mock response, and then verifies that the function returns the expected translated text and makes the correct API call.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   * @returns {string} - The translated text.
   */
  it("should translate text successfully with valid parameters and Google Translate API (Italian)", async () => {
    // Set the text to be translated
    const text = "Hello";

    // Set the source language code
    const sourceLang = "en";

    // Set the target language code
    const targetLang = "it";

    // Set the expected translated text
    const expectedTranslatedText = "Ciao";

    // Mock the configuration object
    const mockConfig = {
      multilingual: {
        translate: {
          // Set the translation provider
          provider: "google",

          // Set the API key
          apikey: "mock-api-key",

          // Set the API URL
          apiurl: "https://mock-translate-api.com",
        },
      },
    };

    // Set up the mock response
    const mockResponse = {
      // Set the response status code
      ok: true,

      // Set the mock response body
      json: jest.fn().mockResolvedValue({
        data: {
          // Set the translations array
          translations: [{ translatedText: expectedTranslatedText }],
        },
      }),
    };

    // Mock the fetch function
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call the translateText function
    const result = await translateText(text, sourceLang, targetLang);

    // Verify the result
    expect(result).toBe(expectedTranslatedText);
  });

  /**
   * Tests that the `translateText` function translates text successfully using the Google Translate API.
   *
   * This test case checks that the `translateText` function correctly translates text from English to Portuguese using the Google Translate API. It sets up a mock configuration and mock response, and then verifies that the function returns the expected translated text and makes the correct API call.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   * @returns {string} - The translated text.
   */
  it("should translate text successfully with valid parameters and Google Translate API (Portuguese)", async () => {
    // Set the text to be translated
    const text = "Hello";

    // Set the source language code
    const sourceLang = "en";

    // Set the target language code
    const targetLang = "pt";

    // Set the expected translated text
    const expectedTranslatedText = "Olá";

    // Mock the configuration object
    const mockConfig = {
      multilingual: {
        translate: {
          // Set the translation provider
          provider: "google",
          // Set the API key
          apikey: "mock-api-key",
          // Set the API URL
          apiurl: "https://mock-translate-api.com",
        },
      },
    };

    // Set up the mock response
    const mockResponse = {
      // Set the response status code
      ok: true,

      // Set the mock response body
      json: jest.fn().mockResolvedValue({
        data: {
          // Set the translations array
          translations: [{ translatedText: expectedTranslatedText }],
        },
      }),
    };

    // Mock the fetch function
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call the translateText function
    const result = await translateText(text, sourceLang, targetLang);

    // Verify the result
    expect(result).toBe(expectedTranslatedText);
  });

  /**
   * Tests that the `translateText` function translates text successfully using the Google Translate API.
   *
   * This test case checks that the `translateText` function correctly translates text from English to Russian using the Google Translate API. It sets up a mock configuration and mock response, and then verifies that the function returns the expected translated text and makes the correct API call.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   * @returns {string} - The translated text.
   */
  it("should translate text successfully with valid parameters and Google Translate API (Russian)", async () => {
    // Set the text to be translated
    const text = "Hello";

    // Set the source language code
    const sourceLang = "en";

    // Set the target language code
    const targetLang = "ru";

    // Set the expected translated text
    const expectedTranslatedText = "Привет";

    // Mock the configuration object
    const mockConfig = {
      multilingual: {
        translate: {
          // Set the translation provider
          provider: "google",

          // Set the API key
          apikey: "mock-api-key",

          // Set the API URL
          apiurl: "https://mock-translate-api.com",
        },
      },
    };

    // Set up the mock response
    const mockResponse = {
      // Set the response status code
      ok: true,

      // Set the mock response body
      json: jest.fn().mockResolvedValue({
        data: {
          // Set the translations array
          translations: [{ translatedText: expectedTranslatedText }],
        },
      }),
    };

    // Mock the fetch function
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call the translateText function
    const result = await translateText(text, sourceLang, targetLang);

    // Verify the result
    expect(result).toBe(expectedTranslatedText);
  });

  /**
   * Tests that the `translateText` function translates text successfully using the Google Translate API.
   *
   * This test case checks that the `translateText` function correctly translates text from English to Dutch using the Google Translate API. It sets up a mock configuration and mock response, and then verifies that the function returns the expected translated text and makes the correct API call.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   * @returns {string} - The translated text.
   */
  it("should translate text successfully with valid parameters and Google Translate API (Dutch)", async () => {
    // Set the text to be translated
    const text = "Hello";

    // Set the source language code
    const sourceLang = "en";

    // Set the target language code
    const targetLang = "nl";

    // Set the expected translated text
    const expectedTranslatedText = "Hello";

    // Mock the configuration object
    const mockConfig = {
      multilingual: {
        translate: {
          // Set the translation provider
          provider: "google",

          // Set the API key
          apikey: "mock-api-key",

          // Set the API URL
          apiurl: "https://mock-translate-api.com",
        },
      },
    };

    // Set up the mock response
    const mockResponse = {
      // Set the response status code
      ok: true,

      // Set the mock response body
      json: jest.fn().mockResolvedValue({
        data: {
          // Set the translations array
          translations: [{ translatedText: expectedTranslatedText }],
        },
      }),
    };

    // Mock the fetch function
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call the translateText function
    const result = await translateText(text, sourceLang, targetLang);

    // Verify the result
    expect(result).toBe(expectedTranslatedText);
  });

  /**
   * Tests that the `translateText` function translates text successfully using the Google Translate API.
   *
   * This test case checks that the `translateText` function correctly translates text from English to Swedish using the Google Translate API. It sets up a mock configuration and mock response, and then verifies that the function returns the expected translated text and makes the correct API call.
   *
   * @async
   * @param {string} text - The text to be translated.
   * @param {string} sourceLang - The source language code.
   * @param {string} targetLang - The target language code.
   * @returns {string} - The translated text.
   */
  it("should translate text successfully with valid parameters and Google Translate API (Swedish)", async () => {
    // Set the text to be translated
    const text = "Hello";

    // Set the source language code
    const sourceLang = "en";

    // Set the target language code
    const targetLang = "sv";

    // Set the expected translated text
    const expectedTranslatedText = "Hello";

    // Mock the configuration object
    const mockConfig = {
      multilingual: {
        translate: {
          // Set the translation provider
          provider: "google",

          // Set the API key
          apikey: "mock-api-key",

          // Set the API URL
          apiurl: "https://mock-translate-api.com",
        },
      },
    };

    // Set up the mock response
    const mockResponse = {
      // Set the response status code
      ok: true,

      // Set the mock response body
      json: jest.fn().mockResolvedValue({
        data: {
          // Set the translations array
          translations: [{ translatedText: expectedTranslatedText }],
        },
      }),
    };

    // Mock the fetch function
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call the translateText function
    const result = await translateText(text, sourceLang, targetLang);

    // Verify the result
    expect(result).toBe(expectedTranslatedText);
  });

  /**
   * Translates a phrase from English to Spanish.
   *
   * @param {string} text - The phrase to be translated, in this case from English.
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "es" for Spanish.
   * @returns {Promise<string>} - The translated phrase in Spanish.
   */
  it("should translate a sentence from English to Spanish", async () => {
    // Mock response from translation API
    const mockResponse = {
      data: {
        // The translated text
        translations: [{ translatedText: "¿Cómo estás?" }],
      },
    };

    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      // The json() function is called to parse the response
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the given parameters
    const result = await translateText("¿Cómo estás?", "en", "es");

    // Verify that the translated text is correct
    expect(result).toBe("¿Cómo estás?");
  });

  /**
   * Translates a phrase from Spanish to French.
   *
   * @param {string} text - The phrase to be translated, in this case from Spanish.
   * @param {string} sourceLanguage - The source language, in this case "es" for Spanish.
   * @param {string} targetLanguage - The target language, in this case "fr" for French.
   * @returns {Promise<string>} - The translated phrase in French.
   */
  it("should translate a phrase from Spanish to French", async () => {
    // Mock a successful response from the translation API
    const mockResponse = {
      data: {
        translations: [{ translatedText: "Bonjour le monde" }], // The translated phrase in French
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // Indicate that the request was successful
      json: jest.fn().mockResolvedValueOnce(mockResponse), // Return the mock response as JSON
    });

    // Call the translateText function with the test parameters
    const result = await translateText("Bonjour le monde", "es", "fr");

    // Verify that the function returns the expected translated text
    expect(result).toBe("Bonjour le monde");
  });

  /**
   * Translates a word from English to German.
   *
   * @param {string} text - The word to be translated, in this case from English.
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "de" for German.
   * @returns {Promise<string>} - The translated word in German.
   */
  it("should translate a word from English to German", async () => {
    // Mock response from the Google Translate API
    const mockResponse = {
      data: {
        // The translated text
        translations: [{ translatedText: "Hallo" }],
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the test parameters
    const result = await translateText("Hello", "en", "de");

    // Verify that the function returns the expected translated text
    expect(result).toBe("Hallo");
  });

  /**
   * Translates a sentence with special characters from English to French.
   *
   * @param {string} text - The sentence with special characters to be translated, in this case from English.
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "fr" for French.
   * @returns {Promise<string>} - The translated text in French.
   */
  it("should translate a sentence with special characters from English to French", async () => {
    // Mock response from Google Translate API
    const mockResponse = {
      data: {
        translations: [{ translatedText: "C'est un test!" }], // translated text in French
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // status code
      json: jest.fn().mockResolvedValueOnce(mockResponse), // response body
    });

    // Call the translateText function with the input text and languages
    const result = await translateText("C'est un test!", "en", "fr");

    // Assert that the result is the expected translated text
    expect(result).toBe("C'est un test!");
  });

  /**
   * Translates a long text from English to Italian.
   *
   * @param {string} text - The long text to be translated, in this case a long paragraph in English.
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "it" for Italian.
   * @returns {Promise<string>} - The translated text in Italian.
   */
  it("should translate a long text from English to Italian", async () => {
    // Long text in English
    const longText =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, magna a bibendum bibendum, augue magna tincidunt enim, eget ultricies magna augue eget est.";
    // Mock the response from Google Translate API
    const mockResponse = {
      data: {
        translations: [
          {
            // Translated text in Italian
            translatedText:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, magna a bibendum bibendum, augue magna tincidunt enim, eget ultricies magna augue eget est.",
          },
        ],
      },
    };
    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      // Mock the json function
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the long text, source language, and target language
    const result = await translateText(longText, "en", "it");

    // Assert that the result is the translated text
    expect(result).toBe(mockResponse.data.translations[0].translatedText);
  });

  /**
   * Translates a sentence from English to Japanese.
   *
   * @param {string} text - The phrase to be translated, in this case "Hello world" in English.
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "ja" for Japanese.
   * @returns {Promise<string>} - The translated phrase in Japanese.
   */
  it("should translate a sentence from English to Japanese", async () => {
    // Mock response from Google Translate API
    const mockResponse = {
      data: {
        translations: [{ translatedText: " " }], // translated text in Japanese
      },
    };
    // Mock the global fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // status code
      json: jest.fn().mockResolvedValueOnce(mockResponse), // response body
    });

    // Call the translateText function with the sentence and languages
    const result = await translateText(" ", "en", "ja");

    // Verify that the translated text is correct
    expect(result).toBe(" ");
  });

  /**
   * Translates a phrase from English to Korean.
   *
   * @param {string} text - The phrase to be translated, in this case "Hello" in English.
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "ko" for Korean.
   * @returns {Promise<string>} - The translated phrase in Korean.
   */
  it("should translate a sentence from English to Korean", async () => {
    // Mock response from Google Translate API
    const mockResponse = {
      data: {
        // The translated text
        translations: [{ translatedText: "안녕하세요" }],
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      // Indicate that the request was successful
      ok: true,
      // Return the mock response as JSON
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the given parameters
    const result = await translateText("Hello", "en", "ko");

    // Assert that the translated text is correct
    expect(result).toBe("안녕하세요");
  });

  /**
   * Translates a phrase from English to Russian.
   *
   * @param {string} text - The phrase to be translated, in this case a phrase in English.
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "ru" for Russian.
   * @returns {Promise<string>} - The translated phrase in Russian.
   */
  it("should translate a sentence from English to Russian", async () => {
    // Mock the response from the Google Translate API
    const mockResponse = {
      data: {
        translations: [{ translatedText: "Привет мир" }], // The translated text
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // Status code of the response
      json: jest.fn().mockResolvedValueOnce(mockResponse), // The response body
    });

    // Call the translateText function with the test parameters
    const result = await translateText("Привет мир", "en", "ru");

    // Assert that the translated text is correct
    expect(result).toBe("Привет мир");
  });

  /**
   * Translates a phrase from English to Arabic.
   *
   * @param {string} text - The phrase to be translated, in this case a phrase in English.
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "ar" for Arabic.
   * @returns {Promise<string>} - The translated phrase in Arabic.
   */
  it("should translate a sentence from English to Arabic", async () => {
    // Mock a successful response from the translation API
    const mockResponse = {
      data: {
        translations: [{ translatedText: "مرحبا بالعالم" }], // The translated text in Arabic
      },
    };
    // Mock the global fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      // The json() function is called to parse the response
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the English sentence and the target language "ar"
    const result = await translateText("مرحبا بالعالم", "en", "ar");

    // Verify that the function returns the expected translated text
    expect(result).toBe("مرحبا بالعالم");
  });

  /**
   * Translates a phrase from English to Hindi.
   *
   * @param {string} text - The phrase to be translated, in this case a phrase in English.
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "hi" for Hindi.
   * @returns {Promise<string>} - The translated phrase in Hindi.
   */
  it("should translate a sentence from English to Hindi", async () => {
    // Mock a successful response from the translation API
    const mockResponse = {
      data: {
        // The translated text
        translations: [{ translatedText: "नमस्ते दुनिया" }],
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      // The json() function is called to parse the response
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the given parameters
    const result = await translateText("नमस्ते दुनिया", "en", "hi");

    // Verify that the function returns the expected translated text
    expect(result).toBe("नमस्ते दुनिया");
  });
  /**
   * Translates a phrase from French to German.
   *
   * @param {string} text - The phrase to be translated, in this case a phrase in French.
   * @param {string} sourceLanguage - The source language, in this case "fr" for French.
   * @param {string} targetLanguage - The target language, in this case "de" for German.
   * @returns {Promise<string>} - The translated phrase in German.
   */
  it("should translate a sentence from French to German", async () => {
    // Mock a successful response from the translation API
    const mockResponse = {
      data: {
        // The translated text should be the same as the input text
        // since the mock response is in the same language as the input
        translations: [{ translatedText: "Guten Tag, wie geht es Ihnen?" }],
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      // Return the mock response when the JSON method is called
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the input text and languages
    const result = await translateText(
      "Guten Tag, wie geht es Ihnen?",
      "fr",
      "de"
    );

    // Verify that the translated text is the same as the input text
    expect(result).toBe("Guten Tag, wie geht es Ihnen?");
  });
  /**
   * Translates a phrase from Italian to Portuguese.
   *
   * @param {string} text - The phrase to be translated, in this case a phrase in Italian.
   * @param {string} sourceLanguage - The source language, in this case "it" for Italian.
   * @param {string} targetLanguage - The target language, in this case "pt" for Portuguese.
   * @returns {Promise<string>} - The translated phrase in Portuguese.
   */

  it("should translate a phrase from Italian to Portuguese", async () => {
    // Mock the Google Translate API response
    const mockResponse = {
      data: {
        translations: [{ translatedText: "Bom dia, mundo!" }], // The translated text in Portuguese
      },
    };
    // Mock the global.fetch() to return the mocked response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText() function with the mocked response
    const result = await translateText("Bom dia, mundo!", "it", "pt");

    // Assert that the translated text is correct
    expect(result).toBe("Bom dia, mundo!");
  });

  /**
   * Translates a word from German to Spanish.
   *
   * @param {string} text - The word to be translated, in this case a word in German.
   * @param {string} sourceLanguage - The source language, in this case "de" for German.
   * @param {string} targetLanguage - The target language, in this case "es" for Spanish.
   * @returns {Promise<string>} - The translated word in Spanish.
   */
  it("should translate a word from German to Spanish", async () => {
    // Mock a successful response from the translation API
    const mockResponse = {
      data: {
        // The translated text
        translations: [{ translatedText: "Adiós" }],
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // The response status
      // The json() function is called to parse the response
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the given parameters
    const result = await translateText("Adiós", "de", "es");

    // Verify that the function returns the expected translated text
    expect(result).toBe("Adiós");
  });

  /**
   * Translates a sentence with numbers from English to French.
   *
   * @param {string} text - The text to be translated, in this case a sentence with numbers in English.
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "fr" for French.
   * @returns {Promise<string>} - The translated text in French.
   */
  it("should translate a sentence with numbers from English to French", async () => {
    // Mock response from Google Translate API
    const mockResponse = {
      data: {
        translations: [{ translatedText: "J'ai 2 chats et 3 chiens." }], // translated text in French
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // status code
      json: jest.fn().mockResolvedValueOnce(mockResponse), // response body
    });

    // Call the translateText function with the input text and languages
    const result = await translateText("J'ai 2 chats et 3 chiens.", "en", "fr");

    // Assert that the result is the expected translated text
    expect(result).toBe("J'ai 2 chats et 3 chiens.");
  });

  /**
   * Translates a short phrase from Spanish to Italian.
   *
   * @param {string} text - The text to be translated, in this case a short phrase in Spanish.
   * @param {string} sourceLanguage - The source language, in this case "es" for Spanish.
   * @param {string} targetLanguage - The target language, in this case "it" for Italian.
   * @returns {Promise<string>} - The translated text in Italian.
   */
  it("should translate a short phrase from Spanish to Italian", async () => {
    // Mock the response from the translation API
    const mockResponse = {
      data: {
        // The translated text
        translations: [{ translatedText: "Buona fortuna!" }],
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // The response status
      json: jest.fn().mockResolvedValueOnce(mockResponse), // The response data
    });

    // Call the translateText function with the given parameters
    const result = await translateText("Buona fortuna!", "es", "it");

    // Assert that the translated text is correct
    expect(result).toBe("Buona fortuna!");
  });

  /**
   * Translates a sentence from Portuguese to Japanese.
   *
   * @param {string} text - The text to be translated, in this case a sentence in Portuguese.
   * @param {string} sourceLanguage - The source language, in this case "pt" for Portuguese.
   * @param {string} targetLanguage - The target language, in this case "ja" for Japanese.
   * @returns {Promise<string>} - The translated text in Japanese.
   */
  it("should translate a sentence from Portuguese to Japanese", async () => {
    const mockResponse = {
      data: {
        translations: [{ translatedText: "私は日本語を勉強しています。" }], // Expected translation
      },
    };

    // Mock the global fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the function with Portuguese input to translate to Japanese
    const result = await translateText(
      "私は日本語を勉強しています。", // Input sentence in Portuguese
      "pt", // Source language code: Portuguese
      "ja" // Target language code: Japanese
    );

    // Expect the result to match the expected Japanese translation

    expect(result).toBe("私は日本語を勉強しています。");
  });

  /**
   * Translates a sentence from Korean to English.
   *
   * @param {string} text - The text to be translated, in this case a sentence in Korean.
   * @param {string} sourceLanguage - The source language, in this case "ko" for Korean.
   * @param {string} targetLanguage - The target language, in this case "en" for English.
   * @returns {Promise<string>} - The translated text in English.
   */
  it("should translate a sentence from Korean to English", async () => {
    // Mock response from Google Translate API
    const mockResponse = {
      data: {
        translations: [{ translatedText: "I love Korean food." }], // Korean sentence translated to English
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the test parameters
    const result = await translateText("I love Korean food.", "ko", "en");

    // Verify that the function returns the expected translated text
    expect(result).toBe("I love Korean food.");
  });

  /**
   * Translates a sentence from Russian to French.
   *
   * @param {string} text - The text to be translated, in this case a sentence in Russian.
   * @param {string} sourceLanguage - The source language, in this case "ru" for Russian.
   * @param {string} targetLanguage - The target language, in this case "fr" for French.
   * @returns {Promise<string>} - The translated text in French.
   */
  it("should translate a sentence from Russian to French", async () => {
    // Mock Google Translate response
    const mockResponse = {
      data: {
        translations: [
          // Translated text in French
          { translatedText: "Moscou est la capitale de la Russie." },
        ],
      },
    };
    // Mock the fetch call to Google Translate API
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call translateText with the Russian text, source language Russian, and target language French
    const result = await translateText(
      "Moscou est la capitale de la Russie.", // Russian text
      "ru", // Source language Russian
      "fr" // Target language French
    );

    // Assert that the translated text is correct
    expect(result).toBe("Moscou est la capitale de la Russie.");
  });

  /**
   * Translates a sentence from Arabic to English.
   *
   * @param {string} text - The text to be translated, in this case a sentence in Arabic.
   * @param {string} sourceLanguage - The source language, in this case "ar" for Arabic.
   * @param {string} targetLanguage - The target language, in this case "en" for English.
   * @returns {Promise<string>} - The translated text in English.
   */
  it("should translate a sentence from Arabic to English", async () => {
    // Mock the Google Translate API response
    const mockResponse = {
      data: {
        translations: [{ translatedText: " " }], // The translated text from Arabic to English
      },
    };
    // Mock the fetch call to the Google Translate API
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse), // Resolve the fetch call with the mocked response
    });

    // Call the translateText function with the test parameters
    const result = await translateText(
      " ", // The text to be translated from Arabic
      "ar", // The source language, Arabic
      "en" // The target language, English
    );

    // Assert that the translated text is correct
    expect(result).toBe(" ");
  });

  /**
   * Translates a sentence from Hindi to Spanish.
   *
   * @param {string} text - The text to be translated, in this case a sentence in Hindi.
   * @param {string} sourceLanguage - The source language, in this case "hi" for Hindi.
   * @param {string} targetLanguage - The target language, in this case "es" for Spanish.
   * @returns {Promise<string>} - The translated text in Spanish.
   */
  it("should translate a sentence from Hindi to Spanish", async () => {
    // Mock the Google Translate API response
    const mockResponse = {
      data: {
        translations: [{ translatedText: " " }], // The translated text in Spanish
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // The API call was successful
      json: jest.fn().mockResolvedValueOnce(mockResponse), // The response JSON
    });

    // Call the translateText function with Hindi as the source language and Spanish as the target language
    const result = await translateText(" ", "hi", "es");

    // Assert that the translated text matches the expected result
    expect(result).toBe(" ");
  });
  /**
   * Translates a sentence from Chinese to English.
   *
   * @param {string} text - The text to be translated, in this case a sentence in Chinese.
   * @param {string} sourceLanguage - The source language, in this case "zh" for Chinese.
   * @param {string} targetLanguage - The target language, in this case "en" for English.
   * @returns {Promise<string>} - The translated text in English.
   */
  it("should translate a sentence from Chinese to English", async () => {
    // Mock Google Translate API response
    const mockResponse = {
      data: {
        translations: [{ translatedText: "China is a large country." }], // translated text in English
      },
    };
    // Mock the `fetch` function
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // Mock the response status
      json: jest.fn().mockResolvedValueOnce(mockResponse), // Mock the response JSON
    });

    // Call the `translateText` function with the mocked `fetch` function
    const result = await translateText("China is a large country.", "zh", "en");

    // Verify that the translated text is correct
    expect(result).toBe("China is a large country.");
  });
  /**
   * Translates a sentence from Dutch to German.
   *
   * @param {string} text - The text to be translated, in this case a sentence in Dutch.
   * @param {string} sourceLanguage - The source language, in this case "nl" for Dutch.
   * @param {string} targetLanguage - The target language, in this case "de" for German.
   * @returns {Promise<string>} - The translated text in German.
   */
  it("should translate a sentence from Dutch to German", async () => {
    // Mock the Google Translate API response
    const mockResponse = {
      data: {
        translations: [
          // The translated text in German
          { translatedText: "Ich liebe es, neue Orte zu erkunden." },
        ],
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the given parameters
    const result = await translateText(
      "Ich liebe es, neue Orte zu erkunden.", // The text to be translated
      "nl", // The source language (Dutch)
      "de" // The target language (German)
    );

    // Assert that the result is the translated text
    expect(result).toBe("Ich liebe es, neue Orte zu erkunden.");
  });
  /**
   * Translates a sentence from Swedish to Italian.
   *
   * @param {string} text - The text to be translated, in this case a sentence in Swedish.
   * @param {string} sourceLanguage - The source language, in this case "sv" for Swedish.
   * @param {string} targetLanguage - The target language, in this case "it" for Italian.
   * @returns {Promise<string>} - The translated text in Italian.
   */

  it("should translate a sentence from Swedish to Italian", async () => {
    // Mock Google Translate response
    const mockResponse = {
      data: {
        translations: [{ translatedText: "La Svezia è un paese bellissimo." }], // Mocked translation result
      },
    };
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse), // Mock json() method
    });

    // Call translateText with source text, source language and target language
    const result = await translateText(
      "La Svezia è un paese bellissimo.", // Original text in Swedish
      "sv", // Source language: Swedish
      "it" // Target language: Italian
    );

    // Assert that the translated text is correct
    expect(result).toBe("La Svezia è un paese bellissimo.");
  });
  /**
   * Translates a sentence from Polish to Spanish.
   *
   * @param {string} text - The text to be translated, in this case a sentence in Polish.
   * @param {string} sourceLanguage - The source language, in this case "pl" for Polish.
   * @param {string} targetLanguage - The target language, in this case "es" for Spanish.
   * @returns {Promise<string>} - The translated text in Spanish.
   */
  it("should translate a sentence from Polish to Spanish", async () => {
    // Mock the Google Translate API response
    const mockResponse = {
      data: {
        translations: [{ translatedText: "Me encanta la comida polaca." }], // Translated text in Spanish
      },
    };

    // Mock the fetch function to return a successful response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // Response status is 200
      json: jest.fn().mockResolvedValueOnce(mockResponse), // Return the mocked response
    });

    // Call the translateText function with the test data
    const result = await translateText(
      "Me encanta la comida polaca.", // Text to translate in Polish
      "pl", // Source language is Polish
      "es" // Target language is Spanish
    );

    // Assert that the translated text is correct
    expect(result).toBe("Me encanta la comida polaca.");
  });

  /**
   * Translates a sentence from Turkish to French.
   *
   * @param {string} text - The text to be translated, in this case a sentence in Turkish.
   * @param {string} sourceLanguage - The source language, in this case "tr" for Turkish.
   * @param {string} targetLanguage - The target language, in this case "fr" for French.
   * @returns {Promise<string>} - The translated text in French.
   */
  it("should translate a sentence from Turkish to French", async () => {
    // Mock the Google Translate API response
    const mockResponse = {
      data: {
        translations: [
          // The translated text in French
          { translatedText: "Istanbul est une ville magnifique." },
        ],
      },
    };
    // Mock the `fetch` function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the `translateText` function with the sentence in Turkish,
    // the source language "tr", and the target language "fr"
    const result = await translateText(
      "Istanbul est une ville magnifique.",
      "tr",
      "fr"
    );

    // Assert that the translated text is equal to the expected result
    expect(result).toBe("Istanbul est une ville magnifique.");
  });
  /**
   * Translates a sentence from Vietnamese to English.
   *
   * @param {string} text - The text to be translated, in this case a sentence in Vietnamese.
   * @param {string} sourceLanguage - The source language, in this case "vi" for Vietnamese.
   * @param {string} targetLanguage - The target language, in this case "en" for English.
   * @returns {Promise<string>} - The translated text in English.
   */

  it("should translate a sentence from Vietnamese to English", async () => {
    // Mock Google Translate response
    const mockResponse = {
      data: {
        translations: [
          // Translated text from Vietnamese to English
          { translatedText: "Vietnam has a rich culture and history." },
        ],
      },
    };
    // Mock the fetch call to Google Translate API
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call translateText with the text to translate and the languages
    const result = await translateText(
      "Vietnam has a rich culture and history.", // Text to translate
      "vi", // Source language: Vietnamese
      "en" // Target language: English
    );

    // Assert that the translated text is correct
    expect(result).toBe("Vietnam has a rich culture and history.");
  });

  /**
   * Translates a sentence from Thai to Japanese.
   *
   * @param {string} text - The text to be translated, in this case a sentence in Thai.
   * @param {string} sourceLanguage - The source language, in this case "th" for Thai.
   * @param {string} targetLanguage - The target language, in this case "ja" for Japanese.
   * @returns {Promise<string>} - The translated text in Japanese.
   */
  it("should translate a sentence from Thai to Japanese", async () => {
    // Mock response from Google Translate API
    const mockResponse = {
      data: {
        translations: [{ translatedText: "タイは美しい国です。" }], // Thai sentence translated to Japanese
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the test parameters
    const result = await translateText("タイは美しい国です。", "th", "ja");

    // Verify that the function returns the expected translated text
    expect(result).toBe("タイは美しい国です。");
  });

  /**
   * Translates a sentence from Indonesian to Korean.
   *
   * @param {string} text - The text to be translated, in this case an Indonesian sentence.
   * @param {string} sourceLanguage - The source language, in this case "id" for Indonesian.
   * @param {string} targetLanguage - The target language, in this case "ko" for Korean.
   * @returns {Promise<string>} - The translated text, in this case the Korean translation of the Indonesian sentence.
   */
  it("should translate a sentence from Indonesian to Korean", async () => {
    // Mock a successful response from the translation API
    const mockResponse = {
      data: {
        // The translated text
        translations: [
          { translatedText: "인도네시아는 아름다운 섬나라입니다." },
        ],
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      // Indicate that the request was successful
      ok: true,
      // Return the mock response as JSON
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the given parameters
    const result = await translateText(
      "인도네시아는 아름다운 섬나라입니다.",
      "id",
      "ko"
    );

    // Assert that the translated text is correct
    expect(result).toBe("인도네시아는 아름다운 섬나라입니다.");
  });

  /**
   * Translates the English word "Hello" to the Spanish word "Hola".
   *
   * @param {string} text - The text to be translated, in this case "Hello".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "es" for Spanish.
   * @returns {Promise<string>} - The translated text, in this case "Hola".
   */
  it("should translate 'Hello' to 'Hola' in Spanish", async () => {
    // Mock the response from the translation API
    const mockResponse = {
      data: {
        translations: [{ translatedText: "Hola" }], // translation of "Hello" to Spanish
      },
    };

    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // success status
      json: jest.fn().mockResolvedValueOnce(mockResponse), // mocked response
    });

    // Call the translateText function with the mock
    const result = await translateText("Hello", "en", "es");

    // Assert that the response is correct
    expect(result).toBe("Hola");
  });

  /**
   * Translates the English word "Goodbye" to the French word "Au revoir".
   *
   * @param {string} text - The text to be translated, in this case "Goodbye".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "fr" for French.
   * @returns {Promise<string>} - The translated text, in this case "Au revoir".
   */
  it("should translate 'Goodbye' to 'Au revoir' in French", async () => {
    // Mock the response from the translation API
    const mockResponse = {
      data: {
        translations: [{ translatedText: "Au revoir" }], // The translated text
      },
    };

    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // The response status
      json: jest.fn().mockResolvedValueOnce(mockResponse), // The response data
    });

    // Call the translateText function with the test parameters
    const result = await translateText("Goodbye", "en", "fr");

    // Verify that the function returns the expected translated text
    expect(result).toBe("Au revoir");
  });

  /**
   * Translates the English word "Thank you" to the German word "Danke".
   *
   * @param {string} text - The text to be translated, in this case "Thank you".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "de" for German.
   * @returns {Promise<string>} - The translated text, in this case "Danke".
   */
  it("should translate 'Thank you' to 'Danke' in German", async () => {
    // Mock the response from the translation API
    const mockResponse = {
      data: {
        translations: [{ translatedText: "Danke" }], // The translated text
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // The response status
      json: jest.fn().mockResolvedValueOnce(mockResponse), // The response data
    });

    // Call the translateText function with the given parameters
    const result = await translateText("Thank you", "en", "de");

    // Assert that the translated text is correct
    expect(result).toBe("Danke");
  });

  /**
   * Translates the given text to the target language, or returns the original text if the translation is not found.
   *
   * @param {string} text - The text to be translated.
   * @param {string} sourceLanguage - The source language code.
   * @param {string} targetLanguage - The target language code.
   * @returns {Promise<string>} - The translated text, or the original text if the translation is not found.
   */
  it("should return the original text if the translation is not found", async () => {
    // Mock the response from the translation API
    const mockResponse = {
      data: {
        translations: [], // No translation is found
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // The response status
      json: jest.fn().mockResolvedValueOnce(mockResponse), // The response data
    });

    // Call the translateText function with a text that is not translated
    const result = await translateText("Unknown text", "en", "es");

    // Assert that the response is the original text
    expect(result).toBe("Unknown text");
  });

  /**
   * Translates the English word "Hello" to the Italian word "Ciao".
   *
   * @param {string} text - The text to be translated, in this case "Hello".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "it" for Italian.
   * @returns {Promise<string>} - The translated text, in this case "Ciao".
   */
  it("should translate 'Hello' to 'Ciao' in Italian", async () => {
    // Mock the response from the translation API
    const mockResponse = {
      data: {
        // The translated text
        translations: [{ translatedText: "Ciao" }],
      },
    };

    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      // Indicate that the request was successful
      ok: true,
      // Return the mock response as JSON
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the test parameters
    const result = await translateText("Hello", "en", "it");

    // Assert that the translated text is correct
    expect(result).toBe("Ciao");
  });

  /**
   * Translates the English word "Goodbye" to the Portuguese word "Adeus".
   *
   * @param {string} text - The text to be translated, in this case "Goodbye".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "pt" for Portuguese.
   * @returns {Promise<string>} - The translated text, in this case "Adeus".
   */
  it("should translate 'Goodbye' to 'Adeus' in Portuguese", async () => {
    // Mock the response from the translation API
    const mockResponse = {
      data: {
        // The translated text
        translations: [{ translatedText: "Adeus" }],
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // The response status
      json: jest.fn().mockResolvedValueOnce(mockResponse), // The response data
    });

    // Call the translateText function with the given parameters
    const result = await translateText("Goodbye", "en", "pt");

    // Assert that the translated text is correct
    expect(result).toBe("Adeus");
  });

  /**
   * Translates the English phrase "Thank you" to the Spanish phrase "Gracias".
   *
   * @param {string} text - The text to be translated, in this case "Thank you".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "es" for Spanish.
   * @returns {Promise<string>} - The translated text, in this case "Gracias".
   */
  it("should translate 'Thank you' to 'Gracias' in Spanish", async () => {
    // Mock the response from the translation API
    const mockResponse = {
      data: {
        // The translated text
        translations: [{ translatedText: "Gracias" }],
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      // The json() function is called to parse the response
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the given parameters
    const result = await translateText("Thank you", "en", "es");

    // Expect the translated text to be "Gracias"
    expect(result).toBe("Gracias");
  });

  /**
   * Translates the English word "Yes" to the French word "Oui".
   *
   * @param {string} text - The text to be translated, in this case "Yes".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "fr" for French.
   * @returns {Promise<string>} - The translated text, in this case "Oui".
   */
  it("should translate 'Yes' to 'Oui' in French", async () => {
    // Call the translateText function with the English word "Yes" and the target language "fr"
    const result = await translateText("Yes", "en", "fr");

    // Mock the response from the translation API
    const mockResponse = {
      data: {
        translations: [{ translatedText: "Oui" }], // translated text in French
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      // The json() function is called to parse the response
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Verify that the translated text is "Oui"
    expect(result).toBe("Oui");
  });

  /**
   * Translates the English word "No" to the German word "Nein".
   *
   * @param {string} text - The text to be translated, in this case "No".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "de" for German.
   * @returns {Promise<string>} - The translated text, in this case "Nein".
   */
  it("should translate 'No' to 'Nein' in German", async () => {
    // Mock the response from the translation API
    const mockResponse = {
      data: {
        translations: [{ translatedText: "Nein" }],
      },
    };

    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the given parameters
    const result = await translateText("No", "en", "de");

    // Assert that the translated text is correct
    expect(result).toBe("Nein");
  });
  /**
   * Translates the English word "Hello" to the Russian word "Привет".
   *
   * @param {string} text - The text to be translated, in this case "Hello".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "ru" for Russian.
   * @returns {Promise<string>} - The translated text, in this case "Привет".
   */
  it("should translate 'Hello' to ' ' in Russian", async () => {
    // Mock response from the Google Translate API
    const mockResponse = {
      data: {
        // The translated text
        translations: [{ translatedText: "Привет" }],
      },
    };

    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the test parameters
    const result = await translateText("Hello", "en", "ru");

    // Verify that the function returns the expected translated text
    expect(result).toBe("Привет");
  });

  /**
   * Translates the English word "Goodbye" to the Japanese word "さようなら".
   *
   * @param {string} text - The text to be translated, in this case "Goodbye".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "ja" for Japanese.
   * @returns {Promise<string>} - The translated text, in this case "さようなら".
   */
  it("should translate 'Goodbye' to ' ' in Japanese", async () => {
    // Mock the response from the translation API
    const mockResponse = {
      data: {
        // The translated text
        translations: [{ translatedText: "さようなら" }],
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      // Indicate that the request was successful
      ok: true,
      // Return the mock response as JSON
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the given parameters
    const result = await translateText("Goodbye", "en", "ja");

    // Assert that the translated text is correct
    expect(result).toBe("さようなら");
  });

  /**
   * Translates the English phrase "Thank you" to the Korean phrase "감사합니다".
   *
   * @param {string} text - The text to be translated, in this case "Thank you".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "ko" for Korean.
   * @returns {Promise<string>} - The translated text, in this case "감사합니다".
   */
  it("should translate 'Thank you' to ' ' in Korean", async () => {
    // Mock the response from the translation API
    const mockResponse = {
      data: {
        // The translated text
        translations: [{ translatedText: "감사합니다" }],
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      // The json() function is called to parse the response
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the given parameters
    const result = await translateText("Thank you", "en", "ko");

    // Expect the translated text to be "감사합니다"
    expect(result).toBe("감사합니다");
  });
  /**
   * Translates the English word "Yes" to the Hindi word "हां".
   *
   * @param {string} text - The text to be translated, in this case "Yes".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "hi" for Hindi.
   * @returns {Promise<string>} - The translated text, in this case "हां".
   */
  it("should translate 'Yes' to 'हां' in Hindi", async () => {
    // Mock the response from the translation API
    const mockResponse = {
      data: {
        translations: [{ translatedText: "हां" }], // translated text in Hindi
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      // The json() function is called to parse the response
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the English word "Yes" and the target language "hi"
    const result = await translateText("Yes", "en", "hi");

    // Verify that the translated text is "हां"
    expect(result).toBe("हां");
  });
  /**
   * Translates the English word "No" to the Arabic word "لا".
   *
   * @param {string} text - The text to be translated, in this case "No".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "ar" for Arabic.
   * @returns {Promise<string>} - The translated text, in this case "لا".
   */
  it("should translate 'No' to 'لا' in Arabic", async () => {
    const mockResponse = {
      // Mock response from the Google Translate API
      data: {
        translations: [{ translatedText: "لا" }], // "لا" is the Arabic word for "No"
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await translateText("No", "en", "ar"); // Translate "No" from English to Arabic

    expect(result).toBe("لا"); // Expect the result to be "لا"
  });

  /**
   * Translates the English word "Hello" to the French word "Bonjour".
   *
   * @param {string} text - The text to be translated, in this case "Hello".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "fr" for French.
   * @returns {Promise<string>} - The translated text, in this case "Bonjour".
   */
  it("should translate 'Hello' to 'Bonjour' in French", async () => {
    // Mock the response from the translation API
    const mockResponse = {
      data: {
        // The translated text
        translations: [{ translatedText: "Bonjour" }],
      },
    };

    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      // Indicate that the request was successful
      ok: true,
      // Return the mock response as JSON
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the test parameters
    const result = await translateText("Hello", "en", "fr");
    // Verify that the function returns the expected translated text
    expect(result).toBe("Bonjour");
  });

  /**
   * Translates the English word "Goodbye" to the German word "Auf Wiedersehen".
   *
   * @param {string} text - The text to be translated, in this case "Goodbye".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "de" for German.
   * @returns {Promise<string>} - The translated text, in this case "Auf Wiedersehen".
   */
  it("should translate 'Goodbye' to 'Auf Wiedersehen' in German", async () => {
    // Mock the response from the translation API
    const mockResponse = {
      data: {
        translations: [{ translatedText: "Auf Wiedersehen" }], // The translated text
      },
    };

    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // The response status
      json: jest.fn().mockResolvedValueOnce(mockResponse), // The response data
    });

    // Call the translateText function with the given parameters
    const result = await translateText("Goodbye", "en", "de");

    // Assert that the translated text is correct
    expect(result).toBe("Auf Wiedersehen");
  });

  /**
   * Translates the English phrase "Thank you" to the Italian word "Grazie".
   *
   * @param {string} text - The text to be translated, in this case "Thank you".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "it" for Italian.
   * @returns {Promise<string>} - The translated text, in this case "Grazie".
   */
  it("should translate 'Thank you' to 'Grazie' in Italian", async () => {
    // Mock the response from the translation API
    const mockResponse = {
      data: {
        // The translated text
        translations: [{ translatedText: "Grazie" }],
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      // The json() function is called to parse the response
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the given parameters
    const result = await translateText("Thank you", "en", "it");
    // Expect the translated text to be "Grazie"
    expect(result).toBe("Grazie");
  });

  /**
   * Translates the English word "Yes" to the Portuguese word "Sim".
   *
   * @param {string} text - The text to be translated, in this case "Yes".
   * @param {string} sourceLanguage - The source language, in this case "en" for English.
   * @param {string} targetLanguage - The target language, in this case "pt" for Portuguese.
   * @returns {Promise<string>} - The translated text, in this case "Sim".
   */
  it("should translate 'Yes' to 'Sim' in Portuguese", async () => {
    // Mock the response from the translation API
    const mockResponse = {
      data: {
        translations: [{ translatedText: "Sim" }], // translated text in Portuguese
      },
    };
    // Mock the fetch function to return the mock response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the translateText function with the English word "Yes" and the target language "pt"
    const result = await translateText("Yes", "en", "pt");
    // Verify that the translated text is "Sim"
    expect(result).toBe("Sim");
  });

  /**
   * Tests that the `translateText` function correctly translates the English word "No" to the Spanish word "No".
   *
   * @async
   * @param {string} - The word to be translated, in this case "No".
   * @param {string} - The source language, in this case "en" for English.
   * @param {string} - The target language, in this case "es" for Spanish.
   * @returns {string} - The translated text, which should be "No".
   */
  it("should translate 'No' to 'No' in Spanish", async () => {
    // Mock the response from the translate API
    const mockResponse = {
      data: {
        translations: [{ translatedText: "No" }], // translation of "No" to Spanish
      },
    };

    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true, // success status
      json: jest.fn().mockResolvedValueOnce(mockResponse), // mocked response
    });

    // Call the translateText function with the mock
    const result = await translateText("No", "en", "es");

    // Assert that the response is correct
    expect(result).toBe("No");
  });
});
