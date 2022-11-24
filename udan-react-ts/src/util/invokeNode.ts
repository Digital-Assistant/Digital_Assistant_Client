import {
  getAbsoluteOffsets,
  getClickedInputLabels,
  getFromStore,
  getObjData,
  getToolTipElement,
  getTooltipPositionClass,
  inArray,
  removeToolTip,
  setToStore
} from "./index";
import {jaroWinkler} from "jaro-winkler-typescript";
import {CONFIG} from "../config";
import {createPopperLite as createPopper} from "@popperjs/core/lib";
import {getNodeInfo} from "./nodeInfo";
import {UDAConsoleLogger} from "../config/error-log";
import {trigger} from "./events";
import domJSON from "domjson";
import {translate} from "./translation";

/**
 * Get selected record from storage
 */
export const getSelectedRecordFromStore = () => {
  return getFromStore(CONFIG.SELECTED_RECORDING, false);
}

/**
 * Update the record data to storage
 * @param index
 */
export const updateRecordToStore = async (index) => {
  let selectedRecordingDetails: any = await getFromStore(CONFIG.SELECTED_RECORDING, false);
  selectedRecordingDetails.userclicknodesSet[index].status = "completed";
  setToStore(selectedRecordingDetails, CONFIG.SELECTED_RECORDING, false);
}

export const playNextNode = async () => {

}

/**
 * Matching the clickable node.
 * @param recordedNode
 */
export const matchNode = (recordedNode: any) => {

  if(!recordedNode.node){
    return true;
  }

  const originalNode = getObjData(recordedNode?.node?.objectdata);

  //ignore if recorded node is personal / marked as skip
  if (originalNode.meta.hasOwnProperty('skipDuringPlay') && originalNode.meta.skipDuringPlay) {
    removeToolTip();
    setTimeout(function () {
      removeToolTip();
      trigger("ContinuePlay", {action: 'ContinuePlay'});
    }, CONFIG.DEBOUNCE_INTERVAL);
    return true;
  }

  let originalElement = originalNode?.node;
  let clickObjects = document.getElementsByTagName(
      originalElement.nodeName
  );

  let compareElements: any = []
  let matchedElements: any = [];
  let leastWeight = -1;
  let leastNode = null;
  let finalMatchElement: any = null;

  for (let i = 0; i < clickObjects.length; i++) {
    let compareElement = clickObjects[i];
    if (compareElement.nodeName.toLowerCase() === originalElement.nodeName.toLowerCase()) {
      let textWeight = 0;
      if(originalElement.outerHTML && compareElement.outerHTML){
        jaroWinkler(
            originalElement.outerHTML,
            compareElement.outerHTML
        );
      }
      if (originalElement.offset) {
        const _offsets = getAbsoluteOffsets(compareElement);
        if (
            _offsets.x == originalElement.offset.x &&
            _offsets.y == originalElement.offset.y
        ) {
          finalMatchElement = compareElement;
          break;
        }
      }
      compareElements.push({nodeName: compareElement.nodeName, node: compareElement});
      if (leastWeight > -1 && textWeight > leastWeight) {
        leastWeight = textWeight;
        leastNode = compareElement;
      } else if (leastWeight == -1) {
        leastWeight = textWeight;
        leastNode = compareElement;
      }
      if (originalNode.meta.hasOwnProperty('isPersonal') && originalNode.meta.isPersonal && textWeight >= CONFIG.JARO_WEIGHT_PERSONAL) {
        matchedElements.push(compareElement);
      } else if (textWeight >= CONFIG.JARO_WEIGHT) {
        matchedElements.push(compareElement);
      }
    }
  }

  console.log(compareElements);
  console.log(matchedElements);
  console.log(finalMatchElement);

  if (finalMatchElement === null) {
    if (matchedElements.length == 1) {
      finalMatchElement = matchedElements[0];
    } else if (matchedElements.length > 1) {
      finalMatchElement = processDistanceOfNodes(matchedElements, recordedNode);
    } else if (matchedElements.length === 0) {
      //  fall back old logic
      finalMatchElement = searchNodes(recordedNode, compareElements);
    }
  }

  console.log(finalMatchElement);

  if (finalMatchElement !== null) {
    matchAction(finalMatchElement, recordedNode.node)
    return true;
  } else {
    alert(translate('playBackError'));
    return false;
  }
}

