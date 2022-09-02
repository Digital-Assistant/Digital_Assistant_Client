import domJSON from "domJson";
import { CONFIG } from "../config";
import {
  recordClicks,
  recordSequence,
  userClick,
} from "../services/recordService";
import { createPopperLite as createPopper } from "@popperjs/core";
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

/**
 * Generates random unique UUID
 * @returns UUID
 */
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
    console.log(hide);
    _body.style.width = hide ? "" : window.innerWidth - 350 + "px";
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

/**
 * Add events to body elements
 * @param selector
 */
export const addBodyEvents = (selector: HTMLElement) => {
  let els = selector.querySelectorAll("*"),
    len = els?.length,
    i = 0;
  for (; i < len; i++) {
    /**exclude event attachment for selective elements  */
    if (!els[i].getAttribute(EXCLUDE_ATTRIB)) {
      addClickToNode(els[i]);
    }
  }
};

/**
 * Returns index if an element in given array found
 * @param elem
 * @param array
 * @returns index
 */
export const inArray = (elem: any, array: any) => {
  if (array.indexOf) {
    return array.indexOf(elem);
  }

  for (let i = 0, length = array?.length; i < length; i++) {
    if (array[i] === elem) {
      return i;
    }
  }

  return -1;
};

/**
 * Adds event to an element
 * @param node
 * @param eventType
 * @param callBack function
 * @returns void
 */
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
  if (ignoreNodesContainingClassNames?.length > 0) {
    for (const className of ignoreNodesContainingClassNames) {
      if (node.classList.contains(className)) {
        cssClassExist = true;
      }
    }
  }
  return cssClassExist;
};

/**
 * Constructs selectors based on attributes(for now)
 * @param originalElement HTML Element
 * @returns
 */
export const getLookUpSelector = (originalElement: HTMLElement) => {
  let selector = "";
  for (let [key, value] of Object.entries(originalElement?.attributes)) {
    if (key == "href") selector += `[${key}="#"]`;
    else selector += `[${key}="${value}"]`;
  }
  return selector;
};

/**
 * Removes tooltip element
 * Void()
 */
export const removeToolTip = () => {
  const toolTipExists = document.getElementById("uda-tooltip");
  if (toolTipExists) {
    document.body.removeChild(toolTipExists);
  }
};

/**
 * Constructs tooltip element & adds to body (if not exist)
 * @returns HTML Element
 */
export const getToolTipElement = () => {
  let toolTipContentSection =
    '<button class="uda-tutorial-btn" style="margin-top:10px; margin-right: 5px;" type="button" uda-added="true" id="uda-autoplay-continue">Continue</button>' +
    '<button class="uda-tutorial-exit-btn" style="margin-top:10px;" type="button" uda-added="true" id="uda-autoplay-exit">Exit</button>';

  let toolTipContentElement = document.createElement("div");
  toolTipContentElement.innerHTML = toolTipContentSection.trim();
  toolTipContentElement.classList.add("uda-tooltip-text-content");

  let tooltipDivElement = document.createElement("div");
  tooltipDivElement.id = "uda-tooltip";
  tooltipDivElement.classList.add("uda-tooltip");
  tooltipDivElement.innerHTML =
    '<div id="uda-arrow" class="uda-arrow" data-popper-arrow></div>';
  tooltipDivElement.prepend(toolTipContentElement);

  const toolTipExists = document.getElementById("uda-tooltip");
  if (toolTipExists) {
    document.body.removeChild(toolTipExists);
  }

  document.body.appendChild(tooltipDivElement);
  return tooltipDivElement;
};

/**
 * adds tooltip to target elements
 * @param invokingNode
 * @param index
 */
