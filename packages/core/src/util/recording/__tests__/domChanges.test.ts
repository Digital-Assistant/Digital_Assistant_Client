
// Mock dependencies first
import { addBodyEvents } from '../addBodyEvents';
import { CONFIG } from '../../../config';
import { StorageUtil } from '../../storage';

jest.mock('../addBodyEvents');
jest.mock('../../storage', () => ({
  StorageUtil: {
    getFromStore: jest.fn(),
  },
}));

// Mock the global MutationObserver *before* importing the module under test
let capturedCallback: MutationCallback | null = null;
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();

global.MutationObserver = jest.fn((callback) => {
  capturedCallback = callback; // Capture the callback passed to the constructor
  return {
    observe: mockObserve,
    disconnect: mockDisconnect,
    takeRecords: jest.fn(),
  };
});

// Now, import the module. It will be initialized with our mocked MutationObserver.
import { observer, initializeDomChanges, _resetTimerForTest } from '../domChanges';

// Use fake timers to control setTimeout
jest.useFakeTimers();

describe('domChanges', () => {
  let setTimeoutSpy: jest.SpyInstance;
  let clearTimeoutSpy: jest.SpyInstance;

  beforeEach(() => {
    // Clear all mocks and reset the module's internal timer
    jest.clearAllMocks();
    _resetTimerForTest(); // This is the key fix

    // Set up spies on the global timer functions
    setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    // Clear mocks from previous tests
    (StorageUtil.getFromStore as jest.Mock).mockClear();
    mockObserve.mockClear();
    mockDisconnect.mockClear();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Restore spies
    setTimeoutSpy.mockRestore();
    clearTimeoutSpy.mockRestore();
  });

  describe('initializeDomChanges', () => {
    it('should start observing the document body with correct options', () => {
      initializeDomChanges();
      expect(mockObserve).toHaveBeenCalledWith(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    });
  });

  describe('observer callback', () => {
    // Helper to ensure the callback was captured before invoking it
    const invokeCallback = () => {
      if (!capturedCallback) {
        throw new Error('MutationObserver callback was not captured.');
      }
      capturedCallback([], observer);
    };

    it('should call addBodyEvents when a mutation occurs and recording is on', async () => {
      (StorageUtil.getFromStore as jest.Mock).mockReturnValue('true');
      invokeCallback();
      
      expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), CONFIG.indexInterval);
      
      await jest.runAllTimersAsync();
      
      expect(addBodyEvents).toHaveBeenCalledTimes(1);
    });

    it('should not call addBodyEvents when recording is off', async () => {
      (StorageUtil.getFromStore as jest.Mock).mockReturnValue('false');
      invokeCallback();
      await jest.runAllTimersAsync();
      expect(addBodyEvents).not.toHaveBeenCalled();
    });

    it('should debounce calls to addBodyEvents', async () => {
      (StorageUtil.getFromStore as jest.Mock).mockReturnValue('true');
      
      invokeCallback(); // timer is set
      invokeCallback(); // timer is cleared and re-set
      invokeCallback(); // timer is cleared and re-set

      expect(setTimeoutSpy).toHaveBeenCalledTimes(3);
      expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
      
      await jest.runAllTimersAsync();
      
      expect(addBodyEvents).toHaveBeenCalledTimes(1);
    });

    it('should not crash and should log error if StorageUtil throws', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Storage error');
      (StorageUtil.getFromStore as jest.Mock).mockImplementation(() => {
        throw error;
      });

      invokeCallback();
      await expect(jest.runAllTimersAsync()).resolves.not.toThrow();
      
      expect(addBodyEvents).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error during DOM change observation:", error);
      
      consoleErrorSpy.mockRestore();
    });
  });
});
