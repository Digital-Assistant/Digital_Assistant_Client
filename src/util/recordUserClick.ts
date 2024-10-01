// add jsdocs
import {CONFIG} from "../config";
import {getClickedInputLabels} from "./getClickedInputLabels";
import {UDAErrorLogger} from "../config/error-log";
import {clickableElementExists, getFromStore, setToStore} from "./index";
import {saveClickData} from "../services";
import {checkNodeValues} from "./checkNodeValues";
import mapClickedElementToHtmlFormElement from "./recording-utils/mapClickedElementToHtmlFormElement";
import {addNotification} from "./addNotification";
import {translate} from "./translation";
import {trigger} from "./events";
declare const UDAGlobalConfig;

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
export const recordUserClick = async (node: HTMLElement, event: any) => {

  if (!node) return false;

  const isRecording = getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true";

  if (!isRecording) {
    return;
  }

  if (node.isSameNode(window.clickedNode)) {
    return;
  }

  if(CONFIG.lastClickedTime && (CONFIG.lastClickedTime === Date.now() || ((CONFIG.lastClickedTime + 300) >= Date.now()))){
    return ;
  }

  //should not record untrusted clicks
  if(!event.isTrusted){
    return;
  }

  // node = event.target;
  let recordingNode = node;

  let addIsPersonal = false;

  //add the record click for parent element and ignore the children
  const closestParent: any = node.closest('[udaIgnoreChildren]');
  if (closestParent) {
    recordingNode = closestParent;
    addIsPersonal =  true;
  }


  if (recordingNode.isSameNode(window.clickedNode)) {
    return;
  }

  // ignore click on unwanted node
  if(recordingNode.hasAttribute('udaIgnoreClick')){
    return ;
  }

  if(checkNodeValues(recordingNode, 'exclude')){
    return ;
  }

  if (clickableElementExists(recordingNode) || clickableElementExists(node)) {
    return;
  }

  global.clickedNode = recordingNode;

  let meta: any = {};

  let _text = getClickedInputLabels(recordingNode);

  if(addIsPersonal) {
    meta.isPersonal = true;
  }

  // adding default system detected html element type in metadata
  if(UDAGlobalConfig.enableNodeTypeSelection) {
    meta.systemDetected = mapClickedElementToHtmlFormElement(node);
    if (meta.systemDetected.inputElement !== 'others') {
      meta.selectedElement = meta.systemDetected;
    }
  }


  if (!_text || _text?.length > 100 || !_text?.trim()?.length) {


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

  const resp: any = await saveClickData(recordingNode, _text, meta);
  if (resp) {
    if (!global.udanSelectedNodes){
      global.udanSelectedNodes = [];
    }

    global.udanSelectedNodes.push(recordingNode);
    if(!recordingNode.isSameNode(node))
      global.udanSelectedNodes.push(node);

    CONFIG.lastClickedTime=Date.now();

    const activeRecordingData: any = getFromStore(CONFIG.RECORDING_SEQUENCE, false);
    if (activeRecordingData) {
      activeRecordingData.push(resp);
      setToStore(activeRecordingData, CONFIG.RECORDING_SEQUENCE, false);
    } else {
      setToStore([resp], CONFIG.RECORDING_SEQUENCE, false);
    }
    trigger("updateRecordedData",{});
    addNotification(translate('clickAdded'), translate('clickAddedDescription'), 'success');
  } else {
    addNotification(translate('clickAddError'), translate('clickAddErrorDescription'), 'error');
    UDAErrorLogger.error("Unable save record click " + node.outerHTML);
  }

  return;
};
