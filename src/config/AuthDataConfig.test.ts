import { AuthDataConfig } from './AuthDataConfig';
import { AuthConfig, AuthConfigPropTypes } from './UserAuthConfig';
import { UDADigestMessage } from '../util/UDADigestMessage';
import { trigger } from '../util/events';


/**
 * Mocks the `UDADigestMessage` and `events` utility modules for testing purposes.
 * This allows the test suite to control the behavior of these modules and verify
 * the expected interactions with them.
 */
jest.mock('../util/UDADigestMessage');
jest.mock('../util/events');


/**
 * Sets up the test environment for the `AuthDataConfig` module by clearing all mocks and resetting the `AuthConfig` object to its default state.
 * This ensures a clean slate for each test case.
 */
describe('AuthDataConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(AuthConfig, {
      id: '',
      username: '',
      password: '',
    });
  });

  
  /**
   * Updates the `AuthConfig` object with encrypted values for the `id`, `username`, and `password` properties.
   * 
   * @param data - An object containing the new values for the `AuthConfig` properties.
   * @param data.id - The new ID value.
   * @param data.username - The new username value.
   * @param data.password - The new password value.
   * @returns The updated `AuthConfig` object with encrypted values.
   */
  it('should update AuthConfig with encrypted values', async () => {
    const data: AuthConfigPropTypes = {
      id: 'newId',
      username: 'newUser',
      password: 'newPass',
    };

    
    /**
     * Updates the `AuthConfig` object with encrypted values for the `id`, `username`, and `password` properties.
     * 
     * @param data - An object containing the new values for the `AuthConfig` properties.
     * @param data.id - The new ID value.
     * @param data.username - The new username value.
     * @param data.password - The new password value.
     * @returns The updated `AuthConfig` object with encrypted values.
     */
    (UDADigestMessage as jest.Mock).mockResolvedValue('encryptedValue');

    const result = await AuthDataConfig(data);

    expect(UDADigestMessage).toHaveBeenCalledTimes(3);
    expect(result.id).toBe('encryptedValue');
    expect(result.username).toBe('encryptedValue');
    expect(result.password).toBe('encryptedValue');
  });

  
  /**
   * Tests that the `AuthDataConfig` function does not update the `AuthConfig` object if the data type does not match the expected `AuthConfigPropTypes`.
   * 
   * @param data - An object containing the new values for the `AuthConfig` properties. The `id` property is expected to be a string, but in this test case it is provided as a number.
   * @param data.id - The new ID value, which should be a string but is provided as a number in this test case.
   * @param data.username - The new username value.
   * @param data.password - The new password value.
   */
  it('should not update AuthConfig if data type does not match', async () => {
    const data: AuthConfigPropTypes = {
      id: 123, // Incorrect type
      username: 'newUser',
      password: 'newPass',
    };

   
    /**
     * Updates the `AuthConfig` object with encrypted values for the `username` and `password` properties.
     * 
     * @param data - An object containing the new values for the `AuthConfig` properties.
     * @param data.username - The new username value.
     * @param data.password - The new password value.
     * @returns The updated `AuthConfig` object with encrypted values.
     */
    (UDADigestMessage as jest.Mock).mockResolvedValue('encryptedValue');

    const result = await AuthDataConfig(data);

    expect(UDADigestMessage).toHaveBeenCalledTimes(2);
    expect(result.id).toBe('');
    expect(result.username).toBe('encryptedValue');
    expect(result.password).toBe('encryptedValue');
  });

  
  /**
   * Tests that the `AuthDataConfig` function triggers the `UDAClearSessionData` event if the `id` property is empty or changed.
   * 
   * @param data - An object containing the new values for the `AuthConfig` properties.
   * @param data.id - The new ID value, which should be a string but is provided as an empty string in this test case.
   * @param data.username - The new username value.
   * @param data.password - The new password value.
   */
  it('should trigger UDAClearSessionData if id is empty or changed', async () => {
    const data: AuthConfigPropTypes = {
      id: '',
      username: 'newUser',
      password: 'newPass',
    };

   
    /**
     * Updates the `AuthConfig` object with encrypted values for the `username` and `password` properties, and triggers the `UDAClearSessionData` event if the `id` property is empty or changed.
     * 
     * @param data - An object containing the new values for the `AuthConfig` properties.
     * @param data.id - The new ID value.
     * @param data.username - The new username value.
     * @param data.password - The new password value.
     * @returns The updated `AuthConfig` object with encrypted values.
     */
    (UDADigestMessage as jest.Mock).mockResolvedValue('encryptedValue');

    await AuthDataConfig(data);

    expect(trigger).toHaveBeenCalledWith('UDAClearSessionData', {});
  });

  
  /**
   * Tests that the `AuthDataConfig` function triggers the `RequestUDASessionData` event if the `id` property is not empty.
   * 
   * @param data - An object containing the new values for the `AuthConfig` properties.
   * @param data.id - The new ID value, which should be a string but is provided as a non-empty string in this test case.
   * @param data.username - The new username value.
   * @param data.password - The new password value.
   */
  it('should trigger RequestUDASessionData if id is not empty', async () => {
    const data: AuthConfigPropTypes = {
      id: 'newId',
      username: 'newUser',
      password: 'newPass',
    };

    
    /**
     * Updates the `AuthConfig` object with encrypted values for the `username` and `password` properties, and triggers the `RequestUDASessionData` event if the `id` property is not empty.
     * 
     * @param data - An object containing the new values for the `AuthConfig` properties.
     * @param data.id - The new ID value.
     * @param data.username - The new username value.
     * @param data.password - The new password value.
     * @returns The updated `AuthConfig` object with encrypted values.
     */
    (UDADigestMessage as jest.Mock).mockResolvedValue('encryptedValue');

    await AuthDataConfig(data);

    expect(trigger).toHaveBeenCalledWith('RequestUDASessionData', {
      detail: { data: 'getusersessiondata' },
      bubbles: false,
      cancelable: false,
    });
  });

 
  /**
   * Tests that the `AuthDataConfig` function does not update the `AuthConfig` object if the input data is empty.
   * 
   * @param data - An object containing the new values for the `AuthConfig` properties. If this object is empty, the function should not update the `AuthConfig` object.
   * @returns The existing `AuthConfig` object.
   */
  it('should handle empty input data', async () => {
    const data: AuthConfigPropTypes = {};

    const result = await AuthDataConfig(data);

    expect(UDADigestMessage).not.toHaveBeenCalled();
    expect(result).toEqual(AuthConfig);
  });

 
  /**
   * Tests that the `AuthDataConfig` function handles partial input data correctly.
   * 
   * @param data - An object containing the new values for the `AuthConfig` properties. In this test case, only the `id` property is provided.
   */
  it('should handle partial input data', async () => {
    const data: AuthConfigPropTypes = {
      id: 'partialId',
    };

    
    /**
     * Updates the `AuthConfig` object with an encrypted value for the `id` property, and triggers the `RequestUDASessionData` event.
     * 
     * @param data - An object containing the new value for the `id` property.
     * @param data.id - The new ID value.
     * @returns The updated `AuthConfig` object with the encrypted `id` value.
     */
    (UDADigestMessage as jest.Mock).mockResolvedValue('encryptedValue');

    const result = await AuthDataConfig(data);

    expect(UDADigestMessage).toHaveBeenCalledTimes(1);
    expect(result.id).toBe('encryptedValue');
  });

  
  /**
   * Tests that the `AuthDataConfig` function does not update the `AuthConfig` object if the input data is the same as the existing data.
   * 
   * @param data - An object containing the new values for the `AuthConfig` properties. If the data is the same as the existing values, the function should not update the `AuthConfig` object.
   * @returns The existing `AuthConfig` object.
   */
  it('should not update AuthConfig if input data is the same as existing data', async () => {
    Object.assign(AuthConfig, {
      id: 'sameId',
      username: 'sameUser',
      password: 'samePass',
    });

    
    /**
     * An object containing the configuration properties for the authentication data.
     * 
     * @property {string} id - The unique identifier for the authentication data.
     * @property {string} username - The username associated with the authentication data.
     * @property {string} password - The password associated with the authentication data.
     */
    const data: AuthConfigPropTypes = {
      id: 'sameId',
      username: 'sameUser',
      password: 'samePass',
    };

    
    /**
     * Tests that the `AuthDataConfig` function does not update the `AuthConfig` object if the input data is the same as the existing data.
     * 
     * @param data - An object containing the new values for the `AuthConfig` properties. If the data is the same as the existing values, the function should not update the `AuthConfig` object.
     * @returns The existing `AuthConfig` object.
     */
    const result = await AuthDataConfig(data);

    expect(UDADigestMessage).not.toHaveBeenCalled();
    expect(result.id).toBe('sameId');
    expect(result.username).toBe('sameUser');
    expect(result.password).toBe('samePass');
  });

  
  /**
   * Tests that the `AuthDataConfig` function logs a message if the `id` property in the input data has an incorrect data type.
   * 
   * @param data - An object containing the new values for the `AuthConfig` properties. The `id` property should be a string, but in this test it is set to a number.
   */
  it('should log a message if data type does not match', async () => {
    console.log = jest.fn();

    const data: AuthConfigPropTypes = {
      id: 123, // Incorrect type
      username: 'newUser',
      password: 'newPass',
    };

    await AuthDataConfig(data);

    expect(console.log).toHaveBeenCalledWith('id accepts only string data type.');
  });

  
  /**
   * Tests that the `AuthDataConfig` function handles undefined properties in the input data.
   * 
   * If the `id` property in the input data is `undefined`, the function should set the `id` property in the returned `AuthConfig` object to an empty string.
   * 
   * @param data - An object containing the new values for the `AuthConfig` properties. If the `id` property is `undefined`, the function should handle this case.
   * @returns The updated `AuthConfig` object with the `id` property set to an empty string if the input `id` was `undefined`.
   */
  it('should handle undefined properties in input data', async () => {
    const data: AuthConfigPropTypes = {
      id: undefined,
    };


    const result = await AuthDataConfig(data);

    expect(UDADigestMessage).not.toHaveBeenCalled();
    expect(result.id).toBe('');
  });
});

