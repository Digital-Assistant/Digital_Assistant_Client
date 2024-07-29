import { AppConfig } from './AppConfig';
import { CustomConfig, CustomConfigPropTypes } from './CustomConfig';

// Mock CustomConfig
/**
 * Mocks the `CustomConfig` object with default values for testing purposes.
 * This mock is used in the `AppConfig` test suite to reset the `CustomConfig`
 * object to its default state before each test.
 *
 * The mocked `CustomConfig` object has the following properties:
 * - `setting1`: a string with the default value of `'default1'`
 * - `setting2`: a number with the default value of `42`
 * - `setting3`: a boolean with the default value of `true`
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
   * - `setting1`: a string property
   * - `setting2`: a number property
   * - `setting3`: a boolean property
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
   * This test case verifies that the `AppConfig` function correctly updates the `CustomConfig` object with the provided data, when the data types are valid.
   *
   * @param data - An object containing the new values for the `CustomConfig` properties. The object should match the `CustomConfigPropTypes` interface.
   */
  it('should update CustomConfig with valid data', () => {
    const data: CustomConfigPropTypes = {
      setting1: 'new value',
      setting2: 100,
    };

    /**
     * Updates the `CustomConfig` object with the provided data, if the data types are valid.
     *
     * This test case verifies that the `AppConfig` function correctly updates the `CustomConfig` object with the provided data, when the data types are valid.
     *
     * @param data - An object containing the new values for the `CustomConfig` properties. The object should match the `CustomConfigPropTypes` interface.
     */
    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('new value');
    expect(CustomConfig.setting2).toBe(100);
    expect(CustomConfig.setting3).toBe(true); // unchanged
  });

  /**
   * Tests that the `AppConfig` function correctly handles invalid data types when updating the `CustomConfig` object.
   *
   * This test case verifies that the `AppConfig` function logs appropriate error messages when the provided data contains invalid data types for the `CustomConfig` properties.
   *
   * @param data - An object containing the new values for the `CustomConfig` properties. The object should match the `CustomConfigPropTypes` interface, but with invalid data types.
   */
  it('should not update CustomConfig with invalid data types', () => {
    const data: CustomConfigPropTypes = {
      setting1: 123, // invalid type
      setting2: 'invalid type', // invalid type
    };

    console.log = jest.fn(); // Mock console.log

    /**
     * Updates the `CustomConfig` object with the provided data, if the data types are valid.
     *
     * This code verifies that the `AppConfig` function correctly updates the `CustomConfig` object with the provided data, when the data types are invalid. It logs appropriate error messages when the provided data contains invalid data types for the `CustomConfig` properties.
     *
     * @param data - An object containing the new values for the `CustomConfig` properties. The object should match the `CustomConfigPropTypes` interface, but with invalid data types.
     */
    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('default1');
    expect(CustomConfig.setting2).toBe(42);
    expect(CustomConfig.setting3).toBe(true);

    expect(console.log).toHaveBeenCalledWith('setting1 accepts only string data type.');
    expect(console.log).toHaveBeenCalledWith('setting2 accepts only number data type.');
  });

  /**
   * Tests that the `AppConfig` function correctly handles undefined data when updating the `CustomConfig` object.
   *
   * This test case verifies that the `AppConfig` function does not update the `CustomConfig` object when the provided data contains undefined values for the `CustomConfig` properties.
   *
   * @param data - An object containing the new values for the `CustomConfig` properties. The object should match the `CustomConfigPropTypes` interface, but with undefined values.
   */
  it('should not update CustomConfig if data is undefined', () => {
    const data: CustomConfigPropTypes = {
      setting1: undefined,
      setting2: undefined,
    };

    AppConfig(data);

    /**
     * Verifies that the `CustomConfig` object has the expected default values after calling the `AppConfig` function with invalid data.
     *
     * This code checks that the `CustomConfig` object's properties (`setting1`, `setting2`, and `setting3`) have the expected default values after calling the `AppConfig` function with data containing invalid data types.
     */
    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('default1');
    expect(CustomConfig.setting2).toBe(42);
    expect(CustomConfig.setting3).toBe(true);
  });

  /**
   * Tests that the `AppConfig` function correctly handles partial updates to the `CustomConfig` object.
   *
   * This test case verifies that the `AppConfig` function updates the `CustomConfig` object with the provided data, while leaving the other properties unchanged.
   *
   * @param data - An object containing the new values for the `CustomConfig` properties. The object should match the `CustomConfigPropTypes` interface, but with only a partial set of properties.
   */
  it('should handle partial updates correctly', () => {
    const data: CustomConfigPropTypes = {
      setting1: 'partial update',
    };

    /**
     * Updates the `CustomConfig` object with the provided data.
     *
     * This function updates the properties of the `CustomConfig` object with the values provided in the `data` parameter. If the `data` parameter contains only a partial set of properties, the function will update those properties while leaving the others unchanged.
     *
     * @param data - An object containing the new values for the `CustomConfig` properties. The object should match the `CustomConfigPropTypes` interface.
     */
    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('partial update');
    expect(CustomConfig.setting2).toBe(42); // unchanged
    expect(CustomConfig.setting3).toBe(true); // unchanged
  });

  /**
   * Tests that the `AppConfig` function does not update the `CustomConfig` object when the provided data contains undefined values for the `CustomConfig` properties.
   *
   * This test case verifies that the `AppConfig` function does not update the `CustomConfig` object when the provided data contains undefined values for the `CustomConfig` properties.
   *
   * @param data - An object containing the new values for the `CustomConfig` properties. The object should match the `CustomConfigPropTypes` interface, but with undefined values.
   */
  it('should not change CustomConfig if no valid keys are provided', () => {
    const data: CustomConfigPropTypes = {
      setting4: 'invalid key', // assuming setting4 does not exist in CustomConfig
    };

    /**
     * Verifies that the `CustomConfig` object has the expected default values after calling the `AppConfig` function with invalid data.
     *
     * This code checks that the `CustomConfig` object's properties (`setting1`, `setting2`, and `setting3`) have the expected default values after calling the `AppConfig` function with data containing invalid data types.
     */
    AppConfig(data);

    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('default1');
    expect(CustomConfig.setting2).toBe(42);
    expect(CustomConfig.setting3).toBe(true);
  });
