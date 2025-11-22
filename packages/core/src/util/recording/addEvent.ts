import {recordUserClick} from "./recordUserClick";

/**
 * Attaches an event listener to a given DOM node.
 * If a callback function is provided, it will be used as the event handler.
 * Otherwise, a default handler that records user clicks will be attached.
 *
 * @param node The DOM node to which the event listener will be added.
 * @param eventType The type of event to listen for (e.g., 'click', 'mouseover').
 * @param callback An optional function to serve as the event handler. If null, a default click recorder is used.
 */
export const addEvent = (node: any, eventType: string, callback: (Function | null) = null) => {
    if (callback !== null) {
        // If a custom callback is provided, attach it to the node.
        node.addEventListener(eventType, callback, {once: false});
    } else {
        // If no custom callback, attach a default handler to record user clicks.
        node.addEventListener(eventType, async function (event: any) {
            console.log('Clicked on: '+node.nodeName);
            await recordUserClick(node, event);
        }, {once: false});
    }
};
