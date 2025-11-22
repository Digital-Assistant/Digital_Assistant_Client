// This module is responsible for matching the action of a recorded node with a live DOM element
// and then invoking the appropriate action, such as clicking, focusing, or displaying a tooltip.

import {mapSelectedElementAction} from "./mapSelectedElementAction";
import {invokeNextNode} from "./invokeNextNode";
import {getSelectedRecordFromStore} from "./invokeNode";
import {checkNodeValues, nodeConfig, simulateHover, simulateMouseLeave} from "../node";
import {translate} from "../translate";
import {addToolTip, removeToolTip } from "../notification";
import {inArray} from "../inArray";
import {CONFIG} from "../../config";

/**
 * Matches the action of a recorded node to a live DOM element and performs the corresponding action.
 * This function handles various element types and their specific interactions during playback,
 * such as displaying tooltips, clicking, or focusing elements.
 *
 * @param node The live DOM element that matches the recorded node.
 * @param selectedNode The recorded node object, containing its original data and metadata.
 * @param toolTipVisibleTIme The time (in seconds) for which the tooltip should be visible.
 */
export const matchAction = (node: any, selectedNode: any, toolTipVisibleTIme: number = 1) => {

  if (!node) {
    return;
  }

  const recordedNodeData = JSON.parse(selectedNode.objectdata);

  let timeToInvoke = toolTipVisibleTIme * 1000; // Convert seconds to milliseconds.

  // Remove any existing tooltips before proceeding with the current action.
  removeToolTip();

  // Simulate hover and mouse leave events on the node.
  simulateHover(node);
  simulateMouseLeave(node);

  // Retrieve the selected recording details from storage.
  const navigationData = getSelectedRecordFromStore();

  // If node type selection is enabled, attempt to map and perform a specific action.
  if(window.UDAGlobalConfig.enableNodeTypeSelection) {
    if (recordedNodeData.meta && recordedNodeData.meta.hasOwnProperty('selectedElement') && recordedNodeData.meta.selectedElement && recordedNodeData.meta.selectedElement.systemTag.trim() != 'others') {
      let performedAction = mapSelectedElementAction(node, selectedNode, navigationData, recordedNodeData, timeToInvoke);
      if (performedAction) {
        return; // If an action was performed, exit the function.
      }
    }
  }

  // Special handling for text editor elements: display a tooltip.
  if(checkNodeValues(node, 'textEditors')){
    addToolTip(node, node, selectedNode, navigationData, false, false, false);
    return;
  }

  // Special handling for dropdown elements: display a tooltip.
  if(checkNodeValues(node, 'dropDowns')){
    addToolTip(node, node, selectedNode, navigationData, false, false, false);
    return;
  }

  // Special handling for date picker elements: display a tooltip.
  if(checkNodeValues(node, 'datePicker')){
    addToolTip(node, node, selectedNode, navigationData, false, false, false);
    return;
  }

  // If the node is in the list of nodes to ignore from indexing, display a tooltip.
  if (inArray(node.nodeName.toLowerCase(), nodeConfig.ignoreNodesFromIndexing) !== -1) {
    addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, false);
    return;
  }

  // Handle actions based on the node's tag name.
  switch (node.nodeName.toLowerCase()) {
    case "input":
      // Specific handling for input elements based on their class names, roles, or types.
      if (node.classList && (node.classList.contains('select2-search__field') || node.classList.contains('mat-autocomplete-trigger'))) {
        addToolTip(node, node.parentNode.parentNode.parentNode.parentNode.parentNode, selectedNode, navigationData, false, true);
      } else if (node.hasAttribute('role') && (node.getAttribute('role') === 'combobox')) {
        addToolTip(node, node.parentNode.parentNode.parentNode.parentNode, selectedNode, navigationData, false, false, true);
      } else if (node.hasAttribute('type') && (node.getAttribute('type') === 'checkbox' || node.getAttribute('type') === 'radio') && node.classList && (node.classList.contains('mat-checkbox-input') || node.classList.contains('mat-radio-input'))) {
        addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, false, false, true);
      } else if (node.hasAttribute('type')) {
        switch (node.getAttribute('type').toLowerCase()) {
          case 'checkbox':
            addToolTip(node, node.parentNode.classList.contains('vc_checkbox') ? node.parentNode : node.parentNode, selectedNode, navigationData, false, false, true);
            break;
          case 'radio':
            addToolTip(node, node.parentNode.classList.contains('vc_label') ? node.parentNode : node.parentNode, selectedNode, navigationData, false, false, true);
            break;
          case 'submit':
            addToolTip(node, node, selectedNode, navigationData, false, false, false, translate('highLightText'), false, true);
            invokeNextNode(node, timeToInvoke); // Invoke the next node after a delay.
            break;
          case 'text':
            if (node.attributes && node.attributes.length > 0 && (node.hasAttribute('ngxdaterangepickermd'))) {
              addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, false);
            } else if (node.attributes && node.attributes.length > 0 && (node.hasAttribute('uib-datepicker-popup'))) {
              addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, true, false);
            } else {
              addToolTip(node, node, selectedNode, navigationData, false, true, true);
            }
            break;
          case 'date':
            addToolTip(node, node, selectedNode, navigationData, false, false, false);
            break;
          default:
            addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
            break;
        }
      } else {
        addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
      }
      break;
    case "textarea":
      CONFIG.playNextAction = false; // Prevent immediate next action.
      addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
      break;
    case "select":
      addToolTip(node, node, selectedNode, navigationData, false, false, true);
      break;
    case "option":
      addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
      break;
    case "checkbox": // This case seems redundant as checkboxes are handled under input type.
      addToolTip(node, node, selectedNode, navigationData, false, false, true);
      break;
    case "button":
      // Additional processing for calendar selection or other button types.
      if (node.hasAttribute('aria-label') && node.getAttribute('aria-label').toLowerCase() === 'open calendar') {
        addToolTip(node, node.parentNode, selectedNode, navigationData, true, false);
      } else if (node.classList && node.classList.contains('btn-pill')) {
        addToolTip(node, node, selectedNode, navigationData, false, false, false, translate('highLightText'), false, true);
        invokeNextNode(node, timeToInvoke);
      } else {
        addToolTip(node, node, selectedNode, navigationData, false, false, false, translate('highLightText'), false, true);
        invokeNextNode(node, timeToInvoke);
      }
      break;
    case 'span':
      // Specific handling for span elements, especially those acting as interactive components.
      if (node.classList && node.classList.contains('select2-selection')) {
        addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, true, false);
      } else if (node.classList.contains("radio") && node.classList.contains("replacement")) {
        addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, false, false, true);
      } else {
        addToolTip(node, node, selectedNode, navigationData, false, false, false, translate('highLightText'), false, true);
        invokeNextNode(node, timeToInvoke);
      }
      break;
    case 'ckeditor': // Fix for text editor during playback.
      addToolTip(node, node, selectedNode, navigationData, true, false);
      break;
    case 'ng-select':
      addToolTip(node, node, selectedNode, navigationData, false, false);
      break;
    default:
      // Default handling for other node types.
      let specialInputNode = false;
      if (node.classList) {
        classListLoop:
        for (let val of node.classList) {
          if (inArray(val, nodeConfig.specialInputClickClassNames) !== -1) {
            specialInputNode = true;
            break classListLoop;
          }
        }
      }

      if (specialInputNode) {
        addToolTip(node, node, selectedNode, navigationData, true, false);
      } else {
        addToolTip(node, node, selectedNode, navigationData, false, false, false, translate('highLightText'), false, true);
      }
      invokeNextNode(node, timeToInvoke); // Invoke the next node after a delay.
      break;
  }
}
