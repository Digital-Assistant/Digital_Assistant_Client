import { TypedUseSelectorHook } from 'react-redux';
import { store } from '../store';
import type { RootState, AppDispatch } from '../store';
export declare const useAppDispatch: () => import("redux-thunk").ThunkDispatch<{
    editing: import("../store").EditingStepState;
    validation: import("../store").ValidationState;
    user: import("../store").UserState;
    recording: import("../store").RecordingState;
    flow: import("../store").FlowState;
}, undefined, import("redux").AnyAction> & import("redux").Dispatch<import("redux").AnyAction>;
export declare const useAppSelector: TypedUseSelectorHook<RootState>;
export { store };
export type { RootState, AppDispatch };
export * from '../store/slices';
export { setIsRecording, setIsPlaying, setManualPlay, setPlayDelay, setRecSequenceData, addRecSequenceData, setSelectedRecordingDetails, setShowRecord, setShowLoader, resetRecordingState } from '../store/slices/recordingSlice';
