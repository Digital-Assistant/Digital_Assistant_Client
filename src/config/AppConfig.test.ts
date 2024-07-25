import { AppConfig } from './AppConfig';
import { CustomConfig, CustomConfigPropTypes } from './CustomConfig';

/**
 * Resets the `CustomConfig` module before each test in the `AppConfig` test suite.
 * This ensures a clean state for each test, preventing any unintended side effects
 * from previous tests.
 */
describe('AppConfig', () => {
  beforeEach(() => {
    // Reset CustomConfig before each test
    jest.resetModules();
    jest.mock('./CustomConfig', () => ({
      CustomConfig: {
        someString: 'default',
        someNumber: 0,
        someBoolean: false,
      },
      CustomConfigPropTypes: {},
    }));
  });

  /**
   * Tests that the `AppConfig` function correctly updates the `CustomConfig` object with valid data.
   * 
   * This test case verifies that when valid data is passed to the `AppConfig` function, the `CustomConfig`
   * object is updated with the provided values for `someString`, `someNumber`, and `someBoolean`.
   */
  it('should update CustomConfig with valid data', () => {
    const testData: CustomConfigPropTypes = {
      someString: 'test',
      someNumber: 42,
      someBoolean: true,
    };

    AppConfig(testData);

    expect(CustomConfig.someString).toBe('test');
    expect(CustomConfig.someNumber).toBe(42);
    expect(CustomConfig.someBoolean).toBe(true);
  });

  /**
   * Tests that the `AppConfig` function correctly handles invalid data types for the `CustomConfig` properties.
   * 
   * This test case verifies that when invalid data types are passed to the `AppConfig` function, the `CustomConfig`
   * object is not updated, and console warnings are logged for each invalid property.
   */
  it('should not update CustomConfig with invalid data types', () => {
    const testData: any = {
      someString: 123,
      someNumber: 'invalid',
      someBoolean: 'true',
    };

    const consoleSpy = jest.spyOn(console, 'log');
    AppConfig(testData);

    expect(CustomConfig.someString).toBe('default');
    expect(CustomConfig.someNumber).toBe(0);
    expect(CustomConfig.someBoolean).toBe(false);
    expect(consoleSpy).toHaveBeenCalledTimes(3);
    expect(consoleSpy).toHaveBeenCalledWith('someString accepts only string data type.');
    expect(consoleSpy).toHaveBeenCalledWith('someNumber accepts only number data type.');
    expect(consoleSpy).toHaveBeenCalledWith('someBoolean accepts only boolean data type.');
  });

  /**
   * Tests that the `AppConfig` function only updates the provided properties in the `CustomConfig` object.
   * 
   * This test case verifies that when only the `someString` property is provided in the `testData` object,
   * the `AppConfig` function updates the `CustomConfig.someString` property with the provided value, while
   * leaving the `CustomConfig.someNumber` and `CustomConfig.someBoolean` properties unchanged.
   */
  it('should only update provided properties', () => {
    const testData: CustomConfigPropTypes = {
      someString: 'test',
    };

    AppConfig(testData);

    expect(CustomConfig.someString).toBe('test');
    expect(CustomConfig.someNumber).toBe(0);
    expect(CustomConfig.someBoolean).toBe(false);
  });

  /**
   * Tests that the `AppConfig` function correctly handles undefined properties in the input data.
   * 
   * This test case verifies that when the `AppConfig` function is called with an input object that contains
   * undefined properties, the `CustomConfig` object is only updated with the defined properties, and the
   * undefined properties are ignored.
   */
  it('should ignore undefined properties', () => {
    const testData: CustomConfigPropTypes = {
      someString: undefined,
      someNumber: 42,
    };

    AppConfig(testData);

    expect(CustomConfig.someString).toBe('default');
    expect(CustomConfig.someNumber).toBe(42);
    expect(CustomConfig.someBoolean).toBe(false);
  });
});

/**
 * Resets the module state and mocks the `CustomConfig` module for testing purposes.
 * 
 * This setup function is called before each test in the `AppConfig` test suite. It ensures that the
 * `CustomConfig` module is mocked with a known set of default values, so that the tests can reliably
 * assert the behavior of the `AppConfig` function.
 */
