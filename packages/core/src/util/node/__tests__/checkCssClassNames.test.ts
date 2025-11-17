
import { checkCssClassNames } from '../checkCssClassNames';

describe('checkCssClassNames', () => {
  it('should check css class names', () => {
    const element = document.createElement('div');
    element.className = 'test';
    const result = checkCssClassNames(element);
    expect(result).toBe(true);
  });
});
