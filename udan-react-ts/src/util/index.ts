import domJSON from "domJson";
import { CONFIG } from "../config";
import {
  recordClicks,
  recordSequence,
  userClick,
} from "../services/recordService";
// import { UDAConsoleLogger, UDAErrorLogger } from '../config/error-log';

export const UDAClickObjects: any = [];
export const htmlindex: any = [];
export const menuitems: any = [];
export const ignoreNodesFromIndexing: any = [];
export const tooltipDisplayedNodes: any = [];
export const ignoreClicksOnSpecialNodes: any = [];
export const ignoreNodesContainingClassNames: any = [];
export const cancelRecordingDuringRecordingNodes: any = [];
export const allowedTags = ["a", "button"];
export const EXCLUDE_ATTRIB = "data-exclude";

/**
 *
 * @param data
 * @param key
 * @param isRaw - is raw data or json
 */
export const setToStore = (data: any, key: string, isRaw: boolean) => {
  localStorage.setItem(key, !isRaw ? JSON.stringify(data) : data);
};

/**
 *
 * @param key
 * @param isRaw - is raw data or json
 * @returns
 */
export const getFromStore = (key: string, isRaw: boolean) => {
  const data = localStorage.getItem(key);
  if (data) return !isRaw ? JSON.parse(data) : data;
};

/**
 *
 * @param key
 * @param isRaw - is raw data or json
 * @returns
 */
export const removeFromStore = (key: string) => {
  localStorage.removeItem(key);
};

export const generateUUID = () => {
  let d = new Date().getTime();
  let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x7) | 0x8).toString(16);
    }
  );

  return uuid.toUpperCase();
};

/**
 * Toggles(squeeze) content body element width
 * @param hide
 */
export const squeezeBody = (hide: boolean) => {
  const _body = document.body;
  if (_body) {
    _body.style.width = !hide ? "" : window.innerWidth - 350 + "px";
  }
};

/**
 * to render search result rows
 */
export const getRowObject = (data: any) => {
  let path = "";
  for (let row of data.userclicknodesSet) {
    if (path !== "") {
      path += " >> ";
    }
    path += row.clickednodename;
  }
  let sequenceName = "";
  try {
    sequenceName = JSON.parse(data.name)[0];
  } catch (e) {
    sequenceName = data.name.toString();
  }
  return { sequenceName, path };
};

export const addBodyEvents = (selector: HTMLElement) => {
  let els = selector.querySelectorAll("*"),
    len = els.length,
    i = 0;
  for (; i < len; i++) {
    /**exclude event attachment for selective elements  */
    if (!els[i].getAttribute(EXCLUDE_ATTRIB)) {
      addClickToNode(els[i]);
    }
  }
};

export const inArray = (elem: any, array: any) => {
  if (array.indexOf) {
    return array.indexOf(elem);
  }

  for (let i = 0, length = array.length; i < length; i++) {
    if (array[i] === elem) {
      return i;
    }
  }

  return -1;
};

export const addEvent = (node: any, eventType: string, callback: Function) => {
  node.addEventListener(eventType, callback);
};

export const errorLog = (err: string) => {
  console.log(err);
};

export const logInfo = (info: any) => {
  console.log(info);
};

//check css classnames for ignoring
export const checkCssClassNames = (node: any) => {
  let cssClassExist = false;
  if (ignoreNodesContainingClassNames.length > 0) {
    for (const className of ignoreNodesContainingClassNames) {
      if (node.classList.contains(className)) {
        cssClassExist = true;
      }
    }
  }
  return cssClassExist;
};

