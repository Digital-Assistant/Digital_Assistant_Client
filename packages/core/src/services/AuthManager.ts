import Keycloak from 'keycloak-js';
import { store } from '../store';
import { setKeycloakSessionData, clearUserData } from '../store/slices/userSlice';
import { CustomConfig } from '../config/CustomConfig';

/**
 * Interface for AuthManager configuration
 */
export interface AuthManagerConfig {
    url?: string;
    realm: string;
    clientId: string;
}

/**
 * AuthManager Service
 * 
 * Centralizes authentication logic using Keycloak.
 * Manages Keycloak initialization, login, logout, and token refresh.
 * Syncs authentication state with the Redux store.
 */
export class AuthManager {
    private static instance: AuthManager;
    private keycloak: Keycloak | null = null;
    private authenticated: boolean = false;

    private constructor() { }

    /**
     * Get the singleton instance of AuthManager
     */
    public static getInstance(): AuthManager {
        if (!AuthManager.instance) {
            AuthManager.instance = new AuthManager();
        }
        return AuthManager.instance;
    }

    /**
     * Initialize Keycloak
     * @param config Optional configuration override. Defaults to CustomConfig values.
     */
    public async init(config?: AuthManagerConfig): Promise<boolean> {
        const keycloakConfig = {
            url: config?.url || CustomConfig.keycloakUrl,
            realm: config?.realm || CustomConfig.realm || '',
            clientId: config?.clientId || CustomConfig.clientId || '',
        };

        // Validate config
        if (!keycloakConfig.url || !keycloakConfig.realm || !keycloakConfig.clientId) {
            console.warn('AuthManager: Keycloak configuration missing. Authentication disabled.');
            return false;
        }

        this.keycloak = new Keycloak(keycloakConfig);

        try {
            // Build redirect URI - only use window.location in browser context
            const redirectUri = (typeof window !== 'undefined' && window.location)
                ? window.location.origin + '/silent-check-sso.html'
                : undefined;

            this.authenticated = await this.keycloak.init({
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri: redirectUri,
                pkceMethod: 'S256',
            });

            if (this.authenticated) {
                this.syncState();
            }

            // Set up automatic token refresh
            this.keycloak.onTokenExpired = () => {
                this.keycloak?.updateToken(30)
                    .then((refreshed) => {
                        if (refreshed) {
                            this.syncState();
                        }
                    })
                    .catch(() => {
                        console.error('AuthManager: Failed to refresh token');
                        this.logout();
                    });
            };

            return this.authenticated;

        } catch (error) {
            console.error('AuthManager: Initialization failed', error);
            return false;
        }
    }

    /**
     * Sync Keycloak state with Redux store
     */
    private syncState() {
        if (this.keycloak && this.authenticated) {
            store.dispatch(setKeycloakSessionData({
                token: this.keycloak.token,
                refreshToken: this.keycloak.refreshToken,
                id: this.keycloak.subject,
                // email can be extracted from tokenParsed if available
                email: (this.keycloak.tokenParsed as any)?.email,
            }));
        } else {
            store.dispatch(clearUserData());
        }
    }

    /**
     * Redirect to Keycloak login page
     */
    public async login(options?: Keycloak.KeycloakLoginOptions): Promise<void> {
        if (!this.keycloak) {
            console.error('AuthManager: Not initialized');
            return;
        }
        await this.keycloak.login(options);
    }

    /**
     * Logout from Keycloak
     */
    public async logout(options?: Keycloak.KeycloakLogoutOptions): Promise<void> {
        if (!this.keycloak) {
            console.error('AuthManager: Not initialized');
            return;
        }
        await this.keycloak.logout(options);
        store.dispatch(clearUserData());
        this.authenticated = false;
    }

    /**
     * Manually update the token
     * @param minValidity If the token expires within this many seconds, refresh it.
     */
    public async updateToken(minValidity: number = 30): Promise<boolean> {
        if (!this.keycloak) return false;
        try {
            const refreshed = await this.keycloak.updateToken(minValidity);
            if (refreshed) {
                this.syncState();
            }
            return refreshed;
        } catch (error) {
            console.error('AuthManager: Failed to update token', error);
            return false;
        }
    }

    /**
     * Get the current access token
     */
    public getToken(): string | undefined {
        return this.keycloak?.token;
    }

    /**
     * Get user profile
     */
    public async getUserProfile(): Promise<Keycloak.KeycloakProfile | undefined> {
        if (!this.keycloak) return undefined;
        return await this.keycloak.loadUserProfile();
    }

    /**
     * Check if user is authenticated
     */
    public isAuthenticated(): boolean {
        return this.authenticated;
    }
    /**
     * Get complete session data
     */
    public getSessionData(): any {
        if (!this.keycloak || !this.authenticated) return null;
        return {
            token: this.keycloak.token,
            refreshToken: this.keycloak.refreshToken,
            idToken: this.keycloak.idToken,
            id: this.keycloak.subject,
            email: (this.keycloak.tokenParsed as any)?.email,
            authenticated: this.authenticated,
        };
    }
}

export const authManager = AuthManager.getInstance();
