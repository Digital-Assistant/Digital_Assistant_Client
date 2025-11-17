//simulate hover functionality
import {UDAConsoleLogger} from "../error/error-log";

export const simulateMouseLeave = (node: any) => {
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
