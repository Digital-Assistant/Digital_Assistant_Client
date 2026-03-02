import { configureStore } from '@reduxjs/toolkit';
// import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import storageMiddleware from './middleware/storageMiddleware'; // Import the new middleware

// Import reducers
import {
    editingReducer,
    validationReducer,
    userReducer,
    recordingReducer,
    flowReducer,
    editableStepFormReducer,
} from './slices';

// Create the store
export const store = configureStore({
    reducer: {
        // editing: editingReducer,
        validation: validationReducer,
        user: userReducer,
        recording: recordingReducer,
        flow: flowReducer,
        editableStepForm: editableStepFormReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storageMiddleware),
});

// Infer the state type from the store itself
export type RootState = {
    // editing: ReturnType<typeof editingReducer>;
    validation: ReturnType<typeof validationReducer>;
    user: ReturnType<typeof userReducer>;
    recording: ReturnType<typeof recordingReducer>;
    flow: ReturnType<typeof flowReducer>;
    editableStepForm: ReturnType<typeof editableStepFormReducer>;
};
export type AppStore = typeof store;

export type AppDispatch = typeof store.dispatch;

// Create typed hooks for React components
// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export actions from all slices
export * from './slices';
