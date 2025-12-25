import {ENDPOINT} from "../config/endpoints";
import {recordUserClickData, REST} from ".";
import {specialNodes} from "../util/specialNodes";
import {getUserId} from "./userService";

/**
 * To serve search results
 * @param request
 * @returns promise
 */

export const fetchSearchResults = async (request?: {
    // The search keyword to record user click data.
    keyword?: string;
    // The page number for the search results.
    page: number;
    // The domain to filter the search results.
    domain?: string;
    // Any additional parameters to include in the search request.
    additionalParams?: any;
    // The user's session ID.
    userSessionId?: any;
}) => {
    try {
      if(request?.keyword && request.keyword !== '') {
        recordUserClickData('search', request.keyword);
      }

      request.userSessionId = await getUserId();
      if (request.additionalParams === null) {
        delete request.additionalParams;
      }
      let parameters: any;
      let url=ENDPOINT.Search;
      if (request.additionalParams != null) {
        if(global.UDAGlobalConfig.enableAISearch){
          url = process.env.tokenUrl+ENDPOINT.AISearchWithPermissions;
        } else {
          url = ENDPOINT.SearchWithPermissions;
        }
        parameters = {
          url: REST.processArgs(url, request),
          method: "GET",
        };
      } else {
        if(global.UDAGlobalConfig.enableAISearch){
          url = process.env.llmUrl+ENDPOINT.AISearch;
        } else {
          url = ENDPOINT.Search;
        }
        parameters = {
          url: REST.processArgs(url, request),
          method: "GET",
        };
      }

    const response = await REST.apiCal(parameters);
    if(response !== undefined) {
      return response;
    } else {
      return [];
    }

  } catch (error) {
    // Type guard to check if error is an instance of Error
    const errorMessage = error instanceof Error ? error.message : 'Unknown search error';

    // Log the error for debugging
    console.error('Search service error:', errorMessage);

    // You can customize the error response based on your needs
    throw new Error(`Failed to perform search: ${errorMessage}`);
    return [];
  }

};

/**
 * To serve search results
 * @param request
 * @returns promise
 */

export const fetchRecord = async (request?: {
  id?: string,
  domain?: string,
  additionalParams?: any
  userSessionId?: string
}) => {
  if (request.additionalParams === null) {
    delete request.additionalParams;
  } else {
    request.userSessionId = await getUserId();
  }
  let parameters: any;
  let url = ENDPOINT.fetchRecord;

  if (request.additionalParams != null) {
    url += '/withPermissions'
  }

  url += '/'+request.id+'?domain='+request.domain;

  if (request.additionalParams != null) {
    url += '&additionalParams='+request.additionalParams+'&userSessionId='+request.userSessionId;
  }

  parameters = {
    url,
    method: "GET",
  };

  return REST.apiCal(parameters);
};

/**
 * Fetch special nodes processing from backend
 * @param request
 */
export const fetchSpecialNodes = async (request?: any) => {
  const parameters = {
    url: REST.processArgs(ENDPOINT.SpecialNodes, request),
    method: "GET",
  };
  // return REST.apiCal(parameters);
  return specialNodes;
};
