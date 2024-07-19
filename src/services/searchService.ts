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
 * To serve search results
 * @param request
 * @returns promise
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
 * @param request
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
