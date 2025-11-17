import {inArray} from "../inArray";
import {processNodeForClickData} from "../node/processNodeForClickData"
import {CONFIG} from "../../config";
import {getNodeInfo, nodeConfig} from "../node";
import { getAbsoluteOffsets } from "../node/getAbsoluteOffsets";
import mapClickedElementToHtmlFormElement from "./mapClickedElementToHtmlFormElement";
import {UDAConsoleLogger, UDAErrorLogger} from "../error/error-log";
/**
 * Saves click data to a REST service.
 *
 * @param node - The clicked HTML element.
 * @param text - The text content of the clicked element.
 * @param meta - The metadata associated with the clicked element.
 * @returns A promise that resolves when the click data has been saved.
 */
export const saveClickData = async (node: any, text: string, meta: any) => {
    try {
        if (!node || !text || !meta) {
            throw new Error("Required parameters are missing");
        }

        let objectData: any = await processNodeForClickData(node);

        // Assign the provided meta object
        objectData.meta = meta;

        // Remove unwanted attributes
        delete objectData.node.addedClickRecord;
        delete objectData.node.hasClick;
        delete objectData.node.udaIgnoreChildren;
        delete objectData.node.udaIgnoreClick;

        // Handle special nodes
        if (
            inArray(node.nodeName.toLowerCase(), nodeConfig.ignoreNodesFromIndexing) !== -1 &&
            nodeConfig.customNameForSpecialNodes.hasOwnProperty(node.nodeName.toLowerCase())
        ) {
            // @ts-ignore
            objectData.meta.displayText = nodeConfig.customNameForSpecialNodes[node.nodeName.toLowerCase()];
        }

        // Set additional properties
        if (!objectData.node.outerHTML) {
            objectData.node.outerHTML = node.outerHTML;
        }

        objectData.offset = getAbsoluteOffsets(node);
        objectData.node.nodeInfo = getNodeInfo(node);

        // Check screen size information
        if (
            objectData.node.nodeInfo &&
            (!objectData.node.nodeInfo.screenSize.screen.width ||
                !objectData.node.nodeInfo.screenSize.screen.height)
        ) {
            return false;
        }

        // Handle node type detection if enabled
        const { enableNodeTypeChangeSelection } = CONFIG;
        if (enableNodeTypeChangeSelection) {
            objectData.meta.systemDetected = mapClickedElementToHtmlFormElement(node);
            if (objectData.meta.systemDetected.inputElement !== "others") {
                objectData.meta.selectedElement = objectData.meta.systemDetected;
            }
        }

        UDAConsoleLogger.info(objectData, 3);

        // Serialize the data
        const jsonString = JSON.stringify(objectData);
        UDAConsoleLogger.info(jsonString, 1);

        // Return the formatted data
        return {
            domain: window.location.host,
            urlpath: window.location.pathname,
            clickednodename: text,
            html5: 0,
            clickedpath: "",
            objectdata: jsonString,
        };
    } catch (error: any) {
        UDAErrorLogger.error(`Error in saveClickData: ${error.message}`, error);
        throw error;
    }
};