/**
 * Unit tests for UDABindAuthenticatedAccount module
 */

import { UDABindAuthenticatedAccount } from '../UDABindAuthenticatedAccount';
import { UDABindAccount } from '../UDABindAccount';
import { ENDPOINT } from '../../../config/endpoints';
import { UDASessionData } from '../../../models/UDASessionData';
import { apiClient } from '../../../services';

// Mock dependencies
jest.mock('../UDABindAccount');
jest.mock('../../../services', () => ({
    apiClient: {
        post: jest.fn(),
    },
}));

describe('UDABindAuthenticatedAccount', () => {
    let mockSessionData: UDASessionData;

    beforeEach(() => {
        jest.clearAllMocks();

        mockSessionData = {
            sessionKey: 'session-123',
            authData: {
                id: 'auth-id-456',
                email: 'user@example.com',
                token: '',
            },
            authenticationSource: 'oauth',
        } as UDASessionData;
    });

    it('should call apiClient.post with correct auth data', async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ id: 'response-id' });

        await UDABindAuthenticatedAccount(mockSessionData);

        expect(apiClient.post).toHaveBeenCalledWith(ENDPOINT.CheckUserId, {
            authid: 'auth-id-456',
            emailid: 'user@example.com',
            authsource: 'oauth',
        });
    });

    it('should call UDABindAccount when response is truthy and sessionKey exists', async () => {
        const mockResponse = { id: 'user-id', name: 'Test User' };
        (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

        await UDABindAuthenticatedAccount(mockSessionData);

        expect(UDABindAccount).toHaveBeenCalledWith(mockResponse, mockSessionData, false);
    });

    it('should pass renewToken parameter to UDABindAccount', async () => {
        const mockResponse = { id: 'user-id' };
        (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

        await UDABindAuthenticatedAccount(mockSessionData, true);

        expect(UDABindAccount).toHaveBeenCalledWith(mockResponse, mockSessionData, true);
    });

    it('should default renewToken to false when not provided', async () => {
        const mockResponse = { id: 'user-id' };
        (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

        await UDABindAuthenticatedAccount(mockSessionData);

        expect(UDABindAccount).toHaveBeenCalledWith(mockResponse, mockSessionData, false);
    });

    it('should not call UDABindAccount when sessionKey is null', async () => {
        mockSessionData.sessionKey = null;
        (apiClient.post as jest.Mock).mockResolvedValue({ id: 'user-id' });

        await UDABindAuthenticatedAccount(mockSessionData);

        expect(UDABindAccount).not.toHaveBeenCalled();
    });

    it('should not call UDABindAccount when API response is falsy', async () => {
        (apiClient.post as jest.Mock).mockResolvedValue(null);

        await UDABindAuthenticatedAccount(mockSessionData);

        expect(UDABindAccount).not.toHaveBeenCalled();
    });

    it('should not call UDABindAccount when API response is undefined', async () => {
        (apiClient.post as jest.Mock).mockResolvedValue(undefined);

        await UDABindAuthenticatedAccount(mockSessionData);

        expect(UDABindAccount).not.toHaveBeenCalled();
    });

    it('should not call UDABindAccount when API response is empty object (which is truthy) but sessionKey is null', async () => {
        mockSessionData.sessionKey = null;
        (apiClient.post as jest.Mock).mockResolvedValue({});

        await UDABindAuthenticatedAccount(mockSessionData);

        expect(UDABindAccount).not.toHaveBeenCalled();
    });

    it('should call UDABindAccount with empty object response if sessionKey exists', async () => {
        const emptyResponse = {};
        (apiClient.post as jest.Mock).mockResolvedValue(emptyResponse);

        await UDABindAuthenticatedAccount(mockSessionData);

        expect(UDABindAccount).toHaveBeenCalledWith(emptyResponse, mockSessionData, false);
    });

    it('should handle API errors gracefully', async () => {
        (apiClient.post as jest.Mock).mockRejectedValue(new Error('Network Error'));

        await expect(UDABindAuthenticatedAccount(mockSessionData))
            .rejects.toThrow('Network Error');
    });

    it('should use the correct authentication source from session data', async () => {
        mockSessionData.authenticationSource = 'custom-auth-source';
        (apiClient.post as jest.Mock).mockResolvedValue({ id: 'user-id' });

        await UDABindAuthenticatedAccount(mockSessionData);

        expect(apiClient.post).toHaveBeenCalledWith(ENDPOINT.CheckUserId, {
            authid: 'auth-id-456',
            emailid: 'user@example.com',
            authsource: 'custom-auth-source',
        });
    });
});
