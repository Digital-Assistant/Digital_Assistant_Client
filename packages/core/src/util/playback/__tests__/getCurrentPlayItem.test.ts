
import { getCurrentPlayItem } from '../getCurrentPlayItem';

describe('getCurrentPlayItem', () => {
  it('should get current play item', () => {
    const item = getCurrentPlayItem();
    expect(item).toBeDefined();
  });
});
