// This module is responsible for recording user click events on DOM elements.
// It performs various checks to determine if a click should be recorded, processes the node data,
// and then saves the relevant information for later playback.

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
 * Records a user click event on a given DOM node.
 * This function performs several checks to validate the click, processes the node's data,
 * and stores it as part of a recording sequence.
 *
 * @param node The DOM node that was clicked.
 * @param event The event object associated with the click.
 * @returns A boolean indicating whether the click was processed (`true`) or ignored (`false`).
 */
export const recordUserClick = async (node: any, event: any) => {

    if (!node) return false;

    // Check if recording is currently active.
    const isRecording = StorageUtil.getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true";

    if (!isRecording) {
        return false; // If not recording, ignore the click.
    }

    // Prevent recording duplicate clicks on the same node in quick succession.
    if (node.isSameNode(window.clickedNode)) {
        return false;
    }

    // Debounce clicks to prevent multiple rapid recordings from a single user action.
    if (CONFIG.lastClickedTime && (CONFIG.lastClickedTime === Date.now() || ((CONFIG.lastClickedTime + 300) >= Date.now()))) {
        return false;
    }

    // Only record trusted events (actual user interactions).
    if (!event.isTrusted) {
        return false;
    }

    let recordingNode = node; // The node that will be recorded.
    let addIsPersonal = false; // Flag to indicate if the node is a "personal" node.

    // Check if the clicked node is a child of an element marked to ignore children.
    const closestParent: any = node.closest('[udaIgnoreChildren]');
    if (closestParent) {
        recordingNode = closestParent; // Record the parent instead of the child.
        addIsPersonal = true; // Mark as personal since it's a specific override.
    }

    // Prevent recording duplicate clicks on the same recording node.
    if (recordingNode.isSameNode(window.clickedNode)) {
        return false;
    }

    // Ignore clicks on nodes explicitly marked with 'udaIgnoreClick'.
    if (recordingNode.hasAttribute('udaIgnoreClick')) {
        return false;
    }

    // Ignore clicks on nodes that match exclusion criteria.
    if (checkNodeValues(recordingNode, 'exclude')) {
        return false;
    }

    // If the element is already considered clickable or recorded, do not re-record.
    if (clickableElementExists(recordingNode) || clickableElementExists(node)) {
        return false;
    }

    window.clickedNode = recordingNode; // Store the last recorded node to prevent immediate duplicates.

    let meta: any = {}; // Metadata object for the recorded click.

    // Get descriptive labels for the clicked input.
    let _text = getClickedInputLabels(recordingNode);

    if (addIsPersonal) {
        meta.isPersonal = true;
    }

    // Add default system-detected HTML element type to metadata if enabled.
    if (window.UDAGlobalConfig.enableNodeTypeSelection) {
        meta.systemDetected = mapClickedElementToHtmlFormElement(node);
        if (meta.systemDetected.inputElement !== 'others') {
            meta.selectedElement = meta.systemDetected;
        }
    }

    // If no text is found, or it's too long, or empty, mark as personal and use nodeName as text.
    if (!_text || _text?.length > 100 || !_text?.trim()?.length) {
        meta.isPersonal = true;
        _text = recordingNode.nodeName;
    }

    // Add personal flag to icon elements.
    if (checkNodeValues(recordingNode, 'iconNodes')) {
        meta.isPersonal = true;
    }

    // Add specific display text for text editor elements.
    if (checkNodeValues(recordingNode, 'textEditors')) {
        meta.displayText = 'Text Editor';
    }

    // Add specific display text for dropdown elements.
    if (checkNodeValues(recordingNode, 'dropDowns')) {
        meta.displayText = 'Drop Down';
    }

    // Add specific display text for date selector elements.
    if (checkNodeValues(recordingNode, 'datePicker')) {
        meta.displayText = 'Date Selector';
    }

    // Save the processed click data.
    const resp: any = await saveClickData(recordingNode, _text, meta);
    console.log(resp);

    if (resp) {
        // Add the recorded node to a global list of selected nodes.
        if (!window.udanSelectedNodes) {
            window.udanSelectedNodes = [];
        }
        window.udanSelectedNodes.push(recordingNode);
        if (!recordingNode.isSameNode(node)) {
            window.udanSelectedNodes.push(node);
        }

        CONFIG.lastClickedTime = Date.now(); // Update the last clicked time for debouncing.

        // Retrieve and update the active recording sequence in storage.
        const activeRecordingData: any = StorageUtil.getFromStore(CONFIG.RECORDING_SEQUENCE, false);
        if (activeRecordingData) {
            activeRecordingData.push(resp);
            StorageUtil.setToStore(activeRecordingData, CONFIG.RECORDING_SEQUENCE, false);
        } else {
            StorageUtil.setToStore([resp], CONFIG.RECORDING_SEQUENCE, false);
        }

        // Update the Redux store with the new recording sequence data.
        const state: any = (store as any).getState?.();
        const curr = state?.recording?.recSequenceData || [];
        (store as any).dispatch(setRecSequenceData([...curr, resp]));

        // Display a success notification.
        addNotification(translate('clickAdded'), translate('clickAddedDescription'), 'success');
    } else {
        // Display an error notification if saving fails.
        addNotification(translate('clickAddError'), translate('clickAddErrorDescription'), 'error');
        await UDAErrorLogger.error("Unable to save record click ", node.outerHTML);
    }

    return true;
};
