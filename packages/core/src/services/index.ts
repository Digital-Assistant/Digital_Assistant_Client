// Export the API client and related types
export { ApiClient, apiClient } from './apiClient';
export type { ApiClientConfig, ApiResponse, ApiError } from './apiClient';

// Export SearchService functions (direct usage)
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
  userClick as recordUserClick, // alias to avoid clash with trackingService export name
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
