import { ApiClient, apiClient } from '../apiClient';
import { store } from '../../store';
import { setKeycloakSessionData, setUserSessionData, setUserData, clearUserData } from '../../store/slices/userSlice';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('ApiClient', () => {
    let client: ApiClient;
    let mockAxios: MockAdapter;
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
        // Clear store state
        store.dispatch(clearUserData());
        
        // Create a new client instance for each test
        client = new ApiClient({
            baseURL: 'https://api.test.com'
        });
        
        // Create axios mock adapter on the client's axios instance
        mockAxios = new MockAdapter(client.getAxiosInstance());

        // Spy on console.warn to suppress output and allow for assertions
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        // Reset all mocks after each test
        mockAxios.reset();
        // Restore the original console.warn
        consoleWarnSpy.mockRestore();
    });

    afterAll(() => {
        // Restore axios after all tests
        mockAxios.restore();
    });

    describe('Constructor and Configuration', () => {
        it('should create client with default configuration', () => {
            const defaultClient = new ApiClient();
            const config = defaultClient.getConfig();
            
            expect(config.timeout).toBe(30000);
        });

        it('should create client with custom configuration', () => {
            const customConfig = {
                baseURL: 'https://custom.api.com',
                timeout: 60000,
                additionalHeaders: { 'X-Custom': 'header' }
            };
            
            const customClient = new ApiClient(customConfig);
            const config = customClient.getConfig();
            
            expect(config.baseURL).toBe('https://custom.api.com');
            expect(config.timeout).toBe(60000);
            expect(config.additionalHeaders).toEqual({ 'X-Custom': 'header' });
        });

        it('should update base URL after creation', () => {
            const newBaseURL = 'https://new.api.com';
            client.updateBaseURL(newBaseURL);
            
            expect(client.getConfig().baseURL).toBe(newBaseURL);
        });

        it('should update headers after creation', () => {
            const newHeaders = { 'X-Updated': 'header' };
            client.updateHeaders(newHeaders);
            
            // Verify headers were updated on the axios instance
            expect(client.getAxiosInstance().defaults.headers.common).toEqual(
                expect.objectContaining(newHeaders)
            );
        });
    });

    describe('HTTP Methods', () => {
        it('should make GET request', async () => {
            const responseData = { id: 1, name: 'Test User' };
            mockAxios.onGet('/users/1').reply(200, responseData);

            const response = await client.get('/users/1');

            expect(response.status).toBe(200);
            expect(response.data).toEqual(responseData);
        });

        it('should make POST request with data', async () => {
            const postData = { name: 'New User', email: 'user@test.com' };
            const responseData = { id: 2, ...postData };
            mockAxios.onPost('/users', postData).reply(201, responseData);

            const response = await client.post('/users', postData);

            expect(response.status).toBe(201);
            expect(response.data).toEqual(responseData);
        });

        it('should make PUT request', async () => {
            const putData = { name: 'Updated User' };
            const responseData = { id: 1, ...putData };
            mockAxios.onPut('/users/1', putData).reply(200, responseData);

            const response = await client.put('/users/1', putData);

            expect(response.status).toBe(200);
            expect(response.data).toEqual(responseData);
        });

        it('should make PATCH request', async () => {
            const patchData = { status: 'active' };
            const responseData = { id: 1, name: 'User', status: 'active' };
            mockAxios.onPatch('/users/1', patchData).reply(200, responseData);

            const response = await client.patch('/users/1', patchData);

            expect(response.status).toBe(200);
            expect(response.data).toEqual(responseData);
        });

        it('should make DELETE request', async () => {
            mockAxios.onDelete('/users/1').reply(204);

            const response = await client.delete('/users/1');

            expect(response.status).toBe(204);
        });

        it('should handle request with custom config', async () => {
            const responseData = { data: 'test' };
            const customConfig = { timeout: 5000 };
            
            mockAxios.onGet('/test').reply((config) => {
                expect(config.timeout).toBe(5000);
                return [200, responseData];
            });

            const response = await client.get('/test', customConfig);

            expect(response.status).toBe(200);
            expect(response.data).toEqual(responseData);
        });
    });

    describe('Authentication Integration', () => {
        it('should attach JWT token from Keycloak session data', async () => {
            const token = 'keycloak-jwt-token';
            store.dispatch(setKeycloakSessionData({ token }));

            // Create new client to get updated interceptors
            const authenticatedClient = new ApiClient({ baseURL: 'https://api.test.com' });
            const mockAuth = new MockAdapter(authenticatedClient.getAxiosInstance());
            
            mockAuth.onGet('/protected').reply((config) => {
                expect(config.headers?.Authorization).toBe(`Bearer ${token}`);
                expect(config.headers?.['X-SDK-Client']).toBe('@digital-assistant/core');
                return [200, { message: 'authenticated' }];
            });

            const response = await authenticatedClient.get('/protected');

            expect(response.status).toBe(200);
            expect(response.data).toEqual({ message: 'authenticated' });
            
            mockAuth.restore();
        });

        it('should attach JWT token from user session data', async () => {
            const token = 'user-session-token';
            store.dispatch(setUserSessionData({ authData: { token } }));

            const authenticatedClient = new ApiClient({ baseURL: 'https://api.test.com' });
            const mockAuth = new MockAdapter(authenticatedClient.getAxiosInstance());
            
            mockAuth.onGet('/protected').reply((config) => {
                expect(config.headers?.Authorization).toBe(`Bearer ${token}`);
                return [200, { message: 'authenticated' }];
            });

            await authenticatedClient.get('/protected');
            mockAuth.restore();
        });

        it('should attach JWT token from user data', async () => {
            const token = 'user-data-token';
            store.dispatch(setUserData({ token }));

            const authenticatedClient = new ApiClient({ baseURL: 'https://api.test.com' });
            const mockAuth = new MockAdapter(authenticatedClient.getAxiosInstance());
            
            mockAuth.onGet('/protected').reply((config) => {
                expect(config.headers?.Authorization).toBe(`Bearer ${token}`);
                return [200, { message: 'authenticated' }];
            });

            await authenticatedClient.get('/protected');
            mockAuth.restore();
        });

        it('should prioritize Keycloak token over other tokens', async () => {
            const keycloakToken = 'keycloak-priority-token';
            const userToken = 'user-token';
            
            store.dispatch(setKeycloakSessionData({ token: keycloakToken }));
            store.dispatch(setUserSessionData({ authData: { token: userToken } }));

            const authenticatedClient = new ApiClient({ baseURL: 'https://api.test.com' });
            const mockAuth = new MockAdapter(authenticatedClient.getAxiosInstance());
            
            mockAuth.onGet('/protected').reply((config) => {
                expect(config.headers?.Authorization).toBe(`Bearer ${keycloakToken}`);
                return [200, { message: 'authenticated' }];
            });

            await authenticatedClient.get('/protected');
            mockAuth.restore();
        });

        it('should not attach Authorization header when no token exists', async () => {
            store.dispatch(clearUserData());

            const unauthenticatedClient = new ApiClient({ baseURL: 'https://api.test.com' });
            const mockAuth = new MockAdapter(unauthenticatedClient.getAxiosInstance());
            
            mockAuth.onGet('/public').reply((config) => {
                expect(config.headers?.Authorization).toBeUndefined();
                expect(config.headers?.['X-SDK-Client']).toBe('@digital-assistant/core');
                return [200, { message: 'public' }];
            });

            await unauthenticatedClient.get('/public');
            mockAuth.restore();
        });
    });

    describe('Error Handling', () => {
        it('should handle 400 Bad Request error', async () => {
            mockAxios.onGet('/invalid').reply(400, { error: 'Invalid request' });

            await expect(client.get('/invalid')).rejects.toMatchObject({
                message: expect.stringContaining('400'),
                status: 400,
                data: { error: 'Invalid request' }
            });
        });

        it('should handle 401 Unauthorized error and log a warning', async () => {
            mockAxios.onGet('/unauthorized').reply(401);

            await expect(client.get('/unauthorized')).rejects.toMatchObject({
                message: 'Unauthorized - Authentication required or token expired',
                status: 401
            });

            // Verify that the warning was logged
            expect(consoleWarnSpy).toHaveBeenCalledWith('API Client: Unauthorized request detected. Token may be expired.');
        });

        it('should handle 403 Forbidden error', async () => {
            mockAxios.onGet('/forbidden').reply(403);

            await expect(client.get('/forbidden')).rejects.toMatchObject({
                message: 'Forbidden - Insufficient permissions',
                status: 403
            });
        });

        it('should handle 404 Not Found error', async () => {
            mockAxios.onGet('/notfound').reply(404);

            await expect(client.get('/notfound')).rejects.toMatchObject({
                message: 'Not Found - The requested resource does not exist',
                status: 404
            });
        });

        it('should handle 500 Internal Server Error', async () => {
            mockAxios.onGet('/servererror').reply(500);

            await expect(client.get('/servererror')).rejects.toMatchObject({
                message: 'Internal Server Error - Something went wrong on the server',
                status: 500
            });
        });

        it('should handle network timeout error', async () => {
            mockAxios.onGet('/timeout').timeout();

            await expect(client.get('/timeout')).rejects.toMatchObject({
                message: expect.stringContaining('timeout'),
                code: 'ECONNABORTED'
            });
        });

        it('should handle network error', async () => {
            mockAxios.onGet('/network').networkError();

            await expect(client.get('/network')).rejects.toMatchObject({
                message: 'Network Error'
            });
        });

        it('should dispatch unauthorized event on 401 error', async () => {
            const eventSpy = jest.fn();
            const originalDispatchEvent = window.dispatchEvent;
            window.dispatchEvent = eventSpy;

            mockAxios.onGet('/unauthorized').reply(401);

            try {
                await client.get('/unauthorized');
            } catch (error) {
                // Expected to fail
            }

            expect(eventSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'digital-assistant:unauthorized',
                    detail: expect.objectContaining({
                        source: 'api-client',
                        timestamp: expect.any(Number)
                    })
                })
            );

            // Restore original function
            window.dispatchEvent = originalDispatchEvent;
        });
    });

    describe('TypeScript Generics', () => {
        interface User {
            id: number;
            name: string;
            email: string;
        }

        it('should support typed GET requests', async () => {
            const userData: User = { id: 1, name: 'John Doe', email: 'john@test.com' };
            mockAxios.onGet('/users/1').reply(200, userData);

            const response = await client.get<User>('/users/1');

            expect(response.data).toEqual(userData);
            // TypeScript should infer response.data as User type
            expect(response.data.name).toBe('John Doe');
        });

        it('should support typed POST requests', async () => {
            const createData = { name: 'Jane Doe', email: 'jane@test.com' };
            const responseData: User = { id: 2, ...createData };
            
            mockAxios.onPost('/users', createData).reply(201, responseData);

            const response = await client.post<User>('/users', createData);

            expect(response.data).toEqual(responseData);
            expect(response.data.id).toBe(2);
        });
    });

    describe('Default Export', () => {
        it('should export a default apiClient instance', () => {
            expect(apiClient).toBeInstanceOf(ApiClient);
        });

        it('should allow creating multiple client instances', () => {
            const client1 = new ApiClient({ baseURL: 'https://api1.com' });
            const client2 = new ApiClient({ baseURL: 'https://api2.com' });

            expect(client1.getConfig().baseURL).toBe('https://api1.com');
            expect(client2.getConfig().baseURL).toBe('https://api2.com');
            expect(client1).not.toBe(client2);
        });
    });

    describe('Request Matching and Validation', () => {
        it('should match requests with query parameters', async () => {
            const responseData = { results: ['item1', 'item2'] };
            
            mockAxios.onGet('/search', { params: { q: 'test', limit: 10 } }).reply(200, responseData);

            const response = await client.get('/search', { 
                params: { q: 'test', limit: 10 } 
            });

            expect(response.data).toEqual(responseData);
        });

        it('should match POST requests with specific headers', async () => {
            const postData = { message: 'test' };
            const responseData = { id: 1, status: 'sent' };
            
            mockAxios.onPost('/messages', postData).reply((config) => {
                expect(config.headers?.['X-Custom-Header']).toBe('value');
                return [201, responseData];
            });

            const response = await client.post('/messages', postData, {
                headers: { 'X-Custom-Header': 'value' }
            });

            expect(response.data).toEqual(responseData);
        });

        it('should handle unmatched requests gracefully', async () => {
            // Don't set up any mocks

            await expect(client.get('/unmatched')).rejects.toMatchObject({
                message: 'Not Found - The requested resource does not exist'
            });
        });
    });
});
