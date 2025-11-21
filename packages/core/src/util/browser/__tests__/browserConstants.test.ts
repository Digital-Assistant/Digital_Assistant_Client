
import {
    updateBrowserPlugin,
    updateSessionName,
    updateActiveTabId,
    getUDABrowserPlugin,
    getUDASessionName,
    getActiveTabId,
} from '../browserConstants';
import { CONFIG } from '../../../config';

describe('browserConstants', () => {
    // We can't directly test the initial values of the exported constants
    // because they are read-only. Instead, we'll test the getter functions.

    describe('getter functions', () => {
        it('should return the initial values', () => {
            // These tests will depend on the initial state when the module was first imported.
            // We assume the initial state is as follows:
            expect(getUDABrowserPlugin()).toBe(false);
            expect(getUDASessionName()).toBe(CONFIG.USER_AUTH_DATA_KEY);
            expect(getActiveTabId()).toBe(-1);
        });
    });

    describe('update functions', () => {
        it('should update UDABrowserPlugin', () => {
            updateBrowserPlugin(true);
            expect(getUDABrowserPlugin()).toBe(true);
            updateBrowserPlugin(false);
            expect(getUDABrowserPlugin()).toBe(false);
        });

        it('should update UDASessionName', () => {
            const newName = 'test-session';
            updateSessionName(newName);
            expect(getUDASessionName()).toBe(`${CONFIG.USER_AUTH_DATA_KEY}-${newName}`);
        });

        it('should update activeTabId', () => {
            const newTabId = 123;
            updateActiveTabId(newTabId);
            expect(getActiveTabId()).toBe(newTabId);
        });
    });
});
