
import { AuthManager, AuthManagerConfig } from '../AuthManager';
import { CustomConfig } from '../../config/CustomConfig';
import { store } from '../../store';
import { setKeycloakSessionData, clearUserData } from '../../store/slices/userSlice';
import Keycloak from 'keycloak-js';

// Mock Keycloak
jest.mock('keycloak-js');
const MockKeycloak = Keycloak as any as jest.Mock;

// Mock store
jest.mock('../../store', () => ({
    store: {
        dispatch: jest.fn(),
        getState: jest.fn(),
    },
}));

describe('AuthManager', () => {
    let authManager: AuthManager;
    let mockKeycloakInstance: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // Reset singleton instance (if possible, or just re-get it)
        authManager = AuthManager.getInstance();

        // Setup mock Keycloak instance
        mockKeycloakInstance = {
            init: jest.fn().mockResolvedValue(true),
            login: jest.fn().mockResolvedValue(undefined),
            logout: jest.fn().mockResolvedValue(undefined),
            updateToken: jest.fn().mockResolvedValue(true),
            loadUserProfile: jest.fn().mockResolvedValue({ username: 'testuser' }),
            token: 'mock-token',
            refreshToken: 'mock-refresh-token',
            subject: 'mock-user-id',
            tokenParsed: { email: 'test@example.com' },
        };

        MockKeycloak.mockImplementation(() => mockKeycloakInstance);
    });

    describe('init', () => {
        it('should initialize Keycloak with provided config', async () => {
            const config: AuthManagerConfig = {
                url: 'http://localhost:8080/auth',
                realm: 'test-realm',
                clientId: 'test-client',
            };

            const result = await authManager.init(config);

            expect(MockKeycloak).toHaveBeenCalledWith({
                url: config.url,
                realm: config.realm,
                clientId: config.clientId,
            });
            expect(mockKeycloakInstance.init).toHaveBeenCalledWith(expect.objectContaining({
                onLoad: 'check-sso',
            }));
            expect(result).toBe(true);
            expect(store.dispatch).toHaveBeenCalledWith(setKeycloakSessionData({
                token: 'mock-token',
                refreshToken: 'mock-refresh-token',
                id: 'mock-user-id',
                email: 'test@example.com',
            }));
        });

        it('should fall back to CustomConfig if config not provided', async () => {
            // Mock CustomConfig values
            CustomConfig.keycloakUrl = 'http://default-url';
            CustomConfig.realm = 'default-realm';
            CustomConfig.clientId = 'default-client';

            await authManager.init();

            expect(MockKeycloak).toHaveBeenCalledWith({
                url: 'http://default-url',
                realm: 'default-realm',
                clientId: 'default-client',
            });
        });

        it('should return false if init fails', async () => {
            mockKeycloakInstance.init.mockRejectedValue(new Error('Init failed'));
            const result = await authManager.init({ url: 'url', realm: 'realm', clientId: 'client' });
            expect(result).toBe(false);
        });
    });

    describe('login', () => {
        it('should call keycloak login', async () => {
            await authManager.init({ url: 'url', realm: 'realm', clientId: 'client' });
            await authManager.login();
            expect(mockKeycloakInstance.login).toHaveBeenCalled();
        });
    });

    describe('logout', () => {
        it('should call keycloak logout and clear user data', async () => {
            await authManager.init({ url: 'url', realm: 'realm', clientId: 'client' });
            await authManager.logout();
            expect(mockKeycloakInstance.logout).toHaveBeenCalled();
            expect(store.dispatch).toHaveBeenCalledWith(clearUserData());
        });
    });
});
