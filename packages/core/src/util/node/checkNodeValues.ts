import {checkNodeObjectKeyValue} from "./checkNodeObjectKeyValue";

/**
 * Checks if a node matches a given value based on several strategies:
 * - If legacy config exists at window.udaSpecialNodes[checkType], use it.
 * - Otherwise, match directly against:
 *   1) input/select/textarea value
 *   2) data-qa attribute
 *   3) element textContent
 */
export const checkNodeValues = (node: any, checkType: string) => {
  try {
    if (!node) return false;

    // Legacy behavior using configured keys
    try {
      // @ts-ignore
      const cfg = window?.udaSpecialNodes?.[checkType];
      if (cfg && typeof cfg === 'object') {
        for (const key in cfg) {
          if (checkNodeObjectKeyValue(node, key, cfg[key], checkType)) {
            return true;
          }
        }
        return false;
      }
    } catch (_) { /* ignore and fall back */ }

    const needle = String(checkType ?? '').trim();
    if (!needle) return false;

    const tag = String(node?.tagName || '').toLowerCase();

    // 1) Value-based elements
    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
      const v = (node as any).value ?? '';
      if (String(v).trim() === needle) return true;
    }

    // 2) data-qa attribute
    const qa = node?.getAttribute?.('data-qa');
    if (typeof qa === 'string' && qa.trim() === needle) return true;

    // 3) textContent
    const text = (typeof node?.textContent === 'string') ? node.textContent : '';
    if (String(text).replace(/\s+/g, ' ').trim() === needle) return true;

    return false;
  } catch (_) {
    return false;
  }
}
