import {addBodyEvents} from "./addBodyEvents";
import {CONFIG} from "../config";
import {getFromStore} from "./index";

export let timer: any = null;

const observer = new MutationObserver(async () => {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(async () => {
    const isRecording = getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true";

    // CONFIG.isRecording = isRecording;

    if (isRecording) {
      await addBodyEvents();
    }
  }, CONFIG.indexInterval);

});
observer.observe(document.body, {attributes: true, childList: true, subtree: true});
