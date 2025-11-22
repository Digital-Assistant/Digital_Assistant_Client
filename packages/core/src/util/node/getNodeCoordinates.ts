/**
 * Calculates the page-relative coordinates for a DOM element.
 *
 * This function converts viewport-relative coordinates (from `getBoundingClientRect`)
 * to page-relative coordinates by adding the current scroll offsets. This is essential
 * for accurate positioning when the page is scrolled.
 *
 * @param {HTMLElement} element - The DOM element for which to calculate coordinates.
 * @param {Object} windowSize - A screen size object containing scroll information.
 *                              It is expected to have `scrollInfo.scrollTop` and `scrollInfo.scrollLeft`.
 *
 * @returns {Object} An object containing page-relative coordinate information:
 *   - top: The page-relative top position (viewport top + vertical scroll).
 *   - left: The page-relative left position (viewport left + horizontal scroll).
 *   - width: The width of the element (unchanged from the viewport measurement).
 *   - height: The height of the element (unchanged from the viewport measurement).
 *   - actualPos: The original `DOMRect` for reference.
 *
 * @example
 * const element = document.querySelector('.my-element');
 * const screenSize = getScreenSize();
 * const coords = getNodeCoordinates(element, screenSize);
 * console.log(coords.top); // Absolute position from the top of the page.
 */
export const getNodeCoordinates = (element: any, windowSize: any): any => {
    // Get viewport-relative positioning using the browser API.
    // This provides the foundation for page-relative calculations.
    const rect = typeof element?.getBoundingClientRect === 'function'
        ? element.getBoundingClientRect()
        : ({ top: 0, left: 0, width: 0, height: 0 } as any);

    // Determine scroll offsets defensively to support different data shapes, especially in tests.
    const scrollTop = (windowSize?.scrollInfo?.scrollTop
        ?? windowSize?.scrollY
        ?? (typeof window !== 'undefined' ? window.scrollY : 0)) || 0;
    const scrollLeft = (windowSize?.scrollInfo?.scrollLeft
        ?? windowSize?.scrollX
        ?? (typeof window !== 'undefined' ? window.scrollX : 0)) || 0;

    // Calculate page-relative coordinates by adding the scroll offsets.
    // This converts the viewport position to an absolute page position.
    const result = {
        // Page-relative top: viewport top + amount scrolled vertically.
        top: (rect.top || 0) + scrollTop,

        // Element dimensions remain the same regardless of the scroll position.
        width: rect.width || 0,
        height: rect.height || 0,

        // Page-relative left: viewport left + amount scrolled horizontally.
        left: (rect.left || 0) + scrollLeft,

        // Preserve the original DOMRect for reference and debugging purposes.
        actualPos: rect
    };

    return result;
}
