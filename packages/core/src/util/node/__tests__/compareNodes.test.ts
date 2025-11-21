
import { compareNodes } from '../compareNodes';
import { nodeConfig } from '../nodeConfig';

describe('compareNodes', () => {
  beforeAll(() => {
    // Mocking window.udaSpecialNodes
    (window as any).udaSpecialNodes = {
      ignoreDuringCompare: {
        attributes: []
      }
    };
    (window as any).UDAGlobalConfig = {
        enableForAllDomains: false
    };
  });

  it('should return a full match for identical nodes', () => {
    const node1 = { a: 1, b: 'test' };
    const node2 = { a: 1, b: 'test' };
    const result = compareNodes(node1, node2);
    expect(result.matched).toBe(result.count);
    expect(result.unmatched).toHaveLength(0);
  });

  it('should return a partial match for similar nodes', () => {
    const node1 = { a: 1, b: 'test' };
    const node2 = { a: 1, b: 'testing' };
    const result = compareNodes(node1, node2);
    expect(result.matched).toBe(1);
    expect(result.unmatched).toHaveLength(1);
  });

  it('should handle nested objects', () => {
    const node1 = { a: 1, nested: { c: 3 } };
    const node2 = { a: 1, nested: { c: 3 } };
    const result = compareNodes(node1, node2);
    expect(result.matched).toBe(result.count);
  });

  it('should use Jaro-Winkler for className', () => {
    const node1 = { className: 'test-class-one' };
    const node2 = { className: 'test-class-two' };
    // Jaro-Winkler should be high enough to match
    const result = compareNodes(node1, node2);
    expect(result.matched).toBe(1);
  });

  it('should give extra weight to innerText matches', () => {
    const node1 = { innerText: 'hello' };
    const node2 = { innerText: 'hello' };
    const result = compareNodes(node1, node2);
    expect(result.matched).toBe(1 + nodeConfig.innerTextWeight);
    expect(result.innerTextFlag).toBe(true);
  });

  it('should handle the isPersonalNode flag', () => {
    const node1 = { innerText: 'some text', src: 'image.png' };
    const node2 = { innerText: 'different text', src: 'other.png' };
    const result = compareNodes(node1, node2, true);
    // innerText and src are in personalNodeIgnoreAttributes, so they should match
    expect(result.matched).toBe(2 + nodeConfig.innerTextWeight);
  });

  it('should ignore specified attributes', () => {
    (window as any).udaSpecialNodes.ignoreDuringCompare.attributes.push('style');
    const node1 = { style: 'color: red', a: 1 };
    const node2 = { style: 'color: blue', a: 1 };
    const result = compareNodes(node1, node2);
    expect(result.count).toBe(1); // only 'a' is counted
    expect(result.matched).toBe(1);
    (window as any).udaSpecialNodes.ignoreDuringCompare.attributes.pop();
  });
});
