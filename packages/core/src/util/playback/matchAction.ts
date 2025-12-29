/*
This module is responsible for matching the action of a recorded node with a live DOM element
and then invoking the appropriate action, such as clicking, focusing, or displaying a tooltip.
It serves as a core component of the playback engine, interpreting recorded user interactions
and applying them to the current web page. This involves handling a wide variety of DOM elements
and their specific behaviors, often guiding the user with tooltips.
*/

import {mapSelectedElementAction} from "./mapSelectedElementAction";
import {invokeNextNode} from "./invokeNextNode";
import {getSelectedRecordFromStore} from "./invokeNode";
import {checkNodeValues, nodeConfig, simulateHover, simulateMouseLeave} from "../node";
import {translate} from "../translate";
import {addToolTip, removeToolTip } from "../notification";
import {inArray} from "../inArray";
import {CONFIG} from "../../config";
import {matchLLMInputToNode} from "./matchLLMInputToNode";

/**
 * Matches the action of a recorded node to a live DOM element and performs the corresponding action.
 * This function handles various element types and their specific interactions during playback,
 * such as displaying tooltips, clicking, or focusing elements. It determines the correct action
 * based on the node's tag, type, and CSS classes.
 *
 * @param node The live DOM element that matches the recorded node. This is the element on the current page to interact with.
 * @param selectedNode The recorded node object from the stored navigation sequence, containing its original data and metadata.
 * @param toolTipVisibleTIme The time (in seconds) for which the instructional tooltip should be visible before proceeding. Defaults to 1 second.
 */
