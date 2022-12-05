//perform action based on selected node type
import {addToolTip} from "./addToolTip";
import {invokeNextNode} from "./invokeNextNode";

export const mapSelectedElementAction = (node, recordedNode, navigationCookieData, recordedNodeData) => {
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
      addToolTip(node, node.parentNode, recordedNode, navigationCookieData, false, true, true);
      performedAction = true;
      break;
    case 'singleChoice':
      addToolTip(node, node.parentNode, recordedNode, navigationCookieData, false, false, true);
      performedAction = true;
      break;
    case 'multipleChoice':
      addToolTip(node, node.parentNode, recordedNode, navigationCookieData, false, false, true);
      performedAction = true;
      break;
    case 'button':
      node.click();
      invokeNextNode(node, 1000);
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
  }
  return performedAction;
}
