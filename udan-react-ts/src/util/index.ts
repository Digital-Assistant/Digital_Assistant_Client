import domJSON from "domJson";
import {CONFIG} from "../config";
import {
  recordClicks,
  recordSequence,
  userClick,
} from "../services/recordService";
import {
  fetchSpecialNodes
} from "../services/searchService";
import {createPopperLite as createPopper} from "@popperjs/core";
import {jaroWinkler} from "jaro-winkler-typescript";
import {UDAErrorLogger} from "../config/error-log";
import {removeFromArray} from "./removeFromArray";
export {indexnode} from "./indexNode";


export const UDAClickObjects: any = [];
export const htmlindex: any = [];
export const menuitems: any = [];
export const ignoreNodesFromIndexing: any = [];
export const tooltipDisplayedNodes: any = [];
export const ignoreClicksOnSpecialNodes: any = [];
export const ignoreNodesContainingClassNames: any = [];
export const cancelRecordingDuringRecordingNodes: any = [];
export let udanSpecialNodes: any = {
  include: {
    tags: ["a", "button", "input", "textarea", "select", "mat-select"],
    classes: ["ng-select", "ngb-datepicker"],
  },
  exclude: {
    tags: [
      "link",
      "meta",
      "script",
      "svg",
      "style",
      "path",
      "circle",
      "g",
      "rect",
      "stop",
      "defs",
      "linearGradient",
    ],
    classes: ["uda_exclude", "ngx-daterangepicker-material"],
  },
};
export const EXCLUDE_ATTRIB = "data-exclude";


/**
 * Browser Window Interface Definition
 */
declare global {
  interface Window {
    onDomChange: any;
    udanSelectedNodes: any;
  }
}

/**
 * Set ignorable classes for Udan con
 */
export const init = async () => {

  // UDAErrorLogger.error("test", new Error("test"));
  //fetch special nodes for REST service
  if (!getFromStore("specialNodes", false)) {
    const _specialNodes = fetchSpecialNodes();
    setToStore(_specialNodes, "specialNodes", false);
  }

  const specialNodes = getFromStore("specialNodes", false);
  if (specialNodes) {
    udanSpecialNodes = specialNodes;
  }


  const children = getAllChildren(
      document.querySelector(`.${CONFIG.UDA_CONTAINER_CLASS}`)
  );
  for (let i = 0; i < children?.length; i++) {
    try {
      // console.log(children[i]);
      if (
          children[i] &&
          !udanSpecialNodes?.exclude?.tags?.includes(
              children[i]?.tagName?.trim()?.toLocaleLowerCase()
          ) &&
          children[i].className.indexOf(CONFIG.UDA_CLICK_IGNORE_CLASS) == -1
      )
        children[i].className += " " + CONFIG.UDA_CLICK_IGNORE_CLASS;
    } catch (e) {
    }
  }
};

// let onDomChange = window.onDomChange; 

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
  return {sequenceName, path};
};

/**
 * Add events to body elements
 * @param selector
 */
export const addBodyEvents = (selector: HTMLElement) => {
  //exclude content-serving elements from click objects
  init();
  let els: any = document.body.querySelectorAll("*"),//getAllClickableElements(),
      len = els?.length,
      i = 0;

  for (; i < len; i++) {
    try {
      /**exclude event attachment for selective elements  */
      if (
          els[i] &&
          // !udanSpecialNodes?.exclude?.tags.includes(els[i]?.tagName?.trim()?.toLocaleLowerCase()) &&
          // els[i]?.className?.indexOf(CONFIG.UDA_CLICK_IGNORE_CLASS) === -1 &&
          // els[i]?.parentNode?.className?.indexOf(CONFIG.UDA_CLICK_IGNORE_CLASS) === -1 &&
          !els[i]?.getAttribute(EXCLUDE_ATTRIB) &&
          isClickable(els[i])
      ) {
        addClickToNode(els[i]);
      }
    } catch (e) {
      // console.log(els[i].tagName, e);
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
  // console.log("add event", node);
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
    if (key == "href") continue;//selector += `[${key}="#"]`;
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

    // console.log("'" + selector + index + "'");

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
    // console.log(e);
  }
};

export const playNext = () => {
};
/**
 * tooltip placement calculation
 */

/**
 * To get screen/window size
 * @returns object
 */
export const getScreenSize = () => {
  let page = {height: 0, width: 0};
  let screen = {height: 0, width: 0};
  let body = document.body,
      html = document.documentElement;

  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  let resolution = {height: 0, width: 0};

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
    scrollInfo: {scrollTop: scrollTop, scrollLeft: scrollLeft},
    resolution,
  };
  return windowProperties;
};

