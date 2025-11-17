
import { simulateMouseLeave } from '../simulateMouseLeave';

describe('simulateMouseLeave', () => {
  it('should simulate mouse leave', () => {
    const element = document.createElement('div');
    simulateMouseLeave(element);
  });
});
