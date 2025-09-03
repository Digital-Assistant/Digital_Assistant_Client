import { PayloadAction } from '@reduxjs/toolkit';
export interface ValidationState {
    recordingId: number | null;
    validationRequired: boolean;
    validationCompleted: boolean;
}
export declare const validationSlice: import("@reduxjs/toolkit").Slice<ValidationState, {
    startValidation: (state: import("immer/dist/internal").WritableDraft<ValidationState>, action: PayloadAction<number>) => void;
    markValidationCompleted: (state: import("immer/dist/internal").WritableDraft<ValidationState>) => void;
    resetValidationState: (state: import("immer/dist/internal").WritableDraft<ValidationState>) => {
        recordingId: null;
        validationRequired: boolean;
        validationCompleted: boolean;
    };
}, "validation">;
export declare const startValidation: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "validation/startValidation">, markValidationCompleted: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"validation/markValidationCompleted">, resetValidationState: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"validation/resetValidationState">;
declare const _default: import("redux").Reducer<ValidationState, import("redux").AnyAction>;
export default _default;
