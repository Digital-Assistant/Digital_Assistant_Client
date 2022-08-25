import { ENDPOINT } from "../config/endpoints";
import { REST } from ".";
import { getFromStore } from "../util";

/**
 * To record each action/event
 * @param request
 * @returns promise
 */

export const recordClicks = (request?: any) => {
  request.sessionid = getFromStore("sessionId", true);
  const parameters = {
    url: ENDPOINT.RECORD,
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
  request.sessionid = getFromStore("sessionId", true);
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
  request.usersessionid = getFromStore("sessionId", true);
  request.clickedname = window.location.host;
  const parameters = {
    url: ENDPOINT.USER_CLICK,
    method: "PUT",
    body: request,
  };
  return REST.apiCal(parameters);
};
