
import { isHighlightNode } from '../checkNode';

describe('isHighlightNode', () => {
  it('should return true for a highlight node', () => {
    const nodeData = {
      meta: {
        selectedElement: {
          systemTag: 'highlight'
        }
      }
    };
    expect(isHighlightNode(nodeData)).toBe(true);
  });

  it('should return true for a highlight node with leading/trailing spaces in systemTag', () => {
    const nodeData = {
      meta: {
        selectedElement: {
          systemTag: '  highlight  '
        }
      }
    };
    expect(isHighlightNode(nodeData)).toBe(true);
  });

  it('should return undefined if systemTag is not "highlight"', () => {
    const nodeData = {
      meta: {
        selectedElement: {
          systemTag: 'other'
        }
      }
    };
    expect(isHighlightNode(nodeData)).toBeUndefined();
  });

  it('should return undefined if selectedElement is missing', () => {
    const nodeData = {
      meta: {}
    };
    expect(isHighlightNode(nodeData)).toBeUndefined();
  });

  it('should return undefined if meta is missing', () => {
    const nodeData = {};
    expect(isHighlightNode(nodeData)).toBeUndefined();
  });

  it('should return undefined if nodeData is null or undefined', () => {
    expect(isHighlightNode(null)).toBeUndefined();
    expect(isHighlightNode(undefined)).toBeUndefined();
  });
});
