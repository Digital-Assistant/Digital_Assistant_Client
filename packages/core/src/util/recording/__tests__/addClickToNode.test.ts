
import { addClickToNode } from '../addClickToNode';

describe('addClickToNode', () => {
  it('should add click to node', () => {
    const element = document.createElement('div');
    addClickToNode(element);
  });
});
