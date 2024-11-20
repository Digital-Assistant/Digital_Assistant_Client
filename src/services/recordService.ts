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
import ReactGA from "react-ga4"; // @ts-ignore
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

    // Prepare the request parameters
    const parameters = {
      // The URL for the API call
      url: ENDPOINT.Record,
      // The HTTP method to use
      method: "POST",
      // The request body
      body: request,
    };

    // Call the API
    return REST.apiCal(parameters);
  } catch (error) {
    // Handle any errors that occurred during the API call
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
    // Retrieve the user's session key
    request.sessionid = await getSessionKey();

    // Prepare the request parameters
    const parameters = {
      // The URL for the API call
      url: ENDPOINT.UpdateRecord,
      // The HTTP method to use
      method: "POST",
      // The request body
      body: request,
    };

    // Call the API
    return REST.apiCal(parameters);
  } catch (error) {
    // Handle any errors that occurred during the API call
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
      // Request object is required
      throw new Error("Request object is required");
    }

    // Get the user's ID
    request.usersessionid = await getUserId();

    // Prepare the request parameters
    const parameters = {
      // The URL for the API call
      url: ENDPOINT.RecordSequence,
      // The HTTP method to use
      method: "POST",
      // The request body
      body: request,
    };

    // Call the API
    return REST.apiCal(parameters);
  } catch (error) {
    // Handle any errors that occurred during the API call
    UDAErrorLogger.error(`Error in recordSequence: ${error.message}`, error);
    // Re-throw the error so it can be handled by the caller
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
      // Request object is required
      throw new Error("Request object is required");
    }

    // Get the user's ID
    request.usersessionid = await getUserId();

    // Set the clicked name to the host of the current page
    request.clickedname = window.location.host;

    // Prepare the request parameters
    const parameters = {
      // The URL for the API call
      url: ENDPOINT.UserClick,
      // The HTTP method to use
      method: "PUT",
      // The request body
      body: request,
    };

    // Call the API
    return REST.apiCal(parameters);
  } catch (error) {
    // Handle any errors that occurred during the API call
    UDAErrorLogger.error(`Error in userClick: ${error.message}`, error);
    // Re-throw the error so it can be handled by the caller
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
      // Request object is required
      throw new Error("Request object is required");
    }

    // Add the user session ID to the request object
    request.usersessionid = await getUserId();

    // Prepare the request parameters
    const parameters = {
      // The URL for the API call
      url: ENDPOINT.DeleteSequence,
      // The HTTP method to use
      method: "POST",
      // The request body
      body: request,
    };

    // Call the API
    return REST.apiCal(parameters);
  } catch (error) {
    // Handle any errors that occurred during the API call
    UDAErrorLogger.error(`Error in deleteRecording: ${error.message}`, error);
    // Re-throw the error so it can be handled by the caller
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
      // Request object is required
      throw new Error("Request object is required");
    }

    // Get the user's ID and add it to the request object
    request.usersessionid = await getUserId();

    // Prepare the request parameters
    const parameters = {
      // The URL for the API call
      url: ENDPOINT.updateRecordSequence,
      // The HTTP method to use
      method: "POST",
      // The request body
      body: request,
    };

    // Call the API
    return await REST.apiCal(parameters);
  } catch (error) {
    // Handle any errors that occurred during the API call
    UDAErrorLogger.error(`Error in updateRecording: ${error.message}`, error);
    // Re-throw the error so it can be handled by the caller
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
      // Request object is required for the profanity check
      throw new Error("Request object is required");
    }

    // Set the Content-Type header to text/plain
    const headers = new Headers();
    headers.append("Content-Type", "text/plain");

    // Set the Ocp-Apim-Subscription-Key header to the profanity API key
    headers.append("Ocp-Apim-Subscription-Key", CONFIG.profanity.config.key1);

    // Prepare the request parameters
    const parameters = {
      // The URL for the API call
      url: ENDPOINT.ProfanityCheck,
      // The HTTP method to use
      method: "POST",
      // The request body
      body: request,
      // The headers to include in the request
      headers,
    };

    // Call the API
    return REST.apiCal(parameters);
  } catch (error) {
    // Handle any errors that occurred during the API call
    UDAErrorLogger.error(`Error in profanityCheck: ${error.message}`, error);
    // Re-throw the error so it can be handled by the caller
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
    // Check if all the required parameters are provided
    if (!node || !text || !meta) {
      throw new Error("Required parameters are missing");
    }

    // node: The clicked HTML element
    // text: The text content of the clicked element
    // meta: The metadata associated with the clicked element
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
    // Clone the clicked node to create a new node object.
    const processedNode = await node.cloneNode(true);

    // Log the absolute offsets of the processed node.
    const absoluteOffsets = getAbsoluteOffsets(processedNode);
    if (absoluteOffsets) {
      console.log(absoluteOffsets);
    }

    // Convert the processed node to a JSON object using the `domJSON.toJSON` function, with the `serialProperties` option set to `true`.
    let objectData: any = domJSON.toJSON(processedNode, {
      serialProperties: true,
    });

    // Assign the provided `meta` object to the `meta` property of the JSON object.
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
    // Remove `addedClickRecord` property from the `objectData.node` object.
    // This property is no longer needed after the click data has been saved.
    delete objectData.node.addedClickRecord;
    // Remove `hasClick` property from the `objectData.node` object.
    // This property is no longer needed after the click data has been saved.
    delete objectData.node.hasClick;
    // Remove `udaIgnoreChildren` property from the `objectData.node` object.
    // This property is no longer needed after the click data has been saved.
    delete objectData.node.udaIgnoreChildren;
    // Remove `udaIgnoreClick` property from the `objectData.node` object.
    // This property is no longer needed after the click data has been saved.
    delete objectData.node.udaIgnoreClick;
    /**
     * Processes the clicked node before saving the click data.
     * - If the clicked node's name is in the `CONFIG.ignoreNodesFromIndexing` list and has a custom name in `CONFIG.customNameForSpecialNodes`, the `displayText` property of the `meta` object is set to the custom name.
     * - If the `outerHTML` property of the `node` object is not set, it is set to the actual outer HTML of the clicked node.
     * - The `offset` property of the `objectData` object is set to the absolute offsets of the clicked node.
     * - The `nodeInfo` property of the `node` object is set to the result of calling the `getNodeInfo` function with the clicked node.
     */
    // If the clicked node is in the ignoreNodesFromIndexing list and has a custom name in customNameForSpecialNodes,
    // set the displayText property of the meta object to the custom name.
    if (
      inArray(node.nodeName.toLowerCase(), CONFIG.ignoreNodesFromIndexing) !==
        -1 &&
      CONFIG.customNameForSpecialNodes.hasOwnProperty(
        node.nodeName.toLowerCase()
      )
    ) {
      // Set the displayText property to the custom name for special nodes.
      objectData.meta.displayText =
        CONFIG.customNameForSpecialNodes[node.nodeName.toLowerCase()];
    }

    // If the outerHTML property of the node object is not set, set it to the actual outer HTML of the clicked node.
    if (!objectData.node.outerHTML) {
      // Set the outerHTML property to the actual outer HTML of the clicked node.
      objectData.node.outerHTML = node.outerHTML;
    }

    // Set the offset property of the objectData object to the absolute offsets of the clicked node.
    objectData.offset = getAbsoluteOffsets(node);
    // Set the nodeInfo property of the node object to the result of calling the getNodeInfo function with the clicked node.
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
    // If the screen size information is not available in the node's metadata, return false to indicate that the click data should not be saved.
    if (
      objectData.node.nodeInfo &&
      (!objectData.node.nodeInfo.screenSize.screen.width ||
        !objectData.node.nodeInfo.screenSize.screen.height)
    ) {
      return false;
    }

    const { enableNodeTypeChangeSelection } = CONFIG;

    // If the enableNodeTypeChangeSelection configuration is enabled, map the clicked element to an HTML form element and update the meta object accordingly.
    if (enableNodeTypeChangeSelection) {
      objectData.meta.systemDetected = mapClickedElementToHtmlFormElement(node);
      // If the system detected input element is not "others", set the selected element to the system detected input element.
      if (objectData.meta.systemDetected.inputElement !== "others") {
        objectData.meta.selectedElement = objectData.meta.systemDetected;
      }
    }

    // Log the object data to the console with a log level of 3.
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
    // Get the domain from the window's location object.
    let domain = window.location.host;
    // Serialize the object data to a JSON string using JSON.stringify.
    const jsonString = JSON.stringify(objectData);

    // Log the JSON string to the console with a log level of 1.
    UDAConsoleLogger.info(jsonString, 1);

    // Return an object containing the domain, URL path, clicked node name, HTML5 flag, clicked path, and the serialized object data.
    return {
      // The domain of the current web page.
      domain: domain,
      // The URL path of the current web page.
      urlpath: window.location.pathname,
      // The name or text content of the clicked node.
      clickednodename: text,
      // A flag indicating whether the clicked node is an HTML5 element.
      html5: 0,
      // The path of the clicked node (empty string by default).
      clickedpath: "",
      // The serialized object data as a JSON string.
      objectdata: jsonString,
    };
  } catch (error) {
    // Log any errors that occur during the saving process to the console with a log level of 1.
    UDAErrorLogger.error(`Error in saveClickData: ${error.message}`, error);
    // Rethrow the error to allow the calling code to handle it.
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
    // Throw an error if the request object is undefined or null.
    if (!request) {
      throw new Error("Request object is required");
    }

    // Clear the udanSelectedNodes array at the beginning of each call.
    window.udanSelectedNodes = [];
    // Retrieve the user click node set from the store.
    const userclicknodesSet = getFromStore(CONFIG.RECORDING_SEQUENCE, false);
    // Get the IDs of the user click nodes and join them into a comma-separated string.
    const ids = userclicknodesSet.map((item: any) => item.id);
    // Get the domain of the current web page.
    let domain = fetchDomain();
    // Construct the payload object by merging the request object and the other properties.
    const payload = {
      ...request,
      domain: domain,
      // Set the ignored status to 0 (false) by default.
      isIgnored: 0,
      // Set the validity status to 1 (true) by default.
      isValid: 1,
      // Use the comma-separated string of user click node IDs.
      userclicknodelist: ids.join(","),
      // Pass the user click node set as an array of objects.
      userclicknodesSet,
    };
    // Call the recordSequence function with the constructed payload and return the result.
    return await recordSequence(payload);
  } catch (error) {
    // Log any errors that occur to the console with a log level of 1.
    UDAErrorLogger.error(
      `Error in postRecordSequenceData: ${error.message}`,
      error
    );
    // Rethrow the error to allow the calling code to handle it.
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

    // Sending events to google analytics
    ReactGA.event({
      category: clickType,
      action: clickType,
      label: clickedName,
      value: recordId,
      nonInteraction: true,
      transport: "xhr",
    });

    return await userClick(payload);
  } catch (error) {
    // Log any errors that occur to the console with a log level of 1.
    UDAErrorLogger.error(
      `Error in recordUserClickData: ${error.message}`,
      error
    );
    // Rethrow the error to allow the calling code to handle it.
    throw error;
  }
};
