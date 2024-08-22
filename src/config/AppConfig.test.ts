import { AppConfig } from './AppConfig';
import { CustomConfig, CustomConfigPropTypes } from './CustomConfig';
/**
 * Mocks the `CustomConfig` object with default values for testing purposes.
 * This mock is used in the `AppConfig` test suite to reset the `CustomConfig`
 * object to its default state before each test.
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
   * - `setting1`: A string value.
   * - `setting2`: A number value.
   * - `setting3`: A boolean value.
   */
  CustomConfigPropTypes: {
    setting1: 'string',
    setting2: 'number',
    setting3: 'boolean',
  },
}));


/**
 * Resets the `CustomConfig` object to its default values before each test in the `AppConfig` test suite.
 * This ensures that the `CustomConfig` object is in a known state before each test is executed.
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
   * Updates the `CustomConfig` object with the provided data, if the data types are valid.
   * 
   * @param data - An object containing the new values for the `CustomConfig` properties.
   * The object should match the `CustomConfigPropTypes` interface, which defines the expected
   * data types for each property.
   */
  it('should update CustomConfig with valid data', () => {
    const data: CustomConfigPropTypes = {
      setting1: 'new value',
      setting2: 100,
    };

   
    /**
     * Updates the `CustomConfig` object with the provided data, if the data types are valid.
     *
     * @param data - An object containing the new values for the `CustomConfig` properties.
     * The object should match the `CustomConfigPropTypes` interface, which defines the expected
     * data types for each property.
     */
    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('new value');
    expect(CustomConfig.setting2).toBe(100);
    expect(CustomConfig.setting3).toBe(true); // unchanged
  });

  
  /**
   * Tests that the `AppConfig` function does not update the `CustomConfig` object with invalid data types.
   * 
   * This test case verifies that the `AppConfig` function correctly handles invalid data types for the
   * `CustomConfig` properties, and logs appropriate error messages to the console.
   */
  it('should not update CustomConfig with invalid data types', () => {
    const data: CustomConfigPropTypes = {
      setting1: 123, // invalid type
      setting2: 'invalid type', // invalid type
    };

    /**
     * Tests that the `AppConfig` function logs appropriate error messages when provided with invalid data types.
     * 
     * This test case verifies that the `AppConfig` function correctly logs error messages to the console when the
     * `data` object contains properties with invalid data types for the `CustomConfig` object.
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
   * Tests that the `AppConfig` function does not update the `CustomConfig` object if the provided `data` object contains `undefined` values.
   * 
   * This test case verifies that the `AppConfig` function correctly handles `undefined` values for the `CustomConfig` properties, and does not update the `CustomConfig` object with those values.
   *
   * @param data - An object containing the new values for the `CustomConfig` properties. The object should match the `CustomConfigPropTypes` interface, which defines the expected data types for each property.
   */
  it('should not update CustomConfig if data is undefined', () => {
    const data: CustomConfigPropTypes = {
      setting1: undefined,
      setting2: undefined,
    };

    /**
     * Tests that the `AppConfig` function correctly updates the `CustomConfig` object with the provided data.
     * 
     * This test case verifies that the `AppConfig` function updates the `CustomConfig` object with the values
     * from the `data` object, and that the `CustomConfig` object contains the expected values after the update.
     *
     * @param data - An object containing the new values for the `CustomConfig` properties. The object should match the `CustomConfigPropTypes` interface, which defines the expected data types for each property.
     */
    AppConfig(data);

   
    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('default1');
    expect(CustomConfig.setting2).toBe(42);
    expect(CustomConfig.setting3).toBe(true);
  });

  
  /**
   * Tests that the `AppConfig` function correctly updates the `CustomConfig` object with the provided data.
   * 
   * This test case verifies that the `AppConfig` function updates the `CustomConfig` object with the values
   * from the `data` object, and that the `CustomConfig` object contains the expected values after the update.
   *
   * @param data - An object containing the new values for the `CustomConfig` properties. The object should match the `CustomConfigPropTypes` interface, which defines the expected data types for each property.
   */
  it('should handle partial updates correctly', () => {
    const data: CustomConfigPropTypes = {
      setting1: 'partial update',
    };

   
    /**
     * Tests that the `AppConfig` function correctly updates the `CustomConfig` object with the provided data.
     * 
     * This test case verifies that the `AppConfig` function updates the `CustomConfig` object with the values
     * from the `data` object, and that the `CustomConfig` object contains the expected values after the update.
     *
     * @param data - An object containing the new values for the `CustomConfig` properties. The object should match the `CustomConfigPropTypes` interface, which defines the expected data types for each property.
     */
    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('partial update');
    expect(CustomConfig.setting2).toBe(42); // unchanged
    expect(CustomConfig.setting3).toBe(true); // unchanged
  });

  /**
   * Tests that the `AppConfig` function does not change the `CustomConfig` object if no valid keys are provided.
   * 
   * This test case verifies that the `AppConfig` function does not update the `CustomConfig` object if the `data`
   * object contains keys that do not exist in the `CustomConfig` object.
   *
   * @param data - An object containing keys that do not exist in the `CustomConfig` object. The object should match the `CustomConfigPropTypes` interface, which defines the expected data types for each property.
   */

    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('default1');
    expect(CustomConfig.setting2).toBe(42);
    expect(CustomConfig.setting3).toBe(true);
  });

  /**
   * Tests that the `AppConfig` function logs appropriate messages for invalid data types.
   * 
   * This test case verifies that the `AppConfig` function logs the expected error messages when the `data` object
   * contains properties with invalid data types.
   *
   * @param data - An object containing properties with invalid data types. The object should match the `CustomConfigPropTypes` interface, which defines the expected data types for each property.
   */
  it('should log appropriate messages for invalid data types', () => {
    const data: CustomConfigPropTypes = {
      setting1: 123, // invalid type
      setting2: 'invalid type', // invalid type
    };

   
    /**
     * Tests that the `AppConfig` function logs appropriate messages for invalid data types.
     * 
     * This test case verifies that the `AppConfig` function logs the expected error messages when the `data` object
     * contains properties with invalid data types.
     *
     * @param data - An object containing properties with invalid data types. The object should match the `CustomConfigPropTypes` interface, which defines the expected data types for each property.
     */
    console.log = jest.fn(); // Mock console.log

    AppConfig(data);

    expect(console.log).toHaveBeenCalledWith('setting1 accepts only string data type.');
    expect(console.log).toHaveBeenCalledWith('setting2 accepts only number data type.');
  });

  
  /**
   * Tests that the `AppConfig` function does not change the `CustomConfig` object if no valid keys are provided.
   * 
   * This test case verifies that the `AppConfig` function does not update the `CustomConfig` object if the `data`
   * object contains keys that do not exist in the `CustomConfig` object.
   *
   * @param data - An object containing keys that do not exist in the `CustomConfig` object. The object should match the `CustomConfigPropTypes` interface, which defines the expected data types for each property.
   */
  it('should handle empty input gracefully', () => {
    const data: CustomConfigPropTypes = {};

    AppConfig(data);

   
    /**
     * Tests that the `CustomConfig` object has the expected default values.
     * 
     * This test case verifies that the `CustomConfig` object has the expected default values for the `setting1`, `setting2`, and `setting3` properties.
     */
    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('default1');
    expect(CustomConfig.setting2).toBe(42);
    expect(CustomConfig.setting3).toBe(true);
  });

