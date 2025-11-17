
import { searchNodes } from '../searchNodes';

describe('searchNodes', () => {
  it('should search nodes', () => {
    const nodes = searchNodes({}, document.body);
    expect(nodes).toBeDefined();
  });
});
