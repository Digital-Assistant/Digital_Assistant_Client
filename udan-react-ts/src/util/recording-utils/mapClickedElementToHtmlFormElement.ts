import fetchHtmlFormElements from "./fetchHtmlFormElements";


const mapClickedElementToHtmlFormElement = (node) => {
    console.log("Line 2760 Inside mapClickedElementToHtmlFormElement", node)
    let htmlFormElements = fetchHtmlFormElements();
    let selectedFormElement: any = {inputElement: 'others', inputType: 'others', displayName: 'Other HTML Element', systemTag: ''};
    for(let htmlFormElement of htmlFormElements) {
        if(Array.isArray(htmlFormElement.inputElement) && htmlFormElement.inputElement.indexOf(node.nodeName.toLowerCase()) != -1){
            if(Array.isArray(htmlFormElement.inputType) && node.hasAttribute('type') && htmlFormElement.inputType.indexOf(node.getAttribute('type')) !== -1){
                selectedFormElement = htmlFormElement;
            } else if (!Array.isArray(htmlFormElement.inputType) && htmlFormElement.inputElement.indexOf(node.nodeName.toLowerCase()) != -1) {
                selectedFormElement = htmlFormElement;
            }
        } else if(htmlFormElement.inputElement === 'input') {
            if(Array.isArray(htmlFormElement.inputType) && node.hasAttribute('type') && htmlFormElement.inputType.indexOf(node.getAttribute('type')) !== -1){
                selectedFormElement = htmlFormElement;
            } else if (!Array.isArray(htmlFormElement.inputType) && htmlFormElement.inputElement === node.nodeName.toLowerCase() && node.hasAttribute('type') && node.getAttribute('type') === htmlFormElement.inputType) {
                selectedFormElement = htmlFormElement;
            }
        } else if (htmlFormElement.inputElement === node.nodeName.toLowerCase()) {
            selectedFormElement = htmlFormElement;
        }
    }
    return selectedFormElement;
}

export default mapClickedElementToHtmlFormElement