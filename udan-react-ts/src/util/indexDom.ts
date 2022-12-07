// indexing functionality for the entire dom
import {CONFIG} from "../config";
import {UDAConsoleLogger, UDAErrorLogger} from "../config/error-log";
import {inArray} from "./index";
import {translate} from "./translation";
import {addClickToNode} from "./addClickToNode";
import {addToolTip} from "./addToolTip";
import {checkCssClassNames} from "./checkCssClassNames";
import {indexNode} from "./indexNode";
import {initSpecialNodes} from "./initSpecialNodes";

export const indexDom = async (node: any, ret: boolean = false, parentNode: any = "", textLabel: string = "", hasParentNodeClick: boolean = false, parentClickNode: any = null) => {
  await initSpecialNodes();
  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      if (!ret && parentNode !== "") {
        try {
          node = indexNode(node, parentNode, hasParentNodeClick, false);
        } catch (e) {
          UDAErrorLogger.error("Unable to index node " + node.nodeName + " got exception " + e);
          return node;
        }
      }

      node.hasChildClick = false;

      // Checking for ignore nodes during indexing
      if (inArray(node.nodeName.toLowerCase(), CONFIG.ignoreNodesFromIndexing) !== -1) {
        let addToolTipToNode = true;
        if (node.nodeName.toLowerCase() === "ckeditor" && node.childNodes?.length > 2 && CONFIG.isRecording) {
          for (let checkNode of CONFIG.tooltipDisplayedNodes) {
            if (node?.isSameNode(checkNode)) {
              // addToolTipToNode = false;
            }
          }
          if (addToolTipToNode) {
            CONFIG.tooltipDisplayedNodes.push(node);
            addToolTip(node, node, false, false, false, false, false, translate('textEditorHelpText'), false);
          }
        } else if (!node.hasClick && inArray(node.nodeName.toLowerCase(), CONFIG.addClickToSpecialNodes) !== -1 && inArray(node.nodeName.toLowerCase(), CONFIG.ignoreClicksOnSpecialNodes) === -1) {
          UDAConsoleLogger.info("Child nodes ignored for node and added click to: " + node.nodeName);
          addClickToNode(node);
        } else if (node && CONFIG.cancelRecordingDuringRecordingNodes.indexOf(node?.nodeName?.toLowerCase()) !== -1) {
          // addClickToNode(node);
        } else {
          UDAConsoleLogger.info("Child nodes ignored for node: " + node.nodeName);
        }
      } else if (node.classList && node.classList.contains("select2-container--open") && !node.classList.contains("select2-container--focus")) {
        //	do nothing as we are not going to deal with special classes
        UDAConsoleLogger.info("unwanted indexing prevention");
      } else if (node.nodeName.toLowerCase() === "div" && (node.hasAttribute("uib-datepicker-popup-wrap") || (node.id && node.id === "recognize_modal"))) {
        UDAConsoleLogger.info("date picker in javascript");
      } else if (node.nodeName.toLowerCase() === "span" && node.classList.contains("radio") && node.classList.contains("replacement")) {
        // fix for not indexing datepicker popup and nominate popup
        addClickToNode(node);
      } else if (checkCssClassNames(node)) {
        UDAConsoleLogger.info({cssIgnoredNode: node});
        // addClickToNode(node);
      } else if (node.hasChildNodes()) {
        let childNodes = node.childNodes;
        let hasParentClick = false;
        if (node.hasOwnProperty("hasClick") || hasParentNodeClick) {
          hasParentClick = true;
          if (parentClickNode === "") {
            parentClickNode = node;
          }
        }

        if (childNodes?.length > 0) {
          for (let i = 0; i < childNodes?.length; i++) {
            let childNode = childNodes[i];
            if (CONFIG.ignoreElements.indexOf(childNode.nodeName.toLowerCase()) === -1) {
              if (ret) {
                if (textLabel === "") {
                  textLabel = await indexDom(childNode, ret, node, textLabel);
                } else {
                  textLabel += " " + await indexDom(childNode, ret, node, textLabel);
                }
              } else {
                try {
                  node.childNodes[i] = await indexDom(childNode, ret, node, "", hasParentClick, parentClickNode);
                } catch (e) {

                }
                if (node.childNodes[i].hasOwnProperty("hasClick") && node.childNodes[i].hasClick) {
                  node.hasChildClick = true;
                }
                if (hasParentClick && node.childNodes[i].hasOwnProperty("hasChildClick") && node.childNodes[i].hasChildClick) {
                  node.hasChildClick = true;
                }
              }
            }
          }
        }
      }

      // add click to node to send what user has clicked.
      // known scenario that node has parent click
      if (node.hasOwnProperty("hasClick") && node.hasClick && (node.nodeName.toLowerCase() === "select" || !node.hasChildClick)) {
        node = addClickToNode(node);
      } else if (node.hasOwnProperty("hasClick") && node.hasClick && node.hasChildClick) {
        node = addClickToNode(node);
      }
      break;
    case Node.TEXT_NODE:
      if (node.nodeValue !== "") {
        textLabel = node.nodeValue;
      }
      break;
  }

  if (ret && textLabel !== "") {
    return textLabel;
  } else if (!ret) {
    return node;
  }
};
