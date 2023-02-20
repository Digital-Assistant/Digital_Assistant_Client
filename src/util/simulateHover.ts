//simulate hover functionality
import {UDAConsoleLogger} from "../config/error-log";

export const simulateHover = (node) => {
  const event = new MouseEvent('mouseover', {
    'view': window,
    'bubbles': true,
    'cancelable': true
  });
  const canceled = !node.dispatchEvent(event);
  if (canceled) {
    // A handler called preventDefault.
    UDAConsoleLogger.info('hover cancelled');
  } else {
    // None of the handlers called preventDefault.
    UDAConsoleLogger.info('hover not cancelled');
  }

}
