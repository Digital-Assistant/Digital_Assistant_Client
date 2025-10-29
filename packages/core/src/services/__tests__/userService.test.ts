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

    beforeEach(() => {
        userService = new UserService();
        // Reset mocks before each test
        (store.getState as jest.Mock).mockClear();
    });

    describe('getUserId', () => {
        it('should return null if store is invalid', async () => {
            (store.getState as jest.Mock).mockReturnValue(undefined);
            await expect(userService.getUserId()).resolves.toBeNull();
        });

        it('should return null if user state is missing', async () => {
            (store.getState as jest.Mock).mockReturnValue({});
            await expect(userService.getUserId()).resolves.toBeNull();
        });

        it('should extract user ID from parsed authData', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    userSessionData: {
                        authData: JSON.stringify({ id: 'user123' }),
                    },
                },
            });
            await expect(userService.getUserId()).resolves.toBe('user123');
        });

        it('should extract user ID from raw authData.id', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    userSessionData: {
                        authData: { id: 'user456' },
                    },
                },
            });
            await expect(userService.getUserId()).resolves.toBe('user456');
        });

        it('should extract user ID from userData.id', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    userData: { id: 'user789' },
                },
            });
            await expect(userService.getUserId()).resolves.toBe('user789');
        });

        it('should extract user ID from keycloakSessionData.id', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    keycloakSessionData: { id: 'keycloak-user' },
                },
            });
            await expect(userService.getUserId()).resolves.toBe('keycloak-user');
        });

        it('should return null if no user ID is found', async () => {
            (store.getState as jest.Mock).mockReturnValue({ user: {} });
            await expect(userService.getUserId()).resolves.toBeNull();
        });
    });

    describe('getSessionKey', () => {
        it('should return null if store is invalid', async () => {
            (store.getState as jest.Mock).mockReturnValue(undefined);
            await expect(userService.getSessionKey()).resolves.toBeNull();
        });

        it('should return session key from userSessionData.sessionKey', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    userSessionData: { sessionKey: 'session-key-abc' },
                },
            });
            await expect(userService.getSessionKey()).resolves.toBe('session-key-abc');
        });

        it('should return null if no session key is found', async () => {
            (store.getState as jest.Mock).mockReturnValue({ user: {} });
            await expect(userService.getSessionKey()).resolves.toBeNull();
        });
    });

    describe('getUserSessionId', () => {
        it('should return null if store is invalid', async () => {
            (store.getState as jest.Mock).mockReturnValue(undefined);
            await expect(userService.getUserSessionId()).resolves.toBeNull();
        });

        it('should return userSessionId if present', async () => {
            (store.getState as jest.Mock).mockReturnValue({
                user: {
                    userSessionId: 'session-id-123',
                },
            });
            await expect(userService.getUserSessionId()).resolves.toBe('session-id-123');
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
    });
});