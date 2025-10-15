export { default as editingReducer, editingSlice } from './editingSlice';
export { default as validationReducer, validationSlice } from './validationSlice';
export { default as userReducer, userSlice } from './userSlice';
export { default as recordingReducer, recordingSlice } from './recordingSlice';
export { default as flowReducer, flowSlice } from './flowSlice';

// Export action creators from recording slice
export { 
    setIsRecording, 
    setIsPlaying, 
    setManualPlay, 
    setPlayDelay, 
    setRecSequenceData, 
    addRecSequenceData, 
    setSelectedRecordingDetails, 
    setShowRecord, 
    setShowLoader, 
    resetRecordingState 
} from './recordingSlice';

export type { EditingStepState } from './editingSlice';
export type { ValidationState } from './validationSlice';
export type { UserState } from './userSlice';
export { setUserData } from './userSlice';
export type { RecordingState } from './recordingSlice';
export type { FlowState } from './flowSlice';