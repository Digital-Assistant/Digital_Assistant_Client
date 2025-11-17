
import { getClickedInputLabels } from '../getClickedInputLabels';

describe('getClickedInputLabels', () => {
  it('should get clicked input labels', () => {
    const element = document.createElement('input');
    const labels = getClickedInputLabels(element);
    expect(labels).toBeDefined();
  });
});
