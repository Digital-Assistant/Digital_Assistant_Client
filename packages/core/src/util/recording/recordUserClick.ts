// add jsdocs
import {CONFIG} from "../../config";
import {nodeConfig} from "../node/nodeConfig";
import {getClickedInputLabels} from "../node/getClickedInputLabels";
import {saveClickData} from "./saveClickData";
import {checkNodeValues} from "../node/checkNodeValues";
import mapClickedElementToHtmlFormElement from "../recording/mapClickedElementToHtmlFormElement";
import {addNotification} from "../notification/addNotification";
import {translate} from "../translate/translation";
import {UDAErrorLogger} from "../error/";
import {StorageUtil} from "../storage";
import {clickableElementExists} from "../node";
import {setRecSequenceData, store} from "../../store";

/**
 *
 * @param node
 * @param fromDocument
 * @param selectChange
 * @param event
 * @returns
 */
export const recordUserClick = async (node: any, event: any) => {

    if (!node) return false;

    const isRecording = StorageUtil.getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true";

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
    const closestParent: any = node.closest('[udaIgnoreChildren]');
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

    window.clickedNode = recordingNode;

    let meta: any = {};

    let _text = getClickedInputLabels(recordingNode);

    if (addIsPersonal) {
        meta.isPersonal = true;
    }

    // adding default system detected html element type in metadata
    if (window.UDAGlobalConfig.enableNodeTypeSelection) {
        meta.systemDetected = mapClickedElementToHtmlFormElement(node);
        if (meta.systemDetected.inputElement !== 'others') {
            meta.selectedElement = meta.systemDetected;
        }
    }


    if (!_text || _text?.length > 100 || !_text?.trim()?.length) {


        meta.isPersonal = true;

        _text = recordingNode.nodeName;

    }

    // adding personal flag to icon elements
    if (checkNodeValues(recordingNode, 'iconNodes')) {
        meta.isPersonal = true;
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

    const resp: any = await saveClickData(recordingNode, _text, meta);
    console.log(resp);
    if (resp) {
        if (!window.udanSelectedNodes) {
            window.udanSelectedNodes = [];
        }

        window.udanSelectedNodes.push(recordingNode);
        if (!recordingNode.isSameNode(node))
            window.udanSelectedNodes.push(node);

        CONFIG.lastClickedTime = Date.now();

        const activeRecordingData: any = StorageUtil.getFromStore(CONFIG.RECORDING_SEQUENCE, false);
        if (activeRecordingData) {
            activeRecordingData.push(resp);
            StorageUtil.setToStore(activeRecordingData, CONFIG.RECORDING_SEQUENCE, false);
        } else {
            StorageUtil.setToStore([resp], CONFIG.RECORDING_SEQUENCE, false);
        }
        const state: any = (store as any).getState?.();
        const curr = state?.recording?.recSequenceData || [];
        (store as any).dispatch(setRecSequenceData([...curr, resp]));
        addNotification(translate('clickAdded'), translate('clickAddedDescription'), 'success');
    } else {
        addNotification(translate('clickAddError'), translate('clickAddErrorDescription'), 'error');
        await UDAErrorLogger.error("Unable to save record click ", node.outerHTML);
    }

    return;
};
