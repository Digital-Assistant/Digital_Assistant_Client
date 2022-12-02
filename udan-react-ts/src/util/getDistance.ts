/**
 * calculate distance between selected node and matching node
 * @param1: recorded node
 * @param2: comparing node
 */
export const getDistance = (node1, node2) => {
  let dist;
  if (node1.hasOwnProperty('screen') && node2.hasOwnProperty('screen')) {
    if (node1.screen.width >= node2.screen.width) {


    } else {
      const x = node1.nodePagePosition.left - node2.nodePagePosition.left;
      const y = node1.nodePagePosition.top - node2.nodePagePosition.top;
      dist = Math.abs(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    }
  } else {
    const x = node1.nodePosition.x - node2.nodePosition.x;
    const y = node1.nodePosition.y - node2.nodePosition.y;
    dist = Math.abs(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
  }
  return dist;
};
