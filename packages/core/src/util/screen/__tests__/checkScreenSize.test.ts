
import { checkScreenSize } from '../checkScreenSize';

describe('checkScreenSize', () => {
  it('should check screen size', () => {
    // @ts-ignore
      const result = checkScreenSize({ width: 100, height: 100 });
    expect(result).toBeDefined();
  });
});
