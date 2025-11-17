/**
 * Calculates page-relative coordinates for a DOM element
 *
 * This function converts viewport-relative coordinates (from getBoundingClientRect)
 * to page-relative coordinates by adding the current scroll offsets. This is essential
 * for accurate positioning when the page is scrolled.
 *
 * @param {HTMLElement} element - The DOM element to calculate coordinates for
 * @param {Object} windowSize - Screen size object containing scroll information
 *                              Expected to have scrollInfo.scrollTop and scrollInfo.scrollLeft
 *
 * @returns {Object} Page-relative coordinate information:
 *   - top: Page-relative top position (viewport top + scroll top)
 *   - left: Page-relative left position (viewport left + scroll left)
 *   - width: Element width (unchanged from viewport measurement)
 *   - height: Element height (unchanged from viewport measurement)
 *   - actualPos: Original DOMRect for reference
 *
 * @example
 * const element = document.querySelector('.my-element');
 * const screenSize = getScreenSize();
 * const coords = getNodeCoordinates(element, screenSize);
 * console.log(coords.top); // Absolute position from top of page
 */
export const getNodeCoordinates = (element: any, windowSize: any) => {
    // Get viewport-relative positioning using browser API
    // This provides the foundation for page-relative calculations
    const x = element.getBoundingClientRect();

    // Calculate page-relative coordinates by adding scroll offsets
    // This converts viewport position to absolute page position
    let result = {
        // Page-relative top: viewport top + amount scrolled vertically
        top: x.top + windowSize.scrollInfo.scrollTop,

        // Element dimensions remain the same regardless of scroll position
        width: x.width,
        height: x.height,

        // Page-relative left: viewport left + amount scrolled horizontally
        left: x.left + windowSize.scrollInfo.scrollLeft,

        // Preserve original DOMRect for reference and debugging
        actualPos: x
    };

    return result;
}
