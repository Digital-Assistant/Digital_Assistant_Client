// This module provides a function to simulate a 'mouseout' event on a DOM element.

import {UDAConsoleLogger} from "../error";

/**
 * Simulates a 'mouseout' (mouse leave) event on a given DOM element.
 * This function creates and dispatches a `MouseEvent` to trigger any `mouseout` event listeners
 * attached to the node.
 *
 * @param node The DOM element on which to simulate the mouse leave event.
 */
export const simulateMouseLeave = (node: any) => {
  // Create a new 'mouseout' event.
  const event = new MouseEvent('mouseout', {
    'view': window,
    'bubbles': true,
    'cancelable': true
  });

  // Dispatch the event on the node and check if `preventDefault` was called by any handler.
  const canceled = !node.dispatchEvent(event);

  // Log whether the event was canceled or not.
  if (canceled) {
    // A handler called `preventDefault`.
    UDAConsoleLogger.info('mouseleave cancelled');
  } else {
    // None of the handlers called `preventDefault`.
    UDAConsoleLogger.info('mouseleave not cancelled');
  }
}
