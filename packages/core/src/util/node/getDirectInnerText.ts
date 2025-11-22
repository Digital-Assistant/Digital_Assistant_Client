/**
 * Extracts the direct inner text of a DOM element, excluding text from nested elements.
 * This function first attempts to use the native `innerText` or `textContent` properties.
 * If those are not suitable, it falls back to recursively collecting text from immediate child text nodes.
 *
 * @param element The DOM element from which to extract the text.
 * @returns The direct inner text of the element, with whitespace normalized. Returns an empty string if no text is found.
 */
export const getDirectInnerText = (element: any): string => {
    try {
        if (!element) return "";

        // Prefer using native properties like `innerText` or `textContent` if they are available and not empty.
        const direct = (typeof element.innerText === 'string' && element.innerText !== '')
            ? element.innerText
            : (typeof element.textContent === 'string' ? element.textContent : "");

        if (direct && direct.trim().length > 0) {
            // Normalize whitespace by replacing multiple spaces with a single space and trimming.
            return direct.replace(/\s+/g, ' ').trim();
        }

        // Fallback: Recursively collect text from immediate child nodes.
        const collected: string[] = [];
        let child = element.firstChild;
        while (child) {
            // Node type 3 is a TEXT_NODE.
            if ((child as any).nodeType === 3) {
                const val = (child as any).nodeValue ?? '';
                if (val && String(val).trim().length > 0) {
                    collected.push(String(val));
                }
            }
            // Node type 1 is an ELEMENT_NODE.
            else if ((child as any).nodeType === 1) {
                const ii = getDirectInnerText(child);
                if (ii && ii.length > 0) {
                    collected.push(ii);
                }
            }
            // Move to the next sibling.
            // @ts-ignore
            child = (child as any).nextSibling;
        }
        // Join the collected text parts and normalize whitespace.
        return collected.join(' ').replace(/\s+/g, ' ').trim();
    } catch (_) {
        // In case of an error, return an empty string.
        return "";
    }
}
