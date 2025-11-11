/* eslint-disable @typescript-eslint/no-explicit-any */
import { hasValidScreenInfo } from './hasValidScreenInfo';

/**
 * Calculate Euclidean distance between two nodes using page-relative positions.
 * Normalizes second node position to first node's page dimensions when available.
 */
export const getDistance = (node1: any, node2: any): number => {
  let dist = 0;
  try {
    if (hasValidScreenInfo(node1) && hasValidScreenInfo(node2)) {
      let x1 = node1.nodePagePosition.left;
      let y1 = node1.nodePagePosition.top;
      let x2 = node2.nodePagePosition.left;
      let y2 = node2.nodePagePosition.top;

      const width1 = node1.screenSize.page.width;
      const height1 = node1.screenSize.page.height;
      const width2 = node2.screenSize.page.width;
      const height2 = node2.screenSize.page.height;

      if (width1 !== width2 || height1 !== height2) {
        const scaleX = width1 / width2;
        const scaleY = height1 / height2;
        x2 = x2 * scaleX;
        y2 = y2 * scaleY;
      }

      const dx = x1 - x2;
      const dy = y1 - y2;
      dist = Math.sqrt(dx * dx + dy * dy);
    } else {
      // Fallback: not resolution-aware
      const dx = (node1.nodePosition?.x || 0) - (node2.nodePosition?.x || 0);
      const dy = (node1.nodePosition?.y || 0) - (node2.nodePosition?.y || 0);
      dist = Math.sqrt(dx * dx + dy * dy);
    }
  } catch {
    dist = 0;
  }
  return dist;
};
