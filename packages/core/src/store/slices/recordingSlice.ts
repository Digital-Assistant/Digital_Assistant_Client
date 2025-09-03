import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

// Function to load state from localStorage
const loadStateFromStorage = (): RecordingState => {
    try {
        const serializedState = localStorage.getItem('recordingState');
        if (serializedState === null) {
            return {
                isRecording: false,
                isPlaying: 'off',
                manualPlay: 'off',
                playDelay: 'off',
                recSequenceData: [],
                selectedRecordingDetails: null,
                showRecord: false,
                showLoader: false,
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Error loading recording state from localStorage:', err);
        return {
            isRecording: false,
            isPlaying: 'off',
            manualPlay: 'off',
            playDelay: 'off',
            recSequenceData: [],
            selectedRecordingDetails: null,
            showRecord: false,
            showLoader: false,
        };
    }
};

// Function to save state to localStorage
const saveStateToStorage = (state: RecordingState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('recordingState', serializedState);
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
        resetRecordingState: (state) => {
            const resetState = {
                isRecording: false,
                isPlaying: 'off',
                manualPlay: 'off',
                playDelay: 'off',
                recSequenceData: [],
                selectedRecordingDetails: null,
                showRecord: false,
                showLoader: false,
            };
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
