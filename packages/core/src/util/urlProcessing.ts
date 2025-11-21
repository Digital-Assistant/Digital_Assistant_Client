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
  if (!url || !request) return url;

  // Preserve hash fragment while operating on base+query
  const [baseAndQuery, hash = ''] = url.split('#');

  // First, replace placeholders like #key# in base/query part
  let processed = baseAndQuery;
  for (const key of Object.keys(request)) {
    const value = request[key];
    if (value !== null && value !== undefined) {
      const placeholder = new RegExp(`#${key}#`, 'g');
      processed = processed.replace(placeholder, encodeURIComponent(String(value)));
    }
  }

  // Apply redaction if requested (request = { param: { redact: true } })
  const [path, queryString = ''] = processed.split('?');
  if (!queryString) {
    // No query to redact; restore hash if any
    return hash ? `${path}#${hash}` : path;
  }

  const params = new URLSearchParams(queryString);
  for (const [key, meta] of Object.entries(request)) {
    if (meta && typeof meta === 'object' && (meta as any).redact === true && params.has(key)) {
      params.set(key, 'REDACTED');
    }
  }

  const finalUrl = `${path}?${params.toString()}`;
  return hash ? `${finalUrl}#${hash}` : finalUrl;
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
