import {UDAErrorLogger} from '../config/error-log';
import {getScreenSize} from "../util/getScreenSize";
import {checkScreenSize} from "../util/checkScreenSize";

// Mock dependencies
jest.mock('../util/getScreenSize');
jest.mock('../config/error-log');

const mockedGetScreenSize = jest.mocked(getScreenSize);

/*// Define the window interface
declare global {
    interface Window {
        devicePixelRatio: number;
    }
}*/

describe('checkScreenSize', () => {
    // Define window type for testing environment
    const mockWindow = {
        devicePixelRatio: 1
    };

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Set up window mock
        Object.defineProperty(global, 'window', {
            value: mockWindow,
            writable: true
        });
    });

    afterEach(() => {
        // Clean up window mock
        Object.defineProperty(global, 'window', {
            value: undefined,
            writable: true
        });
    });

    /*// Store original window object
    const originalWindow = global.window;

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Mock window object
        global.window = {
            ...originalWindow,
            devicePixelRatio: 1
        };
    });

    afterEach(() => {
        // Restore window object after each test
        global.window = originalWindow;
    });*/

    // Test cases for valid resolutions
    test('should enable plugin and not show alert for optimal resolution', () => {
        mockedGetScreenSize.mockReturnValue({
            resolution: { width: 1920, height: 1080 }
        });

        const result = checkScreenSize();
        expect(result).toEqual({
            enablePluginForScreen: true,
            showScreenAlert: false
        });
    });

    test('should enable plugin but show alert for minimum resolution', () => {
        mockedGetScreenSize.mockReturnValue({
            resolution: { width: 1280, height: 720 }
        });

        const result = checkScreenSize();
        expect(result).toEqual({
            enablePluginForScreen: true,
            showScreenAlert: true
        });
    });

    // Test cases for invalid resolutions
    test('should disable plugin for insufficient width', () => {
        mockedGetScreenSize.mockReturnValue({
            resolution: { width: 1024, height: 1080 }
        });

        const result = checkScreenSize();
        expect(result).toEqual({
            enablePluginForScreen: false,
            showScreenAlert: true
        });
    });

    test('should disable plugin for insufficient height', () => {
        mockedGetScreenSize.mockReturnValue({
            resolution: { width: 1920, height: 600 }
        });

        const result = checkScreenSize();
        expect(result).toEqual({
            enablePluginForScreen: false,
            showScreenAlert: true
        });
    });

    // Test cases for high DPI displays
    test('should handle high DPI displays correctly', () => {
        // Set DPI ratio on the mock window
        Object.defineProperty(global.window, 'devicePixelRatio', {
            value: 2,
            writable: true
        });

        mockedGetScreenSize.mockReturnValue({
            resolution: { width: 960, height: 540 }
        });

        const result = checkScreenSize();
        expect(result).toEqual({
            enablePluginForScreen: true,
            showScreenAlert: true
        });
    });


    // Error cases
    test('should handle missing window object', () => {
        delete global.window;

        const result = checkScreenSize();
        expect(result).toEqual({
            enablePluginForScreen: false,
            showScreenAlert: true
        });
        expect(UDAErrorLogger.error).toHaveBeenCalled();
    });

    test('should handle invalid screen size object', () => {
        mockedGetScreenSize.mockReturnValue(null);

        const result = checkScreenSize();
        expect(result).toEqual({
            enablePluginForScreen: false,
            showScreenAlert: true
        });
        expect(UDAErrorLogger.error).toHaveBeenCalled();
    });

    test('should handle negative resolution values', () => {
        mockedGetScreenSize.mockReturnValue({
            resolution: { width: -1920, height: -1080 }
        });

        const result = checkScreenSize();
        expect(result).toEqual({
            enablePluginForScreen: false,
            showScreenAlert: true
        });
        expect(UDAErrorLogger.error).toHaveBeenCalled();
    });

    test('should handle invalid device pixel ratio', () => {
        global.window.devicePixelRatio = -1;
        mockedGetScreenSize.mockReturnValue({
            resolution: { width: 1920, height: 1080 }
        });

        const result = checkScreenSize();
        expect(result).toEqual({
            enablePluginForScreen: false,
            showScreenAlert: true
        });
        expect(UDAErrorLogger.error).toHaveBeenCalled();
    });
});
