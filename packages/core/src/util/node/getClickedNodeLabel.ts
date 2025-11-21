import { CONFIG } from "../../config";
import { getDirectInnerText } from "./getDirectInnerText";

/**
 * Resolve a human-friendly label for a clicked node or legacy click data.
 * Supports both HTMLElement input and legacy click data objects used elsewhere.
 */
export const getClickedNodeLabel = (data: any): string => {
  try {
    // Case 1: HTMLElement provided directly (as per unit tests)
    if (data && typeof (data as any).tagName === 'string') {
      const el = data as HTMLElement;

      // Priority: aria-label -> aria-labelledby -> title -> direct inner text
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
          } catch (_) { /* ignore */ }
        });
        const joined = parts.join(' ').replace(/\s+/g, ' ').trim();
        if (joined) return truncate(joined);
      }

      const title = el.getAttribute?.('title') || '';
      if (title && title.trim()) return truncate(title.trim());

      const fallback = getDirectInnerText(el);
      return truncate(fallback);
    }

    // Case 2: Legacy data object with serialized objectdata
    if (data && typeof data === 'object') {
      let clickedName = '';
      try {
        const nodeData = data.objectdata ? JSON.parse(data.objectdata) : {};
        const displayText = nodeData?.meta?.displayText ?? '';
        if (typeof displayText === 'string' && displayText.trim() !== '') {
          clickedName = truncate(displayText);
        }
      } catch (_) { /* ignore parse issues */ }

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

function truncate(text: string): string {
  try {
    const max = (CONFIG as any)?.maxStringLength ?? 100;
    if (typeof text !== 'string') return '';
    return text.length > max ? text.substring(0, max) + '...' : text;
  } catch (_) {
    return text;
  }
}
