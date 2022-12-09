import TSON from "typescript-json";

/**
 * common REST call
 * @options : object (properties needed for REST call)
 */
export const apiCal = (options: any) => {
  // const validate = checkValidUser()
  // if(!validate) return
  const requestOptions = {
    method: options.method,
    headers: options?.headers ? options?.headers : getHTTPHeaders("json"),
    body: options.body ? TSON.stringify(options.body) : null,
  };

  return fetch(options.url, requestOptions)
    .then((response) => {
      //throw route to login if unauthorized response received
      if (response?.status == 401) {
        localStorage.clear();
        // window.location.href = '/'
      }
      return options?.responseType == "text"
        ? response.text()
        : response.json();
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
  // const validate = checkValidUser()
  // if(!validate) return
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

export {putUserClickData} from "./recordService";
export {postRecordSequenceData} from "./recordService";
export {postClickData} from "./recordService";

export const REST = {
  apiCal,
  syncApiCal,
  processArgs: processArgs1,
};
