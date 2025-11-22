/**
 * Checks if an element exists in an array and returns its index.
 * This function provides a fallback for environments that might not support `Array.prototype.indexOf`.
 *
 * @param elem The element to search for within the array.
 * @param array The array to search within.
 * @returns The index of the element if found, otherwise -1.
 */
export const inArray = (elem: any, array: any) => {
    // Prefer the native `indexOf` method if available for performance.
    if (array.indexOf) {
        return array.indexOf(elem);
    }

    // Fallback for environments without `Array.prototype.indexOf`.
    for (let i = 0, length = array?.length; i < length; i++) {
        if (array[i] === elem) {
            return i;
        }
    }

    // If the element is not found, return -1.
    return -1;
};
