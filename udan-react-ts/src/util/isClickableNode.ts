import {checkNodeObjectKeyValue} from "./checkNodeObjectKeyValue";
import {hasClass} from "./index";

declare const UDAClickObjects;
declare let udaSpecialNodes;

export const isClickableNode = (element: HTMLElement) => {
  if (!element) return false;

  let isAllowedElement: boolean =
      window.getComputedStyle(element).cursor == "pointer";


  /**traversing 3 level parents for content editable property */
  //wrong logic needs to modify this to other logical way for finding parent clickable element.
  /*
  let parentEl: any = element;
  for (let i = 0; i <= 3; i++) {
    if (parentEl.parentNode) {
      parentEl = parentEl.parentNode;
    }
    if (parentEl.getAttribute("contenteditable")) {
      isAllowedElement = true;
      break;
    }
  }
  */

  console.log({element});

  //check if special classes, tags and attributes to be excluded from recordable elements
  let exclude = checkNodeValues(element, 'exclude');
  if (exclude) {
    console.log('ignored '+element.nodeName);
    isAllowedElement = false;
  }

  //check if special classes, tags and attributes to be included in recordable elements
  console.log('check for include');
  let include = checkNodeValues(element, 'include')
  if (include) {
    console.log('allowed '+element.nodeName);
    isAllowedElement = true;
  }

  if (hasClass(element, udaSpecialNodes.include.classes) || udaSpecialNodes?.include?.tags?.includes(element.tagName.toLowerCase())) {
    isAllowedElement = true;
  }

  //Check the clickable element exists in clickable objects
  if (!isAllowedElement) {
    for (let i = 0; i < UDAClickObjects?.length; i++) {
      if (UDAClickObjects[i].element === window) {
        continue;
      }
      if (element.isSameNode(UDAClickObjects[i].element)) {
        isAllowedElement = true;
        break;
      }
    }
  }

  /*if (udaSpecialNodes?.exclude?.tags?.includes(element?.tagName?.trim()?.toLocaleLowerCase()) || hasClass(element, udaSpecialNodes.exclude.classes)) {
    isAllowedElement = false;
  }*/

  //check for stopping children elements for adding event listeners
  if (isAllowedElement) {
    console.log(element);
  }

  return isAllowedElement;
};

export const checkNodeValues = (node, checkType) => {
  if (udaSpecialNodes[checkType] && node) {
    let isAllowed = false;
    for (const key in udaSpecialNodes[checkType]) {
      if (checkNodeObjectKeyValue(node, key, udaSpecialNodes[checkType][key])) {
        return true;
      }
    }
    return isAllowed;
  }
}

