import { getUserId } from "./userService";
import { ENDPOINT } from "../config/endpoints";
import { REST } from "./index";
import { UDAErrorLogger } from "../config/error-log";

/**
 * Submits a vote for a given request.
 *
 * @param request - An object containing the request ID.
 * @param type - The type of vote, either "up" or "down".
 * @returns A Promise that resolves to the response from the server.
 * @throws {Error} If the request is missing an ID or the vote type is invalid.
 * @throws {Error} If the user session ID is not found.
 * @throws {Error} If no response is received from the server.
 */
export const vote = async (request?: any, type?: string): Promise<any> => {
  try {
    // Validate request and vote type
    if (!request || !request.id) {
      throw new Error("Invalid request: missing id");
    }
    if (type !== "up" && type !== "down") {
      throw new Error("Invalid vote type: must be 'up' or 'down'");
    }

    // Get user session ID
    const usersessionid = await getUserId();
    if (!usersessionid) {
      throw new Error("User session ID not found");
    }

    // Prepare payload for the API call
    const payload = {
      usersessionid,
      sequenceid: request.id,
      upvote: type === "up" ? 1 : 0,
      downvote: type === "down" ? 1 : 0,
    };

    // Set up parameters for the API call
    const parameters = {
      url: ENDPOINT.VoteRecord,
      method: "POST",
      body: payload,
    };

    // Make the API call
    const response = await REST.apiCal(parameters);
    if (!response) {
      throw new Error("No response received from the server");
    }
    return response;
  } catch (error) {
    // Log the error and re-throw it
    UDAErrorLogger.error("Error in vote function", error);
    throw error;
  }
};

export const getVoteRecord = async (request?: any): Promise<any> => {
  try {
    // Validate request
    if (!request || !request.id) {
      throw new Error("Invalid request: missing id");
    }

    // Get user session ID
    const userSessionId = await getUserId();
    if (!userSessionId) {
      throw new Error("User session ID not found");
    }

    // Set up parameters for the API call
    const parameters = {
      url: `${ENDPOINT.fetchVoteRecord}${request.id}/${userSessionId}`,
      method: "GET"
    };

    // Make the API call
    const response = await REST.apiCal(parameters);
    if (!response) {
      throw new Error("No response received from the server");
    }
    return response;
  } catch (error) {
    // Log the error and re-throw it
    UDAErrorLogger.error("Error in getVoteRecord function", error);
    throw error;
  }
};
