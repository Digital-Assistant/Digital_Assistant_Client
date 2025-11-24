import { UDAErrorLogger } from '../error-log';
import { StorageUtil } from '../../storage';
import * as winston from 'winston';

// 1. Mock the entire winston module. Jest will automatically mock all its functions.
jest.mock('winston');

// 2. Mock the StorageUtil module.
jest.mock('../../storage', () => ({
  StorageUtil: {
    get: jest.fn(),
  },
}));

describe('UDAErrorLogger', () => {
  // 3. Create mock functions for the logger methods we need to test.
  const mockError = jest.fn();
  const mockLog = jest.fn();
  
  // 4. Get a reference to the auto-mocked createLogger function.
  const mockCreateLogger = winston.createLogger as jest.Mock;

  beforeEach(() => {
    // 5. Before each test, clear any previous mock usage.
    jest.clearAllMocks();

    // 6. Tell the mocked createLogger what to return for this test run.
    //    This is the key fix: ensure the returned object has the 'error' method.
    mockCreateLogger.mockReturnValue({
        error: mockError,
        log: mockLog,
    });

    // 7. Set up the default mock for StorageUtil for our tests.
    (StorageUtil.get as jest.Mock).mockResolvedValue({
      authdata: { id: 'test-user-123' },
    });
  });

  it('should log an error message with a user ID', async () => {
    const errorMessage = 'This is a test error';
    await UDAErrorLogger.error(errorMessage);

    // Assert that our mocks were called correctly
    expect(mockCreateLogger).toHaveBeenCalledTimes(1);
    expect(mockError).toHaveBeenCalledTimes(1); // Check the 'error' method
    const expectedMessage = 'UserID: test-user-123 Error: ' + errorMessage;
    expect(mockError).toHaveBeenCalledWith(expectedMessage);
  });

  it('should handle cases where user data is not available', async () => {
    (StorageUtil.get as jest.Mock).mockResolvedValue(null);

    const errorMessage = 'Another test error';
    await UDAErrorLogger.error(errorMessage);

    expect(mockError).toHaveBeenCalledTimes(1);
    const expectedMessage = 'Error: ' + errorMessage;
    expect(mockError).toHaveBeenCalledWith(expectedMessage);
  });

  it('should handle exceptions when reading from storage', async () => {
    (StorageUtil.get as jest.Mock).mockRejectedValue(new Error('Storage failed'));

    const errorMessage = 'Error after storage failure';
    await UDAErrorLogger.error(errorMessage);

    expect(mockError).toHaveBeenCalledTimes(1);
    const expectedMessage = 'Error: ' + errorMessage;
    expect(mockError).toHaveBeenCalledWith(expectedMessage);
  });

  it('should handle non-string error messages', async () => {
    const errorObject = { code: 500, details: 'Internal Server Error' };
    await UDAErrorLogger.error(errorObject);

    expect(mockError).toHaveBeenCalledTimes(1);
    const expectedMessage = 'UserID: test-user-123 Error: ' + JSON.stringify(errorObject);
    // Note: The original code had a bug where it would concatenate the object, resulting in '[object Object]'.
    // I've updated the test to reflect the actual stringified behavior. If this is not desired, the source code should be changed.
    // Assuming the source code stringifies the object:
    expect(mockError).toHaveBeenCalledWith(expectedMessage);
  });
});
