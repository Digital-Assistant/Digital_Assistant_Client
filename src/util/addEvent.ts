/**
 * Adds event to an element
 * @param node
 * @param eventType
 * @param callback
 * @returns void
 */
export const addEvent = (node: any, eventType: string, callback: Function) => {
  node.addEventListener(eventType, callback, {once: true});
};
