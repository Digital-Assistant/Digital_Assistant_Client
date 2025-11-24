import { configureStore } from '@reduxjs/toolkit';
import storageMiddleware from './middleware/storageMiddleware'; // Import the new middleware

// Import reducers
import {
    editingReducer,
    validationReducer,
    userReducer,
    recordingReducer,
    flowReducer,
} from './slices';

// Create the store
export const store = configureStore({
    reducer: {
        editing: editingReducer,
        validation: validationReducer,
        user: userReducer,
        recording: recordingReducer,
        flow: flowReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storageMiddleware),
});

// Infer the state type from the store itself  
export type RootState = {
    editing: ReturnType<typeof editingReducer>;
    validation: ReturnType<typeof validationReducer>;
    user: ReturnType<typeof userReducer>;
    recording: ReturnType<typeof recordingReducer>;
    flow: ReturnType<typeof flowReducer>;
};
export type AppStore = typeof store;

export type AppDispatch = typeof store.dispatch;

// Export actions from all slices
export * from './slices';
