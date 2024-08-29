var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { addClickToNode } from "./addClickToNode";
import { isClickableNode } from "./isClickableNode";
/**
 * Add events to body elements
 */
export const addBodyEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    //exclude content-serving elements from click objects
    let els = document.body.querySelectorAll("*"), len = els === null || els === void 0 ? void 0 : els.length, i = 0;
    for (; i < len; i++) {
        try {
            /**exclude event attachment for selective elements  */
            if (els[i] && isClickableNode(els[i])) {
                addClickToNode(els[i]);
            }
        }
        catch (e) {
        }
    }
});
//# sourceMappingURL=addBodyEvents.js.map