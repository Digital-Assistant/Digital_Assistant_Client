// indexing functionality for the entire dom
import {CONFIG} from "../config";
import {
  addClickToNode,
  addToolTip, cancelRecordingDuringRecordingNodes, checkCssClassNames,
  errorLog,
  ignoreClicksOnSpecialNodes,
  ignoreNodesFromIndexing,
  inArray, logInfo,
  tooltipDisplayedNodes,
  indexnode
} from "./index";

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
          for (let checknode of tooltipDisplayedNodes) {
            if (node?.isSameNode(checknode)) {
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
        logInfo({cssIgnoredNode: node});
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
            CONFIG.nodeId++;
            if (
                CONFIG.ignoreElements.indexOf(
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
                } catch (e) {
                }
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
