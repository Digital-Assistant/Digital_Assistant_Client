// getting distance between recorded node and matching nodes of same labels
import { getAbsoluteOffsets } from "./index";
import { getNodeInfo } from "./nodeInfo";
import { getDistance } from "./getDistance";
import { UDAConsoleLogger } from "../config/error-log";
export const processDistanceOfNodes = (matchingNodes, selectedNode) => {
    if (selectedNode.hasOwnProperty('nodeInfo') && matchingNodes.length > 1) {
        UDAConsoleLogger.info(selectedNode, 3);
        let leastDistanceNode = null;
        let leastDistance = -1;
        for (let node of matchingNodes) {
            const _offsets = getAbsoluteOffsets(node);
            if (selectedNode.offset &&
                (_offsets.x == selectedNode.offset.x ||
                    _offsets.y == selectedNode.offset.y)) {
                leastDistanceNode = node;
                leastDistance = 0;
                break;
            }
            else {
                let nodeInfo = getNodeInfo(node);
                UDAConsoleLogger.info("---------------------------------------", 3);
                UDAConsoleLogger.info("Processing distance", 3);
                UDAConsoleLogger.info(node, 3);
                let dist = getDistance(selectedNode.nodeInfo, nodeInfo);
                // default adding first element as least distance and then comparing with last distance calculated
                if (leastDistance === -1) {
                    leastDistance = dist;
                    leastDistanceNode = node;
                }
                else if (dist < leastDistance) {
                    leastDistance = dist;
                    leastDistanceNode = node;
                }
                UDAConsoleLogger.info(selectedNode.nodeInfo, 3);
                UDAConsoleLogger.info(nodeInfo, 3);
                UDAConsoleLogger.info("Distance", 3);
                UDAConsoleLogger.info(dist, 3);
                UDAConsoleLogger.info("---------------------------------------", 3);
            }
        }
        return leastDistanceNode;
    }
    else {
        return false;
    }
};
