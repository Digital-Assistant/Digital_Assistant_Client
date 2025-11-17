
import { initSpecialNodes } from '../initSpecialNodes';

describe('initSpecialNodes', () => {
  it('should initialize special nodes', () => {
    const specialNodes = initSpecialNodes();
    expect(specialNodes).toBeDefined();
  });
});
