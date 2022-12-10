import {fetchSpecialNodes} from "../services/searchService";
import {CONFIG} from "../config";
import {getAllChildren, getFromStore, setToStore} from "./index";
import {specialNodes} from "./specialNodes";

export let udaSpecialNodes: any = specialNodes;

/**
 * Set ignorable classes for Udan con
 */
export const initSpecialNodes = async () => {

  //fetch special nodes for REST service
  let fetchedSpecialNodes = getFromStore(CONFIG.specialNodeKey, false);

  if (!fetchedSpecialNodes) {
    fetchedSpecialNodes = await fetchSpecialNodes();
    setToStore(fetchedSpecialNodes, CONFIG.specialNodeKey, false);
  } else if (fetchedSpecialNodes) {
    udaSpecialNodes = fetchedSpecialNodes;
  }

  const children = getAllChildren(
      document.querySelector(`.${CONFIG.UDA_CONTAINER_CLASS}`)
  );
  for (let i = 0; i < children?.length; i++) {
    try {
      if (
          children[i] &&
          !udaSpecialNodes?.exclude?.tags?.includes(
              children[i]?.tagName?.trim()?.toLocaleLowerCase()
          ) &&
          children[i].className.indexOf(CONFIG.UDA_CLICK_IGNORE_CLASS) == -1
      )
        children[i].className += " " + CONFIG.UDA_CLICK_IGNORE_CLASS;
    } catch (e) {
    }
  }
};
