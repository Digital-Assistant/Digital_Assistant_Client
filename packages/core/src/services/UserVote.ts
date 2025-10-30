/**
 * Imports the getUserId function from the userService module, the ENDPOINT constant from the endpoints configuration, and the apiClient instance.
 * These imports are used to support the user voting functionality.
 */
import { getUserId } from "./userService";
import { ENDPOINT } from "../config/endpoints";
import { apiClient } from "./index";

/**
 * Votes on a recording with the specified vote type.
 * @param request - An object containing the recording ID.
 * @param type - The type of vote, either "up" or "down".
 * @returns A promise that resolves with the result of the vote operation.
 * @throws {Error} If the user session ID is not found, the request is invalid, or an error occurs during the API call.
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

    return await apiClient.post(ENDPOINT.VoteRecord, payload);
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches the vote record for a given request and user session ID.
 * @param request - An object containing the request ID.
 * @returns A promise that resolves with the result of the vote record fetch operation.
 * @throws {Error} If an error occurs during the API call.
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

    const url = `${ENDPOINT.fetchVoteRecord}${request.id}/${userSessionId}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
