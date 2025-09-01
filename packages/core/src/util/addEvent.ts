import {recordUserClick} from "./recordUserClick";

/**
 * Adds event to an element
 * @param node
 * @param eventType
 * @param callback
 * @returns void
 */
export const addEvent = (node: any, eventType: string, callback: Function = null) => {
    if (callback !== null) {
        node.addEventListener(eventType, callback, {once: false});
    } else {
        node.addEventListener(eventType, async function (event: any) {
            await recordUserClick(node, event);
        }, {once: false});
    }
};