// Mock CustomConfig
/**
 * Mocks the `CustomConfig` object with default values for testing purposes.
 * 
 * This mock is used in the `AppConfig` test suite to ensure that the `CustomConfig` object is in a known state before each test is run. This helps to isolate the tests from any side effects that may have occurred in previous tests.
 * 
 * The mocked `CustomConfig` object has the following properties:
 * - `setting1`: a string with the value `'default1'`
 * - `setting2`: a number with the value `42`
 * - `setting3`: a boolean with the value `true`
 */
jest.mock('./CustomConfig', () => ({
  CustomConfig: {
    setting1: 'default1',
    setting2: 42,
    setting3: true,
  },
  /**
   * Defines the property types for the `CustomConfig` object.
   * 
   * This interface specifies the expected data types for the properties of the `CustomConfig` object, which is used to store custom configuration settings for the application.
   * 
   * @property {string} setting1 - A string value for the first custom setting.
   * @property {number} setting2 - A number value for the second custom setting.
   * @property {boolean} setting3 - A boolean value for the third custom setting.
   */
  CustomConfigPropTypes: {
    setting1: 'string',
    setting2: 'number',
    setting3: 'boolean',
  },
}));

/**
 * Resets the `CustomConfig` object to its default values before each test in the `AppConfig` test suite.
 * 
 * This `beforeEach` hook is used to ensure that the `CustomConfig` object is in a known state before each test is run. This helps to isolate the tests from any side effects that may have occurred in previous tests.
 */
