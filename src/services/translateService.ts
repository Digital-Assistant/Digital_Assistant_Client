import { CONFIG } from "../config";
import { UDAErrorLogger } from "../config/error-log";

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

    const response = await fetch(posturl);

    if (!response.ok) {
      throw new Error(`Translation API failed with status ${response.status}`);
    }

    const jsonData = await response.json();

    if (jsonData?.data?.translations?.length > 0) {
      return jsonData.data.translations[0].translatedText;
    }

    throw new Error("Failed to translate");
  } catch (error) {
    UDAErrorLogger.error(`Error in translateText: ${error.message}`, error);
    throw error;
  }
};
