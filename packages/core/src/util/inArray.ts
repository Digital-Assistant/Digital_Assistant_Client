/**
 * Checks if an element exists in an array.
 *
 * @param elem The element to search for within the array.
 * @param array The array to search within.
 * @returns `true` if the element is found in the array, otherwise `false`.
 */
export const inArray = (elem: any, array: any): boolean => {
    // Prefer the native `includes` method if available for simplicity and readability.
    if (array?.includes) {
        return array.includes(elem);
    }

    // Fallback for environments without `Array.prototype.includes`.
    // This also handles cases where `array` might be null or undefined.
    for (let i = 0, length = array?.length; i < length; i++) {
        if (array[i] === elem) {
            return true;
        }
    }

    // If the element is not found, return false.
    return false;
};
