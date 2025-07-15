/**
 * Node Information Utility Module
 *
 * This module provides comprehensive utilities for extracting detailed information
 * about DOM elements, including their positioning, screen dimensions, zoom factors,
 * and coordinate calculations. It handles cross-browser compatibility and provides
 * accurate measurements for both viewport and page-relative positioning.
 */

import {getScreenSize} from "./getScreenSize";

/**
 * Retrieves comprehensive information about a DOM element's positioning and context
 *
 * This function aggregates multiple pieces of information about a DOM element including
 * its position relative to the viewport, its position on the page, screen dimensions,
 * and current zoom settings. This data is essential for accurate element positioning
 * and interaction calculations.
 *
 * @param {HTMLElement} node - The DOM element to analyze. Must be a valid HTMLElement
 *                             that exists in the document and has positioning information.
 *
 * @returns {Object} Complete node information object containing:
 *   - nodePosition: DOMRect with viewport-relative positioning
 *   - screenSize: Screen dimensions and scroll information
 *   - nodePagePosition: Page-relative positioning with scroll offsets
 *   - zoomInfo: Comprehensive zoom factor information
 *
 * @example
 * const element = document.getElementById('myElement');
 * const info = getNodeInfo(element);
 * console.log(info.nodePosition.top); // Viewport-relative top position
 * console.log(info.nodePagePosition.top); // Page-relative top position
 */
export const getNodeInfo = (node: HTMLElement) => {
  // Get current screen dimensions and scroll information
  // This provides context for positioning calculations
  const screenSize = getScreenSize();

  // Get viewport-relative positioning using native browser API
  // getBoundingClientRect() returns position relative to the current viewport
  const nodePosition = node.getBoundingClientRect();

  // Calculate page-relative positioning by adding scroll offsets
  // This gives absolute position on the entire page, not just viewport
  const pagePosition = getNodeCoordinates(node, screenSize);

  // Return comprehensive node information object
  // All positioning data needed for accurate element interaction
  return {
    nodePosition: nodePosition,        // Viewport-relative DOMRect
    screenSize: screenSize,           // Screen dimensions and scroll info
    nodePagePosition: pagePosition,   // Page-relative positioning
    zoomInfo: getEffectiveZoomInfo()  // Browser and system zoom factors
  };
}

/**
 * Calculates page-relative coordinates for a DOM element
 *
 * This function converts viewport-relative coordinates (from getBoundingClientRect)
 * to page-relative coordinates by adding the current scroll offsets. This is essential
 * for accurate positioning when the page is scrolled.
 *
 * @param {HTMLElement} element - The DOM element to calculate coordinates for
 * @param {Object} windowSize - Screen size object containing scroll information
 *                              Expected to have scrollInfo.scrollTop and scrollInfo.scrollLeft
 *
 * @returns {Object} Page-relative coordinate information:
 *   - top: Page-relative top position (viewport top + scroll top)
 *   - left: Page-relative left position (viewport left + scroll left)
 *   - width: Element width (unchanged from viewport measurement)
 *   - height: Element height (unchanged from viewport measurement)
 *   - actualPos: Original DOMRect for reference
 *
 * @example
 * const element = document.querySelector('.my-element');
 * const screenSize = getScreenSize();
 * const coords = getNodeCoordinates(element, screenSize);
 * console.log(coords.top); // Absolute position from top of page
 */
export const getNodeCoordinates = (element, windowSize) => {
  // Get viewport-relative positioning using browser API
  // This provides the foundation for page-relative calculations
  const x = element.getBoundingClientRect();

  // Calculate page-relative coordinates by adding scroll offsets
  // This converts viewport position to absolute page position
  let result = {
    // Page-relative top: viewport top + amount scrolled vertically
    top: x.top + windowSize.scrollInfo.scrollTop,

    // Element dimensions remain the same regardless of scroll position
    width: x.width,
    height: x.height,

    // Page-relative left: viewport left + amount scrolled horizontally
    left: x.left + windowSize.scrollInfo.scrollLeft,

    // Preserve original DOMRect for reference and debugging
    actualPos: x
  };

  return result;
}

/**
 * Detects the current browser zoom factor independent of system DPI scaling
 *
 * This function creates a temporary DOM element with known CSS dimensions and measures
 * its actual rendered size to determine the browser's zoom level. This method is
 * independent of system DPI scaling and provides accurate browser zoom detection
 * across different browsers and operating systems.
 *
 * The technique works by:
 * 1. Creating a test element with fixed CSS dimensions (100px)
 * 2. Measuring the actual rendered dimensions
 * 3. Calculating the ratio to determine zoom factor
 *
 * @returns {number} Browser zoom factor as a decimal (1.0 = 100%, 1.5 = 150%, etc.)
 *                   Returns 1.0 if not in browser environment or if detection fails
 *
 * @example
 * const zoom = getBrowserZoomFactor();
 * console.log(`Browser zoom: ${(zoom * 100).toFixed(0)}%`);
 * // Output: "Browser zoom: 125%" for 125% zoom level
 */
