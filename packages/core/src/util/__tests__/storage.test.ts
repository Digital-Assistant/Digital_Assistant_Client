
import { StorageUtil } from '../storage';

describe('StorageUtil', () => {
  beforeEach(async () => {
    await StorageUtil.clear();
  });

  it('should be defined', () => {
    expect(StorageUtil).toBeDefined();
  });

  it('should set and get an item', async () => {
    await StorageUtil.add('testValue', 'testKey', false); // Pass false for convertToString
    expect(await StorageUtil.get('testKey', false)).toBe('testValue');
  });

  it('should return null for a non-existent item', async () => {
    expect(await StorageUtil.get('nonExistentKey')).toBeNull();
  });

  it('should remove an item', async () => {
    await StorageUtil.add('testValue', 'testKey', false); // Pass false for convertToString
    await StorageUtil.remove('testKey');
    expect(await StorageUtil.get('testKey')).toBeNull();
  });

  it('should clear all items', async () => {
    await StorageUtil.add('testValue1', 'testKey1', false); // Pass false for convertToString
    await StorageUtil.add('testValue2', 'testKey2', false); // Pass false for convertToString
    await StorageUtil.clear();
    expect(await StorageUtil.get('testKey1')).toBeNull();
    expect(await StorageUtil.get('testKey2')).toBeNull();
  });

  it('should handle setting and getting complex objects', async () => {
    const testObject = { a: 1, b: { c: 'test' } };
    await StorageUtil.add(testObject, 'complexKey');
    const retrievedObject = await StorageUtil.get('complexKey');
    expect(retrievedObject).toEqual(testObject);
  });
});
