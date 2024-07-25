import { AuthDataConfig } from './AuthDataConfig';
import { AuthConfig, AuthConfigPropTypes } from './UserAuthConfig';
import { UDADigestMessage } from '../util/UDADigestMessage';
import { trigger } from '../util/events';

/**
 * Mocks the `UDADigestMessage` and `events` modules for testing purposes.
 * This allows the test suite to isolate the `AuthDataConfig` functionality
 * from the implementation details of these external modules.
 */
jest.mock('../util/UDADigestMessage');
jest.mock('../util/events');

/**
 * Sets up the test environment for the `AuthDataConfig` module by:
 * - Resetting all mocks
 * - Resetting all modules
 * - Mocking the `UserAuthConfig` module to provide a default `AuthConfig` object
 */
describe('AuthDataConfig', () => {
  /**
   * Sets up the test environment for the `AuthDataConfig` module by:
   * - Resetting all mocks
   * - Resetting all modules
   * - Mocking the `UserAuthConfig` module to provide a default `AuthConfig` object
   */
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.mock('./UserAuthConfig', () => ({
      AuthConfig: {
        id: '',
        username: '',
        password: '',
      },
    }));
  });

  /**
   * Tests that the `AuthDataConfig` function correctly updates the `AuthConfig` object with encrypted values for the provided `id`, `username`, and `password`.
   *
   * This test mocks the `UDADigestMessage` function to return a fixed "encrypted_value" string, and then verifies that the `AuthConfig` object is updated with the expected encrypted values.
   *
   * It also verifies that the `UDADigestMessage` function is called three times, once for each of the `id`, `username`, and `password` values.
   */
  it('should update AuthConfig with encrypted data', async () => {
    const mockEncrypted = 'encrypted_value';
    (UDADigestMessage as jest.Mock).mockResolvedValue(mockEncrypted);

    const testData: AuthConfigPropTypes = {
      id: 'test_id',
      username: 'test_user',
      password: 'test_password',
    };

    await AuthDataConfig(testData);

    expect(AuthConfig.id).toBe(mockEncrypted);
    expect(AuthConfig.username).toBe(mockEncrypted);
    expect(AuthConfig.password).toBe(mockEncrypted);
    expect(UDADigestMessage).toHaveBeenCalledTimes(3);
    expect(UDADigestMessage).toHaveBeenCalledWith('test_id', 'SHA-512');
    expect(UDADigestMessage).toHaveBeenCalledWith('test_user', 'SHA-512');
    expect(UDADigestMessage).toHaveBeenCalledWith('test_password', 'SHA-512');
  });

  /**
   * Tests that the `AuthDataConfig` function correctly handles empty string values for the `id` and `password` properties of the `AuthConfigPropTypes` object.
   *
   * This test verifies that:
   * - The `AuthConfig.id` property is set to an empty string when the `id` property is an empty string.
   * - The `AuthConfig.username` property is set to the encrypted value returned by `UDADigestMessage` when the `username` property is a non-empty string.
   * - The `AuthConfig.password` property is set to an empty string when the `password` property is an empty string.
   * - The `UDADigestMessage` function is called only once, with the `username` value.
   */
  it('should handle empty string values', async () => {
    const testData: AuthConfigPropTypes = {
      id: '',
      username: 'test_user',
      password: '',
    };

    await AuthDataConfig(testData);

    expect(AuthConfig.id).toBe('');
    expect(AuthConfig.username).toBe('encrypted_value');
    expect(AuthConfig.password).toBe('');
    expect(UDADigestMessage).toHaveBeenCalledTimes(1);
    expect(UDADigestMessage).toHaveBeenCalledWith('test_user', 'SHA-512');
  });

  /**
   * Tests that the `AuthDataConfig` function correctly clears the session data when the `id` property is an empty string.
   *
   * This test verifies that:
   * - The `trigger` function is called with the `'UDAClearSessionData'` event and an empty object as the event detail.
   */
  it('should trigger UDAClearSessionData when id is empty', async () => {
    const testData: AuthConfigPropTypes = {
      id: '',
    };

    await AuthDataConfig(testData);

    expect(trigger).toHaveBeenCalledWith('UDAClearSessionData', {});
  });

  /**
   * Tests that the `AuthDataConfig` function correctly clears the session data when the `id` property changes.
   *
   * This test verifies that:
   * - The `trigger` function is called with the `'UDAClearSessionData'` event and an empty object as the event detail when the `id` property changes.
   */
  it('should trigger UDAClearSessionData when id changes', async () => {
    const mockEncrypted = 'encrypted_value';
    (UDADigestMessage as jest.Mock).mockResolvedValue(mockEncrypted);

    const testData: AuthConfigPropTypes = {
      id: 'new_id',
    };

    AuthConfig.id = 'old_id';

    await AuthDataConfig(testData);

    expect(trigger).toHaveBeenCalledWith('UDAClearSessionData', {});
  });

  /**
   * Tests that the `AuthDataConfig` function correctly triggers the `RequestUDASessionData` event when the `id` property is not empty.
   *
   * This test verifies that:
   * - The `trigger` function is called with the `'RequestUDASessionData'` event and an object with `detail`, `bubbles`, and `cancelable` properties when the `id` property is not empty.
   */
  it('should trigger RequestUDASessionData when id is not empty', async () => {
    const mockEncrypted = 'encrypted_value';
    (UDADigestMessage as jest.Mock).mockResolvedValue(mockEncrypted);

    const testData: AuthConfigPropTypes = {
      id: 'test_id',
    };

    await AuthDataConfig(testData);

    expect(trigger).toHaveBeenCalledWith('RequestUDASessionData', {
      detail: { data: 'getusersessiondata' },
      bubbles: false,
      cancelable: false,
    });
  });

  /**
   * Tests that the `AuthDataConfig` function correctly logs an error when the `id` property is not a string.
   *
   * This test verifies that:
   * - The `console.log` function is called with the expected error message when the `id` property is not a string.
   */
  it('should log error for invalid data types', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const testData: any = {
      id: 123,
    };

    await AuthDataConfig(testData);

    expect(consoleSpy).toHaveBeenCalledWith('id accepts only string data type.');
  });
});

