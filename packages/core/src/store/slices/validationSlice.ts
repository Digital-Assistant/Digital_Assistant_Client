import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '../utils/storageHelper';

// Define the state interface
export interface ValidationState {
    recordingId: number | null; // Ensure type matches initial state
    validationRequired: boolean;
    validationCompleted: boolean;
}

// Default state
const defaultState: ValidationState = {
    recordingId: null,
    validationRequired: false,
    validationCompleted: false,
};

// Function to load state from storage (works in service workers and web)
const loadStateFromStorage = (): ValidationState => {
    return loadFromStorage('validationState', defaultState);
};

// Function to save state to storage (works in service workers and web)
const saveStateToStorage = (state: ValidationState) => {
    saveToStorage('validationState', state);
};

// Initialize state from localStorage
const initialState: ValidationState = loadStateFromStorage();

export const validationSlice = createSlice({
    name: 'validation',
    initialState,
    reducers: {
        startValidation: (state, action: PayloadAction<number>) => {
            state.recordingId = action.payload;
            state.validationRequired = true;
            state.validationCompleted = false;
            // Save to localStorage after state update
            saveStateToStorage({
                ...state,
                recordingId: action.payload,
                validationRequired: true,
                validationCompleted: false
            });
        },
        markValidationCompleted: (state) => {
            state.validationCompleted = true;
            // Save to localStorage after state update
            saveStateToStorage({
                ...state,
                validationCompleted: true
            });
        },
        resetValidationState: (state) => {
            const resetState = {
                recordingId: null,
                validationRequired: false,
                validationCompleted: false,
            };
            // Save reset state to localStorage
            saveStateToStorage(resetState);
            // Return the reset state
            return resetState;
        },
    },
});

export const { startValidation, markValidationCompleted, resetValidationState } = validationSlice.actions;
export default validationSlice.reducer;
