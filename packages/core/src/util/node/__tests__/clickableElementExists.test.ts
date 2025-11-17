
import { clickableElementExists } from '../clickableElementExists';

describe('clickableElementExists', () => {
  it('should return true if clickable element exists', () => {
    const element = document.createElement('button');
    document.body.appendChild(element);
    const result = clickableElementExists(element);
    expect(result).toBe(true);
  });
});
