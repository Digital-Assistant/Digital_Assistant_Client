// This module provides a function to get descriptive labels for a clicked input-like element.

import {getLabelsForInputElement} from "./getLabelsForInputElement";
import {getSelectedTextFromSelectBox} from "./getSelectedTextFromSelectBox";
import {getNodeLabels} from "./getNodeLabels";

/**
 * Retrieves a descriptive label for a clicked input-like element.
 * This function handles different types of elements (e.g., select, input, textarea, img)
 * and uses various strategies to find the most appropriate label.
 *
 * @param node The HTML element that was clicked.
 * @param fromDocument A boolean flag, its purpose is not fully clear from the context.
 * @param selectchange A boolean flag indicating if the event was a change event on a select element.
 * @returns A string containing the determined label, or `null` if no node is provided.
 */
export const getClickedInputLabels = (node: HTMLElement, fromDocument = false, selectchange = false) => {
  if (!node) {
    return null;
  }
  let inputLabels: any = "";
  let nodeName = node.nodeName.toLowerCase();
  let textLabels: any = [];

  try {
    // First, try to get labels using a specific function for input elements.
    inputLabels = getLabelsForInputElement(node);
    if (inputLabels) return inputLabels;
  } catch (e) {
    // Ignore errors and proceed with other strategies.
  }

  // Handle different node types with specific logic.
  switch (nodeName) {
    case "select":
      if (selectchange) {
        // If it's a change event on a select box, get the text of the selected option.
        inputLabels = getSelectedTextFromSelectBox(node);
      } else {
        // Otherwise, get labels from the surrounding context.
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
        // For inputs without a type, get labels from the context.
        textLabels = getNodeLabels(node, [], 1, true, true, true);
        if (textLabels.length > 0) {
          let labels = [];
          for (let j = 0; j < textLabels.length; j++) {
            labels.push(textLabels[j].text);
          }
          inputLabels = labels.toString();
        }
      } else {
        // For inputs with a type, the logic is the same for all types in this switch.
        switch (node?.getAttribute("type")?.toLowerCase()) {
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
      // For images, don't get labels from child nodes.
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
      // For other elements, if they have no children but have inner text, use that.
      if (!node?.children?.length && node?.innerText?.trim()?.length > 0) {
        return node?.innerText;
      }
      // Otherwise, get labels from child nodes but don't iterate up to the parent.
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
}
