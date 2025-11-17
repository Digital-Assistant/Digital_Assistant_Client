
import { compareArrays } from '../compareArrays';

describe('compareArrays', () => {
  it('should return true for equal arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    expect(compareArrays(arr1, arr2)).toBe(true);
  });

  it('should return false for unequal arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 4];
    expect(compareArrays(arr1, arr2)).toBe(false);
  });
});
