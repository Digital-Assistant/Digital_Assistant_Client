var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { recordUserClick } from "./recordUserClick";
/**
 * Adds event to an element
 * @param node
 * @param eventType
 * @param callback
 * @returns void
 */
export const addEvent = (node, eventType, callback = null) => {
    if (callback !== null) {
        node.addEventListener(eventType, callback, { once: false });
    }
    else {
        node.addEventListener(eventType, function (event) {
            return __awaiter(this, void 0, void 0, function* () {
                yield recordUserClick(node, event);
            });
        }, { once: false });
    }
};
