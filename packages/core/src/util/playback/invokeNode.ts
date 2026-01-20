import {getObjData} from "../node";
import {getAbsoluteOffsets} from "../node";
import {CONFIG} from "../../config";
import {trigger} from "../node";
import {translate} from "../translate";
import {processDistanceOfNodes} from "../node";
import {matchAction} from "./matchAction";
import {removeToolTip} from "../notification";
import {searchNodes} from "../node";
import {UDAConsoleLogger} from "../error";
import {addNotification} from "../notification";
import {delay} from "./delay";
import {StorageUtil} from "../storage";
import {nodeConfig} from "../node";

/**
 * Retrieves the currently selected recording details from storage.
 *
 * @returns A promise that resolves to the selected recording object.
 */
export const getSelectedRecordFromStore = async () => {
  return StorageUtil.getFromStore(CONFIG.SELECTED_RECORDING, false);
}

/**
 * Updates the status of a specific node in the selected recording to "completed" and saves it back to storage.
 *
 * @param index The index of the node within the `userclicknodesSet` array to update.
 */
export const updateRecordToStore = async (index: any) => {
  let selectedRecordingDetails: any = await StorageUtil.getFromStore(CONFIG.SELECTED_RECORDING, false);
  if (selectedRecordingDetails && selectedRecordingDetails.userclicknodesSet && selectedRecordingDetails.userclicknodesSet[index]) {
    selectedRecordingDetails.userclicknodesSet[index].status = "completed";
    StorageUtil.setToStore(selectedRecordingDetails, CONFIG.SELECTED_RECORDING, false);
  }
}

/**
 * Plays the next clicked node from the sequence detail after a short delay.
 * It first removes any active tooltips and then triggers a 'ContinuePlay' event.
 */
export const playNextNode = () => {
  setTimeout(function () {
    removeToolTip();
    trigger("ContinuePlay", {action: 'ContinuePlay'});
  }, CONFIG.DEBOUNCE_INTERVAL);
}

/**
 * Matches a recorded DOM node with a live DOM element on the page and then invokes the corresponding action.
 * This function handles various matching strategies, including exact offset matches, distance-based matching,
 * and a fallback to an older search logic. It also incorporates delays for slow playback.
 *
 * @param recordedNode The recorded node object containing its data and metadata.
 * @returns A promise that resolves to `true` if a match is found and action is invoked, `false` otherwise.
 */
export const matchNode = async (recordedNode: any) => {

  // If no recorded node data is provided, consider it a successful "match" and proceed.
  if(!recordedNode.node){
    return true;
  }

  // Parse the object data from the recorded node.
  const originalNode = getObjData(recordedNode?.node?.objectdata);

  // If the recorded node is marked to be skipped during playback, proceed to the next node.
  if (originalNode.meta.hasOwnProperty('skipDuringPlay') && originalNode.meta.skipDuringPlay) {
    playNextNode();
    return true;
  }

  // If slow replay is enabled and a `slowPlaybackTime` is specified, introduce a delay.
  if(window.UDAGlobalConfig.enableSlowReplay && originalNode.hasOwnProperty('meta') && originalNode.meta.hasOwnProperty('slowPlaybackTime') && parseInt(originalNode.meta.slowPlaybackTime) > 0) {
    await delay(parseInt(originalNode.meta.slowPlaybackTime)*1000);
  }

  let clickObjects: any = [];
  let originalElement = originalNode?.node;

  let startTime = performance.now(); // Start time for performance measurement.

  // Attempt to find elements by class name if the original element is a common tag (span, div).
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

  // If no elements were found by class, fall back to finding all elements by tag name.
  if(clickObjects.length === 0) {
    clickObjects = document.getElementsByTagName(
        originalElement.nodeName
    );
  }

  let compareElements: any = [] // Stores elements for the old search logic.
  let matchedElements: any = []; // Stores elements that match by node name.
  let finalMatchElement: any = null; // The best matching element found.

  // Iterate through potential live elements to find a match.
  for (let i = 0; i < clickObjects.length; i++) {
    let compareElement = clickObjects[i];
    // Only compare elements with the same node name.
    if (compareElement.nodeName.toLowerCase() === originalElement.nodeName.toLowerCase()) {
      // If the original recorded element had offset information, try to find an exact match by coordinates.
      if (originalElement.offset) {
        const _offsets = getAbsoluteOffsets(compareElement);
        if (
            _offsets.x == originalElement.offset.x &&
            _offsets.y == originalElement.offset.y
        ) {
          finalMatchElement = compareElement; // Exact match found.
          break; // Exit loop early.
        }
      }
      // Add to `compareElements` for the old search logic if no exact match is found yet.
      compareElements.push({nodeName: compareElement.nodeName, node: compareElement});
    }
  }

  // If an exact match wasn't found, apply further matching strategies.
  if (finalMatchElement === null) {
    if (matchedElements.length == 1) {
      // If only one element matched by node name, it's the final match.
      finalMatchElement = matchedElements[0];
    } else if (matchedElements.length > 1) {
      // If multiple elements matched by node name, use distance-based processing to find the closest.
      finalMatchElement = processDistanceOfNodes(matchedElements, recordedNode);
    } else if (matchedElements.length === 0) {
      // If no elements matched by node name, fall back to the older, more general search logic.
      finalMatchElement = await searchNodes(recordedNode, compareElements);
    }
  }

  let endTime = performance.now(); // End time for performance measurement.

  let difference = endTime - startTime; // Calculate the time taken for matching.

  UDAConsoleLogger.info('StartTime: '+ startTime, 1);
  UDAConsoleLogger.info('EndTime: '+ endTime, 1);
  UDAConsoleLogger.info('Difference: '+ difference, 1);

  // If a matching element is found, invoke the action on it.
  if (finalMatchElement !== null) {
    // matchAction(finalMatchElement, recordedNode.node, recordedNode?.additionalParams?.slowPlaybackTime)
    matchAction(finalMatchElement, recordedNode.node, recordedNode?.selectedRecordingDetails);
    return true;
  } else {
    // If no matching element is found, display an error notification to the user.
    addNotification(translate('playBackTittle'), translate('playBackError'), 'error');
    return false;
  }
}
