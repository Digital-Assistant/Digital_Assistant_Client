
import { removeFrameWorkAttributes } from '../removeFrameWorkAttributes';

describe('removeFrameWorkAttributes', () => {
  it('should remove framework attributes', () => {
    const element = document.createElement('div');
    element.setAttribute('data-test', 'test');
    const newElement: any = removeFrameWorkAttributes(element);
    expect(newElement.hasAttribute('data-test')).toBe(false);
  });
});
