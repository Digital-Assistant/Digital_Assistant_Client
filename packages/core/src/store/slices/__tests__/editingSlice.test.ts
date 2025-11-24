
// Mock localStorage and console.error BEFORE importing the slice
import {EditingStepState} from "../editingSlice";

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
let startEditingStep: any;
let cancelEditingStep: any;
let startValidation: any;
let markValidationCompleted: any;
let resetValidationState: any;

describe('editingSlice', () => {
  const defaultInitialState: EditingStepState = { // Renamed for clarity
    recordingId: null,
    editingStepId: null,
    validationRequired: false,
    validationCompleted: false,
    editingStepOriginalData: null,
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

    const freshModule = require('../editingSlice');
    reducer = freshModule.default;
    startEditingStep = freshModule.startEditingStep;
    cancelEditingStep = freshModule.cancelEditingStep;
    startValidation = freshModule.startValidation;
    markValidationCompleted = freshModule.markValidationCompleted;
    resetValidationState = freshModule.resetValidationState;
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
    expect(localStorageMock.getItem).toHaveBeenCalledWith('editingState');
  });

  it('should load state from localStorage if available', () => {
    const storedState: EditingStepState = {
      recordingId: 1,
      editingStepId: 10,
      validationRequired: true,
      validationCompleted: false,
      editingStepOriginalData: { some: 'data' },
    };
    
    // Get a fresh reducer instance with the stored state in localStorage
    const loadedReducer = getFreshReducer(JSON.stringify(storedState));
    
    // The reducer's initial state should now be the stored state
    expect(loadedReducer(undefined, { type: '' })).toEqual(storedState);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('editingState');
  });

  it('should handle localStorage errors gracefully when loading state', () => {
    // Get a fresh reducer instance that will throw an error during localStorage load
    const loadedReducer = getFreshReducer(null, true); // Pass true to throwErrorOnLoad
    
    // The reducer's initial state should fall back to default
    expect(loadedReducer(undefined, { type: '' })).toEqual(defaultInitialState);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading validation state from localStorage:', expect.any(Error));
  });

  it('should handle localStorage errors gracefully when saving state', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage write error');
    });
    const state = reducer(defaultInitialState, startEditingStep({ recordingId: 1, editingStepId: 10, editingStepData: {} }));
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving validation state to localStorage:', expect.any(Error));
    // State should still be updated even if saving fails
    expect(state.recordingId).toBe(1);
  });

  it('should handle startEditingStep', () => {
    const actionPayload = {
      recordingId: 1,
      editingStepId: 10,
      editingStepData: { field: 'value' },
    };
    const expectedState: EditingStepState = {
      recordingId: 1,
      editingStepId: 10,
      validationRequired: false,
      validationCompleted: false,
      editingStepOriginalData: { field: 'value' },
    };
    const newState = reducer(defaultInitialState, startEditingStep(actionPayload));
    expect(newState).toEqual(expectedState);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('editingState', JSON.stringify(expectedState));
  });

  it('should handle cancelEditingStep', () => {
    const currentState: EditingStepState = {
      recordingId: 1,
      editingStepId: 10,
      validationRequired: true,
      validationCompleted: false,
      editingStepOriginalData: { field: 'value' },
    };
    const newState = reducer(currentState, cancelEditingStep());
    expect(newState).toEqual(defaultInitialState);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('editingState', JSON.stringify(defaultInitialState));
  });

  it('should handle startValidation', () => {
    const currentState: EditingStepState = {
      ...defaultInitialState,
      recordingId: 1,
      editingStepId: 10,
      editingStepOriginalData: { field: 'value' },
    };
    const expectedState: EditingStepState = {
      ...currentState,
      validationRequired: true,
      validationCompleted: false,
    };
    const newState = reducer(currentState, startValidation());
    expect(newState).toEqual(expectedState);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('editingState', JSON.stringify(expectedState));
  });

  it('should handle markValidationCompleted', () => {
    const currentState: EditingStepState = {
      ...defaultInitialState,
      recordingId: 1,
      editingStepId: 10,
      validationRequired: true,
      editingStepOriginalData: { field: 'value' },
    };
    const expectedState: EditingStepState = {
      ...currentState,
      validationCompleted: true,
    };
    const newState = reducer(currentState, markValidationCompleted());
    expect(newState).toEqual(expectedState);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('editingState', JSON.stringify(expectedState));
  });

  it('should handle resetValidationState', () => {
    const currentState: EditingStepState = {
      recordingId: 1,
      editingStepId: 10,
      validationRequired: true,
      validationCompleted: true,
      editingStepOriginalData: { field: 'value' },
    };
    const newState = reducer(currentState, resetValidationState());
    expect(newState).toEqual(defaultInitialState);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('editingState', JSON.stringify(defaultInitialState));
  });
});
