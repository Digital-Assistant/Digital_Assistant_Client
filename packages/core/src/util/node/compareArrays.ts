/**
 * Compares two arrays for ordered deep equality.
 * - Returns true when both arrays have the same length and each element is deeply equal
 * - Supports primitives, arrays, and plain objects
 */
export const compareArrays = (array1: any, array2: any): boolean => {
  if (!Array.isArray(array1) || !Array.isArray(array2)) return false;
  if (array1.length !== array2.length) return false;

  for (let i = 0; i < array1.length; i++) {
    if (!deepEqual(array1[i], array2[i])) return false;
  }
  return true;
}

function isObject(o: any): o is Record<string, any> {
  return o !== null && typeof o === 'object';
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) {
    // Handles primitives and reference equality. Also treats +0 and -0 as equal.
    // Special-case NaN equality for numbers
    if (typeof a === 'number' && typeof b === 'number') {
      return (a === b) || (Number.isNaN(a) && Number.isNaN(b));
    }
    return true;
  }

  // Handle NaN equality when a !== b
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
  }

  // Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  // Objects (plain)
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

  return false;
}
