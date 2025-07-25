import TSON from "typescript-json";
import {CustomConfig} from "../config/CustomConfig";
import {getFromStore} from "../util";
import {CONFIG} from "../config";
import {trigger} from "../util/events";

global.UDAGlobalConfig = CustomConfig;

/**
 * common REST call
 * @options : object (properties needed for REST call)
 */
export const apiCal = (options: any) => {
  const requestOptions = {
    method: options.method,
    headers: getHTTPHeaders("json", options?.headers),
    body: options.body ? TSON.stringify(options.body) : null,
  };

  const baseProdURL = process.env.baseProdURL;
  const baseTestURL = process.env.baseTestURL;

  let baseURL = baseProdURL;
  let url;

  if(options.url.indexOf("http") === -1){
    if(global.UDAGlobalConfig.environment === 'TEST'){
      baseURL = baseTestURL;
    }
    url = baseURL+options.url;
  } else {
    url = options.url;
  }

  return fetch(url, requestOptions)
      .then((response) => {
        switch (response?.status) {
          case 200:
            return options?.responseType == "text" ? response.text() : response.json();
          case 201:
            return options?.responseType == "text" ? response.text() : response.json();
          case 204:
            return null;
          case 400:
            throw new Error('Bad Request - The request was malformed or invalid');
          case 401:
            trigger('UDAGetNewToken', {detail: {data: "UDAGetNewToken"}});
            throw new Error('Unauthorized - Authentication required');
          case 403:
            throw new Error('Forbidden - You do not have permission to access this resource');
          case 404:
            throw new Error('Not Found - The requested resource does not exist');
          case 408:
            throw new Error('Request Timeout - The server timed out waiting for the request');
          case 429:
            throw new Error('Too Many Requests - Rate limit exceeded');
          case 500:
            throw new Error('Internal Server Error - Something went wrong on the server');
          case 502:
            throw new Error('Bad Gateway - Invalid response from upstream server');
          case 503:
            throw new Error('Service Unavailable - The server is temporarily unavailable');
          case 504:
            throw new Error('Gateway Timeout - The upstream server timed out');
          default:
            throw new Error(`Unexpected status code: ${response.status}`);
        }
      })
      .then((json) => {
        return json;
      })
      .catch((error) => {
        throw error;
      });
}

/**
 * common sync REST call
 * @options : object (properties needed for REST call)
 */
export const syncApiCal = async (options: any) => {
  const requestOptions = {
    method: options.method,
    headers: getHTTPHeaders("json"),
    body: options.body ? TSON.stringify(options.body) : null,
  };

  let response: any = {};
  try {
    response = await fetch(options.url, requestOptions);
    return await response?.json();
  } catch (e) {}
}

/**
 * @objective To set autherization token for all outgoing REST calls
 * @param contentType
 * @param additionalHeaders
 * @returns HTTP headers
 */
export const getHTTPHeaders = (contentType: string, additionalHeaders: any = null) => {

  let userAuthData = getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);

  const headers = new Headers();
  if (contentType === "json")
    headers.append("Content-Type", "application/json");

  if(userAuthData && userAuthData.authData.token){
    headers.append("Authorization", `Bearer ${userAuthData.authData.token}`);
  }

  if(global.UDAGlobalConfig.realm !== 'UDAN'){
    headers.append("UDAN-Realm", `${global.UDAGlobalConfig.realm}`);
  }

  if(additionalHeaders){
    return additionalHeaders;
  }

  return headers;
}

/**
 * @obective to replace static query params with dynamic values
 * @param url
 * @param val
 * @returns reconstructed url
 */
export const processArgs1 = (url: string, val: any) => {
  return url?.replace(/#([^#]+)#/g, (_, key) => val[key] !== undefined ? val[key] : "");
}

export {recordUserClickData} from "./recordService";
export {postRecordSequenceData} from "./recordService";
export {saveClickData} from "./recordService";

export const REST = {
  apiCal,
  syncApiCal,
  processArgs: processArgs1,
};
