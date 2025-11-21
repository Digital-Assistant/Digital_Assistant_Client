
import { specialNodes } from '../specialNodes';

describe('specialNodes', () => {
  it('should be defined', () => {
    expect(specialNodes).toBeDefined();
  });

  it('should identify a special node by data-qa attribute', () => {
    const element = document.createElement('div');
    element.setAttribute('data-qa', 'some-value');
    expect(specialNodes.isSpecialNode(element)).toBe(true);
  });

  it('should identify a special node by id containing "live-player"', () => {
    const element = document.createElement('div');
    element.id = 'live-player-container';
    expect(specialNodes.isSpecialNode(element)).toBe(true);
  });

  it('should not identify a regular node as special', () => {
    const element = document.createElement('div');
    expect(specialNodes.isSpecialNode(element)).toBe(false);
  });

  it('should not identify a node with an empty data-qa attribute as special', () => {
    const element = document.createElement('div');
    element.setAttribute('data-qa', '');
    expect(specialNodes.isSpecialNode(element)).toBe(false);
  });
});
