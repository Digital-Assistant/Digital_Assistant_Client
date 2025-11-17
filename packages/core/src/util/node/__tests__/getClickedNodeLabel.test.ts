
import { getClickedNodeLabel } from '../getClickedNodeLabel';

describe('getClickedNodeLabel', () => {
  it('should get clicked node label', () => {
    const element = document.createElement('div');
    const label = getClickedNodeLabel(element);
    expect(label).toBeDefined();
  });
});
