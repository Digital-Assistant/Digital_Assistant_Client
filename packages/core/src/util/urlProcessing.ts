/**
 * Utility functions for processing URLs, including parameter substitution,
 * query parameter building, and complete URL construction.
 */

/**
 * Processes a URL by replacing placeholders (e.g., `#keyword#`) with actual values
 * from a provided request object. It also supports redacting sensitive query parameters.
 *
 * @param url The URL template with placeholders (e.g., `/search?query=#keyword#`).
 * @param request An object containing values to substitute for placeholders and optional redaction metadata.
 * @returns The processed URL with placeholders replaced and parameters potentially redacted.
 */
export const processUrlArgs = (url: string, request: any = {}): string => {
  if (!url || !request) return url;

  // Preserve the hash fragment while operating on the base and query parts.
  const [baseAndQuery, hash = ''] = url.split('#');

  // First, replace placeholders like #key# in the base/query part.
  let processed = baseAndQuery;
  for (const key of Object.keys(request)) {
    const value = request[key];
    if (value !== null && value !== undefined) {
      const placeholder = new RegExp(`#${key}#`, 'g');
      processed = processed.replace(placeholder, encodeURIComponent(String(value)));
    }
  }

  // Apply redaction if requested (e.g., `request = { param: { redact: true } }`).
  const [path, queryString = ''] = processed.split('?');
  if (!queryString) {
    // If there's no query string to redact, restore the hash if any.
    return hash ? `${path}#${hash}` : path;
  }

  const params = new URLSearchParams(queryString);
  for (const [key, meta] of Object.entries(request)) {
    // Check if the parameter needs to be redacted and exists in the query string.
    if (meta && typeof meta === 'object' && (meta as any).redact === true && params.has(key)) {
      params.set(key, 'REDACTED'); // Redact the parameter's value.
    }
  }

  const finalUrl = `${path}?${params.toString()}`;
  return hash ? `${finalUrl}#${hash}` : finalUrl;
};

/**
 * Builds a query parameters string from an object.
 *
 * @param params An object containing key-value pairs for query parameters.
 * @returns The query string (without a leading '?').
 */
export const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    // Only append parameters that have a non-null, non-undefined, and non-empty string value.
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams.toString();
};

/**
 * Combines a base URL with a path and optional query parameters to form a complete URL.
 *
 * @param baseUrl The base URL.
 * @param path The path to append to the base URL.
 * @param queryParams Optional object containing query parameters.
 * @returns The complete constructed URL.
 */
export const buildUrl = (baseUrl: string, path: string, queryParams?: Record<string, any>): string => {
  let url = baseUrl;
  
  // Ensure proper path joining by adding a slash if necessary.
  if (!url.endsWith('/') && !path.startsWith('/')) {
    url += '/';
  }
  url += path;
  
  // Add query parameters if provided.
  if (queryParams) {
    const queryString = buildQueryParams(queryParams);
    if (queryString) {
      // Append query string, using '?' for the first parameter or '&' for subsequent ones.
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }
  
  return url;
};
