import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state interface for user data
export interface UserState {
    userData: any | null;
    authenticated: boolean;
    keycloakSessionData: any | null;
    userSessionData: any | null;
    userSessionId: string | null;
}

// Function to load state from localStorage
const loadStateFromStorage = (): UserState => {
    try {
        const serializedState = localStorage.getItem('userState');
        if (serializedState === null) {
            return {
                userData: null,
                authenticated: false,
                keycloakSessionData: null,
                userSessionData: null,
                userSessionId: null,
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Error loading user state from localStorage:', err);
        return {
            userData: null,
            authenticated: false,
            keycloakSessionData: null,
            userSessionData: null,
            userSessionId: null,
        };
    }
};

// Function to save state to localStorage
const saveStateToStorage = (state: UserState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('userState', serializedState);
    } catch (err) {
        console.error('Error saving user state to localStorage:', err);
    }
};

// Initialize state from localStorage
const initialState: UserState = loadStateFromStorage();

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<any>) => {
            state.userData = action.payload;
            saveStateToStorage(state);
        },
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.authenticated = action.payload;
            saveStateToStorage(state);
        },
        setKeycloakSessionData: (state, action: PayloadAction<any>) => {
            state.keycloakSessionData = action.payload;
            saveStateToStorage(state);
        },
        setUserSessionData: (state, action: PayloadAction<any>) => {
            state.userSessionData = action.payload;
            saveStateToStorage(state);
        },
        setUserSessionId: (state, action: PayloadAction<string | null>) => {
            state.userSessionId = action.payload;
            saveStateToStorage(state);
        },
        clearUserData: (state) => {
            const resetState = {
                userData: null,
                authenticated: false,
                keycloakSessionData: null,
                userSessionData: null,
                userSessionId: null,
            };
            saveStateToStorage(resetState);
            return resetState;
        },
    },
});

export const { 
    setUserData, 
    setAuthenticated, 
    setKeycloakSessionData, 
    setUserSessionData, 
    setUserSessionId, 
    clearUserData 
} = userSlice.actions;

export default userSlice.reducer;
