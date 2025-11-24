
// Import the function to be tested and the configuration it uses
import { checkNodeValues } from '../node/checkNodeValues';

// Mock the specialNodes to isolate the test
jest.mock('../specialNodes', () => ({
  specialNodes: {
    specialNodes: { // This nested specialNodes is correct, as per the structure of specialNodes.ts
      tags: ['fusioncharts'],
      classes: ['special-class'],
      attributes: ['data-special'],
    },
  },
}));

describe('isSpecialNode (via checkNodeValues)', () => {
  it('should return true for a node with a special tag', () => {
    const element = document.createElement('fusioncharts');
    // We are testing the 'specialNodes' case within checkNodeValues
    expect(checkNodeValues(element, 'specialNodes')).toBe(true);
  });

  it('should return true for a node with a special class', () => {
    const element = document.createElement('div');
    element.classList.add('special-class');
    expect(checkNodeValues(element, 'specialNodes')).toBe(true);
  });

  it('should return true for a node with a special attribute', () => {
    const element = document.createElement('div');
    element.setAttribute('data-special', 'true');
    expect(checkNodeValues(element, 'specialNodes')).toBe(true);
  });

  it('should return false for a node that is not special', () => {
    const element = document.createElement('div');
    expect(checkNodeValues(element, 'specialNodes')).toBe(false);
  });

  it('should return false for a null or undefined node', () => {
    expect(checkNodeValues(null, 'specialNodes')).toBe(false);
    expect(checkNodeValues(undefined, 'specialNodes')).toBe(false);
  });
});