/**
 * Old logic for searching elements
 * @param recordedNode
 * @param compareElements
 */
export const searchNodes = (recordedNode, compareElements) => {
  //  fall back old logic
  const originalNode = getObjData(recordedNode?.node?.objectdata);
  let finalMatchElement = null;
  // personal tag check
  let isPersonalNode = false;
  const matchNodes = [];
  if (originalNode.meta.hasOwnProperty('isPersonal') && originalNode.meta.isPersonal) {
    isPersonalNode = true;
  }
  for (let searchNode of compareElements) {
    let searchLabelExists = false;
    let compareNode = domJSON.toJSON(searchNode.node, {serialProperties: true});
    // compare recorded node with personal node tag or not
    let match = compareNodes(compareNode.node, originalNode.node, isPersonalNode);

    // we are incrementing 'matched' by 'innerTextWeight' for 'this' node and every child node and we are matching innerchildcounts that were returned from comparenodes
    if (compareNode.node.nodeName === originalNode.node.nodeName) {
      if (match.innerTextFlag && Math.abs((match.matched) - match.count) <= (match.innerChildNodes * CONFIG.innerTextWeight)) {
        searchLabelExists = true;
      } else if (match.matched === match.count) {
        searchLabelExists = true;
      } else if (originalNode.node.nodeName === 'CKEDITOR' && (match.matched + 1) >= match.count) {
        // fix for editor playback
        searchLabelExists = true;
      }
    }

    if (searchLabelExists) {
      let matchNodeExists = false;
      if (matchNodes.length > 0) {
        for (let j = 0; j < matchNodes.length; j++) {
          if (matchNodes[j].isSameNode(searchNode.node)) {
            matchNodeExists = true;
          }
        }
      }

      if (matchNodeExists === false) {
        matchNodes.push(searchNode.node);
      }
    }
  }

  if (matchNodes.length === 1) {

    finalMatchElement = matchNodes[0];

  } else if (matchNodes.length > 1) {
    //todo need to perform some user intervention
    // for multiple matching nodes compare labels of the clickable nodes to get exact node match
    let finalMatchNode = null;
    let finalMatchNodes = [];

    matchNodes.forEach(function (matchNode) {
      if (matchNode) {
        const inputLabels = getClickedInputLabels(matchNode);
        if (inputLabels === recordedNode.clickednodename) {
          finalMatchNodes.push(matchNode);
        } else if (matchNode.classList && matchNode.classList.contains('expand-button')) {
          // collapsable buttons are treated as matched nodes to check distance for further processing
          finalMatchNodes.push(matchNode);
        }
      }
    });

    if (finalMatchNodes.length === 0 && matchNodes.length >= 1) {
      finalMatchNodes = matchNodes;
    }

    // process matching nodes after comparing labels
    if (finalMatchNodes.length === 1) {
      finalMatchNode = finalMatchNodes[0];
    } else if (finalMatchNodes.length > 1) {
      // compare element positions as there are multiple matching nodes with same labels
      finalMatchNode = processDistanceOfNodes(finalMatchNodes, originalNode.node);
    }

    if (finalMatchNode) {
      finalMatchElement = finalMatchNode;
    }
  }
  return finalMatchElement;
}


