/**
 * Creates a promise that resolves after a specified number of milliseconds.
 * This is a simple utility function for creating delays in asynchronous operations.
 *
 * @param ms The number of milliseconds to wait before the promise resolves.
 * @returns A promise that resolves after the specified delay.
 */
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
