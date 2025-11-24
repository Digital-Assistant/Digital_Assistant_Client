import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index'; // Assuming RootState is defined in src/store/index.ts
import { StorageUtil } from '../../util/storage';
import { CONFIG } from '../../config';
import { recordingSlice } from '../slices/recordingSlice'; // Import the slice to get its name

// Function to save state to localStorage
const saveRecordingStateToStorage = (state: RootState['recording']) => {
    try {
        StorageUtil.setToStore({ ...state }, CONFIG.RECORDING_SEQUENCE_REDUX, false);
    } catch (err) {
        console.error('Error saving recording state to localStorage:', err);
    }
};

const storageMiddleware: Middleware<{}, RootState> = storeAPI => next => action => {
    const result = next(action); // Let the action go through to the reducers first

    // Check if the action is related to the recording slice
    // This is a simple check based on the action type prefix.
    if (action.type.startsWith(recordingSlice.name + '/')) {
        const state = storeAPI.getState();
        saveRecordingStateToStorage(state.recording); // Save only the recording slice state
    }

    return result;
};

export default storageMiddleware;
