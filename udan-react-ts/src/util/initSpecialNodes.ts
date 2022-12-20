import {fetchSpecialNodes} from "../services/searchService";
import {CONFIG} from "../config";
import {getAllChildren} from "./index";

global.udaSpecialNodes;

declare global {
  interface Window {
    udaSpecialNodes: any;
  }
}

/**
 * Set ignorable classes for Udan con
 */
export const initSpecialNodes = async () => {

  //fetch special nodes for REST service
  global.udaSpecialNodes = await fetchSpecialNodes();

  const children = getAllChildren(
      document.querySelector(`.${CONFIG.UDA_CONTAINER_CLASS}`)
  );
  for (let i = 0; i < children?.length; i++) {
    try {
      if (
          children[i] &&
          !global.udaSpecialNodes?.exclude?.tags?.includes(
              children[i]?.tagName?.trim()?.toLocaleLowerCase()
          ) &&
          children[i].className.indexOf(CONFIG.UDA_CLICK_IGNORE_CLASS) == -1
      )
        children[i].className += " " + CONFIG.UDA_CLICK_IGNORE_CLASS;
    } catch (e) {
    }
  }
};