/**
 * Mocks the `UDADigestMessage` and `events` modules for testing purposes.
 * This allows the tests to control the behavior of these modules and verify the expected interactions.
 */
jest.mock('../util/UDADigestMessage');
jest.mock('../util/events');

/**
 * Resets the mocks and modules before each test in the 'AuthDataConfig additional tests' suite.
 * This ensures a clean state for each test, preventing any unintended interactions or side effects.
 */
describe('AuthDataConfig additional tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.mock('./UserAuthConfig', () => ({
      AuthConfig: {
        id: '',
        username: '',
        password: '',
        email: '',
        token: '',
      },
    }));
  });

  /**
   * Tests that the `AuthDataConfig` function correctly handles partial updates to the `AuthConfig` object.
   *
   * This test verifies that:
   * - The `UDADigestMessage` function is called to encrypt the `username` and `email` properties.
   * - The `AuthConfig` object is updated with the encrypted values for `username` and `email`.
   * - The `id`, `password`, and `token` properties remain unchanged.
   */
  it('should handle partial updates', async () => {
    const mockEncrypted = 'encrypted_value';
    (UDADigestMessage as jest.Mock).mockResolvedValue(mockEncrypted);

    const testData: AuthConfigPropTypes = {
      username: 'new_user',
      email: 'new_email@example.com',
    };

    await AuthDataConfig(testData);

    expect(AuthConfig.username).toBe(mockEncrypted);
    expect(AuthConfig.email).toBe(mockEncrypted);
    expect(AuthConfig.id).toBe('');
    expect(AuthConfig.password).toBe('');
    expect(AuthConfig.token).toBe('');
  });

  /**
   * Tests that the `AuthDataConfig` function does not update properties that are not present in the `AuthConfig` object.
   *
   * This test verifies that:
   * - If the `testData` object contains a property that does not exist in `AuthConfig`, that property is not added to `AuthConfig`.
   */
  it('should not update properties not present in AuthConfig', async () => {
    const testData: any = {
      nonExistentProp: 'some_value',
    };

    await AuthDataConfig(testData);

    expect(AuthConfig).not.toHaveProperty('nonExistentProp');
  });

  /**
   * Tests that the `AuthDataConfig` function can handle concurrent updates to the `AuthConfig` object.
   *
   * This test verifies that:
   * - The `UDADigestMessage` function is called twice to encrypt the `username` and `password` properties.
   * - The `AuthConfig` object is updated with the encrypted values for `username` and `password`.
   * - The updates to `username` and `password` are performed concurrently.
   */
  it('should handle concurrent updates', async () => {
    const mockEncrypted1 = 'encrypted_value_1';
    const mockEncrypted2 = 'encrypted_value_2';
    (UDADigestMessage as jest.Mock)
      .mockResolvedValueOnce(mockEncrypted1)
      .mockResolvedValueOnce(mockEncrypted2);

    const testData1: AuthConfigPropTypes = { username: 'user1' };
    const testData2: AuthConfigPropTypes = { password: 'pass1' };

    await Promise.all([
      AuthDataConfig(testData1),
      AuthDataConfig(testData2),
    ]);

    expect(AuthConfig.username).toBe(mockEncrypted1);
    expect(AuthConfig.password).toBe(mockEncrypted2);
  });

  /**
   * Tests that the `AuthDataConfig` function handles errors from the `UDADigestMessage` function.
   *
   * This test verifies that:
   * - If the `UDADigestMessage` function throws an error, the `AuthDataConfig` function rejects with the same error.
   * - The `AuthConfig.username` property is not updated if the `UDADigestMessage` function fails.
   */
  it('should handle errors from UDADigestMessage', async () => {
    (UDADigestMessage as jest.Mock).mockRejectedValue(new Error('Encryption failed'));

    const testData: AuthConfigPropTypes = {
      username: 'test_user',
    };

    await expect(AuthDataConfig(testData)).rejects.toThrow('Encryption failed');
    expect(AuthConfig.username).toBe('');
  });

  /**
   * Tests that the `AuthDataConfig` function does not trigger any events when no changes are made to the `AuthConfig` object.
   *
   * This test verifies that:
   * - Calling `AuthDataConfig` with an empty object (`{}`) does not trigger any events.
   */
  it('should not trigger events when no changes are made', async () => {
    const testData: AuthConfigPropTypes = {};

    await AuthDataConfig(testData);

    expect(trigger).not.toHaveBeenCalled();
  });
});

