import {hasClass} from "./hasClass";

/**
 * Checks if a DOM node has a specific key-value pair, based on a given check type.
 * This function is used to determine if a node matches certain criteria, such as having a specific tag,
 * class, attribute, or ID.
 *
 * @param node The DOM node to check.
 * @param key The key indicating the type of check to perform (e.g., 'tags', 'classes', 'attributes', 'ids').
 * @param objectValues An array of strings containing the values to check for.
 * @param checkType The type of check being performed (not directly used in this function, but passed for context).
 * @returns `true` if the node matches the criteria, `false` otherwise.
 */
export const checkNodeObjectKeyValue = (node: any, key: string, objectValues: Array<string>, checkType: string) => {
    let exists = false;
    switch (key.toLowerCase()) {
        case 'tags':
            // Check if the node's tag name is included in the provided list of tags.
            if (objectValues.includes(node?.tagName?.trim().toLowerCase())) {
                exists = true;
            }
            break;
        case 'classes':
            // Check if the node has any of the specified CSS classes.
            if (hasClass(node, objectValues)) {
                exists = true;
            }
            break;
        case 'attributes':
            // Check if the node has any of the specified attributes.
            attributeLoop:
                for (const attribute of objectValues) {
                    if (node.hasAttribute(attribute)) {
                        exists = true;
                        break attributeLoop;
                    }
                }
            break;
        case 'ids':
            // Check if the node's ID is included in the provided list of IDs.
            if (node.id && objectValues.includes(node.id.trim().toLowerCase())) {
                exists = true;
            }
            break;
        case 'classname': {
            // Support explicit key 'className'
            const classList: string[] = (node?.className || '')
                .toString()
                .split(/\s+/)
                .filter(Boolean);
            if (classList.length) {
                exists = objectValues.some(v => classList.includes(v));
            }
            break;
        }
        case 'textcontent': {
            const text = (node?.textContent ?? '').toString();
            if (text && objectValues.includes(text)) {
                exists = true;
            }
            break;
        }
        default:
            // Treat unknown key as attribute name and compare value equality
            try {
                if (node && typeof node.getAttribute === 'function') {
                    const attrVal = node.getAttribute(key);
                    if (attrVal != null && objectValues.includes(attrVal)) {
                        exists = true;
                    }
                }
            } catch {
                // ignore
            }
    }
    return exists;
}
