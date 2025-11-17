
import { getScreenSize } from '../getScreenSize';

describe('getScreenSize', () => {
  it('should get screen size', () => {
    const size = getScreenSize();
    expect(size).toBeDefined();
  });
});
