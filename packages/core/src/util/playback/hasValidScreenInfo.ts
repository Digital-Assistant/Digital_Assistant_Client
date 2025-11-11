/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Validate presence of required screen/page position information on a node info object.
 * Matches UI semantics used by getDistance.
 */
export const hasValidScreenInfo = (node: any): boolean => {
  try {
    return !!(
      node &&
      node.nodePagePosition &&
      typeof node.nodePagePosition.left === 'number' &&
      typeof node.nodePagePosition.top === 'number' &&
      node.screenSize &&
      node.screenSize.page &&
      typeof node.screenSize.page.width === 'number' &&
      typeof node.screenSize.page.height === 'number'
    );
  } catch {
    return false;
  }
};
