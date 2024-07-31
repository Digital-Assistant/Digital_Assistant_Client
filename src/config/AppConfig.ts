import { CustomConfig, CustomConfigPropTypes } from "./CustomConfig";

//Setting the custom variable
export const AppConfig = (data: CustomConfigPropTypes): CustomConfigPropTypes => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid configuration data. Expected an object.');
  }

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
  Object.keys(data).forEach((key) => {
    if (!CustomConfig.hasOwnProperty(key)) {
      console.warn(`Unknown configuration property: ${key}. This property will be ignored.`);
    }
  });

  return CustomConfig;
};
