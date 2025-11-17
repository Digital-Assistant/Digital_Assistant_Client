
import { compareNodes } from '../compareNodes';

describe('compareNodes', () => {
  it('should compare nodes', () => {
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    const result = compareNodes(element1, element2);
    expect(result).toBeDefined();
  });
});
