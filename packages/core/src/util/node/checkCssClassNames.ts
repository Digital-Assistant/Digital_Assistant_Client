//check css classnames for ignoring
import {nodeConfig} from "./nodeConfig";

export const checkCssClassNames = (node: any) => {
  let cssClassExist = false;
  if (nodeConfig.ignoreNodesContainingClassNames?.length > 0) {
    for (const className of nodeConfig.ignoreNodesContainingClassNames) {
      if (node.classList.contains(className)) {
        cssClassExist = true;
      }
    }
  }
  return cssClassExist;
};
