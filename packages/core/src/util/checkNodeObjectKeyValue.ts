import { hasClass } from "./hasClass";

export const checkNodeObjectKeyValue = (
    node: any,
    key: string,
    objectValues: Array<string> = [],
    _checkType: string
): boolean => {
    let exists = false;
    const lowerKey = key?.toLowerCase?.() || '';
    switch (lowerKey) {
        case 'tags': {
            const tag = node?.tagName?.trim?.().toLowerCase?.();
            if (tag && objectValues.includes(tag)) {
                exists = true;
            }
            break;
        }
        case 'classes': {
            try {
                if (node && hasClass(node, objectValues)) {
                    exists = true;
                }
            } catch {
                // ignore
            }
            break;
        }
        case 'attributes': {
            if (node && typeof node.hasAttribute === 'function') {
                for (const attribute of objectValues) {
                    try {
                        if (node.hasAttribute(attribute)) {
                            exists = true;
                            break;
                        }
                    } catch {
                        // ignore and continue
                    }
                }
            }
            break;
        }
        case 'ids': {
            const id = node?.id?.trim?.().toLowerCase?.();
            if (id && objectValues.includes(id)) {
                exists = true;
            }
            break;
        }
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