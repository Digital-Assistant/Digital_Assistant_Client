
import { getObjData } from '../getObjData';

describe('getObjData', () => {
  it('should parse a valid JSON string and return the object', () => {
    const jsonString = '{"key": "value"}';
    const result = getObjData(jsonString);
    expect(result).toEqual({ key: 'value', meta: {} });
  });

  it('should parse a valid JSON string with an existing meta property', () => {
    const jsonString = '{"key": "value", "meta": {"foo": "bar"}}';
    const result = getObjData(jsonString);
    expect(result).toEqual({ key: 'value', meta: { foo: 'bar' } });
  });

  it('should return an empty object for an invalid JSON string', () => {
    const jsonString = '{"key": "value"'; // Invalid JSON
    const result = getObjData(jsonString);
    expect(result).toEqual({});
  });

  it('should return an empty object for a non-JSON string', () => {
    const jsonString = 'just a string';
    const result = getObjData(jsonString);
    expect(result).toEqual({});
  });

  it('should return an empty object for an empty string', () => {
    const result = getObjData('');
    expect(result).toEqual({});
  });

  it('should handle a JSON string representing a non-object (e.g., an array)', () => {
    const jsonString = '[1, 2, 3]';
    const result = getObjData(jsonString);
    // The function is designed to work with objects, so this is expected behavior.
    expect(result).toEqual([1, 2, 3]);
  });
});
