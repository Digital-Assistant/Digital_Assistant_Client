/**
 * This module contains utility functions for recording user interactions, such as clicks and sequences of interactions.
 *
 * The `recordClicks` function records a single user click, including the session ID and other relevant data.
 *
 * The `updateRecordClicks` function updates the recorded clicks for a session.
 *
 * The `recordSequence` function records a sequence of user interactions, including the user session ID and other relevant data.
 *
 * These functions rely on various helper functions and constants defined in the imported modules, such as `getSessionKey`, `getUserId`, `getNodeInfo`, and `ENDPOINT`.
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

// Extend Window interface to include custom properties
/**
 * Extends the global Window interface to include custom properties:
 * - `isRecording`: a boolean indicating whether user interactions are being recorded
 * - `domJSON`: a reference to the domjson library
 * - `udanSelectedNodes`: a reference to the selected nodes in the user interface
 */
declare global {
  interface Window {
    isRecording: boolean;
    domJSON: any;
    udanSelectedNodes: any;
  }
}

// Record user clicks
/**
 * Records a single user click, including the session ID and other relevant data.
 *
 * @param {any} [request] - An optional request object containing the data to be recorded.
 * @returns {Promise<any>} - A promise that resolves to the result of the API call.
 */
export const recordClicks = async (request?: any) => {
  try {
    // Fetch the session key asynchronously
    request.sessionid = await getSessionKey();
    // Construct the parameters object for the API call
    const parameters = {
      // Set the URL to the ENDPOINT.Record
      url: ENDPOINT.Record,
      // Set the HTTP method to "POST"
      method: "POST",
      // Set the request body to the input request object
      body: request,
    };

    return REST.apiCal(parameters);
  } catch (error) {
    // Log the error using UDAErrorLogger
    UDAErrorLogger.error(`Error in recordClicks: ${error.message}`, error);
    // Re-throw the error to be handled in the calling function
    throw error;
  }
};

// Update recorded clicks
/**
 * Updates a set of recorded user clicks.
 *
 * @param {any} [request] - An optional request object containing the data to be updated.
 * @returns {Promise<any>} - A promise that resolves to the result of the API call.
 */
export const updateRecordClicks = async (request?: any) => {
  try {
    // Set the session ID in the request object
    request.sessionid = await getSessionKey();

    // Create the parameters object with the required properties
    const parameters = {
      // Set the endpoint URL
      url: ENDPOINT.UpdateRecord,

      // Set the HTTP method (default: "POST")
      method: "POST",

      // Set the request body
      body: request,
    };

    // Call the REST API with the parameters
    return REST.apiCal(parameters);
  } catch (error) {
    // Log the error using UDAErrorLogger
    UDAErrorLogger.error(
      `Error in updateRecordClicks: ${error.message}`,
      error
    );
    // Re-throw the error to be handled in the calling function
    throw error;
  }
};

// Record a sequence of user interactions
/**
 * Records a sequence of user interactions.
 *
 * @param {any} [request] - An optional request object containing the data to be recorded.
 * @returns {Promise<any>} - A promise that resolves to the result of the API call.
 */
export const recordSequence = async (request?: any) => {
  try {
    // Check if the request object is provided
    if (!request) {
      // Throw an error if the request object is not provided
      throw new Error("Request object is required");
    }

    // Set the user session ID in the request object
    request.usersessionid = await getUserId();

    // Create the parameters object with the required properties
    const parameters = {
      // Set the endpoint URL
      url: ENDPOINT.RecordSequence,

      // Set the HTTP method (default: "POST")
      method: "POST",

      // Set the request body
      body: request,
    };

    // Call the REST API with the parameters
    return REST.apiCal(parameters);
  } catch (error) {
    // Log the error using UDAErrorLogger
    UDAErrorLogger.error(`Error in recordSequence: ${error.message}`, error);
    // Re-throw the error to be handled in the calling function
    throw error;
  }
};

// Record a single user click event
/**
 * Records a single user click event.
 *
 * @param {any} [request] - An optional request object containing the data to be recorded.
 * @returns {Promise<any>} - A promise that resolves to the result of the API call.
 */
export const userClick = async (request?: any) => {
  try {
    // Check if the request object is provided
    if (!request) {
      // Throw an error if the request object is not provided
      throw new Error("Request object is required");
    }

    // Set the user session ID in the request object
    request.usersessionid = await getUserId();

    // Set the clicked name (current location host) in the request object
    request.clickedname = window.location.host;

    // Create the parameters object with the required properties
    const parameters = {
      // Set the endpoint URL
      url: ENDPOINT.UserClick,

      // Set the HTTP method (default: "PUT")
      method: "PUT",

      // Set the request body
      body: request,
    };

    // Call the REST API with the parameters
    return REST.apiCal(parameters);
  } catch (error) {
    // Log the error using UDAErrorLogger
    UDAErrorLogger.error(`Error in userClick: ${error.message}`, error);
    // Re-throw the error to be handled in the calling function
    throw error;
  }
};

