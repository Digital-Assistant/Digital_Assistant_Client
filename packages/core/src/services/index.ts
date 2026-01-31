// Export the API client and related types
export { ApiClient, apiClient } from './apiClient';
export type { ApiClientConfig, ApiResponse, ApiError } from './apiClient';

// Export SearchService functions (direct usage)
export { TranslateService } from './TranslateService';
export {
  fetchSearchResults,
  fetchRecord,
  fetchSpecialNodes
} from './SearchService';
export type {
  SearchRequest,
  RecordRequest
} from './SearchService';

// Export RecordService functions
export {
  recordClicks,
  updateRecordClicks,
  updateSequnceIndex,
  recordSequence,
  postRecordSequenceData,
  updateRecordSequenceData,
  prepareRecordSequencePayload,
  // userClick as recordUserClick, // alias to avoid clash with trackingService export name
  deleteRecording,
  updateRecording,
  fetchStatuses,
  profanityCheck,
} from './RecordService';

// Export user services
export { getUserId, getSessionKey, getUserSessionId } from './userService';

// Export tracking services
export { recordUserClickData, userClick } from './trackingService';

// Export user vote services
export * from './UserVote';

// Export StepEditingService functions (with aliases to avoid conflicts with Redux actions)
export {
  validateStepNameWithProfanity,
  updateStepMetadata,
  toggleSkipDuringPlay,
  togglePersonalInfo,
  updateTooltipMetadata,
  updateDelayTimeMetadata,
  updateCustomMetadata as updateCustomMetadataService,  // Aliased to avoid conflict
  saveStepChanges,
  updateStepName as updateStepNameService,  // Aliased to avoid conflict
} from './StepEditingService';
export type {
  UpdateMetadataParams,
  SaveStepParams,
  ServiceResult,
} from './StepEditingService';

// Export AuthManager
export * from './AuthManager';
