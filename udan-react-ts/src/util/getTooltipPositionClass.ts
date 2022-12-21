import {removeFromArray} from "./removeFromArray";
import {getScreenSize} from "./getScreenSize";
import {getNodeCoordinates} from "./getNodeCoordinates";

/**
 * To figure out the tooltip position for target element
 * @returns object
 */
export const getTooltipPositionClass = (
    targetElement: HTMLElement,
    tooltipElement: HTMLElement
) => {
  const availablePositions = ["right", "top", "left", "bottom"].slice();
  const screenSize = getScreenSize();
  const tooltipPos = getNodeCoordinates(tooltipElement, screenSize);
  const targetElementRect = targetElement?.getBoundingClientRect();

  let finalCssClass = "right";

  // Check for space to the right
  if (
      tooltipPos && targetElementRect.right + tooltipPos.width >
      screenSize.screen.width
  ) {
    removeFromArray(availablePositions, "right");
  }

  // Check for space above
  if (tooltipPos && targetElementRect.top - tooltipPos.height < 0) {
    removeFromArray(availablePositions, "top");
  }

  // Check for space to the left
  if (tooltipPos && targetElementRect.left - tooltipPos.width < 0) {
    removeFromArray(availablePositions, "left");
  }

  // Check for space below
  if (
      tooltipPos && targetElementRect.bottom + tooltipPos.height >
      screenSize.page.height
  ) {
    removeFromArray(availablePositions, "bottom");
  }

  if (availablePositions?.length > 0) {
    finalCssClass = availablePositions[0];
  }

  return finalCssClass;
};
