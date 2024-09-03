//getting input label for the clicked node
import { getLabelsForInputElement, getNodeLabels, getSelectedTextFromSelectBox } from "./index";
export const getClickedInputLabels = (node, fromDocument = false, selectchange = false) => {
    var _a, _b, _c, _d;
    if (!node) {
        return null;
    }
    let inputLabels = "";
    let nodeName = node.nodeName.toLowerCase();
    let textLabels = [];
    try {
        inputLabels = getLabelsForInputElement(node);
        if (inputLabels)
            return inputLabels;
    }
    catch (e) {
    }
    switch (nodeName) {
        case "select":
            if (selectchange) {
                inputLabels = getSelectedTextFromSelectBox(node);
            }
            else {
                textLabels = getNodeLabels(node, [], 1, true, false, true);
                if (textLabels.length > 0) {
                    let labels = [];
                    for (let j = 0; j < textLabels.length; j++) {
                        labels.push(textLabels[j].text);
                    }
                    inputLabels = labels.toString();
                }
            }
            break;
        case "input":
            if (!node.hasAttribute("type")) {
                textLabels = getNodeLabels(node, [], 1, true, true, true);
                if (textLabels.length > 0) {
                    let labels = [];
                    for (let j = 0; j < textLabels.length; j++) {
                        labels.push(textLabels[j].text);
                    }
                    inputLabels = labels.toString();
                }
            }
            else {
                switch ((_a = node === null || node === void 0 ? void 0 : node.getAttribute("type")) === null || _a === void 0 ? void 0 : _a.toLowerCase()) {
                    default:
                        textLabels = getNodeLabels(node, [], 1, true, true, true);
                        if (textLabels.length > 0) {
                            let labels = [];
                            for (let j = 0; j < textLabels.length; j++) {
                                labels.push(textLabels[j].text);
                            }
                            inputLabels = labels.toString();
                        }
                }
                break;
            }
            break;
        case "textarea":
            textLabels = getNodeLabels(node, [], 1, true, true, true);
            if (textLabels.length > 0) {
                let labels = [];
                for (let j = 0; j < textLabels.length; j++) {
                    labels.push(textLabels[j].text);
                }
                inputLabels = labels.toString();
            }
            break;
        case "img":
            textLabels = getNodeLabels(node, [], 1, true, false, true);
            if (textLabels.length > 0) {
                let labels = [];
                for (let j = 0; j < textLabels.length; j++) {
                    labels.push(textLabels[j].text);
                }
                inputLabels = labels.toString();
            }
            break;
        default:
            if (!((_b = node === null || node === void 0 ? void 0 : node.children) === null || _b === void 0 ? void 0 : _b.length) && ((_d = (_c = node === null || node === void 0 ? void 0 : node.innerText) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.length) > 0) {
                return node === null || node === void 0 ? void 0 : node.innerText;
            }
            textLabels = getNodeLabels(node, [], 1, false, true, true);
            if (textLabels.length > 0) {
                let labels = [];
                for (let j = 0; j < textLabels.length; j++) {
                    labels.push(textLabels[j].text);
                }
                inputLabels = labels.toString();
            }
    }
    return inputLabels;
};
