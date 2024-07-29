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

