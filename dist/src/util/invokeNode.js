var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAbsoluteOffsets, getFromStore, getObjData, setToStore } from "./index";
import { CONFIG } from "../config";
import { trigger } from "./events";
import { translate } from "./translation";
import { processDistanceOfNodes } from "./processDistanceOfNodes";
import { matchAction } from "./matchAction";
import { removeToolTip } from "./addToolTip";
import { searchNodes } from "./searchNodes";
import { UDAConsoleLogger } from "../config/error-log";
import { addNotification } from "./addNotification";
/**
 * Get selected record from storage
 */
export const getSelectedRecordFromStore = () => {
    return getFromStore(CONFIG.SELECTED_RECORDING, false);
};
/**
 * Update the record data to storage
 * @param index
 */
export const updateRecordToStore = (index) => __awaiter(void 0, void 0, void 0, function* () {
    let selectedRecordingDetails = yield getFromStore(CONFIG.SELECTED_RECORDING, false);
    selectedRecordingDetails.userclicknodesSet[index].status = "completed";
    setToStore(selectedRecordingDetails, CONFIG.SELECTED_RECORDING, false);
});
/**
 *  Play the next clicked node from the sequence detail.
 */
export const playNextNode = () => {
    setTimeout(function () {
        removeToolTip();
        trigger("ContinuePlay", { action: 'ContinuePlay' });
    }, CONFIG.DEBOUNCE_INTERVAL);
};
/**
 * Matching the clickable node.
 * @param recordedNode
 */
export const matchNode = (recordedNode) => {
    var _a, _b;
    if (!recordedNode.node) {
        return true;
    }
    const originalNode = getObjData((_a = recordedNode === null || recordedNode === void 0 ? void 0 : recordedNode.node) === null || _a === void 0 ? void 0 : _a.objectdata);
    //ignore if recorded node is personal / marked as skip
    if (originalNode.meta.hasOwnProperty('skipDuringPlay') && originalNode.meta.skipDuringPlay) {
        playNextNode();
        return true;
    }
    let clickObjects = [];
    let originalElement = originalNode === null || originalNode === void 0 ? void 0 : originalNode.node;
    let startTime = performance.now();
    if (CONFIG.commonTags.includes(originalElement.nodeName.toLowerCase()) && (originalElement === null || originalElement === void 0 ? void 0 : originalElement.className)) {
        let querySelector = '';
        const classList = originalElement.className.split(" ");
        for (const className of classList) {
            if (className.trim() === '') {
                continue;
            }
            if (querySelector !== '') {
                querySelector += ', ';
            }
            querySelector += originalElement.nodeName.toLowerCase() + "." + className;
        }
        if (querySelector)
            clickObjects = document.querySelectorAll(querySelector);
    }
    if (clickObjects.length === 0) {
        clickObjects = document.getElementsByTagName(originalElement.nodeName);
    }
    let compareElements = [];
    let matchedElements = [];
    let finalMatchElement = null;
    for (let i = 0; i < clickObjects.length; i++) {
        let compareElement = clickObjects[i];
        if (compareElement.nodeName.toLowerCase() === originalElement.nodeName.toLowerCase()) {
            if (originalElement.offset) {
                const _offsets = getAbsoluteOffsets(compareElement);
                if (_offsets.x == originalElement.offset.x &&
                    _offsets.y == originalElement.offset.y) {
                    finalMatchElement = compareElement;
                    break;
                }
            }
            compareElements.push({ nodeName: compareElement.nodeName, node: compareElement });
        }
    }
    if (finalMatchElement === null) {
        if (matchedElements.length == 1) {
            // add to the variable as only one element matched
            finalMatchElement = matchedElements[0];
        }
        else if (matchedElements.length > 1) {
            // check the distance of the matched elements on the page
            finalMatchElement = processDistanceOfNodes(matchedElements, recordedNode);
        }
        else if (matchedElements.length === 0) {
            //  fall back to old logic
            finalMatchElement = searchNodes(recordedNode, compareElements);
        }
    }
    let endTime = performance.now();
    let difference = endTime - startTime;
    UDAConsoleLogger.info('StartTime: ' + startTime, 1);
    UDAConsoleLogger.info('EndTime: ' + endTime, 1);
    UDAConsoleLogger.info('Difference: ' + difference, 1);
    if (finalMatchElement !== null) {
        matchAction(finalMatchElement, recordedNode.node, (_b = recordedNode === null || recordedNode === void 0 ? void 0 : recordedNode.additionalParams) === null || _b === void 0 ? void 0 : _b.slowPlaybackTime);
        return true;
    }
    else {
        // show alert to the user as we didnt found the recorded element on the page.
        // alert(translate('playBackError'));
        addNotification(translate('playBackTittle'), translate('playBackError'), 'error');
        return false;
    }
};
//# sourceMappingURL=invokeNode.js.map