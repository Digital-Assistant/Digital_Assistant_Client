import { CONFIG } from '../config';
import { getFromStore } from '../util';

// Import winston for its formatting capabilities
const winston = require('winston');
const { createLogger } = winston;

// Log levels matching RFC5424 (same as Winston's defaults)
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
};

// Determine the current log level based on environment
const getCurrentLogLevel = () => {
    // In production, only show error and warn
    /*if (process.env.NODE_ENV === 'production') {
        return 'warn'; // 1
    }*/

    // In development, show all logs up to debug
    return 'debug'; // 5
};

// Check if a log level should be enabled based on the current environment
const isLevelEnabled = (level: string) => {
    const currentLevel = levels[getCurrentLogLevel()];
    const requestedLevel = levels[level];

    // Log is enabled if its level is less than or equal to the current level
    return requestedLevel <= currentLevel;
};

// Create a browser-compatible Winston logger
const logger = createLogger({
    level: getCurrentLogLevel(),
    levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: []  // No transports - we'll handle sending logs ourselves
});

// Enrich logs with user context
const enrichWithContext = (message: any, meta: any = {}) => {
    try {
        const userData = getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
        return {
            ...meta,
            userId: userData?.authdata?.id || 'anonymous',
            sessionId: getFromStore('sessionId', false) || 'unknown',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            message
        };
    } catch (e) {
        return {
            ...meta,
            message,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
    }
};

// Send log directly to server
const sendLogToServer = async (level: string, message: any, meta: any = {}) => {
    // Only send logs if the level is enabled
    if (!isLevelEnabled(level)) return;

    // Only send errors to the server in production
    if (process.env.NODE_ENV === 'production' && level !== 'error') return;

    try {
        const enrichedLog = enrichWithContext(message, meta);

        // Format using Winston's formatter
        const formattedLog = logger.format.transform({
            level,
            message: enrichedLog.message,
            ...enrichedLog
        });

        // Send log to server immediately
        await fetch(`${process.env.tokenUrl}logging/error`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedLog),
        });
    } catch (error) {
        // Use original console to avoid infinite loops
        console.error('Failed to send log:', error);
    }
};

// Custom logging functions that use the original console methods
const customLogger = {
    error: function(message: any, meta: any = {}) {
        // Always show errors regardless of environment
        console.error(message, meta);

        // Send to server
        sendLogToServer('error', message, meta);
    },

    warn: function(message: any, meta: any = {}) {
        // Only show if warn level is enabled
        if (isLevelEnabled('warn')) {
            console.warn(message, meta);
        }

        // Send to server if enabled
        sendLogToServer('warn', message, meta);
    },

    info: function(message: any, meta: any = {}) {
        // Only show if info level is enabled
        if (isLevelEnabled('info')) {
            console.info(message, meta);
        }

        // Send to server if enabled
        sendLogToServer('info', message, meta);
    },

    debug: function(message: any, meta: any = {}) {
        // Only show if debug level is enabled
        if (isLevelEnabled('debug')) {
            console.debug(message, meta);
        }

        // Send to server if enabled
        sendLogToServer('debug', message, meta);
    }
};

// Set up global error handlers
if (typeof window !== 'undefined') {
    // Capture uncaught exceptions
    window.addEventListener('error', (event) => {
        customLogger.error(event.message, {
            stack: event.error?.stack,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            type: 'uncaught_exception'
        });
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        const message = event.reason?.message || 'Unhandled Promise Rejection';

        customLogger.error(message, {
            stack: event.reason?.stack,
            type: 'unhandled_rejection',
            reason: event.reason
        });
    });

    // Log initialization message
    console.log('Logger initialized. Current log level:', getCurrentLogLevel());
}

// Public API
export const LogService = {
    error: (message: any, meta: any = {}) => {
        customLogger.error(message, meta);
    },
    warn: (message: any, meta: any = {}) => {
        customLogger.warn(message, meta);
    },
    info: (message: any, meta: any = {}) => {
        customLogger.info(message, meta);
    },
    debug: (message: any, meta: any = {}) => {
        customLogger.debug(message, meta);
    },
    // Add component context
    withComponent: (componentName: string) => ({
        error: (message: any, meta: any = {}) => {
            customLogger.error(message, { ...meta, component: componentName });
        },
        warn: (message: any, meta: any = {}) => {
            customLogger.warn(message, { ...meta, component: componentName });
        },
        info: (message: any, meta: any = {}) => {
            customLogger.info(message, { ...meta, component: componentName });
        },
        debug: (message: any, meta: any = {}) => {
            customLogger.debug(message, { ...meta, component: componentName });
        },
    }),
    // Check if a log level is enabled
    isLevelEnabled,
    // Get current log level
    getCurrentLogLevel
};
