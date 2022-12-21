import {addClickToNode} from "./addClickToNode";
import {isClickableNode} from "./isClickableNode";
import {initSpecialNodes} from "./initSpecialNodes";

/**
 * Add events to body elements
 */
export const addBodyEvents = async () => {
  //exclude content-serving elements from click objects
  let els: any = document.body.querySelectorAll("*"),
      len = els?.length,
      i = 0;
  for (; i < len; i++) {
    try {
      /**exclude event attachment for selective elements  */
      if (els[i] && isClickableNode(els[i])) {
        addClickToNode(els[i]);
      }
    } catch (e) {

    }
  }
};
