import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { store } from '../store';
import type { RootState, AppDispatch } from '../store';

// Create typed hooks for better TypeScript support in React applications
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export store for provider setup
export { store };
export type { RootState, AppDispatch };

// Export all slice actions and types for React applications
export * from '../store/slices';

// Explicitly export recording slice actions
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
} from '../store/slices/recordingSlice';
