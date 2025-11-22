import {CONFIG} from "../../config";
import {fetchSpecialNodes} from "../../services";
import {getAllChildren} from "./getAllChildren";

/**
 * Initializes special nodes for the UDA container.
 * This function fetches a configuration of "special nodes" from a remote service and then
 * applies specific CSS classes to elements within the UDA container to mark them as ignorable for clicks.
 */
export const initSpecialNodes = async () => {
  // Fetch the special nodes configuration from the REST service and store it globally.
  window.udaSpecialNodes = await fetchSpecialNodes();

  // Get all descendant elements of the UDA container.
  const children = getAllChildren(
      document.querySelector(`.${CONFIG.UDA_CONTAINER_CLASS}`)
  );

  // Iterate through each descendant element.
  for (let i = 0; i < children?.length; i++) {
    try {
      // Check if the child element is valid and should be marked as ignorable.
      if (
          children[i] &&
          // Ensure the element's tag is not in the exclusion list.
          !window.udaSpecialNodes?.exclude?.tags?.includes(
              children[i]?.tagName?.trim()?.toLocaleLowerCase()
          ) &&
          // Ensure the element does not already have the ignore class.
          children[i].className.indexOf(CONFIG.UDA_CLICK_IGNORE_CLASS) == -1
      ) {
        // Add the click-ignore class to the element.
        children[i].className += " " + CONFIG.UDA_CLICK_IGNORE_CLASS;
      }
    } catch (e) {
      // Handle any errors that might occur during the process.
    }
  }
};
