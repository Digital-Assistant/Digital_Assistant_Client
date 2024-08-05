/**
 * This code imports various modules and utilities used throughout the application, including:
 * - ENDPOINT: configuration for API endpoints
 * - REST: a utility for making API calls
 * - CONFIG: general application configuration
 * - userService: functions for getting the user's session key and user ID
 * - nodeInfo: a utility for getting information about DOM nodes
 * - TSON: a library for serializing TypeScript objects to JSON
 * - various utility functions for working with DOM elements and data storage
 * - a function for mapping clicked elements to HTML form elements
 * - logging utilities for console and error logging
 * - a function for fetching the current domain
 */
import { ENDPOINT } from "../config/endpoints";
import { REST } from ".";
import { CONFIG } from "../config";
import { getSessionKey, getUserId } from "./userService";
import { getNodeInfo } from "../util/nodeInfo";
import TSON from "typescript-json";
import { getAbsoluteOffsets, getFromStore, inArray } from "../util";
import domJSON from "domjson";
import mapClickedElementToHtmlFormElement from "../util/recording-utils/mapClickedElementToHtmlFormElement";
import { UDAConsoleLogger, UDAErrorLogger } from "../config/error-log";
import { fetchDomain } from "../util/fetchDomain";

/**
 * Extends the global `Window` interface to include two properties:
 * - `isRecording`: a boolean indicating whether recording is currently in progress
 * - `domJSON`: a reference to the `domjson` library, which is used for JSON serialization of DOM elements
 */
declare global {
  interface Window {
    isRecording: boolean;
    domJSON: any;
  }
}

/**
 * To record each action/event
 * @param request
 * @returns promise
 */

/**
 * Records a set of clicks or other user interactions.
 *
 * @param {any} request - An object containing the details of the user interactions to be recorded.
 * @returns {Promise<any>} A promise that resolves with the result of the API call to record the interactions.
 */
export const recordClicks = async (request?: any) => {
  try {
    request.sessionid = await getSessionKey();
    const parameters = {
      url: ENDPOINT.Record,
      method: "POST",
      body: request,
    };
    return REST.apiCal(parameters);
  } catch (error) {
    UDAErrorLogger.error(`Error in recordClicks: ${error.message}`, error);
    throw error;
  }
};

/**
 * Updates the record clicks.
 *
 * @param {any} request - The request object.
 * @return {Promise<any>} A promise that resolves with the result of the API call.
 */

export const updateRecordClicks = async (request?: any) => {
  try {
    request.sessionid = await getSessionKey();
    const parameters = {
      url: ENDPOINT.UpdateRecord,
      method: "POST",
      body: request,
    };

    return REST.apiCal(parameters);
  } catch (error) {
    UDAErrorLogger.error(
      `Error in updateRecordClicks: ${error.message}`,
      error
    );
    throw error;
  }
};

/**
 * Records a sequence of user interactions.
 *
 * @param request - An object containing the data required to record the sequence of user interactions.
 * @returns A promise that resolves when the sequence of user interactions has been recorded.
 */
export const recordSequence = async (request?: any) => {
  try {
    if (!request) {
      throw new Error("Request object is required");
    }

    request.usersessionid = await getUserId();
    const parameters = {
      url: ENDPOINT.RecordSequence,
      method: "POST",
      body: request,
    };
    return REST.apiCal(parameters);
  } catch (error) {
    UDAErrorLogger.error(`Error in recordSequence: ${error.message}`, error);
    throw error;
  }
};

/**
 * Records a user click event.
 *
 * @param request - An object containing the data required to record the user click event.
 * @returns A promise that resolves when the user click event has been recorded.
 */
export const userClick = async (request?: any) => {
  try {
    if (!request) {
      throw new Error("Request object is required");
    }

    request.usersessionid = await getUserId();
    request.clickedname = window.location.host;
    const parameters = {
      url: ENDPOINT.UserClick,
      method: "PUT",
      body: request,
    };
    return REST.apiCal(parameters);
  } catch (error) {
    UDAErrorLogger.error(`Error in userClick: ${error.message}`, error);
    throw error;
  }
};

/**
 * Deletes a recording sequence.
 *
 * @param request - An object containing the data required to delete the recording sequence.
 * @returns A promise that resolves when the recording sequence has been deleted.
 */
