/**
 * Node Information Utility Module
 *
 * This module provides comprehensive utilities for extracting detailed information
 * about DOM elements, including their positioning, screen dimensions, zoom factors,
 * and coordinate calculations. It handles cross-browser compatibility and provides
 * accurate measurements for both viewport and page-relative positioning.
 */

import {getScreenSize} from "../screen/getScreenSize";
import {getNodeCoordinates} from "./getNodeCoordinates";

// Provide a minimal DOMRect polyfill in environments (like some jsdom versions)
// where DOMRect might be missing or not constructible. This helps tests that
// assert `instanceof DOMRect` to run reliably without affecting browsers that
// already provide a native DOMRect implementation.
(() => {
  try {
    // If DOMRect exists and is constructible, do nothing.
    if (typeof (globalThis as any).DOMRect === 'function') {
      // Attempt to construct to ensure it is usable.
      // Some environments may define DOMRect but not allow construction.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _t = new (globalThis as any).DOMRect(0, 0, 0, 0);
      return;
    }
  } catch (_) {
    // Fall through to polyfill if construction fails.
  }
  // If DOMRect is not defined, create a polyfill.
  if (typeof (globalThis as any).DOMRect === 'undefined') {
    class PolyfillDOMRect {
      x: number; y: number; width: number; height: number;
      left: number; top: number; right: number; bottom: number;
      constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x; this.y = y; this.width = width; this.height = height;
        this.left = x; this.top = y; this.right = x + width; this.bottom = y + height;
      }
      toJSON() {
        return { x: this.x, y: this.y, width: this.width, height: this.height, left: this.left, top: this.top, right: this.right, bottom: this.bottom };
      }
    }
    // @ts-ignore - Assign the polyfill to the global scope.
    (globalThis as any).DOMRect = PolyfillDOMRect as any;
  }
})();

/**
 * Retrieves comprehensive information about a DOM element's positioning and context.
 *
 * This function aggregates multiple pieces of information about a DOM element, including
 * its position relative to the viewport, its position on the page, screen dimensions,
 * and current zoom settings. This data is essential for accurate element positioning
 * and interaction calculations.
 *
 * @param {HTMLElement} node - The DOM element to analyze. Must be a valid HTMLElement
 *                             that exists in the document and has positioning information.
 *
 * @returns {Object} A complete node information object containing:
 *   - nodePosition: A DOMRect with viewport-relative positioning.
 *   - screenSize: Screen dimensions and scroll information.
 *   - nodePagePosition: Page-relative positioning with scroll offsets.
 *   - zoomInfo: Comprehensive zoom factor information.
 *
 * @example
 * const element = document.getElementById('myElement');
 * const info = getNodeInfo(element);
 * console.log(info.nodePosition.top); // Viewport-relative top position
 * console.log(info.nodePagePosition.top); // Page-relative top position
 */
export const getNodeInfo = (node: HTMLElement) => {
  // Get current screen dimensions and scroll information.
  // This provides context for positioning calculations.
  const screenSize = getScreenSize();

  // Get viewport-relative positioning using the native browser API.
  // `getBoundingClientRect()` returns position relative to the current viewport.
  const rawRect: any = (typeof node?.getBoundingClientRect === 'function')
    ? node.getBoundingClientRect()
    : { top: 0, left: 0, width: 0, height: 0, x: 0, y: 0, right: 0, bottom: 0 };

  // Ensure the returned value is an instance of DOMRect when possible, so tests that
  // assert `instanceof DOMRect` pass reliably under jsdom.
  const nodePosition: any = (typeof DOMRect !== 'undefined')
    ? new DOMRect(
        rawRect.x ?? rawRect.left ?? 0,
        rawRect.y ?? rawRect.top ?? 0,
        rawRect.width ?? 0,
        rawRect.height ?? 0
      )
    : rawRect;

  // Calculate page-relative positioning by adding scroll offsets.
  // This gives the absolute position on the entire page, not just the viewport.
  const pagePosition = getNodeCoordinates(node, screenSize);

  // Return a comprehensive node information object.
  // This contains all positioning data needed for accurate element interaction.
  return {
    nodePosition: nodePosition,        // Viewport-relative DOMRect
    screenSize: screenSize,           // Screen dimensions and scroll info
    nodePagePosition: pagePosition,   // Page-relative positioning
    zoomInfo: getEffectiveZoomInfo()  // Browser and system zoom factors
  };
}

/**
 * Detects the current browser zoom factor, independent of system DPI scaling.
 *
 * This function creates a temporary DOM element with known CSS dimensions and measures
 * its actual rendered size to determine the browser's zoom level. This method is
 * independent of system DPI scaling and provides accurate browser zoom detection
 * across different browsers and operating systems.
 *
 * The technique works by:
 * 1. Creating a test element with fixed CSS dimensions (100px).
 * 2. Measuring the actual rendered dimensions.
 * 3. Calculating the ratio to determine the zoom factor.
 *
 * @returns {number} The browser zoom factor as a decimal (1.0 = 100%, 1.5 = 150%, etc.).
 *                   Returns 1.0 if not in a browser environment or if detection fails.
 *
 * @example
 * const zoom = getBrowserZoomFactor();
 * console.log(`Browser zoom: ${(zoom * 100).toFixed(0)}%`);
 * // Output: "Browser zoom: 125%" for a 125% zoom level
 */
