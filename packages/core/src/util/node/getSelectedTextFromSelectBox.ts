/**
 * Retrieves the text of the selected option from a <select> element.
 * This function safely accesses the `options` and `selectedIndex` properties of the given node
 * to get the text of the currently selected option.
 *
 * @param node The <select> element from which to get the selected text.
 * @returns The text of the selected option, or `undefined` if an error occurs or the properties are not found.
 */
export const getSelectedTextFromSelectBox = (node: any) => {
    try {
        // Access the `options` collection of the <select> element,
        // then get the option at the `selectedIndex`, and return its `text` property.
        return node?.options?.[node?.selectedIndex].text;
    } catch (e) {
        // If any error occurs during property access (e.g., if the node is not a <select> element),
        // the error is caught, and the function returns `undefined`.
    }
}
