import { isHighlightNode } from '../util/checkNode';

describe('isHighlightNode', () => {
  it('should return true for a valid highlight node', () => {
    const nodeData = {
      meta: {
        selectedElement: {
          systemTag: 'highlight'
        }
      }
    };
    expect(isHighlightNode(nodeData)).toBe(true);
  });

  it('should return false for a node without meta property', () => {
    const nodeData = {};
    expect(isHighlightNode(nodeData)).toBe(false);
  });

  it('should return false for a node without selectedElement property', () => {
    const nodeData = {
      meta: {}
    };
    expect(isHighlightNode(nodeData)).toBe(false);
  });

  it('should return false for a node with non-highlight systemTag', () => {
    const nodeData = {
      meta: {
        selectedElement: {
          systemTag: 'not-highlight'
        }
      }
    };
    expect(isHighlightNode(nodeData)).toBe(false);
  });

  it('should return false for a node with empty systemTag', () => {
    const nodeData = {
      meta: {
        selectedElement: {
          systemTag: ''
        }
      }
    };
    expect(isHighlightNode(nodeData)).toBe(false);
  });

  it('should return true for a node with trimmed highlight systemTag', () => {
    const nodeData = {
      meta: {
        selectedElement: {
          systemTag: '  highlight  '
        }
      }
    };
    expect(isHighlightNode(nodeData)).toBe(true);
  });

  it('should return false for a node with null selectedElement', () => {
    const nodeData = {
      meta: {
        selectedElement: null
      }
    };
    expect(isHighlightNode(nodeData)).toBe(false);
  });
});


describe('isHighlightNode', () => {
  // Existing test cases...

  it('should return false for a node with undefined meta', () => {
    const nodeData = { meta: undefined };
    expect(isHighlightNode(nodeData)).toBe(false);
  });

  it('should return false for a node with null meta', () => {
    const nodeData = { meta: null };
    expect(isHighlightNode(nodeData)).toBe(false);
  });

  it('should return false for a node with non-object meta', () => {
    const nodeData = { meta: 'string' };
    expect(isHighlightNode(nodeData)).toBe(false);
  });

  it('should return false for a node with undefined selectedElement', () => {
    const nodeData = { meta: { selectedElement: undefined } };
    expect(isHighlightNode(nodeData)).toBe(false);
  });

  it('should return false for a node with non-object selectedElement', () => {
    const nodeData = { meta: { selectedElement: 'string' } };
    expect(isHighlightNode(nodeData)).toBe(false);
  });

  it('should return false for a node with undefined systemTag', () => {
    const nodeData = { meta: { selectedElement: { systemTag: undefined } } };
    expect(isHighlightNode(nodeData)).toBe(false);
  });

  it('should return false for a node with null systemTag', () => {
    const nodeData = { meta: { selectedElement: { systemTag: null } } };
    expect(isHighlightNode(nodeData)).toBe(false);
  });

  it('should return false for a node with non-string systemTag', () => {
    const nodeData = { meta: { selectedElement: { systemTag: 123 } } };
    expect(isHighlightNode(nodeData)).toBe(false);
  });

  it('should return false for a node with case-sensitive "Highlight" systemTag', () => {
    const nodeData = { meta: { selectedElement: { systemTag: 'Highlight' } } };
    expect(isHighlightNode(nodeData)).toBe(false);
  });

  it('should return true for a node with mixed-case "HiGhLiGhT" systemTag', () => {
    const nodeData = { meta: { selectedElement: { systemTag: 'HiGhLiGhT' } } };
    expect(isHighlightNode(nodeData)).toBe(true);
  });

  it('should return false for a node with "highlight" as a substring', () => {
    const nodeData = { meta: { selectedElement: { systemTag: 'not-highlight-node' } } };
    expect(isHighlightNode(nodeData)).toBe(false);
  });

  it('should return false for a deeply nested node without highlight', () => {
    const nodeData = {
      meta: {
        selectedElement: {
          child: {
            grandchild: {
              systemTag: 'highlight'
            }
          }
        }
      }
    };
    expect(isHighlightNode(nodeData)).toBe(false);
  });

  it('should return false for an empty object', () => {
    expect(isHighlightNode({})).toBe(false);
  });

  it('should return false for null input', () => {
    expect(isHighlightNode(null)).toBe(false);
  });

  it('should return false for undefined input', () => {
    expect(isHighlightNode(undefined)).toBe(false);
  });
});
