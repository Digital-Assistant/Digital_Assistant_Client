/**
 * Parses a JSON string and ensures the resulting object has a `meta` property.
 * This function is designed to safely parse JSON strings that represent recorded metadata.
 * If the parsed object is a plain object and does not have a `meta` property, it will be added.
 *
 * @param obj The JSON string to parse.
 * @returns The parsed object. If parsing fails, an empty object is returned.
 *          If the parsed object is a plain object, it is guaranteed to have a `meta` property.
 */
export const getObjData = (obj: string) => {
    try {
        // Attempt to parse the JSON string.
        const parsed = JSON.parse(obj);
        // Check if the parsed result is a plain object (i.e., not an array or primitive).
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            // If it's a plain object, ensure that a `meta` property exists.
            // If it doesn't, initialize it as an empty object.
            if ((parsed as any).meta === undefined) {
                (parsed as any).meta = {};
            }
        }
        // Return the parsed and potentially modified object.
        return parsed as any;
    } catch (e) {
        // If JSON.parse fails, swallow the error and return an empty object,
        // as expected by tests and to prevent crashes.
        return {};
    }
};