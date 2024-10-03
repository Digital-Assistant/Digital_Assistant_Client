import { CustomConfig, CustomConfigPropTypes } from "./CustomConfig";

/**
 * Validates and updates the application configuration with the provided data.
 *
 * @param data - An object containing the custom configuration properties.
 * @throws {Error} If the provided `data` is not an object.
 * @returns The updated `CustomConfigPropTypes` object.
 */
export const AppConfig = (data: CustomConfigPropTypes): CustomConfigPropTypes => {
  // Check if the input data is a valid object
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid configuration data. Expected an object.');
  }

  // Iterate over the keys in the CustomConfig object
  Object.keys(CustomConfig).forEach((key) => {
    if (data[key] !== undefined) {
      // Check if types match before assigning
      if (typeof CustomConfig[key] === typeof data[key]) {
        CustomConfig[key] = data[key]; // Update the configuration property
      } else {
        // Log a warning if there's a type mismatch
        console.warn(
          `Type mismatch for property "${key}". Expected ${typeof CustomConfig[key]}, received ${typeof data[key]}.`
        );
      }
    }
  });

  // Check for any unknown properties in the input data
  Object.keys(data).forEach((key) => {
    if (!CustomConfig.hasOwnProperty(key)) {
      console.warn(`Unknown configuration property: ${key}. This property will be ignored.`);
    }
  });

  // Return the updated CustomConfig object
  return CustomConfig;
};
