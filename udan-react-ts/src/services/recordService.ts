import { ENDPOINT } from "../config/endpoints";
import { REST } from ".";
import { getFromStore } from "../util";

/**
 * To record each action/event
 * @param request
 * @returns promise
 */

export const recordClicks = (request?: any) => {
  request.usersessionid = getFromStore("udaSessionId", true);
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

export const updateRecordClicks = (request?: any) => {
  request.usersessionid = getFromStore("udaSessionId", true);
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

export const recordSequence = (request?: any) => {
  request.usersessionid = getFromStore("udaSessionId", true);
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

export const userClick = (request?: any) => {
  request.usersessionid = getFromStore("udaSessionId", true);
  request.clickedname = window.location.host;
  const parameters = {
    url: ENDPOINT.USER_CLICK,
    method: "PUT",
    body: request,
  };
  return REST.apiCal(parameters);
};

export const deleteRecording = (request?: any) => {
  request.usersessionid = getFromStore("udaSessionId", true);
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
 * @returns promise
 */

export const vote = (request?: any, type?: string) => {
  const payload = {
    usersessionid: getFromStore("udaSessionId", true),
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
