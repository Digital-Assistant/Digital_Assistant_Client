
import { inArray } from '../inArray';

describe('inArray', () => {
  it('should return true if value is in array', () => {
    const arr = [1, 2, 3];
    expect(inArray(2, arr)).toBe(true); // Swapped arguments
  });

  it('should return false if value is not in array', () => {
    const arr = [1, 2, 3];
    expect(inArray(4, arr)).toBe(false); // Swapped arguments
  });

  it('should return false for an empty array', () => {
    const arr: any[] = [];
    expect(inArray(4, arr)).toBe(false); // Swapped arguments
  });

  it('should return true if string value is in array', () => {
    const arr = ['a', 'b', 'c'];
    expect(inArray('b', arr)).toBe(true); // Swapped arguments
  });

  it('should return false if string value is not in array', () => {
    const arr = ['a', 'b', 'c'];
    expect(inArray('d', arr)).toBe(false); // Swapped arguments
  });

  it('should return true if value is in mixed array', () => {
    const arr = [1, 'b', 3];
    expect(inArray('b', arr)).toBe(true); // Swapped arguments
  });
});