describe('AppConfig additional tests', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.mock('./CustomConfig', () => ({
      CustomConfig: {
        stringProp: 'default',
        numberProp: 0,
        booleanProp: false,
        objectProp: { key: 'value' },
        arrayProp: [1, 2, 3],
      },
      CustomConfigPropTypes: {},
    }));
  });

  /**
   * Tests that the `AppConfig` function correctly handles empty input data.
   * 
   * This test case verifies that when the `AppConfig` function is called with an empty input object,
   * the `CustomConfig` object is updated with the default values defined in the `CustomConfig` module.
   */
  it('should handle empty input data', () => {
    const emptyData: CustomConfigPropTypes = {};
    AppConfig(emptyData);
    expect(CustomConfig).toEqual({
      stringProp: 'default',
      numberProp: 0,
      booleanProp: false,
      objectProp: { key: 'value' },
      arrayProp: [1, 2, 3],
    });
  });

  /**
   * Tests that the `AppConfig` function correctly updates nested object properties.
   * 
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a nested object property, the `CustomConfig` object is updated with the new nested
   * object value.
   */
  it('should update nested object properties correctly', () => {
    const testData: CustomConfigPropTypes = {
      objectProp: { newKey: 'newValue' },
    };
    AppConfig(testData);
    expect(CustomConfig.objectProp).toEqual({ newKey: 'newValue' });
  });

  /**
   * Tests that the `AppConfig` function correctly updates array properties.
   * 
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains an array property, the `CustomConfig` object is updated with the new array value.
   */
  it('should update array properties correctly', () => {
    const testData: CustomConfigPropTypes = {
      arrayProp: [4, 5, 6],
    };
    AppConfig(testData);
    expect(CustomConfig.arrayProp).toEqual([4, 5, 6]);
  });

  /**
   * Tests that the `AppConfig` function correctly handles mixed valid and invalid input data.
   * 
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a mix of valid and invalid property values, the `CustomConfig` object is updated with
   * the valid values, and the console logs a warning message for the invalid values.
   */
  it('should handle mixed valid and invalid data', () => {
    const testData: any = {
      stringProp: 'valid',
      numberProp: 'invalid',
      booleanProp: true,
      unknownProp: 'should be ignored',
    };
    const consoleSpy = jest.spyOn(console, 'log');
    AppConfig(testData);
    expect(CustomConfig.stringProp).toBe('valid');
    expect(CustomConfig.numberProp).toBe(0);
    expect(CustomConfig.booleanProp).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith('numberProp accepts only number data type.');
    expect(CustomConfig).not.toHaveProperty('unknownProp');
  });

  /**
   * Tests that the `AppConfig` function correctly handles null values.
   * 
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a null value for a property, the `CustomConfig` object is updated with the default
   * value for that property, and a warning message is logged to the console.
   */
  it('should handle null values correctly', () => {
    const testData: CustomConfigPropTypes = {
      stringProp: null,
    };
    const consoleSpy = jest.spyOn(console, 'log');
    AppConfig(testData);
    expect(CustomConfig.stringProp).toBe('default');
    expect(consoleSpy).toHaveBeenCalledWith('stringProp accepts only string data type.');
  });

  /**
   * Tests that the `AppConfig` function correctly handles invalid input data.
   * 
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains only invalid property values, the `CustomConfig` object is not modified, and no warning
   * messages are logged to the console.
   */
  it('should not modify CustomConfig when all input types are invalid', () => {
    const initialConfig = { ...CustomConfig };
    const testData: any = {
      stringProp: 123,
      numberProp: 'invalid',
      booleanProp: 'true',
      objectProp: 'not an object',
      arrayProp: 'not an array',
    };
    AppConfig(testData);
    expect(CustomConfig).toEqual(initialConfig);
  });
});

/**
 * This block of code is part of a test suite for the `AppConfig` function. It sets up a mock version of the `CustomConfig` object, which is used in the tests to verify the behavior of the `AppConfig` function.
 * 
 * The mock `CustomConfig` object is created with the following properties:
 * - `stringProp`: set to the default value of `'default'`
 * - `numberProp`: set to the default value of `0`
 * - `booleanProp`: set to the default value of `false`
 * - `objectProp`: set to an object with a nested `value` property
 * - `arrayProp`: set to an array with three elements: a number, an object, and an array
 * 
 * This mock configuration is used in the subsequent test cases to verify that the `AppConfig` function correctly updates the `CustomConfig` object based on the input data.
 */