export const addToolTip = (invokingNode: any, index: any) => {
  const tooltipDivElement = getToolTipElement();
  try {
    const originalNode = JSON.parse(invokingNode);

    let originalElement = originalNode?.node;

    document
      .getElementById("uda-autoplay-continue")
      ?.addEventListener("click", (e: Event) => {
        const elementsFromStore = getFromStore("selectedRecordedItem", false);
        addToolTip(
          elementsFromStore?.userclicknodesSet[index + 1]?.objectdata,
          index + 1
        );
      });

    let selector = getLookUpSelector(originalElement);

    console.log("'" + selector + index + "'");

    originalElement = document.querySelector(selector);

    if (originalElement) {
      let toolTipPositionClass: any = getTooltipPositionClass(
        originalElement,
        tooltipDivElement
      );
      createPopper(originalElement, tooltipDivElement, {
        placement: toolTipPositionClass,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

export const playNext = () => {};
/**
 * tooltip placement calculation
 */

/**
 * To get screen/window size
 * @returns object
 */
export const getScreenSize = () => {
  let page = { height: 0, width: 0 };
  let screen = { height: 0, width: 0 };
  let body = document.body,
    html = document.documentElement;

  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  let resolution = { height: 0, width: 0 };

  page.height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
  page.width = Math.max(
    body.scrollWidth,
    body.offsetWidth,
    html.clientWidth,
    html.scrollWidth,
    html.offsetWidth
  );
  if (window.innerWidth !== undefined) {
    screen.width = window.innerWidth * 0.75;
    screen.height = window.innerHeight;
    // return { width: (window.innerWidth*0.75), height: window.innerHeight };
  } else {
    const D = document.documentElement;
    screen.width = D.clientWidth;
    screen.height = D.clientHeight * 0.75;
    // return { width: D.clientWidth*0.75, height: D.clientHeight };
  }
  resolution.height = window.screen.height;
  resolution.width = window.screen.width;
  let windowProperties = {
    page: page,
    screen: screen,
    scrollInfo: { scrollTop: scrollTop, scrollLeft: scrollLeft },
    resolution,
  };
  return windowProperties;
};

/**
 * //get node position on the page
 * @returns object
 */

export const getNodeCoordinates = (element: HTMLElement, windowSize: any) => {
  const x = element.getBoundingClientRect();
  let result = {
    top: x.top + windowSize.scrollInfo.scrollTop,
    width: x.width,
    height: x.height,
    left: x.left + windowSize.scrollInfo.scrollLeft,
    actualPos: x,
  };
  return result;
};

/**
 * To figure out the tooltip position for target element
 * @returns object
 */
export const getTooltipPositionClass = (
  targetElement: HTMLElement,
  tooltipElement: HTMLElement
) => {
  const availablePositions = ["right", "top", "left", "bottom"].slice();

  const screenSize = getScreenSize();
  const tooltipPos = getNodeCoordinates(tooltipElement, screenSize);
  const targetElementRect = targetElement.getBoundingClientRect();

  let finalCssClass = "right";

  // Check for space to the right
  if (targetElementRect.right + tooltipPos.width > screenSize.screen.width) {
    removeFromArray(availablePositions, "right");
  }

  // Check for space above
  if (targetElementRect.top - tooltipPos.height < 0) {
    removeFromArray(availablePositions, "top");
  }

  // Check for space to the left
  if (targetElementRect.left - tooltipPos.width < 0) {
    removeFromArray(availablePositions, "left");
  }

  // Check for space below
  if (targetElementRect.bottom + tooltipPos.height > screenSize.page.height) {
    removeFromArray(availablePositions, "bottom");
  }

  if (availablePositions?.length > 0) {
    finalCssClass = availablePositions[0];
  }

  return finalCssClass;
};

/**
 * Remove element from array
 * @param array
 * @param value
 */
export const removeFromArray = (array: any, value: any) => {
  if (array.includes(value)) {
    array.splice(array.indexOf(value), 1);
  }
};

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
    inputlabels?.length === 0
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

  if (getchildlabels && node.childNodes?.length > 0) {
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

  if (inputlabels?.length === 0 && node.getAttribute("data-tooltip")) {
    inputlabels.push({
      text: node.getAttribute("data-tooltip").toString(),
      match: false,
    });
  }

  if (inputlabels?.length === 0 && node.getAttribute("aria-label")) {
    inputlabels.push({
      text: node.getAttribute("aria-label").toString(),
      match: false,
    });
  }

  //todo fix for image tags
  if (
    iterate &&
    node.nodeName.toLowerCase() !== "img" &&
    inputlabels?.length === 0 &&
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

  if (inputlabels?.length === 0 && node.id !== "") {
    inputlabels.push({
      text: node.nodeName.toLowerCase() + "-" + node.id,
      match: false,
    });
  } else if (
    inputlabels?.length === 0 &&
    node.hasAttribute("class") &&
    node.className &&
    node.className !== ""
  ) {
    let classname = node.className.toString();
    inputlabels.push({
      text: node.nodeName.toLowerCase() + "-" + classname.replace(" ", "-"),
      match: false,
    });
  } else if (inputlabels?.length === 0) {
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

  if (CONFIG?.htmlindex?.length > 0) {
    for (let htmli = 0; htmli < CONFIG?.htmlindex?.length; htmli++) {
      if (node.isSameNode(CONFIG.htmlindex[htmli]["element-data"])) {
        node.hasclick = true;
        return node;
      }
    }
  }

  for (let i = 0; i < UDAClickObjects?.length; i++) {
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

    if (elementdata["element-labels"]?.length === 0) {
      elementdata["element-labels"] = getInputLabels(node, [], 1);
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
          node.childNodes?.length > 2 &&
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
            addToolTip(node, 0);
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

        if (childnodes?.length > 0) {
          for (let i = 0; i < childnodes?.length; i++) {
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

/**
 * To delay Hyperlink click navitaion
 * @param node
 */
export const delayLink = (node: HTMLElement) => {
  const _href = node.getAttribute("href");
  node.setAttribute("href", "#");
  if (_href) {
    node.setAttribute("data-href", _href);
    //setTimeout(function () { window.location = _href }, 500);
  }
};

/**
 *
 * @param node
 * @param fromdocument
 * @param selectchange
 * @param event
 * @param confirmdialog
 * @param hasparentclick
 * @returns
 */
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

/**
 * To post click data to REST
 * @param node HTMLElement
 * @returns promise
 */
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

/**
 * * To post click sequence data to REST
 * @param request
 * @returns promise
 */
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

/**
 * To update click data to REST
 * @param node HTMLElement
 * @returns  promise
 */
export const putUserClickData = async (request: any) => {
  const payload = {
    ...request,
    clickedname: '["Test"]',
    clicktype: "sequencerecord",
    recordid: 1375,
  };
  return userClick(payload);
};