export const deleteRecording = async (request?: any) => {
  try {
    if (!request) {
      throw new Error("Request object is required");
    }

    request.usersessionid = await getUserId();
    const parameters = {
      url: ENDPOINT.DeleteSequence,
      method: "POST",
      body: request,
    };
    return REST.apiCal(parameters);
  } catch (error) {
    UDAErrorLogger.error(`Error in deleteRecording: ${error.message}`, error);
    throw error;
  }
};

/**
 * Updates an existing recording session.
 *
 * @param request - An object containing the data to update the recording session.
 * @returns A promise that resolves when the recording session has been updated.
 */
export const updateRecording = async (request?: any) => {
  try {
    if (!request) {
      throw new Error("Request object is required");
    }

    request.usersessionid = await getUserId();
    const parameters = {
      url: ENDPOINT.updateRecordSequence,
      method: "POST",
      body: request,
    };
    return await REST.apiCal(parameters);
  } catch (error) {
    UDAErrorLogger.error(`Error in updateRecording: ${error.message}`, error);
    throw error;
  }
};

/**
 * Checks for profanity in the provided request object.
 *
 * @param request - The request object containing the text to be checked for profanity.
 * @returns A promise that resolves with the profanity check result.
 */
export const profanityCheck = async (request?: any) => {
  try {
    if (!request) {
      throw new Error("Request object is required");
    }

    const headers = new Headers();
    headers.append("Content-Type", "text/plain");
    headers.append("Ocp-Apim-Subscription-Key", CONFIG.profanity.config.key1);
    const parameters = {
      url: ENDPOINT.ProfanityCheck,
      method: "POST",
      body: request,
      headers,
    };
    return REST.apiCal(parameters);
  } catch (error) {
    UDAErrorLogger.error(`Error in profanityCheck: ${error.message}`, error);
    throw error;
  }
};

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

    // removing circular reference before converting to json with deep clone.
    /**
     * Processes the clicked node and creates a JSON representation of it, including its metadata.
     * - Clones the clicked node to create a new node object.
     * - Logs the absolute offsets of the processed node.
     * - Converts the processed node to a JSON object using the `domJSON.toJSON` function, with the `serialProperties` option set to `true`.
     * - Assigns the provided `meta` object to the `meta` property of the JSON object.
     *
     * @param {any} node - The clicked node.
     * @param {string} text - The text content of the clicked node.
     * @param {any} meta - The metadata associated with the clicked node.
     * @returns {any} - The processed JSON object containing the node information and metadata.
     */
    const processedNode = await node.cloneNode(true);

    console.log(getAbsoluteOffsets(processedNode));

    let objectData: any = domJSON.toJSON(processedNode, {
      serialProperties: true,
    });
    if (objectData.meta) {
      objectData.meta = meta;
    } else {
      objectData.meta = meta;
    }

    //removing the unwanted attributes which were added while processing click objects.
    /**
     * Removes certain properties from the `objectData.node` object before saving the click data.
     * - `addedClickRecord`: This property is removed to prevent duplicate click data from being saved.
     * - `hasClick`: This property is removed as it is no longer needed after the click data has been saved.
     * - `udaIgnoreChildren`: This property is removed as it is no longer needed after the click data has been saved.
     * - `udaIgnoreClick`: This property is removed as it is no longer needed after the click data has been saved.
     */
    delete objectData.node.addedClickRecord;
    delete objectData.node.hasClick;
    delete objectData.node.udaIgnoreChildren;
    delete objectData.node.udaIgnoreClick;

    /**
     * Processes the clicked node before saving the click data.
     * - If the clicked node's name is in the `CONFIG.ignoreNodesFromIndexing` list and has a custom name in `CONFIG.customNameForSpecialNodes`, the `displayText` property of the `meta` object is set to the custom name.
     * - If the `outerHTML` property of the `node` object is not set, it is set to the actual outer HTML of the clicked node.
     * - The `offset` property of the `objectData` object is set to the absolute offsets of the clicked node.
     * - The `nodeInfo` property of the `node` object is set to the result of calling the `getNodeInfo` function with the clicked node.
     */
    if (
      inArray(node.nodeName.toLowerCase(), CONFIG.ignoreNodesFromIndexing) !==
        -1 &&
      CONFIG.customNameForSpecialNodes.hasOwnProperty(
        node.nodeName.toLowerCase()
      )
    ) {
      objectData.meta.displayText =
        CONFIG.customNameForSpecialNodes[node.nodeName.toLowerCase()];
    }

    if (!objectData.node.outerHTML) {
      objectData.node.outerHTML = node.outerHTML;
    }

    objectData.offset = getAbsoluteOffsets(node);
    objectData.node.nodeInfo = getNodeInfo(node);

    // Added to handle the case where screen size is not available
    /**
     * Handles the case where the screen size information is not available in the node's metadata.
     * If the screen size is not available, the function returns `false` to indicate that the click data should not be saved.
     * Otherwise, it checks if the `enableNodeTypeChangeSelection` configuration is enabled, and if so, it maps the clicked element to an HTML form element and updates the `meta` object accordingly.
     * Finally, it logs the `objectData` to the console with a log level of 3.
     *
     * @param {any} objectData - The object containing the data to be saved, including the node information and metadata.
     * @returns {boolean} - `false` if the screen size information is not available, `true` otherwise.
     */
    if (
      objectData.node.nodeInfo &&
      (!objectData.node.nodeInfo.screenSize.screen.width ||
        !objectData.node.nodeInfo.screenSize.screen.height)
    ) {
      return false;
    }

    const { enableNodeTypeChangeSelection } = CONFIG;

    if (enableNodeTypeChangeSelection) {
      objectData.meta.systemDetected = mapClickedElementToHtmlFormElement(node);
      if (objectData.meta.systemDetected.inputElement !== "others") {
        objectData.meta.selectedElement = objectData.meta.systemDetected;
      }
    }

    UDAConsoleLogger.info(objectData, 3);

    // let domain = fetchDomain();
    /**
     * To save the user's click data to a REST endpoint.
     * @param clickType - The type of click event being recorded (e.g. "sequencerecord").
     * @param clickedName - The name or text content of the clicked element.
     * @param recordId - The ID of the record being updated (default is 0).
     * @returns An object containing the domain, URL path, clicked node name, HTML5 flag, clicked path, and the serialized object data.
     * @throws An error if there is a problem saving the click data.
     */
    let domain = window.location.host;
    const jsonString = TSON.stringify(objectData);

    UDAConsoleLogger.info(jsonString, 1);

    return {
      domain: domain,
      urlpath: window.location.pathname,
      clickednodename: text,
      html5: 0,
      clickedpath: "",
      objectdata: jsonString,
    };
  } catch (error) {
    UDAErrorLogger.error(`Error in saveClickData: ${error.message}`, error);
    throw error;
  }
};