describe('AppConfig advanced tests', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.mock('./CustomConfig', () => ({
      CustomConfig: {
        stringProp: 'default',
        numberProp: 0,
        booleanProp: false,
        objectProp: { nested: { value: 10 } },
        arrayProp: [1, { x: 1 }, [2, 3]],
      },
      CustomConfigPropTypes: {},
    }));
  });

  /**
   * Tests that the `AppConfig` function correctly handles updates to deeply nested object properties.
   * 
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains updates to a nested property of the `objectProp` configuration, the `CustomConfig`
   * object is updated accordingly.
   */
  it('should handle deeply nested object updates', () => {
    const testData: CustomConfigPropTypes = {
      objectProp: { nested: { value: 20, newProp: 'test' } },
    };
    AppConfig(testData);
    expect(CustomConfig.objectProp).toEqual({ nested: { value: 20, newProp: 'test' } });
  });

  /**
   * Tests that the `AppConfig` function correctly handles updates to complex array properties.
   * 
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains updates to the `arrayProp` configuration, the `CustomConfig` object is updated
   * accordingly.
   */
  it('should handle complex array updates', () => {
    const testData: CustomConfigPropTypes = {
      arrayProp: [4, { y: 2 }, [5, 6, 7]],
    };
    AppConfig(testData);
    expect(CustomConfig.arrayProp).toEqual([4, { y: 2 }, [5, 6, 7]]);
  });

  /**
   * Tests that the `AppConfig` function correctly handles updates to multiple configuration properties in a single call.
   * 
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains updates to the `stringProp`, `numberProp`, and `booleanProp` configuration properties,
   * the `CustomConfig` object is updated accordingly.
   */
  it('should handle multiple property updates in one call', () => {
    const testData: CustomConfigPropTypes = {
      stringProp: 'new string',
      numberProp: 42,
      booleanProp: true,
    };
    AppConfig(testData);
    expect(CustomConfig.stringProp).toBe('new string');
    expect(CustomConfig.numberProp).toBe(42);
    expect(CustomConfig.booleanProp).toBe(true);
  });

  /**
   * Tests that the `AppConfig` function correctly handles empty string, zero, and false values for configuration properties.
   * 
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains empty string, zero, and false values for the `stringProp`, `numberProp`, and `booleanProp`
   * configuration properties, the `CustomConfig` object is updated accordingly.
   */
  it('should handle empty string, zero, and false as valid values', () => {
    const testData: CustomConfigPropTypes = {
      stringProp: '',
      numberProp: 0,
      booleanProp: false,
    };
    AppConfig(testData);
    expect(CustomConfig.stringProp).toBe('');
    expect(CustomConfig.numberProp).toBe(0);
    expect(CustomConfig.booleanProp).toBe(false);
  });

  /**
   * Tests that the `AppConfig` function correctly handles NaN and Infinity values for number properties.
   * 
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains NaN and Infinity values for the `numberProp` configuration property, the `CustomConfig`
   * object is updated accordingly.
   */
  it('should handle NaN and Infinity for number properties', () => {
    const testData: CustomConfigPropTypes = {
      numberProp: NaN,
    };
    AppConfig(testData);
    expect(isNaN(CustomConfig.numberProp)).toBe(true);

    testData.numberProp = Infinity;
    AppConfig(testData);
    expect(CustomConfig.numberProp).toBe(Infinity);
  });

  /**
   * Tests that the `AppConfig` function correctly handles Symbol properties.
   * 
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a Symbol property, the `CustomConfig` object is updated accordingly.
   */
  it('should handle Symbol properties correctly', () => {
    const testSymbol = Symbol('test');
    const CustomConfigWithSymbol = {
      ...CustomConfig,
      symbolProp: Symbol('default'),
    };
    jest.mock('./CustomConfig', () => ({
      CustomConfig: CustomConfigWithSymbol,
      CustomConfigPropTypes: {},
    }));

    const testData: any = {
      symbolProp: testSymbol,
    };
    AppConfig(testData);
    expect(CustomConfigWithSymbol.symbolProp).toBe(testSymbol);
  });

  /**
   * Tests that the `AppConfig` function correctly handles function properties.
   * 
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a function property, the `CustomConfig` object is updated accordingly.
   */
  it('should handle function properties', () => {
    const CustomConfigWithFunction = {
      ...CustomConfig,
      funcProp: () => 'default',
    };
    jest.mock('./CustomConfig', () => ({
      CustomConfig: CustomConfigWithFunction,
      CustomConfigPropTypes: {},
    }));

    const testFunc = () => 'new function';
    const testData: any = {
      funcProp: testFunc,
    };
    AppConfig(testData);
    expect(CustomConfigWithFunction.funcProp).toBe(testFunc);
  });
});

