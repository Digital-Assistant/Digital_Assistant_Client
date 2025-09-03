import { PayloadAction } from '@reduxjs/toolkit';
export interface FlowState {
    searchKeyword: string;
    searchResults: any[];
    page: number;
    hasMorePages: boolean;
    reFetchSearch: string;
    showSearch: boolean;
    recordSequenceDetailsVisibility: boolean;
}
export declare const flowSlice: import("@reduxjs/toolkit").Slice<FlowState, {
    setSearchKeyword: (state: import("immer/dist/internal").WritableDraft<FlowState>, action: PayloadAction<string>) => void;
    setSearchResults: (state: import("immer/dist/internal").WritableDraft<FlowState>, action: PayloadAction<any[]>) => void;
    appendSearchResults: (state: import("immer/dist/internal").WritableDraft<FlowState>, action: PayloadAction<any[]>) => void;
    setPage: (state: import("immer/dist/internal").WritableDraft<FlowState>, action: PayloadAction<number>) => void;
    incrementPage: (state: import("immer/dist/internal").WritableDraft<FlowState>) => void;
    setHasMorePages: (state: import("immer/dist/internal").WritableDraft<FlowState>, action: PayloadAction<boolean>) => void;
    setReFetchSearch: (state: import("immer/dist/internal").WritableDraft<FlowState>, action: PayloadAction<string>) => void;
    setShowSearch: (state: import("immer/dist/internal").WritableDraft<FlowState>, action: PayloadAction<boolean>) => void;
    setRecordSequenceDetailsVisibility: (state: import("immer/dist/internal").WritableDraft<FlowState>, action: PayloadAction<boolean>) => void;
    resetFlowState: (state: import("immer/dist/internal").WritableDraft<FlowState>) => {
        searchKeyword: string;
        searchResults: never[];
        page: number;
        hasMorePages: boolean;
        reFetchSearch: string;
        showSearch: boolean;
        recordSequenceDetailsVisibility: boolean;
    };
}, "flow">;
export declare const setSearchKeyword: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "flow/setSearchKeyword">, setSearchResults: import("@reduxjs/toolkit").ActionCreatorWithPayload<any[], "flow/setSearchResults">, appendSearchResults: import("@reduxjs/toolkit").ActionCreatorWithPayload<any[], "flow/appendSearchResults">, setPage: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "flow/setPage">, incrementPage: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"flow/incrementPage">, setHasMorePages: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "flow/setHasMorePages">, setReFetchSearch: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "flow/setReFetchSearch">, setShowSearch: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "flow/setShowSearch">, setRecordSequenceDetailsVisibility: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "flow/setRecordSequenceDetailsVisibility">, resetFlowState: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"flow/resetFlowState">;
declare const _default: import("redux").Reducer<FlowState, import("redux").AnyAction>;
export default _default;