//matching the action of the node and invoking whether to click or focus
export const matchAction = (node, selectedNode) => {

  if (!node) {
    return;
  }

  let timeToInvoke = CONFIG.invokeTime;

  /*if (!CONFIG.playNextAction) {
    return;
  }*/

  // remove added tooltips before invoking
  removeToolTip();

  simulateHover(node);

  const navigationData = getSelectedRecordFromStore();

  // perform click action based on the input given

  // const recordedNodeData = JSON.parse(selectedNode.objectdata);
  const recordedNodeData = selectedNode.objectdata;
  if (recordedNodeData.meta && recordedNodeData.meta.hasOwnProperty('selectedElement') && recordedNodeData.meta.selectedElement && recordedNodeData.meta.selectedElement.systemTag.trim() != 'others') {
    let performedAction = mapSelectedElementAction(node, selectedNode, navigationData, recordedNodeData);
    if (performedAction) {
      return;
    }
  }

  if (inArray(node.nodeName.toLowerCase(), CONFIG.ignoreNodesFromIndexing) !== -1) {
    addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, false);
    return;
  }

  switch (node.nodeName.toLowerCase()) {
    case "input":
      // functionality for detecting multi select box and highlighting the recorded node
      if (node.classList && (node.classList.contains('select2-search__field') || node.classList.contains('mat-autocomplete-trigger'))) {
        addToolTip(node, node.parentNode.parentNode.parentNode.parentNode.parentNode, selectedNode, navigationData, false, true);
      } else if (node.hasAttribute('role') && (node.getAttribute('role') === 'combobox')) {
        addToolTip(node, node.parentNode.parentNode.parentNode.parentNode, selectedNode, navigationData, false, false, true);
      } else if (node.hasAttribute('type') && (node.getAttribute('type') === 'checkbox' || node.getAttribute('type') === 'radio') && node.classList && (node.classList.contains('mat-checkbox-input') || node.classList.contains('mat-radio-input'))) {
        addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, false, false, true);
      } else if (node.hasAttribute('type')) {
        switch (node.getAttribute('type').toLowerCase()) {
          case 'checkbox':
            if (node.parentNode && node.parentNode.classList && node.parentNode.classList.contains('vc_checkbox')) {
              addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
            } else {
              addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, false, false, true);
            }
            break;
          case 'radio':
            if (node.parentNode && node.parentNode.classList && node.parentNode.classList.contains('vc_label')) {
              addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
            } else {
              addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, false, false, true);
            }
            break;
          case 'submit':
            node.click();
            invokeNextNode(node, timeToInvoke);
            // this.showselectedrow(navigationcookiedata.data,navigationcookiedata.data.id,true, navigationcookiedata);
            break;
          case 'text':
            if (node.attributes && node.attributes.length > 0 && (node.hasAttribute('ngxdaterangepickermd'))) {
              addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, false);
            } else if (node.attributes && node.attributes.length > 0 && (node.hasAttribute('uib-datepicker-popup'))) {
              addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, true, false);
            } else {
              addToolTip(node, node.parentNode, selectedNode, navigationData, false, true, true);
            }
            break;
          default:
            addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
            break;
        }
      } else {
        addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
      }
      break;
    case "textarea":
      CONFIG.playNextAction = false;
      addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
      break;
    case "select":
      addToolTip(node, node, selectedNode, navigationData, false, false, true);
      break;
    case "option":
      addToolTip(node, node.parentNode, selectedNode, navigationData, false, false, true);
      break;
    case "checkbox":
      addToolTip(node, node, selectedNode, navigationData, false, false, true);
      break;
      // Additional processing for calendar selection
    case "button":
      if (node.hasAttribute('aria-label') && node.getAttribute('aria-label').toLowerCase() === 'open calendar') {
        addToolTip(node, node.parentNode, selectedNode, navigationData, true, false);
      } else if (node.classList && node.classList.contains('btn-pill')) {
        node.click();
        invokeNextNode(node, timeToInvoke);
      } else {
        node.click();
        invokeNextNode(node, timeToInvoke);
      }
      break;
    case 'span':
      if (node.classList && node.classList.contains('select2-selection')) {
        addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, true, false);
      } else if (node.classList.contains("radio") && node.classList.contains("replacement")) {
        addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, false, false, true);
      } else {
        node.click();
        invokeNextNode(node, timeToInvoke);
      }
      break;
    case 'div':
      if (node.classList && (node.classList.contains('mat-form-field-flex') || node.classList.contains('mat-select-trigger'))) {
        addToolTip(node, node.parentNode.parentNode, selectedNode, navigationData, true, false);
      } else {
        node.click();
        invokeNextNode(node, timeToInvoke);
      }
      break;
      //	fix for text editor during playback
    case 'ckeditor':
      addToolTip(node, node, selectedNode, navigationData, true, false);
      break;
    case 'ng-select':
      addToolTip(node, node, selectedNode, navigationData, false, false);
      break;
    default:

      // check for special input nodes and add tooltip
      let specialInputNode = false;
      if (node.classList) {
        for (let val of node.classList) {
          if (inArray(val, CONFIG.specialInputClickClassNames) !== -1) {
            specialInputNode = true;
          }
        }
      }

      if (specialInputNode) {
        addToolTip(node, node, selectedNode, navigationData, true, false);
      } else {
        node.click();
      }
      invokeNextNode(node, timeToInvoke);
      break;
  }
}
//invoke the click of next item
export const invokeNextNode = (node, timeToInvoke) => {
  let link = false;
  timeToInvoke = timeToInvoke + 4000;
  if (typeof node.href !== 'undefined' && node.href !== '') {
    if (typeof node.target !== 'undefined' && node.target === '_blank') {
      // toggleautoplay(navigationCookieData);
    } else {
      let hostname = window.location.protocol + "//" + window.location.host + window.location.pathname;
      let href = node.href.substr(hostname.length);
      if (href !== '' && href !== "#") {
        link = true;
        CONFIG.navigatedToNextPage.check = true;
        CONFIG.navigatedToNextPage.url = node.href;
      }
    }
  }

  if (!link) {
    UDAConsoleLogger.info(node, 2);
    setTimeout(function () {
      trigger("UDAPlayNext", {"playNext": true});
    }, timeToInvoke);
  } else {
    timeToInvoke = timeToInvoke + 3000;
    setTimeout(function () {
      trigger("UDAPlayNext", {"playNext": true});
    }, timeToInvoke);
  }
}
//simulate hover functionality
export const simulateHover = (node) => {
  const event = new MouseEvent('mouseover', {
    'view': window,
    'bubbles': true,
    'cancelable': true
  });
  const canceled = !node.dispatchEvent(event);
  if (canceled) {
    // A handler called preventDefault.
    UDAConsoleLogger.info('hover cancelled');
  } else {
    // None of the handlers called preventDefault.
    UDAConsoleLogger.info('hover not cancelled');
  }

}
//perform action based on selected node type
export const mapSelectedElementAction = (node, recordedNode, navigationCookieData, recordedNodeData) => {
  // addToolTip(node, node.parentNode, selectednode, navigationcookiedata, false, false, false);
  let performedAction = false;
  switch (recordedNodeData.meta.selectedElement.systemTag) {
    case 'text':
    case 'date':
    case 'range':
    case 'file':
    case 'telephone':
    case 'email':
    case 'number':
    case 'password':
      addToolTip(node, node.parentNode, recordedNode, navigationCookieData, false, true, true);
      performedAction = true;
      break;
    case 'singleChoice':
      addToolTip(node, node.parentNode, recordedNode, navigationCookieData, false, false, true);
      performedAction = true;
      break;
    case 'multipleChoice':
      addToolTip(node, node.parentNode, recordedNode, navigationCookieData, false, false, true);
      performedAction = true;
      break;
    case 'button':
      node.click();
      invokeNextNode(node, 1000);
      // showselectedrow(navigationCookieData.data, navigationCookieData.data.id, true, navigationCookieData);
      performedAction = true;
      break;
    case "dropDown":
      addToolTip(node, node, recordedNode, navigationCookieData, false, false, true);
      performedAction = true;
      break;
    case "textArea":
      addToolTip(node, node.parentNode, recordedNode, navigationCookieData, false, false, true);
      performedAction = true;
      break;
  }
  return performedAction;
}

