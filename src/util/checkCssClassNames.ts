//check css classnames for ignoring
import {CONFIG} from "../config";

export const checkCssClassNames = (node: any) => {
  let cssClassExist = false;
  if (CONFIG.ignoreNodesContainingClassNames?.length > 0) {
    for (const className of CONFIG.ignoreNodesContainingClassNames) {
      if (node.classList.contains(className)) {
        cssClassExist = true;
      }
    }
  }
  return cssClassExist;
};
