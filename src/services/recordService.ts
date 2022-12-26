import {ENDPOINT} from "../config/endpoints";
import {REST} from ".";
import {CONFIG} from "../config";
import {getSessionKey, getUserId} from "./userService";
import {getNodeInfo} from "../util/nodeInfo";
import TSON from "typescript-json";
import {getAbsoluteOffsets, getFromStore, inArray} from "../util";
import domJSON from "domjson";

/**
 * To record each action/event
 * @param request
 * @returns promise
 */

export const recordClicks = async (request?: any) => {
  request.sessionid = await getSessionKey();
  const parameters = {
    url: ENDPOINT.RECORD,
    method: "POST",
    body: request,
  };
  return REST.apiCal(parameters);
};

/**
 * To record each action/event
 * @param request
 * @returns promise
 */

export const updateRecordClicks = async (request?: any) => {
  request.sessionid = await getSessionKey();
  const parameters = {
    url: ENDPOINT.UPDATE_RECORD,
    method: "POST",
    body: request,
  };
  return REST.apiCal(parameters);
};

/**
 * To record set of actions/events belong to one recording
 * @param request
 * @returns promise
 */

export const recordSequence = async (request?: any) => {
  request.usersessionid = await getUserId();
  const parameters = {
    url: ENDPOINT.RECORD_SEQUENCE,
    method: "POST",
    body: request,
  };
  return REST.apiCal(parameters);
};

/**
 * To record set of actions/events belong to one recording
 * @param request
 * @returns promise
 */

export const userClick = async (request?: any) => {
  request.usersessionid = await getUserId();
  request.clickedname = window.location.host;
  const parameters = {
    url: ENDPOINT.USER_CLICK,
    method: "PUT",
    body: request,
  };
  return REST.apiCal(parameters);
};

export const deleteRecording = async (request?: any) => {
  request.usersessionid = await getUserId();
  const parameters = {
    url: ENDPOINT.DELETE_SEQUENCE,
    method: "POST",
    body: request,
  };
  return REST.apiCal(parameters);
};

/**
 * To vote/de-vote the recording
 * @param request
 * @param type
 * @returns promise
 */

export const vote = async (request?: any, type?: string) => {
  let usersessionid = await getUserId();
  const payload = {
    usersessionid: usersessionid,
    sequenceid: request.id,
    upvote: type == "up" ? 1 : 0,
    downvote: type == "down" ? 1 : 0,
  };

  const parameters = {
    url: ENDPOINT.VOTE_RECORD,
    method: "POST",
    body: payload,
  };
  return REST.apiCal(parameters);
};

/**
 * To check profanity validation/filters for sequence name/labels
 * @param request
 * @returns promise
 */

export const profanityCheck = async (request?: any) => {
  const headers = new Headers();
  headers.append("Content-Type", "text/plain");
  headers.append("Ocp-Apim-Subscription-Key", CONFIG.profanity.config.key1);
  const parameters = {
    url: ENDPOINT.PROFANITY_CHECK,
    method: "POST",
    body: request,
    headers,
  };
  return REST.apiCal(parameters);
};

/**
 * To post click data to REST
 * @param node HTMLElement
 * @param text
 * @returns promise
 */
export const postClickData = async (node: HTMLElement, text: string, meta: any) => {
  let objectData: any = domJSON.toJSON(node, {serialProperties: true});
  if (objectData.meta) {
    objectData.meta = meta;
  } else {
    objectData.meta = meta;
  }

  //removing the unwanted attributes which were added while processing click objects.
  delete(objectData.node.addedClickRecord);
  delete(objectData.node.hasClick);
  delete(objectData.node.udaIgnoreChildren);
  delete(objectData.node.udaIgnoreClick);

  if (inArray(node.nodeName.toLowerCase(), CONFIG.ignoreNodesFromIndexing) !== -1 && CONFIG.customNameForSpecialNodes.hasOwnProperty(node.nodeName.toLowerCase())) {
    objectData.meta.displayText = CONFIG.customNameForSpecialNodes[node.nodeName.toLowerCase()];
  }

  if (!objectData.node.outerHTML) {
    objectData.node.outerHTML = node.outerHTML;
  }

  objectData.offset = getAbsoluteOffsets(node);
  objectData.node.nodeInfo = getNodeInfo(node);

  const payload = {
    domain: window.location.host,
    urlpath: window.location.pathname,
    clickednodename: text,
    html5: 0,
    clickedpath: "",
    objectdata: TSON.stringify(objectData),
  };

  return await recordClicks(payload);
};

/**
 * * To post click sequence data to REST
 * @param request
 * @returns promise
 */
export const postRecordSequenceData = async (request: any) => {
  window.udanSelectedNodes = [];
  const userclicknodesSet = getFromStore(CONFIG.RECORDING_SEQUENCE, false);
  const ids = userclicknodesSet.map((item: any) => item.id);
  const payload = {
    ...request,
    domain: window.location.host,
    isIgnored: 0,
    isValid: 1,
    userclicknodelist: ids.join(","),
    userclicknodesSet,
  };
  return recordSequence(payload);
};

/**
 * To update click data to REST
 * @returns  promise
 * @param request
 */
export const putUserClickData = async (request: any) => {
  const payload = {
    ...request,
    clickedname: '["Test"]',
    clicktype: "sequencerecord",
    recordid: 1375,
  };
  return userClick(payload);
};
