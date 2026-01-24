
import { getScreenSize } from "./getScreenSize";
import { UDAConsoleLogger, UDAErrorLogger } from "../error/error-log";

/**
 * Checks the screen size and determines plugin compatibility and alert status.
 *
 * This function is intended to evaluate the current screen resolution against minimum
 * and optimal requirements to decide if a plugin should be enabled and if a warning
 * should be displayed to the user.
 *
 * Minimum requirements:
 * - Height: 720px
 * - Width: 1280px
 *
 * Optimal requirements:
 * - Height: 1080px
 * - Width: 1920px
 *
 * @returns {Object} An object containing:
 *   - `enablePluginForScreen`: `boolean` - Whether the plugin should be enabled.
 *   - `showScreenAlert`: `boolean` - Whether to show a resolution warning.
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
        if (!screenSize || !screenSize.screen) {
            throw new Error('Invalid screen size object');
        }

        // Ensure resolution values are valid numbers
        if (typeof screenSize.screen.width !== 'number' ||
            typeof screenSize.screen.height !== 'number' ||
            screenSize.screen.width <= 0 ||
            screenSize.screen.height <= 0) {
            throw new Error('Invalid resolution values');
        }

        // Get device pixel ratio for high DPI displays, defaulting to 1 if null or undefined
        const devicePixelRatio = window.devicePixelRatio ?? 1;

        // Validate device pixel ratio
        if (devicePixelRatio <= 0) {
            throw new Error('Invalid device pixel ratio');
        }

        // Calculate effective dimensions accounting for pixel ratio
        const effectiveHeight = screenSize.screen.height * devicePixelRatio;
        const effectiveWidth = screenSize.screen.width * devicePixelRatio;

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
        UDAConsoleLogger.info(`System given resolution is: ${screenSize.screen.width}x${screenSize.screen.height}`);
        UDAConsoleLogger.info(`Current resolution is: ${effectiveWidth}x${effectiveHeight}`);

        return { enablePluginForScreen, showScreenAlert };

    } catch (error: any) {
        // Log any errors that occur during the screen size check.
        UDAErrorLogger.error(`Screen size check failed: ${error.message}`);
        // Return safe defaults in case of an error.
        return {
            enablePluginForScreen: false,
            showScreenAlert: true
        };
    }
}
