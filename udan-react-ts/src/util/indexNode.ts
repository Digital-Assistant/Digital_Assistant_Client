// Check for each node and then match it with the available clicknodes which are identified by links.js
import {CONFIG} from "../config";
import domJSON from "domjson";
import {getNodeLabels, htmlIndex, inArray, logInfo, menuItems, UDAClickObjects} from "./index";

export const indexNode = (
    node: any,
    parentNode: any,
    hasParentNodeClick = false,
    fromDocumentClick = false
) => {
  const elementData: any = {
    "element-type": "",
    "element-labels": [],
    "element-action": "",
    "element-path": "",
    "element-url": "",
    "element-data": [],
    "menu-items": [],
  };

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

  if (parentNode.classList && parentNode.classList.contains("tab-content")) {
    node.displaytype = "tab-content";
    node.tabid = node.id;
  }

  // Multiple clicks are recorded for select2-selection class. select2-selection--multiple
  // This will create a problem during playback. We should record only one click to avoid this problem
  if (
      node.classList &&
      (node.classList.contains("select2-search__field") ||
          node.classList.contains("cdk-overlay-backdrop") ||
          node.classList.contains("cdk-overlay-pane"))
  ) {
    logInfo(node.classList);
    return node;
  }

  if (node.hasAttribute("disabled")) {
    return node;
  }

  if (node.hasAttribute("readOnly")) {
    // return node;
  }

  if (CONFIG?.htmlIndex?.length > 0) {
    for (let htmlI = 0; htmlI < CONFIG?.htmlIndex?.length; htmlI++) {
      if (node?.isSameNode(CONFIG.htmlIndex[htmlI]["element-data"])) {
        node.hasclick = true;
        return node;
      }
    }
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
    logInfo({indexingnode: node});
  }

  if (node.hasAttribute("type") && node.getAttribute("type") === "hidden") {
    return node;
  }

  if (fromDocumentClick) {
    clickObjectExists = true;
    udaClickObject = node;
  }

  if (clickObjectExists) {
    node.hasclick = true;
    elementData["element-type"] = node.nodeName.toLowerCase();
    elementData["element-url"] = window.location.href;

    if (parentNode.classList && parentNode.classList.contains("tab-content")) {
      node.displaytype = "tab-content";
    }

    if (elementData["element-labels"]?.length === 0) {
      elementData["element-labels"] = getNodeLabels(node, [], 1);
    }

    if (elementData["element-labels"]?.length === 0) {
      return node;
    }

    if (
        (node.hasOwnProperty("displaytype") &&
            node.displaytype === "tab-content") ||
        (node.hasOwnProperty("navtype") && node.navtype === "navtab")
    ) {
      for (let j = 0; j < menuItems?.length; j++) {
        let menuitem = menuItems[j];
        if (menuitem.refid === node.tabid) {
          if (menuitem.menunode.hasOwnProperty("path")) {
            node.path = menuitem.menunode.path + ">" + menuitem.name;
          } else {
            node.path = menuitem.name;
          }
          if (node.hasOwnProperty("menuitems")) {
            node.menuitems.push(menuitem);
          } else {
            node.menuitems = [];
            node.menuitems.push(menuitem);
          }
        }
      }
    }

    if (elementData["element-path"] === "") {
      if (node.hasOwnProperty("path")) {
        elementData["element-path"] = node.path;
      }
    }

    if (
        node.getAttribute("data-toggle") &&
        node.getAttribute("data-toggle") === "tab"
    ) {
      node.navtype = "navtab";
      elementData["element-action"] = "navtab";
    }

    let uda_custom = {
      hasParentClick: false,
      parentNode: {},
      domJson: domJSON.toJSON(node, {serialProperties: true}),
    };
    if (hasParentNodeClick) {
      uda_custom.hasParentClick = true;
      uda_custom.parentNode = parentNode;
    }
    node.uda_custom = uda_custom;

    elementData["element-data"] = node;
    elementData["clickobject"] = udaClickObject;

    CONFIG.htmlIndex.push(elementData);
  }

  return node;
};
