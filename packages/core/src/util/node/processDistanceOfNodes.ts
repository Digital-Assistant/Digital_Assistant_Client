/**
 * Node Distance Processing Utility Module
 *
 * This module provides functionality for finding the closest matching node from a set
 * of candidate nodes based on coordinate proximity and node information similarity.
 * It implements an optimized algorithm that prioritizes exact coordinate matches
 * before falling back to distance-based calculations for optimal performance.
 *
 * The algorithm uses a two-phase approach:
 * 1. Fast path: Check for exact coordinate matches (x or y axis alignment).
 * 2. Fallback: Calculate actual distances and find the minimum.
 */

// Import required utilities for coordinate calculation and distance measurement.
import {getAbsoluteOffsets} from "./getAbsoluteOffsets";
import {getNodeInfo} from "./nodeInfo";
import {getDistance} from "./getDistance";
import {UDAConsoleLogger} from "../error/error-log";

/**
 * Processes a collection of matching nodes to find the one closest to a selected reference node.
 *
 * This function implements an intelligent node selection algorithm that finds the best matching
 * node from a collection of candidates based on spatial proximity. It uses coordinate-based
 * matching with a fallback to distance calculations for optimal performance and accuracy.
 *
 * Algorithm Overview:
 * 1. Validates input parameters and node structure.
 * 2. Iterates through matching nodes to find the closest match.
 * 3. Prioritizes exact coordinate matches (same x or y position) for instant selection.
 * 4. Falls back to distance calculations when no exact matches are found.
 * 5. Returns the node with the minimum calculated distance.
 *
 * @param {Array} matchingNodes - An array of candidate DOM nodes to evaluate for proximity.
 *                                Each node should be a valid HTMLElement with positioning data.
 * @param {Object} selectedNode - A reference node object containing positioning and metadata.
 *                                Expected structure: { nodeInfo: Object, offset: {x, y} }.
 *
 * @returns {HTMLElement|false} Returns the closest matching node from the candidates array,
 *                              or `false` if validation fails or no suitable match is found.
 *
 * @example
 * const candidates = [node1, node2, node3];
 * const reference = { nodeInfo: {...}, offset: {x: 100, y: 200} };
 * const closest = processDistanceOfNodes(candidates, reference);
 * if (closest) {
 *   console.log('Found closest node:', closest);
 * }
 */
export const processDistanceOfNodes = (matchingNodes: any, selectedNode: any) => {
  // Primary validation: Ensure the selectedNode has the required `nodeInfo` property and that multiple candidates exist.
  // This validation prevents unnecessary processing for single-node arrays and malformed input.
  if (selectedNode.hasOwnProperty('nodeInfo') && matchingNodes.length > 1) {

    // Debug logging: Output selected node information for development and troubleshooting.
    // Log level 4 indicates detailed debugging information for algorithm analysis.
    UDAConsoleLogger.info(selectedNode, 4);

    // Initialize tracking variables for optimal node selection.
    // `leastDistanceNode` will store the best match found during iteration.
    let leastDistanceNode = null;
    // `leastDistance` uses -1 as a sentinel value to indicate that no distance has been calculated yet.
    let leastDistance = -1;

    // Main algorithm loop: Iterate through all candidate nodes to find the closest match.
    // This loop implements a two-phase matching strategy for optimal performance.
    for (let node of matchingNodes) {

      // Phase 1: Fast coordinate matching - Get absolute positioning for the current candidate.
      // This provides pixel-perfect coordinate information for exact matching.
      const _offsets = getAbsoluteOffsets(node);

      // Optimization: Check for exact coordinate alignment (same x OR y position).
      // This represents perfect alignment scenarios that should be prioritized.
      if (selectedNode.offset &&
          (_offsets.x == selectedNode.offset.x ||
              _offsets.y == selectedNode.offset.y)
      ) {
        // A perfect match is found: Set it as the optimal choice with zero distance.
        // This early exit prevents unnecessary distance calculations.
        leastDistanceNode = node;
        leastDistance = 0;
        // Break immediately since a perfect alignment cannot be improved upon.
        break;
      } else {
        // Phase 2: Distance-based matching - No exact coordinate match was found.
        // Extract comprehensive node information for distance calculation.
        let nodeInfo = getNodeInfo(node);

        // Debug logging: Detailed information about the distance calculation process.
        // These logs help developers understand the comparison process and debug issues.
        UDAConsoleLogger.info("---------------------------------------", 4);
        UDAConsoleLogger.info("Processing distance", 4);
        UDAConsoleLogger.info(node, 4);
        UDAConsoleLogger.info("Recorded Node Info: ", 4);
        UDAConsoleLogger.info(selectedNode.nodeInfo, 4);
        UDAConsoleLogger.info("Comparing Node Info: ", 4);
        UDAConsoleLogger.info(nodeInfo, 4);

        // Calculate the distance between the reference node and the current candidate.
        // This uses the imported `getDistance` utility for comprehensive distance calculation.
        let dist = getDistance(selectedNode.nodeInfo, nodeInfo);

        // Distance comparison logic: Update tracking variables if a better match is found.
        // First iteration: Initialize with the first calculated distance as the baseline.
        if (leastDistance === -1) {
          // No previous distance has been calculated, so set the current one as the baseline.
          leastDistance = dist;
          leastDistanceNode = node;
        } else if (dist < leastDistance) {
          // A better match is found: Update the tracking variables with the new minimum.
          leastDistance = dist;
          leastDistanceNode = node;
        }

        // Debug logging: Output the calculated distance for analysis and troubleshooting.
        // This helps developers understand the distance calculation results.
        UDAConsoleLogger.info("Distance", 4);
        UDAConsoleLogger.info(dist, 4);
        UDAConsoleLogger.info("---------------------------------------", 4);
      }
    }

    // Return the node with the minimum distance or the one with an exact coordinate match.
    // This represents the optimal choice based on the algorithm's criteria.
    return leastDistanceNode;
  } else {
    // Validation failure: Return `false` for invalid input conditions.
    // This occurs when `selectedNode` lacks `nodeInfo` or there are insufficient candidates.
    return false;
  }
};
