// Check for each node and then match it with the available clicknodes which are identified by links.js
import {CONFIG} from "../config";
import {inArray} from "./index";
import {UDAConsoleLogger} from "../config/error-log";

declare let UDAClickObjects: any;

export const indexNode = (
    node: any,
    parentNode: any,
    hasParentNodeClick = false,
    fromDocumentClick = false
) => {

  let clickObjectExists = false;
  let udaClickObject = {};

  if (node.hasAttribute("nist-voice") && node.getAttribute("nist-voice")) {
    return node;
  }

  if (node.hasAttribute("uda-added") && node.getAttribute("uda-added")) {
    return node;
  }

  if (node.nodeName.toLowerCase() === "mat-checkbox") {
    return node;
  }

  if (
      inArray(node.nodeName.toLowerCase(), CONFIG.ignoreClicksOnSpecialNodes) !==
      -1
  ) {
    return node;
  }

  // Multiple clicks are recorded for select2-selection class. select2-selection--multiple
  // This will create a problem during playback. We should record only one click to avoid this problem
  if (
      node.classList &&
      (node.classList.contains("select2-search__field") ||
          node.classList.contains("cdk-overlay-backdrop") ||
          node.classList.contains("cdk-overlay-pane"))
  ) {
    UDAConsoleLogger.info(node.classList);
    return node;
  }

  if (node.hasAttribute("disabled")) {
    return node;
  }

  if (node.hasAttribute("readOnly")) {
    // return node;
  }

  if(node.hasOwnProperty('addedClickRecord') && node.addedClickRecord){
    return node;
  }

  if (!parentNode) {
    console.log(UDAClickObjects);
  }

  for (let i = 0; i < UDAClickObjects?.length; i++) {
    if (UDAClickObjects[i].element === window) {
      continue;
    }
    if (node?.isSameNode(UDAClickObjects[i].element)) {
      clickObjectExists = true;
      udaClickObject = UDAClickObjects[i];
    }
  }

  if (
      inArray(node.nodeName.toLowerCase(), CONFIG.ignoreNodesFromIndexing) !== -1
  ) {
    UDAConsoleLogger.info({indexingNode: node});
  }

  if (node.hasAttribute("type") && node.getAttribute("type") === "hidden") {
    return node;
  }

  if (fromDocumentClick) {
    clickObjectExists = true;
  }

  if (clickObjectExists) {
    node.hasclick = true;
  }

  return node;
};
