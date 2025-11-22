/**
 * Recursively collects all descendant elements of a given HTML element.
 * This function traverses the DOM tree starting from the provided element and gathers all its children,
 * grandchildren, and so on, into a flat array.
 *
 * @param htmlElement The parent HTML element from which to start collecting children.
 * @returns An array of all descendant `HTMLElement` objects.
 */
export const getAllChildren = (htmlElement: any) => {
    const results: any[] = [];
    try {
        // If the element is invalid or has no children, return an empty array.
        if (!htmlElement || !htmlElement.children) return results;

        // The `children` property collects only element nodes, automatically excluding text and comment nodes.
        const len = htmlElement.children.length || 0;
        for (let i = 0; i < len; i++) {
            const child: any = htmlElement.children[i];
            if (!child) continue;

            // Add the direct child element to the results.
            results.push(child);

            // Do not traverse into the contents of <script> or <style> tags.
            const tag = String(child.tagName || '').toLowerCase();
            if (tag === 'script' || tag === 'style') continue;

            // Recursively call `getAllChildren` for nested elements.
            const nested = getAllChildren(child);
            // If nested children are found, add them to the results array.
            if (Array.isArray(nested) && nested.length) {
                results.push(...nested);
            }
        }
    } catch (_) {
        // If an error occurs, ignore it and return the results collected so far.
    }
    return results;
};
