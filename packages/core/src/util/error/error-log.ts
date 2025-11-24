// Import necessary modules and configurations.
import { CONFIG } from "../../config";
import { StorageUtil } from "../storage";
import * as winston from "winston";

// Destructure Winston's format and transports, keeping it simple to avoid breaking tests.
const { format, transports: WinstonTransports } = winston as any;

// Public constant for backward-compatibility; not used for gating anymore.
// Consumers should rely on Winston levels through the logger.
export const UDALogLevel = 3;

// Define the host for the error-only HTTP transport.
const UDA_LOG_URL = process.env.tokenUrl;

// Define a type for supported Winston levels.
export type WinstonLevel =
    | "error"
    | "warn"
    | "info"
    | "http"
    | "verbose"
    | "debug"
    | "silly";

// Resolve the minimum console log level from configuration or environment variables.
function resolveConsoleLevel(): WinstonLevel {
    // Get log level from config or environment variables, defaulting to "info".
    const cfgLvl = (CONFIG as any)?.LOG_LEVEL as WinstonLevel | undefined;
    const envLvl = (process.env.UDA_LOG_LEVEL as WinstonLevel | undefined) || undefined;
    const level = (cfgLvl || envLvl || "info") as WinstonLevel;
    return level;
}

// Map legacy numeric log levels to Winston levels for backward compatibility.
function mapNumericToLevel(n?: number): WinstonLevel {
    switch (n) {
        case 1:
            return "info";
        case 2:
            return "warn";
        case 3:
            return "debug";
        case 4:
            return "verbose";
        default:
            return "info";
    }
}

// Build a singleton logger to be shared by UDAConsoleLogger and UDAErrorLogger.
let sharedLogger: winston.Logger | null = null;

// Function to get the shared logger instance, creating it if it doesn't exist.
function getLogger(): winston.Logger {
    // Return the existing logger if it has already been created.
    if (sharedLogger) return sharedLogger;

    // Check if the current environment is for testing.
    const isTestEnv = process.env.NODE_ENV === "test";
    // Resolve the console log level.
    const consoleLevel = resolveConsoleLevel();

    // Define the transports for Winston.
    const tx: any[] = [
        new WinstonTransports.Console({ level: consoleLevel }),
    ];

    // Add HTTP transport for error level logs, but not in test environments and only if a host is present.
    if (!isTestEnv && WinstonTransports?.Http && UDA_LOG_URL) {
        tx.push(
            new WinstonTransports.Http({
                level: "error",
                host: UDA_LOG_URL, // Remote server host.
                port: 443,
                path: "logging/error",
            })
        );
    }

    // Create the logger with the defined level, format, and transports.
    sharedLogger = winston.createLogger({
        level: consoleLevel,
        // Combine timestamp and a custom printf format for log messages.
        format: format.combine(
            format.timestamp(),
            format.printf(({ level, message, timestamp }: any) => `${timestamp} [${level}] ${message}`)
        ),
        transports: tx,
    });
    // Return the newly created logger.
    return sharedLogger;
}

// Console logger that supports both Winston level strings and legacy numeric levels.
export const UDAConsoleLogger = {
    /**
     * Logs messages using Winston, respecting the configured minimum console level.
     * Supports both Winston level strings and legacy numeric levels.
     * Numeric mapping: 1→info, 2→warn, 3→debug, 4→verbose (default is info).
     */
    info: function (mes: any, levelNumber: number = 0) {
        // Get the logger instance.
        const logger = getLogger();

        // Resolve the console log level.
        const consoleLevel: WinstonLevel = resolveConsoleLevel();

        // Log the message at the selected level.
        // The console transport will only emit if the level is at or above the configured console level.
        if (levelNumber >= (process.env.UDA_LOG_LEVELNumber || 1)) {
            (logger as any)[consoleLevel]?.(typeof mes === "string" ? mes : JSON.stringify(mes));
        }
    },
};

// Error logger for sending error logs to the server and console.
export const UDAErrorLogger = {
    /**
     * Sends error logs to the server via HTTP transport and to the console,
     * subject to the minimum log level. By design, only errors are sent to the server.
     */
    error: async function (message: any, exception: any = {message: "Error"}) {
        // If the message is not a string, stringify it for better logging.
        const errorMessage = typeof message === 'string' ? message : JSON.stringify(message);

        let finalMessage: string;

        try {
            // Retrieve user authentication data from storage.
            const UDAUserAuthData: any = await StorageUtil.get(
                CONFIG.USER_AUTH_DATA_KEY,
                false
            );
            // Get the user ID from the authentication data.
            const userId = UDAUserAuthData?.authdata?.id;
            // Prepend the user ID to the message if it exists.
            if (userId) {
                finalMessage = "UserID: " + userId + " Error: " + errorMessage;
            } else {
                finalMessage = "Error: " + errorMessage;
            }
        } catch (e) {
            // If an error occurs while getting user data, format the message without user ID.
            finalMessage = "Error: " + errorMessage;
        }

        // Get the logger instance and log the error message.
        const logger = getLogger();
        logger.error(finalMessage);
    },
};