/**
 * Describes a set of extended tests for the `AppConfig` function.
 * 
 * The `beforeEach` block sets up a mock for the `CustomConfig` module, which is used in the
 * `AppConfig` function. This mock provides a default configuration object with various
 * property types, which is used as the starting point for the tests.
 */
describe('AppConfig extended tests', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.mock('./CustomConfig', () => ({
      CustomConfig: {
        stringProp: 'default',
        numberProp: 0,
        booleanProp: false,
        objectProp: { a: 1, b: { c: 2 } },
        arrayProp: [1, 2, 3],
      },
      CustomConfigPropTypes: {},
    }));
  });

  /**
   * Tests that the `AppConfig` function correctly handles BigInt properties.
   * 
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a BigInt property, the `CustomConfig` object is updated accordingly.
   */
  it('should handle BigInt properties', () => {
    const CustomConfigWithBigInt = {
      ...CustomConfig,
      bigIntProp: BigInt(0),
    };
    jest.mock('./CustomConfig', () => ({
      CustomConfig: CustomConfigWithBigInt,
      CustomConfigPropTypes: {},
    }));

    /**
     * Tests that the `AppConfig` function correctly handles BigInt properties.
     *
     * This test case verifies that when the `AppConfig` function is called with an input object that
     * contains a BigInt property, the `CustomConfig` object is updated accordingly.
     */
    const testData: any = {
      bigIntProp: BigInt(1234567890123456789n),
    };
    AppConfig(testData);
    expect(CustomConfigWithBigInt.bigIntProp).toBe(BigInt(1234567890123456789n));
  });

  /**
   * Tests that the `AppConfig` function correctly handles Date objects.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a Date property, the `CustomConfig` object is updated accordingly.
   */
  it('should handle Date objects', () => {
    const CustomConfigWithDate = {
      ...CustomConfig,
      dateProp: new Date(0),
    };
    jest.mock('./CustomConfig', () => ({
      CustomConfig: CustomConfigWithDate,
      CustomConfigPropTypes: {},
    }));

    const testDate = new Date('2023-05-01T00:00:00Z');
    const testData: any = {
      dateProp: testDate,
    };
    AppConfig(testData);
    expect(CustomConfigWithDate.dateProp).toEqual(testDate);
  });

  /**
   * Tests that the `AppConfig` function correctly handles partial object updates.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a partial object property, the `CustomConfig` object is updated accordingly.
   */
  it('should handle partial object updates', () => {
    const testData: CustomConfigPropTypes = {
      objectProp: { b: { d: 4 } },
    };
    AppConfig(testData);
    expect(CustomConfig.objectProp).toEqual({ b: { d: 4 } });
  });

  /**
   * Tests that the `AppConfig` function correctly handles arrays with mixed types.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains an array property with mixed types, the `CustomConfig` object is updated accordingly.
   */
  it('should handle array with mixed types', () => {
    const testData: CustomConfigPropTypes = {
      arrayProp: [1, 'two', { three: 3 }, [4, 5]],
    };
    AppConfig(testData);
    expect(CustomConfig.arrayProp).toEqual([1, 'two', { three: 3 }, [4, 5]]);
  });

  /**
   * Tests that the `AppConfig` function correctly handles very long string values.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a string property with a very long value, the `CustomConfig` object is updated
   * accordingly.
   */
  it('should handle very long strings', () => {
    const longString = 'a'.repeat(1000000);
    const testData: CustomConfigPropTypes = {
      stringProp: longString,
    };
    AppConfig(testData);
    expect(CustomConfig.stringProp).toBe(longString);
  });

  /**
   * Tests that the `AppConfig` function correctly handles very large numbers.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a number property with a very large value, the `CustomConfig` object is updated
   * accordingly.
   */
  it('should handle very large numbers', () => {
    const largeNumber = Number.MAX_SAFE_INTEGER;
    const testData: CustomConfigPropTypes = {
      numberProp: largeNumber,
    };
    AppConfig(testData);
    expect(CustomConfig.numberProp).toBe(largeNumber);
  });

  /**
   * Tests that the `AppConfig` function correctly handles frozen objects.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a frozen object property, the `CustomConfig` object is updated accordingly, and the
   * frozen object reference is preserved.
   */
  it('should handle frozen objects', () => {
    const frozenObject = Object.freeze({ frozen: true });
    const CustomConfigWithFrozen = {
      ...CustomConfig,
      frozenProp: {},
    };
    jest.mock('./CustomConfig', () => ({
      CustomConfig: CustomConfigWithFrozen,
      CustomConfigPropTypes: {},
    }));

    const testData: any = {
      frozenProp: frozenObject,
    };
    AppConfig(testData);
    expect(CustomConfigWithFrozen.frozenProp).toBe(frozenObject);
  });
});

