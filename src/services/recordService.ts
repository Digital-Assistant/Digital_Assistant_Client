/**
 * This code imports various modules and utilities used throughout the application, including:
 * - ENDPOINT: configuration for API endpoints
 * - REST: a utility for making API calls
 * - CONFIG: general application configuration
 * - userService: functions for getting the user's session key and user ID
 * - nodeInfo: a utility for getting information about DOM nodes
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
  /**
   * Interface extension for the global `Window` object.
   * - `isRecording`: a boolean indicating whether recording is currently in progress
   * - `domJSON`: a reference to the `domjson` library, which is used for JSON serialization of DOM elements
   */
  interface Window {
    /**
     * Indicates whether recording is currently in progress.
     * This property is used to prevent multiple recordings from being started simultaneously.
     */
    isRecording: boolean;
    /**
     * A reference to the `domjson` library, which is used for JSON serialization of DOM elements.
     * This property is used to serialize the currently selected element when the user clicks on it.
     */
    domJSON: any;
    /**
     * Array to store selected nodes during recording
     */
    udanSelectedNodes: any;
  }
}

/**
 * Makes an API call with the given parameters
 *
 * @param url - The endpoint URL
 * @param method - The HTTP method
 * @param body - Optional request body
 * @param headers - Optional request headers
 * @returns Promise with API response
 */
const makeApiCall = async (url: string, method: string, body?: any, headers?: Headers) => {
  try {
    const parameters = {
      url,
      method,
      ...(body && { body }),
      ...(headers && { headers })
    };

    return REST.apiCal(parameters);
  } catch (error) {
    UDAErrorLogger.error(`Error in API call to ${url}: ${error.message}`, error);
    throw error;
  }
};

/**
 * Records a set of clicks or other user interactions.
 *
 * @param {any} [request] - An object containing the details of the user interactions to be recorded.
 * @returns {Promise<any>} A promise that resolves with the result of the API call to record the interactions.
 */
export const recordClicks = async (request?: any) => {
  try {
    // Retrieve the user's session key
    request.sessionid = await getSessionKey();

    return makeApiCall(ENDPOINT.Record, "POST", request);
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
    return makeApiCall(ENDPOINT.UpdateRecord, "POST", request);
  } catch (error) {
    UDAErrorLogger.error(`Error in updateRecordClicks: ${error.message}`, error);
    throw error;
  }
};

/**
 * Updates the sequence index.
 *
 * @return {Promise<any>} A promise that resolves with the result of the API call.
 * @param id - The sequence ID to update
 */
export const updateSequnceIndex = async (id: number) => {
  try {
    return makeApiCall(ENDPOINT.updateSequenceIndex + id, "POST");
  } catch (error) {
    UDAErrorLogger.error(`Error in updateSequnceIndex: ${error.message}`, error);
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
      throw new Error('Request object is required');
    }

    request.usersessionid = await getUserId();

    if (!request.usersessionid) {
      throw new Error('User session ID could not be retrieved');
    }

    const response = await makeApiCall(ENDPOINT.RecordSequence, "POST", request);
    if (!response) {
      throw new Error('No response received from record sequence API');
    }

    return response;
  } catch (error) {
    UDAConsoleLogger.info('Record Sequence Error:', error);
    return false;
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

    return makeApiCall(ENDPOINT.UserClick, "PUT", request);
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

    return makeApiCall(ENDPOINT.DeleteSequence, "POST", request);
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

    return makeApiCall(ENDPOINT.updateRecordSequence, "POST", request);
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

    if(!CONFIG.profanity.config.key1){
      return request;
    }

    const headers = new Headers();
    headers.append("Content-Type", "text/plain");
    headers.append("Ocp-Apim-Subscription-Key", CONFIG.profanity.config.key1);

    return makeApiCall(ENDPOINT.ProfanityCheck, "POST", request, headers);
  } catch (error) {
    UDAErrorLogger.error(`Error in profanityCheck: ${error.message}`, error);
    throw error;
  }
};

/**
 * Processes a node for click data recording
 *
 * @param node - The DOM node to process
 * @returns The processed node data object
 */
