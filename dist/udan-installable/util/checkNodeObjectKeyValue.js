import { hasClass } from "./hasClass";
export const checkNodeObjectKeyValue = (node, key, objectValues, checkType) => {
    var _a;
    let exists = false;
    switch (key.toLowerCase()) {
        case 'tags':
            if (objectValues.includes((_a = node === null || node === void 0 ? void 0 : node.tagName) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase())) {
                exists = true;
            }
            break;
        case 'classes':
            if (hasClass(node, objectValues)) {
                exists = true;
            }
            break;
        case 'attributes':
            attributeLoop: for (const attribute of objectValues) {
                if (node.hasAttribute(attribute)) {
                    exists = true;
                    break attributeLoop;
                }
            }
            break;
        case 'ids':
            if (node.id && objectValues.includes(node.id.trim().toLowerCase())) {
                exists = true;
            }
            break;
    }
    return exists;
};
