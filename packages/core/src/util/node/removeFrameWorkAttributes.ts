/**
 * This module provides functionality for removing framework-specific attributes and properties from a DOM node.
 * It helps in cleaning up the node to get a more generic representation, free of framework-specific clutter.
 */
import { FrameWorkAttributesConfig } from "./FrameWorkAttributesConfig";

/**
 * Creates a deep clone of a DOM node and removes framework-specific attributes and properties from it.
 * This function iterates through a configuration of framework-specific identifiers and cleans the node
 * and its descendants.
 *
 * @param node The DOM node to be cleaned.
 * @returns A deep clone of the node with framework-specific attributes and properties removed.
 */
export const removeFrameWorkAttributes = (node: any) => {
    // Create a deep clone of the node to avoid modifying the original DOM element.
    // If cloneNode is not available, it uses the node itself (less safe).
    const copiedNode: any = typeof node?.cloneNode === 'function' ? node.cloneNode(true) : node;

    // Iterate over the framework configurations (e.g., for Angular, React).
    for (const frameWorkConfig of FrameWorkAttributesConfig) {
        // Remove DOM node properties that have an exact match in the configuration.
        for (const ignoreProperty of frameWorkConfig.list.domProperties) {
            if (Object.prototype.hasOwnProperty.call(copiedNode, ignoreProperty)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                delete copiedNode[ignoreProperty];
            }
        }

        // Remove DOM node properties that start with specified prefixes (e.g., '__react').
        for (const prefix of frameWorkConfig.list.domPropertiesStartsWith) {
            for (const key in copiedNode) {
                if (!Object.prototype.hasOwnProperty.call(copiedNode, key)) continue;
                if (key.indexOf(prefix) === 0) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    delete copiedNode[key];
                }
            }
        }

        // Remove attributes defined directly on the element itself.
        const attrList: Attr[] = Array.from((copiedNode?.attributes ?? []) as any);
        for (const attribute of attrList) {
            const name = (attribute as any)?.name ?? attribute;
            // Remove attributes that match the configured list (e.g., 'ng-click').
            if (frameWorkConfig.list.attributes.indexOf(name) !== -1) {
                if (typeof copiedNode?.removeAttribute === 'function') {
                    copiedNode.removeAttribute(name);
                }
            }
            // Also, remove any 'data-*' attributes, which are commonly used by frameworks and libraries.
            if (typeof name === 'string' && name.toLowerCase().startsWith('data-')) {
                if (typeof copiedNode?.removeAttribute === 'function') {
                    copiedNode.removeAttribute(name);
                }
            }
        }

        // Remove configured attributes from all descendant elements.
        for (const removeAttrib of frameWorkConfig.list.attributes) {
            if (typeof copiedNode?.querySelectorAll === 'function') {
                copiedNode.querySelectorAll('[' + removeAttrib + ']').forEach((element: any) => {
                    if (typeof element?.removeAttribute === 'function') {
                        element.removeAttribute(removeAttrib);
                    }
                });
            }
        }

        // Also, remove 'data-*' attributes from all descendant elements.
        if (typeof copiedNode?.querySelectorAll === 'function') {
            copiedNode.querySelectorAll('*').forEach((el: any) => {
                const attrs: Attr[] = Array.from((el?.attributes ?? []) as any);
                for (const a of attrs) {
                    const n = (a as any)?.name ?? a;
                    if (typeof n === 'string' && n.toLowerCase().startsWith('data-')) {
                        if (typeof el?.removeAttribute === 'function') {
                            el.removeAttribute(n);
                        }
                    }
                }
            });
        }
    }

    // Return the cleaned node.
    return copiedNode;
}
