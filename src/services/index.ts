import TSON from "typescript-json";
import {CustomConfig} from "../config/CustomConfig";

global.UDAGlobalConfig = CustomConfig;

/**
 * common REST call
 * @options : object (properties needed for REST call)
 */
export const apiCal = (options: any) => {
  const requestOptions = {
    method: options.method,
    headers: options?.headers ? options?.headers : getHTTPHeaders("json"),
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
      //throw route to login if unauthorized response received
      switch (response?.status) {
        case 401:
          localStorage.clear();
          break;
        case 200:
          return options?.responseType == "text" ? response.text() : response.json();
          break;
        case 204:
          return null;
          break;
      }
      /*if (response?.status == 401) {
        localStorage.clear();
      }
      if(response?.status == 200) {
        return options?.responseType == "text"
            ? response.text()
            : response.json();
      } else {
        return response;
      }*/
    })
    .then((json) => {
      return json;
    })
    .catch((error) => {
      return error;
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
 * @returns HTTP headers
 */
export const getHTTPHeaders = (contentType: string) => {
  const headers = new Headers();
  if (contentType === "json")
    headers.append("Content-Type", "application/json");

  return headers;
}

/**
 * @obective to replace static query params with dynamic values
 * @param url
 * @param val
 * @returns reconstructed url
 */
export const processArgs1 = (url: string, val: any) => {
  return url?.replace(/#([^#]+)#/g, (_, key) => (val[key] || "") && val[key]);
}

export {recordUserClickData} from "./recordService";
export {postRecordSequenceData} from "./recordService";
export {saveClickData} from "./recordService";

export const REST = {
  apiCal,
  syncApiCal,
  processArgs: processArgs1,
};
