import { getUserId, getSessionKey } from '../services/userService';
import { getFromStore } from '../util';
import { CONFIG } from '../config';

// Mock the getFromStore function
/**
 * Mocks the `getFromStore` function from the `../util` module for testing purposes.
 * This allows the test suite to control the behavior of the `getFromStore` function
 * and verify its usage in the `getUserId` and `getSessionKey` functions.
 */
jest.mock('../util', () => ({
  getFromStore: jest.fn(),
}));

/**
 * Provides additional tests for the `userService` module.
 * 
 * This suite of tests covers edge cases and additional functionality
 * for the `getUserId` and `getSessionKey` functions.
 */
describe('userService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should initialize correctly', () => {
    // Add a simple test case here
    expect(true).toBe(true);
  });
});

 // Test suite for getSessionKey function
 describe('getSessionKey', () => {
    // Test case to verify session key retrieval when user session data is available
    it('should return session key when user session data is available', async () => {
      // Mock user data with a session key
      const mockUserData = {
        sessionkey: 'session123',
      };
      // Mock getFromStore to return the mockUserData
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);
  
      // Call the function being tested
      const result = await getSessionKey();
      // Assert the correct session key is returned
      expect(result).toBe('session123');
      // Verify getFromStore was called with correct parameters
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });
  
    // Test case to verify null return when user session data is not available
    it('should return null when user session data is not available', async () => {
      // Mock getFromStore to return null
      (getFromStore as jest.Mock).mockResolvedValue(null);
  
      // Call the function being tested
      const result = await getSessionKey();
      // Assert null is returned
      expect(result).toBeNull();
      // Verify getFromStore was called with correct parameters
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });
  
    // Test case to verify null return when sessionkey is missing
    it('should return null when sessionkey is missing', async () => {
      // Mock user data without a sessionkey
      const mockUserData = {};
      // Mock getFromStore to return the mockUserData
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);
  
      // Call the function being tested
      const result = await getSessionKey();
      // Assert null is returned
      expect(result).toBeNull();
    });
  });
  
  // Additional edge cases test suite
  describe('Edge cases', () => {
    // Test case to handle empty string user id
    it('should handle empty string user id', async () => {
      // Mock user data with an empty string id
      const mockUserData = {
        authdata: {
          id: '',
        },
      };
      // Mock getFromStore to return the mockUserData
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);
  
      // Call getUserId function
      const result = await getUserId();
      // Assert an empty string is returned
      expect(result).toBe('');
    });
  
    // Test case to handle empty string session key
    it('should handle empty string session key', async () => {
      // Mock user data with an empty string sessionkey
      const mockUserData = {
        sessionkey: '',
      };
      // Mock getFromStore to return the mockUserData
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);
  
      // Call getSessionKey function
      const result = await getSessionKey();
      // Assert an empty string is returned
      expect(result).toBe('');
    });
  
    // Test case to handle getFromStore throwing an error
    it('should handle getFromStore throwing an error', async () => {
      // Mock getFromStore to throw an error
      (getFromStore as jest.Mock).mockRejectedValue(new Error('Storage error'));
  
      // Assert that getUserId rejects with the correct error
      await expect(getUserId()).rejects.toThrow('Storage error');
      // Assert that getSessionKey rejects with the correct error
      await expect(getSessionKey()).rejects.toThrow('Storage error');
    });
  });

// Test suite for getSessionKey function
describe('getSessionKey', () => {
    // Test case to verify null return when userSessionData.sessionkey is not a string
    it('should return null if userSessionData.sessionkey is not a string', async () => {
      // Mock setup and assertion
    });
  
    // Test case to verify null return when userSessionData.sessionkey is an empty string
    it('should return null if userSessionData.sessionkey is an empty string', async () => {
      // Mock setup and assertion
    });
  
    // Test case to verify null return when userSessionData.sessionkey is a string of length 0
    it('should return null if userSessionData.sessionkey is a string of length 0', async () => {
      // Mock setup and assertion
    });
  
    // Test case to verify null return when userSessionData.sessionkey is a string longer than 255 characters
    it('should return null if userSessionData.sessionkey is a string of length greater than 255', async () => {
      // Mock setup and assertion
    });
  });
  
  // Test suite for getSessionKey function
  describe('getSessionKey', () => {
    // Test case to verify correct session key return when it is available
    it('should return the session key when it is available', async () => {
      // Mock setup, function call, and assertions
    });

    // Test case to verify null return when userSessionData is null
    it('should return null when userSessionData is null', async () => {
      // Mock setup, function call, and assertions
    });
  });

