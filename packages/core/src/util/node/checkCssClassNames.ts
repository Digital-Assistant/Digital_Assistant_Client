//check css classnames for ignoring
import {nodeConfig} from "./nodeConfig";

export const checkCssClassNames = (node: any) => {
  try {
    if (!node) return false;

    // If the element has any class at all, treat as having CSS class names
    const classNameStr = typeof node.className === 'string' ? node.className.trim() : '';
    const hasAnyClass = (node?.classList && typeof node.classList.length === 'number' && node.classList.length > 0)
      || (classNameStr.length > 0);
    if (hasAnyClass) return true;

    // Additionally, if any of the configured ignore classes are present, return true
    if (nodeConfig.ignoreNodesContainingClassNames?.length > 0 && node?.classList) {
      for (const className of nodeConfig.ignoreNodesContainingClassNames) {
        try {
          if (typeof className === 'string' && node.classList.contains(className)) {
            return true;
          }
        } catch (_) { /* ignore */ }
      }
    }
  } catch (_) {
    // ignore errors and fall through
  }
  return false;
};
