/**
 * To get all the children of a given parent
 * @param htmlElement
 * @returns HTMLElements Collection
 */
export const getAllChildren = (htmlElement: any) => {
    const results: any[] = [];
    try {
        if (!htmlElement || !htmlElement.children) return results;

        // Collect only element children (excludes text/comment nodes automatically)
        const len = htmlElement.children.length || 0;
        for (let i = 0; i < len; i++) {
            const child: any = htmlElement.children[i];
            if (!child) continue;

            // Always include the element child itself
            results.push(child);

            // Do not traverse into SCRIPT or STYLE children contents
            const tag = String(child.tagName || '').toLowerCase();
            if (tag === 'script' || tag === 'style') continue;

            // Recurse for nested element children
            const nested = getAllChildren(child);
            if (Array.isArray(nested) && nested.length) results.push(...nested);
        }
    } catch (_) {
        // ignore and return what we have
    }
    return results;
};