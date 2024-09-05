var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ENDPOINT } from "../config/endpoints";
import { recordUserClickData, REST } from ".";
import { specialNodes } from "../util/specialNodes";
import { getUserId } from "./userService";
/**
 * To serve search results
 * @param request
 * @returns promise
 */
export const fetchSearchResults = (request) => __awaiter(void 0, void 0, void 0, function* () {
    if (request === null || request === void 0 ? void 0 : request.keyword) {
        yield recordUserClickData('search', request === null || request === void 0 ? void 0 : request.keyword);
    }
    request.userSessionId = yield getUserId();
    if (request.additionalParams === null) {
        delete request.additionalParams;
    }
    let parameters;
    if (request.additionalParams != null) {
        parameters = {
            url: REST.processArgs(ENDPOINT.SearchWithPermissions, request),
            method: "GET",
        };
    }
    else {
        parameters = {
            url: REST.processArgs(ENDPOINT.Search, request),
            method: "GET",
        };
    }
    return REST.apiCal(parameters);
});
/**
 * To serve search results
 * @param request
 * @returns promise
 */
export const fetchRecord = (request) => __awaiter(void 0, void 0, void 0, function* () {
    if (request.additionalParams === null) {
        delete request.additionalParams;
    }
    else {
        request.userSessionId = yield getUserId();
    }
    let parameters;
    let url = ENDPOINT.fetchRecord;
    if (request.additionalParams != null) {
        url += '/withPermissions';
    }
    url += '/' + request.id + '?domain=' + request.domain;
    if (request.additionalParams != null) {
        url += '&additionalParams=' + request.additionalParams + '&userSessionId=' + request.userSessionId;
    }
    parameters = {
        url,
        method: "GET",
    };
    return REST.apiCal(parameters);
});
/**
 * Fetch special nodes processing from backend
 * @param request
 */
export const fetchSpecialNodes = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const parameters = {
        url: REST.processArgs(ENDPOINT.SpecialNodes, request),
        method: "GET",
    };
    // return REST.apiCal(parameters);
    return specialNodes;
});
//# sourceMappingURL=searchService.js.map