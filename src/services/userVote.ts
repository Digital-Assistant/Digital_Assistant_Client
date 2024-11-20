import { getUserId } from "./userService";
import { ENDPOINT } from "../config/endpoints";
import { REST } from "./index";

/**
 * Votes on a recording with the specified vote type.
 * @param request - An object containing the recording ID.
 * @param type - The type of vote, either "up" or "down".
 * @returns A promise that resolves with the result of the vote operation.
 * @throws {Error} If the user session ID is not found, the request is invalid, or an error occurs during the vote request.
 */
export const vote = async (request?: any, type?: string) => {
  try {
    // Get the user session ID
    const usersessionid = await getUserId();

    // Check if the user session ID is not found
    if (!usersessionid) {
      throw new Error("User session ID not found");
    }

    // Check if the request object or the recording ID is missing
    if (!request || !request.id) {
      throw new Error("Invalid request: missing id");
    }

    // Check if the vote type is invalid (not "up" or "down")
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
      usersessionid: usersessionid, // User's session ID
      sequenceid: request.id, // Recording ID
      upvote: type === "up" ? 1 : 0, // Set upvote to 1 if type is "up", otherwise 0
      downvote: type === "down" ? 1 : 0, // Set downvote to 1 if type is "down", otherwise 0
    };

    /**
     * Constructs the parameters object for the vote request.
     * @param url - The URL endpoint for the vote request.
     * @param method - The HTTP method for the vote request, which is "POST".
     * @param body - The payload object containing the necessary vote information.
     * @returns The parameters object with the URL, HTTP method, and payload for the vote request.
     */
    const parameters = {
      url: ENDPOINT.VoteRecord, // URL endpoint for voting
      method: "POST", // HTTP method
      body: payload, // Payload object
    };

    /**
     * Sends the vote request to the server and returns the result.
     * @param parameters - An object containing the URL, HTTP method, and payload for the vote request.
     * @returns A promise that resolves with the result of the vote operation.
     * @throws {Error} If an error occurs during the vote request.
     */
    return await REST.apiCal(parameters); // Make the API call using the REST utility
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
    // Get the user session ID
    const userSessionId = await getUserId();

    // Check if the user session ID is not found
    if (!userSessionId) {
      throw new Error("User session ID not found");
    }

    // Check if the request object or the recording ID is missing
    if (!request || !request.id) {
      throw new Error("Invalid request: missing id");
    }

    // Construct the parameters object for the vote record fetch request
    const parameters = {
      url: `${ENDPOINT.fetchVoteRecord}${request.id}/${userSessionId}`, // URL endpoint for fetching vote record
      method: "GET", // HTTP method
    };

    /**
     * Sends the vote request to the server and returns the result.
     * @param parameters - An object containing the URL, HTTP method, and payload for the vote request.
     * @returns A promise that resolves with the result of the vote operation.
     * @throws {Error} If an error occurs during the vote request.
     */
    return await REST.apiCal(parameters); // Make the API call using the REST utility
  } catch (error) {
    console.error("Error in getVoteRecord function:", error);
    throw error;
  }
  };