/**
 * Mocks the `UDADigestMessage` and `events` modules for testing purposes.
 * This allows the tests to control the behavior of these modules and verify the expected interactions.
 */
jest.mock('../util/UDADigestMessage');
jest.mock('../util/events');

/**
 * Resets all mocks and modules before each test in the 'AuthDataConfig extended scenarios' test suite.
 * This ensures a clean slate for each test, preventing any unintended interactions or state carryover.
 */
describe('AuthDataConfig extended scenarios', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.mock('./UserAuthConfig', () => ({
      AuthConfig: {
        id: '',
        username: '',
        password: '',
        email: '',
        token: '',
      },
    }));
  });

  /**
   * Tests that the `AuthDataConfig` function can handle multiple consecutive updates to the `AuthConfig` object.
   *
   * This test verifies that:
   * - Calling `AuthDataConfig` multiple times with different updates correctly updates the `AuthConfig` object.
   * - The `AuthConfig` object is updated with the expected encrypted values.
   */
  it('should handle multiple consecutive updates', async () => {
    const mockEncrypted = jest.fn().mockImplementation(val => `encrypted_${val}`);
    (UDADigestMessage as jest.Mock).mockImplementation(mockEncrypted);

    await AuthDataConfig({ id: 'id1' });
    await AuthDataConfig({ username: 'user1' });
    await AuthDataConfig({ password: 'pass1' });

    expect(AuthConfig.id).toBe('encrypted_id1');
    expect(AuthConfig.username).toBe('encrypted_user1');
    expect(AuthConfig.password).toBe('encrypted_pass1');
  });

  /**
   * Tests that the `AuthDataConfig` function can handle very long input strings for the `username` field.
   *
   * This test verifies that:
   * - Calling `AuthDataConfig` with a very long string (10,000 characters) for the `username` field correctly encrypts the value.
   * - The encrypted value is stored in the `AuthConfig` object as expected.
   * - The `UDADigestMessage` function is called with the correct arguments to encrypt the long string.
   */
  it('should handle very long input strings', async () => {
    const longString = 'a'.repeat(10000);
    const mockEncrypted = 'encrypted_long_string';
    (UDADigestMessage as jest.Mock).mockResolvedValue(mockEncrypted);

    await AuthDataConfig({ username: longString });

    expect(AuthConfig.username).toBe(mockEncrypted);
    expect(UDADigestMessage).toHaveBeenCalledWith(longString, 'SHA-512');
  });

  /**
   * Tests that the `AuthDataConfig` function can maintain consistency when updating multiple fields.
   *
   * This test verifies that:
   * - Calling `AuthDataConfig` with an object containing multiple updated fields correctly updates the `AuthConfig` object.
   * - The `AuthConfig` object is updated with the expected encrypted values for each field.
   */
  it('should maintain consistency when updating multiple fields', async () => {
    const mockEncrypted = jest.fn().mockImplementation(val => `encrypted_${val}`);
    (UDADigestMessage as jest.Mock).mockImplementation(mockEncrypted);

    await AuthDataConfig({
      id: 'new_id',
      username: 'new_user',
      password: 'new_pass',
      email: 'new_email',
      token: 'new_token'
    });

    expect(AuthConfig.id).toBe('encrypted_new_id');
    expect(AuthConfig.username).toBe('encrypted_new_user');
    expect(AuthConfig.password).toBe('encrypted_new_pass');
    expect(AuthConfig.email).toBe('encrypted_new_email');
    expect(AuthConfig.token).toBe('encrypted_new_token');
  });

  /**
   * Tests that the `AuthDataConfig` function handles undefined values correctly.
   *
   * This test verifies that:
   * - Calling `AuthDataConfig` with an object containing an undefined `username` field correctly sets the `AuthConfig.username` to an empty string.
   * - Calling `AuthDataConfig` with an object containing a defined `password` field correctly encrypts and sets the `AuthConfig.password` to the expected value.
   */
  it('should handle undefined values correctly', async () => {
    const testData: AuthConfigPropTypes = {
      username: undefined,
      password: 'defined_pass'
    };

    await AuthDataConfig(testData);

    expect(AuthConfig.username).toBe('');
    expect(AuthConfig.password).toBe('encrypted_defined_pass');
  });

  /**
   * Tests that the `AuthDataConfig` function triggers the `UDAClearSessionData` event when the `id` field changes from a non-empty value to an empty value.
   *
   * This test verifies that:
   * - Setting the `AuthConfig.id` field to a non-empty value before calling `AuthDataConfig`.
   * - Calling `AuthDataConfig` with an `id` field set to an empty string triggers the `UDAClearSessionData` event.
   * - The `AuthConfig.id` field is updated to an empty string after calling `AuthDataConfig`.
   */
  it('should trigger UDAClearSessionData when id changes from non-empty to empty', async () => {
    AuthConfig.id = 'existing_id';

    await AuthDataConfig({ id: '' });

    expect(trigger).toHaveBeenCalledWith('UDAClearSessionData', {});
    expect(AuthConfig.id).toBe('');
  });
});



