// Mock console.error BEFORE any imports
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

// Declare a mock object for StorageUtil that we can control
const mockStorageUtil = {
  get: jest.fn(),
  setToStore: jest.fn(),
};

// Mock StorageUtil globally so that the slice also uses this mock
jest.mock('../../../util/storage', () => ({
  StorageUtil: mockStorageUtil,
}));

// Mock CONFIG globally
jest.mock('../../../config', () => ({
  CONFIG: {
    RECORDING_SEQUENCE_REDUX: 'recordingState',
  },
}));

// Import RecordingState type for type safety in tests
import type { RecordingState } from '../recordingSlice';
import recordingReducer, {
  setIsRecording,
  setIsPlaying,
  setManualPlay,
  setPlayDelay,
  setRecSequenceData,
  addRecSequenceData,
  setSelectedRecordingDetails,
  setShowRecord,
  setShowLoader,
  resetRecordingState,
  initializeRecordingState,
  defaultRecordingState,
} from '../recordingSlice';

describe('recordingSlice', () => {
  let reducer: any;
  let CONFIG_MOCK: any;

  // Helper function to get a fresh reducer instance with controlled StorageUtil
  const getFreshSliceModule = (storageData: any = null, throwErrorOnLoad = false) => {
    jest.resetModules(); // Clear module cache

    // Clear mocks on our controlled mock object and spies
    mockStorageUtil.get.mockClear();
    mockStorageUtil.setToStore.mockClear();
    consoleErrorSpy.mockClear();

    if (throwErrorOnLoad) {
      mockStorageUtil.get.mockImplementation(() => {
        throw new Error('Storage read error');
      });
    } else {
      mockStorageUtil.get.mockReturnValue(Promise.resolve(storageData));
    }

    // Re-import the slice and its actions
    const freshModule = require('../recordingSlice');

    reducer = freshModule.default;
    CONFIG_MOCK = require('../../../config').CONFIG;

    // The reducer's initial state is determined *during this require call*
    const actualInitialState = reducer(undefined, { type: '@@INIT' });
    return { reducer, actualInitialState };
  };

  beforeEach(() => {
    // Ensure mocks are cleared before each test
    jest.clearAllMocks();
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore(); // Restore console.error after all tests
  });

  describe('recordingSlice initialization', () => {
    it('initializes with default state initially', () => {
      // Now initialization is async, so initial state should always be default
      const { actualInitialState } = getFreshSliceModule(null);
      expect(actualInitialState).toEqual(defaultRecordingState);
    });

    it('async initialization updates state with storage data', async () => {
      const persistedState: RecordingState = {
        ...defaultRecordingState,
        isRecording: true,
        isPlaying: 'on',
        recSequenceData: [{ id: 1, action: 'click' }],
      };
      const { reducer } = getFreshSliceModule(persistedState);
      const store = { getState: () => ({ recording: defaultRecordingState }), dispatch: jest.fn() };

      // Dispatch the async thunk
      const action = await initializeRecordingState()(store.dispatch, store.getState, undefined);

      // Check if the fulfilled action has the correct payload
      expect(action.payload).toEqual(persistedState);

      // Check if reducer handles the fulfilled action
      const newState = reducer(defaultRecordingState, action);
      expect(newState).toEqual(persistedState);
      expect(mockStorageUtil.get).toHaveBeenCalledWith(CONFIG_MOCK.RECORDING_SEQUENCE_REDUX, false);
    });

    it('async initialization falls back to defaults for malformed/partial persisted values', async () => {
      const malformedState = {
        isRecording: 'yes', // Incorrect type
        recSequenceData: [{ id: 1 }], // Correct type
        unknownProperty: 'value', // Extra property
      };

      const { reducer } = getFreshSliceModule(malformedState);
      const store = { getState: () => ({ recording: defaultRecordingState }), dispatch: jest.fn() };

      const action = await initializeRecordingState()(store.dispatch, store.getState, undefined);

      const expectedState = {
        ...defaultRecordingState,
        recSequenceData: [{ id: 1 }], // Only recSequenceData should be taken from malformed
      };

      expect(action.payload).toEqual(expectedState);
      expect(mockStorageUtil.get).toHaveBeenCalledWith(CONFIG_MOCK.RECORDING_SEQUENCE_REDUX, false);
    });

    it('handles errors during state loading from storage gracefully', async () => {
      const { reducer } = getFreshSliceModule(null, true); // Pass true to throwErrorOnLoad
      const store = { getState: () => ({ recording: defaultRecordingState }), dispatch: jest.fn() };

      const action = await initializeRecordingState()(store.dispatch, store.getState, undefined);

      expect(action.payload).toEqual(defaultRecordingState);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading recording state from storage:', expect.any(Error));
    });
  });

  describe('recordingSlice reducers', () => {
    let currentState: RecordingState;

    beforeEach(() => {
      currentState = { ...defaultRecordingState };
    });

    it('setIsRecording should update isRecording', () => {
      const newState = recordingReducer(currentState, setIsRecording(true));
      expect(newState.isRecording).toBe(true);
    });

    it('setIsPlaying should update isPlaying', () => {
      const newState = recordingReducer(currentState, setIsPlaying('on'));
      expect(newState.isPlaying).toBe('on');
    });

    it('setManualPlay should update manualPlay', () => {
      const newState = recordingReducer(currentState, setManualPlay('on'));
      expect(newState.manualPlay).toBe('on');
    });

    it('setPlayDelay should update playDelay', () => {
      const newState = recordingReducer(currentState, setPlayDelay('2000'));
      expect(newState.playDelay).toBe('2000');
    });

    it('setRecSequenceData should update recSequenceData', () => {
      const newSequence = [{ id: 1, action: 'click' }];
      const newState = recordingReducer(currentState, setRecSequenceData(newSequence));
      expect(newState.recSequenceData).toEqual(newSequence);
    });

    it('addRecSequenceData should add to recSequenceData', () => {
      const itemToAdd = { id: 2, action: 'type' };
      const newState = recordingReducer(currentState, addRecSequenceData(itemToAdd));
      expect(newState.recSequenceData).toEqual([itemToAdd]);
    });

    it('setSelectedRecordingDetails should update selectedRecordingDetails', () => {
      const details = { name: 'My Recording' };
      const newState = recordingReducer(currentState, setSelectedRecordingDetails(details));
      expect(newState.selectedRecordingDetails).toEqual(details);
    });

    it('setShowRecord should update showRecord', () => {
      const newState = recordingReducer(currentState, setShowRecord(true));
      expect(newState.showRecord).toBe(true);
    });

    it('setShowLoader should update showLoader', () => {
      const newState = recordingReducer(currentState, setShowLoader(true));
      expect(newState.showLoader).toBe(true);
    });

    it('resetRecordingState should return default state', () => {
      const modifiedState: RecordingState = {
        ...defaultRecordingState,
        isRecording: true,
      };
      const newState = recordingReducer(modifiedState, resetRecordingState());
      expect(newState).toEqual(defaultRecordingState);
    });
  });
});
