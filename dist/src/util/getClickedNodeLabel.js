import { CONFIG } from "../config";
/**
 * Get added node label
 * @param data
 */
export const getClickedNodeLabel = (data) => {
    let clickedName = '';
    let nodeData = JSON.parse(data.objectdata);
    if (nodeData.meta.hasOwnProperty('displayText') && nodeData.meta.displayText !== '') {
        clickedName = ((nodeData.meta.displayText.length > CONFIG.maxStringLength) ? nodeData.meta.displayText.substr(0, CONFIG.maxStringLength) + '...' : nodeData.meta.displayText);
    }
    else {
        clickedName = ((data.clickednodename.length > CONFIG.maxStringLength) ? data.clickednodename.substr(0, CONFIG.maxStringLength) + '...' : data.clickednodename);
    }
    return clickedName;
};
//# sourceMappingURL=getClickedNodeLabel.js.map