import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '../utils/storageHelper';

// Define the state interface for flow data
export interface FlowState {
    searchKeyword: string;
    searchResults: any[];
    page: number;
    hasMorePages: boolean;
    reFetchSearch: string;
    showSearch: boolean;
    recordSequenceDetailsVisibility: boolean;
}

// Default state
const defaultState: FlowState = {
    searchKeyword: '',
    searchResults: [],
    page: 0,
    hasMorePages: true,
    reFetchSearch: 'off',
    showSearch: true,
    recordSequenceDetailsVisibility: false,
};

// Function to load state from storage (works in service workers and web)
const loadStateFromStorage = (): FlowState => {
    return loadFromStorage('flowState', defaultState);
};

// Function to save state to storage (works in service workers and web)
const saveStateToStorage = (state: FlowState) => {
    saveToStorage('flowState', state);
};

// Initialize state from localStorage
const initialState: FlowState = loadStateFromStorage();

export const flowSlice = createSlice({
    name: 'flow',
    initialState,
    reducers: {
        setSearchKeyword: (state, action: PayloadAction<string>) => {
            state.searchKeyword = action.payload;
            saveStateToStorage(state);
        },
        setSearchResults: (state, action: PayloadAction<any[]>) => {
            state.searchResults = action.payload;
            saveStateToStorage(state);
        },
        appendSearchResults: (state, action: PayloadAction<any[]>) => {
            state.searchResults = [...state.searchResults, ...action.payload];
            saveStateToStorage(state);
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
            saveStateToStorage(state);
        },
        incrementPage: (state) => {
            state.page += 1;
            saveStateToStorage(state);
        },
        setHasMorePages: (state, action: PayloadAction<boolean>) => {
            state.hasMorePages = action.payload;
            saveStateToStorage(state);
        },
        setReFetchSearch: (state, action: PayloadAction<string>) => {
            state.reFetchSearch = action.payload;
            saveStateToStorage(state);
        },
        setShowSearch: (state, action: PayloadAction<boolean>) => {
            state.showSearch = action.payload;
            saveStateToStorage(state);
        },
        setRecordSequenceDetailsVisibility: (state, action: PayloadAction<boolean>) => {
            state.recordSequenceDetailsVisibility = action.payload;
            saveStateToStorage(state);
        },
        resetFlowState: (state) => {
            const resetState = {
                searchKeyword: '',
                searchResults: [],
                page: 0,
                hasMorePages: true,
                reFetchSearch: 'off',
                showSearch: true,
                recordSequenceDetailsVisibility: false,
            };
            saveStateToStorage(resetState);
            return resetState;
        },
    },
});

export const { 
    setSearchKeyword, 
    setSearchResults, 
    appendSearchResults, 
    setPage, 
    incrementPage, 
    setHasMorePages, 
    setReFetchSearch, 
    setShowSearch, 
    setRecordSequenceDetailsVisibility, 
    resetFlowState 
} = flowSlice.actions;

export default flowSlice.reducer;
