//simulate hover functionality
import {UDAConsoleLogger} from "../config/error-log";

export const simulateMouseLeave = (node) => {
  const event = new MouseEvent('mouseout', {
    'view': window,
    'bubbles': true,
    'cancelable': true
  });
  const canceled = !node.dispatchEvent(event);
  if (canceled) {
    // A handler called preventDefault.
    UDAConsoleLogger.info('mouseleave cancelled');
  } else {
    // None of the handlers called preventDefault.
    UDAConsoleLogger.info('mouseleave not cancelled');
  }

}
