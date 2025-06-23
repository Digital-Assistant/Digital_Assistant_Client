import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state interface
export interface ValidationState {
    recordingId: number | null; // Ensure type matches initial state
    validationRequired: boolean;
    validationCompleted: boolean;
}

// Function to load state from localStorage
const loadStateFromStorage = (): ValidationState => {
    try {
        const serializedState = localStorage.getItem('validationState');
        if (serializedState === null) {
            return {
                recordingId: null,
                validationRequired: false,
                validationCompleted: false,
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Error loading validation state from localStorage:', err);
        return {
            recordingId: null,
            validationRequired: false,
            validationCompleted: false,
        };
    }
};

// Function to save state to localStorage
const saveStateToStorage = (state: ValidationState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('validationState', serializedState);
    } catch (err) {
        console.error('Error saving validation state to localStorage:', err);
    }
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
