import { ENDPOINT } from "../config/endpoints";
import { REST } from ".";


/**
 * To serve search results 
 * @param request
 * @returns promise
 */

export const fetchSearchResults = (request?: any) => {
  const requestParams = {
    tenantId: request?.payload?.tenantId,
  };
  const parameters = {
    url: REST.processArgs(ENDPOINT.SEARCH, requestParams),
    method: 'GET'
  };
  return REST.apiCal(parameters);
};
