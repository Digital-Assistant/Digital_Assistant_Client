import {addBodyEvents} from "./addBodyEvents";
import {CONFIG} from "../config";
import {getFromStore} from "./index";
import {on} from "./events";
import {saveClickData} from "../services";

export let timer: any = null;

const observer = new MutationObserver(async () => {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(async () => {
    const isRecording = getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true";

    if (isRecording) {
      await addBodyEvents();
    }
  }, CONFIG.indexInterval);

});
observer.observe(document.body, {attributes: true, childList: true, subtree: true});

on("UDANodeData", async (data: any)=>{
  console.log(data);
  let response = await saveClickData(data.detail.relatedTarget, data.detail._text, data.detail.meta);
  console.log(response);
});
