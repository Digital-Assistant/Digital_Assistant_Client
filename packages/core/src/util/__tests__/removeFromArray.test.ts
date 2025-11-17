
import { removeFromArray } from '../removeFromArray';

describe('removeFromArray', () => {
  it('should remove from array', () => {
    const arr = [1, 2, 3];
    const newArr = removeFromArray(arr, 2);
    expect(newArr).toEqual([1, 3]);
  });
});
