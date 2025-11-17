// adding the click object that is registered via javascript
window.UDAClickObjects = [];
window.UDARemovedClickObjects = [];

import {AddToClickObjects} from "./addToClickObject";

export const initializeClickTracking = () => {
  EventTarget.prototype.addEventListener = function (addEventListener: any) {
    return function () {
      if (arguments[0] === "click") {
        // @ts-ignore
          AddToClickObjects(this);
      }
      // @ts-ignore
        addEventListener.call(this, arguments[0], arguments[1], arguments[2]);
    }
  }(EventTarget.prototype.addEventListener);
}
