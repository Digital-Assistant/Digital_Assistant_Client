import { compareNodes } from "./compareNodes";
import { getClickedInputLabels } from "./getClickedInputLabels";
import { processDistanceOfNodes } from "./processDistanceOfNodes";
import { getObjData } from "./getObjData";
import { UDAConsoleLogger } from "../error";
import { nodeConfig } from "./nodeConfig";

// Cache for domJSON module to avoid repeated dynamic imports
let domJSONModule: any = null;

/**
 * Legacy logic for searching for a recorded DOM element among a list of candidate elements.
 * This function attempts to find the best match for a `recordedNode` within `compareElements`.
 *
 * Note: Uses dynamic import to avoid loading domjson in service worker contexts.
 * Changed to async to support dynamic imports.
 *
 * @param recordedNode The node object from a recording, containing metadata and object data.
 * @param compareElements An array of candidate elements to compare against the recorded node.
 * @returns A promise that resolves to the DOM element that is considered the best match, or `null` if no suitable match is found.
 */
export const searchNodes = async (recordedNode: any, compareElements: any) => {

  // Load domJSON module dynamically (only once, then cached)
  if (!domJSONModule) {
    // @ts-ignore
    const domJSON = await import("domjson");
    domJSONModule = domJSON.default || domJSON;
  }

  // Fallback to the old logic for node searching.
  const recordedNodeData: any = getObjData(recordedNode?.node?.objectdata);

  let finalMatchElement = null;
  // Check if the recorded node is marked as a "personal" node.
  let isPersonalNode = false;
  const matchNodes = [];
  if (recordedNodeData.meta.hasOwnProperty('isPersonal') && recordedNodeData.meta.isPersonal) {
    isPersonalNode = true;
  }

  // Iterate through the candidate elements to find potential matches.
  for (let searchNode of compareElements) {
    let searchLabelExists = false;
    // Convert the candidate DOM node to a JSON object for comparison.
    let compareNode = domJSONModule.toJSON(searchNode.node, { serialProperties: true });
    // Compare the recorded node with the candidate node.
    let match = compareNodes(compareNode.node, recordedNodeData.node, isPersonalNode);

    // Uncomment for debugging purposes.
    if (match.matched + 3 >= match.count) {
      UDAConsoleLogger.info(searchNode.node, 3);
      UDAConsoleLogger.info(compareNode, 3);
      UDAConsoleLogger.info(match, 3);
    }

    // Determine if the nodes match based on a scoring system.
    // The 'matched' score is incremented by 'innerTextWeight' for the node and its children.
    if (compareNode.node.nodeName === recordedNodeData.node.nodeName) {
      if (match.innerTextFlag && Math.abs((match.matched) - match.count) <= (match.innerChildNodes * nodeConfig.innerTextWeight)) {
        searchLabelExists = true;
      } else if (match.matched === match.count) {
        searchLabelExists = true;
      } else if (recordedNodeData.node.nodeName === 'CKEDITOR' && (match.matched + 1) >= match.count) {
        // Special fix for CKEditor playback.
        searchLabelExists = true;
      }
    }

    // If a match is found, add it to the list of matching nodes, avoiding duplicates.
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

  // Process the matching nodes to find the best fit.
  if (matchNodes.length === 1) {
    // If there is only one match, it's the final one.
    finalMatchElement = matchNodes[0];
  } else if (matchNodes.length > 1) {
    // If there are multiple matches, further refinement is needed.
    // This may require user intervention in some cases.
    let finalMatchNode = null;
    let finalMatchNodes = [];

    // Compare labels of the clickable nodes to find an exact match.
    matchNodes.forEach(function (matchNode) {
      if (matchNode) {
        const inputLabels = getClickedInputLabels(matchNode);
        if (inputLabels === recordedNode.clickednodename) {
          finalMatchNodes.push(matchNode);
        } else if (matchNode.classList && matchNode.classList.contains('expand-button')) {
          // Collapsible buttons are treated as matched nodes to check distance for further processing.
          finalMatchNodes.push(matchNode);
        }
      }
    });

    // If no nodes match by label, consider all initial matches.
    if (finalMatchNodes.length === 0 && matchNodes.length >= 1) {
      finalMatchNodes = matchNodes;
    }

    // Process the refined list of matching nodes.
    if (finalMatchNodes.length === 1) {
      finalMatchNode = finalMatchNodes[0];
    } else if (finalMatchNodes.length > 1) {
      // If multiple nodes still match, compare their positions to find the closest one.
      finalMatchNode = processDistanceOfNodes(finalMatchNodes, recordedNodeData.node);
      UDAConsoleLogger.info(finalMatchNode, 3);
    }

    if (finalMatchNode) {
      finalMatchElement = finalMatchNode;
    }
  }
  return finalMatchElement;
}