/**
 * To add tooltip for target elements
 */

//add tooltip display
export const addToolTip = (invokingNode, tooltipNode, recordedData = null, navigationCookieData, enableClick = false, enableFocus = false, enableIntroJs = false, message = translate('tooltipMessage'), showButtons = true) => {

  if (recordedData !== null) {
    let recordedNodeData = JSON.parse(recordedData.objectdata);
    if (recordedNodeData.hasOwnProperty('meta') && recordedNodeData.meta.hasOwnProperty('tooltipInfo') && recordedNodeData.meta.tooltipInfo != '') {
      message = recordedNodeData.meta.tooltipInfo;
    }
  }

  const tooltipDivElement = getToolTipElement(message, showButtons);

  /**
   * calculating node position from here
   */
  let toolTipPositionClass: any = getTooltipPositionClass(tooltipNode, tooltipDivElement);

  let popperInstance = createPopper(tooltipNode, tooltipDivElement, {
    placement: toolTipPositionClass,
    modifiers: [
      {
        name: 'popperOffsets',
        enabled: true,
        phase: 'main',
        options: {
          offset: ({ placement, reference, popper }) => [0, 50],
        }
      }
    ],
  });


//attach event to continue button in tooltip
  document
      .getElementById("uda-autoplay-continue")
      ?.addEventListener("click", () => {
        removeToolTip();
        trigger("ContinuePlay", {action: 'ContinuePlay'});
      });

  //attach event to close tooltip
  document
      .getElementById("uda-autoplay-exit")
      ?.addEventListener("click", () => {
        removeToolTip();
        trigger("BackToSearchResults", {action: 'BackToSearchResults'});
      });
  /*jQuery('html, body').animate({
    scrollTop: (jQuery(invokingnode).offset().top - 250)
  }, 2000, function(){
    if(enableFocus){
      invokingnode.focus();
    }
    if(enableClick){
      invokingnode.click();
    }
  });*/
  //add scrolltop functionality
  setTimeout(function () {
    if (enableFocus) {
      invokingNode.focus();
    }
    if (enableClick) {
      invokingNode.click();
    }
  }, CONFIG.DEBOUNCE_INTERVAL);

}

