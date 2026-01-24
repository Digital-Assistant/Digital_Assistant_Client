import axios from 'axios';
import { store } from '../store';
import type { RootState } from '../store';
import { specialNodes } from "../util";
import { CONFIG } from '../config';

/**
 * Configuration options for the API client
 */
export interface ApiClientConfig {
    baseURL?: string;
    timeout?: number;
    additionalHeaders?: Record<string, string>;
}

/**
 * Response wrapper for API calls
 */
export interface ApiResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
}

/**
 * Error structure for API errors
 */
export interface ApiError {
    message: string;
    status?: number;
    code?: string;
    data?: any;
}

/**
 * Central API Client for Digital Assistant SDK
 * 
 * This class provides a centralized HTTP client with automatic JWT authentication
 * for all internal SDK services. It reads the JWT token from the Redux store
 * and attaches it to every outgoing request.
 * 
 * Features:
 * - Automatic JWT token attachment from centralized state
 * - Request/Response interceptors for authentication
 * - Error handling for 401 responses
 * - Environment-aware base URL configuration
 * - TypeScript support with proper type definitions
 * 
 * Usage:
 * ```typescript
 * import { apiClient } from '@digital-assistant/core';
 * 
 * // Make authenticated requests
 * const response = await apiClient.get('/api/user/profile');
 * const data = await apiClient.post('/api/data', { payload });
 * ```
 */
export class ApiClient {
    private axiosInstance: any;
    private config: ApiClientConfig;

    constructor(config: ApiClientConfig = {}) {
        this.config = {
            timeout: 30000,
            ...config
        };

        // Determine base URL from environment variables (logic mirrored from invokeApi.ts)
        const baseProdURL = process.env.baseProdURL;
        const baseTestURL = process.env.baseTestURL;

        let envBaseURL = baseProdURL;
        if (CONFIG.current === 'TEST') {
            envBaseURL = baseTestURL;
        }

        // Use provided baseURL from config or fall back to determined environment URL
        const resolvedBaseURL = this.config.baseURL || envBaseURL;

        // Create Axios instance
        this.axiosInstance = axios.create({
            baseURL: resolvedBaseURL,
            timeout: this.config.timeout,
            headers: {
                'Content-Type': 'application/json',
                ...this.config.additionalHeaders
            }
        });

        this.setupRequestInterceptor();
        this.setupResponseInterceptor();
    }

    /**
     * Setup request interceptor to automatically attach JWT token and realm headers
     * Matches the original getHTTPHeaders functionality from UI services
     */
    private setupRequestInterceptor(): void {
        this.axiosInstance.interceptors.request.use(
            (config: any) => {
                // Get current state from Redux store
                const state: RootState = (store as any).getState();
                const userState = state.user;

                // Initialize headers
                config.headers = config.headers || {};

                // Extract JWT token from user state - prioritize Keycloak
                let token: string | null = null;

                // 1. Prioritize Keycloak session data
                if (userState.keycloakSessionData?.token) {
                    token = userState.keycloakSessionData.token;
                }
                // 2. Fall back to userSessionData.authData
                else if (userState.userSessionData?.authData) {
                    try {
                        // Handle case where authData is a stringified JSON
                        const authData = typeof userState.userSessionData.authData === 'string'
                            ? JSON.parse(userState.userSessionData.authData)
                            : userState.userSessionData.authData;

                        token = authData?.authData?.token || authData?.token || null;
                    } catch (e) { /* Ignore parsing errors */ }
                }
                // 3. Fall back to direct token in userData
                else if (userState.userData?.token) {
                    token = userState.userData.token;
                }

                // Attach Authorization header if token exists
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Add UDAN-Realm header if realm is not default (matches original logic)
                // Access global UDAGlobalConfig like the original implementation
                if (typeof window !== 'undefined' && (window as any).UDAGlobalConfig) {
                    const globalConfig = (window as any).UDAGlobalConfig;
                    if (globalConfig.realm && globalConfig.realm !== 'UDAN') {
                        config.headers['UDAN-Realm'] = globalConfig.realm;
                    }
                }

                // Add SDK identifier header
                config.headers['X-SDK-Client'] = '@digital-assistant/core';

                return config;
            },
            (error: any) => {
                return Promise.reject(error);
            }
        );
    }

