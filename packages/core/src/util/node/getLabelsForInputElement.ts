import {getDirectInnerText} from "./getDirectInnerText";


export const getLabelsForInputElement = (element: any) => {
    let labels: any = [],
        id = element.id, name = element.name,
        elements: any = [];

    if (id) elements = document.querySelector("label[for='" + id + "']");
    if (name && !element) elements = document.querySelector("label[for='" + name + "']");

    if (elements) {
        labels = getDirectInnerText(elements);
        if (labels) return labels?.trim();
    }

    while ((element = element.parentNode)) {
        if (element?.tagName?.toLowerCase() == "label") {
            labels.push(element?.innerText());
        }
    }
    return labels?.trim();
};