import { apiClient, processUrlParams } from './apiClient';

/**
 * Search Service
 * 
 * Provides search functionality using the central API client with automatic
 * JWT authentication. This service handles all search-related operations
 * including keyword search, record fetching, and special nodes processing.
 * 
 * @example
 * ```typescript
 * const searchService = new SearchService();
 * const results = await searchService.fetchSearchResults({
 *   keyword: 'digital assistant',
 *   page: 1,
 *   domain: 'udan'
 * });
 * ```
 */

/**
 * Interface for search request parameters
 */
export interface SearchRequest {
  /** The search keyword to record user click data */
  keyword?: string;
  /** The page number for the search results */
  page: number;
  /** The domain to filter the search results */
  domain?: string;
  /** Any additional parameters to include in the search request */
  additionalParams?: any;
  /** The user's session ID (automatically populated) */
  userSessionId?: string;
}

/**
 * Interface for record fetch request parameters
 */
export interface FetchRecordRequest {
  /** The ID of the record to fetch */
  id?: string;
  /** The domain to filter the record */
  domain?: string;
  /** Any additional parameters to include in the record fetch request */
  additionalParams?: any;
  /** The user's session ID (automatically populated) */
  userSessionId?: string;
}

/**
 * SearchService class providing search operations using the central API client
 */
export class SearchService {
  
  /**
   * Fetches search results from the backend with error handling.
   * Automatically records user click data and handles authentication.
   *
   * @param request - Search request parameters
   * @returns A promise that resolves to the search results
   * @throws Error if the search operation fails
   */
  async fetchSearchResults(request: SearchRequest): Promise<any[]> {
    try {
      // Record user click data if keyword is provided
      if (request?.keyword && request.keyword !== '') {
        // Note: This would need to be imported from the appropriate service
        // recordUserClickData('search', request.keyword);
      }

      // Clean up null additionalParams
      if (request.additionalParams === null) {
        delete request.additionalParams;
      }

      // Determine which endpoint to use based on additionalParams
      let endpoint: string;
      if (request.additionalParams != null) {
        endpoint = '/api/search/withPermissions';
      } else {
        endpoint = '/api/search';
      }

      // Process URL with dynamic parameters
      const url = processUrlParams(endpoint, request);

      // Make API call using central client
      const response = await apiClient.get(url, {
        params: request.additionalParams ? {
          ...request.additionalParams,
          userSessionId: request.userSessionId
        } : undefined
      });

      return response.data || [];

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown search error';
      console.error('Search service error:', errorMessage);
      throw new Error(`Failed to perform search: ${errorMessage}`);
    }
  }

  /**
   * Fetch a record from the backend with optional additional parameters and error handling.
   * 
   * @param request - Record fetch request parameters
   * @returns A promise that resolves to the fetched record
   * @throws Error if the fetch operation fails
   */
  async fetchRecord(request: FetchRecordRequest): Promise<any> {
    try {
      // Clean up null additionalParams
      if (request.additionalParams === null) {
        delete request.additionalParams;
      }

      // Base endpoint
      let endpoint = '/api/record';

      // Add permissions path if additionalParams is present
      if (request.additionalParams != null) {
        endpoint += '/withPermissions';
      }

      // Construct the full URL
      const url = `${endpoint}/${request.id}`;

      // Prepare query parameters
      const params: any = {
        domain: request.domain
      };

      // Add additional parameters if present
      if (request.additionalParams != null) {
        params.additionalParams = request.additionalParams;
        params.userSessionId = request.userSessionId;
      }

      // Make API call using central client
      const response = await apiClient.get(url, { params });

      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching record:', errorMessage);
      throw new Error(`Failed to fetch record: ${errorMessage}`);
    }
  }

  /**
   * Fetch special nodes processing from backend with error handling.
   * 
   * @param request - Parameters for the special nodes request
   * @returns A promise that resolves to the fetched special nodes
   * @throws Error if the fetch operation fails
   */
  async fetchSpecialNodes(request?: any): Promise<any> {
    try {
      const endpoint = '/api/specialNodes';
      const url = processUrlParams(endpoint, request || {});

      const response = await apiClient.get(url);

      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching special nodes:', errorMessage);
      throw new Error(`Failed to fetch special nodes: ${errorMessage}`);
    }
  }
}

/**
 * Default export - singleton instance of SearchService
 */
export const searchService = new SearchService();

export default SearchService;
