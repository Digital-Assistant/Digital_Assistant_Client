import { TranslateService } from '../TranslateService';
import { ApiClient } from '../apiClient';
import { DigitalAssistantConfiguration } from '../../DigitalAssistantConfiguration';
import { ErrorLoggerService } from '../ErrorLoggerService';

// Mock the dependencies
jest.mock('../apiClient');
jest.mock('../ErrorLoggerService');

describe('TranslateService', () => {
    let translateService: TranslateService;
    let apiClient: jest.Mocked<ApiClient>;
    let errorLogger: jest.Mocked<ErrorLoggerService>;

    beforeEach(() => {
        const config = new DigitalAssistantConfiguration({
            multilingual: {
                translate: {
                    provider: 'google',
                    apikey: 'test-api-key',
                    apiurl: 'https://translation.googleapis.com/language/translate/v2',
                },
            },
            logging: {
                host: 'log-host.com',
                path: '/logs'
            }
        });
        apiClient = new ApiClient() as jest.Mocked<ApiClient>;
        errorLogger = new ErrorLoggerService(config) as jest.Mocked<ErrorLoggerService>;
        translateService = new TranslateService(apiClient, config, errorLogger);
    });

    it('should translate text successfully', async () => {
        const mockResponse = {
            data: {
                translations: [
                    {
                        translatedText: 'Hello',
                    },
                ],
            },
        };
        apiClient.get.mockResolvedValue(mockResponse as any);

        const result = await translateService.translateText('Hola', 'es', 'en');

        expect(result).toBe('Hello');
        expect(apiClient.get).toHaveBeenCalledWith(
            'https://translation.googleapis.com/language/translate/v2?key=test-api-key&source=es&target=en&q=Hola'
        );
        expect(errorLogger.error).not.toHaveBeenCalled();
    });

    it('should log an error if translation fails', async () => {
        const apiError = new Error('Network Error');
        apiClient.get.mockRejectedValue(apiError);

        await expect(translateService.translateText('Hola', 'es', 'en')).rejects.toThrow('Network Error');

        expect(errorLogger.error).toHaveBeenCalledWith('Error in translateText: Network Error', apiError);
    });

    it('should throw and log an error if required parameters are missing', async () => {
        const error = new Error('Required parameters are missing');
        await expect(translateService.translateText('', 'es', 'en')).rejects.toThrow(error);
        expect(errorLogger.error).toHaveBeenCalledWith(`Error in translateText: ${error.message}`, error);
    });
});
