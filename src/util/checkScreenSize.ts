import {getScreenSize} from "./getScreenSize";
import {UDAConsoleLogger, UDAErrorLogger} from "../config/error-log";

/**
 * Checks the screen size and determines plugin compatibility and alert status
 * based on effective resolution calculations.
 *
 * Minimum requirements:
 * - Height: 720px (optimal: 1080px)
 * - Width: 1280px (optimal: 1920px)
 *
 * @returns {Object} Object containing:
 *   - enablePluginForScreen: boolean - Whether the plugin should be enabled
 *   - showScreenAlert: boolean - Whether to show resolution warning
 */
export const checkScreenSize = (): { enablePluginForScreen: boolean; showScreenAlert: boolean } => {
    try {
        // Verify browser environment
        if (typeof window === 'undefined') {
            throw new Error('Window object is not available');
        }

        // Get current screen dimensions
        const screenSize = getScreenSize();

        // Validate screen size data structure
        if (!screenSize || !screenSize.resolution) {
            throw new Error('Invalid screen size object');
        }

        // Ensure resolution values are valid numbers
        if (typeof screenSize.resolution.width !== 'number' ||
            typeof screenSize.resolution.height !== 'number' ||
            screenSize.resolution.width <= 0 ||
            screenSize.resolution.height <= 0) {
            throw new Error('Invalid resolution values');
        }

        // Get device pixel ratio for high DPI displays
        const devicePixelRatio = window.devicePixelRatio || 1;

        // Validate device pixel ratio
        if (devicePixelRatio <= 0) {
            throw new Error('Invalid device pixel ratio');
        }

        // Calculate effective dimensions accounting for pixel ratio
        const effectiveHeight = screenSize.resolution.height * devicePixelRatio;
        const effectiveWidth = screenSize.resolution.width * devicePixelRatio;

        // Initialize status flags
        let enablePluginForScreen = true;
        let showScreenAlert = false;

        // Check height requirements
        if (effectiveHeight < 720) {
            enablePluginForScreen = false;
        } else if (effectiveHeight < 1080) {
            showScreenAlert = true;
        }

        // Check width requirements
        if (effectiveWidth < 1280) {
            enablePluginForScreen = false;
        } else if (effectiveWidth < 1920) {
            showScreenAlert = true;
        }

        // Log resolution information
        UDAConsoleLogger.info(`System given resolution is: ${screenSize.resolution.width}x${screenSize.resolution.height}`);
        UDAConsoleLogger.info(`Current resolution is: ${effectiveWidth}x${effectiveHeight}`);

        return { enablePluginForScreen, showScreenAlert };

    } catch (error) {
        // Log error and return safe defaults
        UDAErrorLogger.error(`Screen size check failed: ${error.message}`);
        return {
            enablePluginForScreen: false,
            showScreenAlert: true
        };
    }
}
