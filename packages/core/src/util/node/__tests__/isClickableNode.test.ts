
import { isClickableNode } from '../isClickableNode';

describe('isClickableNode', () => {
  it('should return true for clickable node', () => {
    const element = document.createElement('button');
    expect(isClickableNode(element)).toBe(true);
  });

  it('should return false for non-clickable node', () => {
    const element = document.createElement('div');
    expect(isClickableNode(element)).toBe(false);
  });
});
