import { CONFIG } from "../../config";
import { getDirectInnerText } from "./getDirectInnerText";

/**
 * Resolves a human-friendly label for a clicked node or legacy click data.
 * This function supports both `HTMLElement` input and legacy click data objects.
 * It tries to find the most descriptive label for a node by checking various attributes in a specific order.
 *
 * @param data The `HTMLElement` or legacy click data object.
 * @returns A truncated, human-friendly label for the node.
 */
export const getClickedNodeLabel = (data: any): string => {
  try {
    // Case 1: The input is an HTMLElement.
    if (data && typeof (data as any).tagName === 'string') {
      const el = data as HTMLElement;

      // The order of priority for the label is: aria-label -> aria-labelledby -> title -> direct inner text.
      const ariaLabel = el.getAttribute?.('aria-label') || '';
      if (ariaLabel && ariaLabel.trim()) return truncate(ariaLabel.trim());

      const ariaLabelledBy = el.getAttribute?.('aria-labelledby') || '';
      if (ariaLabelledBy && ariaLabelledBy.trim() && el.ownerDocument) {
        const ids = ariaLabelledBy.trim().split(/\s+/);
        const parts: string[] = [];
        ids.forEach(id => {
          try {
            const ref = el.ownerDocument!.getElementById(id);
            if (ref) parts.push(getDirectInnerText(ref));
          } catch (_) { /* Ignore errors if the referenced element is not found. */ }
        });
        const joined = parts.join(' ').replace(/\s+/g, ' ').trim();
        if (joined) return truncate(joined);
      }

      const title = el.getAttribute?.('title') || '';
      if (title && title.trim()) return truncate(title.trim());

      // As a fallback, use the direct inner text of the element.
      const fallback = getDirectInnerText(el);
      return truncate(fallback);
    }

    // Case 2: The input is a legacy data object with serialized `objectdata`.
    if (data && typeof data === 'object') {
      let clickedName = '';
      try {
        const nodeData = data.objectdata ? JSON.parse(data.objectdata) : {};
        const displayText = nodeData?.meta?.displayText ?? '';
        if (typeof displayText === 'string' && displayText.trim() !== '') {
          clickedName = truncate(displayText);
        }
      } catch (_) { /* Ignore JSON parsing issues. */ }

      if (!clickedName) {
        const name = (data as any).clickednodename ?? '';
        if (typeof name === 'string') clickedName = truncate(name);
      }
      return clickedName || '';
    }

    return '';
  } catch (_) {
    return '';
  }
}

/**
 * Truncates a string to a maximum length defined in the configuration.
 * @param text The string to truncate.
 * @returns The truncated string, with "..." appended if it was shortened.
 */
function truncate(text: string): string {
  try {
    const max = (CONFIG as any)?.maxStringLength ?? 100;
    if (typeof text !== 'string') return '';
    return text.length > max ? text.substring(0, max) + '...' : text;
  } catch (_) {
    return text;
  }
}
