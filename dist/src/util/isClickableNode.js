import { checkNodeValues } from "./checkNodeValues";
export const isClickableNode = (element) => {
    if (!element)
        return false;
    /*if(element.hasAttribute("udaIgnoreChildren")) {
      element.removeAttribute("udaIgnoreChildren");
    }
  
    if(element.hasAttribute("udaIgnoreNode")) {
      element.removeAttribute("udaIgnoreNode");
    }*/
    const isUdaPanel = element.closest('#udan-react-root');
    if (isUdaPanel) {
        return false;
    }
    //add the record click for parent element and ignore the children
    const closestParent = element.closest('[udaIgnoreChildren]');
    if (closestParent) {
        return false;
    }
    let isAllowedElement = window.getComputedStyle(element).cursor == "pointer";
    // checking the node exists in the included list for further processing.
    if (checkNodeValues(element, 'include')) {
        isAllowedElement = true;
    }
    //Check the clickable element exists in clickable objects
    if (!isAllowedElement) {
        clickObjectLoop: for (let i = 0; i < (UDAClickObjects === null || UDAClickObjects === void 0 ? void 0 : UDAClickObjects.length); i++) {
            if (element.isSameNode(UDAClickObjects[i].element)) {
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
//# sourceMappingURL=isClickableNode.js.map