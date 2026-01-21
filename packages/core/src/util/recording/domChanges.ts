import {addBodyEvents} from "./addBodyEvents";
import {CONFIG} from "../../config";
import {StorageUtil} from "../storage";

// Timer variable to debounce DOM change events.
export let timer: any = null;

/**
 * `MutationObserver` instance that watches for changes in the DOM.
 * Lazy-initialized to avoid errors in service worker contexts.
 */
let _observer: MutationObserver | null = null;

/**
 * Gets or creates the MutationObserver instance.
 * Only creates it when needed (in browser contexts with DOM).
 */
function getObserver(): MutationObserver {
    if (!_observer) {
        if (typeof MutationObserver === 'undefined') {
            throw new Error('MutationObserver is not available in this context');
        }

        _observer = new MutationObserver((mutationList, observer) => {
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
    }
    return _observer;
}

/**
 * Export observer as a getter for backward compatibility.
 * This allows existing code using `observer.observe()` to continue working.
 */
export const observer = {
    observe: (target: Node, options?: MutationObserverInit) => {
        return getObserver().observe(target, options);
    },
    disconnect: () => {
        return getObserver().disconnect();
    },
    takeRecords: () => {
        return getObserver().takeRecords();
    }
};

/**
 * Initializes the DOM change observation.
 * This function starts the `MutationObserver` to watch for attribute changes,
 * child list modifications, and subtree changes on the `document.body`.
 */
export function initializeDomChanges() {
    console.log('Initialized dom changes.');
    getObserver().observe(document.body, {attributes: true, childList: true, subtree: true});
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
