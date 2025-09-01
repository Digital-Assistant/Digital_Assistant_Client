/**
 * Validates whether a node object contains valid screen size information
 *
 * This utility function performs comprehensive validation of screen size data
 * to ensure the node contains properly structured dimension information with
 * valid positive width and height values for the page viewport.
 *
 * @param {any} node - The node object to validate for screen size information.
 *                     Expected to contain a nested screenSize.page structure
 *                     with width and height properties.
 *
 * @returns {boolean} Returns true if the node contains valid screen size data
 *                    with positive width and height values, false otherwise.
 *
 * @example
 * // Valid screen size data
 * const validNode = {
 *   screenSize: {
 *     page: { width: 1920, height: 1080 }
 *   }
 * };
 * hasValidScreenSize(validNode); // returns true
 *
 * @example
 * // Invalid screen size data
 * const invalidNode = {
 *   screenSize: {
 *     page: { width: 0, height: -100 }
 *   }
 * };
 * hasValidScreenSize(invalidNode); // returns false
 */
export const hasValidScreenInfo = (node) => {
    return node && // First validation: Ensure node exists and is not null/undefined
        node.hasOwnProperty('screenSize') && // Second validation: Verify screenSize property exists on the node object
        node.screenSize && // Third validation: Ensure screenSize property is truthy (not null, undefined, or empty)
        node.screenSize.page && // Fourth validation: Verify the nested page object exists within screenSize
        node.screenSize.page.width > 0 && // Fifth validation: Ensure width is a positive number (greater than 0)
        node.screenSize.page.height > 0; // Sixth validation: Ensure height is a positive number (greater than 0)
}
