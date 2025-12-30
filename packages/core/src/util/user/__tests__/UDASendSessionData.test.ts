/**
 * Unit tests for UDASendSessionData module
 */

import { UDASendSessionData, UDASendSessionDataToBackground } from '../UDASendSessionData';
import { UDASessionData } from '../../../models/UDASessionData';
import { getBrowserVar, getUDABrowserPlugin } from '../../browser/browserConstants';
import { UDABindAuthenticatedAccount } from '../UDABindAuthenticatedAccount';
import { getTab } from '../../screen';

// Mock dependencies
jest.mock('../../browser/browserConstants', () => ({
    getUDABrowserPlugin: jest.fn(),
    getBrowserVar: jest.fn(),
}));
jest.mock('../UDABindAuthenticatedAccount');
jest.mock('../../screen', () => ({
    getTab: jest.fn(),
}));

describe('UDASendSessionData', () => {
    let mockSessionData: UDASessionData;
    let dispatchEventSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();

        mockSessionData = {
            sessionKey: 'session-123',
            authData: {
                id: 'auth-id',
                email: 'test@example.com',
                token: 'test-token',
            },
            authenticationSource: 'test-source',
        } as UDASessionData;

        dispatchEventSpy = jest.spyOn(document, 'dispatchEvent').mockImplementation(() => true);
        (getUDABrowserPlugin as jest.Mock).mockReturnValue(false);
    });

    afterEach(() => {
        dispatchEventSpy.mockRestore();
    });

    describe('UDASendSessionData (main function)', () => {
        it('should dispatch UDAUserSessionData custom event when not in browser plugin mode', async () => {
            await UDASendSessionData(mockSessionData, 'UDAUserSessionData');

            expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
            const event = dispatchEventSpy.mock.calls[0][0] as CustomEvent;
            expect(event.type).toBe('UDAUserSessionData');
            expect(event.detail.data).toBe(JSON.stringify(mockSessionData));
        });

        it('should dispatch UDAAuthenticatedUserSessionData custom event', async () => {
            await UDASendSessionData(mockSessionData, 'UDAAuthenticatedUserSessionData');

            const event = dispatchEventSpy.mock.calls[0][0] as CustomEvent;
            expect(event.type).toBe('UDAAuthenticatedUserSessionData');
            expect(event.detail.data).toBe(JSON.stringify(mockSessionData));
        });

        it('should dispatch UDAAlertMessageData custom event with message', async () => {
            await UDASendSessionData(mockSessionData, 'UDAAlertMessageData', 'Alert message here');

            const event = dispatchEventSpy.mock.calls[0][0] as CustomEvent;
            expect(event.type).toBe('UDAAlertMessageData');
            expect(event.detail.data).toBe('Alert message here');
        });

        it('should default to UDAUserSessionData action when no action specified', async () => {
            await UDASendSessionData(mockSessionData);

            const event = dispatchEventSpy.mock.calls[0][0] as CustomEvent;
            expect(event.type).toBe('UDAUserSessionData');
        });

        it('should call UDASendSessionDataToBackground when in browser plugin mode', async () => {
            (getUDABrowserPlugin as jest.Mock).mockReturnValue(true);
            const mockTab = { id: 123 };
            (getTab as jest.Mock).mockResolvedValue(mockTab);
            const mockSendMessage = jest.fn();
            (getBrowserVar as jest.Mock).mockReturnValue({
                tabs: { sendMessage: mockSendMessage },
            });

            await UDASendSessionData(mockSessionData, 'UDAAlertMessageData', 'test');

            expect(getTab).toHaveBeenCalled();
        });

        it('should set event bubbles to false', async () => {
            await UDASendSessionData(mockSessionData, 'UDAUserSessionData');

            const event = dispatchEventSpy.mock.calls[0][0] as CustomEvent;
            expect(event.bubbles).toBe(false);
        });

        it('should set event cancelable to false', async () => {
            await UDASendSessionData(mockSessionData, 'UDAUserSessionData');

            const event = dispatchEventSpy.mock.calls[0][0] as CustomEvent;
            expect(event.cancelable).toBe(false);
        });
    });

    describe('UDASendSessionDataToBackground', () => {
        let mockSendMessage: jest.Mock;
        let mockTab: any;

        beforeEach(() => {
            mockTab = { id: 456 };
            mockSendMessage = jest.fn();
            (getTab as jest.Mock).mockResolvedValue(mockTab);
            (getBrowserVar as jest.Mock).mockReturnValue({
                tabs: { sendMessage: mockSendMessage },
            });
        });

        it('should return false if no active tab is found', async () => {
            (getTab as jest.Mock).mockResolvedValue(null);
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            const result = await UDASendSessionDataToBackground(mockSessionData);

            expect(result).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith('No active tab identified.');
            consoleSpy.mockRestore();
        });

        it('should send alert message directly to tab', async () => {
            const result = await UDASendSessionDataToBackground(mockSessionData, 'UDAAlertMessageData', 'Alert!');

            expect(mockSendMessage).toHaveBeenCalledWith(456, {
                action: 'UDAAlertMessageData',
                data: 'Alert!',
            });
            expect(result).toBe(true);
        });

        it('should call UDABindAuthenticatedAccount when authData has no token', async () => {
            const sessionDataWithoutToken = {
                ...mockSessionData,
                authData: {
                    id: 'auth-id',
                    email: 'test@example.com',
                },
            } as UDASessionData;

            await UDASendSessionDataToBackground(sessionDataWithoutToken, 'UDAUserSessionData');

            expect(UDABindAuthenticatedAccount).toHaveBeenCalledWith(sessionDataWithoutToken, false);
        });

        it('should send session data to tab when authData has token', async () => {
            await UDASendSessionDataToBackground(mockSessionData, 'UDAUserSessionData');

            expect(mockSendMessage).toHaveBeenCalledWith(456, {
                action: 'UDAUserSessionData',
                data: JSON.stringify(mockSessionData),
            });
        });

        it('should return true after sending session data successfully', async () => {
            const result = await UDASendSessionDataToBackground(mockSessionData, 'UDAUserSessionData');

            expect(result).toBe(true);
        });

        it('should use default sendAction when not specified', async () => {
            await UDASendSessionDataToBackground(mockSessionData);

            expect(mockSendMessage).toHaveBeenCalledWith(456, {
                action: 'UDAUserSessionData',
                data: JSON.stringify(mockSessionData),
            });
        });

        it('should handle UDAAuthenticatedUserSessionData action with token', async () => {
            await UDASendSessionDataToBackground(mockSessionData, 'UDAAuthenticatedUserSessionData');

            expect(mockSendMessage).toHaveBeenCalledWith(456, {
                action: 'UDAAuthenticatedUserSessionData',
                data: JSON.stringify(mockSessionData),
            });
        });
    });
});