/**
 * //get node position on the page
 * @returns object
 */

export const getNodeCoordinates = (element: HTMLElement, windowSize: any) => {
  if (!element) return;
  const x = element?.getBoundingClientRect();
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
  const targetElementRect = targetElement?.getBoundingClientRect();

  let finalCssClass = "right";

  // Check for space to the right
  if (
      tooltipPos && targetElementRect.right + tooltipPos.width >
      screenSize.screen.width
  ) {
    removeFromArray(availablePositions, "right");
  }

  // Check for space above
  if (tooltipPos && targetElementRect.top - tooltipPos.height < 0) {
    removeFromArray(availablePositions, "top");
  }

  // Check for space to the left
  if (tooltipPos && targetElementRect.left - tooltipPos.width < 0) {
    removeFromArray(availablePositions, "left");
  }

  // Check for space below
  if (
      tooltipPos && targetElementRect.bottom + tooltipPos.height >
      screenSize.page.height
  ) {
    removeFromArray(availablePositions, "bottom");
  }

  if (availablePositions?.length > 0) {
    finalCssClass = availablePositions[0];
  }

  return finalCssClass;
};

// // getting the text for the clicknodes.
// export const getNodeLabels = (
//   node: any,
//   inputlabels: any,
//   iterationno: any,
//   iterate = true,
//   getchildlabels = true,
//   fromclick = false,
//   iteratelimit = 3,
//   ignorenode: any = []
// ) => {
//   if (Array.isArray(ignorenode)) {
//     ignorenode = node;
//   }

//   if (
//     (node.nodeName.toLowerCase() === "select" ||
//       node.nodeName.toLowerCase() === "checkbox") &&
//     iterate &&
//     inputlabels?.length === 0
//   ) {
//     iterationno++;
//     inputlabels = getNodeLabels(
//       node.parentNode,
//       inputlabels,
//       iterationno,
//       iterate,
//       true,
//       fromclick,
//       iteratelimit,
//       ignorenode
//     );
//     if (fromclick) {
//       //todo need to rework
//     }
//   }

//   if (
//     node.nodeName.toLowerCase() === "input" ||
//     node.nodeName.toLowerCase() === "textarea" ||
//     node.nodeName.toLowerCase() === "img"
//   ) {
//     if (
//       node.getAttribute("placeholder") &&
//       node.getAttribute("placeholder") !== ""
//     ) {
//       inputlabels.push({
//         text: node.getAttribute("placeholder").toString(),
//         match: false,
//       });
//     }
//     if (
//       node.getAttribute("type") &&
//       (node.getAttribute("type").toLowerCase() === "submit" ||
//         node.getAttribute("type").toLowerCase() === "file")
//     ) {
//       if (node.getAttribute("value")) {
//         inputlabels.push({
//           text: node.getAttribute("value").toString(),
//           match: false,
//         });
//         iterate = false;
//       }
//     }
//     if (node.getAttribute("alt")) {
//       inputlabels.push({
//         text: node.getAttribute("alt").toString(),
//         match: false,
//       });
//     }
//   }

//   if (getchildlabels && node.childNodes?.length > 0) {
//     let childnodes = node.childNodes;
//     childnodes.forEach(function (childnode: any) {
//       if (
//         childnode.nodeName.toLowerCase() !== "script" &&
//         childnode.nodeName.toLowerCase() !== "select" &&
//         childnode.nodeName.toLowerCase() !== "#comment"
//       ) {
//         let textcontent = childnode.textContent
//           .replace(/[\n\r]+|[\s]{2,}/g, " ")
//           .trim();
//         if (textcontent !== "" && ignorenode?.isSameNode(childnode) === false) {
//           inputlabels.push({ text: textcontent, match: false });
//         }
//       }
//     });
//   }

