/**
 * Returns index if an element in given array found
 * @param elem
 * @param array
 * @returns index
 */
export const inArray = (elem: any, array: any) => {
    if (array.indexOf) {
        return array.indexOf(elem);
    }

    for (let i = 0, length = array?.length; i < length; i++) {
        if (array[i] === elem) {
            return i;
        }
    }

    return -1;
};