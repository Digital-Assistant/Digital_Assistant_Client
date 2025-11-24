import { FlowState } from "../flowSlice";

// Mock localStorage and console.error BEFORE importing the slice
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock console.error for graceful error handling tests
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

// Declare variables for reducer and actions at a scope accessible by beforeEach
let reducer: any;
let setSearchKeyword: any;
let setSearchResults: any;
let appendSearchResults: any;
let setPage: any;
let incrementPage: any;
let setHasMorePages: any;
let setReFetchSearch: any;
let setShowSearch: any;
let setRecordSequenceDetailsVisibility: any;
let resetFlowState: any;

describe('flowSlice', () => {
  const defaultInitialState: FlowState = { // Renamed for clarity
    searchKeyword: '',
    searchResults: [],
    page: 0,
    hasMorePages: true,
    reFetchSearch: 'off',
    showSearch: true,
    recordSequenceDetailsVisibility: false,
  };

  // Helper function to get a fresh reducer instance with controlled localStorage
  const getFreshReducer = (localStorageData: string | null = null, throwErrorOnLoad = false) => {
    jest.resetModules(); // Clear module cache
    localStorageMock.clear(); // Clear localStorage mock state
    localStorageMock.getItem.mockClear();
    consoleErrorSpy.mockClear();

    if (throwErrorOnLoad) {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage read error');
      });
    } else {
      localStorageMock.getItem.mockReturnValue(localStorageData);
    }

    const freshModule = require('../flowSlice');
    reducer = freshModule.default;
    setSearchKeyword = freshModule.setSearchKeyword;
    setSearchResults = freshModule.setSearchResults;
    appendSearchResults = freshModule.appendSearchResults;
    setPage = freshModule.setPage;
    incrementPage = freshModule.incrementPage;
    setHasMorePages = freshModule.setHasMorePages;
    setReFetchSearch = freshModule.setReFetchSearch;
    setShowSearch = freshModule.setShowSearch;
    setRecordSequenceDetailsVisibility = freshModule.setRecordSequenceDetailsVisibility;
    resetFlowState = freshModule.resetFlowState;
    return reducer;
  };

  beforeEach(() => {
    // For most tests, we want a clean slate where localStorage is empty
    getFreshReducer(null);
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore(); // Restore console.error after all tests
  });

  it('should return the initial state', () => {
    // This test already uses a fresh reducer with empty localStorage, so it should match defaultInitialState
    expect(reducer(undefined, { type: '' })).toEqual(defaultInitialState);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('flowState');
  });

  it('should load state from localStorage if available', () => {
    const storedState: FlowState = {
      searchKeyword: 'test',
      searchResults: [{ id: 1 }],
      page: 1,
      hasMorePages: false,
      reFetchSearch: 'on',
      showSearch: false,
      recordSequenceDetailsVisibility: true,
    };
    localStorageMock.setItem('flowState', JSON.stringify(storedState));
    
    // Get a fresh reducer instance with the stored state in localStorage
    const loadedReducer = getFreshReducer(JSON.stringify(storedState));
    
    // The reducer's initial state should now be the stored state
    expect(loadedReducer(undefined, { type: '' })).toEqual(storedState);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('flowState');
  });

  it('should handle localStorage errors gracefully when loading state', () => {
    // Get a fresh reducer instance that will throw an error during localStorage load
    const loadedReducer = getFreshReducer(null, true); // Pass true to throwErrorOnLoad
    
    // The reducer's initial state should fall back to default
    expect(loadedReducer(undefined, { type: '' })).toEqual(defaultInitialState);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading flow state from localStorage:', expect.any(Error));
  });

  it('should handle localStorage errors gracefully when saving state', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage write error');
    });
    const state = reducer(defaultInitialState, setSearchKeyword('new keyword'));
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving flow state to localStorage:', expect.any(Error));
    // State should still be updated even if saving fails
    expect(state.searchKeyword).toBe('new keyword');
  });

  it('should handle setSearchKeyword', () => {
    const newState = reducer(defaultInitialState, setSearchKeyword('new keyword'));
    expect(newState.searchKeyword).toBe('new keyword');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('flowState', JSON.stringify(newState));
  });

  it('should handle setSearchResults', () => {
    const newResults = [{ id: 1, name: 'Result 1' }];
    const newState = reducer(defaultInitialState, setSearchResults(newResults));
    expect(newState.searchResults).toEqual(newResults);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('flowState', JSON.stringify(newState));
  });

  it('should handle appendSearchResults', () => {
    const currentResults = [{ id: 1, name: 'Result 1' }];
    const stateWithCurrentResults = { ...defaultInitialState, searchResults: currentResults };
    const newResults = [{ id: 2, name: 'Result 2' }];
    const newState = reducer(stateWithCurrentResults, appendSearchResults(newResults));
    expect(newState.searchResults).toEqual([...currentResults, ...newResults]);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('flowState', JSON.stringify(newState));
  });

  it('should handle setPage', () => {
    const newState = reducer(defaultInitialState, setPage(5));
    expect(newState.page).toBe(5);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('flowState', JSON.stringify(newState));
  });

  it('should handle incrementPage', () => {
    const stateWithPage = { ...defaultInitialState, page: 2 };
    const newState = reducer(stateWithPage, incrementPage());
    expect(newState.page).toBe(3);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('flowState', JSON.stringify(newState));
  });

  it('should handle setHasMorePages', () => {
    const newState = reducer(defaultInitialState, setHasMorePages(false));
    expect(newState.hasMorePages).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('flowState', JSON.stringify(newState));
  });

  it('should handle setReFetchSearch', () => {
    const newState = reducer(defaultInitialState, setReFetchSearch('on'));
    expect(newState.reFetchSearch).toBe('on');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('flowState', JSON.stringify(newState));
  });

  it('should handle setShowSearch', () => {
    const newState = reducer(defaultInitialState, setShowSearch(false));
    expect(newState.showSearch).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('flowState', JSON.stringify(newState));
  });

  it('should handle setRecordSequenceDetailsVisibility', () => {
    const newState = reducer(defaultInitialState, setRecordSequenceDetailsVisibility(true));
    expect(newState.recordSequenceDetailsVisibility).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('flowState', JSON.stringify(newState));
  });

  it('should handle resetFlowState', () => {
    const currentState: FlowState = {
      searchKeyword: 'old',
      searchResults: [{ id: 1 }],
      page: 5,
      hasMorePages: false,
      reFetchSearch: 'on',
      showSearch: false,
      recordSequenceDetailsVisibility: true,
    };
    const newState = reducer(currentState, resetFlowState());
    expect(newState).toEqual(defaultInitialState);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('flowState', JSON.stringify(defaultInitialState));
  });
});
