var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import TSON from "typescript-json";
import { CustomConfig } from "../config/CustomConfig";
import { getFromStore } from "../util";
import { CONFIG } from "../config";
import { trigger } from "../util/events";
global.UDAGlobalConfig = CustomConfig;
/**
 * common REST call
 * @options : object (properties needed for REST call)
 */
export const apiCal = (options) => {
    const requestOptions = {
        method: options.method,
        headers: getHTTPHeaders("json", options === null || options === void 0 ? void 0 : options.headers),
        body: options.body ? TSON.stringify(options.body) : null,
    };
    const baseProdURL = process.env.baseProdURL;
    const baseTestURL = process.env.baseTestURL;
    let baseURL = baseProdURL;
    let url;
    if (options.url.indexOf("http") === -1) {
        if (global.UDAGlobalConfig.environment === 'TEST') {
            baseURL = baseTestURL;
        }
        url = baseURL + options.url;
    }
    else {
        url = options.url;
    }
    return fetch(url, requestOptions)
        .then((response) => {
        //throw route to login if unauthorized response received
        switch (response === null || response === void 0 ? void 0 : response.status) {
            case 401:
                // localStorage.clear();
                trigger('UDAGetNewToken', { detail: { data: "UDAGetNewToken" } });
                break;
            case 200:
                return (options === null || options === void 0 ? void 0 : options.responseType) == "text" ? response.text() : response.json();
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
};
/**
 * common sync REST call
 * @options : object (properties needed for REST call)
 */
export const syncApiCal = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const requestOptions = {
        method: options.method,
        headers: getHTTPHeaders("json"),
        body: options.body ? TSON.stringify(options.body) : null,
    };
    let response = {};
    try {
        response = yield fetch(options.url, requestOptions);
        return yield (response === null || response === void 0 ? void 0 : response.json());
    }
    catch (e) { }
});
/**
 * @objective To set autherization token for all outgoing REST calls
 * @param contentType
 * @param additionalHeaders
 * @returns HTTP headers
 */
export const getHTTPHeaders = (contentType, additionalHeaders = null) => {
    let userAuthData = getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
    const headers = new Headers();
    if (contentType === "json")
        headers.append("Content-Type", "application/json");
    if (userAuthData && userAuthData.authData.token) {
        headers.append("Authorization", `Bearer ${userAuthData.authData.token}`);
    }
    if (global.UDAGlobalConfig.realm !== 'UDAN') {
        headers.append("UDAN-Realm", `${global.UDAGlobalConfig.realm}`);
    }
    if (additionalHeaders) {
        return additionalHeaders;
    }
    return headers;
};
/**
 * @obective to replace static query params with dynamic values
 * @param url
 * @param val
 * @returns reconstructed url
 */
export const processArgs1 = (url, val) => {
    return url === null || url === void 0 ? void 0 : url.replace(/#([^#]+)#/g, (_, key) => val[key] !== undefined ? val[key] : "");
};
export { recordUserClickData } from "./recordService";
export { postRecordSequenceData } from "./recordService";
export { saveClickData } from "./recordService";
export const REST = {
    apiCal,
    syncApiCal,
    processArgs: processArgs1,
};
//# sourceMappingURL=index.js.map