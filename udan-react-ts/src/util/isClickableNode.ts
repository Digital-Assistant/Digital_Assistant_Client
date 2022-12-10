import {hasClass} from "./index";
import {specialNodes} from "./specialNodes";

declare const UDAClickObjects;

export const isClickableNode = (element: HTMLElement) => {
  if (!element) return false;

  let isAllowedElement: boolean =
      window.getComputedStyle(element).cursor == "pointer";

  let parentEl: any = element;

  if (element.getAttribute("contenteditable")) {
    isAllowedElement = true;
  }

  /**traversing 3 level parents for content editable property */
  //wrong logic needs to modify this to other logical way for finding parent clickable element.
  for (let i = 0; i <= 3; i++) {
    if (parentEl.parentNode) {
      parentEl = parentEl.parentNode;
    }
    if (parentEl.getAttribute("contenteditable")) {
      isAllowedElement = true;
      break;
    }
  }

  //check if special classes to be included in recordable elements
  if (hasClass(element, specialNodes.include.classes) || specialNodes?.include?.tags?.includes(element.tagName.toLowerCase())) {
    isAllowedElement = true;
  }

  //Check the clickable element exists in clickable objects
  if(!isAllowedElement) {
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

  //check if special classes to be excluded from recordable elements
  if (specialNodes?.exclude?.tags?.includes(element?.tagName?.trim()?.toLocaleLowerCase()) || hasClass(element, specialNodes.exclude.classes)) {
    isAllowedElement = false;
  }

  return isAllowedElement;
};
