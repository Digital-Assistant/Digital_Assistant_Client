// getting distance between recorded node and matching nodes of same labels
import {getAbsoluteOffsets} from "./index";
import {getNodeInfo} from "./nodeInfo";
import {getDistance} from "./getDistance";

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
