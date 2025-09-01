/**
 * //get node position on the page
 * @returns object
 */

export const getNodeCoordinates = (element: HTMLElement, windowSize: any) => {
  if (!element) return;
  const x = element?.getBoundingClientRect();
  let result = {
    top: x.top + windowSize.scrollInfo.scrollTop,
    width: x.width,
    height: x.height,
    left: x.left + windowSize.scrollInfo.scrollLeft,
    actualPos: x,
  };
  return result;
};