const processNodeForClickData = async (node: any) => {
  // Clone the clicked node to create a new node object.
  const processedNode = await node.cloneNode(true);

  // Convert the processed node to a JSON object
  let objectData: any = domJSON.toJSON(processedNode, {
    serialProperties: true,
  });

  return objectData;
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

    let objectData = await processNodeForClickData(node);

    // Assign the provided meta object
    objectData.meta = meta;

    // Remove unwanted attributes
    delete objectData.node.addedClickRecord;
    delete objectData.node.hasClick;
    delete objectData.node.udaIgnoreChildren;
    delete objectData.node.udaIgnoreClick;

    // Handle special nodes
    if (
        inArray(node.nodeName.toLowerCase(), CONFIG.ignoreNodesFromIndexing) !== -1 &&
        CONFIG.customNameForSpecialNodes.hasOwnProperty(node.nodeName.toLowerCase())
    ) {
      objectData.meta.displayText = CONFIG.customNameForSpecialNodes[node.nodeName.toLowerCase()];
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
  } catch (error) {
    UDAErrorLogger.error(`Error in saveClickData: ${error.message}`, error);
    throw error;
  }
};

/**
 * Prepares record sequence data payload
 *
 * @param request - Base request data
 * @returns Prepared payload with user click nodes
 */
const prepareRecordSequencePayload = async (request: any) => {
  if (!request) {
    throw new Error("Request object is required");
  }

  // Clear the udanSelectedNodes array
  window.udanSelectedNodes = [];

  // Retrieve user click nodes
  const userclicknodesSet = getFromStore(CONFIG.RECORDING_SEQUENCE, false);
  const ids = userclicknodesSet.map((item: any) => item.id);
  const domain = fetchDomain();

  // Construct and return the payload
  return {
    ...request,
    domain,
    isIgnored: 0,
    isValid: 1,
    userclicknodelist: ids.join(","),
    userclicknodesSet,
  };
};

/**
 * To post the recorded user click sequence data to a REST endpoint.
 * @param request - An object containing the data to be sent in the request payload.
 * @returns A promise that resolves with the response from the REST endpoint.
 */
export const postRecordSequenceData = async (request: any) => {
  try {
    const payload = await prepareRecordSequencePayload(request);
    return await recordSequence(payload);
  } catch (error) {
    UDAErrorLogger.error(`Error in postRecordSequenceData: ${error.message}`, error);
    throw error;
  }
};

/**
 * To update the recorded user click sequence data to a REST endpoint.
 * @param request - An object containing the data to be sent in the request payload.
 * @returns A promise that resolves with the response from the REST endpoint.
 */
export const updateRecordSequenceData = async (request: any) => {
  try {
    const payload = await prepareRecordSequencePayload(request);
    return await recordSequence(payload);
  } catch (error) {
    UDAErrorLogger.error(`Error in updateRecordSequenceData: ${error.message}`, error);
    throw error;
  }
};

/**
 * To update click data to REST
 * @returns  promise
 * @param clickType - Type of click event
 * @param clickedName - Name of clicked element
 * @param recordId - Record ID
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

    // Sending events to google analytics
    /*ReactGA.event({
      category: clickType,
      action: clickType,
      label: clickedName,
      value: recordId,
      nonInteraction: true,
      transport: "xhr",
    });*/
    /* Todo Need to add the Analytics recording event */

    return await userClick(payload);
  } catch (error) {
    UDAErrorLogger.error(`Error in recordUserClickData: ${error.message}`, error);
    throw error;
  }
};

/**
 * Fetches status options from the API
 * @param {Object} request - The request object containing category
 * @param {string} request.category - Category for status filtering, defaults to 'sequenceList'
 * @returns {Promise} API response containing status options
 */
export const fetchStatuses = async (request: {category: string} = {category: 'sequenceList'}) => {
  try {
    if (!request.category) {
      throw new Error('Category is required');
    }

    const response = await makeApiCall(
        REST.processArgs(ENDPOINT.statuses, request),
        "GET"
    );

    if (!response) {
      throw new Error('No response received from status API');
    }

    return response;
  } catch (error) {
    UDAConsoleLogger.info('Fetch Status Error:', error);
    console.log(error);
    return Promise.reject(error);
  }
};

