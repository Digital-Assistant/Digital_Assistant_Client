import { editingReducer, validationReducer, userReducer, recordingReducer, flowReducer } from './slices';
export declare const store: import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<{
    editing: import("./slices").EditingStepState;
    validation: import("./slices").ValidationState;
    user: import("./slices").UserState;
    recording: import("./slices").RecordingState;
    flow: import("./slices").FlowState;
}, import("redux").AnyAction, [import("@reduxjs/toolkit").ThunkMiddleware<{
    editing: import("./slices").EditingStepState;
    validation: import("./slices").ValidationState;
    user: import("./slices").UserState;
    recording: import("./slices").RecordingState;
    flow: import("./slices").FlowState;
}, import("redux").AnyAction, undefined>]>;
export type RootState = {
    editing: ReturnType<typeof editingReducer>;
    validation: ReturnType<typeof validationReducer>;
    user: ReturnType<typeof userReducer>;
    recording: ReturnType<typeof recordingReducer>;
    flow: ReturnType<typeof flowReducer>;
};
export type AppDispatch = typeof store.dispatch;
export * from './slices';
