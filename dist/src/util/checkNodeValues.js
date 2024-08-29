import { checkNodeObjectKeyValue } from "./checkNodeObjectKeyValue";
export const checkNodeValues = (node, checkType) => {
    let exists = false;
    if (udaSpecialNodes[checkType] && node) {
        checkNodeLoop: for (const key in udaSpecialNodes[checkType]) {
            if (checkNodeObjectKeyValue(node, key, udaSpecialNodes[checkType][key], checkType)) {
                exists = true;
                break checkNodeLoop;
            }
        }
    }
    return exists;
};
//# sourceMappingURL=checkNodeValues.js.map