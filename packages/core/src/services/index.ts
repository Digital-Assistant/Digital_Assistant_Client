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

// Export user services
export { getUserId, getSessionKey, getUserSessionId } from './userService';

// Export tracking services
export { recordUserClickData, userClick } from './trackingService';
