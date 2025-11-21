
import { checkNodeObjectKeyValue } from '../checkNodeObjectKeyValue';

describe('checkNodeObjectKeyValue', () => {
  it('should return true if the attribute value matches', () => {
    const element = document.createElement('div');
    element.setAttribute('data-qa', 'test-value');
    const result = checkNodeObjectKeyValue(element, 'data-qa', ['test-value'], 'test-value');
    expect(result).toBe(true);
  });

  it('should return false if the attribute value does not match', () => {
    const element = document.createElement('div');
    element.setAttribute('data-qa', 'other-value');
    const result = checkNodeObjectKeyValue(element, 'data-qa', ['test-value'], 'test-value');
    expect(result).toBe(false);
  });

  it('should return false if the attribute does not exist', () => {
    const element = document.createElement('div');
    const result = checkNodeObjectKeyValue(element, 'data-qa', ['test-value'], 'test-value');
    expect(result).toBe(false);
  });

  it('should return true for a matching class name', () => {
    const element = document.createElement('div');
    element.className = 'test-class';
    const result = checkNodeObjectKeyValue(element, 'className', ['test-class'], 'test-class');
    expect(result).toBe(true);
  });

  it('should return false for a non-matching class name', () => {
    const element = document.createElement('div');
    element.className = 'other-class';
    const result = checkNodeObjectKeyValue(element, 'className', ['test-class'], 'test-class');
    expect(result).toBe(false);
  });

  it('should return true for a matching text content', () => {
    const element = document.createElement('div');
    element.textContent = 'test-content';
    const result = checkNodeObjectKeyValue(element, 'textContent', ['test-content'], 'test-content');
    expect(result).toBe(true);
  });
});
