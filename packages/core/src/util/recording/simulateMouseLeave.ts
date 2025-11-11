/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Simulate a mouseout (mouseleave) event on a DOM node.
 * Safe to call in jsdom; logs are no-ops.
 *
 * @param node - The target element to dispatch the mouseout event to
 */
export const simulateMouseLeave = (node: any): void => {
  if (!node) return;
  try {
    const event = new MouseEvent('mouseout', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    node.dispatchEvent(event);
  } catch {
    // ignore in non-browser environments
  }
};
