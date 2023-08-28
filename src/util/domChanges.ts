import {addBodyEvents} from "./addBodyEvents";
import {CONFIG} from "../config";
import {getFromStore} from "./index";
import {on} from "./events";
import {saveClickData} from "../services";
import {saveUserClick} from "./recordUserClick";

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

on("UDASaveNodeData", async (data: any)=>{
  console.log(data);
  console.log({node: data.detail.data.jsonData});
  await saveUserClick(data.detail.data.jsonData, data.detail.data.originalNode, data);
});
