/**
 * Imports the configuration object and the error logger utility from the specified files.
 */
import { CONFIG } from "../config";
import { UDAErrorLogger } from "../config/error-log";

/**
 * Translates the given text from the specified source language to the target language.
 *
 * @param text - The text to be translated.
 * @param sourceLang - The source language code.
 * @param targetLang - The target language code (default is 'en').
 * @returns A Promise that resolves to the translated text.
 * @throws {Error} If required parameters are missing, the translation configuration is missing, or the translation API fails.
 */
export const translateText = async (
  // Text to translate
  text: string,

  // Source language for translation
  sourceLang: string,

  // Target language for translation (default: "en")
  targetLang: string = "en"
): Promise<string> => {
  try {
    // Validate required parameters
    if (!text || !sourceLang) {
      throw new Error("Required parameters are missing");
    }

    // Extract translation configuration from the CONFIG object
    const {
      translate: { provider, apikey, apiurl },
    } = CONFIG.multilingual;

    // Validate translation configuration
    if (!provider || !apikey || !apiurl) {
      throw new Error("Translation configuration is missing");
    }

    // Set the post URL based on the translation provider
    let posturl = "";
    switch (provider) {
      case "google":
        // Build the Google Translate API URL with the provided parameters
        posturl = `${apiurl}?key=${encodeURIComponent(
          apikey
        )}&source=${sourceLang}&target=${targetLang}&q=${encodeURIComponent(
          text
        )}`;
        break;
      default:
        // Throw an error if the translation provider is unsupported
        throw new Error(`Unsupported translation provider: ${provider}`);
    }

    /**
     * Sends a request to the translation API and returns the translated text.
     *
     * @param posturl - The URL to send the translation request to.
     * @returns The translated text.
     * @throws {Error} If the translation API request fails or the response does not contain valid translation data.
     */
    // Make API call and return translated text
    const response = await fetch(posturl);

    // Check if the API call was successful
    if (!response.ok) {
      // Throw an error if the API call failed
      throw new Error(`Translation API failed with status ${response.status}`);
    }

    // Parse the response data as JSON
    const jsonData = await response.json();

    // Check if the response data contains a translation
    if (jsonData?.data?.translations?.length > 0) {
      // Return the translated text
      return jsonData.data.translations[0].translatedText;
    }

    throw new Error("Failed to translate");
    /**
     * Handles errors that occur during the text translation process.
     * @param error - The error object that was thrown.
     * @throws {Error} The original error that was thrown.
     */
    // catch and handle any errors that occur durind the text translation process
  } catch (error) {
    // Log the error using the UDAErrorLogger
    UDAErrorLogger.error(`Error in translateText: ${error.message}`, error);
    // Re-throw the error to propagate if to the caller
    throw error;
  }
};
