//perform action based on selected node type
import { addToolTip } from "./addToolTip";
import { invokeNextNode } from "./invokeNextNode";
import { translate } from "./translation";
/**
 * Maps the selected element action based on the recorded node data.
 *
 * @param {HTMLElement} node - The HTML element representing the selected node.
 * @param {RecordedNode} recordedNode - The recorded node.
 * @param {NavigationCookieData} navigationCookieData - The navigation cookie data.
 * @param {RecordedNodeData} recordedNodeData - The recorded node data.
 * @param {number} timeToInvoke - The time to invoke the next node.
 * @returns {boolean} - Returns true if the action was performed, false otherwise.
 */
export const mapSelectedElementAction = (node, recordedNode, navigationCookieData, recordedNodeData, timeToInvoke) => {
    // addToolTip(node, node.parentNode, selectednode, navigationcookiedata, false, false, false);
    let performedAction = false;
    switch (recordedNodeData.meta.selectedElement.systemTag) {
        case 'text':
        case 'date':
        case 'range':
        case 'file':
        case 'telephone':
        case 'email':
        case 'number':
        case 'password':
            addToolTip(node, node, recordedNode, navigationCookieData, false, true, true);
            performedAction = true;
            break;
        case 'singleChoice':
            addToolTip(node, node, recordedNode, navigationCookieData, false, false, true);
            performedAction = true;
            break;
        case 'multipleChoice':
            addToolTip(node, node.parentNode, recordedNode, navigationCookieData, false, false, true);
            performedAction = true;
            break;
        case 'button':
            addToolTip(node, node, recordedNode, navigationCookieData, false, false, false, translate('highLightText'), false, true);
            // node.click();
            invokeNextNode(node, timeToInvoke);
            // showselectedrow(navigationCookieData.data, navigationCookieData.data.id, true, navigationCookieData);
            performedAction = true;
            break;
        case "dropDown":
            addToolTip(node, node, recordedNode, navigationCookieData, false, false, true);
            performedAction = true;
            break;
        case "textArea":
            addToolTip(node, node.parentNode, recordedNode, navigationCookieData, false, false, true);
            performedAction = true;
            break;
        case "highlight":
            addToolTip(node, node, recordedNode, navigationCookieData, false, false, true);
            performedAction = true;
            break;
    }
    return performedAction;
};
//# sourceMappingURL=mapSelectedElementAction.js.map