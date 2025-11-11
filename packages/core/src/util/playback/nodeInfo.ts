/* eslint-disable @typescript-eslint/no-explicit-any */
import { getScreenSize } from './getScreenSize';

export const getNodeCoordinates = (element: any, windowSize: any) => {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + (windowSize?.scrollInfo?.scrollTop || 0),
    left: rect.left + (windowSize?.scrollInfo?.scrollLeft || 0),
    width: rect.width,
    height: rect.height,
    actualPos: rect,
  };
};

export const getNodeInfo = (node: any) => {
  const screenSize = getScreenSize();
  const nodePosition = node.getBoundingClientRect();
  const nodePagePosition = getNodeCoordinates(node, screenSize);
  return {
    nodePosition,
    screenSize,
    nodePagePosition,
  };
};
