/**
 * To find an dom object has a given class
 * @param element
 * @param classList
 * @returns
 */
export const hasClass = (element, classList) => {
    let existsFlag = false;
    classList === null || classList === void 0 ? void 0 : classList.forEach(cls => {
        var _a;
        try {
            if (((_a = element === null || element === void 0 ? void 0 : element.className) === null || _a === void 0 ? void 0 : _a.indexOf(cls)) > -1) {
                existsFlag = true;
                return existsFlag;
            }
        }
        catch (e) {
            return false;
        }
    });
    return existsFlag;
};
//# sourceMappingURL=hasClass.js.map