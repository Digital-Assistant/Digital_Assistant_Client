import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state interface
export interface EditingStepState {
    recordingId: number | null; // Ensure type matches initial state
    editingStepId: number | null;
    validationRequired: boolean;
    validationCompleted: boolean;
    editingStepOriginalData: any;
}

// Function to load state from localStorage
const loadStateFromStorage = (): EditingStepState => {
    try {
        const serializedState = localStorage.getItem('editingState');
        if (serializedState === null) {
            return {
                recordingId: null,
                editingStepId: null,
                validationRequired: false,
                validationCompleted: false,
                editingStepOriginalData: null,
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Error loading validation state from localStorage:', err);
        return {
            recordingId: null,
            editingStepId: null,
            validationRequired: false,
            validationCompleted: false,
            editingStepOriginalData: null,
        };
    }
};

// Function to save state to localStorage
const saveStateToStorage = (state: EditingStepState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('editingState', serializedState);
    } catch (err) {
        console.error('Error saving validation state to localStorage:', err);
    }
};

// Initialize state from localStorage
const initialState: EditingStepState = loadStateFromStorage();

export const editingSlice = createSlice({
    name: 'editing',
    initialState,
    reducers: {
        startEditingStep: (state, action: PayloadAction<{recordingId: number, editingStepId: number, editingStepData: any}>) => {
            state.recordingId = action.payload.recordingId;
            state.editingStepId = action.payload.editingStepId;
            state.editingStepOriginalData = action.payload.editingStepData;
            // Save to localStorage after state update
            saveStateToStorage({
                ...state,
                recordingId: action.payload.recordingId,
                editingStepId: action.payload.editingStepId,
                editingStepOriginalData: action.payload.editingStepData,
                validationRequired: false,
                validationCompleted: false
            });
        },
        cancelEditingStep: (state: EditingStepState) => {
            state.recordingId = null;
            state.editingStepId = null;
            state.validationRequired = false;
            state.validationCompleted = false;
            state.editingStepOriginalData = null;
            // Save to localStorage after state update
            saveStateToStorage({
                ...state,
                recordingId: null,
                editingStepId: null,
                validationRequired: false,
                validationCompleted: false,
                editingStepOriginalData: null
            });
        },
        startValidation: (state) => {
            state.validationRequired = true;
            state.validationCompleted = false;
            // Save to localStorage after state update
            saveStateToStorage({
                ...state,
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
                editingStepId: null,
                validationRequired: false,
                validationCompleted: false,
                editingStepOriginalData: null,
            };
            // Save reset state to localStorage
            saveStateToStorage(resetState);
            // Return the reset state
            return resetState;
        },
    },
});

export const { startValidation, markValidationCompleted, resetValidationState, startEditingStep, cancelEditingStep } = editingSlice.actions;
export default editingSlice.reducer;