//   if (inputlabels?.length === 0 && node.getAttribute("data-tooltip")) {
//     inputlabels.push({
//       text: node.getAttribute("data-tooltip").toString(),
//       match: false,
//     });
//   }

//   if (inputlabels?.length === 0 && node.getAttribute("aria-label")) {
//     inputlabels.push({
//       text: node.getAttribute("aria-label").toString(),
//       match: false,
//     });
//   }

//   //todo fix for image tags
//   if (
//     iterate &&
//     node.nodeName.toLowerCase() !== "img" &&
//     inputlabels?.length === 0 &&
//     iterationno <= iteratelimit
//   ) {
//     iterationno++;
//     inputlabels = getNodeLabels(
//       node.parentNode,
//       [],
//       iterationno,
//       iterate,
//       getchildlabels,
//       fromclick,
//       iteratelimit
//     );
//   }

//   if (inputlabels?.length === 0 && node.id !== "") {
//     inputlabels.push({
//       text: node.nodeName.toLowerCase() + "-" + node.id,
//       match: false,
//     });
//   } else if (
//     inputlabels?.length === 0 &&
//     node.hasAttribute("class") &&
//     node.className &&
//     node.className !== ""
//   ) {
//     let classname = node.className.toString();
//     inputlabels.push({
//       text: node.nodeName.toLowerCase() + "-" + classname.replace(" ", "-"),
//       match: false,
//     });
//   } else if (inputlabels?.length === 0) {
//     inputlabels.push({ text: node.nodeName.toLowerCase(), match: false });
//   }

