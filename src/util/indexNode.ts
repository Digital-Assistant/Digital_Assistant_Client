// Check for each node and then match it with the available clicknodes which are identified by links.js
import {CONFIG} from "../config";
import {inArray} from "./index";
import {UDAConsoleLogger} from "../config/error-log";
import {specialNodes} from "./specialNodes";
import {hasClass} from "./hasClass";

declare const UDAClickObjects;

export const indexNode = (node: any, parentNode: any, hasParentNodeClick = false, fromDocumentClick = false) => {

  let clickObjectExists = false;
  let udaClickObject = {};

  if (node.nodeName.toLowerCase() === "mat-checkbox") {
    return node;
  }

  if (inArray(node.nodeName.toLowerCase(), CONFIG.ignoreClicksOnSpecialNodes) !== -1) {
    return node;
  }

  // Multiple clicks are recorded for select2-selection class. select2-selection--multiple
  // This will create a problem during playback. We should record only one click to avoid this problem
  if (node.classList && (node.classList.contains("uda_exclude") || node.classList.contains("select2-search__field") || node.classList.contains("cdk-overlay-backdrop") || node.classList.contains("cdk-overlay-pane"))) {
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

  for (let i = 0; i < UDAClickObjects?.length; i++) {
    if (UDAClickObjects[i].element === window) {
      continue;
    }
    if (node?.isSameNode(UDAClickObjects[i].element)) {
      clickObjectExists = true;
      udaClickObject = UDAClickObjects[i];
    }
  }

  if (inArray(node.nodeName.toLowerCase(), CONFIG.ignoreNodesFromIndexing) !== -1) {
    UDAConsoleLogger.info({indexingNode: node});
  }

  if (node.hasAttribute("type") && node.getAttribute("type") === "hidden") {
    return node;
  }

  if (fromDocumentClick) {
    clickObjectExists = true;
  }

  //check if special classes to be included in recordable elements
  if (hasClass(node, specialNodes.include.classes) || specialNodes?.include?.tags?.includes(node.nodeName.toLowerCase())) {
    clickObjectExists = true;
  }

  //check if special classes to be excluded from recordable elements
  if (specialNodes?.exclude?.tags?.includes(node.nodeName?.trim()?.toLocaleLowerCase()) || hasClass(node, specialNodes.exclude.classes)) {
    clickObjectExists = false;
  }

  if (clickObjectExists) {
    node.hasClick = true;
  }

  return node;
};
