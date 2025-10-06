// Export the API client and related types
export { ApiClient, apiClient } from './apiClient';
export type { ApiClientConfig, ApiResponse, ApiError } from './apiClient';

// Export SearchService with dependency injection
export { 
  SearchService, 
  createSearchService,
  createSearchServiceFunctions
} from './SearchService';
export type { 
  SearchRequest, 
  RecordRequest, 
  SearchServiceDependencies 
} from './SearchService';

// Export user services
export { getUserId, getSessionKey, getUserSessionId } from './userService';

// Export tracking services
export { recordUserClickData, userClick } from './trackingService';
