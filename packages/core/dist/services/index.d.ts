/**
 * Services Index
 *
 * Central export point for all services in the core SDK.
 * This provides a clean interface for importing services
 * and ensures consistent service initialization.
 */
export { apiClient, processUrlParams } from './apiClient';
export { SearchService, searchService } from './SearchService';
export type { SearchRequest, FetchRecordRequest } from './SearchService';
export type { RootState, AppDispatch } from '../store';
