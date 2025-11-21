
import { StorageUtil } from '../storage';

describe('StorageUtil', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should be defined', () => {
    expect(StorageUtil).toBeDefined();
  });

  it('should set and get an item', () => {
    StorageUtil.set('testKey', 'testValue');
    expect(StorageUtil.get('testKey')).toBe('testValue');
  });

  it('should return null for a non-existent item', () => {
    expect(StorageUtil.get('nonExistentKey')).toBeNull();
  });

  it('should remove an item', () => {
    StorageUtil.set('testKey', 'testValue');
    StorageUtil.remove('testKey');
    expect(StorageUtil.get('testKey')).toBeNull();
  });

  it('should clear all items', () => {
    StorageUtil.set('testKey1', 'testValue1');
    StorageUtil.set('testKey2', 'testValue2');
    StorageUtil.clear();
    expect(StorageUtil.get('testKey1')).toBeNull();
    expect(StorageUtil.get('testKey2')).toBeNull();
  });

  it('should handle setting and getting complex objects', () => {
    const testObject = { a: 1, b: { c: 'test' } };
    StorageUtil.set('complexKey', JSON.stringify(testObject));
    const retrievedObject = JSON.parse(StorageUtil.get('complexKey') as string);
    expect(retrievedObject).toEqual(testObject);
  });
});