//   return inputlabels;
// };




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
        addEvent(node, "click", function (event: any) {
          event.preventDefault();
          recorduserclick(event.target, false, false, event, confirmdialog);
        });
        break;
      case "select":
        addEvent(node, "focus", function (event: any) {
          recorduserclick(event.target, false, false, event, confirmdialog);
        });
        break;
      case "input":
        if (!node.hasAttribute("type")) {
          addEvent(node, "click", function (event: any) {
            recorduserclick(event.target, false, false, event, confirmdialog);
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
          case "textarea":
          case "week":
            addEvent(node, "click", function (event: any) {
              console.log(node);
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
      case "textarea":
      case "button":
      case "tr":
        addEvent(node, "click", function (event: any) {
          recorduserclick(event.target, false, false, event, confirmdialog);
        });
        break;
      default:
        addEvent(node, "click", function (event: any) {
          if (isAllowedMiscElement(event.target)) {
            recorduserclick(event.target, false, false, event, confirmdialog);
          }
        });
        break;
    }
    node.addedclickrecord = true;
    return node;
  } catch (e) {
    // errorLog("Unable to add click to node " + node.outerHTML + " " + e);
    UDAErrorLogger.error(
        "Unable to add click to node " + node.outerHTML + " " + e
    );
  }
};


export const isAllowedMiscElement = (element: HTMLElement) => {
  if (!element) return false;

  let isAllowedElement: boolean =
      window.getComputedStyle(element).cursor == "pointer";
  let parentEl: any = element;
  /**traversing 3 level parents for contenteditable property */
  for (let i = 0; i <= 3; i++) {
    if (element.getAttribute("contenteditable")) {
      isAllowedElement = true;
      break;
    }
    if (parentEl.parentNode) {
      parentEl = parentEl.parentNode;
    }
    if (parentEl.getAttribute("contenteditable")) {
      isAllowedElement = true;
      break;
    }
  }


  // console.log(
  //   "before",
  //   isAllowedElement,

  // );

  //check if special classes to be included in recordable elements
  if (
      hasClass(element, udanSpecialNodes.include.classes) ||
      udanSpecialNodes?.include?.tags?.includes(element.tagName.toLowerCase())
  ) {
    isAllowedElement = true;
  }

  // console.log("include", isAllowedElement, udanSpecialNodes?.include?.tags.includes(element.tagName.toLowerCase()));
  //check if special classes to be excluded from recordable elements
  if (
      udanSpecialNodes?.exclude?.tags?.includes(
          element?.tagName?.trim()?.toLocaleLowerCase()
      ) ||
      hasClass(element, udanSpecialNodes.exclude.classes)
  ) {
    isAllowedElement = false;
  }
  // console.log("exclude", element.tagName,
  //   isAllowedElement,
  //   udanSpecialNodes?.exclude?.tags.includes(element.tagName.toLowerCase())
  // );

  // console.log(element?.tagName, isAllowedElement);
  // if(element.onclick != null || element.addEventListener != null ||)
  return isAllowedElement;
};

/**
 * To delay Hyperlink click navitaion
 * @param node
 */
export const delayLink = (node: HTMLElement) => {
  const _href = node.getAttribute("href");
  //node.setAttribute("href", "#");
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


  if (!node) return false;

  if (
      !node.isSameNode(event.target) || clickableElementExists(event.target) ||
      !isClickable(event.target)
  ) {
    return;
  }

  node = event.target;
  if (!window.udanSelectedNodes) window.udanSelectedNodes = [];
  window.udanSelectedNodes.push(node);

  const isRecording =
      getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true" ? true : false;


  const parentAnchorElement = parentUpTo(node, "a");
  // console.log(isRecording, node, parentAnchorElement);

  if (!isRecording) {
    if (parentAnchorElement) {
      try {
        window.location.href = parentAnchorElement?.getAttribute("href") || "/";
      } catch (e) {
      }
      return true;
    } else {
      return;
    }
    // return;
  }

  const _text = getclickedinputlabels(node);

  console.log("recording... " + node.innerText + "," + _text);

  if (!_text || _text?.length > 100 || !_text?.trim()?.length) return;


  const resp = await postClickData(node, _text);
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
  } else {
    UDAErrorLogger.error("Unable save record click " + node.outerHTML);
  }

  if (
      parentAnchorElement && node.getAttribute("href")
  ) {
    //return;
    try {
      window.location.href = parentAnchorElement?.getAttribute("href") || "";
    } catch (e) {
    }
  }
};

/**
 * return parent element
 * @param el target element
 * @param tagName tag name to be matched
 * @returns
 */
export const parentUpTo = (el: any, tagName: string) => {
  tagName = tagName.toLowerCase();

  if (el.tagName && el.tagName.toLowerCase() == tagName) return el;

  let depth = 0;

  while (el && el.parentNode && depth <= 6) {
    el = el.parentNode;
    if (el.tagName && el.tagName.toLowerCase() == tagName) {
      return el;
    }
    depth++;
  }
  // Many DOM methods return null if they don't
  // find the element they are searching for
  // It would be OK to omit the following and just
  // return undefined
  return null;
}

/**
 * To post click data to REST
 * @param node HTMLElement
 * @returns promise
 */
export const postClickData = async (node: HTMLElement, text: string) => {
  // console.log(getclickedinputlabels(node));
  let objectData: any = domJSON.toJSON(node);
  objectData.node.outerHTML = node.outerHTML;
  objectData.offset = getAbsoluteOffsets(node);
  console.log(objectData);
  const payload = {
    domain: window.location.host,
    urlpath: window.location.pathname,
    // sessionid: CONFIG.sessionID,
    clickednodename: text,
    html5: 0,
    clickedpath: "",
    objectdata: JSON.stringify(objectData),
  };

  return recordClicks(payload);
};

/**
 * * To post click sequence data to REST
 * @param request
 * @returns promise
 */
export const postRecordSequenceData = async (request: any) => {
  window.udanSelectedNodes = [];
  const userclicknodesSet = getFromStore(CONFIG.RECORDING_SEQUENCE, false);
  const ids = userclicknodesSet.map((item: any) => item.id);
  const payload = {
    ...request,
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

/**
 * compares current playable node from storage based on status "completed"
 * @returns object with index and node
 */
export const getCurrentPlayItem = () => {
  const elementsFromStore = getFromStore("selectedRecordedItem", false);
  const retObj: any = {index: 0, node: null};
  for (let i = 0; i < elementsFromStore?.userclicknodesSet?.length; i++) {
    if (elementsFromStore?.userclicknodesSet[i].status != "completed") {
      retObj.index = i;
      retObj.node = elementsFromStore?.userclicknodesSet[i];
      break;
    }
  }
  return retObj;
};


// getting the text for the clicknodes.
export const getNodeLabels = (node: any, inputlabels: any, iterationno: any, iterate = true, getchildlabels = true, fromclick = false, iteratelimit = 3, ignorenode: any = []) => {

  if (!node) return inputlabels;

  try {
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
      inputlabels = getNodeLabels(
          node?.parentNode,
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
      var childnodes = node.childNodes;
      childnodes?.forEach(function (childnode: any, key: any) {
        if (
            childnode.nodeName.toLowerCase() !== "script" &&
            childnode.nodeName.toLowerCase() !== "select" &&
            childnode.nodeName.toLowerCase() !== "#comment"
        ) {
          var textcontent = childnode.textContent
              .replace(/[\n\r]+|[\s]{2,}/g, " ")
              .trim();

          if (
              textcontent !== "" &&
              typeof ignorenode?.isSameNode === "function" &&
              ignorenode?.isSameNode(childnode) === false
          ) {
            // if (textcontent !== "") {
            inputlabels.push({text: textcontent, match: false});
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
      inputlabels = getNodeLabels(
          node.parentNode,
          [],
          iterationno,
          iterate,
          getchildlabels,
          fromclick,
          iteratelimit,
          null
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
      var classname = node.className.toString();
      inputlabels.push({
        text: node.nodeName.toLowerCase() + "-" + classname.replace(" ", "-"),
        match: false,
      });
    } else if (inputlabels.length === 0) {
      inputlabels.push({text: node.nodeName.toLowerCase(), match: false});
    }
  } catch (e) {
    // console.log(e);
  }
  return inputlabels;

}

export const getDirectInnerText = (element: any) => {
  const x = [];
  let child = element.firstChild;
  while (child) {
    if (child.nodeType == 3) {
      x.push(child.nodeValue);
    } else if (child.nodeType == 1) {
      let ii: any = getDirectInnerText(child);
      if (ii.length > 0) x.push(ii);
    }
    child = child.nextSibling;
  }
  return x.join(" ");
}


/**
 * To get selected text from list options
 * @param node
 * @returns
 */
export const getSelectedTextFromSelectBox = (node: any) => {
  try {
    return node?.options?.[node?.selectedIndex].text;
  } catch (e) {
  }
}

export const getLabelsForInputElement = (element: any) => {
  let labels: any = [],
      id = element.id, name = element.name,
      elements: any = [];

  if (id) elements = document.querySelector("label[for='" + id + "']");
  if (name && !element) elements = document.querySelector("label[for='" + name + "']");

  if (elements) {
    labels = getDirectInnerText(elements);
    if (labels) return labels?.trim();
  }

  while ((element = element.parentNode)) {
    if (element?.tagName?.toLowerCase() == "label") {
      labels.push(element?.innerText());
    }
  }
  return labels?.trim();
};

//getting input label for the clicked node
export const getclickedinputlabels = (node: HTMLElement, fromdocument = false, selectchange = false) => {
  if (!node) {
    return null;
  }
  let inputlabels: any = "";
  let nodename = node.nodeName.toLowerCase();

  try {
    inputlabels = getLabelsForInputElement(node);
    console.log("labesl", inputlabels)
    if (inputlabels) return inputlabels;
  } catch (e) {
  }
  // if (node?.previousElementSibling?.tagName?.toLocaleLowerCase() == 'label') {

  //   return node?.previousSibling?.textContent;;
  // }
  switch (nodename) {
    case "select":
      if (selectchange) {
        inputlabels = getSelectedTextFromSelectBox(node);
      } else {
        var textlabels = getNodeLabels(node, [], 1, true, false, true);
        if (textlabels.length > 0) {
          var labels = [];
          for (var j = 0; j < textlabels.length; j++) {
            labels.push(textlabels[j].text);
          }
          inputlabels = labels.toString();
        }
      }
      break;
    case "input":
      if (!node.hasAttribute("type")) {
        var textlabels = getNodeLabels(node, [], 1, true, true, true);
        if (textlabels.length > 0) {
          var labels = [];
          for (var j = 0; j < textlabels.length; j++) {
            labels.push(textlabels[j].text);
          }
          inputlabels = labels.toString();
        }
      } else {
        switch (node?.getAttribute("type")?.toLowerCase()) {
          default:
            var textlabels = getNodeLabels(node, [], 1, true, true, true);
            if (textlabels.length > 0) {
              var labels = [];
              for (var j = 0; j < textlabels.length; j++) {
                labels.push(textlabels[j].text);
              }
              inputlabels = labels.toString();
            }
        }
        break;
      }
      break;
    case "textarea":
      var textlabels = getNodeLabels(node, [], 1, true, true, true);
      if (textlabels.length > 0) {
        var labels = [];
        for (var j = 0; j < textlabels.length; j++) {
          labels.push(textlabels[j].text);
        }
        inputlabels = labels.toString();
      }
      break;
    case "img":
      var textlabels = getNodeLabels(node, [], 1, true, false, true);
      if (textlabels.length > 0) {
        var labels = [];
        for (var j = 0; j < textlabels.length; j++) {
          labels.push(textlabels[j].text);
        }
        inputlabels = labels.toString();
      }
      break;
    default:
      if (!node?.children?.length && node?.innerText?.trim()?.length > 0) {
        return node?.innerText;
      }
      var textlabels = getNodeLabels(node, [], 1, false, true, true);
      if (textlabels.length > 0) {
        var labels = [];
        for (var j = 0; j < textlabels.length; j++) {
          labels.push(textlabels[j].text);
        }
        inputlabels = labels.toString();
      }
  }
  return inputlabels;
}


/**
 * To get all the children of a given parent
 * @param htmlElement
 * @returns HTMLElements Collection
 */
export const getAllChildren = (htmlElement: any) => {
  let allChildElements = [];
  try {
    if (htmlElement?.children?.length === 0) return [htmlElement];

    for (let i = 0; i < htmlElement?.children?.length; i++) {
      let children: any = getAllChildren(htmlElement.children[i]);
      if (children) allChildElements.push(...children);
    }
    allChildElements.push(htmlElement);
  } catch (e) {
  }
  return allChildElements;
};


/**
 * To recorded meta data
 * @param obj
 * @returns
 */
export const getObjData = (obj: string) => {
  try {
    const _objData = JSON.parse(obj);
    if (_objData && _objData.meta === undefined) _objData.meta = {};
    return _objData;
  } catch (e) {
    console.log(e);
    return {};
  }
};


/**
 * To check if a given element is already captured / recorded
 * @param comparable HTMLElement
 * @returns boolean
 */
export const clickableElementExists = (compareNode: HTMLElement) => {
  let existFlag = false;
  if (!window.udanSelectedNodes) window.udanSelectedNodes = [];
  window?.udanSelectedNodes?.forEach((element: any) => {
    if (element.isSameNode(compareNode)) existFlag = true;
  });
  return existFlag;
}

/**
 * To findout out a given element is clickable or not!
 * @param HTMLElement
 * @returns boolean
 */
export const isClickable = (element: HTMLElement) => {
  return isAllowedMiscElement(element);
  /*
  try {
    return (
      ( element.onclick != null ||
        element.addEventListener != null ||
        window.getComputedStyle(element).cursor == "pointer") 
    );
  }catch(e){return false}
  */
}

/**
 * To find an dom object has a given class
 * @param element
 * @param classList
 * @returns
 */
export const hasClass = (element: HTMLElement, classList: string[]) => {
  let existsFlag = false;
  classList?.forEach(cls => {
    try {
      if (element?.className?.indexOf(cls) > -1) {
        existsFlag = true;
        return existsFlag;
      }
    } catch (e) {
      return false
    }
  });
  return existsFlag;
}

/**
 * To compare two nodes equality
 * @param comparenode
 * @param originalnode
 * @param isPersonalNode
 * @param match
 * @returns
 */
export const compareNodes = (
    comparenode: any,
    originalnode: any,
    isPersonalNode = false,
    match: any = {
      count: 0,
      matched: 0,
      unmatched: [],
      innerTextFlag: false,
      innerChildNodes: 0,
    }
) => {
  // sum the childnodes
  if (comparenode.hasOwnProperty("childNodes")) {
    match.innerChildNodes =
        match.innerChildNodes + comparenode.childNodes.length;
  }
  for (let key in originalnode) {
    if (CONFIG.ignoreattributes.indexOf(key) !== -1) {
      continue;
    } else if (
        key.indexOf("_ngcontent") !== -1 ||
        key.indexOf("jQuery") !== -1 ||
        key.indexOf("__zone_symbol__") !== -1
    ) {
      continue;
    } else {
      match.count++;
    }
    if (
        comparenode.hasOwnProperty(key) &&
        typeof originalnode[key] === "object" &&
        typeof comparenode[key] === "object"
    ) {
      match.matched++;
      match = compareNodes(
          comparenode[key],
          originalnode[key],
          isPersonalNode,
          match
      );
    } else if (
        comparenode.hasOwnProperty(key) &&
        Array.isArray(originalnode[key]) &&
        originalnode[key].length > 0 &&
        Array.isArray(comparenode[key]) &&
        comparenode[key].length > 0
    ) {
      match.matched++;
      if (comparenode[key].length === originalnode[key].length) {
        match.matched++;
        for (var i = 0; i < originalnode[key].length; i++) {
          match = compareNodes(
              comparenode[key][i],
              originalnode[key][i],
              isPersonalNode,
              match
          );
        }
      }
    } else if (
        (key === "class" || key === "className") &&
        originalnode.hasOwnProperty(key) &&
        comparenode.hasOwnProperty(key)
    ) {
      // fix for calendar issue
      comparenode[key] = comparenode[key].replace(" ng-star-inserted", "");
      originalnode[key] = originalnode[key].replace(" ng-star-inserted", "");
      if (comparenode[key] === originalnode[key]) {
        match.matched++;
      } else {
        // jaro wrinker comparision for classname
        let weight = jaroWinkler(originalnode[key], comparenode[key]);
        if (weight > 0.9) {
          match.matched++;
        } else {
          match.unmatched.push({
            key: key,
            compareNodeValues: comparenode[key],
            recordedNodeValues: originalnode[key],
          });
        }
      }
    } else if (
        key === "innerText" &&
        originalnode.hasOwnProperty(key) &&
        comparenode.hasOwnProperty(key) &&
        comparenode[key].trim() === originalnode[key].trim()
    ) {
      // matching inner text should be weighted more. We will add an arbitrarily large number - innerTextWeight.
      // since this will match for every child node, we need to accommodate this logic whenever 'compareNodes' is called
      // UDAConsoleLogger.info(comparenode[key].trim());
      // UDAConsoleLogger.info(originalnode[key].trim());
      match.innerTextFlag = true;
      match.matched = match.matched + CONFIG.innerTextWeight;
      // match.matched++;
    } else if (
        comparenode.hasOwnProperty(key) &&
        comparenode[key] === originalnode[key]
    ) {
      match.matched++;
    } else if (
        comparenode.hasOwnProperty(key) &&
        comparenode[key] !== originalnode[key] &&
        key === "href" &&
        originalnode[key].indexOf(comparenode[key]) !== -1
    ) {
      match.matched++;
    } else if (
        comparenode.hasOwnProperty(key) &&
        (key === "id" || key === "name") &&
        comparenode[key] !== originalnode[key]
    ) {
      let weight = jaroWinkler(originalnode[key], comparenode[key]);
      if (weight > 0.9) {
        match.matched++;
      }
    }
    // matching personal node key value pairs for personal tag true
    else if (
        isPersonalNode &&
        CONFIG.personalNodeIgnoreAttributes.indexOf(key) !== -1
    ) {
      // make inner text flag to true if personal tag is true
      if (key === "innerText") {
        match.innerTextFlag = true;
        match.matched = match.matched + CONFIG.innerTextWeight;
      } else {
        match.matched++;
      }
    } else {
      match.unmatched.push({
        key: key,
        compareNodeValues: comparenode[key],
        recordedNodeValues: originalnode[key],
      });
    }
  }
  return match;
};

/**
 * sleep javascript execution time
 * @param milliseconds
 */
export const sleep = (ms) => {
  const end = Date.now() + ms;
  while (Date.now() < end) continue;
};

/**
 * to get all clickable elements
 * @returns HTMLElements collection
 */
export const getAllClickableElements = () => {
  window.scrollTo(0, 0);
  var bodyRect = document.body.getBoundingClientRect();

  var items = Array.prototype.slice
      .call(document.querySelectorAll("*"))
      .map(function (element) {
        var rect = element?.getBoundingClientRect();
        return {
          element: element,
          include:
              element.tagName.toLowerCase() === "button" ||
              element.tagName.toLowerCase() === "a" ||
              element.tagName.toLowerCase() === "input" ||
              element.tagName.toLowerCase() === "select" ||
              element.tagName.toLowerCase() === "img" ||
              element.onclick != null ||
              element.addEventListener != null ||
              window.getComputedStyle(element).cursor == "pointer",
          rect: {
            left: Math.max(rect.left - bodyRect.x, 0),
            top: Math.max(rect.top - bodyRect.y, 0),
            right: Math.min(rect.right - bodyRect.x, document.body.clientWidth),
            bottom: Math.min(
                rect.bottom - bodyRect.y,
                document.body.clientHeight
            ),
          },
          text: element.textContent.trim().replace(/\s{2,}/g, " "),
        };
      })
      .filter(
          (item) =>
              item.include &&
              (item.rect.right - item.rect.left) * (item.rect.bottom - item.rect.top) >=
              20
      );

  // Only keep inner clickable items
  const clickableItems = items.filter(
      (x) => !items.some((y) => x.element.contains(y.element) && !(x == y))
  );

  //console.log(clickableItems);

  return clickableItems;
}


export const getAbsoluteOffsets = (element: HTMLElement) => {
  let cords = {x: 0, y: 0};
  try {
    let currentElement: any = element;

    while (currentElement !== null) {
      cords.x += currentElement.offsetLeft;
      cords.x -= currentElement.scrollLeft;
      cords.y += currentElement.offsetTop;
      cords.y -= currentElement.scrollTop;
      currentElement = currentElement.offsetParent;
    }
  } catch (e) {
    console.log(e)
  }

  return cords;
}


/**
 * self calling function to detech dom changes
 */
(function (window) {
  var last = +new Date();
  var delay = 100; // default delay

  // Manage event queue
  let stack: any = [];

  function callback() {
    var now = +new Date();
    if (now - last > delay) {
      for (var i = 0; i < stack.length; i++) {
        stack[i]();
      }
      last = now;
    }
  }

  // Public interface
  const onDomChange = (fn: any, newdelay: any) => {
    if (newdelay) delay = newdelay;
    stack.push(fn);
  };

  // Naive approach for compatibility
  function naive() {
    let last: any = document.getElementsByTagName("*");
    var lastlen = last.length;
    var timer = setTimeout(function check() {
      // get current state of the document
      var current = document.getElementsByTagName("*");
      var len = current.length;

      // if the length is different
      // it's fairly obvious
      if (len != lastlen) {
        // just make sure the loop finishes early
        last = [];
      }

      // go check every element in order
      for (var i = 0; i < len; i++) {
        if (current[i] !== last[i]) {
          callback();
          last = current;
          lastlen = len;
          break;
        }
      }

      // over, and over, and over again
      setTimeout(check, delay);
    }, delay);
  }

  //
  //  Check for mutation events support
  //
  var support: any = {};

  var el = document.documentElement;
  var remain = 3;

  // callback for the tests
  function decide() {
    if (support.DOMNodeInserted) {
      window.addEventListener(
          "DOMContentLoaded",
          function () {
            if (support.DOMSubtreeModified) {
              // for FF 3+, Chrome
              el.addEventListener("DOMSubtreeModified", callback, false);
            } else {
              // for FF 2, Safari, Opera 9.6+
              el.addEventListener("DOMNodeInserted", callback, false);
              el.addEventListener("DOMNodeRemoved", callback, false);
            }
          },
          false
      );
    } else {
      // fallback
      naive();
    }
  }

  // checks a particular event
  function test(event: any) {
    el.addEventListener(
        event,
        function fn() {
          support[event] = true;
          el.removeEventListener(event, fn, false);
          if (--remain === 0) decide();
        },
        false
    );
  }

  // attach test events
  // if (window.addEventListener) {
  test("DOMSubtreeModified");
  test("DOMNodeInserted");
  test("DOMNodeRemoved");
  // } else {
  decide();
  // }

  // do the dummy test
  var dummy = document.createElement("div");
  el.appendChild(dummy);
  el.removeChild(dummy);

  // expose
  window.onDomChange = onDomChange;
})(window);

/**
 * To listen to dom changes
 */

window.onDomChange(function () {
  addBodyEvents(document.body);
});

