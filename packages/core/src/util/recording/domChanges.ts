import {addBodyEvents} from "./addBodyEvents";
import {CONFIG} from "../../config";
import {StorageUtil} from "../storage";

export let timer: any = null;

export const observer = new MutationObserver((mutationList, observer) => {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(async () => {
        const isRecording = StorageUtil.getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true";

        if (isRecording) {
            console.log('Adding body events.');
            await addBodyEvents();
        }
    }, CONFIG.indexInterval);

});

export function initializeDomChanges() {
    console.log('Initialized dom changes.');
    observer.observe(document.body, {attributes: true, childList: true, subtree: true});
}
