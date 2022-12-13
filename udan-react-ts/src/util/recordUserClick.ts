import {CONFIG} from "../config";
import {getClickedInputLabels} from "./getClickedInputLabels";
import {UDAErrorLogger} from "../config/error-log";
import {clickableElementExists, getFromStore, setToStore} from "./index";
import {postClickData} from "../services";

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

  /*if (!node.isSameNode(event.target) || clickableElementExists(event.target)) {
    return;
  }*/

  // node = event.target;

  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault();
    event.stopPropagation();
    window.clickedNode = event.target;
  }

  const _text = getClickedInputLabels(node);

  if (!_text || _text?.length > 100 || !_text?.trim()?.length) return;

  let recordingNode = node;

  //add the record click for parent element and ignore the children
  const closestParent: any = node.closest('[udaIgnoreChildren]');
  if (closestParent) {
    console.log(closestParent);
    recordingNode = closestParent;
  }

  if (clickableElementExists(recordingNode)) {
    return;
  }

  const resp = await postClickData(recordingNode, _text);
  if (resp) {
    if (!window.udanSelectedNodes){
      window.udanSelectedNodes = [];
    }

    window.udanSelectedNodes.push(recordingNode);

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
};
