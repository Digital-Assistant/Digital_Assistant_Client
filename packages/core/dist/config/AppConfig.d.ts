import { CustomConfigPropTypes } from "./CustomConfig";
/**
 * Validates and updates the application configuration with the provided data.
 *
 * @param data - An object containing the custom configuration properties.
 * @throws {Error} If the provided `data` is not an object.
 * @returns The updated `CustomConfigPropTypes` object.
 */
export declare const AppConfig: (data: CustomConfigPropTypes) => CustomConfigPropTypes;
