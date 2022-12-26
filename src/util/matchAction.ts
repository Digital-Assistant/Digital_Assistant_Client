//matching the action of the node and invoking whether to click or focus
import {CONFIG} from "../config";
import {inArray} from "./index";
import {simulateHover} from "./simulateHover";
import {mapSelectedElementAction} from "./mapSelectedElementAction";
import {addToolTip, removeToolTip} from "./addToolTip";
import {invokeNextNode} from "./invokeNextNode";
import {getSelectedRecordFromStore} from "./invokeNode";
import {checkNodeValues} from "./checkNodeValues";

export const matchAction = (node, selectedNode) => {

  if (!node) {
    return;
  }

  let timeToInvoke = CONFIG.invokeTime;

  /*if (!CONFIG.playNextAction) {
    return;
  }*/

  // remove added tooltips before invoking
  removeToolTip();

  simulateHover(node);

  const navigationData = getSelectedRecordFromStore();

  // perform click action based on the input given
  const recordedNodeData = selectedNode.objectdata;
  if (recordedNodeData.meta && recordedNodeData.meta.hasOwnProperty('selectedElement') && recordedNodeData.meta.selectedElement && recordedNodeData.meta.selectedElement.systemTag.trim() != 'others') {
    let performedAction = mapSelectedElementAction(node, selectedNode, navigationData, recordedNodeData);
    if (performedAction) {
      return;
    }
  }

  // adding tooltip to text editor elements
  if(checkNodeValues(node, 'textEditors')){
    addToolTip(node, node, selectedNode, navigationData, false, false, false);
    invokeNextNode(node, timeToInvoke);
    return;
  }

  // adding tooltip to drop down elements
  if(checkNodeValues(node, 'dropDowns')){
    addToolTip(node, node, selectedNode, navigationData, false, false, false);
    invokeNextNode(node, timeToInvoke);
    return;
  }

  // adding tooltip to Date selector elements
  if(checkNodeValues(node, 'datePicker')){
    addToolTip(node, node, selectedNode, navigationData, false, false, false);
    invokeNextNode(node, timeToInvoke);
    return;
  }


  if (inArray(node.nodeName.toLowerCase(), CONFIG.ignoreNodesFromIndexing) !== -1) {
    addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, false);
    invokeNextNode(node, timeToInvoke);
    return;
  }

  switch (node.nodeName.toLowerCase()) {
    case "input":
      // functionality for detecting multi select box and highlighting the recorded node
      if (node.classList && (node.classList.contains('select2-search__field') || node.classList.contains('mat-autocomplete-trigger'))) {
        addToolTip(node, node.parentNode.parentNode.parentNode.parentNode.parentNode, selectedNode, navigationData, false, true);
      } else if (node.hasAttribute('role') && (node.getAttribute('role') === 'combobox')) {
        addToolTip(node, node.parentNode.parentNode.parentNode.parentNode, selectedNode, navigationData, false, false, true);
      } else if (node.hasAttribute('type') && (node.getAttribute('type') === 'checkbox' || node.getAttribute('type') === 'radio') && node.classList && (node.classList.contains('mat-checkbox-input') || node.classList.contains('mat-radio-input'))) {
        addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, false, false, true);
      } else if (node.hasAttribute('type')) {
        switch (node.getAttribute('type').toLowerCase()) {
          case 'checkbox':
            if (node.parentNode && node.parentNode.classList && node.parentNode.classList.contains('vc_checkbox')) {
              addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
            } else {
              addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
            }
            break;
          case 'radio':
            if (node.parentNode && node.parentNode.classList && node.parentNode.classList.contains('vc_label')) {
              addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
            } else {
              addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
            }
            break;
          case 'submit':
            node.click();
            invokeNextNode(node, timeToInvoke);
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
      CONFIG.playNextAction = false;
      addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
      break;
    case "select":
      addToolTip(node, node, selectedNode, navigationData, false, false, true);
      break;
    case "option":
      addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
      break;
    case "checkbox":
      addToolTip(node, node, selectedNode, navigationData, false, false, true);
      break;
      // Additional processing for calendar selection
    case "button":
      if (node.hasAttribute('aria-label') && node.getAttribute('aria-label').toLowerCase() === 'open calendar') {
        addToolTip(node, node.parentNode, selectedNode, navigationData, true, false);
      } else if (node.classList && node.classList.contains('btn-pill')) {
        node.click();
        invokeNextNode(node, timeToInvoke);
      } else {
        node.click();
        invokeNextNode(node, timeToInvoke);
      }
      break;
    case 'span':
      if (node.classList && node.classList.contains('select2-selection')) {
        addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, true, false);
      } else if (node.classList.contains("radio") && node.classList.contains("replacement")) {
        addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, false, false, true);
      } else {
        node.click();
        invokeNextNode(node, timeToInvoke);
      }
      break;
    /*case 'div':
      if (node.classList && (node.classList.contains('mat-form-field-flex') || node.classList.contains('mat-select-trigger'))) {
        addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, true, false);
      } else {
        node.click();
        invokeNextNode(node, timeToInvoke);
      }
      break;*/
      //	fix for text editor during playback
    case 'ckeditor':
      addToolTip(node, node, selectedNode, navigationData, true, false);
      break;
    case 'ng-select':
      addToolTip(node, node, selectedNode, navigationData, false, false);
      break;
    default:

      // check for special input nodes and add tooltip
      let specialInputNode = false;
      if (node.classList) {
        classListLoop:
        for (let val of node.classList) {
          if (inArray(val, CONFIG.specialInputClickClassNames) !== -1) {
            specialInputNode = true;
            break classListLoop;
          }
        }
      }

      if (specialInputNode) {
        addToolTip(node, node, selectedNode, navigationData, true, false);
      } else {
        node.click();
      }
      invokeNextNode(node, timeToInvoke);
      break;
  }
}