//comparing nodes of indexed and the sequence step selected
export const compareNodes = (compareNode, originalNode, isPersonalNode = false, match = {
  count: 0,
  matched: 0,
  unmatched: [],
  innerTextFlag: false,
  innerChildNodes: 0
}) => {
  // sum the childnodes
  if (compareNode.hasOwnProperty('childNodes')) {
    match.innerChildNodes = match.innerChildNodes + compareNode.childNodes.length;
  }
  for (let key in originalNode) {
    if (CONFIG.ignoreAttributes.indexOf(key) !== -1) {
      continue;
    } else if (key.indexOf('_ngcontent') !== -1 || key.indexOf('jQuery') !== -1 || key.indexOf('__zone_symbol__') !== -1) {
      continue;
    } else {
      match.count++;
    }
    if (compareNode.hasOwnProperty(key) && (typeof originalNode[key] === 'object') && (typeof compareNode[key] === 'object')) {
      match.matched++;
      match = compareNodes(compareNode[key], originalNode[key], isPersonalNode, match);
    } else if (compareNode.hasOwnProperty(key) && Array.isArray(originalNode[key]) && originalNode[key].length > 0 && Array.isArray(compareNode[key]) && compareNode[key].length > 0) {
      match.matched++;
      if(compareNode.nodeName === 'select' && key === 'childNodes') {
        continue;
      } else if (compareNode[key].length === originalNode[key].length) {
        match.matched++;
        for (let i = 0; i < originalNode[key].length; i++) {
          match = compareNodes(compareNode[key][i], originalNode[key][i], isPersonalNode, match);
        }
      }
    } else if ((key === 'class' || key === 'className') && originalNode.hasOwnProperty(key) && compareNode.hasOwnProperty(key)) {
      // fix for calendar issue
      compareNode[key] = compareNode[key].replace(' ng-star-inserted', '');
      originalNode[key] = originalNode[key].replace(' ng-star-inserted', '');
      if (compareNode[key] === originalNode[key]) {
        match.matched++;
      } else {
        // jaro wrinker comparision for classname
        let weight = jaroWinkler(originalNode[key], compareNode[key]);
        if (weight > CONFIG.JARO_WEIGHT_PERSONAL) {
          match.matched++;
        } else {
          match.unmatched.push({
            key: key,
            compareNodeValues: compareNode[key],
            recordedNodeValues: originalNode[key]
          });
        }
      }
    } else if (key === 'innerText' && originalNode.hasOwnProperty(key) && compareNode.hasOwnProperty(key) && (compareNode[key].trim() === originalNode[key].trim())) {
      // matching inner text should be weighted more. We will add an arbitrarily large number - innerTextWeight.
      // since this will match for every child node, we need to accommodate this logic whenever 'comparenodes' is called
      UDAConsoleLogger.info(compareNode[key].trim());
      UDAConsoleLogger.info(originalNode[key].trim());
      match.innerTextFlag = true;
      match.matched = match.matched + CONFIG.innerTextWeight;
      // match.matched++;
    } else if (compareNode.hasOwnProperty(key) && compareNode[key] === originalNode[key]) {
      match.matched++;
    } else if (compareNode.hasOwnProperty(key) && compareNode[key] !== originalNode[key] && key === 'href' && originalNode[key].indexOf(compareNode[key]) !== -1) {
      match.matched++;
    } else if (compareNode.hasOwnProperty(key) && (key === 'id' || key === 'name') && compareNode[key] !== originalNode[key]) {
      let weight = jaroWinkler(originalNode[key], compareNode[key]);
      if (weight > 0.90) {
        match.matched++;
      }
    }
    // matching personal node key value pairs for personal tag true
    else if (isPersonalNode && CONFIG.personalNodeIgnoreAttributes.indexOf(key) !== -1) {
      // make inner text flag to true if personal tag is true
      if (key === 'innerText') {
        match.innerTextFlag = true;
        match.matched = match.matched + CONFIG.innerTextWeight;
      } else {
        match.matched++;
      }
    } else {
      match.unmatched.push({key: key, compareNodeValues: compareNode[key], recordedNodeValues: originalNode[key]});
    }
  }
  return match;
}

