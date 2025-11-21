const logger = {
    debug: jest.fn(),
    log: jest.fn()
};

// IMPORTANT First mock winston
jest.mock("winston", () => ({
    format: {
        colorize: jest.fn(),
        combine: jest.fn(),
        label: jest.fn(),
        timestamp: jest.fn(),
        printf: jest.fn()
    },
    createLogger: jest.fn().mockReturnValue(logger),
    transports: {
        Console: jest.fn()
    }
}));

import { UDAErrorLogger } from '../error-log';
import { StorageUtil } from '../../storage';
import * as winston from 'winston';

// 1. Mock the entire winston module. Jest replaces all its functions with mocks.
jest.mock('winston');

// 2. Mock the StorageUtil module.
jest.mock('../../storage', () => ({
  StorageUtil: {
    get: jest.fn(),
  },
}));

describe('UDAErrorLogger', () => {
  // 3. Get a reference to the mocked functions so we can control and inspect them.
  const mockLog = jest.fn();
  const mockCreateLogger = winston.createLogger as jest.Mock;

  beforeEach(() => {
    // 4. Before each test, clear any previous mock usage.
    jest.clearAllMocks();

    // 5. Tell the mocked createLogger what to return when it's called.
    mockCreateLogger.mockReturnValue({ log: mockLog });

    // 6. Set up the mock for StorageUtil for our tests.
    (StorageUtil.get as jest.Mock).mockResolvedValue({
      authdata: { id: 'test-user-123' },
    });
  });

  it('should log an error message with a user ID', async () => {
    const errorMessage = 'This is a test error';
    await UDAErrorLogger.error(errorMessage);

    // Assert that our mocks were called correctly
    expect(mockCreateLogger).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledTimes(1);
    const expectedMessage = 'UserID: test-user-123 Error: ' + errorMessage;
    expect(mockLog).toHaveBeenCalledWith('error', expectedMessage);
  });

  it('should handle cases where user data is not available', async () => {
    (StorageUtil.get as jest.Mock).mockResolvedValue(null);

    const errorMessage = 'Another test error';
    await UDAErrorLogger.error(errorMessage);

    expect(mockLog).toHaveBeenCalledTimes(1);
    const expectedMessage = 'Error: ' + errorMessage;
    expect(mockLog).toHaveBeenCalledWith('error', expectedMessage);
  });

  it('should handle exceptions when reading from storage', async () => {
    (StorageUtil.get as jest.Mock).mockRejectedValue(new Error('Storage failed'));

    const errorMessage = 'Error after storage failure';
    await UDAErrorLogger.error(errorMessage);

    expect(mockLog).toHaveBeenCalledTimes(1);
    const expectedMessage = 'Error: ' + errorMessage;
    expect(mockLog).toHaveBeenCalledWith('error', expectedMessage);
  });

  it('should handle non-string error messages', async () => {
    const errorObject = { code: 500, details: 'Internal Server Error' };
    await UDAErrorLogger.error(errorObject);

    expect(mockLog).toHaveBeenCalledTimes(1);
    const expectedMessage = 'UserID: test-user-123 Error: ' + errorObject;
    expect(mockLog).toHaveBeenCalledWith('error', expectedMessage);
  });
});