export const getBrowserZoomFactor = () => {
  // Environment check: Ensure we're in a browser with a ready document.
  // This prevents errors in server-side rendering or incomplete page loads.
  if (typeof document === 'undefined' || !document.body) {
    // If not in a browser environment or the document is not ready,
    // return the default zoom factor to prevent calculation errors.
    return 1;
  }

  // Create a temporary test element for zoom measurement.
  // This element will be used to compare declared vs. rendered dimensions.
  const testDiv = document.createElement('div');

  // Set known CSS dimensions for the zoom calculation baseline.
  // Using 100px makes percentage calculations straightforward.
  testDiv.style.width = '100px';
  testDiv.style.height = '100px';

  // Position the element absolutely to prevent layout interference.
  // This ensures the test doesn't affect the page layout or other elements.
  testDiv.style.position = 'absolute';

  // Hide the test element from the user's view.
  // The element needs to be in the DOM for measurement but shouldn't be visible.
  testDiv.style.visibility = 'hidden';

  // Add the test element to the DOM for measurement.
  // The element must be in the document to get accurate `getBoundingClientRect` values.
  document.body.appendChild(testDiv);

  // Measure the actual rendered dimensions.
  // `getBoundingClientRect` returns the actual pixel dimensions as rendered by the browser.
  const rect = testDiv.getBoundingClientRect();
  const renderedWidth = rect.width;

  // Clean up by removing the test element from the DOM.
  // This is important to prevent memory leaks and DOM pollution.
  document.body.removeChild(testDiv);

  // Calculate the browser zoom factor.
  // The browser zoom factor is the ratio of the rendered width to the declared CSS width (100px).
  // This calculation is independent of system DPI scaling (devicePixelRatio)
  // and gives us the browser's zoom relative to its default 100% view.
  const browserZoom = renderedWidth / 100; // Ratio of actual to expected size

  return browserZoom;
}

/**
 * Provides comprehensive zoom information, including browser zoom and system DPI scaling.
 *
 * This function combines browser zoom detection with system DPI information to provide
 * a complete picture of all scaling factors affecting element rendering. It distinguishes
_DOC_
 * between user-controlled browser zoom and system-level DPI scaling, which is crucial
 * for accurate positioning and interaction calculations.
 *
 * @returns {Object} A comprehensive zoom information object containing:
 *   - systemDpiScale: The system DPI scaling factor (from devicePixelRatio).
 *   - browserZoomFactor: The browser zoom level (user-controlled).
 *   - totalEffectiveZoom: The combined effect of both scaling factors.
 *   - systemDpiScalePercentage: DPI scaling as a percentage string.
 *   - browserZoomFactorPercentage: Browser zoom as a percentage string.
 *   - totalEffectiveZoomPercentage: Total zoom as a percentage string.
 *
 * @example
 * const zoomInfo = getEffectiveZoomInfo();
 * console.log(`System DPI: ${zoomInfo.systemDpiScalePercentage}`);
 * console.log(`Browser Zoom: ${zoomInfo.browserZoomFactorPercentage}`);
 * console.log(`Total Effective: ${zoomInfo.totalEffectiveZoomPercentage}`);
 */
export const getEffectiveZoomInfo = () => {
  // Get the system DPI scaling factor from the browser API.
  // `devicePixelRatio` represents the ratio of physical pixels to CSS pixels.
  // Higher values indicate high-DPI displays (like Retina or 4K screens).
  const systemDpiScale = window.devicePixelRatio || 1; // Fallback for older browsers or environments.

  // Get the browser-specific zoom factor using our custom detection method.
  // This is independent of system DPI and represents user-initiated zoom actions.
  const browserZoomFactor = getBrowserZoomFactor();

  // Calculate the total effective zoom by combining both factors.
  // This represents the overall scaling effect on rendered elements.
  const totalEffectiveZoom = systemDpiScale * browserZoomFactor;

  // Return comprehensive zoom information with both numeric and percentage formats.
  // Percentage strings are useful for display and logging purposes.
  return {
    // Raw numeric values for calculations.
    systemDpiScale: systemDpiScale,
    browserZoomFactor: browserZoomFactor,
    totalEffectiveZoom: totalEffectiveZoom,

    // Human-readable percentage strings for display and debugging.
    systemDpiScalePercentage: `${(systemDpiScale * 100).toFixed(0)}%`,
    browserZoomFactorPercentage: `${(browserZoomFactor * 100).toFixed(0)}%`,
    totalEffectiveZoomPercentage: `${(totalEffectiveZoom * 100).toFixed(0)}%`
  };
}
