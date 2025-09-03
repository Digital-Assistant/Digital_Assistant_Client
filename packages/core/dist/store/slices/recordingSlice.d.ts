import { PayloadAction } from '@reduxjs/toolkit';
export interface RecordingState {
    isRecording: boolean;
    isPlaying: string;
    manualPlay: string;
    playDelay: string;
    recSequenceData: any[];
    selectedRecordingDetails: any | null;
    showRecord: boolean;
    showLoader: boolean;
}
export declare const recordingSlice: import("@reduxjs/toolkit").Slice<RecordingState, {
    setIsRecording: (state: import("immer/dist/internal").WritableDraft<RecordingState>, action: PayloadAction<boolean>) => void;
    setIsPlaying: (state: import("immer/dist/internal").WritableDraft<RecordingState>, action: PayloadAction<string>) => void;
    setManualPlay: (state: import("immer/dist/internal").WritableDraft<RecordingState>, action: PayloadAction<string>) => void;
    setPlayDelay: (state: import("immer/dist/internal").WritableDraft<RecordingState>, action: PayloadAction<string>) => void;
    setRecSequenceData: (state: import("immer/dist/internal").WritableDraft<RecordingState>, action: PayloadAction<any[]>) => void;
    addRecSequenceData: (state: import("immer/dist/internal").WritableDraft<RecordingState>, action: PayloadAction<any>) => void;
    setSelectedRecordingDetails: (state: import("immer/dist/internal").WritableDraft<RecordingState>, action: PayloadAction<any | null>) => void;
    setShowRecord: (state: import("immer/dist/internal").WritableDraft<RecordingState>, action: PayloadAction<boolean>) => void;
    setShowLoader: (state: import("immer/dist/internal").WritableDraft<RecordingState>, action: PayloadAction<boolean>) => void;
    resetRecordingState: (state: import("immer/dist/internal").WritableDraft<RecordingState>) => {
        isRecording: boolean;
        isPlaying: string;
        manualPlay: string;
        playDelay: string;
        recSequenceData: never[];
        selectedRecordingDetails: null;
        showRecord: boolean;
        showLoader: boolean;
    };
}, "recording">;
export declare const setIsRecording: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "recording/setIsRecording">, setIsPlaying: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "recording/setIsPlaying">, setManualPlay: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "recording/setManualPlay">, setPlayDelay: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "recording/setPlayDelay">, setRecSequenceData: import("@reduxjs/toolkit").ActionCreatorWithPayload<any[], "recording/setRecSequenceData">, addRecSequenceData: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "recording/addRecSequenceData">, setSelectedRecordingDetails: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "recording/setSelectedRecordingDetails">, setShowRecord: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "recording/setShowRecord">, setShowLoader: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "recording/setShowLoader">, resetRecordingState: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"recording/resetRecordingState">;
declare const _default: import("redux").Reducer<RecordingState, import("redux").AnyAction>;
export default _default;
