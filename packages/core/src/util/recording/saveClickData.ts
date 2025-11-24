import {inArray} from "../inArray";
import {processNodeForClickData} from "../node/processNodeForClickData"
import {CONFIG} from "../../config";
import {getNodeInfo, nodeConfig} from "../node";
import { getAbsoluteOffsets } from "../node/getAbsoluteOffsets";
import mapClickedElementToHtmlFormElement from "./mapClickedElementToHtmlFormElement";
import {UDAConsoleLogger, UDAErrorLogger} from "../error/error-log";

/**
 * Saves click data for a given node to be sent to a REST service.
 * This function processes the clicked node, extracts relevant information,
 * and formats it into a structured object suitable for recording user interactions.
 *
 * @param node The clicked HTML element.
 * @param text The text content or label associated with the clicked element.
 * @param meta The metadata associated with the clicked element, including system-detected properties.
 * @returns A promise that resolves to the formatted click data object.
 * @throws Error if required parameters are missing.
 */
export const saveClickData = async (node: any, text: string, meta: any) => {
    try {
        if (!node || !text || !meta) {
            throw new Error("Required parameters are missing");
        }

        // Process the node to get its JSON representation.
        let objectData: any = await processNodeForClickData(node);

        // Assign the provided meta object to the processed node data.
        objectData.meta = meta;

        // Remove unwanted attributes that are internal to the recording process.
        delete objectData.node.addedClickRecord;
        delete objectData.node.hasClick;
        delete objectData.node.udaIgnoreChildren;
        delete objectData.node.udaIgnoreClick;

        // Handle special nodes by assigning a custom display text if configured.
        if (
            inArray(node.nodeName.toLowerCase(), nodeConfig.ignoreNodesFromIndexing) &&
            nodeConfig.customNameForSpecialNodes.hasOwnProperty(node.nodeName.toLowerCase())
        ) {
            // @ts-ignore
            objectData.meta.displayText = nodeConfig.customNameForSpecialNodes[node.nodeName.toLowerCase()];
        }

        // Set additional properties like outerHTML if not already present.
        if (!objectData.node.outerHTML) {
            objectData.node.outerHTML = node.outerHTML;
        }

        // Get absolute offsets and node information for accurate positioning.
        objectData.offset = getAbsoluteOffsets(node);
        objectData.node.nodeInfo = getNodeInfo(node);

        // Check for valid screen size information; if missing, return false to prevent saving incomplete data.
        if (
            objectData.node.nodeInfo &&
            (!objectData.node.nodeInfo.screenSize.screen.width ||
                !objectData.node.nodeInfo.screenSize.screen.height)
        ) {
            return false;
        }

        // If node type detection is enabled, map the clicked element to an HTML form element type.
        const { enableNodeTypeChangeSelection } = CONFIG;
        if (enableNodeTypeChangeSelection) {
            objectData.meta.systemDetected = mapClickedElementToHtmlFormElement(node);
            // If a specific input element type is detected (not 'others'), set it as the selected element.
            if (objectData.meta.systemDetected.inputElement !== "others") {
                objectData.meta.selectedElement = objectData.meta.systemDetected;
            }
        }

        UDAConsoleLogger.info(objectData, 3);

        // Serialize the processed data to a JSON string.
        const jsonString = JSON.stringify(objectData);
        UDAConsoleLogger.info(jsonString, 1);

        // Return the final formatted data object.
        return {
            domain: window.location.host,
            urlpath: window.location.pathname,
            clickednodename: text,
            html5: 0, // Legacy field, typically 0.
            clickedpath: "", // Legacy field, typically empty.
            objectdata: jsonString,
        };
    } catch (error: any) {
        // Log any errors that occur during the process.
        UDAErrorLogger.error(`Error in saveClickData: ${error.message}`, error);
        throw error; // Re-throw the error to indicate failure.
    }
};
