/**
 * calculate distance between selected node and matching node
 * @param1: recorded node
 * @param2: comparing node
 */
export const getDistance = (node1, node2) => {
  let dist;
  if (node1.hasOwnProperty('screenSize') && node2.hasOwnProperty('screenSize')) {
    let x, y;
    if (node1.screenSize.screen.width > node2.screenSize.screen.width) {
      x = node1.nodePagePosition.left - (node2.nodePagePosition.left * (node2.screenSize.screen.width / node1.screenSize.screen.width));
      y = node1.nodePagePosition.top - (node2.nodePagePosition.top * (node2.screenSize.screen.height / node1.screenSize.screen.height));
    } else if (node1.screenSize.screen.width < node2.screenSize.screen.width) {
      x = (node1.nodePagePosition.left * (node2.screenSize.screen.width / node1.screenSize.screen.width)) - node2.nodePagePosition.left;
      y = (node1.nodePagePosition.top * (node2.screenSize.screen.height / node1.screenSize.screen.height)) - node2.nodePagePosition.top;
    } else {
      x = node1.nodePagePosition.left - node2.nodePagePosition.left;
      y = node1.nodePagePosition.top - node2.nodePagePosition.top;
    }
    dist = Math.abs(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
  } else {
    const x = node1.nodePosition.x - node2.nodePosition.x;
    const y = node1.nodePosition.y - node2.nodePosition.y;
    dist = Math.abs(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
  }
  return dist;
};