/**
 * Mocks the `UDADigestMessage` and `events` modules for testing purposes.
 * This allows the tests to control the behavior of these modules and verify their usage.
 */
jest.mock('../util/UDADigestMessage');
jest.mock('../util/events');

/**
 * Sets up the test environment for the `AuthDataConfig` module by resetting all mocks and modules, and mocking the `UserAuthConfig` module with an empty `AuthConfig` object.
 *
 * This setup ensures that each test in the `AuthDataConfig advanced scenarios` suite starts with a clean slate, allowing for more reliable and isolated testing.
 */
describe('AuthDataConfig advanced scenarios', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.mock('./UserAuthConfig', () => ({
      AuthConfig: {
        id: '',
        username: '',
        password: '',
        email: '',
        token: '',
      },
    }));
  });

  /**
   * Tests that the `AuthDataConfig` function handles special characters in the `password` input correctly.
   *
   * This test verifies that:
   * - The `UDADigestMessage` function is called with the special characters input and the 'SHA-512' algorithm.
   * - The `AuthConfig.password` field is updated with the encrypted value returned by `UDADigestMessage`.
   */
  it('should handle special characters in input', async () => {
    const specialChars = '!@#$%^&*()_+{}[]|:;<>,.?~`';
    const mockEncrypted = 'encrypted_special_chars';
    (UDADigestMessage as jest.Mock).mockResolvedValue(mockEncrypted);

    await AuthDataConfig({ password: specialChars });

    expect(AuthConfig.password).toBe(mockEncrypted);
    expect(UDADigestMessage).toHaveBeenCalledWith(specialChars, 'SHA-512');
  });

  /**
   * Tests that the `AuthDataConfig` function handles an empty object input correctly.
   *
   * This test verifies that:
   * - The `AuthConfig` object is not modified when an empty object is passed to `AuthDataConfig`.
   * - The `UDADigestMessage` and `trigger` functions are not called.
   */
  it('should handle empty object input', async () => {
    const initialConfig = { ...AuthConfig };
    await AuthDataConfig({});

    expect(AuthConfig).toEqual(initialConfig);
    expect(UDADigestMessage).not.toHaveBeenCalled();
    expect(trigger).not.toHaveBeenCalled();
  });

  /**
   * Tests that the `AuthDataConfig` function handles rapid successive updates correctly.
   *
   * This test verifies that:
   * - The `UDADigestMessage` function is called with each unique username value and the encrypted value is used to update the `AuthConfig.username` field.
   * - The final value of `AuthConfig.username` is the encrypted value of the last username in the sequence.
   */
  it('should handle rapid successive updates', async () => {
    const mockEncrypted = jest.fn().mockImplementation(val => `encrypted_${val}`);
    (UDADigestMessage as jest.Mock).mockImplementation(mockEncrypted);

    await Promise.all([
      AuthDataConfig({ username: 'user1' }),
      AuthDataConfig({ username: 'user2' }),
      AuthDataConfig({ username: 'user3' }),
    ]);

    expect(AuthConfig.username).toBe('encrypted_user3');
  });

  /**
   * Tests that the `AuthDataConfig` function maintains other properties when updating only one.
   *
   * This test verifies that:
   * - The `AuthConfig.id` and `AuthConfig.username` properties are not modified when only the `email` property is updated.
   * - The `AuthConfig.email` property is updated with the encrypted value returned by `UDADigestMessage`.
   */
  it('should maintain other properties when updating only one', async () => {
    AuthConfig.id = 'existing_id';
    AuthConfig.username = 'existing_user';

    await AuthDataConfig({ email: 'new_email@example.com' });

    expect(AuthConfig.id).toBe('existing_id');
    expect(AuthConfig.username).toBe('existing_user');
    expect(AuthConfig.email).toBe('encrypted_new_email@example.com');
  });

  /**
   * Tests that the `AuthDataConfig` function handles non-string inputs correctly.
   *
   * This test verifies that:
   * - If the `id` or `username` properties are provided with non-string values, a warning is logged to the console.
   * - The `AuthConfig.id` and `AuthConfig.username` properties are set to empty strings when non-string values are provided.
   */
  it('should handle non-string inputs correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    await AuthDataConfig({ id: 123 as any, username: true as any });

    expect(consoleSpy).toHaveBeenCalledWith('id accepts only string data type.');
    expect(consoleSpy).toHaveBeenCalledWith('username accepts only string data type.');
    expect(AuthConfig.id).toBe('');
    expect(AuthConfig.username).toBe('');
  });
});

