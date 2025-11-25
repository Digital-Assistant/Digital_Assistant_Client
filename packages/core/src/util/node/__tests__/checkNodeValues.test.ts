
import { checkNodeValues } from '../checkNodeValues';
import { specialNodes } from '../../specialNodes';

// Mock the specialNodes configuration
jest.mock('../../specialNodes', () => ({
  specialNodes: {
    'special-check': {
      tagName: 'BUTTON',
    },
  },
}));

describe('checkNodeValues', () => {
  it('should return true for a div with matching text content', () => {
    const element = document.createElement('div');
    element.textContent = 'test';
    expect(checkNodeValues(element, 'test')).toBe(true);
  });

  it('should return false for a div with non-matching text content', () => {
    const element = document.createElement('div');
    element.textContent = 'other';
    expect(checkNodeValues(element, 'test')).toBe(false);
  });

  it('should return true for an input with a matching value', () => {
    const element = document.createElement('input');
    element.value = 'test';
    expect(checkNodeValues(element, 'test')).toBe(true);
  });

  it('should return false for an input with a non-matching value', () => {
    const element = document.createElement('input');
    element.value = 'other';
    expect(checkNodeValues(element, 'test')).toBe(false);
  });

  it('should return true for a node with a matching data-qa attribute', () => {
    const element = document.createElement('div');
    element.setAttribute('data-qa', 'test');
    expect(checkNodeValues(element, 'test')).toBe(true);
  });

  it('should return false for a node with a non-matching data-qa attribute', () => {
    const element = document.createElement('div');
    element.setAttribute('data-qa', 'other');
    expect(checkNodeValues(element, 'test')).toBe(false);
  });

  it('should return false for a node with no matching values', () => {
    const element = document.createElement('div');
    expect(checkNodeValues(element, 'test')).toBe(false);
  });

  it('should fall back to other checks if specialNodes check fails', () => {
    const element = document.createElement('div');
    element.textContent = 'special-check';
    expect(checkNodeValues(element, 'special-check')).toBe(true);
  });
});
