
/**
 * UDAErrorLogger class for logging errors.
 */
export class UDAErrorLogger {
    /**
     * Logs an error message and the corresponding error object.
     * @param message - The error message to log.
     * @param error - The error object to log.
     */
    static error(message: string, error: any) {
        console.error(message, error);
    }
}
