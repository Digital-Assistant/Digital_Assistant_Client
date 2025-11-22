/**
 * Calculates the absolute coordinates (x, y) of an HTML element relative to the document.
 * This function traverses up the DOM tree from the given element, accumulating the `offsetLeft` and `offsetTop`
 * of each `offsetParent` and subtracting the `scrollLeft` and `scrollTop` to get the final
 * position on the page.
 *
 * @param element The HTML element for which to calculate the absolute offsets.
 * @returns An object with `x` and `y` properties representing the absolute coordinates.
 */
export const getAbsoluteOffsets = (element: HTMLElement) => {
    let cords = {x: 0, y: 0};
    try {
        let currentElement: any = element;

        // Traverse up the DOM tree through the `offsetParent` chain.
        while (currentElement !== null) {
            // Add the element's offset relative to its `offsetParent`.
            cords.x += currentElement.offsetLeft;
            // Subtract any horizontal scroll of the parent.
            cords.x -= currentElement.scrollLeft;
            // Add the element's top offset.
            cords.y += currentElement.offsetTop;
            // Subtract any vertical scroll of the parent.
            cords.y -= currentElement.scrollTop;
            // Move up to the next `offsetParent`.
            currentElement = currentElement.offsetParent;
        }
    } catch (e) {
        // Log any errors that occur during the calculation.
        console.log(e)
    }

    return cords;
}
