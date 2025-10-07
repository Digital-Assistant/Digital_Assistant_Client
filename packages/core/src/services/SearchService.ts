import { apiClient } from './apiClient';
import { ENDPOINT } from '../config/endpoints';
import { specialNodes } from '../util/specialNodes';
import { processUrlArgs } from '../util/urlProcessing';
import { getUserId } from './userService';
import { recordUserClickData } from './trackingService';

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
 * Fetches search results from the backend with error handling
 * @param request - Search request parameters
 * @returns Promise that resolves to the search results
 */
export const fetchSearchResults = async (request?: SearchRequest): Promise<any> => {
  try {
    // Record user click data if keyword is provided
    if (request?.keyword && request.keyword !== "") {
      await recordUserClickData("search", request.keyword);
    }

    // Set user session ID (matches original implementation)
    if (!request) {
      request = { page: 1 };
    }
    request.userSessionId = (await getUserId()) || undefined;

    // Clean up null additionalParams
    if (request.additionalParams === null) {
      delete request.additionalParams;
    }

    // Determine which endpoint to use based on additionalParams
    let endpoint: string;
    if (request.additionalParams != null) {
      endpoint = processUrlArgs(ENDPOINT.SearchWithPermissions, request);
    } else {
      endpoint = processUrlArgs(ENDPOINT.Search, request);
    }

    // Debug: Log the final request and endpoint
    console.log('SDK SearchService Debug:', { 
      request, 
      endpoint, 
      userSessionId: request.userSessionId 
    });

    // Make API request using centralized apiClient
    const response = await apiClient.get(endpoint);
    
    if (response.data !== undefined) {
      return response.data;
    } else {
      return [];
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown search error';
    console.error('Search service error:', errorMessage);
    throw new Error(`Failed to perform search: ${errorMessage}`);
  }
};

/**
 * Fetch a record from the backend with optional additional parameters and error handling
 * @param request - Record fetch request parameters
 * @returns Promise that resolves to the fetched record
 */
export const fetchRecord = async (request?: RecordRequest): Promise<any> => {
  try {
    if (!request) {
      throw new Error('Request parameter is required');
    }

    // Clean up null additionalParams
    if (request.additionalParams === null) {
      delete request.additionalParams;
    } else if (request.additionalParams != null) {
      // Set user session ID when additionalParams is present
      const userSessionId = await getUserId();
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

    // Make API request using centralized apiClient
    const response = await apiClient.get(url);
    return response.data;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error fetching record:", error);
    throw new Error(`Failed to fetch record: ${errorMessage}`);
  }
};

/**
 * Fetch special nodes processing from backend with error handling
 * @param request - Optional parameters for the special nodes request
 * @returns Promise that resolves to the fetched special nodes
 */
export const fetchSpecialNodes = async (request?: any): Promise<any> => {
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
};
