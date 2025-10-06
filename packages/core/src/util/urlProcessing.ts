/**
 * Utility functions for processing URLs with parameter substitution
 */

/**
 * Processes URL by replacing placeholders with actual values from request object
 * @param url - URL template with placeholders (e.g., /search?query=#keyword#)
 * @param request - Object containing values to substitute
 * @returns Processed URL with placeholders replaced
 */
export const processUrlArgs = (url: string, request: any = {}): string => {
  if (!url || !request) {
    return url;
  }

  let processedUrl = url;
  
  // Replace all placeholders in the format #key# with actual values
  Object.keys(request).forEach(key => {
    const placeholder = `#${key}#`;
    const value = request[key];
    
    // Only replace if value is not null or undefined
    if (value !== null && value !== undefined) {
      processedUrl = processedUrl.replace(new RegExp(placeholder, 'g'), encodeURIComponent(value.toString()));
    }
  });

  return processedUrl;
};

/**
 * Builds query parameters string from an object
 * @param params - Object containing query parameters
 * @returns Query string (without leading ?)
 */
export const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams.toString();
};

/**
 * Combines base URL with path and optional query parameters
 * @param baseUrl - Base URL
 * @param path - Path to append
 * @param queryParams - Optional query parameters object
 * @returns Complete URL
 */
export const buildUrl = (baseUrl: string, path: string, queryParams?: Record<string, any>): string => {
  let url = baseUrl;
  
  // Ensure proper path joining
  if (!url.endsWith('/') && !path.startsWith('/')) {
    url += '/';
  }
  url += path;
  
  // Add query parameters if provided
  if (queryParams) {
    const queryString = buildQueryParams(queryParams);
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }
  
  return url;
};
