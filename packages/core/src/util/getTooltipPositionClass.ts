import { removeFromArray } from "./removeFromArray";
import { getScreenSize } from "./getScreenSize";
import { getNodeCoordinates } from "./getNodeCoordinates";

/**
 * Position types for tooltip placement
 */
type TooltipPosition = "top" | "right" | "bottom" | "left";

/**
 * Position variants including start and end modifiers
 */
type TooltipPositionVariant =
    | TooltipPosition
    | `${TooltipPosition}-start`
    | `${TooltipPosition}-end`;

/**
 * Interface for gaps around target element
 */
interface DirectionalGaps {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Result of tooltip position calculation
 */
interface TooltipPositionResult {
  finalCssClass: TooltipPositionVariant;
  availablePositions: TooltipPosition[];
}

/**
 * Calculate available positions based on element gaps and tooltip dimensions
 *
 * @param gaps - Gaps around the target element
 * @param tooltipDimensions - Width and height of tooltip
 * @param padding - Padding to maintain around tooltip
 * @returns Array of available positions
 */
const calculateAvailablePositions = (
    gaps: DirectionalGaps,
    tooltipDimensions: { width: number; height: number },
    padding: number
): TooltipPosition[] => {
  const availablePositions: TooltipPosition[] = ["top", "right", "bottom", "left"];

  // Check right position
  if (gaps.right <= (tooltipDimensions.width + padding)) {
    removeFromArray(availablePositions, "right");
  } else if (
      gaps.right > (tooltipDimensions.width + padding) &&
      (gaps.top < (tooltipDimensions.height + padding) || gaps.bottom < (tooltipDimensions.height + padding))
  ) {
    removeFromArray(availablePositions, "right");
  }

  // Check left position
  if (gaps.left <= (tooltipDimensions.width + padding)) {
    removeFromArray(availablePositions, "left");
  } else if (
      gaps.left > (tooltipDimensions.width + padding) &&
      (gaps.top < (tooltipDimensions.height + padding) || gaps.bottom < (tooltipDimensions.height + padding))
  ) {
    removeFromArray(availablePositions, "left");
  }

  // Check bottom position
  if (gaps.bottom < tooltipDimensions.height + padding) {
    removeFromArray(availablePositions, "bottom");
  }

  // Check top position
  if (gaps.top < (tooltipDimensions.height + padding)) {
    removeFromArray(availablePositions, "top");
  }

  return availablePositions;
};

/**
 * Get base position from position class that might include modifiers
 *
 * @param positionClass - Position class that might include modifiers
 * @returns Base position without modifiers
 */
const getBasePosition = (positionClass: string): TooltipPosition => {
  if (!positionClass) return null;

  if (positionClass.startsWith("right")) return "right";
  if (positionClass.startsWith("left")) return "left";
  if (positionClass.startsWith("top")) return "top";
  if (positionClass.startsWith("bottom")) return "bottom";

  return null;
};

/**
 * Apply position modifiers based on available space
 *
 * @param basePosition - Base position (top, right, bottom, left)
 * @param gaps - Gaps around the target element
 * @param tooltipDimensions - Width and height of tooltip
 * @param padding - Padding to maintain around tooltip
 * @returns Position with appropriate modifiers
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
 * @param targetElement - The element the tooltip is attached to
 * @param tooltipElement - The tooltip element itself
 * @param selectedPosition - Preferred position, or 'auto' to determine automatically
 * @param currentToolTipPositionClass - Current position class if already positioned
 * @param availablePositionsForElement - List of allowed positions for this element
 * @returns Object containing the final CSS class and available positions
 */
export const getTooltipPositionClass = (
    targetElement: HTMLElement,
    tooltipElement: HTMLElement,
    selectedPosition: string = 'auto',
    currentToolTipPositionClass: string = null,
    availablePositionsForElement: string[] = [],
): TooltipPositionResult => {
  // Constants
  const PADDING = 30;
  const DEFAULT_POSITION: TooltipPosition = "right";

  // Get screen dimensions
  const screenSize = getScreenSize();

  // Calculate maximum dimensions for tooltip
  const maxWidth = Math.min(300, screenSize.screen.width * 0.8);
  const maxHeight = Math.min(400, screenSize.screen.height * 0.8);

  // Apply maximum dimensions to tooltip
  tooltipElement.style.maxWidth = `${maxWidth}px`;
  tooltipElement.style.maxHeight = `${maxHeight}px`;

  // Get tooltip and target element dimensions
  const tooltipPos = getNodeCoordinates(tooltipElement, screenSize);
  const targetElementRect = targetElement?.getBoundingClientRect();

  // Calculate gaps in each direction
  const gaps: DirectionalGaps = {
    top: targetElementRect.top,
    right: screenSize.screen.width - (targetElementRect.right + targetElementRect.width),
    bottom: screenSize.screen.height - (targetElementRect.bottom + targetElementRect.height),
    left: targetElementRect.left
  };

  // Calculate available positions based on space constraints
  const availablePositions = calculateAvailablePositions(
      gaps,
      { width: tooltipPos.width, height: tooltipPos.height },
      PADDING
  );

  let finalCssClass: TooltipPositionVariant;

  // Determine position based on selected position or available space
  if (availablePositions.length > 0 && selectedPosition === 'auto') {
    // Use first available position if auto-positioning
    finalCssClass = availablePositions[0];
  } else if (selectedPosition !== 'auto') {
    // Handle specific position selection
    if (availablePositionsForElement.includes(selectedPosition)) {
      // Use selected position if available
      finalCssClass = selectedPosition as TooltipPositionVariant;
    } else if (currentToolTipPositionClass !== selectedPosition) {
      // Try to find next position in available positions
      const currentBasePosition = getBasePosition(currentToolTipPositionClass);

      if (currentBasePosition) {
        const currentPosIndex = availablePositionsForElement.findIndex(
            position => currentBasePosition === position
        );

        if (currentPosIndex > -1 && currentPosIndex + 1 < availablePositionsForElement.length) {
          finalCssClass = availablePositionsForElement[currentPosIndex + 1] as TooltipPositionVariant;
        } else {
          finalCssClass = DEFAULT_POSITION;
        }
      } else {
        finalCssClass = DEFAULT_POSITION;
      }
    } else {
      // Keep current position
      finalCssClass = currentToolTipPositionClass as TooltipPositionVariant;
    }
  } else {
    // Default fallback
    finalCssClass = DEFAULT_POSITION;
  }

  // Apply position modifiers based on available space
  finalCssClass = applyPositionModifiers(
      getBasePosition(finalCssClass) || DEFAULT_POSITION,
      gaps,
      { width: tooltipPos.width, height: tooltipPos.height },
      PADDING
  );

  return { finalCssClass, availablePositions };
};
