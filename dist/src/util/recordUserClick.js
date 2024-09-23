var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// add jsdocs
import { CONFIG } from "../config";
import { getClickedInputLabels } from "./getClickedInputLabels";
import { UDAErrorLogger } from "../config/error-log";
import { clickableElementExists, getFromStore, setToStore } from "./index";
import { saveClickData } from "../services";
import { checkNodeValues } from "./checkNodeValues";
import mapClickedElementToHtmlFormElement from "./recording-utils/mapClickedElementToHtmlFormElement";
import { addNotification } from "./addNotification";
import { translate } from "./translation";
global.udanSelectedNodes = [];
global.clickedNode = null;
/**
 *
 * @param node
 * @param fromDocument
 * @param selectChange
 * @param event
 * @returns
 */
export const recordUserClick = (node, event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!node)
        return false;
    const isRecording = getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true";
    if (!isRecording) {
        return;
    }
    if (node.isSameNode(window.clickedNode)) {
        return;
    }
    if (CONFIG.lastClickedTime && (CONFIG.lastClickedTime === Date.now() || ((CONFIG.lastClickedTime + 300) >= Date.now()))) {
        return;
    }
    //should not record untrusted clicks
    if (!event.isTrusted) {
        return;
    }
    // node = event.target;
    let recordingNode = node;
    let addIsPersonal = false;
    //add the record click for parent element and ignore the children
    const closestParent = node.closest('[udaIgnoreChildren]');
    if (closestParent) {
        recordingNode = closestParent;
        addIsPersonal = true;
    }
    if (recordingNode.isSameNode(window.clickedNode)) {
        return;
    }
    // ignore click on unwanted node
    if (recordingNode.hasAttribute('udaIgnoreClick')) {
        return;
    }
    if (checkNodeValues(recordingNode, 'exclude')) {
        return;
    }
    if (clickableElementExists(recordingNode) || clickableElementExists(node)) {
        return;
    }
    global.clickedNode = recordingNode;
    let meta = {};
    let _text = getClickedInputLabels(recordingNode);
    if (addIsPersonal) {
        meta.isPersonal = true;
    }
    // adding default system detected html element type in metadata
    if (UDAGlobalConfig.enableNodeTypeSelection) {
        meta.systemDetected = mapClickedElementToHtmlFormElement(node);
        if (meta.systemDetected.inputElement !== 'others') {
            meta.selectedElement = meta.systemDetected;
        }
    }
    if (!_text || (_text === null || _text === void 0 ? void 0 : _text.length) > 100 || !((_a = _text === null || _text === void 0 ? void 0 : _text.trim()) === null || _a === void 0 ? void 0 : _a.length)) {
        meta.isPersonal = true;
        _text = recordingNode.nodeName;
    }
    // adding text editor name for the recording
    if (checkNodeValues(recordingNode, 'textEditors')) {
        meta.displayText = 'Text Editor';
    }
    // adding drop down name for the recording
    if (checkNodeValues(recordingNode, 'dropDowns')) {
        meta.displayText = 'Drop Down';
    }
    // adding Date selector for the recording
    if (checkNodeValues(recordingNode, 'datePicker')) {
        meta.displayText = 'Date Selector';
    }
    const resp = yield saveClickData(recordingNode, _text, meta);
    if (resp) {
        if (!global.udanSelectedNodes) {
            global.udanSelectedNodes = [];
        }
        global.udanSelectedNodes.push(recordingNode);
        if (!recordingNode.isSameNode(node))
            global.udanSelectedNodes.push(node);
        CONFIG.lastClickedTime = Date.now();
        const activeRecordingData = getFromStore(CONFIG.RECORDING_SEQUENCE, false);
        if (activeRecordingData) {
            activeRecordingData.push(resp);
            setToStore(activeRecordingData, CONFIG.RECORDING_SEQUENCE, false);
        }
        else {
            setToStore([resp], CONFIG.RECORDING_SEQUENCE, false);
        }
        addNotification(translate('clickAdded'), translate('clickAddedDescription'), 'success');
    }
    else {
        addNotification(translate('clickAddError'), translate('clickAddErrorDescription'), 'error');
        UDAErrorLogger.error("Unable save record click " + node.outerHTML);
    }
    return;
});
//# sourceMappingURL=recordUserClick.js.map