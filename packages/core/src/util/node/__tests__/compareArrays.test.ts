
import { compareArrays } from '../compareArrays';

describe('compareArrays', () => {
  it('should return true for equal arrays of numbers', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    expect(compareArrays(arr1, arr2)).toBe(true);
  });

  it('should return false for unequal arrays of numbers', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 4];
    expect(compareArrays(arr1, arr2)).toBe(false);
  });

  it('should return true for equal arrays of strings', () => {
    const arr1 = ['a', 'b', 'c'];
    const arr2 = ['a', 'b', 'c'];
    expect(compareArrays(arr1, arr2)).toBe(true);
  });

  it('should return false for arrays of different lengths', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2];
    expect(compareArrays(arr1, arr2)).toBe(false);
  });

  it('should return true for equal empty arrays', () => {
    const arr1: any[] = [];
    const arr2: any[] = [];
    expect(compareArrays(arr1, arr2)).toBe(true);
  });

  it('should return true for equal arrays of objects', () => {
    const arr1 = [{ a: 1 }, { b: 2 }];
    const arr2 = [{ a: 1 }, { b: 2 }];
    expect(compareArrays(arr1, arr2)).toBe(true);
  });

  it('should return false for unequal arrays of objects', () => {
    const arr1 = [{ a: 1 }, { b: 2 }];
    const arr2 = [{ a: 1 }, { b: 3 }];
    expect(compareArrays(arr1, arr2)).toBe(false);
  });
});
