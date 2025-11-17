import {getObjData} from "../node/getObjData";
import {getAbsoluteOffsets} from "../node/getAbsoluteOffsets";
import {CONFIG} from "../../config";
import {trigger} from "../node";
import {translate} from "../translate/translation";
import {processDistanceOfNodes} from "../node";
import {matchAction} from "./matchAction";
import {removeToolTip} from "../notification/addToolTip";
import {searchNodes} from "../node";
import {UDAConsoleLogger} from "../error/error-log";
import {addNotification} from "../notification/addNotification";
import {delay} from "./delay";
import {StorageUtil} from "../storage";
import {nodeConfig} from "../node";

/**
 * Get selected record from storage
 */
export const getSelectedRecordFromStore = async () => {
  return StorageUtil.get(CONFIG.SELECTED_RECORDING, false);
}

/**
 * Update the record data to storage
 * @param index
 */
export const updateRecordToStore = async (index: any) => {
  let selectedRecordingDetails: any = await StorageUtil.get(CONFIG.SELECTED_RECORDING, false);
  selectedRecordingDetails.userclicknodesSet[index].status = "completed";
    StorageUtil.add(selectedRecordingDetails, CONFIG.SELECTED_RECORDING, false);
}
/**
 *  Play the next clicked node from the sequence detail.
 */
export const playNextNode = () => {
  setTimeout(function () {
    removeToolTip();
    trigger("ContinuePlay", {action: 'ContinuePlay'});
  }, CONFIG.DEBOUNCE_INTERVAL);
}

/**
 * Matching the clickable node.
 * @param recordedNode
 */
export const matchNode = async (recordedNode: any) => {

  if(!recordedNode.node){
    return true;
  }

  const originalNode = getObjData(recordedNode?.node?.objectdata);

  //ignore if recorded node is personal / marked as skip
  if (originalNode.meta.hasOwnProperty('skipDuringPlay') && originalNode.meta.skipDuringPlay) {
    playNextNode();
    return true;
  }

  // waiting for the page to get loaded based on the time given during recording
  if(window.UDAGlobalConfig.enableSlowReplay && originalNode.hasOwnProperty('meta') && originalNode.meta.hasOwnProperty('slowPlaybackTime') && parseInt(originalNode.meta.slowPlaybackTime) > 0) {
    await delay(parseInt(originalNode.meta.slowPlaybackTime)*1000);
  }

  let clickObjects: any = [];
  let originalElement = originalNode?.node;

  let startTime = performance.now();

  if(nodeConfig.commonTags.includes(originalElement.nodeName.toLowerCase()) && originalElement?.className){
    let querySelector = '';
    const classList = originalElement.className.split(" ");
    for(const className of classList){
      if(className.trim() === ''){
        continue;
      }
      if(querySelector!==''){
        querySelector +=', ';
      }
      querySelector += originalElement.nodeName.toLowerCase()+"."+className
    }
    if(querySelector)
      clickObjects = document.querySelectorAll(querySelector);
  }

  if(clickObjects.length === 0) {
    clickObjects = document.getElementsByTagName(
        originalElement.nodeName
    );
  }

  let compareElements: any = []
  let matchedElements: any = [];
  let finalMatchElement: any = null;

  for (let i = 0; i < clickObjects.length; i++) {
    let compareElement = clickObjects[i];
    if (compareElement.nodeName.toLowerCase() === originalElement.nodeName.toLowerCase()) {
      if (originalElement.offset) {
        const _offsets = getAbsoluteOffsets(compareElement);
        if (
            _offsets.x == originalElement.offset.x &&
            _offsets.y == originalElement.offset.y
        ) {
          finalMatchElement = compareElement;
          break;
        }
      }
      compareElements.push({nodeName: compareElement.nodeName, node: compareElement});
    }
  }

  if (finalMatchElement === null) {
    if (matchedElements.length == 1) {
      // add to the variable as only one element matched
      finalMatchElement = matchedElements[0];
    } else if (matchedElements.length > 1) {
      // check the distance of the matched elements on the page
      finalMatchElement = processDistanceOfNodes(matchedElements, recordedNode);
    } else if (matchedElements.length === 0) {
      //  fall back to old logic
      finalMatchElement = searchNodes(recordedNode, compareElements);
    }
  }

  let endTime = performance.now();

  let difference = endTime - startTime;

  UDAConsoleLogger.info('StartTime: '+ startTime, 1);
  UDAConsoleLogger.info('EndTime: '+ endTime, 1);
  UDAConsoleLogger.info('Difference: '+ difference, 1);

  if (finalMatchElement !== null) {
    matchAction(finalMatchElement, recordedNode.node, recordedNode?.additionalParams?.slowPlaybackTime)
    return true;
  } else {
    // show alert to the user as we didnt found the recorded element on the page.
    // alert(translate('playBackError'));
    addNotification(translate('playBackTittle'), translate('playBackError'), 'error');
    return false;
  }
}