describe('AppConfig', () => {
  beforeEach(() => {
    // Reset CustomConfig to its default values before each test
    const { CustomConfig } = require('./CustomConfig');
    CustomConfig.setting1 = 'default1';
    CustomConfig.setting2 = 42;
    CustomConfig.setting3 = true;
  });

  /**
   * Tests that the `AppConfig` function updates the `CustomConfig` object with valid data.
   * 
   * This test case verifies that when valid data is passed to the `AppConfig` function, the `CustomConfig` object is updated with the new values.
   * 
   * @param data - An object containing the new values for the `CustomConfig` properties. The `setting1` property should be a string and the `setting2` property should be a number.
   * @returns void
   */
  it('should update CustomConfig with valid data', () => {
    const data: CustomConfigPropTypes = {
      setting1: 'new value',
      setting2: 100,
    };

    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('new value');
    expect(CustomConfig.setting2).toBe(100);
    expect(CustomConfig.setting3).toBe(true); // unchanged
  });

  /**
   * Tests that the `AppConfig` function rejects invalid data types for the `CustomConfig` object.
   * 
   * This test case verifies that when invalid data types are passed to the `AppConfig` function, the `CustomConfig` object is not updated and appropriate error messages are logged.
   * 
   * @param data - An object containing the new values for the `CustomConfig` properties. The `setting1` property should be a string and the `setting2` property should be a number.
   * @returns void
   */
  it('should not update CustomConfig with invalid data types', () => {
    const data: CustomConfigPropTypes = {
      setting1: 123, // invalid type
      setting2: 'invalid type', // invalid type
    };

    /**
     * Tests that the `AppConfig` function rejects invalid data types for the `CustomConfig` object.
     * 
     * This test case verifies that when invalid data types are passed to the `AppConfig` function, the `CustomConfig` object is not updated and appropriate error messages are logged.
     * 
     * @param data - An object containing the new values for the `CustomConfig` properties. The `setting1` property should be a string and the `setting2` property should be a number.
     * @returns void
     */
    console.log = jest.fn(); // Mock console.log

    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('default1');
    expect(CustomConfig.setting2).toBe(42);
    expect(CustomConfig.setting3).toBe(true);

    expect(console.log).toHaveBeenCalledWith('setting1 accepts only string data type.');
    expect(console.log).toHaveBeenCalledWith('setting2 accepts only number data type.');
  });

  /**
   * Tests that the `AppConfig` function does not update the `CustomConfig` object if the provided data has `undefined` values.
   * 
   * This test case verifies that when `undefined` values are passed to the `AppConfig` function, the `CustomConfig` object is not updated and retains its default values.
   * 
   * @param data - An object containing the new values for the `CustomConfig` properties. The `setting1` and `setting2` properties are set to `undefined`.
   * @returns void
   */
  it('should not update CustomConfig if data is undefined', () => {
    const data: CustomConfigPropTypes = {
      setting1: undefined,
      setting2: undefined,
    };

    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('default1');
    expect(CustomConfig.setting2).toBe(42);
    expect(CustomConfig.setting3).toBe(true);
  });
});
/**
 * Mocks the `UDADigestMessage` and `events` modules for testing purposes.
 * 
 * This code is used to set up mocks for the `UDADigestMessage` and `events` modules before running tests in the `AuthDataConfig.test.ts` file. The mocks are used to simulate the behavior of these modules and ensure that the tests can be run without relying on the actual implementation of these modules.
 */