export const matchAction = (node: any, selectedNode: any, selectedRecordingDetails: any) => {

  let playBackDelayTime = 2;
  if(selectedRecordingDetails?.additionalParams?.slowPlaybackTime){
    playBackDelayTime = selectedRecordingDetails?.additionalParams?.slowPlaybackTime;
  }

  if (!node) {
    return;
  }

  // Parse the recorded data of the node from its JSON string format.
  const recordedNodeData = JSON.parse(selectedNode?.objectdata);

  // Convert the tooltip visibility time from seconds to milliseconds for use with setTimeout.
  let timeToInvoke: number = playBackDelayTime*1000;


  // The objectdata property is expected to be a JSON string. If it's already an object,
  // something is wrong, so we abort to prevent errors.
  if(typeof selectedNode.objectdata !== 'string'){
      return;
  }

  // Clear any tooltips that might be lingering from a previous action.
  removeToolTip();

  // Simulate hover and mouse leave events to trigger any dynamic UI elements (e.g., menus, popovers)
  // that might appear on hover, ensuring the target element is in the correct state.
  simulateHover(node);
  simulateMouseLeave(node);

  // Retrieve the complete recording data from the store for context.
  const navigationData = getSelectedRecordFromStore();

  // invoking the node based on the LLM api
  if(window.UDAGlobalConfig.enableAISearch && recordedNodeData.meta?.inputType){
    const invokedNodeFromLLM = matchLLMInputToNode(node, selectedNode, selectedRecordingDetails, timeToInvoke);
    if(invokedNodeFromLLM) {
      return;
    } else {
      // UDAErrorLogger.error('llm input processing failed');
    }
  }

  // If the "Node Type Selection" feature is enabled, try a more specific action mapping first.
  // This allows for custom handling of elements tagged with a specific systemTag.
  if(window.UDAGlobalConfig.enableNodeTypeSelection) {
    if (recordedNodeData.meta && recordedNodeData.meta.hasOwnProperty('selectedElement') && recordedNodeData.meta.selectedElement && recordedNodeData.meta.selectedElement.systemTag.trim() != 'others') {
      // Attempt to perform a mapped action based on the element's system tag.
      let performedAction = mapSelectedElementAction(node, selectedNode, navigationData, recordedNodeData, timeToInvoke);
      // If an action was successfully performed, we don't need to continue with the generic handling.
      if (performedAction) {
        return;
      }
    }
  }

  // For rich text editors, just display a tooltip with instructions.
  if(checkNodeValues(node, 'textEditors')){
    addToolTip(node, node, selectedNode, navigationData, false, false, false);
    return;
  }

  // For dropdowns, display a tooltip.
  if(checkNodeValues(node, 'dropDowns')){
    addToolTip(node, node, selectedNode, navigationData, false, false, false);
    return;
  }

  // For date pickers, display a tooltip.
  if(checkNodeValues(node, 'datePicker')){
    addToolTip(node, node, selectedNode, navigationData, false, false, false);
    return;
  }

  // If the node is a type that should be ignored (e.g., <p>, <div>), show a tooltip on its parent.
  if (inArray(node.nodeName.toLowerCase(), nodeConfig.ignoreNodesFromIndexing)) {
    addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, false);
    return;
  }

  // The main logic for handling actions based on the element's tag name.
  switch (node.nodeName.toLowerCase()) {
    case "input":
      // Handle various types of <input> elements, which can be complex.
      if (node.classList && (node.classList.contains('select2-search__field') || node.classList.contains('mat-autocomplete-trigger'))) {
        // Special handling for Select2 and Angular Material autocomplete fields.
        addToolTip(node, node.parentNode.parentNode.parentNode.parentNode.parentNode, selectedNode, navigationData, false, true);
      } else if (node.hasAttribute('role') && (node.getAttribute('role') === 'combobox')) {
        // Handle ARIA combobox roles, common in modern UI libraries.
        addToolTip(node, node.parentNode.parentNode.parentNode.parentNode, selectedNode, navigationData, false, false, true);
      } else if (node.hasAttribute('type') && (node.getAttribute('type') === 'checkbox' || node.getAttribute('type') === 'radio') && node.classList && (node.classList.contains('mat-checkbox-input') || node.classList.contains('mat-radio-input'))) {
        // Special handling for Angular Material checkboxes and radio buttons.
        addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, false, false, true);
      } else if (node.hasAttribute('type')) {
        // Handle standard HTML input types.
        switch (node.getAttribute('type').toLowerCase()) {
          case 'checkbox':
            addToolTip(node, node.parentNode.classList.contains('vc_checkbox') ? node.parentNode : node.parentNode, selectedNode, navigationData, false, false, true);
            break;
          case 'radio':
            addToolTip(node, node.parentNode.classList.contains('vc_label') ? node.parentNode : node.parentNode, selectedNode, navigationData, false, false, true);
            break;
          case 'submit':
            // For submit buttons, highlight them and automatically proceed to the next action.
            addToolTip(node, node, selectedNode, navigationData, false, false, false, translate('highLightText'), false, true);
            invokeNextNode(node, timeToInvoke); // Schedule the next action after a delay.
            break;
          case 'text':
            if (node.attributes && node.attributes.length > 0 && (node.hasAttribute('ngxdaterangepickermd'))) {
              // Handle specific date range picker libraries.
              addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, false);
            } else if (node.attributes && node.attributes.length > 0 && (node.hasAttribute('uib-datepicker-popup'))) {
              // Handle UI Bootstrap datepicker.
              addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, true, false);
            } else {
              // Default handling for text inputs.
              addToolTip(node, node, selectedNode, navigationData, false, true, true);
            }
            break;
          case 'date':
            addToolTip(node, node, selectedNode, navigationData, false, false, false);
            break;
          default:
            // Fallback for other input types.
            addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
            break;
        }
      } else {
        // Fallback for inputs without a 'type' attribute.
        addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
      }
      break;
    case "textarea":
      // For text areas, pause automatic playback to allow the user to type.
      CONFIG.playNextAction = false;
      addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
      break;
    case "select":
      addToolTip(node, node, selectedNode, navigationData, false, false, true);
      break;
    case "option":
      addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
      break;
    case "checkbox": // This case is likely redundant as it's handled under input[type="checkbox"].
      addToolTip(node, node, selectedNode, navigationData, false, false, true);
      break;
    case "button":
      if (node.hasAttribute('aria-label') && node.getAttribute('aria-label').toLowerCase() === 'open calendar') {
        // Special case for calendar buttons.
        addToolTip(node, node.parentNode, selectedNode, navigationData, true, false);
      } else if (node.classList && node.classList.contains('btn-pill')) {
        // For pill-style buttons, highlight and proceed.
        addToolTip(node, node, selectedNode, navigationData, false, false, false, translate('highLightText'), false, true);
        invokeNextNode(node, timeToInvoke);
      } else {
        // Default for other buttons: highlight and proceed.
        addToolTip(node, node, selectedNode, navigationData, false, false, false, translate('highLightText'), false, true);
        invokeNextNode(node, timeToInvoke);
      }
      break;
    case 'span':
      // Spans are often used for custom interactive elements.
      if (node.classList && node.classList.contains('select2-selection')) {
        // Handle Select2 dropdown triggers.
        addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, true, false);
      } else if (node.classList.contains("radio") && node.classList.contains("replacement")) {
        // Handle custom radio button replacements.
        addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, false, false, true);
      } else {
        // Treat as a generic clickable element: highlight and proceed.
        addToolTip(node, node, selectedNode, navigationData, false, false, false, translate('highLightText'), false, true);
        invokeNextNode(node, timeToInvoke);
      }
      break;
    case 'ckeditor': // Fix for CKEditor instances during playback.
      addToolTip(node, node, selectedNode, navigationData, true, false);
      break;
    case 'ng-select': // Handle ng-select components.
      addToolTip(node, node, selectedNode, navigationData, false, false);
      break;
    default:
      // Default handling for any other node type (e.g., <a>, <i>).
      let specialInputNode = false;
      // Check if the element has a class name indicating it's a special clickable area.
      if (node.classList) {
        classListLoop:
        for (let val of node.classList) {
          if (inArray(val, nodeConfig.specialInputClickClassNames)) {
            specialInputNode = true;
            break classListLoop;
          }
        }
      }

      if (specialInputNode) {
        addToolTip(node, node, selectedNode, navigationData, true, false);
      } else {
        // For most other elements, assume they are clickable. Highlight and proceed.
        addToolTip(node, node, selectedNode, navigationData, false, false, false, translate('highLightText'), false, true);
        // Schedule the next action after the tooltip delay.
        invokeNextNode(node, timeToInvoke);
      }
      break;
  }
}