//add tooltip display
export const addToolTip = (
  invokingnode: any,
  tooltipnode: any,
  recordeddata: any,
  navigationcookiedata: any,
  enableClick = false,
  enableFocus = false,
  enableIntroJs = false,
  message = "Please input the value and then click on",
  showButtons = true
) => {};
// getting the text for the clicknodes.
export const getInputLabels = (
  node: any,
  inputlabels: any,
  iterationno: any,
  iterate = true,
  getchildlabels = true,
  fromclick = false,
  iteratelimit = 3,
  ignorenode: any = []
) => {
  if (Array.isArray(ignorenode)) {
    ignorenode = node;
  }

  if (
    (node.nodeName.toLowerCase() === "select" ||
      node.nodeName.toLowerCase() === "checkbox") &&
    iterate &&
    inputlabels.length === 0
  ) {
    iterationno++;
    inputlabels = getInputLabels(
      node.parentNode,
      inputlabels,
      iterationno,
      iterate,
      true,
      fromclick,
      iteratelimit,
      ignorenode
    );
    if (fromclick) {
      //todo need to rework
    }
  }

  if (
    node.nodeName.toLowerCase() === "input" ||
    node.nodeName.toLowerCase() === "textarea" ||
    node.nodeName.toLowerCase() === "img"
  ) {
    if (
      node.getAttribute("placeholder") &&
      node.getAttribute("placeholder") !== ""
    ) {
      inputlabels.push({
        text: node.getAttribute("placeholder").toString(),
        match: false,
      });
    }
    if (
      node.getAttribute("type") &&
      (node.getAttribute("type").toLowerCase() === "submit" ||
        node.getAttribute("type").toLowerCase() === "file")
    ) {
      if (node.getAttribute("value")) {
        inputlabels.push({
          text: node.getAttribute("value").toString(),
          match: false,
        });
        iterate = false;
      }
    }
    if (node.getAttribute("alt")) {
      inputlabels.push({
        text: node.getAttribute("alt").toString(),
        match: false,
      });
    }
  }

  if (getchildlabels && node.childNodes.length > 0) {
    let childnodes = node.childNodes;
    childnodes.forEach(function (childnode: any) {
      if (
        childnode.nodeName.toLowerCase() !== "script" &&
        childnode.nodeName.toLowerCase() !== "select" &&
        childnode.nodeName.toLowerCase() !== "#comment"
      ) {
        let textcontent = childnode.textContent
          .replace(/[\n\r]+|[\s]{2,}/g, " ")
          .trim();
        if (textcontent !== "" && ignorenode?.isSameNode(childnode) === false) {
          inputlabels.push({ text: textcontent, match: false });
        }
      }
    });
  }

  if (inputlabels.length === 0 && node.getAttribute("data-tooltip")) {
    inputlabels.push({
      text: node.getAttribute("data-tooltip").toString(),
      match: false,
    });
  }

  if (inputlabels.length === 0 && node.getAttribute("aria-label")) {
    inputlabels.push({
      text: node.getAttribute("aria-label").toString(),
      match: false,
    });
  }

  //todo fix for image tags
  if (
    iterate &&
    node.nodeName.toLowerCase() !== "img" &&
    inputlabels.length === 0 &&
    iterationno <= iteratelimit
  ) {
    iterationno++;
    inputlabels = getInputLabels(
      node.parentNode,
      [],
      iterationno,
      iterate,
      getchildlabels,
      fromclick,
      iteratelimit
    );
  }

  if (inputlabels.length === 0 && node.id !== "") {
    inputlabels.push({
      text: node.nodeName.toLowerCase() + "-" + node.id,
      match: false,
    });
  } else if (
    inputlabels.length === 0 &&
    node.hasAttribute("class") &&
    node.className &&
    node.className !== ""
  ) {
    let classname = node.className.toString();
    inputlabels.push({
      text: node.nodeName.toLowerCase() + "-" + classname.replace(" ", "-"),
      match: false,
    });
  } else if (inputlabels.length === 0) {
    inputlabels.push({ text: node.nodeName.toLowerCase(), match: false });
  }

  return inputlabels;
};
// Check for each node and then match it with the available clicknodes which are identified by links.js
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

  if (CONFIG.htmlindex.length > 0) {
    for (let htmli = 0; htmli < CONFIG.htmlindex.length; htmli++) {
      if (node.isSameNode(CONFIG.htmlindex[htmli]["element-data"])) {
        node.hasclick = true;
        return node;
      }
    }
  }

  for (let i = 0; i < UDAClickObjects.length; i++) {
    if (UDAClickObjects[i].element === window) {
      continue;
    }
    if (node.isSameNode(UDAClickObjects[i].element)) {
      clickobjectexists = true;
      udaClickObject = UDAClickObjects[i];
    }
  }

  if (
    inArray(node.nodeName.toLowerCase(), CONFIG.ignoreNodesFromIndexing) !== -1
  ) {
    logInfo({ indexingnode: node });
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

    if (elementdata["element-labels"].length === 0) {
      elementdata["element-labels"] = getInputLabels(node, [], 1);
    }

    if (elementdata["element-labels"].length === 0) {
      return node;
    }

    if (
      (node.hasOwnProperty("displaytype") &&
        node.displaytype === "tab-content") ||
      (node.hasOwnProperty("navtype") && node.navtype === "navtab")
    ) {
      for (let j = 0; j < menuitems.length; j++) {
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

// indexing functionality for the entire dom
export const indexDom = (
  node: any,
  ret = false,
  parentnode = "",
  textlabel = "",
  hasparentnodeclick = false,
  parentclicknode = null
) => {
  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      if (!ret && parentnode !== "") {
        try {
          node = indexnode(node, parentnode, hasparentnodeclick, false);
        } catch (e) {
          errorLog(
            "Unable to index node " + node.nodeName + " got exception " + e
          );
          return node;
        }
      }

      node.haschildclick = false;

      // Checking for ignore nodes during indexing
      if (
        inArray(node.nodeName.toLowerCase(), ignoreNodesFromIndexing) !== -1
      ) {
        if (
          node.nodeName.toLowerCase() === "ckeditor" &&
          node.childNodes.length > 2 &&
          CONFIG.recording
        ) {
          // let addToolTip = true;
          for (let checknode of tooltipDisplayedNodes) {
            if (node.isSameNode(checknode)) {
              // addToolTip = false;
            }
          }
          if (addToolTip) {
            tooltipDisplayedNodes.push(node);
            addToolTip(
              node,
              node,
              false,
              false,
              false,
              false,
              false,
              "We have detected a rich text editor. To record this in your sequence, Please click on the editor menu. We are unable to record clicks on the text area."
            );
          }
        } else if (
          !node.hasclick &&
          inArray(
            node.nodeName.toLowerCase(),
            CONFIG.addClickToSpecialNodes
          ) !== -1 &&
          inArray(node.nodeName.toLowerCase(), ignoreClicksOnSpecialNodes) ===
            -1
        ) {
          logInfo(
            "Child nodes ignored for node and added click to: " + node.nodeName
          );
          addClickToNode(node);
        } else if (
          node &&
          cancelRecordingDuringRecordingNodes.indexOf(
            node?.nodeName?.toLowerCase()
          ) !== -1
        ) {
          // addClickToNode(node);
        } else {
          logInfo("Child nodes ignored for node: " + node.nodeName);
        }
      } else if (
        node.classList &&
        node.classList.contains("select2-container--open") &&
        !node.classList.contains("select2-container--focus")
      ) {
        //	do nothing as we are not going to deal with special classes
        logInfo("unwanted indexing prevention");
      } else if (
        node.nodeName.toLowerCase() === "div" &&
        (node.hasAttribute("uib-datepicker-popup-wrap") ||
          (node.id && node.id === "recognize_modal"))
      ) {
        // fix for not indexing datepicker popup and nominate popup
        logInfo("date picker in javascript");
      } else if (
        node.nodeName.toLowerCase() === "span" &&
        node.classList.contains("radio") &&
        node.classList.contains("replacement")
      ) {
        addClickToNode(node);
      } else if (checkCssClassNames(node)) {
        logInfo({ cssIgnoredNode: node });
        // addClickToNode(node);
      } else if (node.hasChildNodes()) {
        let childnodes = node.childNodes;
        let hasparentclick = false;
        if (node.hasOwnProperty("hasclick") || hasparentnodeclick) {
          hasparentclick = true;
          if (parentclicknode === "") {
            parentclicknode = node;
          }
        }

        if (childnodes.length > 0) {
          for (let i = 0; i < childnodes.length; i++) {
            let childnode = childnodes[i];
            CONFIG.nodeid++;
            if (
              CONFIG.ignoreelements.indexOf(
                childnode.nodeName.toLowerCase()
              ) === -1
            ) {
              if (ret) {
                if (textlabel === "") {
                  textlabel = indexDom(childnode, ret, node, textlabel);
                } else {
                  textlabel += " " + indexDom(childnode, ret, node, textlabel);
                }
              } else {
                try {
                  node.childNodes[i] = indexDom(
                    childnode,
                    ret,
                    node,
                    "",
                    hasparentclick,
                    parentclicknode
                  );
                } catch (e) {}
                if (
                  node.childNodes[i].hasOwnProperty("hasclick") &&
                  node.childNodes[i].hasclick
                ) {
                  node.haschildclick = true;
                }
                if (
                  hasparentclick &&
                  node.childNodes[i].hasOwnProperty("haschildclick") &&
                  node.childNodes[i].haschildclick
                ) {
                  node.haschildclick = true;
                }
              }
            }
          }
        }
      }

      // add click to node to send what user has clicked.
      // known scenario that node has parent click
      if (
        node.hasOwnProperty("hasclick") &&
        node.hasclick &&
        (node.nodeName.toLowerCase() === "select" || !node.haschildclick)
      ) {
        node = addClickToNode(node);
      } else if (
        node.hasOwnProperty("hasclick") &&
        node.hasclick &&
        node.haschildclick
      ) {
        node = addClickToNode(node, true);
      }

      break;
    case Node.TEXT_NODE:
      if (node.nodeValue !== "") {
        textlabel = node.nodeValue;
      }
      break;
  }

  if (ret && textlabel !== "") {
    return textlabel;
  } else if (!ret) {
    return node;
  }
};

export const addClickToNode = (node: any, confirmdialog = false) => {
  try {
    if (
      node.hasOwnProperty("addedclickrecord") &&
      node.addedclickrecord === true
    ) {
      return;
    }

    const nodename = node.nodeName.toLowerCase();
    // console.log(domJSON.toJSON(node));

    switch (nodename) {
      case "a":
        delayLink(node);
        addEvent(node, "click", function (event: any) {
          recorduserclick(node, false, false, event, confirmdialog);
        });
        break;
      case "select":
        addEvent(node, "focus", function (event: any) {
          recorduserclick(node, false, false, event, confirmdialog);
        });
        break;
      case "input":
        if (!node.hasAttribute("type")) {
          addEvent(node, "click", function (event: any) {
            recorduserclick(node, false, false, event, confirmdialog);
          });
          return;
        }
        const inputtype = node.getAttribute("type").toLowerCase();
        switch (inputtype) {
          case "email":
          case "text":
          case "button":
          case "checkbox":
          case "color":
          case "date":
          case "datetime-local":
          case "file":
          case "hidden":
          case "image":
          case "month":
          case "number":
          case "password":
          case "radio":
          case "range":
          case "reset":
          case "search":
          case "submit":
          case "tel":
          case "text":
          case "time":
          case "url":
          case "week":
            addEvent(node, "click", function (event: any) {
              recorduserclick(node, false, false, event, confirmdialog);
            });
            break;
          default:
            addEvent(node, "click", function (event: any) {
              recorduserclick(node, false, false, event, confirmdialog);
            });
            break;
        }
        break;
      case "mat-select":
        addEvent(node, "click", function (event: any) {
          recorduserclick(node, false, false, event, confirmdialog);
        });
        break;
      case "tr":
        addEvent(node, "click", function (event: any) {
          recorduserclick(node, false, false, event, confirmdialog);
        });
        break;
      // default:
      // 	addEvent(node, 'click', function(event:any){
      // 			recorduserclick(node, false,false, event, confirmdialog);
      // 		});
      // 	break;
    }
    node.addedclickrecord = true;
    return node;
  } catch (e) {
    errorLog("Unable to add click to node " + node.outerHTML + " " + e);
  }
};

export const delayLink = (node: HTMLElement) => {
  const _href = node.getAttribute("href");
  node.setAttribute("href", "#");
  if (_href) {
    node.setAttribute("data-href", _href);
    //setTimeout(function () { window.location = _href }, 500);
  }
};

export const recorduserclick = async (
  node: HTMLElement,
  fromdocument = false,
  selectchange = false,
  event: any,
  confirmdialog = false,
  hasparentclick = false
) => {
  const isRecording =
    getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true" ? true : false;

  if (!isRecording) {
    if (node.nodeName.toLowerCase() == "a" && node.getAttribute("data-href")) {
      window.location.href = node.getAttribute("data-href") || "";
    }
    return;
  }
  const resp = await postClickData(node);
  if (resp) {
    const activeRecordingData: any = getFromStore(
      CONFIG.RECORDING_SEQUENCE,
      false
    );
    if (activeRecordingData) {
      activeRecordingData.push(resp);
      setToStore(activeRecordingData, CONFIG.RECORDING_SEQUENCE, false);
    } else {
      setToStore([resp], CONFIG.RECORDING_SEQUENCE, false);
    }
  }
  if (
    resp &&
    node.nodeName.toLowerCase() == "a" &&
    node.getAttribute("data-href")
  ) {
    //return;
    window.location.href = node.getAttribute("data-href") || "";
  }
};

export const postClickData = async (node: HTMLElement) => {
  const payload = {
    domain: window.location.host,
    urlpath: window.location.pathname,
    // sessionid: CONFIG.sessionID,
    clickednodename: node.innerText,
    html5: 0,
    clickedpath: "",
    objectdata: JSON.stringify(domJSON.toJSON(node)),
  };

  return recordClicks(payload);
};

export const postRecordSequenceData = async (request: any) => {
  const userclicknodesSet = getFromStore(CONFIG.RECORDING_SEQUENCE, false);
  const ids = userclicknodesSet.map((item: any) => item.id);
  const payload = {
    ...request,
    additionalParams: null,
    domain: window.location.host,
    isIgnored: 0,
    isValid: 1,
    userclicknodelist: ids.join(","),
    userclicknodesSet,
  };
  return recordSequence(payload);
};

export const putUserClickData = async (request: any) => {
  const payload = {
    ...request,
    clickedname: '["Test"]',
    clicktype: "sequencerecord",
    recordid: 1375,
  };
  return userClick(payload);
};