jest.mock('../util/UDADigestMessage');
jest.mock('../util/events');

/**
 * Resets the `AuthConfig` object to a known state before each test in the `AuthDataConfig` test suite.
 * 
 * This `beforeEach` hook is used to clear all mocks and reset the `AuthConfig` object to a known state before each test in the `AuthDataConfig` test suite. This ensures that the tests are independent and do not rely on the state of the `AuthConfig` object from previous tests.
 */
describe('AuthDataConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset AuthConfig to a known state before each test
    Object.assign(AuthConfig, {
      id: '',
      name: '',
      email: '',
      // Add other properties as needed
    });
  });

  /**
   * Tests that the `AuthDataConfig` function updates the `AuthConfig` object with encrypted values.
   * 
   * This test case verifies that when new data is passed to the `AuthDataConfig` function, the `AuthConfig` object is updated with the encrypted values returned by the `UDADigestMessage` module.
   * 
   * @param newData - An object containing the new values for the `AuthConfig` properties.
   * @returns void
   */
  it('should update AuthConfig with encrypted values', async () => {
    const mockEncrypted = 'encrypted_value';
    (UDADigestMessage as jest.Mock).mockResolvedValue(mockEncrypted);

    const newData = {
      id: 'newId',
      name: 'John Doe',
      email: 'john@example.com',
    };

    /**
     * Tests that the `AuthDataConfig` function updates the `AuthConfig` object with encrypted values.
     * 
     * This test case verifies that when new data is passed to the `AuthDataConfig` function, the `AuthConfig` object is updated with the encrypted values returned by the `UDADigestMessage` module.
     */
    const result = await AuthDataConfig(newData);

    expect(UDADigestMessage).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      id: mockEncrypted,
      name: mockEncrypted,
      email: mockEncrypted,
    });
  });

  /**
   * Tests that the `AuthDataConfig` function handles empty string values.
   * 
   * This test case verifies that when new data is passed to the `AuthDataConfig` function with an empty string value for the `id` property, the `AuthConfig` object is updated with the empty string value, and the encrypted value is used for the `name` property.
   * 
   * @param newData - An object containing the new values for the `AuthConfig` properties.
   * @returns void
   */
  it('should handle empty string values', async () => {
    const newData = {
      id: '',
      name: 'John Doe',
    };

    const result = await AuthDataConfig(newData);

    expect(UDADigestMessage).toHaveBeenCalledTimes(1);
    expect(result.id).toBe('');
    expect(result.name).toBe('encrypted_value');
  });

  /**
   * Tests that the `AuthDataConfig` function logs an error when the `id` property is not a string.
   * 
   * This test case verifies that when new data is passed to the `AuthDataConfig` function with an `id` property that is not a string, the function logs an error message to the console.
   * 
   * @param newData - An object containing the new values for the `AuthConfig` properties.
   * @returns void
   */
  it('should log an error for mismatched data types', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const newData = {
      id: 123, // Assuming id should be a string
    };

    await AuthDataConfig(newData as any);

    expect(consoleSpy).toHaveBeenCalledWith('id accepts only string data type.');
  });

  /**
   * Tests that the `AuthDataConfig` function clears the session data when the `id` property is set to an empty string.
   * 
   * This test case verifies that when new data is passed to the `AuthDataConfig` function with an empty string value for the `id` property, the `trigger` function is called with the `UDAClearSessionData` event, which is expected to clear the user's session data.
   * 
   * @param newData - An object containing the new values for the `AuthConfig` properties.
   * @returns void
   */
  it('should trigger UDAClearSessionData when id is cleared', async () => {
    AuthConfig.id = 'oldId';
    const newData = { id: '' };

    await AuthDataConfig(newData);

    expect(trigger).toHaveBeenCalledWith('UDAClearSessionData', {});
  });

  /**
   * Tests that the `AuthDataConfig` function triggers the `RequestUDASessionData` event when the `id` property is set.
   * 
   * This test case verifies that when new data is passed to the `AuthDataConfig` function with a non-empty `id` property, the `trigger` function is called with the `RequestUDASessionData` event, which is expected to request the user's session data.
   * 
   * @param newData - An object containing the new values for the `AuthConfig` properties.
   * @returns void
   */
  it('should trigger RequestUDASessionData when id is set', async () => {
    const newData = { id: 'newId' };

    await AuthDataConfig(newData);

    expect(trigger).toHaveBeenCalledWith('RequestUDASessionData', {
      detail: { data: 'getusersessiondata' },
      bubbles: false,
      cancelable: false,
    });
  });

  /**
   * Tests that the `AuthDataConfig` function does not trigger any events when the `id` property remains unchanged.
   * 
   * This test case verifies that when new data is passed to the `AuthDataConfig` function, but the `id` property remains the same as the existing value, the `trigger` function is not called.
   * 
   * @param newData - An object containing the new values for the `AuthConfig` properties, excluding the `id` property.
   * @returns void
   */
  it('should not trigger any events when id remains unchanged', async () => {
    AuthConfig.id = 'existingId';
    const newData = { name: 'John Doe' };

    await AuthDataConfig(newData);

    expect(trigger).not.toHaveBeenCalled();
  });
});

