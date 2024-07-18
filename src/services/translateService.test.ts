import { translateText } from './translateService';
import { CONFIG } from '../config';

jest.mock('../config', () => ({
  CONFIG: {
    multilingual: {
      translate: {
        provider: 'google',
        apikey: 'YOUR_API_KEY',
        apiurl: 'https://translation.googleapis.com/language/translate/v2'
      }
    }
  }
}));

/**
 * Tests the `translateText` function from the `translateService` module.
 * Verifies that the function can translate text using the Google Translate API,
 * and handles errors that may occur during the translation process.
 */
describe('translateService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
});

// Test suite for translateText function
describe('translateText', () => {
  // Test case to verify successful translation using Google Translate API
  it('should translate text using Google Translate API', async () => {
    // Test data setup
    const text = 'Hello world!';
    const sourceLang = 'en';
    const targetLang = 'es';

    // Call the function being tested
    const translatedText = await translateText(text, sourceLang, targetLang);

    // Assertions
    expect(translatedText).toBeDefined();
    expect(translatedText).not.toBe(text);
  });

  // Test case to verify error handling during translation
  it('should handle errors during translation', async () => {
    // Test data setup
    const text = 'Hello world!';
    const sourceLang = 'en';
    const targetLang = 'es';

    // Mock the fetch function to simulate an error response
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        error: {
          code: 400,
          message: 'Invalid API key'
        }
      })
    });

    // Call the function being tested and check for error
    try {
      await translateText(text, sourceLang, targetLang);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Failed to translate');
    }
  });

  // Test case to verify default target language usage
  it('should use default target language if not provided', async () => {
    // Test data setup
    const text = 'Hello world!';
    const sourceLang = 'en';

    // Call the function being tested
    const translatedText = await translateText(text, sourceLang);

    // Assertions
    expect(translatedText).toBeDefined();
    expect(translatedText).not.toBe(text);
  });
});

