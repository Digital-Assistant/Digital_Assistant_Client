
import { simulateHover } from '../simulateHover';

describe('simulateHover', () => {
  it('should simulate hover', () => {
    const element = document.createElement('div');
    simulateHover(element);
  });
});
