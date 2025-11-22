// This module provides a set of utility functions for DOM event handling.
// These functions simplify adding, removing, and triggering custom events on the `document` object.

/**
 * Attaches an event listener to the document.
 * @param eventType The type of event to listen for (e.g., 'click').
 * @param listener The function to be called when the event is triggered.
 */
export const on = (eventType: any, listener: any) => {
  document.addEventListener(eventType, listener);
}

/**
 * Removes an event listener from the document.
 * @param eventType The type of event to remove the listener for.
 * @param listener The listener function to be removed.
 */
export const off = (eventType: any, listener: any) => {
  document.removeEventListener(eventType, listener);
}

/**
 * Attaches an event listener that will be executed only once.
 * After the listener is called, it is automatically removed.
 * @param eventType The type of event to listen for.
 * @param listener The function to be called once when the event is triggered.
 */
export const once = (eventType: any, listener: any) => {
  // Define a handler that will be removed after execution.
  const handleEventOnce = (event: any) => {
    // Call the original listener.
    listener(event);
    // Remove the event listener so it doesn't fire again.
    off(eventType, handleEventOnce);
  }
  // Attach the single-use event handler.
  on(eventType, handleEventOnce);
}

/**
 * Triggers a custom event on the document.
 * @param eventType The name of the custom event to trigger.
 * @param data The data to be passed with the event.
 */
export const trigger = (eventType: any, data: any) => {
  // Create a new CustomEvent with the specified type and data.
  const event = new CustomEvent(eventType, data);
  // Dispatch the event on the document.
  document.dispatchEvent(event);
}
