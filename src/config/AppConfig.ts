import { CustomConfig, CustomConfigPropTypes } from "./CustomConfig";

//Setting the custom variable
/**
 * Validates and updates the application configuration with the provided data.
 *
 * @param data - An object containing the custom configuration properties.
 * @throws {Error} If the provided `data` is not an object.
 * @returns The updated `CustomConfigPropTypes` object.
 */
export const AppConfig = (data: CustomConfigPropTypes): CustomConfigPropTypes => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid configuration data. Expected an object.');
  }

  /**
   * Iterates over the keys in the `CustomConfig` object and updates the corresponding properties in the `CustomConfig` object with the values from the `data` object, if the types match.
   * If the types do not match, a warning is logged to the console with the expected and received types.
   * Any properties in the `data` object that do not exist in the `CustomConfig` object are ignored.
   *
   * @param data - An object containing the custom configuration properties to be applied to the `CustomConfig` object.
   */
  Object.keys(CustomConfig).forEach((key) => {
    if (data[key] !== undefined) {
      if (typeof CustomConfig[key] === typeof data[key]) {
        CustomConfig[key] = data[key];
      } else {
        const expectedType = typeof CustomConfig[key];
        const receivedType = typeof data[key];
        console.warn(`Type mismatch for ${key}. Expected ${expectedType}, received ${receivedType}. Using default value.`);
      }
    }
  });

  // Check for unknown properties
  /**
   * Checks for any unknown properties in the provided configuration data and logs a warning for each one.
   * The unknown properties are ignored and not applied to the `CustomConfig` object.
   * 
   * @param data - An object containing the custom configuration properties to be applied to the `CustomConfig` object.
   * @returns The updated `CustomConfig` object.
   */
  Object.keys(data).forEach((key) => {
    if (!CustomConfig.hasOwnProperty(key)) {
      console.warn(`Unknown configuration property: ${key}. This property will be ignored.`);
    }
  });

  return CustomConfig;
};
