import { PayloadAction } from '@reduxjs/toolkit';
export interface UserState {
    userData: any | null;
    authenticated: boolean;
    keycloakSessionData: any | null;
    userSessionData: any | null;
    userSessionId: string | null;
}
export declare const userSlice: import("@reduxjs/toolkit").Slice<UserState, {
    setUserData: (state: import("immer/dist/internal").WritableDraft<UserState>, action: PayloadAction<any>) => void;
    setAuthenticated: (state: import("immer/dist/internal").WritableDraft<UserState>, action: PayloadAction<boolean>) => void;
    setKeycloakSessionData: (state: import("immer/dist/internal").WritableDraft<UserState>, action: PayloadAction<any>) => void;
    setUserSessionData: (state: import("immer/dist/internal").WritableDraft<UserState>, action: PayloadAction<any>) => void;
    setUserSessionId: (state: import("immer/dist/internal").WritableDraft<UserState>, action: PayloadAction<string | null>) => void;
    clearUserData: (state: import("immer/dist/internal").WritableDraft<UserState>) => {
        userData: null;
        authenticated: boolean;
        keycloakSessionData: null;
        userSessionData: null;
        userSessionId: null;
    };
}, "user">;
export declare const setUserData: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "user/setUserData">, setAuthenticated: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "user/setAuthenticated">, setKeycloakSessionData: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "user/setKeycloakSessionData">, setUserSessionData: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "user/setUserSessionData">, setUserSessionId: import("@reduxjs/toolkit").ActionCreatorWithPayload<string | null, "user/setUserSessionId">, clearUserData: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"user/clearUserData">;
declare const _default: import("redux").Reducer<UserState, import("redux").AnyAction>;
export default _default;
