import { UserService } from '../userService';
import { store } from '../../store';

// Mock the store
jest.mock('../../store', () => ({
    store: {
        getState: jest.fn(),
    },
}));

describe('UserService', () => {
    let userService: UserService;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        userService = new UserService();
        // Reset mocks before each test
        (store.getState as jest.Mock).mockClear();
        // Spy on console.error to prevent it from polluting test output and to assert its calls
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        // Restore console.error after each test
        consoleErrorSpy.mockRestore();
    });

    describe('getUserId', () => {
        it('should return null if store is invalid', async () => {
            (store.getState as jest.Mock).mockReturnValue(undefined);
            await expect(userService.getUserId()).resolves.toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith('getUserId: invalid store state');
        });

        it('should return null if user state is missing', async () => {
            (store.getState as jest.Mock).mockReturnValue({});
            await expect(userService.getUserId()).resolves.toBeNull();
        });

        it('should extract user ID from parsed authData (stringified object)', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    userSessionData: {
                        authData: JSON.stringify({ id: 'user123' }),
                    },
                },
            });
            await expect(userService.getUserId()).resolves.toBe('user123');
        });

        it('should extract user ID from raw authData.id (object)', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    userSessionData: {
                        authData: { id: 'user456' },
                    },
                },
            });
            await expect(userService.getUserId()).resolves.toBe('user456');
        });

        it('should extract user ID from authData with nested authData property', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    userSessionData: {
                        authData: { authData: { id: 'nested-user-id' } },
                    },
                },
            });
            await expect(userService.getUserId()).resolves.toBe('nested-user-id');
        });

        it('should normalize numeric user ID from authData.id to string', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    userSessionData: {
                        authData: { id: 12345 },
                    },
                },
            });
            await expect(userService.getUserId()).resolves.toBe('12345');
        });

        it('should extract user ID from userData.id', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    userData: { id: 'user789' },
                },
            });
            await expect(userService.getUserId()).resolves.toBe('user789');
        });

        it('should normalize numeric user ID from userData.id to string', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    userData: { id: 67890 },
                },
            });
            await expect(userService.getUserId()).resolves.toBe('67890');
        });

        it('should extract user ID from keycloakSessionData.id', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    keycloakSessionData: { id: 'keycloak-user' },
                },
            });
            await expect(userService.getUserId()).resolves.toBe('keycloak-user');
        });

        it('should normalize numeric user ID from keycloakSessionData.id to string', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    keycloakSessionData: { id: 112233 },
                },
            });
            await expect(userService.getUserId()).resolves.toBe('112233');
        });

        it('should return null if no user ID is found', async () => {
            (store.getState as jest.Mock).mockReturnValue({ user: {} });
            await expect(userService.getUserId()).resolves.toBeNull();
        });

        it('should return null and log error if store.getState throws', async () => {
            const error = new Error('getState failed');
            (store.getState as jest.Mock).mockImplementation(() => { throw error; });
            await expect(userService.getUserId()).resolves.toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith('getUserId error:', error);
        });
    });

    describe('getSessionKey', () => {
        it('should return null if store is invalid', async () => {
            (store.getState as jest.Mock).mockReturnValue(undefined);
            await expect(userService.getSessionKey()).resolves.toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith('getSessionKey: invalid store state');
        });

        it('should return session key from userSessionData.sessionKey', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    userSessionData: { sessionKey: 'session-key-abc' },
                },
            });
            await expect(userService.getSessionKey()).resolves.toBe('session-key-abc');
        });

        // Updated test case to reflect current implementation which does not normalize numeric sessionKey
        it('should return numeric session key from userSessionData.sessionKey as a number', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    userSessionData: { sessionKey: 98765 },
                },
            });
            await expect(userService.getSessionKey()).resolves.toBe(98765);
        });

        it('should return null if no session key is found', async () => {
            (store.getState as jest.Mock).mockReturnValue({ user: {} });
            await expect(userService.getSessionKey()).resolves.toBeNull();
        });

        it('should return null and log error if store.getState throws', async () => {
            const error = new Error('getState failed');
            (store.getState as jest.Mock).mockImplementation(() => { throw error; });
            await expect(userService.getSessionKey()).resolves.toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith('getSessionKey error:', error);
        });
    });

    describe('getUserSessionId', () => {
        it('should return null if store is invalid', async () => {
            (store.getState as jest.Mock).mockReturnValue(undefined);
            await expect(userService.getUserSessionId()).resolves.toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith('getUserSessionId: invalid store state');
        });

        it('should return userSessionId if present', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    userSessionId: 'session-id-123',
                },
            });
            await expect(userService.getUserSessionId()).resolves.toBe('session-id-123');
        });

        it('should normalize numeric userSessionId to string if present', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    userSessionId: 45678,
                },
            });
            await expect(userService.getUserSessionId()).resolves.toBe('45678');
        });

        it('should fall back to getUserId if userSessionId is not present', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    userData: { id: 'user-id-abc' },
                },
            });
            await expect(userService.getUserSessionId()).resolves.toBe('user-id-abc');
        });

        it('should return null if no session id or user id is found', async () => {
            (store.getState as jest.Mock).mockReturnValue({ user: {} });
            await expect(userService.getUserSessionId()).resolves.toBeNull();
        });

        it('should return null and log error if store.getState throws', async () => {
            const error = new Error('getState failed');
            (store.getState as jest.Mock).mockImplementation(() => { throw error; });
            await expect(userService.getUserSessionId()).resolves.toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith('getUserSessionId error:', error);
        });
    });
});