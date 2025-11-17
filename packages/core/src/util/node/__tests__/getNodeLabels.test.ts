
import { getNodeLabels } from '../getNodeLabels';

describe('getNodeLabels', () => {
  it('should get node labels', () => {
    const element = document.createElement('div');
    const labels = getNodeLabels(element, 'test', 0, true, true, false, 3, true);
    expect(labels).toBeDefined();
  });
});
