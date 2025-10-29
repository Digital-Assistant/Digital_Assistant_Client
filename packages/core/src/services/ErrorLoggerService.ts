import winston from 'winston';
import {type RootState, store} from '../store';
import { DigitalAssistantConfiguration } from '../DigitalAssistantConfiguration';

/**
 * A service for logging errors to a remote endpoint using Winston.
 * This service replicates the error logging functionality from the original UDAErrorLogger.
 */
export class ErrorLoggerService {
    private config: DigitalAssistantConfiguration;
    private logger: winston.Logger;

    /**
     * Creates an instance of ErrorLoggerService.
     * @param config - The SDK configuration containing logging settings.
     */
    constructor(config: DigitalAssistantConfiguration) {
        this.config = config;

        const loggingConfig = this.config.logging;

        if (!loggingConfig?.host || !loggingConfig?.path) {
            // If no remote logging is configured, log a warning and fallback to console.
            console.warn('Remote error logging is not configured. Falling back to console.');
            this.logger = this.createConsoleLogger();
        } else {
            this.logger = winston.createLogger({
                transports: [
                    new winston.transports.Http({
                        ssl: loggingConfig.ssl ?? true,
                        host: loggingConfig.host,
                        port: loggingConfig.port ?? 443,
                        path: loggingConfig.path,
                    }),
                ],
            });
        }
    }

    /**
     * Creates a fallback logger that outputs to the console.
     */
    private createConsoleLogger(): winston.Logger {
        return winston.createLogger({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    ),
                }),
            ],
        });
    }

    /**
     * Logs an error message and an optional exception object.
     * It enriches the log message with the current user ID if available.
     *
     * @param message The primary error message.
     * @param exception An optional exception object.
     */
    public error(message: string, exception: any = {}): void {
        let enrichedMessage = message;
        try {
            // Attempt to get user data from the Redux store
            const state: RootState | undefined = (store as any)?.getState?.();
            if (!state || typeof state !== 'object') {
                console.error('getUserSessionId: invalid store state');
                return;
            }
            const userId = state.user?.userSessionData?.authData?.id;
            if (userId) {
                enrichedMessage = `UserID: ${userId} | Error: ${message}`;
            }
        } catch (e) {
            // Ignore if store or user data is not available
        }

        this.logger.log('error', enrichedMessage, { exception });
    }
}