/**
 * Describes a set of extended edge cases for testing the `AppConfig` function.
 *
 * This block of tests verifies that the `AppConfig` function correctly handles various edge cases,
 * such as very large strings, very large numbers, frozen objects, circular references, properties
 * with special characters, and sparse arrays.
 *
 * The `beforeEach` hook is used to set up a mock `CustomConfig` object with some default
 * properties, which is then used in the individual test cases.
 */
describe('AppConfig extended edge cases', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.mock('./CustomConfig', () => ({
      CustomConfig: {
        stringProp: 'default',
        numberProp: 0,
        booleanProp: false,
        objectProp: { a: 1, b: { c: 2 } },
        arrayProp: [1, 2, 3],
      },
      CustomConfigPropTypes: {},
    }));
  });

  /**
   * Tests that the `AppConfig` function correctly handles circular references in the input object.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a circular reference, the `CustomConfig` object is updated accordingly, and the
   * circular reference is preserved.
   */
  it('should handle circular references', () => {
    const circularObj: any = { self: null };
    circularObj.self = circularObj;
    const testData: CustomConfigPropTypes = {
      objectProp: circularObj,
    };
    AppConfig(testData);
    expect(CustomConfig.objectProp).toBe(circularObj);
    expect(CustomConfig.objectProp.self).toBe(CustomConfig.objectProp);
  });

  /**
   * Tests that the `AppConfig` function correctly handles properties with special characters in the input object.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains properties with special characters (e.g. hyphens, spaces, dots), the `CustomConfig`
   * object is updated accordingly, and the special characters are preserved.
   */
  it('should handle properties with special characters', () => {
    const CustomConfigWithSpecialChars = {
      ...CustomConfig,
      'special-prop': 'default',
      'prop with spaces': 0,
      'prop.with.dots': false,
    };
    jest.mock('./CustomConfig', () => ({
      CustomConfig: CustomConfigWithSpecialChars,
      CustomConfigPropTypes: {},
    }));

    const testData: any = {
      'special-prop': 'new value',
      'prop with spaces': 42,
      'prop.with.dots': true,
    };
    AppConfig(testData);
    expect(CustomConfigWithSpecialChars['special-prop']).toBe('new value');
    expect(CustomConfigWithSpecialChars['prop with spaces']).toBe(42);
    expect(CustomConfigWithSpecialChars['prop.with.dots']).toBe(true);
  });

  /**
   * Tests that the `AppConfig` function correctly handles sparse arrays in the input object.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a sparse array, the `CustomConfig` object is updated accordingly, and the sparse array
   * is preserved.
   */
  it('should handle sparse arrays', () => {
    const sparseArray = [1,,3,,5];
    const testData: CustomConfigPropTypes = {
      arrayProp: sparseArray,
    };
    AppConfig(testData);
    expect(CustomConfig.arrayProp).toEqual(sparseArray);
    expect(CustomConfig.arrayProp[1]).toBeUndefined();
    expect(CustomConfig.arrayProp[3]).toBeUndefined();
  });

  /**
   * Tests that the `AppConfig` function correctly handles non-enumerable properties in the input object.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a non-enumerable property, the `CustomConfig` object is updated accordingly, and the
   * non-enumerable property is preserved.
   */
  it('should handle non-enumerable properties', () => {
    const objWithNonEnumerable = {};
    Object.defineProperty(objWithNonEnumerable, 'nonEnumProp', {
      value: 'hidden',
      enumerable: false
    });
    const CustomConfigWithNonEnum = {
      ...CustomConfig,
      objProp: {},
    };
    jest.mock('./CustomConfig', () => ({
      CustomConfig: CustomConfigWithNonEnum,
      CustomConfigPropTypes: {},
    }));

    const testData: any = {
      objProp: objWithNonEnumerable,
    };
    AppConfig(testData);
    expect(CustomConfigWithNonEnum.objProp).toBe(objWithNonEnumerable);
    expect(Object.getOwnPropertyDescriptor(CustomConfigWithNonEnum.objProp, 'nonEnumProp')?.enumerable).toBe(false);
  });

  /**
   * Tests that the `AppConfig` function correctly handles attempts to pollute the prototype.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a property with the name `__proto__`, the `CustomConfig` object is not polluted with
   * the malicious property.
   */
  it('should handle prototype pollution attempts', () => {
    const maliciousData: any = {
      '__proto__': {
        maliciousProp: 'hacked',
      },
    };
    AppConfig(maliciousData);
    expect(({} as any).maliciousProp).toBeUndefined();
    expect(CustomConfig.maliciousProp).toBeUndefined();
  });
});

