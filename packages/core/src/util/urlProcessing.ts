/**
 * Utility functions for processing URLs, including parameter substitution,
 * query parameter building, and complete URL construction.
 */

/**
 * Processes a URL template by substituting placeholders with values from a given object.
 *
 * This function replaces placeholders in the format `#key#` with corresponding values from the `request` object.
 * If a value is `null` or `undefined`, the placeholder is replaced with an empty string. All substituted values
 * are URI-encoded to ensure a valid URL.
 *
 * The function also supports redacting sensitive query parameters. If a key in the `request` object
 * has a value that is an object with `redact: true`, its corresponding query parameter in the final
 * URL will be replaced with "REDACTED".
 *
 * URL fragments (e.g., `#section`) are preserved and appended to the final URL.
 *
 * @param url The URL template containing placeholders (e.g., `/search?query=#keyword#&page=#page#`).
 * @param request An object where keys match the placeholder names in the URL.
 *   - For simple substitution, the value is a string or number (e.g., `{ keyword: 'test' }`).
 *   - For redaction, the value is an object (e.g., `{ sensitiveParam: { value: 'secret', redact: true } }`).
 * @returns The processed URL with placeholders substituted, values encoded, and specified parameters redacted.
 */
export const processUrlArgs = (url: string, request: any = {}): string => {
  if (!url || !request) return url;

  // Replace placeholders like #key# with values from the request object.
  // This is done before other processing to ensure all placeholders are resolved.
  const processed = url.replace(/#([^#]+)#/g, (_, key) => {
    const value = request[key];
    if (value === null || value === undefined) {
      return '';
    }

    // Handle cases where the value is an object containing the actual value
    // and potentially redaction metadata.
    if (typeof value === 'object' && value.value !== undefined) {
      return encodeURIComponent(String(value.value));
    }

    return encodeURIComponent(String(value));
  });

  // Separate the hash fragment to preserve it during query parameter processing.
  const hashIndex = processed.indexOf('#');
  let hash = '';
  let urlToProcess = processed;
  if (hashIndex !== -1) {
    hash = processed.substring(hashIndex);
    urlToProcess = processed.substring(0, hashIndex);
  }

  const [path, queryString = ''] = urlToProcess.split('?');
  if (!queryString) {
    return processed; // No query string, so nothing to redact or normalize.
  }

  // Process query parameters for redaction.
  const params = new URLSearchParams(queryString);
  for (const [key, meta] of Object.entries(request)) {
    if (meta && typeof meta === 'object' && (meta as any).redact === true && params.has(key)) {
      params.set(key, 'REDACTED');
    }
  }

  // URLSearchParams encodes spaces as '+', but we want '%20' for consistency.
  const paramsString = params.toString().replace(/\+/g, '%20');
  const finalUrl = `${path}?${paramsString}`;
  return finalUrl + hash;
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