export const getBrowserZoomFactor = () => {
  // Environment check: Ensure we're in a browser with a ready document
  // This prevents errors in server-side rendering or incomplete page loads
  if (typeof document === 'undefined' || !document.body) {
    // Not in a browser environment or document not ready
    // Return default zoom factor to prevent calculation errors
    return 1;
  }

  // Create temporary test element for zoom measurement
  // This element will be used to compare declared vs rendered dimensions
  const testDiv = document.createElement('div');

  // Set known CSS dimensions for zoom calculation baseline
  // Using 100px makes percentage calculations straightforward
  testDiv.style.width = '100px';
  testDiv.style.height = '100px';

  // Position absolutely to prevent layout interference
  // This ensures the test doesn't affect page layout or other elements
  testDiv.style.position = 'absolute';

  // Hide the test element from user view
  // Element needs to be in DOM for measurement but shouldn't be visible
  testDiv.style.visibility = 'hidden';

  // Add test element to DOM for measurement
  // Element must be in document to get accurate getBoundingClientRect values
  document.body.appendChild(testDiv);

  // Measure actual rendered dimensions
  // getBoundingClientRect returns the actual pixel dimensions as rendered
  const rect = testDiv.getBoundingClientRect();
  const renderedWidth = rect.width;

  // Clean up: Remove test element from DOM
  // Important to prevent memory leaks and DOM pollution
  document.body.removeChild(testDiv);

  // Calculate browser zoom factor
  // The browser zoom factor is the ratio of rendered width to declared CSS width (100px)
  // This calculation is independent of system DPI scaling (devicePixelRatio)
  // and gives us the browser's zoom relative to its default 100% view
  const browserZoom = renderedWidth / 100; // Ratio of actual to expected size

  return browserZoom;
}

/**
 * Provides comprehensive zoom information including browser zoom and system DPI scaling
 *
 * This function combines browser zoom detection with system DPI information to provide
 * a complete picture of all scaling factors affecting element rendering. It distinguishes
 * between user-controlled browser zoom and system-level DPI scaling, which is crucial
 * for accurate positioning and interaction calculations.
 *
 * @returns {Object} Comprehensive zoom information object containing:
 *   - systemDpiScale: System DPI scaling factor (from devicePixelRatio)
 *   - browserZoomFactor: Browser zoom level (user-controlled)
 *   - totalEffectiveZoom: Combined effect of both scaling factors
 *   - systemDpiScalePercentage: DPI scaling as percentage string
 *   - browserZoomFactorPercentage: Browser zoom as percentage string
 *   - totalEffectiveZoomPercentage: Total zoom as percentage string
 *
 * @example
 * const zoomInfo = getEffectiveZoomInfo();
 * console.log(`System DPI: ${zoomInfo.systemDpiScalePercentage}`);
 * console.log(`Browser Zoom: ${zoomInfo.browserZoomFactorPercentage}`);
 * console.log(`Total Effective: ${zoomInfo.totalEffectiveZoomPercentage}`);
 */
export const getEffectiveZoomInfo = () => {
  // Get system DPI scaling factor from browser API
  // devicePixelRatio represents the ratio of physical pixels to CSS pixels
  // Higher values indicate high-DPI displays (Retina, 4K, etc.)
  const systemDpiScale = window.devicePixelRatio || 1; // Fallback for older browsers/environments

  // Get browser-specific zoom factor using our custom detection method
  // This is independent of system DPI and represents user zoom actions
  const browserZoomFactor = getBrowserZoomFactor();

  // Calculate total effective zoom by combining both factors
  // This represents the overall scaling effect on rendered elements
  const totalEffectiveZoom = systemDpiScale * browserZoomFactor;

  // Return comprehensive zoom information with both numeric and percentage formats
  // Percentage strings are useful for display and logging purposes
  return {
    // Raw numeric values for calculations
    systemDpiScale: systemDpiScale,
    browserZoomFactor: browserZoomFactor,
    totalEffectiveZoom: totalEffectiveZoom,

    // Human-readable percentage strings for display and debugging
    systemDpiScalePercentage: `${(systemDpiScale * 100).toFixed(0)}%`,
    browserZoomFactorPercentage: `${(browserZoomFactor * 100).toFixed(0)}%`,
    totalEffectiveZoomPercentage: `${(totalEffectiveZoom * 100).toFixed(0)}%`
  };
}
