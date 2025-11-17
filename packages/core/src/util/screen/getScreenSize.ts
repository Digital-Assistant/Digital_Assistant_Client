/**
 * To get screen/window size and other related properties,
 * including the full viewport and the available content area
 * after accounting for a 25% width plugin (for tooltip placement, etc.).
 * @returns object
 */
export const getScreenSize = () => {
  let page = {height: 0, width: 0};
  let viewport = {height: 0, width: 0}; // Original, unscaled viewport dimensions
  let availableContentArea = {height: 0, width: 0}; // Viewport adjusted for plugin
  let body = document.body,
      html = document.documentElement;

  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  let physicalScreen = {height: 0, width: 0}; // Physical screen resolution

  // Calculate full document size (including scrollable content)
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

  // Get original viewport size (visible window area)
  if (window.innerWidth !== undefined) {
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;
  } else {
    const D = document.documentElement;
    viewport.width = D.clientWidth;
    viewport.height = D.clientHeight;
  }

  // Calculate available content area (viewport minus plugin space)
  // This is derived from the original viewport, applying the 0.75 width scaling.
  availableContentArea.width = viewport.width * 0.75;
  availableContentArea.height = viewport.height; // Height is NOT scaled

  // Get physical screen resolution
  physicalScreen.height = window.screen.height;
  physicalScreen.width = window.screen.width;

  const windowProperties = {
    page: page, // Full document size (including scrollable content)
    viewport: viewport, // Original, unscaled visible window area
    availableContentArea: availableContentArea, // Viewport adjusted for plugin (width scaled by 0.75)
    scrollInfo: {scrollTop: scrollTop, scrollLeft: scrollLeft},
    screen: physicalScreen, // Physical screen resolution
  };
  return windowProperties;
};
