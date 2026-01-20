import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '../utils/storageHelper';

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

export interface EditingWorkflowState {
  isEditing: boolean;
  originalStepData: any | null;
  draftChanges: any | null;
  validationRequired: boolean;
  validationCompleted: boolean;
  validationInProgress: boolean;
}

export interface EditableStepFormState {
  formFields: FormFields;
  errors: FormErrors;
  uiState: UIState;
  editingWorkflow: EditingWorkflowState;
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
  editingWorkflow: {
    isEditing: false,
    originalStepData: null,
    draftChanges: null,
    validationRequired: false,
    validationCompleted: false,
    validationInProgress: false,
  },
  currentEditingIndex: null,
  isUpdateMode: false,
  recordingId: null,
});

/**
 * Load state from storage (works in service workers and web)
 */
const loadStateFromStorage = (): EditableStepFormState => {
  return loadFromStorage('editableStepFormState', getInitialState());
};

/**
 * Save state to storage (works in service workers and web)
 */
const saveStateToStorage = (state: EditableStepFormState) => {
  saveToStorage('editableStepFormState', state);
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

interface StartStepEditingPayload {
  index: number;
  stepData: any;
  recordingId: number;
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

      // Initialize state with draft changes separate from persistent data
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
        editingWorkflow: {
          isEditing: isUpdateMode, // Only true if in update mode
          originalStepData: item,
          draftChanges: item, // Initially same as original
          validationRequired: false,
          validationCompleted: false,
          validationInProgress: false,
        },
        currentEditingIndex: index,
        isUpdateMode,
        recordingId: recordingId || null,
      };

      saveStateToStorage(newState);
      return newState;
    },

    /**
     * Start editing a step (explicit action for update mode)
     */
    startStepEditing: (state, action: PayloadAction<StartStepEditingPayload>) => {
      const { index, stepData, recordingId } = action.payload;

      state.currentEditingIndex = index;
      state.isUpdateMode = true;
      state.recordingId = recordingId;

      state.editingWorkflow = {
        isEditing: true,
        originalStepData: stepData,
        draftChanges: stepData,
        validationRequired: false,
        validationCompleted: false,
        validationInProgress: false,
      };

      // Also initialize form fields from the data
      // This logic is duplicated from initializeFormForStep but necessary to keep fields in sync
      let objectData: any = {};
      try {
        objectData = typeof stepData?.objectdata === 'string'
          ? JSON.parse(stepData.objectdata)
          : stepData?.objectdata || {};
      } catch (e) {
        // ignore
      }

      state.formFields.stepEditValue = objectData?.meta?.displayText || stepData?.clickednodename || '';
      state.formFields.tooltip = objectData?.meta?.tooltipInfo || '';
      state.formFields.slowPlaybackTime = (objectData?.meta?.slowPlaybackTime || '').toString();

      saveStateToStorage(state);
    },

    /**
     * Update draft changes (temporary storage)
     */
    updateDraftChanges: (state, action: PayloadAction<any>) => {
      state.editingWorkflow.draftChanges = action.payload;
      // Changes to draft imply validation is now required
      state.editingWorkflow.validationRequired = true;
      state.editingWorkflow.validationCompleted = false;
      saveStateToStorage(state);
    },

    /**
     * Start validation control
     */
    startValidation: (state, action: PayloadAction<number | void>) => {
      state.editingWorkflow.validationRequired = true;
      state.editingWorkflow.validationInProgress = true;
      state.editingWorkflow.validationCompleted = false;
      saveStateToStorage(state);
    },

    /**
     * Mark validation as completed
     */
    markValidationCompleted: (state) => {
      state.editingWorkflow.validationCompleted = true;
      state.editingWorkflow.validationInProgress = false;
      // Once validated, we don't strictly require re-validation unless changes happen
      // But we keep validationRequired=true to indicate "requires validation logic to run"
      // vs validationCompleted=true meaning "it ran successfully"
      saveStateToStorage(state);
    },

    /**
     * Cancel editing - revert to original state
     */
    cancelStepEditing: (state) => {
      state.isUpdateMode = false;
      state.editingWorkflow = {
        isEditing: false,
        originalStepData: null,
        draftChanges: null,
        validationRequired: false,
        validationCompleted: false,
        validationInProgress: false,
      };
      state.currentEditingIndex = null;
      saveStateToStorage(state);
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
      // Updating field marks validation as required
      if (state.isUpdateMode) {
        state.editingWorkflow.validationRequired = true;
        state.editingWorkflow.validationCompleted = false;

        // Also update draft changes if they exist
        if (state.editingWorkflow.draftChanges) {
          let objectData: any = {};
          try {
            // If existing objectdata is string, parse it
            const currentObj = state.editingWorkflow.draftChanges.objectdata;
            objectData = typeof currentObj === 'string' ? JSON.parse(currentObj) : currentObj || {};

            // Update meta display text
            if (!objectData.meta) objectData.meta = {};
            objectData.meta.displayText = action.payload;

            // Update drafted objectdata
            state.editingWorkflow.draftChanges.objectdata = JSON.stringify(objectData);
            // Also update clickednodename as fallback
            state.editingWorkflow.draftChanges.clickednodename = action.payload;
          } catch (e) {
            console.error("Error updating draft step name", e);
          }
        }
      }
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
  startStepEditing,
  updateDraftChanges,
  startValidation,
  markValidationCompleted,
  cancelStepEditing,
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
