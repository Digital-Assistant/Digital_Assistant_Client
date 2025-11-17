// @ts-ignore
import domJSON from "domjson";

/**
 * Processes a node for click data recording
 *
 * @param node - The DOM node to process
 * @returns The processed node data object
 */
export const processNodeForClickData = async (node: any) => {
    // Clone the clicked node to create a new node object.
    const processedNode = await node.cloneNode(true);

    // Convert the processed node to a JSON object
    let objectData: any = domJSON.toJSON(processedNode, {
        serialProperties: true,
    });

    console.log(objectData);

    return objectData;
};