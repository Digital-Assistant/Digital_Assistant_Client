/**
 * comparison of two arrays
 * @param array1
 * @param array2
 */
export const compareArrays = (array1, array2) => {
  let valueExists = false;
  if(array1.length > 0) {
    arrayLoop:
    for (let value of array1) {
      if (array2.includes(value)) {
        valueExists = true;
        break arrayLoop;
      }
    }
  }
  return valueExists;
}
