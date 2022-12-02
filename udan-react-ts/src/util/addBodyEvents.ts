import {EXCLUDE_ATTRIB, init, isClickable} from "./index";
import {addClickToNode} from "./addClickToNode";

/**
 * Add events to body elements
 * @param selector
 */
export const addBodyEvents = async (selector: HTMLElement) => {
  //exclude content-serving elements from click objects
  await init();
  let els: any = document.body.querySelectorAll("*"),
      len = els?.length,
      i = 0;

  for (; i < len; i++) {
    try {
      /**exclude event attachment for selective elements  */
      if (
          els[i] &&
          !els[i]?.getAttribute(EXCLUDE_ATTRIB) &&
          isClickable(els[i])
      ) {
        addClickToNode(els[i]);
      }
    } catch (e) {

    }
  }
};
