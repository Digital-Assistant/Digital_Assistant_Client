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
 * To record set of actions/events belong to one recording
 * @param request
 * @returns promise
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
 * To record set of actions/events belong to one recording
 * @param request
 * @returns promise
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
 * To check profanity validation/filters for sequence name/labels
 * @param request
 * @returns promise
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
 * To save click data to REST
 * @param node HTMLElement
 * @param text
 * @param meta
 * @returns promise
 */
export const saveClickData = async (node: any, text: string, meta: any) => {
  try {
    if (!node || !text || !meta) {
      throw new Error("Required parameters are missing");
    }

    // removing circular reference before converting to json with deep clone.
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
    delete objectData.node.addedClickRecord;
    delete objectData.node.hasClick;
    delete objectData.node.udaIgnoreChildren;
    delete objectData.node.udaIgnoreClick;

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
