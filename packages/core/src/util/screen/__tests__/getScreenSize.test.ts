// Import the function to be tested
import { getScreenSize } from '../getScreenSize';

describe('getScreenSize', () => {
    // Store original property descriptors to restore them after each test
    const originalDescriptors: { [key: string]: PropertyDescriptor } = {};

    // Helper to define properties
    const defineProperty = (obj: any, prop: string, value: any) => {
        // Store original descriptor if it exists
        originalDescriptors[prop] = Object.getOwnPropertyDescriptor(obj, prop) || {};
        Object.defineProperty(obj, prop, {
            configurable: true,
            writable: true, // Make it writable so we can change the value directly
            value: value,   // Set the value directly
        });
    };

    // Helper to restore properties
    const restoreProperty = (obj: any, prop: string) => {
        if (originalDescriptors[prop] && Object.keys(originalDescriptors[prop]).length > 0) {
            Object.defineProperty(obj, prop, originalDescriptors[prop]);
        } else {
            // If there was no original descriptor, delete the property
            delete obj[prop];
        }
    };

    beforeEach(() => {
        // Clear the document body for a clean slate
        document.body.innerHTML = '';

        // Mock window properties
        defineProperty(window, 'innerWidth', 1024);
        defineProperty(window, 'innerHeight', 768);
        defineProperty(window, 'pageYOffset', 50);
        defineProperty(window, 'pageXOffset', 10);
        defineProperty(window.screen, 'width', 1920);
        defineProperty(window.screen, 'height', 1080);

        // Mock document.body properties
        defineProperty(document.body, 'scrollHeight', 2000);
        defineProperty(document.body, 'offsetHeight', 1500);
        defineProperty(document.body, 'scrollWidth', 1800);
        defineProperty(document.body, 'offsetWidth', 1200);
        defineProperty(document.body, 'clientWidth', 1024);
        defineProperty(document.body, 'clientHeight', 768);

        // Mock document.documentElement properties
        defineProperty(document.documentElement, 'scrollTop', 50);
        defineProperty(document.documentElement, 'scrollLeft', 10);
        defineProperty(document.documentElement, 'clientHeight', 768);
        defineProperty(document.documentElement, 'scrollHeight', 2000);
        defineProperty(document.documentElement, 'clientWidth', 1024);
        defineProperty(document.documentElement, 'scrollWidth', 1800);
        defineProperty(document.documentElement, 'offsetHeight', 1500);
        defineProperty(document.documentElement, 'offsetWidth', 1200);
    });

    afterEach(() => {
        // Restore original properties after each test
        // Note: This restoration logic needs to be careful about which object the property belongs to.
        // For simplicity and robustness, we'll iterate through the properties we defined and restore them.
        restoreProperty(window, 'innerWidth');
        restoreProperty(window, 'innerHeight');
        restoreProperty(window, 'pageYOffset');
        restoreProperty(window, 'pageXOffset');
        restoreProperty(window.screen, 'width');
        restoreProperty(window.screen, 'height');

        restoreProperty(document.body, 'scrollHeight');
        restoreProperty(document.body, 'offsetHeight');
        restoreProperty(document.body, 'scrollWidth');
        restoreProperty(document.body, 'offsetWidth');
        restoreProperty(document.body, 'clientWidth');
        restoreProperty(document.body, 'clientHeight');

        restoreProperty(document.documentElement, 'scrollTop');
        restoreProperty(document.documentElement, 'scrollLeft');
        restoreProperty(document.documentElement, 'clientHeight');
        restoreProperty(document.documentElement, 'scrollHeight');
        restoreProperty(document.documentElement, 'clientWidth');
        restoreProperty(document.documentElement, 'scrollWidth');
        restoreProperty(document.documentElement, 'offsetHeight');
        restoreProperty(document.documentElement, 'offsetWidth');

        // Clear the stored descriptors for the next test run
        for (const prop in originalDescriptors) {
            delete originalDescriptors[prop];
        }
    });

    it('should return correct page dimensions (full document size)', () => {
        const result = getScreenSize();
        expect(result.page.height).toBe(2000); // Max of scrollHeight, offsetHeight, etc.
        expect(result.page.width).toBe(1800);  // Max of scrollWidth, offsetWidth, etc.
    });

    it('should return correct viewport dimensions (visible window area)', () => {
        const result = getScreenSize();
        expect(result.viewport.width).toBe(1024);
        expect(result.viewport.height).toBe(768);
    });

    it('should return correct availableContentArea (viewport adjusted for plugin)', () => {
        const result = getScreenSize();
        expect(result.availableContentArea.width).toBeCloseTo(1024 * 0.75); // 75% of viewport width
        expect(result.availableContentArea.height).toBe(768);
    });

    it('should return correct scroll information', () => {
        const result = getScreenSize();
        expect(result.scrollInfo.scrollTop).toBe(50);
        expect(result.scrollInfo.scrollLeft).toBe(10);
    });

    it('should return correct physical screen resolution', () => {
        const result = getScreenSize();
        expect(result.screen.width).toBe(1920);
        expect(result.screen.height).toBe(1080);
    });

    it('should handle fallback for window.innerWidth/innerHeight if undefined', () => {
        // Simulate older browser where innerWidth/innerHeight might be undefined
        Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: undefined });
        Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: undefined });

        const result = getScreenSize();
        // Should use document.documentElement.clientWidth/clientHeight as fallback
        expect(result.viewport.width).toBe(1024);
        expect(result.viewport.height).toBe(768);
    });

    it('should handle zero dimensions gracefully', () => {
        // Set all relevant properties to return 0
        defineProperty(window, 'innerWidth', 0);
        defineProperty(window, 'innerHeight', 0);
        defineProperty(window, 'pageYOffset', 0);
        defineProperty(window, 'pageXOffset', 0);
        defineProperty(window.screen, 'width', 0);
        defineProperty(window.screen, 'height', 0);

        defineProperty(document.body, 'scrollHeight', 0);
        defineProperty(document.body, 'offsetHeight', 0);
        defineProperty(document.body, 'scrollWidth', 0);
        defineProperty(document.body, 'offsetWidth', 0);
        defineProperty(document.body, 'clientWidth', 0);
        defineProperty(document.body, 'clientHeight', 0);

        defineProperty(document.documentElement, 'scrollTop', 0);
        defineProperty(document.documentElement, 'scrollLeft', 0);
        defineProperty(document.documentElement, 'clientHeight', 0);
        defineProperty(document.documentElement, 'scrollHeight', 0);
        defineProperty(document.documentElement, 'clientWidth', 0);
        defineProperty(document.documentElement, 'scrollWidth', 0);
        defineProperty(document.documentElement, 'offsetHeight', 0);
        defineProperty(document.documentElement, 'offsetWidth', 0);

        const result = getScreenSize();
        expect(result.page.height).toBe(0);
        expect(result.page.width).toBe(0);
        expect(result.viewport.width).toBe(0);
        expect(result.viewport.height).toBe(0);
        expect(result.availableContentArea.width).toBe(0);
        expect(result.availableContentArea.height).toBe(0);
        expect(result.scrollInfo.scrollTop).toBe(0);
        expect(result.scrollInfo.scrollLeft).toBe(0);
        expect(result.screen.width).toBe(0);
        expect(result.screen.height).toBe(0);
    });
});