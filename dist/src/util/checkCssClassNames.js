//check css classnames for ignoring
import { CONFIG } from "../config";
export const checkCssClassNames = (node) => {
    var _a;
    let cssClassExist = false;
    if (((_a = CONFIG.ignoreNodesContainingClassNames) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        for (const className of CONFIG.ignoreNodesContainingClassNames) {
            if (node.classList.contains(className)) {
                cssClassExist = true;
            }
        }
    }
    return cssClassExist;
};
//# sourceMappingURL=checkCssClassNames.js.map