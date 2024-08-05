/**
 * Imports various utility functions and constants used throughout the application.
 * - `ENDPOINT`: Provides the endpoint URLs for various API calls.
 * - `recordUserClickData`: Records user click data for analytics purposes.
 * - `REST`: Provides utility functions for making REST API calls.
 * - `specialNodes`: Provides a list of special nodes used in the application.
 * - `getUserId`: Retrieves the user's session ID.
 * - `UDAErrorLogger`: Provides an error logging utility.
 */
import { ENDPOINT } from "../config/endpoints";
import { recordUserClickData, REST } from ".";
import { specialNodes } from "../util/specialNodes";
import { getUserId } from "./userService";
import { UDAErrorLogger } from "../config/error-log";

/**
 * To serve search results
 * @param request
 * @returns promise
 */

/**
 * Fetches search results based on the provided request parameters.
 *
 * @param request - An object containing the search parameters:
 *   - keyword: The search keyword (optional)
 *   - page: The page number of the search results
 *   - domain: The domain to search within (optional)
 *   - additionalParams: Additional parameters to include in the search request (optional)
 *   - userSessionId: The user session ID (optional)
 * @returns A promise that resolves to the search results.
 */
export const fetchSearchResults = async (request?: {
  keyword?: string;
  page: number;
  domain?: string;
  additionalParams?: any;
  userSessionId?: any;
}) => {
  try {
    if (!request || !request.page) {
      throw new Error("Required parameters are missing");
    }

    if (request?.keyword) {
      await recordUserClickData("search", request?.keyword);
    }

    request.userSessionId = await getUserId();
    if (request.additionalParams === null) {
      delete request.additionalParams;
    }
    let parameters: any;
    if (request.additionalParams != null) {
      parameters = {
        url: REST.processArgs(ENDPOINT.SearchWithPermissions, request),
        method: "GET",
      };
    } else {
      parameters = {
        url: REST.processArgs(ENDPOINT.Search, request),
        method: "GET",
      };
    }

    return REST.apiCal(parameters);
  } catch (error) {
    UDAErrorLogger.error(
      `Error in fetchSearchResults: ${error.message}`,
      error
    );
    throw error;
  }
};

/**
 * Fetch a record from the backend based on the provided request parameters.
 * @param request - An optional object containing the following parameters:
 *   - id: The unique identifier of the record to fetch.
 *   - domain: The domain of the record to fetch.
 *   - additionalParams: Any additional parameters to include in the request.
 *   - userSessionId: The user's session ID.
 * @returns A Promise that resolves to the fetched record data.
 * @throws An error if any required parameters are missing.
 */
export const fetchRecord = async (request?: {
  id?: string;
  domain?: string;
  additionalParams?: any;
  userSessionId?: string;
}) => {
  try {
    if (!request || !request.id || !request.domain) {
      throw new Error("Required parameters are missing");
    }

    if (request.additionalParams === null) {
      delete request.additionalParams;
    } else {
      request.userSessionId = await getUserId();
    }
    let parameters: any;
    let url = ENDPOINT.fetchRecord;

    if (request.additionalParams != null) {
      url += "/withPermissions";
    }

    url += "/" + request.id + "?domain=" + request.domain;

    if (request.additionalParams != null) {
      url +=
        "&additionalParams=" +
        request.additionalParams +
        "&userSessionId=" +
        request.userSessionId;
    }

    parameters = {
      url,
      method: "GET",
    };

    return REST.apiCal(parameters);
  } catch (error) {
    UDAErrorLogger.error(`Error in fetchRecord: ${error.message}`, error);
    throw error;
  }
};

/**
 * Fetch special nodes processing from backend
 * @param request - An optional object containing parameters for the special nodes request
 * @returns A Promise that resolves to the special nodes data from the backend
 */
export const fetchSpecialNodes = async (request?: any) => {
  try {
    const parameters = {
      url: REST.processArgs(ENDPOINT.SpecialNodes, request),
      method: "GET",
    };
    // return REST.apiCal(parameters);
    return specialNodes;
  } catch (error) {
    UDAErrorLogger.error(`Error in fetchSpecialNodes: ${error.message}`, error);
    throw error;
  }
};