// Mock CustomConfig
/**
 * Mocks the `CustomConfig` object with default values for testing purposes.
 * 
 * This mock object is used in the test suite for the `AppConfig` function to provide a consistent set of default
 * values for the `CustomConfig` object. The mock object is created using Jest's `mock` function, which allows
 * the test suite to control the behavior of the `CustomConfig` module during testing.
 * 
 * The mock `CustomConfig` object has the following properties:
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
   * Defines the expected data types for the properties of the `CustomConfig` object.
   * 
   * This interface is used to specify the expected data types for the `setting1`, `setting2`, and `setting3` properties
   * of the `CustomConfig` object. It is used in the `AppConfig` function to validate the input data and ensure that the
   * `CustomConfig` object is updated with valid values.
   *
   * @property {string} setting1 - The expected data type for the `setting1` property is a string.
   * @property {number} setting2 - The expected data type for the `setting2` property is a number.
   * @property {boolean} setting3 - The expected data type for the `setting3` property is a boolean.
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
 * This `beforeEach` hook is used to ensure that the `CustomConfig` object is in a known state before each test is
 * executed. It sets the `setting1`, `setting2`, and `setting3` properties of the `CustomConfig` object to their
 * default values, which are defined in the mock implementation of the `CustomConfig` module.
 * 
 * This ensures that the tests in the `AppConfig` test suite are isolated from each other and can be run in any order
 * without affecting the outcome of other tests.
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
   * Updates the `CustomConfig` object with the provided data, if the data types are valid.
   *
   * This test case verifies that the `AppConfig` function correctly updates the `CustomConfig` object with the provided
   * data, as long as the data types match the expected types defined in the `CustomConfigPropTypes` interface.
   *
   * @param {CustomConfigPropTypes} data - An object containing the new values for the `CustomConfig` properties.
   * @param {string} data.setting1 - The new value for the `setting1` property of `CustomConfig`.
   * @param {number} data.setting2 - The new value for the `setting2` property of `CustomConfig`.
   */
  it('should update CustomConfig with valid data', () => {
    const data: CustomConfigPropTypes = {
      setting1: 'new value',
      setting2: 100,
    };

    /**
     * Updates the `CustomConfig` object with the provided data, if the data types are valid.
     *
     * This code updates the `CustomConfig` object with the new values for the `setting1` and `setting2` properties,
     * as long as the data types match the expected types defined in the `CustomConfigPropTypes` interface.
     *
     * @param {CustomConfigPropTypes} data - An object containing the new values for the `CustomConfig` properties.
     * @param {string} data.setting1 - The new value for the `setting1` property of `CustomConfig`.
     * @param {number} data.setting2 - The new value for the `setting2` property of `CustomConfig`.
     */
    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('new value');
    expect(CustomConfig.setting2).toBe(100);
    expect(CustomConfig.setting3).toBe(true); // unchanged
  });

  /**
   * Updates the `CustomConfig` object with the provided data, if the data types are valid.
   *
   * This test case verifies that the `AppConfig` function correctly handles invalid data types for the `CustomConfig`
   * properties, and logs appropriate error messages.
   *
   * @param {CustomConfigPropTypes} data - An object containing the new values for the `CustomConfig` properties.
   * @param {number} data.setting1 - An invalid type for the `setting1` property of `CustomConfig`.
   * @param {string} data.setting2 - An invalid type for the `setting2` property of `CustomConfig`.
   */
  it('should not update CustomConfig with invalid data types', () => {
    const data: CustomConfigPropTypes = {
      setting1: 123, // invalid type
      setting2: 'invalid type', // invalid type
    };

    /**
     * Logs appropriate error messages when the `AppConfig` function is called with invalid data types for the `CustomConfig` properties.
     *
     * This code mocks the `console.log` function and then calls the `AppConfig` function with invalid data types for the `setting1` and `setting2` properties of `CustomConfig`. It then verifies that the appropriate error messages were logged to the console.
     *
     * @param {CustomConfigPropTypes} data - An object containing the new values for the `CustomConfig` properties.
     * @param {number} data.setting1 - An invalid type for the `setting1` property of `CustomConfig`.
     * @param {string} data.setting2 - An invalid type for the `setting2` property of `CustomConfig`.
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
   * Updates the `CustomConfig` object with the provided data, if the data types are valid.
   *
   * This test case verifies that the `AppConfig` function correctly handles undefined values for the `CustomConfig`
   * properties, and does not update the `CustomConfig` object.
   *
   * @param {CustomConfigPropTypes} data - An object containing the new values for the `CustomConfig` properties.
   * @param {string|undefined} data.setting1 - The new value for the `setting1` property of `CustomConfig`, or undefined.
   * @param {number|undefined} data.setting2 - The new value for the `setting2` property of `CustomConfig`, or undefined.
   */
  it('should not update CustomConfig if data is undefined', () => {
    const data: CustomConfigPropTypes = {
      setting1: undefined,
      setting2: undefined,
    };

    /**
     * Calls the `AppConfig` function with the provided data and verifies that the `CustomConfig` object is updated correctly.
     *
     * This code block tests the `AppConfig` function by calling it with a `data` object that contains new values for the `CustomConfig` properties. It then verifies that the `CustomConfig` object is updated with the new values, and that the default values are preserved for any properties not included in the `data` object.
     *
     * @param {CustomConfigPropTypes} data - An object containing the new values for the `CustomConfig` properties.
     */
    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('default1');
    expect(CustomConfig.setting2).toBe(42);
    expect(CustomConfig.setting3).toBe(true);
  });

  /**
   * Updates the `CustomConfig` object with the provided data, if the data types are valid.
   *
   * This test case verifies that the `AppConfig` function correctly updates the `CustomConfig` object with the provided `setting1` value, while preserving the default values for the other properties.
   *
   * @param {CustomConfigPropTypes} data - An object containing the new values for the `CustomConfig` properties.
   * @param {string} data.setting1 - The new value for the `setting1` property of `CustomConfig`.
   */
  it('should handle partial updates correctly', () => {
    const data: CustomConfigPropTypes = {
      setting1: 'partial update',
    };

    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('partial update');
    expect(CustomConfig.setting2).toBe(42); // unchanged
    expect(CustomConfig.setting3).toBe(true); // unchanged
  });

  /**
   * Tests that the `AppConfig` function does not update the `CustomConfig` object if the provided `data` object contains keys that do not exist in the `CustomConfig` object.
   *
   * This test case verifies that the `AppConfig` function correctly handles a `data` object that contains keys that do not exist in the `CustomConfig` object. It ensures that the `CustomConfig` object is not updated with the invalid keys, and that the default values for the existing properties are preserved.
   *
   * @param {CustomConfigPropTypes} data - An object containing the new values for the `CustomConfig` properties.
   */
  it('should not change CustomConfig if no valid keys are provided', () => {
    const data: CustomConfigPropTypes = {
      setting4: 'invalid key', // assuming setting4 does not exist in CustomConfig
    };

    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('default1');
    expect(CustomConfig.setting2).toBe(42);
    expect(CustomConfig.setting3).toBe(true);
  });

  /**
   * Tests that the `AppConfig` function logs appropriate messages when the provided `data` object contains invalid data types for the `CustomConfig` properties.
   *
   * This test case verifies that the `AppConfig` function correctly logs error messages when the `data` object contains values with invalid data types for the `setting1` and `setting2` properties of the `CustomConfig` object.
   *
   * @param {CustomConfigPropTypes} data - An object containing the new values for the `CustomConfig` properties.
   * @param {number} data.setting1 - An invalid value for the `setting1` property of `CustomConfig`.
   * @param {string} data.setting2 - An invalid value for the `setting2` property of `CustomConfig`.
   */
  it('should log appropriate messages for invalid data types', () => {
    const data: CustomConfigPropTypes = {
      setting1: 123, // invalid type
      setting2: 'invalid type', // invalid type
    };

    /**
     * Tests that the `AppConfig` function logs appropriate messages when the provided `data` object contains invalid data types for the `CustomConfig` properties.
     *
     * This test case verifies that the `AppConfig` function correctly logs error messages when the `data` object contains values with invalid data types for the `setting1` and `setting2` properties of the `CustomConfig` object.
     */
    console.log = jest.fn(); // Mock console.log

    AppConfig(data);

    expect(console.log).toHaveBeenCalledWith('setting1 accepts only string data type.');
    expect(console.log).toHaveBeenCalledWith('setting2 accepts only number data type.');
  });
});
/**
 * Tests that the `AppConfig` function does not update the `CustomConfig` object if the provided `data` object contains keys that do not exist in the `CustomConfig` object.
 *
 * This test case verifies that the `AppConfig` function correctly handles a `data` object that contains keys that do not exist in the `CustomConfig` object. It ensures that the `CustomConfig` object is not updated with the invalid keys, and that the default values for the existing properties are preserved.
 *
 * @param {CustomConfigPropTypes} data - An object containing the new values for the `CustomConfig` properties.
 */

