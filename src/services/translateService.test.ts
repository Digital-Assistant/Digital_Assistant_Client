import { translateText } from './translateService';
import { CONFIG } from '../config';

// Mock the '../config' module
jest.mock('../config', () => ({
  // Define a mock CONFIG object
  CONFIG: {
    // Set up the multilingual configuration
    multilingual: {
      // Configure translation settings
      translate: {
        // Specify the translation provider as 'google'
        provider: 'google',
        // Set the API key for authentication (replace with actual key in production)
        apikey: 'YOUR_API_KEY',
        // Define the URL for the Google Translate API
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
   // Create a spy on the global fetch function
jest.spyOn(global, 'fetch').mockResolvedValue({
  // Mock the json method of the fetch response
  json: jest.fn().mockResolvedValue({
    // Simulate an error response
    error: {
      // Set the error code to 400 (Bad Request)
      code: 400,
      // Provide an error message indicating an invalid API key
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

