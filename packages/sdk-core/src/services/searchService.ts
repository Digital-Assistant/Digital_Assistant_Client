import { ENDPOINT } from "../config/endpoints";
import { recordUserClickData, REST } from ".";
import { specialNodes } from "../util/specialNodes";
import { getUserId } from "./userService";

export const fetchSearchResults = async (params: {
  keyword: string;
  page: number;
  domain: string;
  additionalParams?: string | null;
}) => {
  const response = await fetch('/api/search', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

export const fetchRecord = async (request?: {
  id?: string;
  domain?: string;
  additionalParams?: any;
  userSessionId?: string;
}) => {
  try {
    if (!request) {
      throw new Error("Request is undefined");
    }
    // If additionalParams is null, remove it from the request object
    if (request.additionalParams === null) {
      delete request.additionalParams;
    } else {
      // If additionalParams is present, add the userSessionId to the request object
      request.userSessionId = await getUserId();
    }

    let parameters: any;
    let url = ENDPOINT.fetchRecord;

    // Determine which endpoint to use based on whether additionalParams is present
    if (request.additionalParams != null) {
      url += "/withPermissions";
    }

    // Construct the full URL by appending the id and domain to the endpoint URL
    url += "/" + request.id + "?domain=" + request.domain;

    // If additionalParams is present, append it to the URL
    if (request.additionalParams != null) {
      url +=
        "&additionalParams=" +
        request.additionalParams +
        "&userSessionId=" +
        request.userSessionId;
    }

    // Construct the API call parameters
    parameters = {
      url,
      method: "GET",
    };

    // Make the API call and return the result
    return await REST.apiCal(parameters);
  } catch (error) {
    // Log the error and throw a new error with a user-friendly message
    const errorMessage = error instanceof Error ? error.message : 'Unknown search error';
    console.error("Error fetching record:", error);
    throw new Error(`Failed to fetch record: ${errorMessage}`);
  }
};

export const fetchSpecialNodes = async (request?: any) => {
  try {
    // Construct the API call parameters by processing the request using the REST.processArgs function
    const parameters = {
      url: REST.processArgs(ENDPOINT.SpecialNodes, request),
      method: "GET",
    };
    return specialNodes;
  } catch (error) {
    // Log the error and throw a new error with a user-friendly message
    const errorMessage = error instanceof Error ? error.message : 'Unknown search error';
    console.error("Error fetching special nodes:", error);
    throw new Error(`Failed to fetch special nodes: ${errorMessage}`);
  }
};
