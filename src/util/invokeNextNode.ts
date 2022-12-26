//invoke the click of next item
import {CONFIG} from "../config";
import {UDAConsoleLogger} from "../config/error-log";
import {trigger} from "./events";

export const invokeNextNode = (node, timeToInvoke) => {
  let link = false;
  timeToInvoke = timeToInvoke + 2000;
  if (typeof node.href !== 'undefined' && node.href !== '') {
    if (typeof node.target !== 'undefined' && node.target === '_blank') {
      // toggleautoplay(navigationCookieData);
    } else {
      let hostname = window.location.protocol + "//" + window.location.host + window.location.pathname;
      let href = node.href.substr(hostname.length);
      if (href !== '' && href !== "#") {
        link = true;
        CONFIG.navigatedToNextPage.check = true;
        CONFIG.navigatedToNextPage.url = node.href;
      }
    }
  }

  if (!link) {
    UDAConsoleLogger.info(node, 2);
    setTimeout(function () {
      trigger("UDAPlayNext", {"playNext": true});
    }, timeToInvoke);
  } else {
    setTimeout(function () {
      trigger("UDAPlayNext", {"playNext": true});
    }, timeToInvoke);
  }
}