/**
 * Mocks the `UDADigestMessage` and `events` modules for testing purposes.
 * This allows the tests to control the behavior of these modules and verify the expected interactions.
 */
jest.mock('../util/UDADigestMessage');
jest.mock('../util/events');

/**
 * Resets the mocks and modules before each test in the 'AuthDataConfig edge cases' test suite.
 * This ensures a clean state for each test, allowing them to be run independently without
 * any side effects from previous tests.
 */
describe('AuthDataConfig edge cases', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.mock('./UserAuthConfig', () => ({
      AuthConfig: {
        id: '',
        username: '',
        password: '',
        email: '',
        token: '',
      },
    }));
  });

  /**
   * Tests that the `AuthDataConfig` function handles whitespace-only string inputs correctly.
   *
   * This test verifies that:
   * - If the `username` or `password` properties are provided with whitespace-only string values, the encrypted values are still set in the `AuthConfig` object.
   */
  it('should handle whitespace-only strings', async () => {
    const mockEncrypted = 'encrypted_whitespace';
    (UDADigestMessage as jest.Mock).mockResolvedValue(mockEncrypted);

    await AuthDataConfig({ username: '   ', password: '\t\n' });

    expect(AuthConfig.username).toBe(mockEncrypted);
    expect(AuthConfig.password).toBe(mockEncrypted);
  });

  /**
   * Tests that the `AuthDataConfig` function handles Unicode character inputs correctly.
   *
   * This test verifies that:
   * - If the `username` property is provided with a string containing Unicode characters, the encrypted value is still set in the `AuthConfig` object.
   * - The `UDADigestMessage` function is called with the Unicode string and the expected algorithm.
   */
  it('should handle Unicode characters', async () => {
    const unicodeString = '🚀👨‍👩‍👧‍👦🌈';
    const mockEncrypted = 'encrypted_unicode';
    (UDADigestMessage as jest.Mock).mockResolvedValue(mockEncrypted);

    await AuthDataConfig({ username: unicodeString });

    expect(AuthConfig.username).toBe(mockEncrypted);
    expect(UDADigestMessage).toHaveBeenCalledWith(unicodeString, 'SHA-512');
  });

  /**
   * Tests that the `AuthDataConfig` function handles maximum length string inputs correctly.
   *
   * This test verifies that:
   * - If the `password` property is provided with a string that is the maximum allowed length, the encrypted value is still set in the `AuthConfig` object.
   */
  it('should handle maximum length strings', async () => {
    const maxLengthString = 'a'.repeat(1000000); // Adjust based on your actual max length
    const mockEncrypted = 'encrypted_max_length';
    (UDADigestMessage as jest.Mock).mockResolvedValue(mockEncrypted);

    await AuthDataConfig({ password: maxLengthString });

    expect(AuthConfig.password).toBe(mockEncrypted);
  });

  /**
   * Tests that the `AuthDataConfig` function correctly updates the `AuthConfig` object when the `id` property is changed multiple times.
   *
   * This test verifies that:
   * - The `UDADigestMessage` function is called with each new `id` value and the encrypted value is set in the `AuthConfig` object.
   * - The `trigger` function is called 3 times with the `'UDAClearSessionData'` event and an empty object.
   */
  it('should handle changing id multiple times', async () => {
    const mockEncrypted = jest.fn().mockImplementation(val => `encrypted_${val}`);
    (UDADigestMessage as jest.Mock).mockImplementation(mockEncrypted);

    await AuthDataConfig({ id: 'id1' });
    await AuthDataConfig({ id: 'id2' });
    await AuthDataConfig({ id: 'id3' });

    expect(AuthConfig.id).toBe('encrypted_id3');
    expect(trigger).toHaveBeenCalledTimes(3);
    expect(trigger).toHaveBeenCalledWith('UDAClearSessionData', {});
  });
/**
 * Tests that the `AuthDataConfig` function handles errors thrown by the `UDADigestMessage` function.
 *
 * This test verifies that:
 * - If the `UDADigestMessage` function throws an error, the error is logged to the console.
 * - The `AuthConfig.username` property is set to an empty string when an error occurs.
 */

  it('should handle UDADigestMessage throwing an error', async () => {
    (UDADigestMessage as jest.Mock).mockRejectedValue(new Error('Encryption failed'));
    const consoleSpy = jest.spyOn(console, 'error');

    await AuthDataConfig({ username: 'test_user' });

    expect(consoleSpy).toHaveBeenCalledWith('Error in AuthDataConfig:', expect.any(Error));
    expect(AuthConfig.username).toBe('');
  });
});



