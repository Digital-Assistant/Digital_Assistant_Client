import {checkNodeValues} from "./checkNodeValues";

/**
 * Determines if an HTML element should be considered "clickable" based on a set of rules.
 * This function checks CSS properties, special attributes, and global configurations to decide
 * whether an element should be treated as interactive.
 *
 * @param element The HTML element to check.
 * @returns `true` if the element is considered clickable, `false` otherwise.
 */
export const isClickableNode = (element: HTMLElement) => {
  if (!element) return false;

  // Ignore elements within the UDA panel itself.
  const isUdaPanel: any = element.closest('#udan-react-root');
  if(isUdaPanel){
    return false;
  }

  // If the element is a child of an element with `udaIgnoreChildren`, it's not clickable.
  const closestParent: any = element.closest('[udaIgnoreChildren]');
  if (closestParent) {
    return false;
  }

  // An element is considered clickable if its cursor style is 'pointer'.
  let isAllowedElement: boolean =
      window.getComputedStyle(element).cursor == "pointer";

  // If the element is explicitly included in a list of special nodes, it's considered clickable.
  if (checkNodeValues(element, 'include')) {
    isAllowedElement = true;
  }

  // If not already considered clickable, check if the element is in the global `UDAClickObjects` array.
  if (!isAllowedElement) {
    clickObjectLoop:
        for (let i = 0; i < window.UDAClickObjects?.length; i++) {
          if (element.isSameNode(window.UDAClickObjects[i].element)) {
            isAllowedElement = true;
            break clickObjectLoop;
          }
        }
  }

  // If the element is configured to ignore its children, mark it as clickable and add the attribute.
  if (checkNodeValues(element, 'ignoreChildren')) {
    if(!element.hasAttribute('udaIgnoreChildren')) {
      element.setAttribute('udaIgnoreChildren', String(true));
      isAllowedElement = true;
    }
  }

  // If clicks on this node should be ignored, mark it as not clickable and add the attribute.
  if(checkNodeValues(element, 'ignoreClicksOnNodes')){
    if(!element.hasAttribute('udaIgnoreClick')) {
      element.setAttribute('udaIgnoreClick', String(true));
      isAllowedElement = false;
    }
  }

  // If the element is explicitly excluded, it's not clickable.
  if (isAllowedElement && checkNodeValues(element, 'exclude')) {
    isAllowedElement = false;
  }

  return isAllowedElement;
}
