/**
 * Unit tests for AuthDataConfig module
 */

import { AuthDataConfig } from '../AuthDataConfig';
import { AuthConfig } from '../UserAuthConfig';
import { UDADigestMessage } from '../UDADigestMessage';
import { trigger } from '../../node/events';
import { UDAConsoleLogger } from '../../error';

// Mock dependencies
jest.mock('../UDADigestMessage');
jest.mock('../../node/events');
jest.mock('../../error', () => ({
    UDAConsoleLogger: {
        info: jest.fn(),
    },
}));

describe('AuthDataConfig', () => {
    const originalAuthConfig = { ...AuthConfig };

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset AuthConfig to original values
        Object.keys(AuthConfig).forEach(key => {
            (AuthConfig as any)[key] = (originalAuthConfig as any)[key] || '';
        });
    });

    afterAll(() => {
        // Restore original AuthConfig
        Object.keys(originalAuthConfig).forEach(key => {
            (AuthConfig as any)[key] = (originalAuthConfig as any)[key];
        });
    });

    it('should update AuthConfig with encrypted values for matching types', async () => {
        const encryptedValue = 'encrypted-hash-123';
        (UDADigestMessage as jest.Mock).mockResolvedValue(encryptedValue);

        await AuthDataConfig({ id: 'user-123', email: 'test@example.com' });

        expect(UDADigestMessage).toHaveBeenCalledWith('user-123', 'SHA-512');
        expect(UDADigestMessage).toHaveBeenCalledWith('test@example.com', 'SHA-512');
        expect(AuthConfig.id).toBe(encryptedValue);
        expect(AuthConfig.email).toBe(encryptedValue);
    });

    it('should allow setting empty string values directly without encryption', async () => {
        // First set a non-empty value
        AuthConfig.id = 'existing-id';

        await AuthDataConfig({ id: '' });

        expect(UDADigestMessage).not.toHaveBeenCalled();
        expect(AuthConfig.id).toBe('');
    });

    it('should log error for type mismatches and not update the value', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        AuthConfig.id = 'string-value';

        await AuthDataConfig({ id: 123 as any });

        expect(consoleSpy).toHaveBeenCalledWith('id accepts only string data type.');
        consoleSpy.mockRestore();
    });

    it('should trigger UDAClearSessionData when id becomes empty', async () => {
        AuthConfig.id = 'old-id';

        await AuthDataConfig({ id: '' });

        expect(trigger).toHaveBeenCalledWith('UDAClearSessionData', {});
    });

    it('should trigger UDAClearSessionData when id changes to a different value', async () => {
        AuthConfig.id = 'old-id';
        (UDADigestMessage as jest.Mock).mockResolvedValue('new-encrypted-id');

        await AuthDataConfig({ id: 'new-id' });

        expect(trigger).toHaveBeenCalledWith('UDAClearSessionData', {});
    });

    it('should trigger RequestUDASessionData when id is set and unchanged', async () => {
        const encryptedId = 'encrypted-same-id';
        AuthConfig.id = encryptedId;
        (UDADigestMessage as jest.Mock).mockResolvedValue(encryptedId);

        await AuthDataConfig({ id: 'same-id' });

        expect(trigger).toHaveBeenCalledWith(
            'RequestUDASessionData',
            { detail: { data: 'getusersessiondata' }, bubbles: false, cancelable: false }
        );
    });

    it('should return the updated AuthConfig object', async () => {
        (UDADigestMessage as jest.Mock).mockResolvedValue('encrypted');

        const result = await AuthDataConfig({ id: 'test' });

        expect(result).toBe(AuthConfig);
    });

    it('should not update properties that are not provided', async () => {
        AuthConfig.email = 'original@email.com';
        (UDADigestMessage as jest.Mock).mockResolvedValue('encrypted-id');

        await AuthDataConfig({ id: 'new-id' });

        expect(AuthConfig.email).toBe('original@email.com');
    });

    it('should log encrypted values via UDAConsoleLogger', async () => {
        const encryptedValue = 'test-encrypted';
        (UDADigestMessage as jest.Mock).mockResolvedValue(encryptedValue);

        await AuthDataConfig({ id: 'test' });

        expect(UDAConsoleLogger.info).toHaveBeenCalledWith(encryptedValue);
    });

    it('should handle token property encryption', async () => {
        const encryptedToken = 'encrypted-token';
        (UDADigestMessage as jest.Mock).mockResolvedValue(encryptedToken);

        await AuthDataConfig({ id: 'user-id', token: 'secret-token' });

        expect(UDADigestMessage).toHaveBeenCalledWith('secret-token', 'SHA-512');
        expect(AuthConfig.token).toBe(encryptedToken);
    });
});
