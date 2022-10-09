/**
 * Remove element from array
 * @param array
 * @param value
 */
export const removeFromArray = (array: any, value: any) => {
  if (array?.includes(value)) {
    array.splice(array.indexOf(value), 1);
  }
};
