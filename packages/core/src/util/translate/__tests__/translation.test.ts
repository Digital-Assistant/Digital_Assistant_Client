
// Import the function to be tested
import { translate } from '../translation';

// Mock the i18next library
import i18next from 'i18next';
jest.mock('i18next', () => ({
  t: jest.fn(),
}));

describe('translate', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should call i18next.t with the provided attribute', () => {
    const testKey = 'common.hello';
    const expectedTranslation = 'Hello';
    (i18next.t as jest.Mock).mockReturnValue(expectedTranslation);

    const result = translate(testKey);

    expect(i18next.t).toHaveBeenCalledTimes(1);
    expect(i18next.t).toHaveBeenCalledWith(testKey);
    expect(result).toBe(expectedTranslation);
  });

  it('should return the key itself if i18next.t does not find a translation', () => {
    const testKey = 'common.untranslated';
    // i18next.t often returns the key itself if no translation is found
    (i18next.t as jest.Mock).mockReturnValue(testKey);

    const result = translate(testKey);

    expect(i18next.t).toHaveBeenCalledWith(testKey);
    expect(result).toBe(testKey);
  });

  it('should handle empty string keys', () => {
    const testKey = '';
    const expectedTranslation = '';
    (i18next.t as jest.Mock).mockReturnValue(expectedTranslation);

    const result = translate(testKey);

    expect(i18next.t).toHaveBeenCalledWith(testKey);
    expect(result).toBe(expectedTranslation);
  });

  it('should handle number keys (if i18next supports them)', () => {
    const testKey = 123;
    const expectedTranslation = 'Number 123';
    (i18next.t as jest.Mock).mockReturnValue(expectedTranslation);

    const result = translate(testKey);

    expect(i18next.t).toHaveBeenCalledWith(testKey);
    expect(result).toBe(expectedTranslation);
  });

  it('should pass through any additional options to i18next.t (if the wrapper supported it)', () => {
    // Note: The current `translate` function only takes one argument.
    // If it were extended to pass options, this test would be relevant.
    // For now, it just confirms that only the key is passed.
    const testKey = 'message.with.variable';
    const expectedTranslation = 'Hello John';
    (i18next.t as jest.Mock).mockReturnValue(expectedTranslation);

    const result = translate(testKey);

    expect(i18next.t).toHaveBeenCalledWith(testKey);
    expect(result).toBe(expectedTranslation);
  });
});
