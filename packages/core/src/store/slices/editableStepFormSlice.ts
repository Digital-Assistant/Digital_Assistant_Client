import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * TypeScript Interfaces for EditableStepForm State
 */

export interface FormFields {
  stepEditValue: string;
  tooltip: string;
  slowPlaybackTime: string;
  customMetadata: Record<string, any>;
}

export interface FormErrors {
  stepProfanityError: boolean;
  stepInputError: boolean;
  tooltipError: boolean;
  slowPlaybackTimeError: boolean;
}

export interface UIState {
  disableTooltipSubmitBtn: boolean;
  isMounted: boolean;
}

export interface EditableStepFormState {
  formFields: FormFields;
  errors: FormErrors;
  uiState: UIState;
  currentEditingIndex: number | null;
  isUpdateMode: boolean;
  recordingId: number | null;
}

/**
 * Initial state
 */
const getInitialState = (): EditableStepFormState => ({
  formFields: {
    stepEditValue: '',
    tooltip: '',
    slowPlaybackTime: '',
    customMetadata: {},
  },
  errors: {
    stepProfanityError: false,
    stepInputError: false,
    tooltipError: false,
    slowPlaybackTimeError: false,
  },
  uiState: {
    disableTooltipSubmitBtn: true,
    isMounted: true,
  },
  currentEditingIndex: null,
  isUpdateMode: false,
  recordingId: null,
});

/**
 * Load state from localStorage
 */
const loadStateFromStorage = (): EditableStepFormState => {
  try {
    const serializedState = localStorage.getItem('editableStepFormState');
    if (serializedState === null) {
      return getInitialState();
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading editable step form state from localStorage:', err);
    return getInitialState();
  }
};

/**
 * Save state to localStorage
 */
const saveStateToStorage = (state: EditableStepFormState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('editableStepFormState', serializedState);
  } catch (err) {
    console.error('Error saving editable step form state to localStorage:', err);
  }
};

/**
 * Initialize state - can be from localStorage or fresh
 */
const initialState: EditableStepFormState = getInitialState();

/**
 * Payload types for actions
 */
interface InitializeFormPayload {
  item: any;
  index: number;
  isUpdateMode: boolean;
  recordingId?: number;
}

interface UpdateFieldPayload {
  value: string | number | Record<string, any>;
}

interface UpdateCustomMetadataPayload {
  key: string;
  value: any;
}

interface SetErrorPayload {
  hasError: boolean;
}

/**
 * EditableStepForm Slice
 */
export const editableStepFormSlice = createSlice({
  name: 'editableStepForm',
  initialState,
  reducers: {
    /**
     * Initialize form with item data
     */
    initializeFormForStep: (state, action: PayloadAction<InitializeFormPayload>) => {
      const { item, index, isUpdateMode, recordingId } = action.payload;

      // Parse objectdata to get initial values
      let objectData: any = {};
      try {
        objectData = typeof item?.objectdata === 'string'
          ? JSON.parse(item.objectdata)
          : item?.objectdata || {};
      } catch (e) {
        console.error('Error parsing objectdata:', e);
      }

      // Get the display text from meta or use clickednodename as fallback
      const displayText = objectData?.meta?.displayText || item?.clickednodename || '';

      // Get tooltip info from meta
      const tooltipInfo = objectData?.meta?.tooltipInfo || '';

      // Get slow playback time from meta
      const playbackTime = objectData?.meta?.slowPlaybackTime || '';

      const newState: EditableStepFormState = {
        formFields: {
          stepEditValue: displayText,
          tooltip: tooltipInfo,
          slowPlaybackTime: playbackTime.toString(),
          customMetadata: {},
        },
        errors: {
          stepProfanityError: false,
          stepInputError: false,
          tooltipError: false,
          slowPlaybackTimeError: false,
        },
        uiState: {
          disableTooltipSubmitBtn: tooltipInfo === '',
          isMounted: true,
        },
        currentEditingIndex: index,
        isUpdateMode,
        recordingId: recordingId || null,
      };

      saveStateToStorage(newState);
      return newState;
    },

    /**
     * Reset form to initial state
     */
    resetForm: (state) => {
      const newState = getInitialState();
      saveStateToStorage(newState);
      return newState;
    },

    /**
     * Update step name
     */
    updateStepName: (state, action: PayloadAction<string>) => {
      state.formFields.stepEditValue = action.payload;
      saveStateToStorage(state);
    },

    /**
     * Update tooltip
     */
    updateTooltip: (state, action: PayloadAction<string>) => {
      state.formFields.tooltip = action.payload;
      saveStateToStorage(state);
    },

    /**
     * Update slow playback time
     */
    updateSlowPlaybackTime: (state, action: PayloadAction<string>) => {
      state.formFields.slowPlaybackTime = action.payload;
      saveStateToStorage(state);
    },

    /**
     * Update custom metadata
     */
    updateCustomMetadata: (state, action: PayloadAction<UpdateCustomMetadataPayload>) => {
      const { key, value } = action.payload;
      state.formFields.customMetadata[key] = value;
      saveStateToStorage(state);
    },

    /**
     * Clear custom metadata field
     */
    clearCustomMetadata: (state, action: PayloadAction<string>) => {
      delete state.formFields.customMetadata[action.payload];
      saveStateToStorage(state);
    },

    /**
     * Set step profanity error
     */
    setStepProfanityError: (state, action: PayloadAction<boolean>) => {
      state.errors.stepProfanityError = action.payload;
      saveStateToStorage(state);
    },

    /**
     * Set step input error
     */
    setStepInputError: (state, action: PayloadAction<boolean>) => {
      state.errors.stepInputError = action.payload;
      saveStateToStorage(state);
    },

    /**
     * Set tooltip error
     */
    setTooltipError: (state, action: PayloadAction<boolean>) => {
      state.errors.tooltipError = action.payload;
      saveStateToStorage(state);
    },

    /**
     * Set slow playback time error
     */
    setSlowPlaybackTimeError: (state, action: PayloadAction<boolean>) => {
      state.errors.slowPlaybackTimeError = action.payload;
      saveStateToStorage(state);
    },

    /**
     * Set disable tooltip submit button
     */
    setDisableTooltipSubmit: (state, action: PayloadAction<boolean>) => {
      state.uiState.disableTooltipSubmitBtn = action.payload;
      saveStateToStorage(state);
    },

    /**
     * Set mounted state
     */
    setMountedState: (state, action: PayloadAction<boolean>) => {
      state.uiState.isMounted = action.payload;
      saveStateToStorage(state);
    },

    /**
     * Update all errors at once
     */
    setAllErrors: (state, action: PayloadAction<Partial<FormErrors>>) => {
      state.errors = { ...state.errors, ...action.payload };
      saveStateToStorage(state);
    },
  },
});

// Export actions
export const {
  initializeFormForStep,
  resetForm,
  updateStepName,
  updateTooltip,
  updateSlowPlaybackTime,
  updateCustomMetadata,
  clearCustomMetadata,
  setStepProfanityError,
  setStepInputError,
  setTooltipError,
  setSlowPlaybackTimeError,
  setDisableTooltipSubmit,
  setMountedState,
  setAllErrors,
} = editableStepFormSlice.actions;

// Export reducer
export default editableStepFormSlice.reducer;
