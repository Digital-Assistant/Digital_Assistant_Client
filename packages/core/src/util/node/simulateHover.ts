//simulate hover functionality
import {UDAConsoleLogger} from "../error/error-log";

export const simulateHover = (node: any) => {
  try {
    if (!node || typeof node.dispatchEvent !== 'function') return;

    let event: Event | null = null;
    try {
      // Preferred modern constructor
      event = new MouseEvent('mouseover', {
        view: window,
        bubbles: true,
        cancelable: true,
      });
    } catch (_) {
      // Older environments fallback
      try {
        // @ts-ignore
        event = document.createEvent('MouseEvent');
        // @ts-ignore
        event.initEvent('mouseover', true, true);
      } catch (_) {
        event = null;
      }
    }

    if (!event) return;

    const canceled = !node.dispatchEvent(event);
    if (canceled) {
      UDAConsoleLogger.info('hover cancelled');
    } else {
      UDAConsoleLogger.info('hover not cancelled');
    }
  } catch (_) {
    // Swallow errors to keep tests and production resilient
  }
}
