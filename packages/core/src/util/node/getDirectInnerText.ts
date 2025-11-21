export const getDirectInnerText = (element: any): string => {
    try {
        if (!element) return "";

        // Prefer native properties when available
        const direct = (typeof element.innerText === 'string' && element.innerText !== '')
            ? element.innerText
            : (typeof element.textContent === 'string' ? element.textContent : "");

        if (direct && direct.trim().length > 0) {
            return direct.replace(/\s+/g, ' ').trim();
        }

        // Fallback: recursively collect immediate text from children
        const collected: string[] = [];
        let child = element.firstChild;
        while (child) {
            // 3 = TEXT_NODE, 1 = ELEMENT_NODE
            if ((child as any).nodeType === 3) {
                const val = (child as any).nodeValue ?? '';
                if (val && String(val).trim().length > 0) collected.push(String(val));
            } else if ((child as any).nodeType === 1) {
                const ii = getDirectInnerText(child);
                if (ii && ii.length > 0) collected.push(ii);
            }
            // @ts-ignore
            child = (child as any).nextSibling;
        }
        return collected.join(' ').replace(/\s+/g, ' ').trim();
    } catch (_) {
        return "";
    }
}