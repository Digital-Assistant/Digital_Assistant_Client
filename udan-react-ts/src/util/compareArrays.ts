/**
 * comparison of two arrays
 * @param array1
 * @param array2
 */
export const compareArrays = (array1, array2) => {
  for (let value of array1) {
    if (array2.indexOf(value) > -1) {
      return true;
    }
  }
  return false;
}
