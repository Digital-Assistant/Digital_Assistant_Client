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
