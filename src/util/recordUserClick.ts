import {CONFIG} from "../config";
import {getClickedInputLabels} from "./getClickedInputLabels";
import {UDAErrorLogger} from "../config/error-log";
import {clickableElementExists, getFromStore, setToStore} from "./index";
import {postClickData} from "../services";
import {checkNodeValues} from "./checkNodeValues";

/**
 *
 * @param node
 * @param fromDocument
 * @param selectChange
 * @param event
 * @returns
 */
export const recordUserClick = async (node: HTMLElement, fromDocument: boolean = false, selectChange: boolean = false, event: any) => {

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
    console.log('untrusted click on : ')
    console.log(node);
  }

  /*if (!node.isSameNode(event.target) || clickableElementExists(event.target)) {
    return;
  }*/

  // node = event.target;
  let recordingNode = node;

  let addIsPersonal = false;

  //add the record click for parent element and ignore the children
  const closestParent: any = node.closest('[udaIgnoreChildren]');
  if (closestParent) {
    recordingNode = closestParent;
    addIsPersonal =  true;
  }


  // ignore click on unwanted node
  if(recordingNode.hasAttribute('udaIgnoreClick')){
    return ;
  }

  //ToDo improve stop propagation by checking only for elements that needs to be stopped
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
  }

  window.clickedNode = event.target;

  if(checkNodeValues(recordingNode, 'exclude')){
    return ;
  }

  if (clickableElementExists(recordingNode) || clickableElementExists(node)) {
    return;
  }

  let meta: any = {};

  let _text = getClickedInputLabels(recordingNode);

  if(addIsPersonal) {
    meta.isPersonal = true;
  }


  if (!_text || _text?.length > 100 || !_text?.trim()?.length) {


    meta.isPersonal = true;

    _text = recordingNode.nodeName;

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

  }

  const resp: any = await postClickData(recordingNode, _text, meta);
  if (resp && resp.id) {
    if (!window.udanSelectedNodes){
      window.udanSelectedNodes = [];
    }

    window.udanSelectedNodes.push(recordingNode);
    window.udanSelectedNodes.push(node);

    CONFIG.lastClickedTime=Date.now();

    const activeRecordingData: any = getFromStore(CONFIG.RECORDING_SEQUENCE, false);
    if (activeRecordingData) {
      activeRecordingData.push(resp);
      setToStore(activeRecordingData, CONFIG.RECORDING_SEQUENCE, false);
    } else {
      setToStore([resp], CONFIG.RECORDING_SEQUENCE, false);
    }
  } else {
    UDAErrorLogger.error("Unable save record click " + node.outerHTML);
  }

  event.target.click();
  // do not remove the below click it was added for performing the click as the clicks are getting stopped in between
  event.target.click();

  return;
};