// getting distance between recorded node and matching nodes of same labels
export const processDistanceOfNodes = (matchingNodes, selectedNode) => {
  if (selectedNode.hasOwnProperty('nodeInfo') && matchingNodes.length > 1) {
    let leastDistanceNode = null;
    let leastDistance = -1;
    for (let node of matchingNodes) {
      const _offsets = getAbsoluteOffsets(node);
      if (selectedNode.offset &&
          (_offsets.x == selectedNode.offset.x ||
          _offsets.y == selectedNode.offset.y)
      ) {
        leastDistanceNode = node;
        leastDistance = 0;
        break;
      } else {
        let nodeInfo = getNodeInfo(node);
        let dist = getDistance(selectedNode.nodeInfo, nodeInfo);
        // default adding first element as least distance and then comparing with last distance calculated
        if (leastDistance === -1) {
          leastDistance = dist;
          leastDistanceNode = node;
        } else if (dist < leastDistance) {
          leastDistance = dist;
          leastDistanceNode = node;
        }
      }
    }
    return leastDistanceNode;
  } else {
    return false;
  }
};

/**
 * calculate distance between selected node and matching node
 * @param1: recorded node
 * @param2: comparing node
 */
export const getDistance = (node1, node2) => {
  let dist;
  if (node1.hasOwnProperty('screen') && node2.hasOwnProperty('screen')) {
    if (node1.screen.width >= node2.screen.width) {


    } else {
      const x = node1.nodePagePosition.left - node2.nodePagePosition.left;
      const y = node1.nodePagePosition.top - node2.nodePagePosition.top;
      dist = Math.abs(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    }
  } else {
    const x = node1.nodePosition.x - node2.nodePosition.x;
    const y = node1.nodePosition.y - node2.nodePosition.y;
    dist = Math.abs(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
  }
  return dist;
};
