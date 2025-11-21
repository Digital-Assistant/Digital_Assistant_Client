
import { removeFromArray } from '../removeFromArray';

describe('removeFromArray', () => {
  it('should remove an element from the middle of the array', () => {
    const arr = [1, 2, 3];
    const newArr = removeFromArray(arr, 2);
    expect(newArr).toEqual([1, 3]);
  });

  it('should not modify the array if the element is not found', () => {
    const arr = [1, 2, 3];
    const newArr = removeFromArray(arr, 4);
    expect(newArr).toEqual([1, 2, 3]);
  });

  it('should remove the first element', () => {
    const arr = [1, 2, 3];
    const newArr = removeFromArray(arr, 1);
    expect(newArr).toEqual([2, 3]);
  });

  it('should remove the last element', () => {
    const arr = [1, 2, 3];
    const newArr = removeFromArray(arr, 3);
    expect(newArr).toEqual([1, 2]);
  });

  it('should return an empty array if the original array is empty', () => {
    const arr: any[] = [];
    const newArr = removeFromArray(arr, 1);
    expect(newArr).toEqual([]);
  });

  it('should remove the only element in the array', () => {
    const arr = [1];
    const newArr = removeFromArray(arr, 1);
    expect(newArr).toEqual([]);
  });
});
