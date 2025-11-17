
import { getLabelsForInputElement } from '../getLabelsForInputElement';

describe('getLabelsForInputElement', () => {
  it('should get labels for input element', () => {
    const element = document.createElement('input');
    const labels = getLabelsForInputElement(element);
    expect(labels).toBeDefined();
  });
});
