/**
 * //get node position on the page
 * @returns object
 */
export const getNodeCoordinates = (element, windowSize) => {
    if (!element)
        return;
    const x = element === null || element === void 0 ? void 0 : element.getBoundingClientRect();
    let result = {
        top: x.top + windowSize.scrollInfo.scrollTop,
        width: x.width,
        height: x.height,
        left: x.left + windowSize.scrollInfo.scrollLeft,
        actualPos: x,
    };
    return result;
};
//# sourceMappingURL=getNodeCoordinates.js.map