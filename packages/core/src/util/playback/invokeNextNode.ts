// This module provides a function to invoke the click action on a given node and then
// trigger the playback of the next item in a sequence.

import {CONFIG} from "../../config";
import {UDAConsoleLogger} from "../error";
import {trigger} from "../node";
import {removeToolTip} from "../notification";

/**
 * Invokes a click action on the provided node and schedules the playback of the next node.
 * This function handles navigation scenarios and ensures that tooltips are removed.
 *
 * @param node The DOM node on which to invoke the click action.
 * @param timeToInvoke The delay (in milliseconds) before invoking the click and triggering the next playback.
 */
export const invokeNextNode = (node: any, timeToInvoke: any) => {
  let link = false;
  // Check if the node is a link and if it leads to a different page.
  if (typeof node.href !== 'undefined' && node.href !== '') {
    if (typeof node.target !== 'undefined' && node.target === '_blank') {
      // If the link opens in a new tab, special handling might be needed (e.g., toggling autoplay).
      // This part is commented out but indicates a potential area for future development.
      // toggleautoplay(navigationCookieData);
    } else {
      // Construct the current hostname to compare with the link's href.
      let hostname = window.location.protocol + "//" + window.location.host + window.location.pathname;
      let href = node.href.substr(hostname.length);
      // If the href is not empty and not a hash link, it's considered a navigation link.
      if (href !== '' && !href.startsWith("#")) {
        link = true;
        CONFIG.navigatedToNextPage.check = true;
        CONFIG.navigatedToNextPage.url = node.href;
      }
    }
  }

  // Schedule the click action and tooltip removal after `timeToInvoke`.
  setTimeout(function () {
    node.click();
    removeToolTip();
  }, timeToInvoke);

  // Double the `timeToInvoke` for the next `UDAPlayNext` trigger.
  timeToInvoke += timeToInvoke;

  // If it's not a navigation link, log it for debugging.
  if (!link) {
    UDAConsoleLogger.info(node, 2);
  }
  
  // Trigger the 'UDAPlayNext' event after an additional delay.
  setTimeout(function () {
    trigger("UDAPlayNext", {"playNext": true});
  }, timeToInvoke);
}
