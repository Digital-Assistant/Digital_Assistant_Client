import { ENDPOINT } from '../config/endpoints';
import { specialNodes } from '../util/specialNodes';
import { processUrlArgs } from '../util/urlProcessing';

/**
 * Search request interface
 */
export interface SearchRequest {
  keyword?: string;
  page: number;
  domain?: string;
  additionalParams?: any;
  userSessionId?: string;
}

/**
 * Record fetch request interface
 */
export interface RecordRequest {
  id?: string;
  domain?: string;
  additionalParams?: any;
  userSessionId?: string;
}

/**
 * Dependencies interface for framework-agnostic SearchService
 */
export interface SearchServiceDependencies {
  httpClient: {
    get: (url: string) => Promise<any>;
    post: (url: string, data?: any) => Promise<any>;
  };
  userService: {
    getUserSessionId: () => string | null | Promise<string | null>;
  };
  trackingService: {
    recordUserClickData: (clickType: string, clickedName: string, recordId?: number) => Promise<any>;
  };
}

/**
 * SearchService class providing search functionality with HTTP request logic
 * This service is part of the Digital Assistant Core SDK and provides framework-agnostic
 * search operations using dependency injection.
 */
export class SearchService {
  private dependencies: SearchServiceDependencies;

  constructor(dependencies: SearchServiceDependencies) {
    this.dependencies = dependencies;
  }
  
  /**
   * Fetches search results from the backend with error handling
   * @param request - Search request parameters
   * @returns Promise that resolves to the search results
   */
  public async fetchSearchResults(request?: SearchRequest): Promise<any> {
    try {
      // Record user click data if keyword is provided
      if (request?.keyword && request.keyword !== "") {
        await this.dependencies.trackingService.recordUserClickData("search", request.keyword);
      }

      // Set user session ID
      const userSessionId = await this.dependencies.userService.getUserSessionId();
      const searchRequest = { ...request, userSessionId: userSessionId || undefined };

      // Clean up null additionalParams
      if (searchRequest.additionalParams === null) {
        delete searchRequest.additionalParams;
      }

      // Determine which endpoint to use based on additionalParams
      let endpoint: string;
      if (searchRequest.additionalParams != null) {
        endpoint = processUrlArgs(ENDPOINT.SearchWithPermissions, searchRequest);
      } else {
        endpoint = processUrlArgs(ENDPOINT.Search, searchRequest);
      }

      // Make API request using injected HTTP client
      const response = await this.dependencies.httpClient.get(endpoint);
      
      if (response !== undefined) {
        return response;
      } else {
        return [];
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown search error';
      console.error('Search service error:', errorMessage);
      throw new Error(`Failed to perform search: ${errorMessage}`);
    }
  }

  /**
   * Fetch a record from the backend with optional additional parameters and error handling
   * @param request - Record fetch request parameters
   * @returns Promise that resolves to the fetched record
   */
  public async fetchRecord(request?: RecordRequest): Promise<any> {
    try {
      if (!request) {
        throw new Error('Request parameter is required');
      }

      // Clean up null additionalParams
      if (request.additionalParams === null) {
        delete request.additionalParams;
      } else if (request.additionalParams != null) {
        // Set user session ID when additionalParams is present
        const userSessionId = await this.dependencies.userService.getUserSessionId();
        request.userSessionId = userSessionId || undefined;
      }

      // Build the URL
      let url = ENDPOINT.fetchRecord;

      // Determine which endpoint variant to use
      if (request.additionalParams != null) {
        url += "/withPermissions";
      }

      // Append id and domain to the URL
      const recordId = request.id || '';
      const domain = request.domain || '';
      url += "/" + recordId + "?domain=" + domain;

      // Append additional parameters if present
      if (request.additionalParams != null && request.userSessionId) {
        url += "&additionalParams=" + encodeURIComponent(request.additionalParams) + 
               "&userSessionId=" + encodeURIComponent(request.userSessionId);
      }

      // Make API request using injected HTTP client
      const response = await this.dependencies.httpClient.get(url);
      return response;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error fetching record:", error);
      throw new Error(`Failed to fetch record: ${errorMessage}`);
    }
  }

  /**
   * Fetch special nodes processing from backend with error handling
   * @param request - Optional parameters for the special nodes request
   * @returns Promise that resolves to the fetched special nodes
   */
  public async fetchSpecialNodes(request?: any): Promise<any> {
    try {
      // For now, return the static specialNodes configuration
      // In the future, this could make an API call if dynamic special nodes are needed
      const endpoint = processUrlArgs(ENDPOINT.SpecialNodes, request || {});
      
      // Currently returning static configuration as per original implementation
      return specialNodes;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error fetching special nodes:", error);
      throw new Error(`Failed to fetch special nodes: ${errorMessage}`);
    }
  }
}

/**
 * Factory function to create SearchService with dependencies
 * @param dependencies - Required dependencies for the service
 * @returns Configured SearchService instance
 */
export const createSearchService = (dependencies: SearchServiceDependencies): SearchService => {
  return new SearchService(dependencies);
};

/**
 * Create functional interface for backward compatibility
 * @param dependencies - Required dependencies for the service
 * @returns Object with search functions
 */
export const createSearchServiceFunctions = (dependencies: SearchServiceDependencies) => {
  const service = new SearchService(dependencies);
  
  return {
    fetchSearchResults: (request?: SearchRequest) => service.fetchSearchResults(request),
    fetchRecord: (request?: RecordRequest) => service.fetchRecord(request),
    fetchSpecialNodes: (request?: any) => service.fetchSpecialNodes(request),
    service
  };
};
