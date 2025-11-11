/* eslint-disable @typescript-eslint/no-explicit-any */
import domJSON from 'domjson';
import { compareNodes } from './compareNodes';
import { processDistanceOfNodes } from './processDistanceOfNodes';
import { getClickedInputLabels } from './getClickedInputLabels';

/** Safe parser for recorded objectdata */
const getObjData = (obj: string): any => {
  try {
    const data = JSON.parse(obj);
    if (data && data.meta === undefined) data.meta = {};
    return data;
  } catch {
    return {};
  }
};

/**
 * Parity port of UI searchNodes.
 * @param recordedNode - { node: { objectdata: string, clickednodename?: string } }
 * @param compareElements - Array<{ nodeName, node }>
 */
export const searchNodes = (recordedNode: any, compareElements: any[]): any | null => {
  const recordedNodeData = getObjData(recordedNode?.node?.objectdata || '{}');

  let finalMatchElement: any = null;
  let isPersonalNode = false;
  const matchNodes: any[] = [];

  if (recordedNodeData?.meta?.hasOwnProperty('isPersonal') && recordedNodeData.meta.isPersonal) {
    isPersonalNode = true;
  }

  for (const searchNode of compareElements || []) {
    let searchLabelExists = false;
    try {
      const compareNode = domJSON.toJSON(searchNode.node, { serialProperties: true });
      const match = compareNodes(compareNode.node, recordedNodeData.node, isPersonalNode);

      // We are incrementing 'matched' by 'innerTextWeight' for 'this' node and every child node
      if (compareNode.node.nodeName === recordedNodeData.node.nodeName) {
        if (match.innerTextFlag && Math.abs(match.matched - match.count) <= (match.innerChildNodes * 5)) {
          searchLabelExists = true;
        } else if (match.matched === match.count) {
          searchLabelExists = true;
        } else if (recordedNodeData.node.nodeName === 'CKEDITOR' && (match.matched + 1) >= match.count) {
          searchLabelExists = true;
        }
      }

      if (searchLabelExists) {
        let matchNodeExists = false;
        if (matchNodes.length > 0) {
          for (let j = 0; j < matchNodes.length; j++) {
            if (typeof matchNodes[j]?.isSameNode === 'function' && matchNodes[j].isSameNode(searchNode.node)) {
              matchNodeExists = true;
            }
          }
        }
        if (!matchNodeExists) {
          matchNodes.push(searchNode.node);
        }
      }
    } catch {
      // ignore serialization errors
    }
  }

  if (matchNodes.length === 1) {
    finalMatchElement = matchNodes[0];
  } else if (matchNodes.length > 1) {
    // for multiple matching nodes compare labels of the clickable nodes to get exact node match
    let finalMatchNode: any = null;
    let finalMatchNodes: any[] = [];

    matchNodes.forEach(function (mnode) {
      if (mnode) {
        const inputLabels = getClickedInputLabels(mnode);
        if (inputLabels === recordedNode.clickednodename) {
          finalMatchNodes.push(mnode);
        } else if (mnode.classList && mnode.classList.contains('expand-button')) {
          // collapsable buttons are treated as matched nodes to check distance for further processing
          finalMatchNodes.push(mnode);
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
      finalMatchNode = processDistanceOfNodes(finalMatchNodes, recordedNodeData.node);
    }

    if (finalMatchNode) {
      finalMatchElement = finalMatchNode;
    }
  }

  return finalMatchElement;
};
