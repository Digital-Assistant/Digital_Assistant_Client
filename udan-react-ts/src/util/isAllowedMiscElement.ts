import {hasClass, udanSpecialNodes} from "./index";

export const isAllowedMiscElement = (element: HTMLElement) => {
  if (!element) return false;

  let isAllowedElement: boolean =
      window.getComputedStyle(element).cursor == "pointer";
  let parentEl: any = element;

  if (element.getAttribute("contenteditable")) {
    isAllowedElement = true;
  }

  /**traversing 3 level parents for content editable property */
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
  if (
      hasClass(element, udanSpecialNodes.include.classes) ||
      udanSpecialNodes?.include?.tags?.includes(element.tagName.toLowerCase())
  ) {
    isAllowedElement = true;
  }

  //check if special classes to be excluded from recordable elements
  if (
      udanSpecialNodes?.exclude?.tags?.includes(
          element?.tagName?.trim()?.toLocaleLowerCase()
      ) ||
      hasClass(element, udanSpecialNodes.exclude.classes)
  ) {
    isAllowedElement = false;
  }

  return isAllowedElement;
};
