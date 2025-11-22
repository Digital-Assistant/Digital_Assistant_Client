import {hasValidScreenInfo} from "../screen/hasValidScreenInfo";
import {UDAConsoleLogger} from "../error/error-log";

/**
 * Calculates the distance between two nodes, normalizing their positions
 * based on their respective document sizes to ensure consistency across
 * different screen resolutions and document layouts.
 *
 * @param {object} node1 - The first node object, expected to have `nodePagePosition` and `screenSize.page` properties.
 * @param {object} node2 - The second node object, expected to have `nodePagePosition` and `screenSize.page` properties.
 * @returns {number} The calculated Euclidean distance between the two nodes.
 */
export const getDistance = (node1: any, node2: any) => {
  let dist;

  // Check if both nodes have valid screen information for normalization.
  if (hasValidScreenInfo(node1) && hasValidScreenInfo(node2)) {
    // Get the page positions of the nodes.
    let x1 = node1.nodePagePosition.left;
    let y1 = node1.nodePagePosition.top;
    let x2 = node2.nodePagePosition.left;
    let y2 = node2.nodePagePosition.top;

    // Get the page dimensions for both nodes.
    const width1 = node1.screenSize.page.width;
    const height1 = node1.screenSize.page.height;
    const width2 = node2.screenSize.page.width;
    const height2 = node2.screenSize.page.height;

    // Normalize positions to a common scale.
    // We'll scale both nodes' positions relative to a reference size.
    // For simplicity, let's use node1's page size as the reference.
    // Alternatively, one could normalize to a fixed "standard" resolution.

    // If node2's page size is different from node1's, scale node2's position.
    if (width1 !== width2 || height1 !== height2) {
      // Calculate scaling factors for node2's position to match node1's scale.
      const scaleX = width1 / width2;
      const scaleY = height1 / height2;

      // Apply the scaling factors to node2's coordinates.
      x2 = x2 * scaleX;
      y2 = y2 * scaleY;
    }

    // Calculate the distance using the (potentially) scaled node2 position.
    const deltaX = x1 - x2;
    const deltaY = y1 - y2;

    // Use the Pythagorean theorem to find the distance.
    dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  } else {
    // Fallback if screen size information is not available or is invalid for robust scaling.
    // This will calculate the distance based on absolute pixel values, which is NOT resolution-agnostic.
    UDAConsoleLogger.info("getDistance: Missing or invalid screenSize.page data for one or both nodes. Calculating distance based on absolute pixel values, which is NOT resolution-agnostic.", 4);
    const deltaX = node1.nodePosition.x - node2.nodePosition.x;
    const deltaY = node1.nodePosition.y - node2.nodePosition.y;
    dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  }
  // `Math.sqrt` already returns a non-negative number, so `Math.abs` is not needed.
  return dist;
};