/**
 * Tests the `AuthDataConfig` function, which is responsible for updating the `AuthConfig` object with new data.
 * 
 * This test suite covers various scenarios, including:
 * - Handling undefined property values
 * - Updating multiple properties simultaneously
 * - Triggering events when the `id` property changes
 * - Handling a mix of valid and invalid data types
 */
describe('AuthDataConfig', () => {
  // ... (previous test cases)

  /**
   * Tests that the `AuthDataConfig` function does not update the `AuthConfig` object when the new data contains an `undefined` property.
   *
   * This test case verifies that when new data is passed to the `AuthDataConfig` function, and the new data contains a property with an `undefined` value, the `AuthConfig` object is not updated with that property.
   *
   * @param newData - An object containing the new values for the `AuthConfig` properties, including an `undefined` property.
   * @returns void
   */
  it('should not update AuthConfig for undefined values', async () => {
    const initialConfig = { ...AuthConfig };
    const newData = { undefinedProp: undefined };

    const result = await AuthDataConfig(newData as any);

    expect(result).toEqual(initialConfig);
    expect(UDADigestMessage).not.toHaveBeenCalled();
  });

  /**
   * Tests that the `AuthDataConfig` function can update multiple properties of the `AuthConfig` object simultaneously.
   *
   * This test case verifies that when new data is passed to the `AuthDataConfig` function, and the new data contains multiple properties, the `AuthConfig` object is updated with the new values for those properties.
   *
   * @param newData - An object containing the new values for the `AuthConfig` properties, including `id`, `name`, `email`, and `customProp`.
   * @returns void
   */
  it('should handle multiple property updates simultaneously', async () => {
    const mockEncrypted = 'encrypted_value';
    (UDADigestMessage as jest.Mock).mockResolvedValue(mockEncrypted);

    const newData = {
      id: 'newId',
      name: 'John Doe',
      email: 'john@example.com',
      customProp: 'custom value'
    };
/**
 * Tests that the `AuthDataConfig` function can update multiple properties of the `AuthConfig` object simultaneously.
 *
 * This test case verifies that when new data is passed to the `AuthDataConfig` function, and the new data contains multiple properties, the `AuthConfig` object is updated with the new values for those properties.
 *
 * @param newData - An object containing the new values for the `AuthConfig` properties, including `id`, `name`, `email`, and `customProp`.
 * @returns void
 */

    const result = await AuthDataConfig(newData);

    expect(UDADigestMessage).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      id: mockEncrypted,
      name: mockEncrypted,
      email: mockEncrypted,
      customProp: AuthConfig.customProp // Assuming this property exists in AuthConfig
    });
  });

  /**
   * Tests that the `AuthDataConfig` function triggers the `UDAClearSessionData` event when the `id` property changes.
   *
   * This test case verifies that when the `AuthDataConfig` function is called with a new `id` value, the `trigger` function is called with the `'UDAClearSessionData'` event and an empty object as the payload.
   * Additionally, it verifies that the `'RequestUDASessionData'` event is also triggered with any object as the payload.
   *
   * @returns void
   */
  it('should trigger UDAClearSessionData when id changes', async () => {
    AuthConfig.id = 'oldId';
    const newData = { id: 'newId' };

    await AuthDataConfig(newData);

    expect(trigger).toHaveBeenCalledWith('UDAClearSessionData', {});
    expect(trigger).toHaveBeenCalledWith('RequestUDASessionData', expect.any(Object));
  });

  /**
   * Tests that the `AuthDataConfig` function handles a mix of valid and invalid data types.
   *
   * This test case verifies that when new data is passed to the `AuthDataConfig` function, and the new data contains a property with an invalid data type, the `AuthConfig` object is updated with the valid properties, and a warning is logged for the invalid property.
   *
   * @param newData - An object containing the new values for the `AuthConfig` properties, including `id` (string), `name` (invalid type), and `email` (string).
   * @returns void
   */
  it('should handle a mix of valid and invalid data types', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const mockEncrypted = 'encrypted_value';
    (UDADigestMessage as jest.Mock).mockResolvedValue(mockEncrypted);

    const newData = {
      id: 'validId',
      name: 123, // Invalid type
      email: 'valid@email.com'
    };

    /**
     * Tests that the `AuthDataConfig` function handles a mix of valid and invalid data types.
     *
     * This test case verifies that when new data is passed to the `AuthDataConfig` function, and the new data contains a property with an invalid data type, the `AuthConfig` object is updated with the valid properties, and a warning is logged for the invalid property.
     *
     * @param newData - An object containing the new values for the `AuthConfig` properties, including `id` (string), `name` (invalid type), and `email` (string).
     * @returns void
     */
    const result = await AuthDataConfig(newData as any);

    expect(consoleSpy).toHaveBeenCalledWith('name accepts only string data type.');
    expect(result.id).toBe(mockEncrypted);
    expect(result.name).not.toBe(mockEncrypted);
    expect(result.email).toBe(mockEncrypted);
  });

  /**
   * Tests that the `AuthDataConfig` function maintains existing values for properties not included in the new data.
   *
   * This test case verifies that when new data is passed to the `AuthDataConfig` function, and the new data does not include a property that already exists in the `AuthConfig` object, the existing value for that property is maintained.
   *
   * @param newData - An object containing the new values for the `AuthConfig` properties, including `id` (string).
   * @returns void
   */
  it('should maintain existing values for properties not in newData', async () => {
    AuthConfig.existingProp = 'existingValue';
    const newData = { id: 'newId' };

    const result = await AuthDataConfig(newData);

    expect(result.existingProp).toBe('existingValue');
  });
});



