// @file:userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthData {
    id?: string;
    token?: string;
    email?: string;
    refreshToken?: string;
}

export interface UserState {
    userSessionData?: {
        authData?: AuthData;
        sessionKey?: string;
    };
    userData?: AuthData;
    keycloakSessionData?: AuthData;
    userSessionId?: string;
}

const initialState: UserState = {};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData(state, action: PayloadAction<any>) {
            state.userData = action.payload;
            if (!state.userSessionData) {
                state.userSessionData = { authData: action.payload };
            }
        },
        setUserSessionData(state, action: PayloadAction<any>) {
            state.userSessionData = action.payload;
        },
        setKeycloakSessionData(state, action: PayloadAction<any>) {
            state.keycloakSessionData = action.payload;
        },
        clearUserData(state) {
            state.userSessionData = undefined;
            state.userData = undefined;
            state.keycloakSessionData = undefined;
            state.userSessionId = undefined;
        },
        setUserSessionId(state, action: PayloadAction<string>) {
            state.userSessionId = action.payload;
        },
    },
});

export const {
    setUserData,
    setUserSessionData,
    setKeycloakSessionData,
    clearUserData,
    setUserSessionId
} = userSlice.actions;

export default userSlice.reducer;