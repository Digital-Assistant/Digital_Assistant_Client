import type { RootState } from '../../store';
import type { RecordingState } from '../slices/recordingSlice';

/**
 * Get the entire recording slice state.
 */
export const getRecordingState = (state: RootState): RecordingState => state.recording;

/**
 * Get the recorded sequence data array from the recording slice.
 */
export const getRecSequenceData = (state: RootState): any[] => state.recording.recSequenceData;
