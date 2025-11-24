import {addEvent} from "./addEvent";
import {UDAErrorLogger} from "../error/error-log";

/**
 * Attaches a click event listener to a given DOM node if it's not already excluded or processed.
 * This function handles different types of HTML elements and ensures that a click event
 * is recorded for interactive elements.
 *
 * @param node The DOM node to which the click event listener should be added.
 * @returns The node after potentially adding the click event, or `undefined` if the node is excluded.
 */
export const addClickToNode = (node: any) => {
  try {
    // If the node has the 'uda_exclude' class, it should not be tracked.
    if (node.classList && node.classList.contains('uda_exclude')) {
      return;
    }

    // If the node has already had a click record added, skip it to prevent duplicates.
    if (node.hasOwnProperty("addedClickRecord") && node.addedClickRecord === true) {
      return;
    }

    let clickableNode = node; // The node to which the event will be added.
    let recordNode = node; // The node whose data will be recorded (often the same as clickableNode).

    const nodeName = clickableNode.nodeName.toLowerCase();

    // Special fix for 'select2' library elements: attach a 'focus' event instead of 'click'.
    if(node.classList && node.classList.contains('select2-selection')){
      addEvent(node, 'focus');
      node.addedClickRecord = true;
      return ;
    }

    // Determine the event type to attach based on the node's tag name or input type.
    switch (nodeName) {
      case "a":
        addEvent(clickableNode, 'click');
        break;
      case "select":
        addEvent(clickableNode, 'click');
        break;
      case "input":
        // If an input element has no 'type' attribute, treat it as a generic input.
        if (!clickableNode.hasAttribute("type")) {
          addEvent(clickableNode, 'click');
          clickableNode.addedClickRecord = true;
          return node;
        }
        const inputType = clickableNode.getAttribute("type").toLowerCase();
        switch (inputType) {
          case "email":
          case "text":
          case "button":
          case "color":
          case "date":
          case "datetime-local":
          case "file":
          case "hidden":
          case "image":
          case "month":
          case "number":
          case "password":
          case "range":
          case "reset":
          case "search":
          case "submit":
          case "tel":
          case "time":
          case "url":
          case "textarea": // Although textarea is a separate tag, it's handled here for input types.
          case "week":
            addEvent(clickableNode, 'click');
            break;
          case "checkbox":
          case "radio":
            addEvent(clickableNode, 'click');
            break;
          default:
            addEvent(clickableNode, 'click');
            break;
        }
        break;
      case "mat-select": // Custom element for Material Design select.
      case "textarea":
      case "button":
      case "tr": // Table row elements might be clickable.
        addEvent(clickableNode, 'click');
        break;
      default:
        // For any other element, attach a generic click event.
        addEvent(clickableNode, 'click');
        break;
    }
    // Mark the node as having had a click record added to prevent re-processing.
    clickableNode.addedClickRecord = true;
    return node;
  } catch (e) {
    // Log any errors that occur during the process of adding a click event.
    UDAErrorLogger.error(
        "Unable to add click to node " + node.outerHTML + " ", e
    );
  }
};
