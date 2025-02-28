import {addBodyEvents} from "./addBodyEvents";
import {CONFIG} from "../config";
import {getFromStore} from "./index";

export let timer: any = null;
let mutationCount = 0;

const observer = new MutationObserver(async (mutationList, observer) => {
  const startTime = performance.now();
  mutationCount++;

  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(async () => {
    const isRecording = getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true";

    if (isRecording) {
      await addBodyEvents();
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    console.group('MutationObserver Performance Metrics');
    console.log(`Mutation #${mutationCount}`);
    console.log(`Execution time: ${executionTime.toFixed(2)}ms`);
    console.log(`Mutations list length: ${mutationList.length}`);
    console.log('Mutation types:', mutationList.map(mutation => mutation.type));
    console.groupEnd();
  }, CONFIG.indexInterval);
});

observer.observe(document.body, {attributes: true, childList: true, subtree: true});
