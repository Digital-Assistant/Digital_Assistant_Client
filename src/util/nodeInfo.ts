export const getNodeInfo = (node: HTMLElement) => {
  const screenSize = getScreenSize();
  const nodePosition = node.getBoundingClientRect();
  const pagePosition = getNodeCoordinates(node, screenSize);
  const nodeInfo = {nodePosition: nodePosition, screenSize: screenSize, nodePagePosition: pagePosition};
  return nodeInfo;
}


export const getScreenSize = () => {
  let page = {height: 0, width: 0};
  let screen = {};
  let body = document.body,
      html = document.documentElement;

  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  page.height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
  page.width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
  screen = window.screen;
  let windowProperties = {page: page, screen: screen, scrollInfo: {scrollTop: scrollTop, scrollLeft: scrollLeft}};
  return windowProperties;
}

export const getNodeCoordinates = (element, windowSize) => {
  const x = element.getBoundingClientRect();
  let result = {
    top: x.top + windowSize.scrollInfo.scrollTop,
    width: x.width,
    height: x.height,
    left: x.left + windowSize.scrollInfo.scrollLeft,
    actualPos: x
  };
  return result;
}
