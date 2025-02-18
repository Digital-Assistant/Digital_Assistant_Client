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
  const availablePositions = [
    "top", "right", "bottom", "left"
  ].slice();

  const screenSize = getScreenSize();
  const PADDING = 30;

  const maxWidth = Math.min(300, screenSize.screen.width * 0.8);
  const maxHeight = Math.min(400, screenSize.screen.height * 0.8);

  tooltipElement.style.maxWidth = `${maxWidth}px`;
  tooltipElement.style.maxHeight = `${maxHeight}px`;

  const tooltipPos = getNodeCoordinates(tooltipElement, screenSize);
  const targetElementRect = targetElement?.getBoundingClientRect();

  // Calculate available gaps in each direction
  const gaps = {
    top: targetElementRect.top,
    right: screenSize.screen.width - (targetElementRect.right+targetElementRect.width),
    bottom: screenSize.screen.height - (targetElementRect.bottom+targetElementRect.height),
    left: (targetElementRect.left)
  };

  // Check if there's enough space in each direction considering combinations
  if (gaps.right <= (tooltipPos.width + PADDING)) {
    removeFromArray(availablePositions, "right");
  } else if(gaps.right > (tooltipPos.width + PADDING) && (gaps.top < (tooltipPos.height + PADDING) || gaps.bottom < (tooltipPos.height + PADDING))) {
    removeFromArray(availablePositions, "right");
  }

  if (gaps.left <= (tooltipPos.width + PADDING)) {
    removeFromArray(availablePositions, "left");
  } else if(gaps.left > (tooltipPos.width + PADDING) && (gaps.top < (tooltipPos.height + PADDING) || gaps.bottom < (tooltipPos.height + PADDING))){
    removeFromArray(availablePositions, "left");
  }

  if (gaps.bottom < tooltipPos.height + PADDING) {
    removeFromArray(availablePositions, "bottom");
  }

  if (gaps.top < (tooltipPos.height + PADDING)) {
    removeFromArray(availablePositions, "top");
  }

  // Determine best position based on maximum available space
  let finalCssClass = "right"; // default fallback

  if (availablePositions.length > 0) {
    finalCssClass = availablePositions[0];
  }

  switch (finalCssClass) {
    case "right":
      if (gaps.top < (tooltipPos.height + PADDING)) {
        finalCssClass = finalCssClass+"-start";
      } else if (gaps.bottom < (tooltipPos.height + PADDING)) {
        finalCssClass = finalCssClass+"-end";
      }
      break;
    case "bottom":
      if (gaps.left < (tooltipPos.width + PADDING)) {
        finalCssClass = finalCssClass+"-start";
      } else if (gaps.right < (tooltipPos.width + PADDING)) {
        finalCssClass = finalCssClass+"-end";
      }
      break;
    case "left":
      if (gaps.top < (tooltipPos.height + PADDING)) {
        finalCssClass = finalCssClass+"-start";
      } else if (gaps.bottom < (tooltipPos.height + PADDING)) {
        finalCssClass = finalCssClass+"-end";
      }
      break;
    case "top":
      if (gaps.left < (tooltipPos.width + PADDING)) {
        finalCssClass = finalCssClass+"-start";
      } else if (gaps.right < (tooltipPos.width + PADDING)) {
        finalCssClass = finalCssClass+"-end";
      }
      break;
  }

  console.log(finalCssClass);

  return finalCssClass;
};
