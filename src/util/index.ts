import {CONFIG} from "../config";
import {jaroWinkler} from "jaro-winkler-typescript";
import TSON from "typescript-json";
import {initSpecialNodes} from "./initSpecialNodes";

require("./domChanges");

declare const udaSpecialNodes;

/**
 * Browser Window Interface Definition
 */
declare global {
  interface Window {
    onDomChange: any;
    udanSelectedNodes: any;
    clickedNode: any;
  }
}

/**
 *
 * @param data
 * @param key
 * @param isRaw - is raw data or json
 */
export const setToStore = (data: any, key: string, isRaw: boolean) => {
  localStorage.setItem(key, !isRaw ? TSON.stringify(data) : data);
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
export const squeezeBody = async (hide: boolean) => {
  await initSpecialNodes();
  if(!global.UDAGlobalConfig.enableOverlay) {
    let documentBody = document.body;
    let bodyChildren: any = documentBody.childNodes;
    if (!hide) {
      console.log('squeezed container');
      documentBody.style.maxWidth = '77%';
      documentBody.style.minWidth = '77%';
      documentBody.style.float = 'left';
      /*if (bodyChildren.length > 0) {
        bodyChildren.forEach(function (childNode, childNodeIndex) {
          if (childNode.classList && childNode.classList.contains("container")) {
            childNode.classList.remove("container");
          }
          if (childNode.nodeType === Node.ELEMENT_NODE && (childNode.id !== 'uda-btn' && childNode.id !== 'uda-html-container') && udaSpecialNodes.exclude.tags.indexOf(childNode.nodeName.toLowerCase()) === -1) {
            if (childNode.classList && !childNode.classList.contains("uda-original-content")) {
              childNode.classList.add("uda-original-content");
            }
          }
        });
      }*/
    } else {
      console.log('full container');
      documentBody.style.maxWidth = '100%';
      documentBody.style.minWidth = '100%';
      documentBody.style.float = 'none';
      /*if (bodyChildren.length > 0) {
        bodyChildren.forEach(function (childNode, childNodeIndex) {
          if (childNode.nodeType === Node.ELEMENT_NODE && (childNode.id !== 'uda-btn' && childNode.id !== 'uda-html-container') && udaSpecialNodes.exclude.tags.indexOf(childNode.nodeName.toLowerCase()) === -1) {
            if (childNode.classList && childNode.classList.contains("uda-original-content")) {
              childNode.classList.remove("uda-original-content");
            }
          }
        });
      }*/
    }
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
  let sequenceName: string;
  try {
    sequenceName = JSON.parse(data.name)[0];
  } catch (e) {
    sequenceName = data.name.toString();
  }
  return {sequenceName, path};
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

export const errorLog = (err: string) => {
  console.log(err);
};

export const logInfo = (info: any) => {
  console.log(info);
};


/**
 * To delay Hyperlink click navitaion
 * @param node
 */
export const delayLink = (node: HTMLElement) => {
  const _href = node.getAttribute("href");
  if (_href) {
    node.setAttribute("data-href", _href);
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
 * compares current playable node from storage based on status "completed"
 * @returns object with index and node
 */
export const getCurrentPlayItem = () => {
  const elementsFromStore = getFromStore(CONFIG.SELECTED_RECORDING, false);
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
      let childNodes = node.childNodes;
      childNodes?.forEach(function (childNode: any) {
        if (
            childNode.nodeName.toLowerCase() !== "script" &&
            childNode.nodeName.toLowerCase() !== "select" &&
            childNode.nodeName.toLowerCase() !== "#comment"
        ) {
          let textcontent = childNode.textContent
              .replace(/[\n\r]+|[\s]{2,}/g, " ")
              .trim();

          if (
              textcontent !== "" &&
              typeof ignorenode?.isSameNode === "function" &&
              ignorenode?.isSameNode(childNode) === false
          ) {
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
      let classname = node.className.toString();
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
 * @returns boolean
 * @param compareNode
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
    if (CONFIG.ignoreAttributes.indexOf(key) !== -1) {
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
        for (let i = 0; i < originalnode[key].length; i++) {
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
 * to get all clickable elements
 * @returns HTMLElements collection
 */
export const getAllClickableElements = () => {
  window.scrollTo(0, 0);
  let bodyRect = document.body.getBoundingClientRect();

  let items = Array.prototype.slice
      .call(document.querySelectorAll("*"))
      .map(function (element) {
        let rect = element?.getBoundingClientRect();
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
  return items.filter(
      (x) => !items.some((y) => x.element.contains(y.element) && !(x == y))
  );
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

