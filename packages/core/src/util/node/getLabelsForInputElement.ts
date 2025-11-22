import {getDirectInnerText} from "./getDirectInnerText";

/**
 * Finds the descriptive labels associated with an input element.
 * This function uses two main strategies to find labels:
 * 1. It looks for `<label>` elements that have a `for` attribute matching the `id` or `name` of the input element.
 * 2. It traverses up the DOM tree from the input element to find a parent `<label>` element.
 *
 * @param element The input element for which to find labels.
 * @returns The text of the found label, trimmed of whitespace. If multiple labels are found, their text is concatenated.
 */
export const getLabelsForInputElement = (element: any) => {
    let labels: any = [],
        id = element.id,
        name = element.name,
        elements: any = [];

    // Strategy 1: Find associated <label> elements using the 'for' attribute.
    if (id) {
        elements = document.querySelector("label[for='" + id + "']");
    }
    if (name && !elements) {
        // Only search by name if no element was found by ID.
        elements = document.querySelector("label[for='" + name + "']");
    }

    if (elements) {
        labels = getDirectInnerText(elements);
        if (labels) return labels?.trim();
    }

    // Strategy 2: Traverse up the DOM to find a parent <label> element.
    while ((element = element.parentNode)) {
        if (element?.tagName?.toLowerCase() == "label") {
            // If a parent <label> is found, get its inner text.
            labels.push(element?.innerText());
        }
    }
    // Return the found labels, trimmed.
    return labels?.trim();
};
