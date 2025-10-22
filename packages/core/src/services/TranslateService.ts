import { DigitalAssistantConfiguration } from "../DigitalAssistantConfiguration";
import { ApiClient, ApiResponse } from "./apiClient";
import { ErrorLoggerService } from "./ErrorLoggerService";

/**
 * Service for handling text translation.
 */
export class TranslateService {
    private apiClient: ApiClient;
    private config: DigitalAssistantConfiguration;
    private errorLogger: ErrorLoggerService;

    /**
     * Creates an instance of TranslateService.
     * @param apiClient - The API client for making requests.
     * @param config - The configuration for the Digital Assistant.
     * @param errorLogger - The service for logging errors.
     */
    constructor(apiClient: ApiClient, config: DigitalAssistantConfiguration, errorLogger: ErrorLoggerService) {
        this.apiClient = apiClient;
        this.config = config;
        this.errorLogger = errorLogger;
    }

    /**
     * Translates text from a source language to a target language.
     *
     * @param text - The text to translate.
     * @param sourceLang - The source language of the text.
     * @param targetLang - The target language for the translation.
     * @returns A promise that resolves with the translated text.
     */
    public async translateText(
        text: string,
        sourceLang: string,
        targetLang: string = "en"
    ): Promise<string> {
        try {
            if (!text || !sourceLang) {
                throw new Error("Required parameters are missing");
            }

            const { provider, apikey, apiurl } = this.config.multilingual.translate;

            if (!provider || !apikey || !apiurl) {
                throw new Error("Translation configuration is missing");
            }

            let posturl = "";
            switch (provider) {
                case "google":
                    if (!apikey) {
                        throw new Error(`Key not available for: ${provider}`);
                    }
                    posturl = `${apiurl}?key=${encodeURIComponent(
                        apikey
                    )}&source=${sourceLang}&target=${targetLang}&q=${encodeURIComponent(
                        text
                    )}`;
                    break;
                default:
                    throw new Error(`Unsupported translation provider: ${provider}`);
            }

            const response: ApiResponse<any> = await this.apiClient.get(posturl);
            
            if (response?.data?.translations?.length > 0) {
                return response.data.translations[0].translatedText;
            }

            throw new Error("Failed to translate");
        } catch (error: any) {
            this.errorLogger.error(`Error in translateText: ${error.message}`, error);
            throw error;
        }
    }
}
