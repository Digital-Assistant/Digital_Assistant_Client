
import { processDistanceOfNodes } from '../processDistanceOfNodes';

describe('processDistanceOfNodes', () => {
  it('should process distance of nodes', () => {
    const nodes = [document.createElement('div'), document.createElement('div')];
    const result = processDistanceOfNodes(nodes, nodes[0]);
    expect(result).toBeDefined();
  });
});
