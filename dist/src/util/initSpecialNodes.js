var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchSpecialNodes } from "../services/searchService";
import { CONFIG } from "../config";
import { getAllChildren } from "./index";
global.udaSpecialNodes;
/**
 * Initialize special nodes for Udan con.
 * Fetches special nodes for the REST service and sets ignorable classes.
 */
export const initSpecialNodes = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    // Fetch special nodes for REST service
    global.udaSpecialNodes = yield fetchSpecialNodes();
    // Get all children of Uda container
    const children = getAllChildren(document.querySelector(`.${CONFIG.UDA_CONTAINER_CLASS}`));
    // Iterate through each child
    for (let i = 0; i < (children === null || children === void 0 ? void 0 : children.length); i++) {
        try {
            // Check if the child is not excluded and not already ignored
            if (children[i] &&
                !((_c = (_b = (_a = global.udaSpecialNodes) === null || _a === void 0 ? void 0 : _a.exclude) === null || _b === void 0 ? void 0 : _b.tags) === null || _c === void 0 ? void 0 : _c.includes((_f = (_e = (_d = children[i]) === null || _d === void 0 ? void 0 : _d.tagName) === null || _e === void 0 ? void 0 : _e.trim()) === null || _f === void 0 ? void 0 : _f.toLocaleLowerCase())) &&
                children[i].className.indexOf(CONFIG.UDA_CLICK_IGNORE_CLASS) == -1) {
                // Add UDA click ignore class to the child
                children[i].className += " " + CONFIG.UDA_CLICK_IGNORE_CLASS;
            }
        }
        catch (e) {
            // Handle any errors
        }
    }
});
//# sourceMappingURL=initSpecialNodes.js.map