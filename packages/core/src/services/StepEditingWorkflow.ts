/**
 * StepEditingWorkflow
 * Orchestrates the workflow for editing steps including:
 * - initializing editing state
 * - managing draft changes
 * - validating changes
 * - saving/committing changes
 */

import {
    startStepEditing,
    updateDraftChanges,
    startValidation,
    markValidationCompleted,
    cancelStepEditing,
    setAllErrors
} from '../store/slices/editableStepFormSlice';
import {
    validateStepNameWithProfanity,
    saveStepChanges,
    ServiceResult,
    SaveStepParams
} from './StepEditingService';

/**
 * Initiate editing for a specific step
 */
export const initiateStepEditing = (
    dispatch: Function,
    index: number,
    stepData: any,
    recordingId: number
) => {
    dispatch(startStepEditing({
        index,
        stepData,
        recordingId
    }));
};

/**
 * Update step draft data (temporary storage)
 */
export const updateStepDraft = (
    dispatch: Function,
    changes: any
) => {
    dispatch(updateDraftChanges(changes));
};

/**
 * Validate the current step draft
 */
export const validateStepForSave = async (
    dispatch: Function,
    getState: Function
): Promise<ServiceResult> => {
    const state = getState();
    // Access the slice state - assuming it's available at state.editableStepForm
    const formState = state.editableStepForm || state.core?.editableStepForm;

    if (!formState) {
        return { success: false, error: 'Form state not found' };
    }

    const { formFields, isUpdateMode } = formState;

    dispatch(startValidation());

    // Validate step name
    const nameValidation = await validateStepNameWithProfanity(formFields.stepEditValue, true);

    if (!nameValidation.success) {
        dispatch(setAllErrors({ stepProfanityError: true }));
        return { success: false, error: nameValidation.error };
    }

    // Add more validations as needed (tooltip, playback time, etc.)

    dispatch(markValidationCompleted());

    return { success: true };
};

/**
 * Commit validated changes to the server/persistent storage
 */
export const commitValidatedChanges = async (
    dispatch: Function,
    getState: Function,
    recordData: any[]
): Promise<ServiceResult> => {
    const state = getState();
    const formState = state.editableStepForm || state.core?.editableStepForm;

    if (!formState) {
        return { success: false, error: 'Form state not found' };
    }

    const { formFields, currentEditingIndex, isUpdateMode, recordingId, editingWorkflow } = formState;

    if (!editingWorkflow.validationCompleted) {
        return { success: false, error: 'Validation not completed' };
    }

    const saveParams: SaveStepParams = {
        recordData,
        index: currentEditingIndex!,
        stepEditValue: formFields.stepEditValue,
        isUpdateMode,
        recordingId: recordingId || undefined
    };

    const result = await saveStepChanges(saveParams);

    if (result.success) {
        // We don't automatically reset editing here, letting the UI decide when to close
        // But we could dispatch an action to update the "original" data to the new saved data
        // to allow further editing

        // For now, let's just return the result
    }

    return result;
};

/**
 * Cancel editing and revert changes
 */
export const cancelAndRevertChanges = (
    dispatch: Function
) => {
    dispatch(cancelStepEditing());
};
