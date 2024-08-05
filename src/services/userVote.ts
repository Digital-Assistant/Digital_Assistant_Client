import {getUserId} from "./userService";
import {ENDPOINT} from "../config/endpoints";
import {REST} from "./index";

/**
 * To vote/de-vote the recording
 * @param request
 * @param type
 * @returns promise
 */
/**
 * Votes or de-votes a recording.
 * @param request - The request object containing the recording ID.
 * @param type - The type of vote, either "up" or "down".
 * @returns A promise that resolves with the result of the vote operation.
 * @throws {Error} If the user session ID is not found or the request is invalid.
 * @throws {Error} If the vote type is invalid.
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

    /**
     * Constructs the payload object for the vote request.
     * @param usersessionid - The user's session ID.
     * @param request - The request object containing the recording ID.
     * @param type - The type of vote, either "up" or "down".
     * @returns The payload object with the necessary vote information.
     */
    const payload = {
      usersessionid: usersessionid,
      sequenceid: request.id,
      upvote: type === "up" ? 1 : 0,
      downvote: type === "down" ? 1 : 0,
    };

    /**
     * Constructs the parameters object for the vote request.
     * @param url - The URL endpoint for the vote request.
     * @param method - The HTTP method for the vote request, which is "POST".
     * @param body - The payload object containing the necessary vote information.
     * @returns The parameters object with the URL, HTTP method, and payload for the vote request.
     */
    const parameters = {
      url: ENDPOINT.VoteRecord,
      method: "POST",
      body: payload,
    };
/**
 * Sends the vote request to the server and returns the result.
 * @param parameters - An object containing the URL, HTTP method, and payload for the vote request.
 * @returns A promise that resolves with the result of the vote operation.
 * @throws {Error} If an error occurs during the vote request.
 */

    return await REST.apiCal(parameters);
  } catch (error) {
    console.error("Error in vote function:", error);
    throw error;
  }
};

/**
 * Fetches the vote record for a given request and user session ID.
 * @param request - An object containing the request ID.
 * @returns A promise that resolves with the result of the vote record fetch operation.
 * @throws {Error} If an error occurs during the vote record fetch request.
 */
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
/**
 * Sends the vote request to the server and returns the result.
 * @param parameters - An object containing the URL, HTTP method, and payload for the vote request.
 * @returns A promise that resolves with the result of the vote operation.
 * @throws {Error} If an error occurs during the vote request.
 */

    return await REST.apiCal(parameters);
  } catch (error) {
    console.error("Error in getVoteRecord function:", error);
    throw error;
  }
};
