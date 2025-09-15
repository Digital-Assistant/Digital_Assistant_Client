import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { store } from '../store';

/**
 * Central API client instance that automatically handles authentication
 * for all outgoing requests by attaching JWT tokens from the Redux store.
 * 
 * This client provides a single point of configuration for:
 * - Base URL configuration
 * - Request/response interceptors
 * - Error handling
 * - Authentication header injection
 * 
 * @example
 * ```typescript
 * import { apiClient } from './apiClient';
 * 
 * // All requests automatically include JWT authentication
 * const response = await apiClient.get('/api/search');
 * const data = await apiClient.post('/api/flows', flowData);
 * ```
 */

/**
 * Creates and configures the central Axios instance
 * @returns Configured Axios instance with authentication interceptor
 */
const createApiClient = (): AxiosInstance => {
  // Create base Axios instance
  const client = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
      ? process.env.baseProdURL 
      : process.env.baseTestURL || process.env.baseProdURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add authentication headers
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get current user state from Redux store
      const state = store.getState();
      
      // Check for JWT token in user session data
      const userSessionData = state.user.userSessionData;
      const keycloakSessionData = state.user.keycloakSessionData;
      
      // Priority: userSessionData.authData.token, then keycloakSessionData.token
      let token: string | null = null;
      
      if (userSessionData?.authData?.token) {
        token = userSessionData.authData.token;
      } else if (keycloakSessionData?.token) {
        token = keycloakSessionData.token;
      }

      // Attach Bearer token if available
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add custom realm header if configured
      const globalConfig = (global as any).UDAGlobalConfig;
      if (globalConfig?.realm && globalConfig.realm !== 'UDAN') {
        config.headers['UDAN-Realm'] = globalConfig.realm;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for centralized error handling
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle 401 unauthorized responses
      if (error.response?.status === 401) {
        // Trigger token refresh event (similar to existing pattern)
        const event = new CustomEvent('UDAGetNewToken', {
          detail: { data: 'UDAGetNewToken' }
        });
        window.dispatchEvent(event);
      }

      // Transform error messages to match existing patterns
      const status = error.response?.status;
      let errorMessage = error.message;

      switch (status) {
        case 400:
          errorMessage = 'Bad Request - The request was malformed or invalid';
          break;
        case 401:
          errorMessage = 'Unauthorized - Authentication required';
          break;
        case 403:
          errorMessage = 'Forbidden - You do not have permission to access this resource';
          break;
        case 404:
          errorMessage = 'Not Found - The requested resource does not exist';
          break;
        case 408:
          errorMessage = 'Request Timeout - The server timed out waiting for the request';
          break;
        case 429:
          errorMessage = 'Too Many Requests - Rate limit exceeded';
          break;
        case 500:
          errorMessage = 'Internal Server Error - Something went wrong on the server';
          break;
        case 502:
          errorMessage = 'Bad Gateway - Invalid response from upstream server';
          break;
        case 503:
          errorMessage = 'Service Unavailable - The server is temporarily unavailable';
          break;
        case 504:
          errorMessage = 'Gateway Timeout - The upstream server timed out';
          break;
      }

      return Promise.reject(new Error(errorMessage));
    }
  );

  return client;
};

/**
 * Central API client instance - singleton that all services should use
 * for making authenticated HTTP requests.
 */
export const apiClient = createApiClient();

/**
 * Utility function to process dynamic URL parameters
 * Replaces placeholders in format #key# with values from the provided object
 * 
 * @param url - URL template with placeholders
 * @param params - Object containing replacement values
 * @returns Processed URL with placeholders replaced
 * 
 * @example
 * ```typescript
 * const url = processUrlParams('/api/users/#userId#/flows/#flowId#', 
 *   { userId: '123', flowId: '456' });
 * // Returns: '/api/users/123/flows/456'
 * ```
 */
export const processUrlParams = (url: string, params: Record<string, any>): string => {
  return url.replace(/#([^#]+)#/g, (_, key) => params[key] !== undefined ? params[key] : '');
};
