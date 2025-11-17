
import { isHighlightNode } from '../checkNode';

describe('checkNode', () => {
  it('should check node', () => {
    const element = document.createElement('div');
    const result = isHighlightNode(element);
    expect(result).toBeDefined();
  });
});
