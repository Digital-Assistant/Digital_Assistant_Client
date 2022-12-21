// adding the click object that is registered via javascript

window.UDAClickObjects = [];
window.UDARemovedClickObjects = [];

export let UDALastMutationTime = 0;

import {AddToClickObjects} from "./util/headers/addToClickObject";
import {UDAProcessNode, UDAProcessRemovedNode} from "./util/headers/processNode";

EventTarget.prototype.addEventListener = function (addEventListener) {
  return function () {
    if (arguments[0] === "click") {
      AddToClickObjects(this);
    }
    addEventListener.call(this, arguments[0], arguments[1], arguments[2]);
  }
}(EventTarget.prototype.addEventListener);


//mutation observer initialization and adding the logic to process the clickobjects
/*export const UDAObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.removedNodes.length) {
      [].some.call(mutation.removedNodes, UDAProcessRemovedNode);
    }
    if (!mutation.addedNodes.length) {
      return;
    }
    [].some.call(mutation.addedNodes, UDAProcessNode);
  });
  UDALastMutationTime = Date.now();
});

// starting the mutation observer
UDAObserver.observe(document, {
  childList: true,
  subtree: true
});*/
