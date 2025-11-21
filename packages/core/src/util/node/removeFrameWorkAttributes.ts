/***
 * Functionality for removing unwanted attributes from the node properties
 */
import {FrameWorkAttributesConfig} from "./FrameWorkAttributesConfig";

/**
 * Remove properties from the original node
 * @param node
 */
export const removeFrameWorkAttributes = (node: any) => {
    // cloning the node deeply to process it without affecting the original DOM
    const copiedNode: any = typeof node?.cloneNode === 'function' ? node.cloneNode(true) : node;

    for (const frameWorkConfig of FrameWorkAttributesConfig) {
        // deleting DOM node properties (exact match)
        for (const ignoreProperty of frameWorkConfig.list.domProperties) {
            if (Object.prototype.hasOwnProperty.call(copiedNode, ignoreProperty)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                delete copiedNode[ignoreProperty];
            }
        }

        // deleting DOM node properties that start with specified prefixes
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

        // deleting attributes defined on the element itself
        const attrList: Attr[] = Array.from((copiedNode?.attributes ?? []) as any);
        for (const attribute of attrList) {
            const name = (attribute as any)?.name ?? attribute;
            // Remove if matches configured attributes
            if (frameWorkConfig.list.attributes.indexOf(name) !== -1) {
                if (typeof copiedNode?.removeAttribute === 'function') {
                    copiedNode.removeAttribute(name);
                }
            }
            // Additionally remove any data-* attributes which are commonly used by frameworks
            if (typeof name === 'string' && name.toLowerCase().startsWith('data-')) {
                if (typeof copiedNode?.removeAttribute === 'function') {
                    copiedNode.removeAttribute(name);
                }
            }
        }

        // deleting attributes from all descendant elements
        for (const removeAttrib of frameWorkConfig.list.attributes) {
            if (typeof copiedNode?.querySelectorAll === 'function') {
                copiedNode.querySelectorAll('[' + removeAttrib + ']').forEach((element: any) => {
                    if (typeof element?.removeAttribute === 'function') {
                        element.removeAttribute(removeAttrib);
                    }
                });
            }
        }

        // Remove any descendant data-* attributes as well
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

    return copiedNode;
}