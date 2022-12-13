import {checkNodeValues} from "./checkNodeValues";
// import {hasClass} from "./index";
declare const UDAClickObjects;

export const isClickableNode = (element: HTMLElement) => {
  if (!element) return false;

  //check for stopping children elements for adding event listeners
  /*const closestParent = element.closest('.ignoreChildren');
  if (closestParent) {
    return false;
  }*/

  let isAllowedElement: boolean =
      window.getComputedStyle(element).cursor == "pointer";

  // checking the node exists in the included list for further processing.
  if (checkNodeValues(element, 'include')) {
    isAllowedElement = true;
    console.log('here at the include check');
  }

  //Check the clickable element exists in clickable objects
  if (!isAllowedElement) {
    clickObjectLoop:
        for (let i = 0; i < UDAClickObjects?.length; i++) {
          if (element.isSameNode(UDAClickObjects[i].element)) {
            isAllowedElement = true;
            console.log('here at the clickObjectLoop');
            break clickObjectLoop;
          }
        }
  }

  // checking the node exists in the children ignore list for further processing.
  if (checkNodeValues(element, 'ignoreChildren')) {
    console.log('here at ignoreChildren');
    console.log(element);
    element.classList.add('ignoreChildren');
    isAllowedElement = true;
  }

  // checking the node exists in the excluded list for further processing.
  if (isAllowedElement && checkNodeValues(element, 'exclude')) {
    isAllowedElement = false;
  }

  return isAllowedElement;
};