// Delete a recording sequence
/**
 * Deletes a recording sequence.
 *
 * @param {any} [request] - An optional request object containing the data to be deleted.
 * @returns {Promise<any>} - A promise that resolves to the result of the API call.
 */
export const deleteRecording = async (request?: any) => {
  try {
    // Check if the request object is provided
    if (!request) {
      // Throw an error if the request object is not provided
      throw new Error("Request object is required");
    }

    // Set the user session ID in the request object
    request.usersessionid = await getUserId();

    // Create the parameters object with the required properties
    const parameters = {
      // Set the endpoint URL
      url: ENDPOINT.DeleteSequence,

      // Set the HTTP method (default: "POST")
      method: "POST",

      // Set the request body
      body: request,
    };

    // Call the REST API with the parameters
    return REST.apiCal(parameters);
  } catch (error) {
    // Log the error using UDAErrorLogger
    UDAErrorLogger.error(`Error in deleteRecording: ${error.message}`, error);
    // Re-throw the error to be handled in the calling function
    throw error;
  }
};

/**
 * Updates an existing recording sequence.
 *
 * @param {any} [request] - An optional request object containing the data to be updated.
 * @returns {Promise<any>} - A promise that resolves to the result of the API call.
 */
// Update an existing recording
export const updateRecording = async (request?: any) => {
  try {
    // Check if the request object is provided
    if (!request) {
      // Throw an error if the request object is not provided
      throw new Error("Request object is required");
    }

    // Set the user session ID in the request object
    request.usersessionid = await getUserId();

    // Create the parameters object with the required properties
    const parameters = {
      // Set the endpoint URL
      url: ENDPOINT.updateRecordSequence,

      // Set the HTTP method (default: "POST")
      method: "POST",

      // Set the request body
      body: request,
    };

    // Call the REST API with the parameters and await the response
    return await REST.apiCal(parameters);
  } catch (error) {
    // Log the error using UDAErrorLogger
    UDAErrorLogger.error(`Error in updateRecording: ${error.message}`, error);
    // Re-throw the error to be handled in the calling function
    throw error;
  }
};

// Check for profanity in the provided text
/**
 * Checks the provided text for profanity using a configured profanity check API.
 *
 * @param {any} [request] - An optional request object containing the text to be checked for profanity.
 * @returns {Promise<any>} - A promise that resolves to the result of the profanity check API call.
 */
export const profanityCheck = async (request?: any) => {
  try {
    // Check if the request object is provided
    if (!request) {
      // Throw an error if the request object is not provided
      throw new Error("Request object is required");
    }

    // Create a new Headers object
    const headers = new Headers();

    // Set the Content-Type header to "text/plain"
    headers.append("Content-Type", "text/plain");

    // Set the Ocp-Apim-Subscription-Key header to the profanity API key
    headers.append("Ocp-Apim-Subscription-Key", CONFIG.profanity.config.key1);

    // Create the parameters object with the required properties
    const parameters = {
      // Set the endpoint URL
      url: ENDPOINT.ProfanityCheck,

      // Set the HTTP method (default: "POST")
      method: "POST",

      // Set the request body
      body: request,

      // Set the headers
      headers,
    };

    // Call the REST API with the parameters
    return REST.apiCal(parameters);
  } catch (error) {
    // Log the error using UDAErrorLogger
    UDAErrorLogger.error(`Error in profanityCheck: ${error.message}`, error);
    // Re-throw the error to be handled in the calling function
    throw error;
  }
};

// Save click data to a REST service
/**
 * Saves click data to a REST service.
 *
 * @param {any} node - The DOM node that was clicked.
 * @param {string} text - The text content of the clicked node.
 * @param {any} meta - Additional metadata about the clicked node.
 * @returns {Promise<any>} - A promise that resolves to the result of the API call.
 */
