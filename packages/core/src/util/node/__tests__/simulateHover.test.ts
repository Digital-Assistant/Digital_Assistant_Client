
import { simulateHover } from '../simulateHover';

describe('simulateHover', () => {
  it('should trigger a mouseover event on the element', () => {
    const element = document.createElement('div');
    const handler = jest.fn();
    element.addEventListener('mouseover', handler);

    simulateHover(element);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not throw an error if the element is null', () => {
    expect(() => simulateHover(null)).not.toThrow();
  });
});
