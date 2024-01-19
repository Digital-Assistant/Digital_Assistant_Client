// Import dependencies and the function to test


import { ENDPOINT } from '../config/endpoints';
import {UDABindAuthenticatedAccount} from "../util/UDABindAuthenticatedAccount";
import {UDABindAccount} from "../util/UserAuthData";
import {invokeApi} from "../util/invokeApi";

// Mock dependencies if needed
jest.mock('./UserAuthData');
jest.mock('./invokeApi');

describe('UDABindAuthenticatedAccount', () => {
    it('should bind the authenticated account with UDASessionData', async () => {
        // Arrange
        const UDASessionData = { authData: { id: 'session-id', email: 'session@example.com' }, authenticationSource: 'source' };
        const renewToken = true;
        const response = { id: 'user-id', email: 'user@example.com' };
        invokeApi.mockResolvedValueOnce(response);

        // Act
        await UDABindAuthenticatedAccount(UDASessionData, renewToken);

        // Assert
        expect(invokeApi).toHaveBeenCalledWith(ENDPOINT.CheckUserId, 'POST', {
            authid: 'session-id',
            emailid: 'session@example.com',
            authsource: 'source',
        });
        expect(UDABindAccount).toHaveBeenCalledWith(response, UDASessionData, renewToken);
    });
});