/**
 * * To post click sequence data to REST
 * @param request
 * @returns promise
 */
/**
 * To post the recorded user click sequence data to a REST endpoint.
 * @param request - An object containing the data to be sent in the request payload.
 * @returns A promise that resolves with the response from the REST endpoint.
 */
export const postRecordSequenceData = async (request: any) => {
  try {
    if (!request) {
      throw new Error("Request object is required");
    }

    window.udanSelectedNodes = [];
    const userclicknodesSet = getFromStore(CONFIG.RECORDING_SEQUENCE, false);
    const ids = userclicknodesSet.map((item: any) => item.id);
    let domain = fetchDomain();
    const payload = {
      ...request,
      domain: domain,
      isIgnored: 0,
      isValid: 1,
      userclicknodelist: ids.join(","),
      userclicknodesSet,
    };
    return await recordSequence(payload);
  } catch (error) {
    UDAErrorLogger.error(
      `Error in postRecordSequenceData: ${error.message}`,
      error
    );
    throw error;
  }
};

/**
 * To update click data to REST
 * @returns  promise
 * @param request
 */
export const recordUserClickData = async (
  clickType = "sequencerecord",
  clickedName = "",
  recordId: number = 0
) => {
  try {
    const payload = {
      usersessionid: await getSessionKey(),
      clickedname: clickedName,
      clicktype: clickType,
      recordid: recordId,
    };
    return await userClick(payload);
  } catch (error) {
    UDAErrorLogger.error(
      `Error in recordUserClickData: ${error.message}`,
      error
    );
    throw error;
  }
};
