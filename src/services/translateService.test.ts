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

describe('translateService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should translate text using Google Translate API', async () => {
    const text = 'Hello world!';
    const sourceLang = 'en';
    const targetLang = 'es';

    const translatedText = await translateText(text, sourceLang, targetLang);

    expect(translatedText).toBeDefined();
    expect(translatedText).not.toBe(text);
  });

  it('should handle errors during translation', async () => {
    const text = 'Hello world!';
    const sourceLang = 'en';
    const targetLang = 'es';

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        error: {
          code: 400,
          message: 'Invalid API key'
        }
      })
    });

    try {
      await translateText(text, sourceLang, targetLang);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Failed to translate');
    }
  });

  it('should use default target language if not provided', async () => {
    const text = 'Hello world!';
    const sourceLang = 'en';

    const translatedText = await translateText(text, sourceLang);

    expect(translatedText).toBeDefined();
    expect(translatedText).not.toBe(text);
  });
});
