import {checkNodeValues} from "./checkNodeValues";
// import {hasClass} from "./index";
declare const UDAClickObjects;

export const isClickableNode = (element: HTMLElement) => {
  if (!element) return false;

  let isAllowedElement: boolean =
      window.getComputedStyle(element).cursor == "pointer";

  // checking the node exists in the included list for further processing.
  if (checkNodeValues(element, 'include')) {
    isAllowedElement = true;
  }

  //Check the clickable element exists in clickable objects
  if (!isAllowedElement) {
    clickObjectLoop:
        for (let i = 0; i < UDAClickObjects?.length; i++) {
          if (element.isSameNode(UDAClickObjects[i].element)) {
            isAllowedElement = true;
            break clickObjectLoop;
          }
        }
  }

  // checking the node exists in the children ignore list for further processing.
  if (checkNodeValues(element, 'ignoreChildren')) {
    if(!element.hasAttribute('udaIgnoreChildren')) {
      // element.classList.add('ignoreChildren');
      element.setAttribute('udaIgnoreChildren', String(true));
      isAllowedElement = true;
    }
  }

  // checking the node exists in the excluded list for further processing.
  if (isAllowedElement && checkNodeValues(element, 'exclude')) {
    isAllowedElement = false;
  }

  return isAllowedElement;
}
