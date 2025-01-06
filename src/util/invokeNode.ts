import {getAbsoluteOffsets, getFromStore, getObjData, setToStore} from "./index";
import {CONFIG} from "../config";
import {trigger} from "./events";
import {translate} from "./translation";
import {processDistanceOfNodes} from "./processDistanceOfNodes";
import {matchAction} from "./matchAction";
import {removeToolTip} from "./addToolTip";
import {searchNodes} from "./searchNodes";
import {UDAConsoleLogger} from "../config/error-log";
import {addNotification} from "./addNotification";
import {delay} from "./delay";
declare const UDAGlobalConfig;

/**
 * Get selected record from storage
 */
export const getSelectedRecordFromStore = () => {
  return getFromStore(CONFIG.SELECTED_RECORDING, false);
}

/**
 * Update the record data to storage
 * @param index
 */
export const updateRecordToStore = async (index) => {
  let selectedRecordingDetails: any = await getFromStore(CONFIG.SELECTED_RECORDING, false);
  selectedRecordingDetails.userclicknodesSet[index].status = "completed";
  setToStore(selectedRecordingDetails, CONFIG.SELECTED_RECORDING, false);
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
  if(UDAGlobalConfig.enableSlowReplay && originalNode.hasOwnProperty('meta') && originalNode.meta.hasOwnProperty('slowPlaybackTime') && parseInt(originalNode.meta.slowPlaybackTime) > 0) {
    await delay(parseInt(originalNode.meta.slowPlaybackTime)*1000);
  }

  let clickObjects: any = [];
  let originalElement = originalNode?.node;

  let startTime = performance.now();

  if(CONFIG.commonTags.includes(originalElement.nodeName.toLowerCase()) && originalElement?.className){
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


