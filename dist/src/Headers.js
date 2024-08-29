// adding the click object that is registered via javascript
window.UDAClickObjects = [];
window.UDARemovedClickObjects = [];
import { AddToClickObjects } from "./util/headers/addToClickObject";
EventTarget.prototype.addEventListener = function (addEventListener) {
    return function () {
        if (arguments[0] === "click") {
            AddToClickObjects(this);
        }
        addEventListener.call(this, arguments[0], arguments[1], arguments[2]);
    };
}(EventTarget.prototype.addEventListener);
//# sourceMappingURL=Headers.js.map