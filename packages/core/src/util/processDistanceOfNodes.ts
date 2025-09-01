/**
 * Node Distance Processing Utility Module
 *
 * This module provides functionality for finding the closest matching node from a set
 * of candidate nodes based on coordinate proximity and node information similarity.
 * It implements an optimized algorithm that prioritizes exact coordinate matches
 * before falling back to distance-based calculations for optimal performance.
 *
 * The algorithm uses a two-phase approach:
 * 1. Fast path: Check for exact coordinate matches (x or y axis alignment)
 * 2. Fallback: Calculate actual distances and find the minimum
 */

// Import required utilities for coordinate calculation and distance measurement
import {getAbsoluteOffsets} from "./index";
import {getNodeInfo} from "./nodeInfo";
import {getDistance} from "./getDistance";
import {UDAConsoleLogger} from "../config/error-log";

/**
 * Processes a collection of matching nodes to find the one closest to a selected reference node
 *
 * This function implements an intelligent node selection algorithm that finds the best matching
 * node from a collection of candidates based on spatial proximity. It uses coordinate-based
 * matching with fallback to distance calculations for optimal performance and accuracy.
 *
 * Algorithm Overview:
 * 1. Validates input parameters and node structure
 * 2. Iterates through matching nodes to find the closest match
 * 3. Prioritizes exact coordinate matches (same x or y position) for instant selection
 * 4. Falls back to distance calculations when no exact matches are found
 * 5. Returns the node with minimum calculated distance
 *
 * @param {Array} matchingNodes - Array of candidate DOM nodes to evaluate for proximity.
 *                                Each node should be a valid HTMLElement with positioning data.
 * @param {Object} selectedNode - Reference node object containing positioning and metadata.
 *                                Expected structure: { nodeInfo: Object, offset: {x, y} }
 *
 * @returns {HTMLElement|false} Returns the closest matching node from the candidates array,
 *                              or false if validation fails or no suitable match is found.
 *
 * @example
 * const candidates = [node1, node2, node3];
 * const reference = { nodeInfo: {...}, offset: {x: 100, y: 200} };
 * const closest = processDistanceOfNodes(candidates, reference);
 * if (closest) {
 *   console.log('Found closest node:', closest);
 * }
 */
export const processDistanceOfNodes = (matchingNodes, selectedNode) => {
  // Primary validation: Ensure selectedNode has required nodeInfo property and multiple candidates exist
  // This validation prevents unnecessary processing for single-node arrays and malformed input
  if (selectedNode.hasOwnProperty('nodeInfo') && matchingNodes.length > 1) {

    // Debug logging: Output selected node information for development and troubleshooting
    // Log level 4 indicates detailed debugging information for algorithm analysis
    UDAConsoleLogger.info(selectedNode, 4);

    // Initialize tracking variables for optimal node selection
    // leastDistanceNode will store the best match found during iteration
    let leastDistanceNode = null;
    // leastDistance uses -1 as sentinel value to indicate no distance calculated yet
    let leastDistance = -1;

    // Main algorithm loop: Iterate through all candidate nodes to find the closest match
    // This loop implements a two-phase matching strategy for optimal performance
    for (let node of matchingNodes) {

      // Phase 1: Fast coordinate matching - Get absolute positioning for current candidate
      // This provides pixel-perfect coordinate information for exact matching
      const _offsets = getAbsoluteOffsets(node);

      // Optimization: Check for exact coordinate alignment (same x OR y position)
      // This represents perfect alignment scenarios that should be prioritized
      if (selectedNode.offset &&
          (_offsets.x == selectedNode.offset.x ||
              _offsets.y == selectedNode.offset.y)
      ) {
        // Perfect match found: Set as optimal choice with zero distance
        // This early exit prevents unnecessary distance calculations
        leastDistanceNode = node;
        leastDistance = 0;
        // Break immediately since perfect alignment cannot be improved upon
        break;
      } else {
        // Phase 2: Distance-based matching - No exact coordinate match found
        // Extract comprehensive node information for distance calculation
        let nodeInfo = getNodeInfo(node);

        // Debug logging: Detailed information about distance calculation process
        // These logs help developers understand the comparison process and debug issues
        UDAConsoleLogger.info("---------------------------------------", 4);
        UDAConsoleLogger.info("Processing distance", 4);
        UDAConsoleLogger.info(node, 4);
        UDAConsoleLogger.info("Recorded Node Info: ", 4);
        UDAConsoleLogger.info(selectedNode.nodeInfo, 4);
        UDAConsoleLogger.info("Comparing Node Info: ", 4);
        UDAConsoleLogger.info(nodeInfo, 4);

        // Calculate distance between reference node and current candidate
        // This uses the imported getDistance utility for comprehensive distance calculation
        let dist = getDistance(selectedNode.nodeInfo, nodeInfo);

        // Distance comparison logic: Update tracking variables if better match found
        // First iteration: Initialize with first calculated distance as baseline
        if (leastDistance === -1) {
          // No previous distance calculated - set current as baseline
          leastDistance = dist;
          leastDistanceNode = node;
        } else if (dist < leastDistance) {
          // Better match found: Update tracking variables with new minimum
          leastDistance = dist;
          leastDistanceNode = node;
        }

        // Debug logging: Output calculated distance for analysis and troubleshooting
        // This helps developers understand the distance calculation results
        UDAConsoleLogger.info("Distance", 4);
        UDAConsoleLogger.info(dist, 4);
        UDAConsoleLogger.info("---------------------------------------", 4);
      }
    }

    // Return the node with minimum distance or exact coordinate match
    // This represents the optimal choice based on the algorithm's criteria
    return leastDistanceNode;
  } else {
    // Validation failure: Return false for invalid input conditions
    // This occurs when selectedNode lacks nodeInfo or insufficient candidates provided
    // Possible scenarios:
    // - selectedNode missing required nodeInfo property
    // - matchingNodes array has 0 or 1 elements (no comparison needed)
    // - null/undefined input parameters
    return false;
  }
};
