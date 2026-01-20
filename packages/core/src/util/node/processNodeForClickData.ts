// This module provides a function to process a DOM node for click data recording.
// It clones the node and converts it to a JSON object for serialization.

/**
 * Processes a DOM node to generate a serializable JSON object for click data recording.
 * This function clones the provided node to avoid modifying the original DOM and then
 * converts the clone into a JSON representation.
 *
 * Note: Uses dynamic import to avoid loading domjson in service worker contexts.
 *
 * @param node The DOM node to process.
 * @returns A promise that resolves to the JSON object representation of the node.
 */
export const processNodeForClickData = async (node: any) => {
    // Clone the clicked node to create a new, independent node object.
    const processedNode = await node.cloneNode(true);

    // Dynamic import to avoid loading domjson in service workers
    // @ts-ignore
    const domJSON = await import("domjson");
    const domJSONModule = domJSON.default || domJSON;

    // Convert the cloned node to a JSON object, including its serializable properties.
    let objectData: any = domJSONModule.toJSON(processedNode, {
        serialProperties: true,
    });

    console.log(objectData);

    return objectData;
};