export const saveClickData = async (node: any, text: string, meta: any) => {
  try {
    if (!node || !text || !meta) {
      throw new Error("Required parameters are missing");
    }

    // Clone the node to remove circular references
    const processedNode = await node.cloneNode(true);
    console.log(getAbsoluteOffsets(processedNode));

    // Convert node to JSON and add metadata
    let objectData: any = domJSON.toJSON(processedNode, {
      serialProperties: true,
    });
    objectData.meta = meta;

    // Remove unwanted attributes
    delete objectData.node.addedClickRecord;
    delete objectData.node.hasClick;
    delete objectData.node.udaIgnoreChildren;
    delete objectData.node.udaIgnoreClick;

    // Handle special nodes
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

    // Set outerHTML if not available
    if (!objectData.node.outerHTML) {
      objectData.node.outerHTML = node.outerHTML;
    }

    // Add offset and node info
    objectData.offset = getAbsoluteOffsets(node);
    objectData.node.nodeInfo = getNodeInfo(node);

    // Check for screen size availability
    if (
      objectData.node.nodeInfo &&
      (!objectData.node.nodeInfo.screenSize.screen.width ||
        !objectData.node.nodeInfo.screenSize.screen.height)
    ) {
      return false;
    }

    // Handle node type change selection
    const { enableNodeTypeChangeSelection } = CONFIG;
    if (enableNodeTypeChangeSelection) {
      objectData.meta.systemDetected = mapClickedElementToHtmlFormElement(node);
      if (objectData.meta.systemDetected.inputElement !== "others") {
        objectData.meta.selectedElement = objectData.meta.systemDetected;
      }
    }

    UDAConsoleLogger.info(objectData, 3);

    // Prepare data for saving
    let domain = window.location.host;
    const jsonString = TSON.stringify(objectData);
    UDAConsoleLogger.info(jsonString, 1);

    /**
     * Prepares and returns the payload object for saving click data.
     *
     * @param {string} domain - The domain of the current window.
     * @param {string} text - The text content of the clicked node.
     * @param {string} jsonString - The JSON string representation of the object data.
     * @returns {object} - The payload object for saving click data.
     * @throws {Error} - If an error occurs during the process.
     */
    // Return the payload object for saving click data
    return {
      // The domain of the current window
      domain: domain,
      // The path of the current window
      urlpath: window.location.pathname,
      // The text content of the clicked node
      clickednodename: text,
      // Default value for HTML5
      html5: 0,
      // Default value for clicked path
      clickedpath: "",
      // The JSON string representation of the object data
      objectdata: jsonString,
    };
  } catch (error) {
    //log the error using UDAErrorLogger
    UDAErrorLogger.error(`Error in saveClickData: ${error.message}`, error);
    // Re-throw the error to be handled in the calling function
    throw error;
  }
};

// Post recorded sequence data to REST
/**
 * Posts the recorded sequence data to a server.
 *
 * @param {any} request - The request object containing the data to be posted.
 * @returns {Promise<any>} - The response from the server.
 * @throws {Error} - If the request object is not provided or an error occurs during the process.
 */
export const postRecordSequenceData = async (request: any) => {
  try {
    if (!request) {
      throw new Error("Request object is required");
    }
    // Clear the udanSelectedNodes array

    window.udanSelectedNodes = [];
    // Get the user click nodes set from the store
    const userclicknodesSet = getFromStore(CONFIG.RECORDING_SEQUENCE, false);
    // Extract the IDs from the user click nodes set

    const ids = userclicknodesSet.map((item: any) => item.id);
    // Fetch the domain from the window object
    let domain = fetchDomain();
    // Create the payload object with the necessary properties
    const payload = {
      // Get the user session ID
      ...request,
      // set the domain
      domain: domain,
      // set the isIgnored flag (default: 0)
      isIgnored: 0,
      // set the isValid flag (default: 1)
      isValid: 1,
      // set the userclicknodelist (default: comma-separated list of IDs)
      userclicknodelist: ids.join(","),
      // set the userclicknodesSet (default: userclicknodesSet)
      userclicknodesSet,
    };
    return await recordSequence(payload);
  } catch (error) {
    // Log the error using UDAErrorLogger
    UDAErrorLogger.error(
      `Error in postRecordSequenceData: ${error.message}`,
      error
    );
    //Re-throw the error to be handled in the calling function
    throw error;
  }
};

// Record user click data
export const recordUserClickData = async (
  // The type of Click event (default: "sequencerecord")
  clickType = "sequencerecord",
  clickedName = "",
  recordId: number = 0
) => {
  try {
    // Create the payload object with the required properties
    const payload = {
      // Get the user session ID
      usersessionid: await getSessionKey(),

      // Set the clicked name
      clickedname: clickedName,

      // Set the click type
      clicktype: clickType,

      // Set the record ID
      recordid: recordId,
    };

    // Call the userClick function with the payload
    return await userClick(payload);
  } catch (error) {
    // Log the error using UDAErrorLogger
    UDAErrorLogger.error(
      `Error in recordUserClickData: ${error.message}`,
      error
    );
    // Re-throw the error to be handled in the calling function
    throw error;
  }
};
