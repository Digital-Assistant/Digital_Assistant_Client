import { removeFromArray } from "../removeFromArray";
import { getScreenSize } from "../screen/getScreenSize";
import { getNodeCoordinates } from "./getNodeCoordinates";

/**
 * Defines the possible base positions for a tooltip.
 */
type TooltipPosition = "top" | "right" | "bottom" | "left";

/**
 * Defines the possible position variants, including start and end modifiers.
 */
type TooltipPositionVariant =
    | TooltipPosition
    | `${TooltipPosition}-start`
    | `${TooltipPosition}-end`;

/**
 * Represents the available space (gaps) around a target element.
 */
interface DirectionalGaps {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Represents the result of a tooltip position calculation.
 */
interface TooltipPositionResult {
  finalCssClass: TooltipPositionVariant;
  availablePositions: TooltipPosition[];
}

/**
 * Calculates the available positions for a tooltip based on the gaps around the target element
 * and the dimensions of the tooltip.
 *
 * @param gaps The gaps around the target element.
 * @param tooltipDimensions The width and height of the tooltip.
 * @param padding The padding to maintain around the tooltip.
 * @returns An array of available `TooltipPosition` values.
 */
const calculateAvailablePositions = (
    gaps: DirectionalGaps,
    tooltipDimensions: { width: number; height: number },
    padding: number
): TooltipPosition[] => {
  const availablePositions: TooltipPosition[] = ["top", "right", "bottom", "left"];

  // Check if there is enough space on the right.
  if (gaps.right <= (tooltipDimensions.width + padding) || (gaps.top < (tooltipDimensions.height + padding) || gaps.bottom < (tooltipDimensions.height + padding))) {
    removeFromArray(availablePositions, "right");
  }

  // Check if there is enough space on the left.
  if (gaps.left <= (tooltipDimensions.width + padding) || (gaps.top < (tooltipDimensions.height + padding) || gaps.bottom < (tooltipDimensions.height + padding))) {
    removeFromArray(availablePositions, "left");
  }

  // Check if there is enough space at the bottom.
  if (gaps.bottom < tooltipDimensions.height + padding) {
    removeFromArray(availablePositions, "bottom");
  }

  // Check if there is enough space at the top.
  if (gaps.top < (tooltipDimensions.height + padding)) {
    removeFromArray(availablePositions, "top");
  }

  return availablePositions;
};

/**
 * Extracts the base position from a position class string that might include modifiers (e.g., 'top-start').
 *
 * @param positionClass The position class string.
 * @returns The base `TooltipPosition` or `null` if not found.
 */
const getBasePosition = (positionClass: string): TooltipPosition | null => {
  if (!positionClass) return null;

  if (positionClass.startsWith("right")) return "right";
  if (positionClass.startsWith("left")) return "left";
  if (positionClass.startsWith("top")) return "top";
  if (positionClass.startsWith("bottom")) return "bottom";

  return null;
};

/**
 * Applies position modifiers (e.g., '-start', '-end') based on available space.
 *
 * @param basePosition The base position ('top', 'right', 'bottom', 'left').
 * @param gaps The gaps around the target element.
 * @param tooltipDimensions The width and height of the tooltip.
 * @param padding The padding to maintain around the tooltip.
 * @returns The `TooltipPositionVariant` with the appropriate modifier.
 */
const applyPositionModifiers = (
    basePosition: TooltipPosition,
    gaps: DirectionalGaps,
    tooltipDimensions: { width: number; height: number },
    padding: number
): TooltipPositionVariant => {
  let finalPosition: TooltipPositionVariant = basePosition;

  switch (basePosition) {
    case "right":
    case "left":
      if (gaps.top < (tooltipDimensions.height + padding)) {
        finalPosition = `${basePosition}-start`;
      } else if (gaps.bottom < (tooltipDimensions.height + padding)) {
        finalPosition = `${basePosition}-end`;
      }
      break;
    case "top":
    case "bottom":
      if (gaps.left < (tooltipDimensions.width + padding)) {
        finalPosition = `${basePosition}-start`;
      } else if (gaps.right < (tooltipDimensions.width + padding)) {
        finalPosition = `${basePosition}-end`;
      }
      break;
  }

  return finalPosition;
};

/**
 * Determines the optimal position for a tooltip relative to its target element.
 *
 * @param targetElement The element the tooltip is attached to.
 * @param tooltipElement The tooltip element itself.
 * @param selectedPosition The preferred position, or 'auto' to determine automatically.
 * @param currentToolTipPositionClass The current position class if the tooltip is already positioned.
 * @param availablePositionsForElement A list of allowed positions for this element.
 * @returns An object containing the final CSS class and a list of available positions.
 */
export const getTooltipPositionClass = (
    targetElement: HTMLElement,
    tooltipElement: HTMLElement,
    selectedPosition: string = 'auto',
    currentToolTipPositionClass: string = '',
    availablePositionsForElement: string[] = [],
): TooltipPositionResult => {
  const PADDING = 30;
  const DEFAULT_POSITION: TooltipPosition = "right";

  const screenSize = getScreenSize();
  const maxWidth = Math.min(300, screenSize.screen.width * 0.8);
  const maxHeight = Math.min(400, screenSize.screen.height * 0.8);

  tooltipElement.style.maxWidth = `${maxWidth}px`;
  tooltipElement.style.maxHeight = `${maxHeight}px`;

  const tooltipPos: any = getNodeCoordinates(tooltipElement, screenSize);
  const targetElementRect = targetElement?.getBoundingClientRect();

  const gaps: DirectionalGaps = {
    top: targetElementRect.top,
    right: screenSize.screen.width - (targetElementRect.right + targetElementRect.width),
    bottom: screenSize.screen.height - (targetElementRect.bottom + targetElementRect.height),
    left: targetElementRect.left
  };

  const availablePositions = calculateAvailablePositions(
      gaps,
      { width: tooltipPos.width, height: tooltipPos.height },
      PADDING
  );

  let finalCssClass: TooltipPositionVariant;

  if (availablePositions.length > 0 && selectedPosition === 'auto') {
    finalCssClass = availablePositions[0];
  } else if (selectedPosition !== 'auto') {
    if (availablePositionsForElement.includes(selectedPosition)) {
      finalCssClass = selectedPosition as TooltipPositionVariant;
    } else {
      const currentBasePosition = getBasePosition(currentToolTipPositionClass);
      if (currentBasePosition) {
        const currentPosIndex = availablePositionsForElement.findIndex(p => p === currentBasePosition);
        if (currentPosIndex > -1 && currentPosIndex + 1 < availablePositionsForElement.length) {
          finalCssClass = availablePositionsForElement[currentPosIndex + 1] as TooltipPositionVariant;
        } else {
          finalCssClass = DEFAULT_POSITION;
        }
      } else {
        finalCssClass = DEFAULT_POSITION;
      }
    }
  } else {
    finalCssClass = currentToolTipPositionClass as TooltipPositionVariant || DEFAULT_POSITION;
  }

  finalCssClass = applyPositionModifiers(
      getBasePosition(finalCssClass) || DEFAULT_POSITION,
      gaps,
      { width: tooltipPos.width, height: tooltipPos.height },
      PADDING
  );

  return { finalCssClass, availablePositions };
};
