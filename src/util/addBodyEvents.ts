import {addClickToNode} from "./addClickToNode";
import {isClickableNode} from "./isClickableNode";

/**
 * Add events to body elements
 */
export const addBodyEvents = async () => {
  const startTime = performance.now();
  let nodesProcessed = 0;
  let clickableNodes = 0;

  //exclude content-serving elements from click objects
  let els: any = document.body.querySelectorAll("*"),
      len = els?.length,
      i = 0;
  for (; i < len; i++) {
    try {
      nodesProcessed++;
      /**exclude event attachment for selective elements  */
      if (els[i] && isClickableNode(els[i])) {
        addClickToNode(els[i]);
        clickableNodes++;
      }
    } catch (e) {

    }
  }

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  console.group('AddBodyEvents Performance Metrics');
  console.log(`Total nodes processed: ${nodesProcessed}`);
  console.log(`Clickable nodes found: ${clickableNodes}`);
  console.log(`Execution time: ${executionTime.toFixed(2)}ms`);
  console.log(`Processing speed: ${(nodesProcessed / executionTime).toFixed(2)} nodes/ms`);
  console.groupEnd();
};
