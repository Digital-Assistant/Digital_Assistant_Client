import { AuthDataConfig } from './AuthDataConfig';
import { AuthConfig, AuthConfigPropTypes } from './UserAuthConfig';
import { UDADigestMessage } from '../util/UDADigestMessage';
import { trigger } from '../util/events';

/**
 * Mocks the `UDADigestMessage` and `events` modules for testing purposes.
 * This allows the tests to control the behavior of these modules and verify
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
   * Updates the `AuthConfig` object with encrypted values for the provided `id`, `username`, and `password` properties.
   * 
   * @param data - An object containing the new values for the `AuthConfig` properties.
   * @param data.id - The new ID value to be encrypted and stored in `AuthConfig.id`.
   * @param data.username - The new username value to be encrypted and stored in `AuthConfig.username`.
   * @param data.password - The new password value to be encrypted and stored in `AuthConfig.password`.
   * @returns The updated `AuthConfig` object with encrypted values.
   */
  it('should update AuthConfig with encrypted values', async () => {
    const data: AuthConfigPropTypes = {
      id: 'newId',
      username: 'newUser',
      password: 'newPass',
    };

    /**
     * Updates the `AuthConfig` object with encrypted values for the provided `id`, `username`, and `password` properties.
     * 
     * @param data - An object containing the new values for the `AuthConfig` properties.
     * @param data.id - The new ID value to be encrypted and stored in `AuthConfig.id`.
     * @param data.username - The new username value to be encrypted and stored in `AuthConfig.username`.
     * @param data.password - The new password value to be encrypted and stored in `AuthConfig.password`.
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
   * Verifies that the `AuthDataConfig` function does not update the `AuthConfig` object if the input data type does not match the expected `AuthConfigPropTypes`.
   * 
   * This test case ensures that the `AuthDataConfig` function properly handles invalid input data, and does not update the `AuthConfig` object with incorrect values.
   */
  it('should not update AuthConfig if data type does not match', async () => {
    const data: AuthConfigPropTypes = {
      id: 123, // Incorrect type
      username: 'newUser',
      password: 'newPass',
    };

    /**
     * Updates the `AuthConfig` object with encrypted values for the provided `username` and `password` properties, while keeping the `id` property unchanged.
     * 
     * @param data - An object containing the new values for the `AuthConfig` properties.
     * @param data.username - The new username value to be encrypted and stored in `AuthConfig.username`.
     * @param data.password - The new password value to be encrypted and stored in `AuthConfig.password`.
     * @returns The updated `AuthConfig` object with encrypted `username` and `password` values, and the original `id` value.
     */
    (UDADigestMessage as jest.Mock).mockResolvedValue('encryptedValue');

    const result = await AuthDataConfig(data);

    expect(UDADigestMessage).toHaveBeenCalledTimes(2);
    expect(result.id).toBe('');
    expect(result.username).toBe('encryptedValue');
    expect(result.password).toBe('encryptedValue');
  });

  /**
   * Updates the `AuthConfig` object with encrypted values for the provided `username` and `password` properties, while keeping the `id` property unchanged.
   * 
   * This test case verifies that the `AuthDataConfig` function triggers the `UDAClearSessionData` event when the `id` property is empty or has changed.
   * 
   * @param data - An object containing the new values for the `AuthConfig` properties.
   * @param data.id - The new ID value to be encrypted and stored in `AuthConfig.id`.
   * @param data.username - The new username value to be encrypted and stored in `AuthConfig.username`.
   * @param data.password - The new password value to be encrypted and stored in `AuthConfig.password`.
   * @returns The updated `AuthConfig` object with encrypted `username` and `password` values, and the original `id` value.
   */
  it('should trigger UDAClearSessionData if id is empty or changed', async () => {
    const data: AuthConfigPropTypes = {
      id: '',
      username: 'newUser',
      password: 'newPass',
    };

    /**
     * Updates the `AuthConfig` object with encrypted values for the provided `username` and `password` properties, while keeping the `id` property unchanged.
     * 
     * This function triggers the `UDAClearSessionData` event when the `id` property is empty or has changed.
     * 
     * @param data - An object containing the new values for the `AuthConfig` properties.
     * @param data.username - The new username value to be encrypted and stored in `AuthConfig.username`.
     * @param data.password - The new password value to be encrypted and stored in `AuthConfig.password`.
     * @returns The updated `AuthConfig` object with encrypted `username` and `password` values, and the original `id` value.
     */
    (UDADigestMessage as jest.Mock).mockResolvedValue('encryptedValue');

    await AuthDataConfig(data);

    expect(trigger).toHaveBeenCalledWith('UDAClearSessionData', {});
  });

  /**
   * Updates the `AuthConfig` object with encrypted values for the provided `username` and `password` properties, while keeping the `id` property unchanged.
   *
   * This test case verifies that the `AuthDataConfig` function triggers the `RequestUDASessionData` event when the `id` property is not empty.
   *
   * @param data - An object containing the new values for the `AuthConfig` properties.
   * @param data.id - The new ID value to be encrypted and stored in `AuthConfig.id`.
   * @param data.username - The new username value to be encrypted and stored in `AuthConfig.username`.
   * @param data.password - The new password value to be encrypted and stored in `AuthConfig.password`.
   * @returns The updated `AuthConfig` object with encrypted `username` and `password` values, and the original `id` value.
   */
  it('should trigger RequestUDASessionData if id is not empty', async () => {
    const data: AuthConfigPropTypes = {
      id: 'newId',
      username: 'newUser',
      password: 'newPass',
    };

    /**
     * Updates the `AuthConfig` object with encrypted values for the provided `username` and `password` properties, while keeping the `id` property unchanged.
     *
     * This function triggers the `RequestUDASessionData` event when the `id` property is not empty.
     *
     * @param data - An object containing the new values for the `AuthConfig` properties.
     * @param data.id - The new ID value to be encrypted and stored in `AuthConfig.id`.
     * @param data.username - The new username value to be encrypted and stored in `AuthConfig.username`.
     * @param data.password - The new password value to be encrypted and stored in `AuthConfig.password`.
     * @returns The updated `AuthConfig` object with encrypted `username` and `password` values, and the original `id` value.
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
   * Tests that the `AuthDataConfig` function handles empty input data correctly.
   *
   * This test case verifies that when an empty `data` object is passed to the `AuthDataConfig` function, the function does not call the `UDADigestMessage` mock and returns the original `AuthConfig` object.
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
   * This test case verifies that when an `AuthConfigPropTypes` object with only the `id` property is passed to the `AuthDataConfig` function, the function updates the `AuthConfig` object with the encrypted `id` value and returns the updated object.
   *
   * @param data - An object containing the new values for the `AuthConfig` properties.
   * @param data.id - The new ID value to be encrypted and stored in `AuthConfig.id`.
   */
  it('should handle partial input data', async () => {
    const data: AuthConfigPropTypes = {
      id: 'partialId',
    };

    /**
     * Updates the `AuthConfig` object with an encrypted value for the `id` property.
     *
     * This function triggers the `RequestUDASessionData` event when the `id` property is not empty.
     *
     * @param data - An object containing the new value for the `AuthConfig.id` property.
     * @param data.id - The new ID value to be encrypted and stored in `AuthConfig.id`.
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
   * This test case verifies that when an `AuthConfigPropTypes` object with the same values as the existing `AuthConfig` object is passed to the `AuthDataConfig` function, the function does not call the `UDADigestMessage` mock and returns the original `AuthConfig` object.
   */
  it('should not update AuthConfig if input data is the same as existing data', async () => {
    Object.assign(AuthConfig, {
      id: 'sameId',
      username: 'sameUser',
      password: 'samePass',
    });

    /**
     * An object containing the same values as the existing `AuthConfig` object.
     *
     * This object is used to test that the `AuthDataConfig` function does not update the `AuthConfig` object if the input data is the same as the existing data.
     *
     * @property {string} id - The same ID value as the existing `AuthConfig.id`.
     * @property {string} username - The same username value as the existing `AuthConfig.username`.
     * @property {string} password - The same password value as the existing `AuthConfig.password`.
     */
    const data: AuthConfigPropTypes = {
      id: 'sameId',
      username: 'sameUser',
      password: 'samePass',
    };

    /**
     * Tests that the `AuthDataConfig` function does not update the `AuthConfig` object if the input data is the same as the existing data.
     *
     * This test case verifies that when an `AuthConfigPropTypes` object with the same values as the existing `AuthConfig` object is passed to the `AuthDataConfig` function, the function does not call the `UDADigestMessage` mock and returns the original `AuthConfig` object.
     *
     * @param data - An object containing the same values as the existing `AuthConfig` object.
     * @param data.id - The same ID value as the existing `AuthConfig.id`.
     * @param data.username - The same username value as the existing `AuthConfig.username`.
     * @param data.password - The same password value as the existing `AuthConfig.password`.
     * @returns The original `AuthConfig` object without any updates.
     */
    const result = await AuthDataConfig(data);

    expect(UDADigestMessage).not.toHaveBeenCalled();
    expect(result.id).toBe('sameId');
    expect(result.username).toBe('sameUser');
    expect(result.password).toBe('samePass');
  });

  /**
   * Tests that the `AuthDataConfig` function logs a message if the data type of the `id` property in the input data does not match the expected string type.
   *
   * This test case verifies that when an `AuthConfigPropTypes` object is passed to the `AuthDataConfig` function with an `id` property of an incorrect data type (e.g. number instead of string), the function logs a message to the console.
   *
   * @param data - An object containing the input data for the `AuthDataConfig` function.
   * @param data.id - The ID value for the `AuthConfig` object, which should be a string.
   * @param data.username - The username value for the `AuthConfig` object.
   * @param data.password - The password value for the `AuthConfig` object.
   */
  it('should log a message if data type does not match', async () => {
    console.log = jest.fn();

    const data: AuthConfigPropTypes = {
      id: 123, // Incorrect type
      username: 'newUser',
      password: 'newPass',
    };

    /**
     * Tests that the `AuthDataConfig` function logs a message if the data type of the `id` property in the input data does not match the expected string type.
     *
     * This test case verifies that when an `AuthConfigPropTypes` object is passed to the `AuthDataConfig` function with an `id` property of an incorrect data type (e.g. number instead of string), the function logs a message to the console.
     *
     * @param data - An object containing the input data for the `AuthDataConfig` function.
     * @param data.id - The ID value for the `AuthConfig` object, which should be a string.
     * @param data.username - The username value for the `AuthConfig` object.
     * @param data.password - The password value for the `AuthConfig` object.
     */
    await AuthDataConfig(data);

    expect(console.log).toHaveBeenCalledWith('id accepts only string data type.');
  });

  /**
   * Tests that the `AuthDataConfig` function handles undefined properties in the input data.
   *
   * This test case verifies that when an `AuthConfigPropTypes` object is passed to the `AuthDataConfig` function with an `id` property set to `undefined`, the function does not throw an error and returns the original `AuthConfig` object without any updates.
   *
   * @param data - An object containing the input data for the `AuthDataConfig` function.
   * @param data.id - The ID value for the `AuthConfig` object, which should be a string.
   */
  it('should handle undefined properties in input data', async () => {
    const data: AuthConfigPropTypes = {
      id: undefined,
    };

    /**
     * Tests that the `AuthDataConfig` function correctly updates the `id` property of the input data.
     *
     * This test case verifies that when an `AuthConfigPropTypes` object is passed to the `AuthDataConfig` function, the function updates the `id` property of the input data to an empty string if the original `id` value is not a string.
     *
     * @param data - An object containing the input data for the `AuthDataConfig` function.
     * @param data.id - The ID value for the `AuthConfig` object, which should be a string.
     * @param data.username - The username value for the `AuthConfig` object.
     * @param data.password - The password value for the `AuthConfig` object.
     * @returns The updated `AuthConfig` object.
     */
    const result = await AuthDataConfig(data);

    expect(UDADigestMessage).not.toHaveBeenCalled();
    expect(result.id).toBe('');
  });
});
