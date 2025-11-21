import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StorageUtil } from "../../util/storage";
import { CONFIG } from "../../config";

// Define the state interface for recording data
export interface RecordingState {
    isRecording: boolean;
    isPlaying: string;
    manualPlay: string;
    playDelay: string;
    recSequenceData: any[];
    selectedRecordingDetails: any | null;
    showRecord: boolean;
    showLoader: boolean;
}

// Single source of truth for defaults
export const defaultRecordingState: RecordingState = {
    isRecording: false,
    isPlaying: 'off',
    manualPlay: 'off',
    playDelay: 'off',
    recSequenceData: [],
    selectedRecordingDetails: null,
    showRecord: false,
    showLoader: false,
};

// Function to safely coerce an arbitrary object into RecordingState
const coerceRecordingState = (raw: any): RecordingState => {
    if (!raw || typeof raw !== 'object') return { ...defaultRecordingState };
    return {
        isRecording: typeof raw.isRecording === 'boolean' ? raw.isRecording : defaultRecordingState.isRecording,
        isPlaying: typeof raw.isPlaying === 'string' ? raw.isPlaying : defaultRecordingState.isPlaying,
        manualPlay: typeof raw.manualPlay === 'string' ? raw.manualPlay : defaultRecordingState.manualPlay,
        playDelay: typeof raw.playDelay === 'string' ? raw.playDelay : defaultRecordingState.playDelay,
        recSequenceData: Array.isArray(raw.recSequenceData) ? raw.recSequenceData : [...defaultRecordingState.recSequenceData],
        selectedRecordingDetails: raw.selectedRecordingDetails ?? defaultRecordingState.selectedRecordingDetails,
        showRecord: typeof raw.showRecord === 'boolean' ? raw.showRecord : defaultRecordingState.showRecord,
        showLoader: typeof raw.showLoader === 'boolean' ? raw.showLoader : defaultRecordingState.showLoader,
    };
};

// Function to load state from storage; always returns a valid RecordingState
const loadStateFromStorage = (): RecordingState => {
    try {
        const serializedState: any = StorageUtil.getFromStore(CONFIG.RECORDING_SEQUENCE_REDUX, false);
        if (serializedState === null || typeof serializedState === 'undefined') {
            return { ...defaultRecordingState };
        }
        return coerceRecordingState(serializedState);
    } catch (err) {
        // Keep non-fatal; fall back to defaults in test/SSR environments
        return { ...defaultRecordingState };
    }
};

// Function to save state to localStorage
const saveStateToStorage = (state: RecordingState) => {
    try {
        StorageUtil.setToStore({ ...state }, CONFIG.RECORDING_SEQUENCE_REDUX, false)
    } catch (err) {
        console.error('Error saving recording state to localStorage:', err);
    }
};

// Initialize state from localStorage
const initialState: RecordingState = loadStateFromStorage();

export const recordingSlice = createSlice({
    name: 'recording',
    initialState,
    reducers: {
        setIsRecording: (state, action: PayloadAction<boolean>) => {
            state.isRecording = action.payload;
            saveStateToStorage(state);
        },
        setIsPlaying: (state, action: PayloadAction<string>) => {
            state.isPlaying = action.payload;
            saveStateToStorage(state);
        },
        setManualPlay: (state, action: PayloadAction<string>) => {
            state.manualPlay = action.payload;
            saveStateToStorage(state);
        },
        setPlayDelay: (state, action: PayloadAction<string>) => {
            state.playDelay = action.payload;
            saveStateToStorage(state);
        },
        setRecSequenceData: (state, action: PayloadAction<any[]>) => {
            state.recSequenceData = action.payload;
            saveStateToStorage(state);
        },
        addRecSequenceData: (state, action: PayloadAction<any>) => {
            state.recSequenceData.push(action.payload);
            saveStateToStorage(state);
        },
        setSelectedRecordingDetails: (state, action: PayloadAction<any | null>) => {
            state.selectedRecordingDetails = action.payload;
            saveStateToStorage(state);
        },
        setShowRecord: (state, action: PayloadAction<boolean>) => {
            state.showRecord = action.payload;
            saveStateToStorage(state);
        },
        setShowLoader: (state, action: PayloadAction<boolean>) => {
            state.showLoader = action.payload;
            saveStateToStorage(state);
        },
        resetRecordingState: () => {
            const resetState = { ...defaultRecordingState };
            saveStateToStorage(resetState);
            return resetState;
        },
    },
});

export const { 
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
} = recordingSlice.actions;

export default recordingSlice.reducer;
