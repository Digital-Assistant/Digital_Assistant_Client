// This module provides a function to simulate a 'mouseover' event on a DOM element.

import {UDAConsoleLogger} from "../error";

/**
 * Simulates a 'mouseover' event (hover) on a given DOM element.
 * This function creates and dispatches a `MouseEvent` to trigger any hover effects or event listeners
 * attached to the node. It handles both modern and older browser environments.
 *
 * @param node The DOM element on which to simulate the hover event.
 */
export const simulateHover = (node: any) => {
  try {
    // Ensure the node is a valid DOM element with a `dispatchEvent` method.
    if (!node || typeof node.dispatchEvent !== 'function') return;

    let event: Event | null = null;
    try {
      // Use the modern constructor for `MouseEvent` if available.
      event = new MouseEvent('mouseover', {
        view: window,
        bubbles: true,
        cancelable: true,
      });
    } catch (_) {
      // Fallback for older environments that do not support the `MouseEvent` constructor.
      try {
        // @ts-ignore
        event = document.createEvent('MouseEvent');
        // @ts-ignore
        event.initEvent('mouseover', true, true);
      } catch (_) {
        // If event creation fails, set the event to null.
        event = null;
      }
    }

    // If the event could not be created, do nothing.
    if (!event) return;

    // Dispatch the event and check if it was canceled by an event handler.
    const canceled = !node.dispatchEvent(event);
    if (canceled) {
      UDAConsoleLogger.info('hover cancelled');
    } else {
      UDAConsoleLogger.info('hover not cancelled');
    }
  } catch (_) {
    // Swallow any errors to ensure resilience in both production and test environments.
  }
}
