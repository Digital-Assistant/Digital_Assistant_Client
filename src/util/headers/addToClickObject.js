export const ignoreTags = ["body", "document", "window", "html", "script", "style", "iframe", "doctype", "link", "svg", "path", "meta", "circle", "rect", "stop", "defs", "linearGradient", "g"];

export const AddToClickObjects = (node) => {
  try {

    let clickObject = {element: node, id: ''}

    //checking whether the element is window or not
    if (clickObject.element === window) {
      return;
    }

    if(typeof clickObject?.element?.tagName === 'undefined') {
      return;
    }

    let tag = clickObject?.element?.tagName;
    if (tag && ignoreTags.indexOf(tag.toLowerCase()) !== -1) {
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
  } catch (e) {
    console.log('Unable to process clickable object - '+node, e);
  }
}
