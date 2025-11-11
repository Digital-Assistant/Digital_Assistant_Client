/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Simulate a mouseover (hover) event on a DOM node.
 * Safe to call in jsdom; logs are no-ops.
 *
 * @param node - The target element to dispatch the mouseover event to
 */
export const simulateHover = (node: any): void => {
  if (!node) return;
  try {
    const event = new MouseEvent('mouseover', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    node.dispatchEvent(event);
  } catch {
    // ignore in non-browser environments
  }
};
