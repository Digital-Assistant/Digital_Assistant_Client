/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAbsoluteOffsets } from '../getAbsoluteOffsets';
import { getNodeInfo } from './nodeInfo';
import { getDistance } from './getDistance';

/**
 * Process a collection of matching nodes and return the closest to the selected reference node.
 * Mirrors UI logic with guards; logs removed.
 */
export const processDistanceOfNodes = (matchingNodes: any[], selectedNode: any): any | false => {
  try {
    if (selectedNode && Object.prototype.hasOwnProperty.call(selectedNode, 'nodeInfo') && matchingNodes?.length > 1) {
      let leastDistanceNode: any = null;
      let leastDistance = -1;

      for (const node of matchingNodes) {
        const _offsets = getAbsoluteOffsets(node);
        if (
          selectedNode.offset &&
          (_offsets.x == selectedNode.offset.x || _offsets.y == selectedNode.offset.y)
        ) {
          leastDistanceNode = node;
          leastDistance = 0;
          break;
        } else {
          const nodeInfo = getNodeInfo(node);
          const dist = getDistance(selectedNode.nodeInfo, nodeInfo);
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
    }
    return false;
  } catch {
    return false;
  }
};
