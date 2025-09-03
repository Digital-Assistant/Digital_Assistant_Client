import { PayloadAction } from '@reduxjs/toolkit';
export interface EditingStepState {
    recordingId: number | null;
    editingStepId: number | null;
    validationRequired: boolean;
    validationCompleted: boolean;
    editingStepOriginalData: any;
}
export declare const editingSlice: import("@reduxjs/toolkit").Slice<EditingStepState, {
    startEditingStep: (state: import("immer/dist/internal").WritableDraft<EditingStepState>, action: PayloadAction<{
        recordingId: number;
        editingStepId: number;
        editingStepData: any;
    }>) => void;
    cancelEditingStep: (state: EditingStepState) => void;
    startValidation: (state: import("immer/dist/internal").WritableDraft<EditingStepState>) => void;
    markValidationCompleted: (state: import("immer/dist/internal").WritableDraft<EditingStepState>) => void;
    resetValidationState: (state: import("immer/dist/internal").WritableDraft<EditingStepState>) => {
        recordingId: null;
        editingStepId: null;
        validationRequired: boolean;
        validationCompleted: boolean;
        editingStepOriginalData: null;
    };
}, "editing">;
export declare const startValidation: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"editing/startValidation">, markValidationCompleted: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"editing/markValidationCompleted">, resetValidationState: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"editing/resetValidationState">, startEditingStep: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    recordingId: number;
    editingStepId: number;
    editingStepData: any;
}, "editing/startEditingStep">, cancelEditingStep: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"editing/cancelEditingStep">;
declare const _default: import("redux").Reducer<EditingStepState, import("redux").AnyAction>;
export default _default;
