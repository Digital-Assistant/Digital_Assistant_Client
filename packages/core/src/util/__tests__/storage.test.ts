/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file Unit tests for the StorageUtil class.
 */

// Mock the detect-browser module to ensure enablePlugin is true in storage.ts
jest.mock('detect-browser', () => ({
  detect: () => ({ name: 'chrome' }),
}));

// Mock the global chrome object BEFORE importing the module that uses it.
const mockBrowserStorage = (() => {
  let store: { [key: string]: any } = {};
  return {
    local: {
      get: jest.fn((keys: string[]) => Promise.resolve(keys.reduce((acc, key) => ({ ...acc, [key]: store[key] }), {}))),
      set: jest.fn((items: { [key: string]: any }) => {
        store = { ...store, ...items };
        return Promise.resolve();
      }),
      remove: jest.fn((keys: string[]) => {
        keys.forEach(key => {
          delete store[key];
        });
        return Promise.resolve();
      }),
      clear: () => {
        store = {};
      },
    },
  };
})();

(global as any).chrome = {
  storage: mockBrowserStorage,
};

// Now, import the module to be tested.
import { StorageUtil } from '../storage';

// Mock browser's native localStorage
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('StorageUtil', () => {
  const key = 'testKey';
  const data = { message: 'testData' };

  afterEach(() => {
    // Reset mocks and flags after each test
    mockLocalStorage.clear();
    mockBrowserStorage.local.clear();
    (mockBrowserStorage.local.set as jest.Mock).mockClear();
    (mockBrowserStorage.local.get as jest.Mock).mockClear();
    (mockBrowserStorage.local.remove as jest.Mock).mockClear();
    StorageUtil.UDABrowserPlugin = false;
  });

  // --- LocalStorage Tests ---
  describe('with localStorage (UDABrowserPlugin = false)', () => {
    beforeEach(() => {
        StorageUtil.UDABrowserPlugin = false;
    });

    it('should add data to localStorage', async () => {
      await StorageUtil.add(data, key);
      const storedData = window.localStorage.getItem(key);
      expect(storedData).toEqual(JSON.stringify(data));
    });

    it('should get data from localStorage', async () => {
      window.localStorage.setItem(key, JSON.stringify(data));
      const retrievedData = await StorageUtil.get(key);
      expect(retrievedData).toEqual(data);
    });

    it('should return null if data does not exist in localStorage', async () => {
      const retrievedData = await StorageUtil.get('nonExistentKey');
      expect(retrievedData).toBeNull();
    });

    it('should remove data from localStorage', async () => {
      window.localStorage.setItem(key, JSON.stringify(data));
      await StorageUtil.remove(key);
      const storedData = window.localStorage.getItem(key);
      expect(storedData).toBeNull();
    });
  });

  // --- Browser Extension Storage Tests ---
  describe('with browser extension storage (UDABrowserPlugin = true)', () => {
    beforeEach(() => {
      StorageUtil.UDABrowserPlugin = true;
    });

    it('should add data to browser storage', async () => {
      await StorageUtil.add(data, key);
      expect(mockBrowserStorage.local.set).toHaveBeenCalledWith({ [key]: data });
    });

    it('should get data from browser storage', async () => {
      await StorageUtil.add(data, key); // Use add to populate the store
      const retrievedData = await StorageUtil.get(key);
      expect(mockBrowserStorage.local.get).toHaveBeenCalledWith([key]);
      expect(retrievedData).toEqual(data);
    });

    it('should return undefined if data does not exist in browser storage', async () => {
      const retrievedData = await StorageUtil.get('nonExistentKey');
      expect(mockBrowserStorage.local.get).toHaveBeenCalledWith(['nonExistentKey']);
      expect(retrievedData).toBeUndefined();
    });

    it('should remove data from browser storage', async () => {
      await StorageUtil.add(data, key); // Add data first
      await StorageUtil.remove(key);
      expect(mockBrowserStorage.local.remove).toHaveBeenCalledWith([key]);
      const result = await StorageUtil.get(key);
      expect(result).toBeUndefined(); // Verify it was removed
    });
  });
});
