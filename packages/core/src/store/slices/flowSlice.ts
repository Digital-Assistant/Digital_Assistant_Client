import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

// Function to load state from localStorage
const loadStateFromStorage = (): FlowState => {
    try {
        const serializedState = localStorage.getItem('flowState');
        if (serializedState === null) {
            return {
                searchKeyword: '',
                searchResults: [],
                page: 0,
                hasMorePages: true,
                reFetchSearch: 'off',
                showSearch: true,
                recordSequenceDetailsVisibility: false,
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Error loading flow state from localStorage:', err);
        return {
            searchKeyword: '',
            searchResults: [],
            page: 0,
            hasMorePages: true,
            reFetchSearch: 'off',
            showSearch: true,
            recordSequenceDetailsVisibility: false,
        };
    }
};

// Function to save state to localStorage
const saveStateToStorage = (state: FlowState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('flowState', serializedState);
    } catch (err) {
        console.error('Error saving flow state to localStorage:', err);
    }
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
