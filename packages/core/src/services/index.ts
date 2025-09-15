/**
 * Services Index
 * 
 * Central export point for all services in the core SDK.
 * This provides a clean interface for importing services
 * and ensures consistent service initialization.
 */

// Export the central API client
export { apiClient, processUrlParams } from './apiClient';

// Export search service
export { SearchService, searchService } from './SearchService';
export type { SearchRequest, FetchRecordRequest } from './SearchService';

// Re-export types for external use
export type { RootState, AppDispatch } from '../store';
