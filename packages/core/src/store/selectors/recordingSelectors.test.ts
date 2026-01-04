// Import the selectors to be tested
import { getRecordingState, getRecSequenceData } from './recordingSelectors';
import type { RootState } from '../../store';
import type { RecordingState } from '../slices/recordingSlice'; // Import the actual type

// Import the actual types for other slices to create accurate mock states
// import type { EditingStepState } from '../slices/editingSlice';
import type { ValidationState } from '../slices/validationSlice';
import type { UserState } from '../slices/userSlice';
import type { FlowState } from '../slices/flowSlice';
import type { EditableStepFormState } from '../slices/editableStepFormSlice';

describe('recordingSelectors', () => {
  // Create a mock recording state that fully conforms to the RecordingState interface
  const createMockRecordingState = (overrides?: Partial<RecordingState>): RecordingState => ({
    isRecording: false,
    isPlaying: 'off',
    manualPlay: 'off',
    playDelay: 'off',
    recSequenceData: [],
    selectedRecordingDetails: null,
    showRecord: false,
    showLoader: false,
    ...overrides,
  });

  // Create dummy mock states for other slices to satisfy RootState
  /*
  const mockEditingState: EditingStepState = {
    recordingId: null,
    editingStepId: null,
    validationRequired: false,
    validationCompleted: false,
    editingStepOriginalData: null,
  };
  */

  const mockValidationState: ValidationState = {
    recordingId: null,
    validationRequired: false,
    validationCompleted: false,
  };

  const mockUserState: UserState = {
    // UserState has optional properties, so an empty object is a valid minimal state
  };

  const mockFlowState: FlowState = {
    searchKeyword: '',
    searchResults: [],
    page: 0,
    hasMorePages: true,
    reFetchSearch: 'off',
    showSearch: true,
    recordSequenceDetailsVisibility: false,
  };

  const mockEditableStepFormState: EditableStepFormState = {
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
    editingWorkflow: {
      isEditing: false,
      originalStepData: null,
      draftChanges: null,
      validationRequired: false,
      validationCompleted: false,
      validationInProgress: false
    }
  };

  // Create a mock root state for testing
  const mockState: RootState = {
    // editing: mockEditingState,
    validation: mockValidationState,
    user: mockUserState,
    editableStepForm: mockEditableStepFormState,
    recording: createMockRecordingState({
      recSequenceData: [
        { id: 1, action: 'click' },
        { id: 2, action: 'type' },
      ],
    }),
    flow: mockFlowState,
  };

  describe('getRecordingState', () => {
    it('should return the entire recording slice from the state', () => {
      // Act
      const recordingState = getRecordingState(mockState);

      // Assert
      expect(recordingState).toEqual(mockState.recording);
    });

    it('should return a default or initial state if the slice is empty', () => {
      // Arrange
      const emptyState: RootState = {
        // editing: mockEditingState,
        validation: mockValidationState,
        user: mockUserState,
        editableStepForm: mockEditableStepFormState,
        recording: createMockRecordingState({ recSequenceData: [] }),
        flow: mockFlowState,
      };

      // Act
      const recordingState = getRecordingState(emptyState);

      // Assert
      expect(recordingState).toEqual(createMockRecordingState({ recSequenceData: [] }));
    });
  });

  describe('getRecSequenceData', () => {
    it('should return the recSequenceData array from the recording slice', () => {
      // Act
      const sequenceData = getRecSequenceData(mockState);

      // Assert
      expect(sequenceData).toEqual(mockState.recording.recSequenceData);
      expect(sequenceData.length).toBe(2);
    });

    it('should return an empty array if recSequenceData is empty', () => {
      // Arrange
      const emptyState: RootState = {
        // editing: mockEditingState,
        validation: mockValidationState,
        user: mockUserState,
        editableStepForm: mockEditableStepFormState,
        recording: createMockRecordingState({ recSequenceData: [] }),
        flow: mockFlowState,
      };

      // Act
      const sequenceData = getRecSequenceData(emptyState);

      // Assert
      expect(sequenceData).toEqual([]);
      expect(sequenceData.length).toBe(0);
    });

    it('should not be affected by other state slices', () => {
      // Arrange - create a state where other slices might have different data
      const stateWithOtherData: RootState = {
        // editing: { ...mockEditingState, validationRequired: true }, // Example override
        validation: { ...mockValidationState, validationCompleted: true }, // Example override
        user: { ...mockUserState, userSessionData: { authData: { id: '123' } } }, // Example override
        editableStepForm: mockEditableStepFormState,
        recording: mockState.recording, // Keep recording slice the same for this test
        flow: { ...mockFlowState, searchKeyword: 'test' }, // Example override
      };

      // Act
      const sequenceData = getRecSequenceData(stateWithOtherData);

      // Assert
      expect(sequenceData).toEqual(mockState.recording.recSequenceData);
    });
  });
});
