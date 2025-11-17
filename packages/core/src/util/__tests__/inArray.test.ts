
import { inArray } from '../inArray';

describe('inArray', () => {
  it('should return true if value is in array', () => {
    const arr = [1, 2, 3];
    expect(inArray(arr, 2)).toBe(true);
  });

  it('should return false if value is not in array', () => {
    const arr = [1, 2, 3];
    expect(inArray(arr, 4)).toBe(false);
  });
});
