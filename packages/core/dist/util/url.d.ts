/**
 * Replaces placeholder values in a URL with actual values from an object.
 * e.g., processArgs('/users/#id#', { id: 123 }) -> '/users/123'
 * @param url - The URL string with placeholders.
 * @param val - An object containing the values to substitute.
 * @returns The processed URL string.
 */
export declare const processArgs: (url: string, val: any) => string;
