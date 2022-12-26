import {getAbsoluteOffsets, getFromStore, getObjData, setToStore} from "./index";
import {jaroWinkler} from "jaro-winkler-typescript";
import {CONFIG} from "../config";
import {trigger} from "./events";
import {translate} from "./translation";
import {processDistanceOfNodes} from "./processDistanceOfNodes";
import {matchAction} from "./matchAction";
import {removeToolTip} from "./addToolTip";
import {searchNodes} from "./searchNodes";

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
export const matchNode = (recordedNode: any) => {

  if(!recordedNode.node){
    return true;
  }

  const originalNode = getObjData(recordedNode?.node?.objectdata);

  //ignore if recorded node is personal / marked as skip
  if (originalNode.meta.hasOwnProperty('skipDuringPlay') && originalNode.meta.skipDuringPlay) {
    playNextNode();
    return true;
  }

  let clickObjects: any = [];
  let originalElement = originalNode?.node;
  if(CONFIG.commonTags.includes(originalElement.nodeName.toLowerCase())){
    let querySelector = '';
    const classList = originalElement.className.split(" ");
    for(const className of classList){
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
  let leastWeight = -1;
  let leastNode = null;
  let finalMatchElement: any = null;

  for (let i = 0; i < clickObjects.length; i++) {
    let compareElement = clickObjects[i];
    if (compareElement.nodeName.toLowerCase() === originalElement.nodeName.toLowerCase()) {
      let textWeight = 0;
      if(originalElement.outerHTML && compareElement.outerHTML){
        jaroWinkler(
            originalElement.outerHTML,
            compareElement.outerHTML
        );
      }
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
      if (leastWeight > -1 && textWeight > leastWeight) {
        leastWeight = textWeight;
        leastNode = compareElement;
      } else if (leastWeight == -1) {
        leastWeight = textWeight;
        leastNode = compareElement;
      }
      if (originalNode.meta.hasOwnProperty('isPersonal') && originalNode.meta.isPersonal && textWeight >= CONFIG.JARO_WEIGHT_PERSONAL) {
        matchedElements.push(compareElement);
      } else if (textWeight >= CONFIG.JARO_WEIGHT) {
        matchedElements.push(compareElement);
      }
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

  if (finalMatchElement !== null) {
    matchAction(finalMatchElement, recordedNode.node)
    return true;
  } else {
    // show alert to the user as we didnt found the recorded element on the page.
    alert(translate('playBackError'));
    return false;
  }
}


