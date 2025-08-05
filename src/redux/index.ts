import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Import reducers
// import validationReducer from './validation';
import editingReducer from "./editingStep";

// Create the store
export const store = configureStore({
    reducer: {
        // validation: validationReducer,
        editingStep: editingReducer
    },
});

// Define state type manually without using getState
export interface RootState {
    // validation: ReturnType<typeof validationReducer>;
    editingStep: ReturnType<typeof editingReducer>;
    // Add other slices here as needed
}

export type AppDispatch = typeof store.dispatch;

// Create typed hooks for better TypeScript support
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
