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
  try {
    const usersessionid = await getUserId();
    if (!usersessionid) {
      throw new Error("User session ID not found");
    }

    if (!request || !request.id) {
      throw new Error("Invalid request: missing id");
    }

    if (type !== "up" && type !== "down") {
      throw new Error("Invalid vote type");
    }

    const payload = {
      usersessionid: usersessionid,
      sequenceid: request.id,
      upvote: type === "up" ? 1 : 0,
      downvote: type === "down" ? 1 : 0,
    };

    const parameters = {
      url: ENDPOINT.VoteRecord,
      method: "POST",
      body: payload,
    };

    return await REST.apiCal(parameters);
  } catch (error) {
    console.error("Error in vote function:", error);
    throw error;
  }
};

export const getVoteRecord = async (request?: any) => {
  try {
    const userSessionId = await getUserId();
    if (!userSessionId) {
      throw new Error("User session ID not found");
    }

    if (!request || !request.id) {
      throw new Error("Invalid request: missing id");
    }

    const parameters = {
      url: `${ENDPOINT.fetchVoteRecord}${request.id}/${userSessionId}`,
      method: "GET"
    };

    return await REST.apiCal(parameters);
  } catch (error) {
    console.error("Error in getVoteRecord function:", error);
    throw error;
  }
};