/**
 * Tests that the `AppConfig` function correctly handles invalid data types for the `CustomConfig` properties.
 *
 * This test case verifies that the `AppConfig` function logs appropriate messages when the provided data contains invalid data types for the `CustomConfig` properties.
 *
 * @param data - An object containing the new values for the `CustomConfig` properties. The object should match the `CustomConfigPropTypes` interface, but with invalid data types.
 */

  it('should log appropriate messages for invalid data types', () => {
    const data: CustomConfigPropTypes = {
      setting1: 123, // invalid type
      setting2: 'invalid type', // invalid type
    };

    /**
     * Tests that the `AppConfig` function logs appropriate messages when the provided data contains invalid data types for the `CustomConfig` properties.
     *
     * This test case verifies that the `AppConfig` function logs appropriate messages when the provided data contains invalid data types for the `CustomConfig` properties.
     *
     * @param data - An object containing the new values for the `CustomConfig` properties. The object should match the `CustomConfigPropTypes` interface, but with invalid data types.
     */
    console.log = jest.fn(); // Mock console.log

    AppConfig(data);

    expect(console.log).toHaveBeenCalledWith('setting1 accepts only string data type.');
    expect(console.log).toHaveBeenCalledWith('setting2 accepts only number data type.');
  });

  /**
   * Tests that the `AppConfig` function handles empty input gracefully.
   *
   * This test case verifies that the `AppConfig` function does not throw an error or modify the `CustomConfig` object when an empty object is passed as the `data` parameter.
   *
   * @param data - An empty object representing the new values for the `CustomConfig` properties.
   */
  it('should handle empty input gracefully', () => {
    const data: CustomConfigPropTypes = {};

    AppConfig(data);

    /**
     * Verifies that the `CustomConfig` object has the expected default values after calling the `AppConfig` function with invalid data.
     *
     * This test case checks that the `CustomConfig` object's properties (`setting1`, `setting2`, and `setting3`) have the expected default values after calling the `AppConfig` function with data containing invalid data types.
     */
    const { CustomConfig } = require('./CustomConfig');
    expect(CustomConfig.setting1).toBe('default1');
    expect(CustomConfig.setting2).toBe(42);
    expect(CustomConfig.setting3).toBe(true);
  });
});
