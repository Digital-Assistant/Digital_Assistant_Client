/**
 * Removes the first occurrence of a specified value from an array.
 * This function modifies the array in place.
 *
 * @param array The array from which to remove the value.
 * @param value The value to be removed from the array.
 * @returns The modified array.
 */
export const removeFromArray = (array: any, value: any): any[] => {
  // Check if the array contains the value before attempting to remove it.
  if (array?.includes(value)) {
    // Use `splice` to remove the element at the found index.
    array.splice(array.indexOf(value), 1);
  }
  return array;
};
