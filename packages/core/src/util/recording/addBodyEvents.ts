import {addClickToNode} from "./addClickToNode";
import {isClickableNode} from "../node/isClickableNode";

/**
 * Attaches click events to relevant elements within the document body.
 * This function iterates through all descendant elements of the `document.body`
 * and, for each element determined to be clickable, attaches a click event listener.
 */
export const addBodyEvents = async () => {
  // Select all descendant elements of the document body.
  let els: any = document.body.querySelectorAll("*"),
      len = els?.length,
      i = 0;

  console.log(window.UDAClickObjects); // Log existing click objects for debugging.
  console.log(els); // Log all selected elements for debugging.

  // Iterate through each selected element.
  for (; i < len; i++) {
    try {
      // Check if the current element is considered clickable based on predefined criteria.
      if (els[i] && isClickableNode(els[i])) {
        // If clickable, attach a click event listener to it.
        addClickToNode(els[i]);
      }
    } catch (e) {
      // Catch and ignore any errors that occur during event attachment for a specific element.
    }
  }
};
