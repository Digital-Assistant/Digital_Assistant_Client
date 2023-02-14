import {addBodyEvents} from "./addBodyEvents";
import {CONFIG} from "../config";
import {getFromStore} from "./index";

export let timer: any = null;

const observer = new MutationObserver(async () => {
  const isRecording = getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true";

  if (isRecording) {
    await addBodyEvents();
  }
});
observer.observe(document.body, {attributes: false, childList: true, subtree: true});
