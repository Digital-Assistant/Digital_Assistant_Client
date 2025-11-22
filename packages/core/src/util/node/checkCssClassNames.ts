// This module provides a function to check if a DOM element has CSS class names,
// particularly for the purpose of ignoring certain nodes based on their classes.

import {nodeConfig} from "./nodeConfig";

/**
 * Checks if a DOM element has any CSS class names, or if it contains any of the classes
 * specified in the `ignoreNodesContainingClassNames` configuration.
 *
 * @param node The DOM element to check.
 * @returns `true` if the element has any class or an "ignore" class, `false` otherwise.
 */
export const checkCssClassNames = (node: any) => {
  try {
    if (!node) return false;

    // Check if the element has any class at all.
    // This is a general check to see if the element is styled with classes.
    const classNameStr = typeof node.className === 'string' ? node.className.trim() : '';
    const hasAnyClass = (node?.classList && typeof node.classList.length === 'number' && node.classList.length > 0)
      || (classNameStr.length > 0);
    if (hasAnyClass) return true;

    // Additionally, check if the element contains any of the classes that are configured to be ignored.
    if (nodeConfig.ignoreNodesContainingClassNames?.length > 0 && node?.classList) {
      for (const className of nodeConfig.ignoreNodesContainingClassNames) {
        try {
          if (typeof className === 'string' && node.classList.contains(className)) {
            return true;
          }
        } catch (_) { /* Ignore errors during class checking. */ }
      }
    }
  } catch (_) {
    // Ignore any errors and fall through to return false.
  }
  return false;
};
