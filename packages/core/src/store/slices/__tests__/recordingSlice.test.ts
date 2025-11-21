import reducer, {
  defaultRecordingState,
  setIsRecording,
  resetRecordingState,
} from '../recordingSlice';
import { StorageUtil } from '../../../util/storage';

jest.mock('../../../util/storage', () => ({
  StorageUtil: {
    getFromStore: jest.fn(),
    setToStore: jest.fn(),
  },
}));

describe('recordingSlice initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with defaults when storage returns undefined', () => {
    (StorageUtil.getFromStore as jest.Mock).mockReturnValue(undefined);
    // reducer(undefined, { type: '@@INIT' }) should provide initial state
    const state = reducer(undefined as any, { type: '@@INIT' } as any);
    expect(state).toEqual(defaultRecordingState);
  });

  it('initializes with defaults when storage returns null', () => {
    (StorageUtil.getFromStore as jest.Mock).mockReturnValue(null);
    const state = reducer(undefined as any, { type: '@@INIT' } as any);
    expect(state).toEqual(defaultRecordingState);
  });

  it('initializes with persisted state when storage returns a valid object', () => {
    const persisted = {
      ...defaultRecordingState,
      isRecording: true,
      isPlaying: 'on',
    };
    (StorageUtil.getFromStore as jest.Mock).mockReturnValue(persisted);
    const state = reducer(undefined as any, { type: '@@INIT' } as any);
    expect(state.isRecording).toBe(true);
    expect(state.isPlaying).toBe('on');
  });

  it('falls back to defaults for malformed/partial persisted values', () => {
    const malformed = {
      isRecording: 'yes', // wrong type
      recSequenceData: ['ok'], // acceptable
    } as any;
    (StorageUtil.getFromStore as jest.Mock).mockReturnValue(malformed);
    const state = reducer(undefined as any, { type: '@@INIT' } as any);
    expect(state.isRecording).toBe(defaultRecordingState.isRecording);
    expect(state.recSequenceData).toEqual(['ok']);
  });
});

describe('recordingSlice reducers', () => {
  beforeEach(() => {
    (StorageUtil.getFromStore as jest.Mock).mockReturnValue(undefined);
  });

  it('setIsRecording updates state', () => {
    const initial = reducer(undefined as any, { type: '@@INIT' } as any);
    const next = reducer(initial, setIsRecording(true));
    expect(next.isRecording).toBe(true);
  });

  it('resetRecordingState returns defaults', () => {
    const modified = {
      ...defaultRecordingState,
      isRecording: true,
      isPlaying: 'on',
    };
    const next = reducer(modified as any, resetRecordingState());
    expect(next).toEqual(defaultRecordingState);
  });
});
