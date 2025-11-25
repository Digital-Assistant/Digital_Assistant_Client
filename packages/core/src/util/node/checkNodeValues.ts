import { checkNodeObjectKeyValue } from "./checkNodeObjectKeyValue";
import { specialNodes } from "../specialNodes";

/**
 * Checks if a DOM node matches a given value using several strategies.
 * This function is used to determine if a node is relevant based on a specific check type or value.
 *
 * The matching strategies are as follows:
 * - It checks against the `specialNodes` configuration for the given `checkType`.
 * - Otherwise, it attempts to match the `checkType` value directly against:
 *   1. The `value` property of `<input>`, `<select>`, or `<textarea>` elements.
 *   2. The `data-qa` attribute of the element.
 *   3. The `textContent` of the element.
 *
 * @param node The DOM node to check.
 * @param checkType The value or check type to match against the node.
 * @returns `true` if the node matches the value according to any of the strategies, `false` otherwise.
 */
export const checkNodeValues = (node: any, checkType: string) => {
  try {
    if (!node) return false;

    // Check against the imported specialNodes configuration
    const config: any = specialNodes[checkType as keyof typeof specialNodes];
    if (config && typeof config === 'object') {
      for (const key in config) {
        if (checkNodeObjectKeyValue(node, key, config[key], checkType)) {
          return true;
        }
      }
    }

    // Prepare the value to search for.
    const needle = String(checkType ?? '').trim();
    if (!needle) return false;

    const tag = String(node?.tagName || '').toLowerCase();

    // Strategy 1: Match against the `value` property for form elements.
    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
      const v = (node as any).value ?? '';
      if (String(v).trim() === needle) return true;
    }

    // Strategy 2: Match against the `data-qa` attribute, commonly used for test automation.
    const qa = node?.getAttribute?.('data-qa');
    if (typeof qa === 'string' && qa.trim() === needle) return true;

    // Strategy 3: Match against the element's `textContent`.
    const text = (typeof node?.textContent === 'string') ? node.textContent : '';
    if (String(text).replace(/\s+/g, ' ').trim() === needle) return true;

    // If no match is found, return false.
    return false;
  } catch (_) {
    // In case of any error, return false to be safe.
    return false;
  }
}
