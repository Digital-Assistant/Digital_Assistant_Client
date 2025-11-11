/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkNodeValues } from '../checkNodeValues';

// Keep compatibility with original global UDAClickObjects list
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const UDAClickObjects: any[] | undefined;

/**
 * Determines whether a DOM element should receive click-recording handlers.
 * Logic preserved from original src/util/isClickableNode.ts
 */
export const isClickableNode = (element: HTMLElement): boolean => {
  if (!element) return false;

  // const isUdaPanel: any = element.closest('#udan-react-root');
  const isUdaPanel: any = element.closest('#udan-react-root');
  if (isUdaPanel) {
    return false;
  }

  // add the record click for parent element and ignore the children
  const closestParent: any = element.closest('[udaIgnoreChildren]');
  if (closestParent) {
    return false;
  }

  let isAllowedElement = window.getComputedStyle(element).cursor == 'pointer';

  // checking the node exists in the included list for further processing.
  if (checkNodeValues(element, 'include')) {
    isAllowedElement = true;
  }

  // Check the clickable element exists in clickable objects
  if (!isAllowedElement && Array.isArray(UDAClickObjects)) {
    clickObjectLoop: for (let i = 0; i < (UDAClickObjects?.length || 0); i++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (element.isSameNode((UDAClickObjects as any)[i].element)) {
        isAllowedElement = true;
        break clickObjectLoop;
      }
    }
  }

  // checking the node exists in the children ignore list for further processing.
  if (checkNodeValues(element, 'ignoreChildren')) {
    if (!element.hasAttribute('udaIgnoreChildren')) {
      element.setAttribute('udaIgnoreChildren', String(true));
      isAllowedElement = true;
    }
  }

  if (checkNodeValues(element, 'ignoreClicksOnNodes')) {
    if (!element.hasAttribute('udaIgnoreClick')) {
      element.setAttribute('udaIgnoreClick', String(true));
      isAllowedElement = false;
    }
  }

  // checking the node exists in the excluded list for further processing.
  if (isAllowedElement && checkNodeValues(element, 'exclude')) {
    isAllowedElement = false;
  }

  return isAllowedElement;
};
