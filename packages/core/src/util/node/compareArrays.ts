/**
 * This module provides functions for deep equality comparison of arrays and objects.
 */

/**
 * Compares two arrays for ordered deep equality.
 * It returns true only when both arrays have the same length and each element at the same index is deeply equal.
 * This comparison supports primitives, nested arrays, and plain objects.
 *
 * @param array1 The first array to compare.
 * @param array2 The second array to compare.
 * @returns `true` if the arrays are deeply equal, `false` otherwise.
 */
export const compareArrays = (array1: any, array2: any): boolean => {
  // Ensure both inputs are arrays.
  if (!Array.isArray(array1) || !Array.isArray(array2)) return false;
  // If the lengths are different, they can't be equal.
  if (array1.length !== array2.length) return false;

  // Iterate through the arrays and compare each element deeply.
  for (let i = 0; i < array1.length; i++) {
    if (!deepEqual(array1[i], array2[i])) return false;
  }
  // If all elements are equal, the arrays are equal.
  return true;
}

/**
 * Checks if a value is a plain object.
 * @param o The value to check.
 * @returns `true` if the value is an object, `false` otherwise.
 */
function isObject(o: any): o is Record<string, any> {
  return o !== null && typeof o === 'object';
}

/**
 * Performs a deep equality comparison between two values.
 * This function can handle primitives, arrays, and plain objects.
 * It also correctly handles `NaN` comparisons.
 *
 * @param a The first value to compare.
 * @param b The second value to compare.
 * @returns `true` if the values are deeply equal, `false` otherwise.
 */
function deepEqual(a: any, b: any): boolean {
  // Strict equality handles primitives and reference equality for objects.
  // It also treats +0 and -0 as equal.
  if (a === b) {
    // Special case for NaN, as NaN === NaN is false.
    if (typeof a === 'number' && typeof b === 'number') {
      return (a === b) || (Number.isNaN(a) && Number.isNaN(b));
    }
    return true;
  }

  // Handle NaN equality when a !== b.
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
  }

  // Deep comparison for arrays.
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  // Deep comparison for plain objects.
  if (isObject(a) && isObject(b)) {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    if (aKeys.length !== bKeys.length) return false;
    for (let i = 0; i < aKeys.length; i++) {
      if (aKeys[i] !== bKeys[i]) return false;
      const key = aKeys[i];
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  // If none of the above, the values are not equal.
  return false;
}
