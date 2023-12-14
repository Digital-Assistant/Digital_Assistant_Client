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
 * Initialize special nodes for Udan con.
 * Fetches special nodes for the REST service and sets ignorable classes.
 */
export const initSpecialNodes = async () => {
  // Fetch special nodes for REST service
  global.udaSpecialNodes = await fetchSpecialNodes();

  // Get all children of Uda container
  const children = getAllChildren(
      document.querySelector(`.${CONFIG.UDA_CONTAINER_CLASS}`)
  );

  // Iterate through each child
  for (let i = 0; i < children?.length; i++) {
    try {
      // Check if the child is not excluded and not already ignored
      if (
          children[i] &&
          !global.udaSpecialNodes?.exclude?.tags?.includes(
              children[i]?.tagName?.trim()?.toLocaleLowerCase()
          ) &&
          children[i].className.indexOf(CONFIG.UDA_CLICK_IGNORE_CLASS) == -1
      ) {
        // Add UDA click ignore class to the child
        children[i].className += " " + CONFIG.UDA_CLICK_IGNORE_CLASS;
      }
    } catch (e) {
      // Handle any errors
    }
  }
};
