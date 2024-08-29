import { getObjData } from "./index";
import { compareNodes } from "./compareNodes";
import { CONFIG } from "../config";
import { getClickedInputLabels } from "./getClickedInputLabels";
import { processDistanceOfNodes } from "./processDistanceOfNodes";
import * as domJSON from "domjson";
import { UDAConsoleLogger } from "../config/error-log";
/**
 * Old logic for searching elements
 * @param recordedNode
 * @param compareElements
 */
export const searchNodes = (recordedNode, compareElements) => {
    var _a;
    //  fall back old logic
    const recordedNodeData = getObjData((_a = recordedNode === null || recordedNode === void 0 ? void 0 : recordedNode.node) === null || _a === void 0 ? void 0 : _a.objectdata);
    let finalMatchElement = null;
    // personal tag check
    let isPersonalNode = false;
    const matchNodes = [];
    if (recordedNodeData.meta.hasOwnProperty('isPersonal') && recordedNodeData.meta.isPersonal) {
        isPersonalNode = true;
    }
    for (let searchNode of compareElements) {
        let searchLabelExists = false;
        let compareNode = domJSON.toJSON(searchNode.node, { serialProperties: true });
        // compare recorded node with personal node tag or not
        let match = compareNodes(compareNode.node, recordedNodeData.node, isPersonalNode);
        // uncomment for debugging
        if (match.matched + 3 >= match.count) {
            UDAConsoleLogger.info(searchNode.node, 3);
            UDAConsoleLogger.info(compareNode, 3);
            UDAConsoleLogger.info(match, 3);
        }
        // we are incrementing 'matched' by 'innerTextWeight' for 'this' node and every child node and we are matching innerchildcounts that were returned from comparenodes
        if (compareNode.node.nodeName === recordedNodeData.node.nodeName) {
            if (match.innerTextFlag && Math.abs((match.matched) - match.count) <= (match.innerChildNodes * CONFIG.innerTextWeight)) {
                searchLabelExists = true;
            }
            else if (match.matched === match.count) {
                searchLabelExists = true;
            }
            else if (recordedNodeData.node.nodeName === 'CKEDITOR' && (match.matched + 1) >= match.count) {
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
    }
    else if (matchNodes.length > 1) {
        //todo need to perform some user intervention
        // for multiple matching nodes compare labels of the clickable nodes to get exact node match
        let finalMatchNode = null;
        let finalMatchNodes = [];
        matchNodes.forEach(function (matchNode) {
            if (matchNode) {
                const inputLabels = getClickedInputLabels(matchNode);
                if (inputLabels === recordedNode.clickednodename) {
                    finalMatchNodes.push(matchNode);
                }
                else if (matchNode.classList && matchNode.classList.contains('expand-button')) {
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
        }
        else if (finalMatchNodes.length > 1) {
            // compare element positions as there are multiple matching nodes with same labels
            finalMatchNode = processDistanceOfNodes(finalMatchNodes, recordedNodeData.node);
            UDAConsoleLogger.info(finalMatchNode, 3);
        }
        if (finalMatchNode) {
            finalMatchElement = finalMatchNode;
        }
    }
    return finalMatchElement;
};
//# sourceMappingURL=searchNodes.js.map