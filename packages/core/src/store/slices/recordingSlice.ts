import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
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

// Async thunk to initialize state from storage
export const initializeRecordingState = createAsyncThunk(
    'recording/initialize',
    async () => {
        try {
            const serializedState: any = await StorageUtil.get(CONFIG.RECORDING_SEQUENCE_REDUX, false);
            if (serializedState === null || typeof serializedState === 'undefined') {
                return { ...defaultRecordingState };
            }
            return coerceRecordingState(serializedState);
        } catch (err) {
            console.error('Error loading recording state from storage:', err);
            return { ...defaultRecordingState };
        }
    }
);

const initialState: RecordingState = { ...defaultRecordingState };

export const recordingSlice = createSlice({
    name: 'recording',
    initialState,
    reducers: {
        setIsRecording: (state, action: PayloadAction<boolean>) => {
            state.isRecording = action.payload;
        },
        setIsPlaying: (state, action: PayloadAction<string>) => {
            state.isPlaying = action.payload;
        },
        setManualPlay: (state, action: PayloadAction<string>) => {
            state.manualPlay = action.payload;
        },
        setPlayDelay: (state, action: PayloadAction<string>) => {
            state.playDelay = action.payload;
        },
        setRecSequenceData: (state, action: PayloadAction<any[]>) => {
            state.recSequenceData = action.payload;
        },
        addRecSequenceData: (state, action: PayloadAction<any>) => {
            state.recSequenceData.push(action.payload);
        },
        setSelectedRecordingDetails: (state, action: PayloadAction<any | null>) => {
            state.selectedRecordingDetails = action.payload;
        },
        setShowRecord: (state, action: PayloadAction<boolean>) => {
            state.showRecord = action.payload;
        },
        setShowLoader: (state, action: PayloadAction<boolean>) => {
            state.showLoader = action.payload;
        },
        resetRecordingState: () => {
            return { ...defaultRecordingState };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(initializeRecordingState.fulfilled, (state, action) => {
            return { ...state, ...action.payload };
        });
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