    /**
     * Setup response interceptor for error handling
     */
    private setupResponseInterceptor(): void {
        this.axiosInstance.interceptors.response.use(
            (response: any) => {
                return response;
            },
            (error: any) => {
                const apiError: ApiError = {
                    message: error.message || 'An unknown error occurred',
                    status: error.response?.status,
                    code: error.code,
                    data: error.response?.data
                };

                // Handle specific HTTP status codes
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            apiError.message = 'Unauthorized - Authentication required or token expired';
                            // Dispatch event for token refresh if needed
                            this.handleUnauthorizedError();
                            break;
                        case 403:
                            apiError.message = 'Forbidden - Insufficient permissions';
                            break;
                        case 404:
                            apiError.message = 'Not Found - The requested resource does not exist';
                            break;
                        case 408:
                            apiError.message = 'Request Timeout - The server timed out waiting for the request';
                            break;
                        case 429:
                            apiError.message = 'Too Many Requests - Rate limit exceeded';
                            break;
                        case 500:
                            apiError.message = 'Internal Server Error - Something went wrong on the server';
                            break;
                        case 502:
                            apiError.message = 'Bad Gateway - Invalid response from upstream server';
                            break;
                        case 503:
                            apiError.message = 'Service Unavailable - The server is temporarily unavailable';
                            break;
                        case 504:
                            apiError.message = 'Gateway Timeout - The upstream server timed out';
                            break;
                        default:
                            apiError.message = `HTTP Error ${error.response.status}: ${error.response.statusText}`;
                    }
                }

                return Promise.reject(apiError);
            }
        );
    }

    /**
     * Handle 401 Unauthorized errors
     * This could trigger token refresh or logout depending on SDK configuration
     */
    private handleUnauthorizedError(): void {
        // For now, just log the error
        // In the future, this could dispatch Redux actions for token refresh
        console.warn('API Client: Unauthorized request detected. Token may be expired.');

        // Could emit custom events for handling in the main application
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('digital-assistant:unauthorized', {
                detail: { source: 'api-client', timestamp: Date.now() }
            }));
        }
    }

    /**
     * Update the base URL for the API client
     */
    public updateBaseURL(baseURL: string): void {
        this.axiosInstance.defaults.baseURL = baseURL;
        this.config.baseURL = baseURL;
    }

    /**
     * Update additional headers
     */
    public updateHeaders(headers: Record<string, string>): void {
        this.axiosInstance.defaults.headers.common = {
            ...this.axiosInstance.defaults.headers.common,
            ...headers
        };
    }

    /**
     * Generic GET request
     */
    public async get<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
        const response = await this.axiosInstance.get(url, config);
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText
        };
    }

    /**
     * Generic POST request
     */
    public async post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
        const response = await this.axiosInstance.post(url, data, config);
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText
        };
    }

    /**
     * Generic PUT request
     */
    public async put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
        const response = await this.axiosInstance.put(url, data, config);
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText
        };
    }

    /**
     * Generic PATCH request
     */
    public async patch<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
        const response = await this.axiosInstance.patch(url, data, config);
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText
        };
    }

    /**
     * Generic DELETE request
     */
    public async delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
        const response = await this.axiosInstance.delete(url, config);
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText
        };
    }

    /**
     * Get the underlying Axios instance for advanced usage
     */
    public getAxiosInstance(): any {
        return this.axiosInstance;
    }

    /**
     * Mock method to simulate fetching special nodes
     */
    public async fetchSpecialNodes(): Promise<any> {
        // Replace this with an actual API call when the endpoint is available
        console.warn('API Client: Using mock fetchSpecialNodes. Implement real API call.');
        return specialNodes;
    }

    /**
     * Get current configuration
     */
    public getConfig(): ApiClientConfig {
        return { ...this.config };
    }
}

// Create and export the default API client instance
export const apiClient = new ApiClient();

// Export the class for custom instances
export default ApiClient;
