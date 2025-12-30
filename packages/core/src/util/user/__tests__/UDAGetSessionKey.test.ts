/**
 * Unit tests for UDAGetSessionKey module
 */

import { UDAGetSessionKey } from '../UDAGetSessionKey';
import { apiClient } from '../../../services';
import { ENDPOINT } from '../../../config/endpoints';
import { UDASessionData } from '../../../models/UDASessionData';

// Mock the dependencies
jest.mock('../../../services', () => ({
    apiClient: {
        get: jest.fn(),
    },
}));

describe('UDAGetSessionKey', () => {
    let mockSessionData: UDASessionData;

    beforeEach(() => {
        jest.clearAllMocks();

        // Create a mock UDASessionData object
        mockSessionData = {
            sessionKey: null,
            authData: {
                id: 'test-id',
                email: 'test@example.com',
                token: ''
            },
            authenticationSource: 'test-source'
        } as UDASessionData;
    });

    it('should call apiClient.get with the correct endpoint', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: 'session-key-123' });

        await UDAGetSessionKey(mockSessionData);

        expect(apiClient.get).toHaveBeenCalledWith(ENDPOINT.GetSessionKey);
    });

    it('should update UDASessionData.sessionKey with the response data', async () => {
        const expectedSessionKey = 'new-session-key-456';
        (apiClient.get as jest.Mock).mockResolvedValue({ data: expectedSessionKey });

        const result = await UDAGetSessionKey(mockSessionData);

        expect(result.sessionKey).toBe(expectedSessionKey);
    });

    it('should return the modified UDASessionData object', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: 'test-key' });

        const result = await UDAGetSessionKey(mockSessionData);

        expect(result).toBe(mockSessionData);
        expect(result.authData.id).toBe('test-id');
    });

    it('should return the response directly when API returns falsy value', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue(null);

        const result = await UDAGetSessionKey(mockSessionData);

        expect(result).toBeNull();
    });

    it('should return the response directly when API returns undefined', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue(undefined);

        const result = await UDAGetSessionKey(mockSessionData);

        expect(result).toBeUndefined();
    });

    it('should return the response directly when API returns empty string', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue('');

        const result = await UDAGetSessionKey(mockSessionData);

        expect(result).toBe('');
    });

    it('should handle API errors gracefully', async () => {
        (apiClient.get as jest.Mock).mockRejectedValue(new Error('Network error'));

        await expect(UDAGetSessionKey(mockSessionData)).rejects.toThrow('Network error');
    });

    it('should preserve existing UDASessionData properties', async () => {
        mockSessionData.authenticationSource = 'custom-source';
        (apiClient.get as jest.Mock).mockResolvedValue({ data: 'key-789' });

        const result = await UDAGetSessionKey(mockSessionData);

        expect(result.authenticationSource).toBe('custom-source');
        expect(result.authData.email).toBe('test@example.com');
    });
});
