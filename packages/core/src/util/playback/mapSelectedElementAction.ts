// This module defines how actions are performed during playback based on the type of the selected element.

import {addToolTip} from "../notification";
import {invokeNextNode} from "./invokeNextNode";
import {translate} from "../translate";

/**
 * Maps the selected element's system tag to a specific action during playback.
 * This function determines whether to display a tooltip, invoke a click, or focus on an element
 * based on the type of the recorded interactive element.
 *
 * @param node The live HTML element corresponding to the recorded node.
 * @param recordedNode The raw recorded node object.
 * @param navigationCookieData The navigation cookie data, if available.
 * @param recordedNodeData The parsed recorded node data, including metadata about the selected element.
 * @param timeToInvoke The delay (in milliseconds) before invoking the next node or action.
 * @returns `true` if an action was performed, `false` otherwise.
 */
export const mapSelectedElementAction = (node: any, recordedNode: any, navigationCookieData: any, recordedNodeData: any, timeToInvoke: any) => {
  let performedAction = false;
  // Use a switch statement to handle different system tags of the selected element.
  switch (recordedNodeData?.meta?.selectedElement?.systemTag) {
    case 'text':
    case 'date':
    case 'range':
    case 'file':
    case 'telephone':
    case 'email':
    case 'number':
    case 'password':
      // For input-like elements, display a tooltip and potentially focus on the element.
      addToolTip(node, node, recordedNode, navigationCookieData, false, true, true);
      performedAction = true;
      break;
    case 'singleChoice':
      // For single-choice elements (e.g., radio buttons), display a tooltip.
      addToolTip(node, node, recordedNode, navigationCookieData, false, false, true);
      performedAction = true;
      break;
    case 'multipleChoice':
      // For multiple-choice elements (e.g., checkboxes), display a tooltip.
      addToolTip(node, node.parentNode, recordedNode, navigationCookieData, false, false, true);
      performedAction = true;
      break;
    case 'button':
      // For buttons, display a tooltip and then invoke the next node after a delay.
      addToolTip(node, node, recordedNode, navigationCookieData, false, false, false, translate('highLightText'), false, true);
      invokeNextNode(node, timeToInvoke);
      performedAction = true;
      break;
    case "dropDown":
      // For dropdowns, display a tooltip.
      addToolTip(node, node, recordedNode, navigationCookieData, false, false, true);
      performedAction = true;
      break;
    case "textArea":
      // For text areas, display a tooltip.
      addToolTip(node, node.parentNode, recordedNode, navigationCookieData, false, false, true);
      performedAction = true;
      break;
    case "highlight":
      // For highlight elements, display a tooltip.
      addToolTip(node, node, recordedNode, navigationCookieData, false, false, true);
      performedAction = true;
      break;
  }
  return performedAction;
}
