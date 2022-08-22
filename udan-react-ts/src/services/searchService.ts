import { ENDPOINT } from "../config/endpoints";
import { REST } from ".";


/**
 * To serve search results 
 * @param request
 * @returns promise
 */

export const fetchSearchResults = (request?: any) => {
  const parameters = {
    url: REST.processArgs(ENDPOINT.SEARCH, request),
    method: 'GET'
  };
  return REST.apiCal(parameters);
};
