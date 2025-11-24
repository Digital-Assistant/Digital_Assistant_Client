
import { hasClass } from '../node/hasClass';

describe('hasClass', () => {
  it('should return true if element has class', () => {
    const element = document.createElement('div');
    element.className = 'test';
    expect(hasClass(element, ['test'])).toBe(true);
  });

  it('should return false if element does not have class', () => {
    const element = document.createElement('div');
    element.className = 'test';
    expect(hasClass(element, ['test2'])).toBe(false);
  });

  it('should return true if element has one of multiple classes', () => {
    const element = document.createElement('div');
    element.className = 'test1 test2';
    expect(hasClass(element, ['test2', 'test3'])).toBe(true);
  });

  it('should return false if element has none of the classes', () => {
    const element = document.createElement('div');
    element.className = 'test1 test2';
    expect(hasClass(element, ['test3', 'test4'])).toBe(false);
  });

  it('should return false for an element with no classes', () => {
    const element = document.createElement('div');
    expect(hasClass(element, ['test'])).toBe(false);
  });

  it('should return false for an empty class array', () => {
    const element = document.createElement('div');
    element.className = 'test';
    expect(hasClass(element, [])).toBe(false);
  });
});
