import { CONFIG } from "../config";
export const removeCircularReference = (nodeData) => {
    for (let key in nodeData) {
        let ignoreAttribute = false;
        for (let ignoreText of CONFIG.ignoreDynamicAttributeText) {
            if (key.indexOf(ignoreText) !== -1) {
                ignoreAttribute = true;
            }
        }
        if (ignoreAttribute === true) {
            delete nodeData[key];
        }
        if (key === 'childNodes') {
            for (let index in nodeData[key]) {
                nodeData[key][index] = removeCircularReference(nodeData[key][index]);
            }
        }
    }
    return nodeData;
};
//# sourceMappingURL=removeCircularReference.js.map