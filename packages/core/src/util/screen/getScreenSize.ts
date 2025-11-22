/**
 * Retrieves comprehensive screen and window size information, including:
 * - The full document size (including scrollable content).
 * - The original, unscaled viewport dimensions.
 * - The available content area after accounting for a 25% width plugin (for tooltip placement, etc.).
 * - Scroll information.
 * - Physical screen resolution.
 *
 * @returns An object containing various screen and window dimensions.
 */
export const getScreenSize = (): any => {
  let page = {height: 0, width: 0}; // Represents the full document size.
  let viewport = {height: 0, width: 0}; // Represents the original, unscaled visible window area.
  let availableContentArea = {height: 0, width: 0}; // Viewport adjusted for a plugin (e.g., sidebar).
  let body = document.body,
      html = document.documentElement;

  const docEl = document.documentElement;
  // Get current scroll positions.
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  let physicalScreen = {height: 0, width: 0}; // Represents the physical screen resolution.

  // Calculate the full document size (including scrollable content).
  page.height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
  );
  page.width = Math.max(
      body.scrollWidth,
      body.offsetWidth,
      html.clientWidth,
      html.scrollWidth,
      html.offsetWidth
  );

  // Get the original viewport size (visible window area).
  if (window.innerWidth !== undefined) {
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;
  } else {
    // Fallback for older browsers.
    const D = document.documentElement;
    viewport.width = D.clientWidth;
    viewport.height = D.clientHeight;
  }

  // Calculate the available content area, assuming a plugin takes up 25% of the width.
  // The height is not scaled.
  availableContentArea.width = viewport.width * 0.75;
  availableContentArea.height = viewport.height;

  // Get the physical screen resolution.
  physicalScreen.height = window.screen.height;
  physicalScreen.width = window.screen.width;

  // Compile all collected properties into a single object.
  const windowProperties: any = {
    page: page, // Full document size (including scrollable content).
    viewport: viewport, // Original, unscaled visible window area.
    availableContentArea: availableContentArea, // Viewport adjusted for plugin (width scaled by 0.75).
    scrollInfo: {scrollTop: scrollTop, scrollLeft: scrollLeft}, // Current scroll positions.
    screen: physicalScreen, // Physical screen resolution.
  };
  return windowProperties;
};
