import fetchHtmlFormElements from "./fetchHtmlFormElements";

/**
 * Maps a clicked DOM element to a predefined HTML form element type based on its tag name and input type.
 * This function iterates through a list of known HTML form element configurations to categorize the clicked node.
 *
 * @param node The clicked DOM element.
 * @returns An object representing the matched HTML form element, or a default 'others' type if no match is found.
 */
export const mapClickedElementToHtmlFormElement = (node: any) => {
    // Fetch the predefined list of HTML form elements.
    let htmlFormElements = fetchHtmlFormElements();
    // Initialize with a default 'others' type.
    let selectedFormElement: any = {inputElement: 'others', inputType: 'others', displayName: 'Other HTML Element', systemTag: 'others'};

    // Iterate through each configured HTML form element.
    for(let htmlFormElement of htmlFormElements) {
        // Case 1: The configured `inputElement` is an array (e.g., ["select", "option"]).
        if(Array.isArray(htmlFormElement.inputElement) && htmlFormElement.inputElement.indexOf(node.nodeName.toLowerCase()) != -1){
            // If the configured `inputType` is also an array and the node has a 'type' attribute that matches.
            if(Array.isArray(htmlFormElement.inputType) && node.hasAttribute('type') && htmlFormElement.inputType.indexOf(node.getAttribute('type')) !== -1){
                selectedFormElement = htmlFormElement;
            }
            // If the configured `inputType` is not an array, but the `inputElement` matches.
            else if (!Array.isArray(htmlFormElement.inputType) && htmlFormElement.inputElement.indexOf(node.nodeName.toLowerCase()) != -1) {
                selectedFormElement = htmlFormElement;
            }
        }
        // Case 2: The configured `inputElement` is 'input'.
        else if(htmlFormElement.inputElement === 'input') {
            // If the configured `inputType` is an array and the node has a 'type' attribute that matches.
            if(Array.isArray(htmlFormElement.inputType) && node.hasAttribute('type') && htmlFormElement.inputType.indexOf(node.getAttribute('type')) !== -1){
                selectedFormElement = htmlFormElement;
            }
            // If the configured `inputType` is a single value and the node's 'type' attribute matches.
            else if (!Array.isArray(htmlFormElement.inputType) && htmlFormElement.inputElement === node.nodeName.toLowerCase() && node.hasAttribute('type') && node.getAttribute('type') === htmlFormElement.inputType) {
                selectedFormElement = htmlFormElement;
            }
        }
        // Case 3: The configured `inputElement` is a single string and matches the node's tag name.
        else if (htmlFormElement.inputElement === node.nodeName.toLowerCase()) {
            selectedFormElement = htmlFormElement;
        }
    }
    return selectedFormElement;
}

// Export as default for compatibility with older import syntaxes.
export default mapClickedElementToHtmlFormElement;
