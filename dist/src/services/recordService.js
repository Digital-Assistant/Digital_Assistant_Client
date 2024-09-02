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
import { REST } from ".";
import { CONFIG } from "../config";
import { getSessionKey, getUserId } from "./userService";
import { getNodeInfo } from "../util/nodeInfo";
import TSON from "typescript-json";
import { getAbsoluteOffsets, getFromStore, inArray } from "../util";
import domJSON from "domjson";
import mapClickedElementToHtmlFormElement from "../util/recording-utils/mapClickedElementToHtmlFormElement";
import { UDAConsoleLogger } from "../config/error-log";
import { fetchDomain } from "../util/fetchDomain";
import ReactGA from "react-ga4";
/**
 * To record each action/event
 * @param request
 * @returns promise
 */
export const recordClicks = (request) => __awaiter(void 0, void 0, void 0, function* () {
    request.sessionid = yield getSessionKey();
    const parameters = {
        url: ENDPOINT.Record,
        method: "POST",
        body: request,
    };
    return REST.apiCal(parameters);
});
/**
 * Updates the record clicks.
 *
 * @param {any} request - The request object.
 * @return {Promise<any>} A promise that resolves with the result of the API call.
 */
export const updateRecordClicks = (request) => __awaiter(void 0, void 0, void 0, function* () {
    request.sessionid = yield getSessionKey();
    const parameters = {
        url: ENDPOINT.UpdateRecord,
        method: "POST",
        body: request,
    };
    return REST.apiCal(parameters);
});
/**
 * To record set of actions/events belong to one recording
 * @param request
 * @returns promise
 */
export const recordSequence = (request) => __awaiter(void 0, void 0, void 0, function* () {
    request.usersessionid = yield getUserId();
    const parameters = {
        url: ENDPOINT.RecordSequence,
        method: "POST",
        body: request,
    };
    return REST.apiCal(parameters);
});
/**
 * To record set of actions/events belong to one recording
 * @param request
 * @returns promise
 */
export const userClick = (request) => __awaiter(void 0, void 0, void 0, function* () {
    request.usersessionid = yield getUserId();
    request.clickedname = window.location.host;
    const parameters = {
        url: ENDPOINT.UserClick,
        method: "PUT",
        body: request,
    };
    return REST.apiCal(parameters);
});
export const deleteRecording = (request) => __awaiter(void 0, void 0, void 0, function* () {
    request.usersessionid = yield getUserId();
    const parameters = {
        url: ENDPOINT.DeleteSequence,
        method: "POST",
        body: request,
    };
    return REST.apiCal(parameters);
});
export const updateRecording = (request) => __awaiter(void 0, void 0, void 0, function* () {
    request.usersessionid = yield getUserId();
    const parameters = {
        url: ENDPOINT.updateRecordSequence,
        method: "POST",
        body: request,
    };
    return yield REST.apiCal(parameters);
});
/**
 * To check profanity validation/filters for sequence name/labels
 * @param request
 * @returns promise
 */
export const profanityCheck = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = new Headers();
    headers.append("Content-Type", "text/plain");
    headers.append("Ocp-Apim-Subscription-Key", CONFIG.profanity.config.key1);
    const parameters = {
        url: ENDPOINT.ProfanityCheck,
        method: "POST",
        body: request,
        headers,
    };
    return REST.apiCal(parameters);
});
/**
 * To save click data to REST
 * @param node HTMLElement
 * @param text
 * @param meta
 * @returns promise
 */
export const saveClickData = (node, text, meta) => __awaiter(void 0, void 0, void 0, function* () {
    // removing circular reference before converting to json with deep clone.
    const processedNode = yield node.cloneNode(true);
    console.log(getAbsoluteOffsets(processedNode));
    let objectData = domJSON.toJSON(processedNode, { serialProperties: true });
    if (objectData.meta) {
        objectData.meta = meta;
    }
    else {
        objectData.meta = meta;
    }
    //removing the unwanted attributes which were added while processing click objects.
    delete (objectData.node.addedClickRecord);
    delete (objectData.node.hasClick);
    delete (objectData.node.udaIgnoreChildren);
    delete (objectData.node.udaIgnoreClick);
    if (inArray(node.nodeName.toLowerCase(), CONFIG.ignoreNodesFromIndexing) !== -1 && CONFIG.customNameForSpecialNodes.hasOwnProperty(node.nodeName.toLowerCase())) {
        objectData.meta.displayText = CONFIG.customNameForSpecialNodes[node.nodeName.toLowerCase()];
    }
    if (!objectData.node.outerHTML) {
        objectData.node.outerHTML = node.outerHTML;
    }
    objectData.offset = getAbsoluteOffsets(node);
    objectData.node.nodeInfo = getNodeInfo(node);
    // Added to handle the case where screen size is not available
    if (objectData.node.nodeInfo && (!objectData.node.nodeInfo.screenSize.screen.width || !objectData.node.nodeInfo.screenSize.screen.height)) {
        return false;
    }
    const { enableNodeTypeChangeSelection } = CONFIG;
    if (enableNodeTypeChangeSelection) {
        objectData.meta.systemDetected = mapClickedElementToHtmlFormElement(node);
        if (objectData.meta.systemDetected.inputElement !== 'others') {
            objectData.meta.selectedElement = objectData.meta.systemDetected;
        }
    }
    UDAConsoleLogger.info(objectData, 3);
    // let domain = fetchDomain();
    let domain = window.location.host;
    const jsonString = TSON.stringify(objectData);
    UDAConsoleLogger.info(jsonString, 1);
    return {
        domain: domain,
        urlpath: window.location.pathname,
        clickednodename: text,
        html5: 0,
        clickedpath: "",
        objectdata: jsonString,
    };
});
/**
 * * To post click sequence data to REST
 * @param request
 * @returns promise
 */
export const postRecordSequenceData = (request) => __awaiter(void 0, void 0, void 0, function* () {
    window.udanSelectedNodes = [];
    const userclicknodesSet = getFromStore(CONFIG.RECORDING_SEQUENCE, false);
    const ids = userclicknodesSet.map((item) => item.id);
    let domain = fetchDomain();
    const payload = Object.assign(Object.assign({}, request), { domain: domain, isIgnored: 0, isValid: 1, userclicknodelist: ids.join(","), userclicknodesSet });
    return yield recordSequence(payload);
});
/**
 * To update click data to REST
 * @returns  promise
 * @param request
 */
export const recordUserClickData = (clickType = 'sequencerecord', clickedName = '', recordId = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        usersessionid: yield getSessionKey(),
        clickedname: clickedName,
        clicktype: clickType,
        recordid: recordId,
    };
    // Sending events to google analytics
    ReactGA.event({
        category: clickType,
        action: clickType,
        label: clickedName,
        value: recordId,
        nonInteraction: true,
        transport: "xhr",
    });
    return yield userClick(payload);
});
//# sourceMappingURL=recordService.js.map