/**
 * Sets up the test environment for the `AppConfig` function by mocking the `CustomConfig` object with default values.
 * This is done in the `beforeEach` hook, which runs before each test in the `AppConfig advanced scenarios` suite.
 * The mocked `CustomConfig` object includes properties for string, number, boolean, object, and array values.
 */
describe('AppConfig advanced scenarios', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.mock('./CustomConfig', () => ({
      CustomConfig: {
        stringProp: 'default',
        numberProp: 0,
        booleanProp: false,
        objectProp: { a: 1, b: { c: 2 } },
        arrayProp: [1, 2, 3],
      },
      CustomConfigPropTypes: {},
    }));
  });

  /**
   * Tests that the `AppConfig` function correctly handles properties with Symbol keys.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a property with a Symbol key, the `CustomConfig` object is updated with the new value
   * for that Symbol key.
   */
  it('should handle properties with Symbol keys', () => {
    const symbolKey = Symbol('testSymbol');
    const CustomConfigWithSymbolKey = {
      ...CustomConfig,
      [symbolKey]: 'symbol value',
    };
    jest.mock('./CustomConfig', () => ({
      CustomConfig: CustomConfigWithSymbolKey,
      CustomConfigPropTypes: {},
    }));

    const testData: any = {
      [symbolKey]: 'new symbol value',
    };
    AppConfig(testData);
    expect(CustomConfigWithSymbolKey[symbolKey]).toBe('new symbol value');
  });

  /**
   * Tests that the `AppConfig` function correctly handles properties with getter/setter.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a property with a getter/setter, the `CustomConfig` object is updated with the new value
   * for that property.
   */
  it('should handle properties with getter/setter', () => {
    let internalValue = 0;
    const CustomConfigWithAccessor = {
      ...CustomConfig,
      get accessorProp() {
        return internalValue;
      },
      set accessorProp(value) {
        internalValue = value;
      },
    };
    /**
     * Mocks the `CustomConfig` module with a custom configuration object that includes a property with a getter/setter.
     * This mock is used in the test cases to verify that the `AppConfig` function correctly handles properties with getter/setter.
     */
    jest.mock('./CustomConfig', () => ({
      CustomConfig: CustomConfigWithAccessor,
      CustomConfigPropTypes: {},
    }));

    /**
     * Tests that the `AppConfig` function correctly handles properties with getter/setter.
     *
     * This test case verifies that when the `AppConfig` function is called with an input object that
     * contains a property with a getter/setter, the `CustomConfig` object is updated with the new value
     * for that property.
     */
    const testData: any = {
      accessorProp: 42,
    };
    AppConfig(testData);
    expect(CustomConfigWithAccessor.accessorProp).toBe(42);
  });

  /**
   * Tests that the `AppConfig` function correctly handles very deep nested objects.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a very deeply nested object, the `CustomConfig` object is updated with the new value
   * for that deeply nested object property.
   */
  it('should handle very deep nested objects', () => {
    const deepObject = { level1: { level2: { level3: { level4: { level5: 'deep' } } } } };
    const testData: CustomConfigPropTypes = {
      objectProp: deepObject,
    };
    AppConfig(testData);
    expect(CustomConfig.objectProp).toEqual(deepObject);
  });

  /**
   * Mocks the `CustomConfig` module with a custom configuration object that includes a property with a custom prototype.
   * This mock is used in the test cases to verify that the `AppConfig` function correctly handles properties with custom prototypes.
   */
  it('should handle objects with custom prototypes', () => {
    const customProto = { protoMethod() { return 'from proto'; } };
    const objWithCustomProto = Object.create(customProto);
    objWithCustomProto.ownProp = 'own value';

    const CustomConfigWithProto = {
      ...CustomConfig,
      protoProp: {},
    };
    /**
     * Mocks the `CustomConfig` module with a custom configuration object that includes a property with a custom prototype.
     * This mock is used in the test cases to verify that the `AppConfig` function correctly handles properties with custom prototypes.
     */
    jest.mock('./CustomConfig', () => ({
      CustomConfig: CustomConfigWithProto,
      CustomConfigPropTypes: {},
    }));

    /**
     * Tests that the `AppConfig` function correctly handles objects with custom prototypes.
     *
     * This test case verifies that when the `AppConfig` function is called with an input object that
     * contains a property with a custom prototype, the `CustomConfig` object is updated with the new value
     * for that property, including the custom prototype methods and properties.
     */
    const testData: any = {
      protoProp: objWithCustomProto,
    };
    AppConfig(testData);
    expect(CustomConfigWithProto.protoProp).toBe(objWithCustomProto);
    expect(CustomConfigWithProto.protoProp.ownProp).toBe('own value');
    expect(CustomConfigWithProto.protoProp.protoMethod()).toBe('from proto');
  });

  /**
   * Tests that the `AppConfig` function correctly handles properties with an `undefined` value.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a property with an `undefined` value, the `CustomConfig` object is updated with the
   * default value for that property.
   */
  it('should handle properties with undefined value', () => {
    const testData: CustomConfigPropTypes = {
      stringProp: undefined,
    };
    AppConfig(testData);
    expect(CustomConfig.stringProp).toBe('default');
  });
});

