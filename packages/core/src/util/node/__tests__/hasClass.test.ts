
import { hasClass } from '../hasClass';

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
});
