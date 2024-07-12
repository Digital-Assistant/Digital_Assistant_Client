import { getUserId } from "./userService";
import { ENDPOINT } from "../config/endpoints";
import { REST } from "./index";
import { UDAErrorLogger } from "../config/error-log";

export const vote = async (request?: any, type?: string): Promise<any> => {
  try {
    if (!request || !request.id) {
      throw new Error("Invalid request: missing id");
    }
    if (type !== "up" && type !== "down") {
      throw new Error("Invalid vote type: must be 'up' or 'down'");
    }

    const usersessionid = await getUserId();
    if (!usersessionid) {
      throw new Error("User session ID not found");
    }

    const payload = {
      usersessionid,
      sequenceid: request.id,
      upvote: type === "up" ? 1 : 0,
      downvote: type === "down" ? 1 : 0,
    };

    const parameters = {
      url: ENDPOINT.VoteRecord,
      method: "POST",
      body: payload,
    };

    const response = await REST.apiCal(parameters);
    if (!response) {
      throw new Error("No response received from the server");
    }
    return response;
  } catch (error) {
    UDAErrorLogger.error("Error in vote function", error);
    throw error;
  }
};

export const getVoteRecord = async (request?: any): Promise<any> => {
  try {
    if (!request || !request.id) {
      throw new Error("Invalid request: missing id");
    }

    const userSessionId = await getUserId();
    if (!userSessionId) {
      throw new Error("User session ID not found");
    }

    const parameters = {
      url: `${ENDPOINT.fetchVoteRecord}${request.id}/${userSessionId}`,
      method: "GET"
    };

    const response = await REST.apiCal(parameters);
    if (!response) {
      throw new Error("No response received from the server");
    }
    return response;
  } catch (error) {
    UDAErrorLogger.error("Error in getVoteRecord function", error);
    throw error;
  }
};
