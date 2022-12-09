import {ENDPOINT} from "../config/endpoints";
import {REST} from ".";
import {specialNodes} from "../util/specialNodes";

/**
 * To serve search results
 * @param request
 * @returns promise
 */

export const fetchSearchResults = (request?: {
  keyword?: string,
  page?: number,
  domain?: string,
  additionalParams?: any
}) => {
  if (request.additionalParams === null) {
    delete request.additionalParams;
  }
  let parameters: any;
  if (request.additionalParams != null) {
    parameters = {
      url: REST.processArgs(ENDPOINT.SEARCH_WITH_PERMISSIONS, request),
      method: "GET",
    };
  } else {
    parameters = {
      url: REST.processArgs(ENDPOINT.SEARCH, request),
      method: "GET",
    };
  }

  return REST.apiCal(parameters);
};

/**
 * Fetch special nodes processing from backend
 * @param request
 */
export const fetchSpecialNodes = async (request?: any) => {
  const parameters = {
    url: REST.processArgs(ENDPOINT.SPECIAL_NODES, request),
    method: "GET",
  };
  // return REST.apiCal(parameters);
  return specialNodes;
};
