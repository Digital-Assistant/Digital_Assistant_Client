/**
 * Remove element from array
 * @param array
 * @param value
 */
export const removeFromArray = (array, value) => {
    if (array === null || array === void 0 ? void 0 : array.includes(value)) {
        array.splice(array.indexOf(value), 1);
    }
};
//# sourceMappingURL=removeFromArray.js.map