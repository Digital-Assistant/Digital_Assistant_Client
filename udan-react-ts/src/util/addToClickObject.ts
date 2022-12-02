import {UDAErrorLogger} from "../config/error-log";
import {addClickToNode} from "./addClickToNode";
export const UDAClickObjects: any = [];

global.UDAClickObjects = UDAClickObjects;

export const AddToClickObjects = (node: any) => {
  try {

    let clickObject: any = {element: node, id: ''}

    //checking whether the element is window or not
    if (clickObject.element === window) {
      return;
    }

    let tag = clickObject.element.tagName;
    if (tag && (tag.toLowerCase() === "body" || tag.toLowerCase() === "document" || tag.toLowerCase() === "window" || tag.toLowerCase() === "html")) {
      return;
    }

    if (clickObject.element.hasAttribute && clickObject.element.hasAttribute('nist-voice')) {
      return;
    }

    if(node.classList && node.classList.contains('uda_exclude')){
      return;
    }

    for (let i = 0; i < UDAClickObjects.length; i++) {
      if (UDAClickObjects[i].element.isSameNode(clickObject.element)) {
        //todo, discuss , how better to call actions, if multiple actions should be stored, or selector better.
        return;
      }
    }

    clickObject.id = UDAClickObjects.length;
    UDAClickObjects.push(clickObject);

    addClickToNode(node);

  } catch (e) {
    let htmlElement = node.element.innerHTML;
    UDAErrorLogger.error('Unable to process clickable object - '+htmlElement, e);
  }
}
