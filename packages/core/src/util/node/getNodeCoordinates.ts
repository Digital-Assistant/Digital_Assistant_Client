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
export const getNodeCoordinates = (element: any, windowSize: any): any => {
    // Get viewport-relative positioning using browser API
    // This provides the foundation for page-relative calculations
    const rect = typeof element?.getBoundingClientRect === 'function'
        ? element.getBoundingClientRect()
        : ({ top: 0, left: 0, width: 0, height: 0 } as any);

    // Determine scroll offsets defensively to support different shapes used in tests
    const scrollTop = (windowSize?.scrollInfo?.scrollTop
        ?? windowSize?.scrollY
        ?? (typeof window !== 'undefined' ? window.scrollY : 0)) || 0;
    const scrollLeft = (windowSize?.scrollInfo?.scrollLeft
        ?? windowSize?.scrollX
        ?? (typeof window !== 'undefined' ? window.scrollX : 0)) || 0;

    // Calculate page-relative coordinates by adding scroll offsets
    // This converts viewport position to absolute page position
    const result = {
        // Page-relative top: viewport top + amount scrolled vertically
        top: (rect.top || 0) + scrollTop,

        // Element dimensions remain the same regardless of scroll position
        width: rect.width || 0,
        height: rect.height || 0,

        // Page-relative left: viewport left + amount scrolled horizontally
        left: (rect.left || 0) + scrollLeft,

        // Preserve original DOMRect for reference and debugging
        actualPos: rect
    };

    return result;
}
