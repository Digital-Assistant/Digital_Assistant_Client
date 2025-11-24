import {addBodyEvents} from "./addBodyEvents";
import {CONFIG} from "../../config";
import {StorageUtil} from "../storage";

// Timer variable to debounce DOM change events.
export let timer: any = null;

/**
 * `MutationObserver` instance that watches for changes in the DOM.
 * When changes are detected, it debounces the `addBodyEvents` function call
 * to re-attach event listeners if recording is active.
 */
export const observer = new MutationObserver((mutationList, observer) => {
    // Clear any existing timer to debounce the event.
    if (timer) {
        clearTimeout(timer);
    }
    // Set a new timer to call `addBodyEvents` after a delay.
    timer = setTimeout(async () => {
        try {
            // Check if recording is currently active.
            const isRecording = StorageUtil.getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true";

            if (isRecording) {
                console.log('Adding body events.');
                // Re-attach event listeners to the body and its children.
                await addBodyEvents();
            }
        } catch (e) {
            // Log errors but do not crash the observer.
            console.error("Error during DOM change observation:", e);
        }
    }, CONFIG.indexInterval); // Use a configured interval for debouncing.
});

/**
 * Initializes the DOM change observation.
 * This function starts the `MutationObserver` to watch for attribute changes,
 * child list modifications, and subtree changes on the `document.body`.
 */
export function initializeDomChanges() {
    console.log('Initialized dom changes.');
    observer.observe(document.body, {attributes: true, childList: true, subtree: true});
}

/**
 * @internal
 * This function is exported for testing purposes only to reset the module-level timer.
 */
export function _resetTimerForTest() {
    if (timer) {
        clearTimeout(timer);
    }
    timer = null;
}
