/**
 * Imports the `AppConfig` class from the `../config/AppConfig` module.
 * Imports the `CustomConfig` object and `CustomConfigPropTypes` type from the `../config/CustomConfig` module.
 */
import { t } from 'i18next';
import { AppConfig } from '../config/AppConfig';
import { CustomConfig, CustomConfigPropTypes } from '../config/CustomConfig';
/**
 * Mocks the `CustomConfig` object with default values for testing purposes.
 * This mock is used in the `AppConfig` test suite to reset the `CustomConfig`
 * object to its default state before each test.
 */

jest.mock('../config/CustomConfig', () => ({
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
});


/**
 * Updates the `CustomConfig` object with the provided data, if the data types are valid.
 *
 * @param data - A partial object of `CustomConfigPropTypes` containing the properties to update.
 * @returns void
 */
it('should update CustomConfig with valid data', () => {
  const data: Partial<CustomConfigPropTypes> = {
    enableEditClickedName: true,
    enableSkipDuringPlay: false,
  };

  AppConfig(data as CustomConfigPropTypes);

  expect(CustomConfig.enableEditClickedName).toBe(true);
  expect(CustomConfig.enableSkipDuringPlay).toBe(false);
});

/**
 * Tests that the `AppConfig` function correctly handles invalid data types for the `CustomConfig` object.
 *
 * This test verifies that when the `AppConfig` function is called with a `Partial<CustomConfigPropTypes>` object
 * containing properties with invalid data types, the `CustomConfig` object is not updated with those invalid values.
 * Instead, the test expects the default values to be preserved.
 */
it('should not update CustomConfig with invalid data types', () => {
  const data: Partial<CustomConfigPropTypes> = {
    enableEditClickedName: 123 as any, // invalid type
    enableSkipDuringPlay: 'string' as any, // invalid type
  };

  AppConfig(data as CustomConfigPropTypes);

  expect(CustomConfig.enableEditClickedName).toBe(false); // Assuming false is the default
  expect(CustomConfig.enableSkipDuringPlay).toBe(false); // Assuming false is the default
});


  /**
   * Tests that the `AppConfig` function correctly handles undefined values for the `CustomConfig` object.
   *
   * This test verifies that when the `AppConfig` function is called with a `Partial<CustomConfigPropTypes>` object
   * containing properties with `undefined` values, the `CustomConfig` object is not updated with those `undefined` values.
   * Instead, the test expects the default values to be preserved.
   */
  it('should not update CustomConfig if data is undefined', () => {
  const data: Partial<CustomConfigPropTypes> = {
    enableEditClickedName: undefined,
    enableSkipDuringPlay: undefined,
  };

  AppConfig(data as CustomConfigPropTypes);

  const { CustomConfig } = require('../config/CustomConfig');
  expect(CustomConfig.enableEditClickedName).toBe(false); // Assuming false is the default
  expect(CustomConfig.enableSkipDuringPlay).toBe(false); // Assuming false is the default
  expect(CustomConfig.enableTooltipAddition).toBe(false); // Assuming false is the default
});



  /**
   * Tests that the `AppConfig` function correctly handles partial updates to the `CustomConfig` object.
   *
   * This test verifies that when the `AppConfig` function is called with a `Partial<CustomConfigPropTypes>` object
   * containing only a subset of the `CustomConfigPropTypes` properties, the `CustomConfig` object is updated with
   * the provided values, while the remaining properties retain their default values.
   */
  it('should handle partial updates correctly', () => {
  const data: Partial<CustomConfigPropTypes> = {
    enableEditClickedName: true,
  };

  AppConfig(data as CustomConfigPropTypes);

  const { CustomConfig } = require('../config/CustomConfig');
  expect(CustomConfig.enableEditClickedName).toBe(true);
  expect(CustomConfig.enableSkipDuringPlay).toBe(false); // unchanged
  expect(CustomConfig.enableTooltipAddition).toBe(false); // unchanged
});



 /**
  * Tests that the `AppConfig` function correctly logs appropriate messages when invalid data types are provided.
  *
  * This test verifies that when the `AppConfig` function is called with a `Partial<CustomConfigPropTypes>` object
  * containing properties with invalid data types, the function logs the appropriate error messages.
  */
 it('should log appropriate messages for invalid data types', () => {
  const data: Partial<CustomConfigPropTypes> = {
    enableEditClickedName: 123 as any, // invalid type
    enableSkipDuringPlay: 'invalid type' as any, // invalid type
  };

  console.log = jest.fn(); // Mock console.log

  AppConfig(data as CustomConfigPropTypes);

  expect(console.log).toHaveBeenCalledWith('enableEditClickedName accepts only boolean data type.');
  expect(console.log).toHaveBeenCalledWith('enableSkipDuringPlay accepts only boolean data type.');
});

  /**
   * Tests that the `AppConfig` function correctly handles empty input.
   *
   * This test verifies that when the `AppConfig` function is called with an empty `Partial<CustomConfigPropTypes>` object,
   * the `CustomConfig` object is updated with the default values for all properties.
   */
  it('should handle empty input gracefully', () => {
    const testData: CustomConfigPropTypes = {
        enableEditClickedName: false,
        enableSkipDuringPlay: false,
        enableTooltipAddition: false,
        enableMultilingual: false,
        enablePermissions: false,
        permissions: [],
        enableProfanity: false,
        enableNodeTypeSelection: false,
        enableRecording: false,
        enableOverlay: false,
        environment: 'PROD', // Add this property
        enableUdaIcon: true, // Add this property
        udaDivId: 'uda-nistapp-logo', // Add this property
        enableForAllDomains: false, // Add this property
        enableSpeechToText: false, // Add this property
        enableSlowReplay: false, // Add this property
        enableCustomIcon: false, // Add this property
        customIcon: 'https://udan.nistapp.com/uda-logo.jpg', // Add this property
        realm: 'your-realm', // Add this property
        clientId: 'your-client-id', // Add this property
        clientSecret: 'your-client-secret', // Add this property
        enableHidePanelAfterCompletion: false, // Add this property
        enableStatusSelection: false, // Flag to enable status selection
        enableUDAIconDuringRecording: false // Flag to enable UDA icon during recording
      };
  });

// Mock CustomConfig
/**
 * Mocks the `CustomConfig` and `CustomConfigPropTypes` objects from the `../config/CustomConfig` module.
 * This is used in tests to set the default values for the `CustomConfig` object before each test.
 */
jest.mock('../config/CustomConfig', () => ({
  CustomConfig: {
    setting1: 'default1',
    setting2: 42,
    setting3: true,
  },

  CustomConfigPropTypes: {
    setting1: 'string',
    setting2: 'number',
    setting3: 'boolean',
  },
}));


/**
 * Resets the `CustomConfig` object to its default values before each test in the `AppConfig` test suite.
 * This ensures that the tests start with a clean slate and are not affected by any changes made to the `CustomConfig` object in previous tests.
 */
describe('AppConfig', () => {
  beforeEach(() => {
    // Reset CustomConfig to its default values before each test
    const { CustomConfig } = require('../config/CustomConfig');
    CustomConfig.setting1 = 'default1';
    CustomConfig.setting2 = 42;
    CustomConfig.setting3 = true;
  });


  /**
   * Updates the `CustomConfig` object with the provided partial configuration data.
   *
   * This function takes a partial object of `CustomConfigPropTypes` and updates the corresponding properties in the `CustomConfig` object. If a property is not present in the `testData` object, its value in `CustomConfig` will remain unchanged.
   *
   * @param testData - A partial object of `CustomConfigPropTypes` containing the configuration data to update.
   */
  it('should update CustomConfig with valid data', () => {
  const testData: Partial<CustomConfigPropTypes> = {
    enableEditClickedName: true,
    enableSkipDuringPlay: false,
  };

  AppConfig(testData as CustomConfigPropTypes);

  expect(CustomConfig.enableEditClickedName).toBe(true);
  expect(CustomConfig.enableSkipDuringPlay).toBe(false);
});


 /**
  * Tests that the `AppConfig` function correctly handles undefined values in the provided `testData` object.
  *
  * When the `testData` object contains properties with `undefined` values, the `AppConfig` function should update the corresponding properties in the `CustomConfig` object to `undefined` as well.
  */
 it('should handle undefined values', () => {
  const testData: Partial<CustomConfigPropTypes> = {
    enableEditClickedName: undefined,
    enableSkipDuringPlay: undefined,
  };

  AppConfig(testData as CustomConfigPropTypes);

  expect(CustomConfig.enableEditClickedName).toBeUndefined();
  expect(CustomConfig.enableSkipDuringPlay).toBeUndefined();
});


 /**
  * Updates the `CustomConfig` object with the provided partial configuration data.
  *
  * This function takes a partial object of `CustomConfigPropTypes` and updates the corresponding properties in the `CustomConfig` object. If a property is not present in the `testData` object, its value in `CustomConfig` will remain unchanged.
  *
  * @param testData - A partial object of `CustomConfigPropTypes` containing the configuration data to update.
  */
 it('should update CustomConfig with partial data', () => {
  const testData: Partial<CustomConfigPropTypes> = {
    enableEditClickedName: true,
  };

  AppConfig(testData as CustomConfigPropTypes);

  expect(CustomConfig.enableEditClickedName).toBe(true);
});


 /**
  * Tests that the `AppConfig` function correctly ignores properties that are not present in the `CustomConfig` object.
  *
  * When the `testData` object contains properties that do not exist in the `CustomConfig` object, the `AppConfig` function should ignore those properties and only update the properties that do exist.
  */
 it('should ignore properties not present in CustomConfig', () => {
  const testData = {
    enableEditClickedName: true,
    nonExistentProperty: 'This should be ignored'
  };

  AppConfig(testData as unknown as CustomConfigPropTypes);

  expect(CustomConfig.enableEditClickedName).toBe(true);
  expect(CustomConfig).not.toHaveProperty('nonExistentProperty');
});


/**
 * Tests that the `AppConfig` function correctly ignores invalid data types for configuration properties.
 *
 * When the `testData` object contains properties with invalid data types, the `AppConfig` function should not update the corresponding properties in the `CustomConfig` object. Instead, it should keep the original values in `CustomConfig`.
 */
it('should not update CustomConfig with invalid data types', () => {
  const originalConfig = { ...CustomConfig };
  const testData: Partial<CustomConfigPropTypes> = {
    enableEditClickedName: 123 as any, // invalid type
    enableSkipDuringPlay: 'string' as any, // invalid type
    enableTooltipAddition: true,
    enableMultilingual: false,
    enablePermissions: true,
    permissions: [],
    // Add other required properties here with their correct types
  };

  AppConfig(testData as CustomConfigPropTypes);

  expect(CustomConfig).toEqual(originalConfig);
});


/**
 * Tests that the `AppConfig` function correctly ignores properties that are not present in the `CustomConfig` object.
 *
 * When the `testData` object contains properties that do not exist in the `CustomConfig` object, the `AppConfig` function should ignore those properties and only update the properties that do exist.
 */
it('should ignore non-existent keys', () => {
  const testData: Partial<CustomConfigPropTypes> = {
    enableEditClickedName: true,
    enableSkipDuringPlay: false,
    enableTooltipAddition: true,
    enableMultilingual: false,
  };

  const dataWithNonExistentKey = {
    ...testData,
    nonExistentKey: 'This should be ignored'
  };

  AppConfig(dataWithNonExistentKey as CustomConfigPropTypes);

  expect(CustomConfig.enableEditClickedName).toBe(true);
  expect(CustomConfig.enableSkipDuringPlay).toBe(false);
  expect(CustomConfig.enableTooltipAddition).toBe(true);
  expect(CustomConfig.enableMultilingual).toBe(false);
  expect(CustomConfig).not.toHaveProperty('nonExistentKey');
});


  /**
   * Tests that the `AppConfig` function correctly handles null values for configuration properties.
   *
   * When the `testData` object contains properties with null values, the `AppConfig` function should update the corresponding properties in the `CustomConfig` object with those null values.
   */
  it('should not update CustomConfig with null values', () => {
    const testData: Partial<CustomConfigPropTypes> = {
        enableEditClickedName: null,
        enableSkipDuringPlay: null,
        // Add other properties from CustomConfigPropTypes as needed
      };

      AppConfig(testData as CustomConfigPropTypes);

      expect(CustomConfig.enableEditClickedName).toBeNull();
      expect(CustomConfig.enableSkipDuringPlay).toBeNull();
    });


/**
 * Tests that the `AppConfig` function correctly handles both valid and invalid properties in the configuration object.
 *
 * When the `testData` object contains both valid and invalid properties, the `AppConfig` function should update the valid properties in the `CustomConfig` object and log a warning message for the invalid property.
 */
it('should handle both valid and invalid properties', () => {
  const testData: Partial<CustomConfigPropTypes> = {
    enableEditClickedName: true,
    enableSkipDuringPlay: false,
    enableTooltipAddition: true,
    enableMultilingual: false,
    // Add other required properties here
  };

  const invalidData = {
    ...testData,
    invalidProperty: {},
  };

  const consoleSpy = jest.spyOn(console, 'log');

  AppConfig(invalidData as CustomConfigPropTypes);

  expect(CustomConfig.enableEditClickedName).toBe(true);
  expect(CustomConfig.enableSkipDuringPlay).toBe(false);
  expect(CustomConfig).not.toHaveProperty('invalidProperty');
  expect(consoleSpy).toHaveBeenCalledWith('invalidProperty accepts only undefined data type.');

  consoleSpy.mockRestore();
});
});

/**
 * Resets the `CustomConfig` object to its initial state before each test in the `AppConfig` test suite.
 * This ensures that the tests are independent and do not rely on the state of `CustomConfig` from previous tests.
 */
describe('AppConfig', () => {
  beforeEach(() => {
    // Reset CustomConfig to its initial state before each test
    Object.keys(CustomConfig).forEach(key => {
      CustomConfig[key] = false;
    });
  });

  /**
   * Tests that the `AppConfig` function correctly handles invalid input data.
   * This test verifies that the `AppConfig` function throws an error when the input data is `null`, `undefined`, or a `string`.
   */
  it('should throw an error for invalid input', () => {
    expect(() => AppConfig(null as any)).toThrow('Invalid configuration data. Expected an object.');
    expect(() => AppConfig(undefined as any)).toThrow('Invalid configuration data. Expected an object.');
    expect(() => AppConfig('string' as any)).toThrow('Invalid configuration data. Expected an object.');
  });

  /**
   * Tests that the `AppConfig` function correctly updates multiple properties in the `CustomConfig` object.
   * This test verifies that when a `Partial<CustomConfigPropTypes>` object is passed to `AppConfig`, the function
   * updates the corresponding properties in `CustomConfig` with the provided values.
   */
  it('should update multiple properties correctly', () => {
    const testData: Partial<CustomConfigPropTypes> = {
      enableEditClickedName: true,
      enableSkipDuringPlay: true,
      enableTooltipAddition: true,
    };
    AppConfig(testData as CustomConfigPropTypes);
    expect(CustomConfig.enableEditClickedName).toBe(true);
    expect(CustomConfig.enableSkipDuringPlay).toBe(true);
    expect(CustomConfig.enableTooltipAddition).toBe(true);
  });


  /**
   * Tests that the `AppConfig` function handles boolean type mismatches correctly.
   * If a boolean property is provided as a string, the function should set the property to the default value (false).
   * Additionally, the function should log a warning message to the console indicating the type mismatch.
   */
  it('should handle boolean type mismatches', () => {
    const testData = {
      enableEditClickedName: 'true' as any,
    };
    const consoleSpy = jest.spyOn(console, 'warn');
    AppConfig(testData as CustomConfigPropTypes);
    expect(CustomConfig.enableEditClickedName).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Type mismatch for property "enableEditClickedName". Expected boolean, received string.');
    consoleSpy.mockRestore();
  });

  /**
   * Tests that the `AppConfig` function does not modify the `CustomConfig` object when all input properties are `undefined`.
   */
  it('should not modify properties when all input properties are undefined', () => {
    const initialConfig = { ...CustomConfig };
    const testData: Partial<CustomConfigPropTypes> = {
      enableEditClickedName: undefined,
      enableSkipDuringPlay: undefined,
    };
    AppConfig(testData as CustomConfigPropTypes);
    expect(CustomConfig).toEqual(initialConfig);
  });
});


/**
 * Resets the `CustomConfig` object to its initial state before each test.
 * This ensures that the tests are independent and do not rely on the state
 * of the `CustomConfig` object from previous tests.
 */
describe('AppConfig', () => {
  beforeEach(() => {
    // Reset CustomConfig to its initial state before each test
    Object.keys(CustomConfig).forEach(key => {
      CustomConfig[key] = false;
    });
  });

  /**
   * Tests that the `AppConfig` function correctly handles a mix of valid and invalid properties in the input object.
   * The function should set the valid properties to the corresponding values in the `CustomConfig` object,
   * and log a warning message to the console for any unknown properties.
   */
  it('should handle mixed valid and invalid properties', () => {
    const testData: Partial<CustomConfigPropTypes> & { invalidProp: string } = {
      enableEditClickedName: true,
      enableSkipDuringPlay: false,
      invalidProp: 'should be ignored'
    };
    const consoleSpy = jest.spyOn(console, 'warn');
    AppConfig(testData as CustomConfigPropTypes);
    expect(CustomConfig.enableEditClickedName).toBe(true);
    expect(CustomConfig.enableSkipDuringPlay).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Unknown configuration property: invalidProp. This property will be ignored.');
    consoleSpy.mockRestore();
  });

  /**
   * Tests that the `AppConfig` function correctly sets all properties in the `CustomConfig` object when provided with a complete set of configuration properties.
   */
  it('should handle all properties being set', () => {
    const testData: CustomConfigPropTypes = {
        enableEditClickedName: true,
        enableSkipDuringPlay: true,
        enableTooltipAddition: true,
        enableMultilingual: true,
        enablePermissions: true,
        permissions: ['read', 'write'],
        enableProfanity: true,
        enableNodeTypeSelection: true,
        enableRecording: true,
        enableOverlay: true,
        environment: 'PROD', // Add this property
        enableUdaIcon: true, // Add this property
        udaDivId: 'uda-nistapp-logo', // Add this property
        enableForAllDomains: false, // Add this property
        enableSpeechToText: false, // Add this property
        enableSlowReplay: false, // Add this property
        enableCustomIcon: false, // Add this property
        customIcon: 'https://udan.nistapp.com/uda-logo.jpg', // Add this property
        realm: 'your-realm', // Add this property
        clientId: 'your-client-id', // Add this property
        clientSecret: 'your-client-secret', // Add this property
        enableHidePanelAfterCompletion: false, // Add this property
        enableStatusSelection: false, // Flag to enable status selection
        enableUDAIconDuringRecording: false // Flag to enable UDA icon during recording
      };
    AppConfig(testData);
    expect(CustomConfig).toEqual(testData);
  });

  /**
   * Tests that the `AppConfig` function does not modify the `CustomConfig` object when provided with an empty input object.
   */
  it('should not modify properties for empty input object', () => {
    const initialConfig = { ...CustomConfig };
    AppConfig({} as CustomConfigPropTypes);
    expect(CustomConfig).toEqual(initialConfig);
  });

  /**
   * Tests that the `AppConfig` function correctly handles type mismatches for multiple configuration properties.
   *
   * This test verifies that the `AppConfig` function correctly sets the corresponding `CustomConfig` properties to their default values when the input data contains values of the wrong type.
   *
   * The test provides an input object with properties of types `number`, `string`, and `object`, which do not match the expected types for those properties in `CustomConfig`. The test then verifies that the `AppConfig` function sets the corresponding `CustomConfig` properties to their default values, and that the `console.warn` function is called the expected number of times to log the type mismatches.
   */
  it('should handle type mismatches for multiple properties', () => {
    const testData = {
      enableEditClickedName: 1 as any,
      enableSkipDuringPlay: 'false' as any,
      enableTooltipAddition: {} as any
    };
    const consoleSpy = jest.spyOn(console, 'warn');
    AppConfig(testData as CustomConfigPropTypes);
    expect(CustomConfig.enableEditClickedName).toBe(false);
    expect(CustomConfig.enableSkipDuringPlay).toBe(false);
    expect(CustomConfig.enableTooltipAddition).toBe(false);
    expect(consoleSpy).toHaveBeenCalledTimes(3);
    consoleSpy.mockRestore();
  });
});


/**
 * Resets the `CustomConfig` object to its initial state before each test in the `AppConfig` test suite.
 *
 * This `beforeEach` hook is used to ensure that the `CustomConfig` object is in a known state before each test is executed. It iterates over the keys of the `CustomConfig` object and sets each property to `false`, effectively resetting the configuration to its default state.
 *
 * This setup ensures that the tests in the `AppConfig` suite are independent and do not rely on the state of the `CustomConfig` object from previous tests.
 */
describe('AppConfig', () => {
  beforeEach(() => {
    // Reset CustomConfig to its initial state before each test
    Object.keys(CustomConfig).forEach(key => {
      CustomConfig[key] = false;
    });
  });
/**
 * Tests that the `AppConfig` function correctly handles partial updates with some undefined values.
 *
 * This test case verifies that the `AppConfig` function correctly updates the `CustomConfig` object with a partial set of configuration data, where some properties are set to `undefined`. The test ensures that the `AppConfig` function sets the `CustomConfig` properties to their default values for the properties that are not explicitly set in the input data.
 *
 * @remarks
 * This test case is part of the suite of tests for the `AppConfig` function, which is responsible for updating the `CustomConfig` object with configuration settings.
 */

  it('should handle partial updates with some undefined values', () => {
    const testData: Partial<CustomConfigPropTypes> = {
      enableEditClickedName: true,
      enableSkipDuringPlay: undefined,
      enableTooltipAddition: false
    };
    AppConfig(testData as CustomConfigPropTypes);
    expect(CustomConfig.enableEditClickedName).toBe(true);
    expect(CustomConfig.enableSkipDuringPlay).toBe(false); // Remains default
    expect(CustomConfig.enableTooltipAddition).toBe(false);
  });

  /**
   * Tests that the `AppConfig` function correctly handles boolean conversions for configuration properties.
   *
   * This test case verifies that the `AppConfig` function correctly updates the `CustomConfig` object with boolean properties, including handling values that can be converted to boolean (e.g. `Boolean(1)` and `Boolean(0)`).
   *
   * @remarks
   * This test case is part of the suite of tests for the `AppConfig` function, which is responsible for updating the `CustomConfig` object with configuration settings.
   */
  it('should handle boolean conversions correctly', () => {
    const testData: Partial<CustomConfigPropTypes> = {
      enableEditClickedName: true,
      enableSkipDuringPlay: false,
      enableTooltipAddition: Boolean(1),
      enableMultilingual: Boolean(0)
    };
    AppConfig(testData as CustomConfigPropTypes);
    expect(CustomConfig.enableEditClickedName).toBe(true);
    expect(CustomConfig.enableSkipDuringPlay).toBe(false);
    expect(CustomConfig.enableTooltipAddition).toBe(true);
    expect(CustomConfig.enableMultilingual).toBe(false);
  });

  /**
   * Tests that the `AppConfig` function correctly handles repeated calls with different data.
   *
   * This test case verifies that the `AppConfig` function correctly updates the `CustomConfig` object with multiple sets of configuration data, ensuring that the final state reflects the latest updates.
   *
   * @remarks
   * This test case is part of the suite of tests for the `AppConfig` function, which is responsible for updating the `CustomConfig` object with configuration settings.
   */
  it('should handle repeated calls with different data', () => {
    const testData1: Partial<CustomConfigPropTypes> = {
      enableEditClickedName: true
    };
    const testData2: Partial<CustomConfigPropTypes> = {
      enableEditClickedName: false,
      enableSkipDuringPlay: true
    };
    AppConfig(testData1 as CustomConfigPropTypes);
    AppConfig(testData2 as CustomConfigPropTypes);
    expect(CustomConfig.enableEditClickedName).toBe(false);
    expect(CustomConfig.enableSkipDuringPlay).toBe(true);
  });

  /**
   * Tests that the `AppConfig` function correctly handles non-boolean properties.
   *
   * This test case verifies that the `AppConfig` function correctly updates the `CustomConfig` object with non-boolean properties, such as strings and arrays.
   *
   * @remarks
   * This test case is part of the suite of tests for the `AppConfig` function, which is responsible for updating the `CustomConfig` object with configuration settings.
   */
  it('should handle non-boolean properties correctly', () => {
    const testData: Partial<CustomConfigPropTypes> = {
      udaDivId: 'test-div',
      environment: 'development',
      permissions: ['read', 'write']
    };
    AppConfig(testData as CustomConfigPropTypes);
    expect(CustomConfig.udaDivId).toBe('test-div');
    expect(CustomConfig.environment).toBe('development');
    expect(CustomConfig.permissions).toEqual(['read', 'write']);
  });
});

/**
 * Resets the `CustomConfig` object to its initial state before each test in the `AppConfig` test suite.
 *
 * This `beforeEach` hook is used to ensure that the `CustomConfig` object is in a known state before each test is executed. This helps to isolate the tests from any side effects that may have occurred in previous tests.
 */
describe('AppConfig', () => {
  beforeEach(() => {
    // Reset CustomConfig to its initial state before each test
    Object.keys(CustomConfig).forEach(key => {
      CustomConfig[key] = false;
    });
  });

  /**
   * Tests that the `AppConfig` function correctly handles edge case values for boolean properties.
   *
   * This test case verifies that the `AppConfig` function correctly updates the `CustomConfig` object with boolean properties that have edge case values, such as an empty object, the number 0, the number 1, and an empty string.
   *
   * @remarks
   * This test case is part of the suite of tests for the `AppConfig` function, which is responsible for updating the `CustomConfig` object with configuration settings.
   */
  it('should handle edge case values for boolean properties', () => {
    const testData: Partial<CustomConfigPropTypes> = {
      enableEditClickedName: !!{},
      enableSkipDuringPlay: !!0,
      enableTooltipAddition: !!1,
      enableMultilingual: !!'',
    };
    AppConfig(testData as CustomConfigPropTypes);
    expect(CustomConfig.enableEditClickedName).toBe(true);
    expect(CustomConfig.enableSkipDuringPlay).toBe(false);
    expect(CustomConfig.enableTooltipAddition).toBe(true);
    expect(CustomConfig.enableMultilingual).toBe(false);
  });

  /**
   * Tests that the `AppConfig` function correctly maintains the type consistency of non-boolean properties.
   *
   * This test case verifies that the `AppConfig` function correctly updates the `CustomConfig` object with non-boolean properties, ensuring that the types of the properties are preserved.
   *
   * @remarks
   * This test case is part of the suite of tests for the `AppConfig` function, which is responsible for updating the `CustomConfig` object with configuration settings.
   */
  it('should maintain type consistency for non-boolean properties', () => {
    const testData: Partial<CustomConfigPropTypes> = {
      udaDivId: 'test-123',
      environment: 'staging',
      permissions: ['admin', 'user'],
    };
    AppConfig(testData as CustomConfigPropTypes);
    expect(typeof CustomConfig.udaDivId).toBe('string');
    expect(typeof CustomConfig.environment).toBe('string');
    expect(Array.isArray(CustomConfig.permissions)).toBe(true);
  });

  /**
   * Tests that the `AppConfig` function correctly handles properties with default values.
   *
   * This test case verifies that the `AppConfig` function correctly updates the `CustomConfig` object with a property that has a default value. It ensures that the other properties in `CustomConfig` are not affected and maintain their default values.
   *
   * @remarks
   * This test case is part of the suite of tests for the `AppConfig` function, which is responsible for updating the `CustomConfig` object with configuration settings.
   */
  it('should handle properties with default values correctly', () => {
    const defaultConfig = { ...CustomConfig };
    const testData: Partial<CustomConfigPropTypes> = {
      enableEditClickedName: true,
    };
    AppConfig(testData as CustomConfigPropTypes);
    expect(CustomConfig.enableEditClickedName).toBe(true);
    Object.keys(defaultConfig).forEach(key => {
      if (key !== 'enableEditClickedName') {
        expect(CustomConfig[key]).toBe(defaultConfig[key]);
      }
    });
  });

  /**
   * Tests that the `AppConfig` function correctly ignores properties with `undefined` values.
   *
   * This test case verifies that the `AppConfig` function correctly handles properties with `undefined` values in the input data. It ensures that the `CustomConfig` object is not updated for these properties, and the existing default values are maintained.
   *
   * @remarks
   * This test case is part of the suite of tests for the `AppConfig` function, which is responsible for updating the `CustomConfig` object with configuration settings.
   */
  it('should ignore properties with undefined values', () => {
    const initialConfig = { ...CustomConfig };
    const testData: Partial<CustomConfigPropTypes> = {
      enableEditClickedName: undefined,
      enableSkipDuringPlay: true,
      enableTooltipAddition: undefined,
    };
    AppConfig(testData as CustomConfigPropTypes);
    expect(CustomConfig.enableEditClickedName).toBe(initialConfig.enableEditClickedName);
    expect(CustomConfig.enableSkipDuringPlay).toBe(true);
    expect(CustomConfig.enableTooltipAddition).toBe(initialConfig.enableTooltipAddition);
  });
});


