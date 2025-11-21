
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

  it('should return false for an empty array', () => {
    const arr: any[] = [];
    expect(inArray(arr, 4)).toBe(false);
  });

  it('should return true if string value is in array', () => {
    const arr = ['a', 'b', 'c'];
    expect(inArray(arr, 'b')).toBe(true);
  });

  it('should return false if string value is not in array', () => {
    const arr = ['a', 'b', 'c'];
    expect(inArray(arr, 'd')).toBe(false);
  });

  it('should return true if value is in mixed array', () => {
    const arr = [1, 'b', 3];
    expect(inArray(arr, 'b')).toBe(true);
  });
});
