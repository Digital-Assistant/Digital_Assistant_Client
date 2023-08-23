/**
 * To get screen/window size
 * @returns object
 */
export const getScreenSize = () => {
  let page = {height: 0, width: 0};
  let screen = {height: 0, width: 0};
  let body = document.body,
      html = document.documentElement;

  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  let resolution = {height: 0, width: 0};

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
  if (window.innerWidth !== undefined) {
    screen.width = window.innerWidth * 0.75;
    screen.height = window.innerHeight;
  } else {
    const D = document.documentElement;
    screen.width = D.clientWidth;
    screen.height = D.clientHeight * 0.75;
  }
  resolution.height = window.screen.height;
  resolution.width = window.screen.width;
  let windowProperties = {
    page: page,
    screen: screen,
    scrollInfo: {scrollTop: scrollTop, scrollLeft: scrollLeft},
    resolution,
  };
  return windowProperties;
};
