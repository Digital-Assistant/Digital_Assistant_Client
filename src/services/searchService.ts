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
// Fetch search results based on provided parameters
export const fetchSearchResults = async (request?: {
  // Optional keyword to search for
  keyword?: string;

  // Required page number for pagination
  page: number;

  // Optional domain to filter results by
  domain?: string;

  // Optional additional parameters to include in the request
  additionalParams?: any;

  // Optional user session ID to include in the request
  userSessionId?: any;
}) => {
  try {
    // Validate required parameters
    if (!request || !request.page) {
      throw new Error("Required parameters are missing");
    }

    // Record user search action if keyword is provided
    if (request?.keyword) {
      await recordUserClickData("search", request?.keyword);
    }

    // Get user ID and set it in the request
    request.userSessionId = await getUserId();

    // Remove additionalParams if null
    if (request.additionalParams === null) {
      delete request.additionalParams;
    }

    let parameters: any;
    // Determine which endpoint to use based on additionalParams
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

    // Make API call and return results
    return REST.apiCal(parameters);
  } catch (error) {
    // Log error and re-throw
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
// Fetch a record based on provided parameters
export const fetchRecord = async (request?: {
  // Optional ID of the record to fetch
  id?: string;

  // Optional domain to filter results by
  domain?: string;

  // Optional additional parameters to include in the request
  additionalParams?: any;

  // Optional user session ID to include in the request
  userSessionId?: string;
}) => {
  try {
    // Validate required parameters
    if (!request || !request.id || !request.domain) {
      throw new Error("Required parameters are missing");
    }

    // Remove additionalParams if null
    if (request.additionalParams === null) {
      delete request.additionalParams;
    } else {
      // Get user ID and set it in the request
      request.userSessionId = await getUserId();
    }

    let parameters: any;
    let url = ENDPOINT.fetchRecord;

    // Determine which endpoint to use based on additionalParams
    if (request.additionalParams != null) {
      url += "/withPermissions";
    }

    // Build the URL with the provided parameters
    url += "/" + request.id + "?domain=" + request.domain;

    // Add additional parameters to the URL if provided
    if (request.additionalParams != null) {
      url +=
        "&additionalParams=" +
        request.additionalParams +
        "&userSessionId=" +
        request.userSessionId;
    }

    // Set the parameters for the API call
    parameters = {
      url,
      method: "GET",
    };

    // Make API call and return results
    return REST.apiCal(parameters);
  } catch (error) {
    // Log error and re-throw
    UDAErrorLogger.error(`Error in fetchRecord: ${error.message}`, error);
    throw error;
  }
};

/**
 * Fetch special nodes processing from backend
 * @param request - An optional object containing parameters for the special nodes request
 * @returns A Promise that resolves to the special nodes data from the backend
 */ // Fetch special nodes based on provided parameters
export const fetchSpecialNodes = async (request?: any) => {
  try {
    // Set the parameters for the API call
    const parameters = {
      // Process the endpoint URL with the provided request parameters
      url: REST.processArgs(ENDPOINT.SpecialNodes, request),
      // Set the HTTP method to GET
      method: "GET",
    };

    // Return the special nodes data (assuming it's a predefined variable)
    // return REST.apiCal(parameters);
    return specialNodes;
  } catch (error) {
    // Log error and re-throw
    UDAErrorLogger.error(`Error in fetchSpecialNodes: ${error.message}`, error);
    throw error;
  }
};
