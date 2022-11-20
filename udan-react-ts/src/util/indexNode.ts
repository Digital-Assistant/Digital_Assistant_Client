// Check for each node and then match it with the available clicknodes which are identified by links.js
import {CONFIG} from "../config";
import domJSON from "domjson";
import {getNodeLabels, htmlindex, inArray, logInfo, menuitems, UDAClickObjects} from "./index";

export const indexnode = (
    node: any,
    parentnode: any,
    hasparentnodeclick = false,
    fromdocumentclick = false
) => {
  const elementdata: any = {
    "element-type": "",
    "element-labels": [],
    "element-action": "",
    "element-path": "",
    "element-url": "",
    "element-data": [],
    "menu-items": [],
  };

  let clickobjectexists = false;
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

  if (parentnode.classList && parentnode.classList.contains("tab-content")) {
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
    for (let htmli = 0; htmli < CONFIG?.htmlIndex?.length; htmli++) {
      if (node?.isSameNode(CONFIG.htmlIndex[htmli]["element-data"])) {
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
      clickobjectexists = true;
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

  if (fromdocumentclick) {
    clickobjectexists = true;
    udaClickObject = node;
  }

  if (clickobjectexists) {
    node.hasclick = true;
    elementdata["element-type"] = node.nodeName.toLowerCase();
    elementdata["element-url"] = window.location.href;

    if (parentnode.classList && parentnode.classList.contains("tab-content")) {
      node.displaytype = "tab-content";
    }

    if (elementdata["element-labels"]?.length === 0) {
      elementdata["element-labels"] = getNodeLabels(node, [], 1);
    }

    if (elementdata["element-labels"]?.length === 0) {
      return node;
    }

    if (
        (node.hasOwnProperty("displaytype") &&
            node.displaytype === "tab-content") ||
        (node.hasOwnProperty("navtype") && node.navtype === "navtab")
    ) {
      for (let j = 0; j < menuitems?.length; j++) {
        let menuitem = menuitems[j];
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

    if (elementdata["element-path"] === "") {
      if (node.hasOwnProperty("path")) {
        elementdata["element-path"] = node.path;
      }
    }

    if (
        node.getAttribute("data-toggle") &&
        node.getAttribute("data-toggle") === "tab"
    ) {
      node.navtype = "navtab";
      elementdata["element-action"] = "navtab";
    }

    let uda_custom = {
      hasparentclick: false,
      parentnode: {},
      domJson: domJSON.toJSON(node),
    };
    if (hasparentnodeclick) {
      uda_custom.hasparentclick = true;
      uda_custom.parentnode = parentnode;
    }
    node.uda_custom = uda_custom;

    elementdata["element-data"] = node;
    elementdata["clickobject"] = udaClickObject;

    htmlindex.push(elementdata);
  }

  return node;
};
