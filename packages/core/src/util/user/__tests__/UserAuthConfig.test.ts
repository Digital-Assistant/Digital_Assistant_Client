/**
 * Unit tests for UserAuthConfig module
 */

import { AuthConfig, AuthConfigPropTypes } from '../UserAuthConfig';

describe('UserAuthConfig', () => {
    describe('AuthConfigPropTypes interface', () => {
        it('should allow creating an object with required id property', () => {
            const config: AuthConfigPropTypes = {
                id: 'test-id'
            };
            expect(config.id).toBe('test-id');
        });

        it('should allow optional email property', () => {
            const config: AuthConfigPropTypes = {
                id: 'test-id',
                email: 'test@example.com'
            };
            expect(config.email).toBe('test@example.com');
        });

        it('should allow optional token property', () => {
            const config: AuthConfigPropTypes = {
                id: 'test-id',
                token: 'abc123'
            };
            expect(config.token).toBe('abc123');
        });

        it('should allow additional properties via index signature', () => {
            const config: AuthConfigPropTypes = {
                id: 'test-id',
                customField: 'custom-value',
                numericField: 123
            };
            expect(config.customField).toBe('custom-value');
            expect(config.numericField).toBe(123);
        });
    });

    describe('AuthConfig default object', () => {
        it('should have empty string as default id', () => {
            expect(AuthConfig.id).toBe('');
        });

        it('should have empty string as default email', () => {
            expect(AuthConfig.email).toBe('');
        });

        it('should have empty string as default token', () => {
            expect(AuthConfig.token).toBe('');
        });

        it('should be mutable to allow runtime configuration', () => {
            const originalId = AuthConfig.id;
            AuthConfig.id = 'new-id';
            expect(AuthConfig.id).toBe('new-id');
            // Reset for other tests
            AuthConfig.id = originalId;
        });
    });
});