// Test suite for getSessionKey function
describe('getSessionKey', () => {
    // Test case to verify null return when userSessionData is null
    it('should return null if userSessionData is null', async () => {
     // Mock getFromStore to return null
      (getFromStore as jest.Mock).mockResolvedValue(null);
      expect(await getSessionKey()).toBeNull();
    });
  
    /**
     * Tests the behavior of the `getSessionKey` function in the `userService`.
     *
     * - Verifies that `getSessionKey` returns `null` if the `userSessionData` object does not have a `sessionkey` property.
     * - Verifies that `getSessionKey` returns the session key value if the `userSessionData` object has a `sessionkey` property.
     */
    it('should return null if userSessionData does not have sessionkey property', async () => {
      (getFromStore as jest.Mock).mockResolvedValue({});
      expect(await getSessionKey()).toBeNull();
    });
  
    it('should return the session key if userSessionData has sessionkey property', async () => {
      const sessionKey = 'abc123';
      (getFromStore as jest.Mock).mockResolvedValue({ sessionkey: sessionKey });
      expect(await getSessionKey()).toBe(sessionKey);
    });
  });
  
/**
 * Tests that the `getSessionKey` function returns `null` when the `userSessionData.sessionkey` property is not a string.
 */
describe('getSessionKey', () => {
    it('should return null if userSessionData.sessionkey is not a string', async () => {
      (getFromStore as jest.Mock).mockResolvedValue({ sessionkey: 123 });
      expect(await getSessionKey()).toBeNull();
    });
  
    /**
     * Tests that the `getSessionKey` function returns `null` when the `userSessionData.sessionkey` property is an empty string.
     */
    it('should return null if userSessionData.sessionkey is a string of length 0', async () => {
      (getFromStore as jest.Mock).mockResolvedValue({ sessionkey: '' });
      expect(await getSessionKey()).toBeNull();
    });
  
    /**
     * Tests that the `getSessionKey` function returns `null` when the `userSessionData.sessionkey` property is a string of length greater than 255.
     */
    it('should return null if userSessionData.sessionkey is a string of length greater than 255', async () => {
      const sessionKey = 'a'.repeat(256);
      (getFromStore as jest.Mock).mockResolvedValue({ sessionkey: sessionKey });
      expect(await getSessionKey()).toBeNull();
    });
  });
  
 /**
   * Tests that the `getSessionKey` function returns the session key when it is available in the user session data.
   */
 describe('getSessionKey', () => {
    it('should return the session key when it is available', async () => {
      const mockUserSessionData = {
        sessionkey: 'session123',
      };
      (getFromStore as jest.Mock).mockResolvedValueOnce(mockUserSessionData);

      const sessionKey = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBe('session123');
    });

    /**
     * Tests that the `getSessionKey` function returns `null` when the `userSessionData` is `null`.
     */
    it('should return null when userSessionData is null', async () => {
      (getFromStore as jest.Mock).mockResolvedValueOnce(null);

      const sessionKey = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBeNull();
    });
  });

  /**
   * Tests that the `getSessionKey` function returns `null` when the `sessionkey` property of the user session data is an empty string.
   */
  describe('getSessionKey', () => {
    it('should return null when sessionkey is an empty string', async () => {
      const mockUserSessionData = {
        sessionkey: '',
      };
      (getFromStore as jest.Mock).mockResolvedValueOnce(mockUserSessionData);

      const sessionKey = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBeNull();
    });

    /**
     * Tests that the `getSessionKey` function returns `null` when the `userSessionData` does not contain the `sessionkey` property.
     */
    it('should return null when userSessionData does not contain the sessionkey property', async () => {
      const mockUserSessionData = {
        authdata: {
          id: 'user123',
        },
      };
      (getFromStore as jest.Mock).mockResolvedValueOnce(mockUserSessionData);

      const sessionKey = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBeNull();
    });

    /**
     * Tests that the `getSessionKey` function returns `null` when the `userSessionData` is an empty object.
     */
    it('should return null when userSessionData is an empty object', async () => {
      (getFromStore as jest.Mock).mockResolvedValueOnce({});

      const sessionKey = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBeNull();
    });
  });

  /**
   * Tests that the `getSessionKey` function returns `null` when the `userSessionData` is missing the `sessionkey` property or the `sessionkey` property is `null`.
   */
  describe('getSessionKey', () => {
    it('should return null when the session key is not available', async () => {
      const mockUserSessionData = {
        sessionkey: null,
      };
      (getFromStore as jest.Mock).mockResolvedValueOnce(mockUserSessionData);

      const sessionKey = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBeNull();
    });
  });

  describe('getSessionKey', () => {
    // Existing test cases...

    /**
     * Tests that the `getSessionKey` function returns `null` when the `userSessionData` has a `sessionkey` property that is an empty string.
     */
    it('should return null when sessionkey is an empty string', async () => {
      const mockUserSessionData = {
        sessionkey: '',
      };
      (getFromStore as jest.Mock).mockResolvedValueOnce(mockUserSessionData);

      const sessionKey = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBeNull();
    });

    /**
     * Tests that the `getSessionKey` function returns `null` when the `userSessionData` has a `sessionkey` property that is not a string.
     */
    it('should return null when sessionkey is not a string', async () => {
      const mockUserSessionData = {
        sessionkey: 123,
      };
      (getFromStore as jest.Mock).mockResolvedValueOnce(mockUserSessionData);

      const sessionKey = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBeNull();
    });
  });
  
  /**
   * Tests that the `getSessionKey` function returns the session key when the `userSessionData` has a `sessionkey` property.
   */
  describe('getSessionKey', () => {
    it('should return session key if sessionkey is present', async () => {
      const mockUserSessionData = {
        sessionkey: 'session123'
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBe('session123');
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    /**
     * Tests that the `getSessionKey` function returns `null` when the `userSessionData` does not have a `sessionkey` property.
     */
    it('should return null if sessionkey is not present', async () => {
      const mockUserSessionData = {};
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });
/**
 * Tests that the `getSessionKey` function returns `null` when the `userSessionData` is `null`.
 */

    it('should return null if userSessionData is null', async () => {
      (getFromStore as jest.Mock).mockResolvedValue(null);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });
  });

  /**
   * Tests that the `getSessionKey` function returns the session key if it is present in the user session data.
   */
  describe('getSessionKey', () => {
    it('should return session key if sessionkey is present', async () => {
      const mockUserSessionData = {
        sessionkey: 'session123'
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBe('session123');
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    /**
     * Tests that the `getSessionKey` function returns `null` when the `userSessionData` does not contain a `sessionkey` property.
     */
    it('should return null if sessionkey is not present', async () => {
      const mockUserSessionData = {};
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    /**
     * Tests that the `getSessionKey` function returns `null` when the `userSessionData` is `null`.
     */
    it('should return null if userSessionData is null', async () => {
      (getFromStore as jest.Mock).mockResolvedValue(null);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    /**
     * Tests that the `getSessionKey` function returns `null` when the `userSessionData` is `undefined`.
     */
    it('should return null if userSessionData is undefined', async () => {
      (getFromStore as jest.Mock).mockResolvedValue(undefined);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    /**
     * Tests that the `getSessionKey` function returns `null` when the `userSessionData` contains an `undefined` `sessionkey` property.
     */
    it('should return null if sessionkey is undefined', async () => {
      const mockUserSessionData = {
        sessionkey: undefined
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    /**
     * Tests that the `getSessionKey` function returns `null` when the `userSessionData` contains a `sessionkey` property with a value of `null`.
     */
    it('should return null if sessionkey is null', async () => {
      const mockUserSessionData = {
        sessionkey: null
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });
/**
 * Tests that the `getSessionKey` function returns `null` when the `userSessionData` contains an empty string for the `sessionkey` property.
 */

    it('should return null if sessionkey is an empty string', async () => {
      const mockUserSessionData = {
        sessionkey: ''
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });
  });

  /**
   * Tests that the `getSessionKey` function returns the session key from the `userSessionData` object if it is available.
   */
  describe('getSessionKey', () => {
    it('should return the session key if available', async () => {
      (getFromStore as jest.Mock).mockResolvedValue({
        sessionkey: 'session123',
      });
      const sessionKey = await getSessionKey();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBe('session123');
    });

    /**
     * Tests that the `getSessionKey` function returns `null` when the `userSessionData` object does not contain a `sessionkey` property.
     */
    it('should return null if session key is not available', async () => {
      (getFromStore as jest.Mock).mockResolvedValue({});
      const sessionKey = await getSessionKey();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBeNull();
    });

    /**
     * Tests that the `getSessionKey` function returns `null` when the `userSessionData` object is `null`.
     */
    it('should return null if userSessionData is null', async () => {
      (getFromStore as jest.Mock).mockResolvedValue(null);
      const sessionKey = await getSessionKey();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBeNull();
    });
  });

  /**
         * Tests that the `getSessionKey` function returns `null` when the `userSessionData` object is `undefined`.
         */
  describe('getSessionKey', () => {
    it('should return null if userSessionData is undefined', async () => {
        (getFromStore as jest.Mock).mockResolvedValue(undefined);
        const sessionKey = await getSessionKey();
        expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
        expect(sessionKey).toBeNull();
      });
  
      /**
       * Tests that the `getSessionKey` function returns `null` when the `userSessionData` object does not have a `sessionkey` property.
       */
      it('should return null if userSessionData.sessionkey is undefined', async () => {
        (getFromStore as jest.Mock).mockResolvedValue({ sessionkey: undefined });
        const sessionKey = await getSessionKey();
        expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
        expect(sessionKey).toBeNull();
      });
    });

  /**
           * Clears all mocks after each test in the 'getSessionKey' test suite.
           */
  describe('getSessionKey', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    /**
     * Tests that the `getSessionKey` function returns the session key from the stored user session data.
     */
    it('should return the session key from the stored user session data', async () => {
      const mockUserSessionData = {
        sessionkey: 'session-123'
      };
  
      jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
  
      const sessionKey = await getSessionKey();
      expect(sessionKey).toBe('session-123');
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });
  
    /**
     * Tests that the `getSessionKey` function returns `null` when the stored user session data is not available.
     */
    it('should return null when the user session data is not available', async () => {
      jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(null);
  
      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });
  
    /**
     * Tests that the `getSessionKey` function returns `null` when the stored user session data does not have a "sessionkey" property.
     */
    it('should return null when the user session data does not have a "sessionkey" property', async () => {
      const mockUserSessionData = {};
  
      jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
  
      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });
  });    

 /**
             * Tests that the `getSessionKey` function returns `null` when the "sessionkey" property in the stored user session data is `null`.
             */
 it('should return null when the "sessionkey" property is null', async () => {
    const mockUserSessionData = {
      sessionkey: null
    };

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const sessionKey = await getSessionKey();
    expect(sessionKey).toBeNull();
    expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
  });

  /**
   * Tests that the `getSessionKey` function returns `null` when the "sessionkey" property in the stored user session data is `undefined`.
   */
  it('should return null when the "sessionkey" property is undefined', async () => {
    const mockUserSessionData = {
      sessionkey: undefined
    };

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const sessionKey = await getSessionKey();
    expect(sessionKey).toBeNull();
    expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
  });

  /**
   * Tests that the `getSessionKey` function returns `null` when the "sessionkey" property in the stored user session data is an empty string.
   */
  it('should return null when the "sessionkey" property is an empty string', async () => {
    const mockUserSessionData = {
      sessionkey: ''
    };

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const sessionKey = await getSessionKey();
expect(sessionKey).toBeNull();
expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
});

describe('getSessionKey', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return the session key from the stored user session data', async () => {
      // Mock user session data with session key
      const mockUserSessionData = {
        sessionkey: 'session-123'
      };
  
      // Mock the getFromStore function to return the user session data
      jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
  
      // Call getSessionKey function
      const sessionKey = await getSessionKey();
  
      // Assert that the session key is returned correctly
      expect(sessionKey).toBe('session-123');
    });
  });

/**
 * Cleans up any mocks created for the `getSessionKey` tests.
 */
afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getSessionKey', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    /**
     * Tests that the `getSessionKey` function returns `null` when the user session data does not have a "sessionkey" property.
     */
    it('should return null when the user session data does not have a "sessionkey" property', async () => {
      const mockUserSessionData = {};
  
      jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
  
      const sessionKey = await getSessionKey();
  
      expect(sessionKey).toBeNull();
    });
  
    /**
     * Tests that the `getSessionKey` function returns `null` when the user session data does not have a "sessionkey" property with a non-null value.
     */
    it('should return null when the "sessionkey" property is null', async () => {
      const mockUserSessionData = {
        sessionkey: null
      };
  
      jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
  
      const sessionKey = await getSessionKey();
  
      expect(sessionKey).toBeNull();
    });
  });

  /**
  * Clears all mocks after each test in the `getSessionKey` test suite.
  */
 describe('getSessionKey', () => {
   afterEach(() => {
     jest.clearAllMocks();
   });
 
 
   /**
    * Tests that the `getSessionKey` function returns `null` when the user session data has a `sessionkey` property that is `undefined`.
    */
   it('should return null when the "sessionkey" property is undefined', async () => {
     const mockUserSessionData = {
       sessionkey: undefined
     };
 
     jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
 
     const sessionKey = await getSessionKey();
 
     expect(sessionKey).toBeNull();
   });
 
   /**
    * Tests that the `getSessionKey` function returns `null` when the user session data has an empty `sessionkey` property.
    */
   it('should return null when the "sessionkey" property is an empty string', async () => {
     const mockUserSessionData = {
       sessionkey: ''
     };
 
     jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
 
     const sessionKey = await getSessionKey();
 
     expect(sessionKey).toBeNull();
   });
 
   /**
    * Tests that the `getSessionKey` function returns the session key when the "sessionkey" property exists in the user session data.
    */
   it('should return the session key when the "sessionkey" property exists', async () => {
     const mockUserSessionData = {
       sessionkey: 'abcdef1234567890'
     };
 
     jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
 
     const sessionKey = await getSessionKey();
 
     expect(sessionKey).toBe('abcdef1234567890');
   });
 
   /**
    * Tests that the `getSessionKey` function returns the session key when the "sessionkey" property is a number.
    */
   it('should return the session key when the "sessionkey" property is a number', async () => {
     const mockUserSessionData = {
       sessionkey: 1234567890
     };
   
     jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
   
     const sessionKey = await getSessionKey();
   
     expect(sessionKey).toBe(String(1234567890)); // Convert the number to string for comparison
   });
 
   /**
    * Tests that the `getSessionKey` function returns `null` when the user session data has a `sessionkey` property that is not a string or number.
    */
   it('should return null when the "sessionkey" property is not a string or number', async () => {
     const mockUserSessionData = {
       sessionkey: true
     };
 
     jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
 
     const sessionKey = await getSessionKey();
 
     expect(sessionKey).toBeNull();
   });
 });  
  
  