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
  text: string,
  sourceLang: string,
  targetLang: string = "en"
): Promise<string> => {
  try {
    if (!text || !sourceLang) {
      throw new Error("Required parameters are missing");
    }

    const {
      translate: { provider, apikey, apiurl },
    } = CONFIG.multilingual;

    if (!provider || !apikey || !apiurl) {
      throw new Error("Translation configuration is missing");
    }

    let posturl = "";
    switch (provider) {
      case "google":
        posturl = `${apiurl}?key=${encodeURIComponent(
          apikey
        )}&source=${sourceLang}&target=${targetLang}&q=${encodeURIComponent(
          text
        )}`;
        break;
      default:
        throw new Error(`Unsupported translation provider: ${provider}`);
    }

    /**
     * Sends a request to the translation API and returns the translated text.
     *
     * @param posturl - The URL to send the translation request to.
     * @returns The translated text.
     * @throws {Error} If the translation API request fails or the response does not contain valid translation data.
     */
    const response = await fetch(posturl);

    if (!response.ok) {
      throw new Error(`Translation API failed with status ${response.status}`);
    }

    const jsonData = await response.json();

    if (jsonData?.data?.translations?.length > 0) {
      return jsonData.data.translations[0].translatedText;
    }

    throw new Error("Failed to translate");
    /**
     * Handles errors that occur during the text translation process.
     * @param error - The error object that was thrown.
     * @throws {Error} The original error that was thrown.
     */
  } catch (error) {
    UDAErrorLogger.error(`Error in translateText: ${error.message}`, error);
    throw error;
  }
};
