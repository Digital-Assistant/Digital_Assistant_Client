import {getUserId} from "./userService";
import {ENDPOINT} from "../config/endpoints";
import {REST} from "./index";

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
    url: ENDPOINT.VoteRecord,
    method: "POST",
    body: payload,
  };
  return REST.apiCal(parameters);
};

export const getVoteRecord = async (request?: any, type?: string) => {
  let userSessionId = await getUserId();

  const parameters = {
    url: ENDPOINT.fetchVoteRecord+request.id+'/'+userSessionId,
    method: "GET"
  };
  return REST.apiCal(parameters);
};