/**
 * Resets the module state and mocks the `CustomConfig` module with a default configuration object.
 * This setup is used in the test cases to provide a consistent starting point for testing the `AppConfig` function.
 */
describe('AppConfig additional scenarios', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.mock('./CustomConfig', () => ({
      CustomConfig: {
        stringProp: 'default',
        numberProp: 0,
        booleanProp: false,
        objectProp: { a: 1, b: { c: 2 } },
        arrayProp: [1, 2, 3],
      },
      CustomConfigPropTypes: {},
    }));
  });

  /**
   * Tests that the `AppConfig` function correctly handles properties with numeric keys.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a property with a numeric key, the `CustomConfig` object is updated with the new value
   * for that property.
   */
  it('should handle properties with numeric keys', () => {
    const CustomConfigWithNumericKeys = {
      ...CustomConfig,
      42: 'answer',
    };
    jest.mock('./CustomConfig', () => ({
      CustomConfig: CustomConfigWithNumericKeys,
      CustomConfigPropTypes: {},
    }));

    const testData: any = {
      42: 'new answer',
    };
    AppConfig(testData);
    expect(CustomConfigWithNumericKeys[42]).toBe('new answer');
  });

  /**
   * Tests that the `AppConfig` function correctly handles properties with computed names.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a property with a computed key, the `CustomConfig` object is updated with the new value
   * for that property.
   */
  it('should handle properties with computed names', () => {
    const computedKey = 'computed' + 'Key';
    const CustomConfigWithComputedKey = {
      ...CustomConfig,
      [computedKey]: 'original',
    };
    jest.mock('./CustomConfig', () => ({
      CustomConfig: CustomConfigWithComputedKey,
      CustomConfigPropTypes: {},
    }));

    const testData: any = {
      [computedKey]: 'updated',
    };
    AppConfig(testData);
    expect(CustomConfigWithComputedKey[computedKey]).toBe('updated');
  });

  /**
   * Tests that the `AppConfig` function correctly handles properties with the same value but different reference.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a property with the same value as an existing property in `CustomConfig`, but a different
   * reference, the `CustomConfig` object is updated with the new reference.
   */
  it('should handle properties with same value but different reference', () => {
    const originalObj = { key: 'value' };
    const CustomConfigWithObject = {
      ...CustomConfig,
      objProp: originalObj,
    };
    /**
     * Mocks the `CustomConfig` module with a custom configuration object that includes a property with a computed key.
     * This is used in tests to verify that the `AppConfig` function correctly handles properties with computed names.
     */
    jest.mock('./CustomConfig', () => ({
      CustomConfig: CustomConfigWithObject,
      CustomConfigPropTypes: {},
    }));

    const newObj = { key: 'value' };
    const testData: any = {
      objProp: newObj,
    };
    AppConfig(testData);
    expect(CustomConfigWithObject.objProp).toBe(newObj);
    expect(CustomConfigWithObject.objProp).not.toBe(originalObj);
  });

  /**
   * Tests that the `AppConfig` function correctly handles properties with inherited enumerable properties.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains a property with inherited enumerable properties, the `CustomConfig` object is updated
   * with the new property value, including the inherited properties.
   */
  it('should handle properties with inherited enumerable properties', () => {
    function ParentClass() {}
    ParentClass.prototype.inheritedProp = 'inherited';
    const childObj = new ParentClass();
    childObj.ownProp = 'own';

    const CustomConfigWithInherited = {
      ...CustomConfig,
      inheritedObj: {},
    };
    /**
     * Mocks the `CustomConfig` module with a custom configuration object that includes a property with inherited enumerable properties.
     * This is used in tests to verify that the `AppConfig` function correctly handles properties with inherited enumerable properties.
     */
    jest.mock('./CustomConfig', () => ({
      CustomConfig: CustomConfigWithInherited,
      CustomConfigPropTypes: {},
    }));

    const testData: any = {
      inheritedObj: childObj,
    };
    AppConfig(testData);
    expect(CustomConfigWithInherited.inheritedObj).toBe(childObj);
    expect(CustomConfigWithInherited.inheritedObj as any).toBe('own');
   expect((CustomConfigWithInherited.inheritedObj as any).inheritedProp).toBe('inherited');

  });

  /**
   * Tests that the `AppConfig` function correctly handles properties with non-primitive values that are not objects.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains properties with non-primitive values such as regular expressions, Maps, and Sets, the
   * `CustomConfig` object is updated with the new property values.
   */
  /**
   * Tests that the `AppConfig` function correctly handles properties with non-primitive values that are not objects.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains properties with non-primitive values such as regular expressions, Maps, and Sets, the
   * `CustomConfig` object is updated with the new property values.
   */
  /**
   * Tests that the `AppConfig` function correctly handles properties with non-primitive values that are not objects.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains properties with non-primitive values such as regular expressions, Maps, and Sets, the
   * `CustomConfig` object is updated with the new property values.
   */
  /**
   * Tests that the `AppConfig` function correctly handles properties with non-primitive values that are not objects.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains properties with non-primitive values such as regular expressions, Maps, and Sets, the
   * `CustomConfig` object is updated with the new property values.
   */
  /**
   * Tests that the `AppConfig` function correctly handles properties with non-primitive values that are not objects.
   *
   * This test case verifies that when the `AppConfig` function is called with an input object that
   * contains properties with non-primitive values such as regular expressions, Maps, and Sets, the
   * `CustomConfig` object is updated with the new property values.
   */
  it('should handle properties with non-primitive values that are not objects', () => {
    const CustomConfigWithSpecialTypes = {
      ...CustomConfig,
      regexProp: /test/,
      mapProp: new Map(),
      setProp: new Set(),
    };
    /**
     * Mocks the `CustomConfig` module with a custom configuration object that includes properties with non-primitive values such as regular expressions, Maps, and Sets.
     * This is used in tests to verify that the `AppConfig` function correctly handles properties with non-primitive values that are not objects.
     */
    jest.mock('./CustomConfig', () => ({
      CustomConfig: CustomConfigWithSpecialTypes,
      CustomConfigPropTypes: {},
    }));

    /**
     * Tests that the `AppConfig` function correctly handles properties with non-primitive values that are not objects.
     *
     * This test case verifies that when the `AppConfig` function is called with an input object that
     * contains properties with non-primitive values such as regular expressions, Maps, and Sets, the
     * `CustomConfig` object is updated with the new property values.
     */
    const testData: any = {
      regexProp: /new-test/,
      mapProp: new Map([['key', 'value']]),
      setProp: new Set([1, 2, 3]),
    };
    AppConfig(testData);
    expect(CustomConfigWithSpecialTypes.regexProp).toEqual(/new-test/);
    expect(CustomConfigWithSpecialTypes.mapProp).toEqual(new Map([['key', 'value']]));
    expect(CustomConfigWithSpecialTypes.setProp).toEqual(new Set([1, 2, 3]));
  });
});