it('should not update CustomConfig with non-existent keys', () => {
    const data: CustomConfigPropTypes = {
      setting4: 'non-existent key',
    };

    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('default1');
    expect(CustomConfig.setting2).toBe(42);
    expect(CustomConfig.setting3).toBe(true);
  });

  /**
   * Tests that the `AppConfig` function does not update the `CustomConfig` object if the provided `data` object contains null values for the `CustomConfig` properties.
   *
   * This test case verifies that the `AppConfig` function correctly handles a `data` object that contains null values for the `setting1` and `setting2` properties of the `CustomConfig` object. It ensures that the `CustomConfig` object is not updated with the null values, and that the default values for the existing properties are preserved.
   *
   * @param {CustomConfigPropTypes} data - An object containing the new values for the `CustomConfig` properties.
   */
  it('should not update CustomConfig with null values', () => {
    const data: CustomConfigPropTypes = {
      setting1: null,
      setting2: null,
    };

    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('default1');
    expect(CustomConfig.setting2).toBe(42);
    expect(CustomConfig.setting3).toBe(true);
  });
/**
 * Tests that the `AppConfig` function correctly handles a `data` object that contains object types for non-object properties in the `CustomConfig` object.
 *
 * This test case verifies that the `AppConfig` function correctly logs warnings when the `data` object contains object types for the `setting1` and `setting2` properties, which are expected to be string and number types respectively. It ensures that the `CustomConfig` object is not updated with the invalid types, and that the default values for the existing properties are preserved.
 *
 * @param {CustomConfigPropTypes} data - An object containing the new values for the `CustomConfig` properties.
 */

  it('should not update CustomConfig with object types for non-object properties', () => {
    const data: CustomConfigPropTypes = {
      setting1: {}, // invalid type
      setting2: {}, // invalid type
    };

    console.log = jest.fn(); // Mock console.log

    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('default1');
    expect(CustomConfig.setting2).toBe(42);
    expect(CustomConfig.setting3).toBe(true);

    expect(console.log).toHaveBeenCalledWith('setting1 accepts only string data type.');
    expect(console.log).toHaveBeenCalledWith('setting2 accepts only number data type.');
  });



