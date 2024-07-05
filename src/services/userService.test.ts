import { getUserId, getSessionKey } from './userService';
import { getFromStore } from '../util';
import { CONFIG } from '../config';

// Mock the getFromStore function
jest.mock('../util', () => ({
  getFromStore: jest.fn(),
}));

describe('userService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getUserId', () => {
    it('should return user id when user session data is available', async () => {
      const mockUserData = {
        authdata: {
          id: 'user123',
        },
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getUserId();
      expect(result).toBe('user123');
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    it('should return null when user session data is not available', async () => {
      (getFromStore as jest.Mock).mockResolvedValue(null);

      const result = await getUserId();
      expect(result).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    it('should return null when authdata is missing', async () => {
      const mockUserData = {};
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getUserId();
      expect(result).toBeNull();
    });

    it('should return null when id is missing in authdata', async () => {
      const mockUserData = {
        authdata: {},
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getUserId();
      expect(result).toBeNull();
    });
  });

  describe('getSessionKey', () => {
    it('should return session key when user session data is available', async () => {
      const mockUserData = {
        sessionkey: 'session123',
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getSessionKey();
      expect(result).toBe('session123');
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    it('should return null when user session data is not available', async () => {
      (getFromStore as jest.Mock).mockResolvedValue(null);

      const result = await getSessionKey();
      expect(result).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    it('should return null when sessionkey is missing', async () => {
      const mockUserData = {};
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getSessionKey();
      expect(result).toBeNull();
    });
  });

  // Additional edge cases
  describe('Edge cases', () => {
    it('should handle empty string user id', async () => {
      const mockUserData = {
        authdata: {
          id: '',
        },
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getUserId();
      expect(result).toBe('');
    });

    it('should handle empty string session key', async () => {
      const mockUserData = {
        sessionkey: '',
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getSessionKey();
      expect(result).toBe('');
    });

    it('should handle getFromStore throwing an error', async () => {
      (getFromStore as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(getUserId()).rejects.toThrow('Storage error');
      await expect(getSessionKey()).rejects.toThrow('Storage error');
    });
  });
});


describe('userService - Additional Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserId - Additional Tests', () => {
    it('should handle numeric user id', async () => {
      const mockUserData = {
        authdata: {
          id: 12345,
        },
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getUserId();
      expect(result).toBe(12345);
    });

    it('should handle boolean user id', async () => {
      const mockUserData = {
        authdata: {
          id: true,
        },
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getUserId();
      expect(result).toBe(true);
    });

    it('should handle null user id', async () => {
      const mockUserData = {
        authdata: {
          id: null,
        },
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getUserId();
      expect(result).toBeNull();
    });

    it('should handle undefined user id', async () => {
      const mockUserData = {
        authdata: {
          id: undefined,
        },
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getUserId();
      expect(result).toBeUndefined();
    });

    it('should handle authdata as null', async () => {
      const mockUserData = {
        authdata: null,
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getUserId();
      expect(result).toBeNull();
    });
  });

  describe('getSessionKey - Additional Tests', () => {
    it('should handle numeric session key', async () => {
      const mockUserData = {
        sessionkey: 98765,
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getSessionKey();
      expect(result).toBe(98765);
    });

    it('should handle boolean session key', async () => {
      const mockUserData = {
        sessionkey: false,
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getSessionKey();
      expect(result).toBe(false);
    });

    it('should handle null session key', async () => {
      const mockUserData = {
        sessionkey: null,
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getSessionKey();
      expect(result).toBeNull();
    });

    it('should handle undefined session key', async () => {
      const mockUserData = {
        sessionkey: undefined,
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getSessionKey();
      expect(result).toBeUndefined();
    });
  });

  describe('Edge cases - Additional Tests', () => {
    it('should handle getFromStore returning undefined', async () => {
      (getFromStore as jest.Mock).mockResolvedValue(undefined);

      const userId = await getUserId();
      const sessionKey = await getSessionKey();

      expect(userId).toBeNull();
      expect(sessionKey).toBeNull();
    });

    it('should handle getFromStore returning an empty object', async () => {
      (getFromStore as jest.Mock).mockResolvedValue({});

      const userId = await getUserId();
      const sessionKey = await getSessionKey();

      expect(userId).toBeNull();
      expect(sessionKey).toBeNull();
    });

    it('should handle authdata as an empty object', async () => {
      const mockUserData = {
        authdata: {},
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const result = await getUserId();
      expect(result).toBeNull();
    });

    it('should handle complex nested objects', async () => {
      const mockUserData = {
        authdata: {
          user: {
            profile: {
              id: 'nestedId',
            },
          },
        },
        sessionkey: {
          value: 'complexSessionKey',
        },
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserData);

      const userId = await getUserId();
      const sessionKey = await getSessionKey();

      expect(userId).toBeNull(); // Because it doesn't match the expected structure
      expect(sessionKey).toEqual({ value: 'complexSessionKey' });
    });
  });
});



describe('getUserId', () => {
  it('should return null if userSessionData is null', async () => {
    (getFromStore as jest.Mock).mockResolvedValue(null);
    expect(await getUserId()).toBeNull();
  });

  it('should return null if userSessionData does not have authdata property', async () => {
    (getFromStore as jest.Mock).mockResolvedValue({});
    expect(await getUserId()).toBeNull();
  });

  it('should return null if userSessionData.authdata does not have id property', async () => {
    (getFromStore as jest.Mock).mockResolvedValue({ authdata: {} });
    expect(await getUserId()).toBeNull();
  });

  it('should return the user id if userSessionData.authdata has id property', async () => {
    const userId = '123';
    (getFromStore as jest.Mock).mockResolvedValue({ authdata: { id: userId } });
    expect(await getUserId()).toBe(userId);
  });
});

describe('getSessionKey', () => {
  it('should return null if userSessionData is null', async () => {
    (getFromStore as jest.Mock).mockResolvedValue(null);
    expect(await getSessionKey()).toBeNull();
  });

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



describe('getUserId', () => {
  it('should return null if userSessionData.authdata.id is not a string', async () => {
    (getFromStore as jest.Mock).mockResolvedValue({ authdata: { id: 123 } });
    expect(await getUserId()).toBeNull();
  });

  it('should return null if userSessionData.authdata.id is an empty string', async () => {
    (getFromStore as jest.Mock).mockResolvedValue({ authdata: { id: '' } });
    expect(await getUserId()).toBeNull();
  });

  it('should return null if userSessionData.authdata.id is a string of length 0', async () => {
    (getFromStore as jest.Mock).mockResolvedValue({ authdata: { id: '' } });
    expect(await getUserId()).toBeNull();
  });

  it('should return null if userSessionData.authdata.id is a string of length greater than 255', async () => {
    const userId = 'a'.repeat(256);
    (getFromStore as jest.Mock).mockResolvedValue({ authdata: { id: userId } });
    expect(await getUserId()).toBeNull();
  });
});

describe('getSessionKey', () => {
  it('should return null if userSessionData.sessionkey is not a string', async () => {
    (getFromStore as jest.Mock).mockResolvedValue({ sessionkey: 123 });
    expect(await getSessionKey()).toBeNull();
  });

  it('should return null if userSessionData.sessionkey is an empty string', async () => {
    (getFromStore as jest.Mock).mockResolvedValue({ sessionkey: '' });
    expect(await getSessionKey()).toBeNull();
  });

  it('should return null if userSessionData.sessionkey is a string of length 0', async () => {
    (getFromStore as jest.Mock).mockResolvedValue({ sessionkey: '' });
    expect(await getSessionKey()).toBeNull();
  });

  it('should return null if userSessionData.sessionkey is a string of length greater than 255', async () => {
    const sessionKey = 'a'.repeat(256);
    (getFromStore as jest.Mock).mockResolvedValue({ sessionkey: sessionKey });
    expect(await getSessionKey()).toBeNull();
  });
});



describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserId', () => {
    it('should return the user ID when authdata is available', async () => {
      const mockUserSessionData = {
        authdata: {
          id: 'user123',
        },
      };
      (getFromStore as jest.Mock).mockResolvedValueOnce(mockUserSessionData);

      const userId = await getUserId();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(userId).toBe('user123');
    });

    it('should return null when authdata is not available', async () => {
      const mockUserSessionData = {
        authdata: null,
      };
      (getFromStore as jest.Mock).mockResolvedValueOnce(mockUserSessionData);

      const userId = await getUserId();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(userId).toBeNull();
    });
  });

    

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

    it('should return null when userSessionData is null', async () => {
      (getFromStore as jest.Mock).mockResolvedValueOnce(null);

      const sessionKey = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBeNull();
    });
  });
});



describe('userService', () => {
  // ... (previous test cases)

  describe('getUserId', () => {
    

    it('should return null when authdata does not contain the id property', async () => {
      const mockUserSessionData = {
        authdata: {
          name: 'John Doe',
        },
      };
      (getFromStore as jest.Mock).mockResolvedValueOnce(mockUserSessionData);

      const userId = await getUserId();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(userId).toBeNull();
    });

    it('should return null when userSessionData is an empty object', async () => {
      (getFromStore as jest.Mock).mockResolvedValueOnce({});

      const userId = await getUserId();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(userId).toBeNull();
    });
  });

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

    it('should return null when userSessionData is an empty object', async () => {
      (getFromStore as jest.Mock).mockResolvedValueOnce({});

      const sessionKey = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBeNull();
    });
  });
});



describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserId', () => {

    

    it('should return null when userSessionData is null', async () => {
      (getFromStore as jest.Mock).mockResolvedValueOnce(null);

      const userId = await getUserId();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(userId).toBeNull();
    });
  });

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
});

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserId', () => {
    // Existing test cases...

    it('should return null when authdata is an empty object', async () => {
      const mockUserSessionData = {
        authdata: {},
      };
      (getFromStore as jest.Mock).mockResolvedValueOnce(mockUserSessionData);

      const userId = await getUserId();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(userId).toBeNull();
    });

    it('should return null when authdata is not an object', async () => {
      const mockUserSessionData = {
        authdata: 'not an object',
      };
      (getFromStore as jest.Mock).mockResolvedValueOnce(mockUserSessionData);

      const userId = await getUserId();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(userId).toBeNull();
    });

    it('should return null when authdata.id is undefined', async () => {
      const mockUserSessionData = {
        authdata: {
          id: undefined,
        },
      };
      (getFromStore as jest.Mock).mockResolvedValueOnce(mockUserSessionData);

      const userId = await getUserId();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(userId).toBeNull();
    });

    it('should return null when authdata.id is null', async () => {
      const mockUserSessionData = {
        authdata: {
          id: null,
        },
      };
      (getFromStore as jest.Mock).mockResolvedValueOnce(mockUserSessionData);

      const userId = await getUserId();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(userId).toBeNull();
    });
  });

  describe('getSessionKey', () => {
    // Existing test cases...

    it('should return null when sessionkey is an empty string', async () => {
      const mockUserSessionData = {
        sessionkey: '',
      };
      (getFromStore as jest.Mock).mockResolvedValueOnce(mockUserSessionData);

      const sessionKey = await getSessionKey();

      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBeNull();
    });

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
});


describe('userService', () => {
  describe('getUserId', () => {
    it('should return user id if authdata is present', async () => {
      const mockUserSessionData = {
        authdata: {
          id: 'user123'
        }
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const userId = await getUserId();
      expect(userId).toBe('user123');
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    it('should return null if authdata is not present', async () => {
      const mockUserSessionData = {};
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const userId = await getUserId();
      expect(userId).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    it('should return null if userSessionData is null', async () => {
      (getFromStore as jest.Mock).mockResolvedValue(null);

      const userId = await getUserId();
      expect(userId).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });
  });

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

    it('should return null if sessionkey is not present', async () => {
      const mockUserSessionData = {};
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    it('should return null if userSessionData is null', async () => {
      (getFromStore as jest.Mock).mockResolvedValue(null);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });
  });
});



describe('userService', () => {
    describe('getUserId', () => {
 it('should return null if userSessionData is undefined', async () => {
      (getFromStore as jest.Mock).mockResolvedValue(undefined);

      const userId = await getUserId();
      expect(userId).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    it('should return null if authdata.id is undefined', async () => {
      const mockUserSessionData = {
        authdata: {
          id: undefined
        }
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const userId = await getUserId();
      expect(userId).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    it('should return null if authdata.id is null', async () => {
      const mockUserSessionData = {
        authdata: {
          id: null
        }
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const userId = await getUserId();
      expect(userId).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    it('should return null if authdata is an empty object', async () => {
      const mockUserSessionData = {
        authdata: {}
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const userId = await getUserId();
      expect(userId).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });
  });

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

    it('should return null if sessionkey is not present', async () => {
      const mockUserSessionData = {};
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    it('should return null if userSessionData is null', async () => {
      (getFromStore as jest.Mock).mockResolvedValue(null);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    it('should return null if userSessionData is undefined', async () => {
      (getFromStore as jest.Mock).mockResolvedValue(undefined);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    it('should return null if sessionkey is undefined', async () => {
      const mockUserSessionData = {
        sessionkey: undefined
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

    it('should return null if sessionkey is null', async () => {
      const mockUserSessionData = {
        sessionkey: null
      };
      (getFromStore as jest.Mock).mockResolvedValue(mockUserSessionData);

      const sessionKey = await getSessionKey();
      expect(sessionKey).toBeNull();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
    });

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
});



describe('userService', () => {
  describe('getUserId', () => {
    it('should return the user ID from authdata if available', async () => {
      (getFromStore as jest.Mock).mockResolvedValue({
        authdata: { id: 'user123' },
      });
      const userId = await getUserId();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(userId).toBe('user123');
    });

    it('should return null if authdata is not available', async () => {
      (getFromStore as jest.Mock).mockResolvedValue({});
      const userId = await getUserId();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(userId).toBeNull();
    });

    it('should return null if userSessionData is null', async () => {
      (getFromStore as jest.Mock).mockResolvedValue(null);
      const userId = await getUserId();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(userId).toBeNull();
    });
  });

  describe('getSessionKey', () => {
    it('should return the session key if available', async () => {
      (getFromStore as jest.Mock).mockResolvedValue({
        sessionkey: 'session123',
      });
      const sessionKey = await getSessionKey();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBe('session123');
    });

    it('should return null if session key is not available', async () => {
      (getFromStore as jest.Mock).mockResolvedValue({});
      const sessionKey = await getSessionKey();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBeNull();
    });

    it('should return null if userSessionData is null', async () => {
      (getFromStore as jest.Mock).mockResolvedValue(null);
      const sessionKey = await getSessionKey();
      expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
      expect(sessionKey).toBeNull();
    });
  });
});

describe('userService', () => {
    describe('getUserId', () => {
        it('should return null if userSessionData is undefined', async () => {
            (getFromStore as jest.Mock).mockResolvedValue(undefined);
            const userId = await getUserId();
            expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
            expect(userId).toBeNull();
          });
      
          it('should return null if userSessionData.authdata is undefined', async () => {
            (getFromStore as jest.Mock).mockResolvedValue({ authdata: undefined });
            const userId = await getUserId();
            expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
            expect(userId).toBeNull();
          });
        });
        describe('getSessionKey', () => {
            it('should return null if userSessionData is undefined', async () => {
                (getFromStore as jest.Mock).mockResolvedValue(undefined);
                const sessionKey = await getSessionKey();
                expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
                expect(sessionKey).toBeNull();
              });
          
              it('should return null if userSessionData.sessionkey is undefined', async () => {
                (getFromStore as jest.Mock).mockResolvedValue({ sessionkey: undefined });
                const sessionKey = await getSessionKey();
                expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
                expect(sessionKey).toBeNull();
              });
            });
          });

          
         
          
 describe('getUserId', () => {
  afterEach(() => {
  jest.clearAllMocks();
 });
          
   it('should return the user ID from the stored user session data', async () => {
   const mockUserSessionData = {
   authdata: {
   id: 'user-123'
   }
   };
          
   jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
          
              const userId = await getUserId();
              expect(userId).toBe('user-123');
              expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
            });
          
            it('should return null when the user session data is not available', async () => {
              jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(null);
          
              const userId = await getUserId();
              expect(userId).toBeNull();
              expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
            });
          
            it('should return null when the user session data does not have an "authdata" property', async () => {
              const mockUserSessionData = {};
          
              jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
          
              const userId = await getUserId();
              expect(userId).toBeNull();
              expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
            });
          });
          
          describe('getSessionKey', () => {
            afterEach(() => {
              jest.clearAllMocks();
            });
          
            it('should return the session key from the stored user session data', async () => {
              const mockUserSessionData = {
                sessionkey: 'session-123'
              };
          
              jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
          
              const sessionKey = await getSessionKey();
              expect(sessionKey).toBe('session-123');
              expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
            });
          
            it('should return null when the user session data is not available', async () => {
              jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(null);
          
              const sessionKey = await getSessionKey();
              expect(sessionKey).toBeNull();
              expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
            });
          
            it('should return null when the user session data does not have a "sessionkey" property', async () => {
              const mockUserSessionData = {};
          
              jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
          
              const sessionKey = await getSessionKey();
              expect(sessionKey).toBeNull();
              expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
            });
          });

          describe('getUserId', () => {
            afterEach(() => {
              jest.clearAllMocks();
            });
            it('should return null when the "authdata" property is null', async () => {
                const mockUserSessionData = {
                  authdata: null
                };
            
                jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
            
                const userId = await getUserId();
                expect(userId).toBeNull();
                expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
              });
            
              it('should return null when the "authdata" property is undefined', async () => {
                const mockUserSessionData = {
                  authdata: undefined
                };
            
                jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
            
                const userId = await getUserId();
                expect(userId).toBeNull();
                expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
              });
            
              it('should return null when the "authdata" property is an empty object', async () => {
                const mockUserSessionData = {
                  authdata: {}
                };
            
                jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
            
                const userId = await getUserId();
                expect(userId).toBeNull();
                expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
              });
            });
            it('should return null when the "sessionkey" property is null', async () => {
                const mockUserSessionData = {
                  sessionkey: null
                };
            
                jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
            
                const sessionKey = await getSessionKey();
                expect(sessionKey).toBeNull();
                expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
              });
            
              it('should return null when the "sessionkey" property is undefined', async () => {
                const mockUserSessionData = {
                  sessionkey: undefined
                };
            
                jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
            
                const sessionKey = await getSessionKey();
                expect(sessionKey).toBeNull();
                expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
              });
            
              it('should return null when the "sessionkey" property is an empty string', async () => {
                const mockUserSessionData = {
                  sessionkey: ''
                };
            
                jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);
            
                const sessionKey = await getSessionKey();
expect(sessionKey).toBeNull();
 expect(getFromStore).toHaveBeenCalledWith(CONFIG.USER_AUTH_DATA_KEY, false);
 });
            


describe('getUserId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the user ID from the stored user session data', async () => {
    // Mock user session data with user ID
    const mockUserSessionData = {
      authdata: {
        id: 'user-123'
      }
    };

    // Mock the getFromStore function to return the user session data
    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    // Call getUserId function
    const userId = await getUserId();

    // Assert that the user ID is returned correctly
    expect(userId).toBe('user-123');
  });

  it('should return null when the user session data is not available', async () => {
    // Mock the getFromStore function to return null
    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(null);

    // Call getUserId function
    const userId = await getUserId();

    // Assert that null is returned when user session data is not available
    expect(userId).toBeNull();
  });
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



describe('getUserId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
});

  it('should return null when the user session data does not have an "authdata" property', async () => {
    const mockUserSessionData = {};

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const userId = await getUserId();

    expect(userId).toBeNull();
  });


describe('getSessionKey', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when the user session data does not have a "sessionkey" property', async () => {
    const mockUserSessionData = {};

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const sessionKey = await getSessionKey();

    expect(sessionKey).toBeNull();
  });

  it('should return null when the "sessionkey" property is null', async () => {
    const mockUserSessionData = {
      sessionkey: null
    };

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const sessionKey = await getSessionKey();

    expect(sessionKey).toBeNull();
  });
});


describe('getUserId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should return null when the "authdata" property is null', async () => {
    const mockUserSessionData = {
      authdata: null
    };

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const userId = await getUserId();

    expect(userId).toBeNull();
  });

  it('should return null when the "authdata" property is undefined', async () => {
    const mockUserSessionData = {
      authdata: undefined
    };

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const userId = await getUserId();

    expect(userId).toBeNull();
  });

  it('should return null when the "authdata" property is an empty object', async () => {
    const mockUserSessionData = {
      authdata: {}
    };

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const userId = await getUserId();

    expect(userId).toBeNull();
  });

  it('should return the user id when the "authdata" property has an "id" property as a string', async () => {
    const mockUserSessionData = {
      authdata: {
        id: '123456789'
      }
    };

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const userId = await getUserId();

    expect(userId).toBe('123456789');
  });

  it('should return the user id when the "authdata" property has an "id" property as a number', async () => {
    const mockUserSessionData = {
      authdata: {
        id: 123456789
      }
    };

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const userId = await getUserId();

    expect(userId).toBe('123456789');
  });

  it('should return null when the "authdata" property has an "id" property that is not a string or number', async () => {
    const mockUserSessionData = {
      authdata: {
        id: true
      }
    };

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const userId = await getUserId();

    expect(userId).toBeNull();
  });
});

describe('getSessionKey', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should return null when the "sessionkey" property is undefined', async () => {
    const mockUserSessionData = {
      sessionkey: undefined
    };

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const sessionKey = await getSessionKey();

    expect(sessionKey).toBeNull();
  });

  it('should return null when the "sessionkey" property is an empty string', async () => {
    const mockUserSessionData = {
      sessionkey: ''
    };

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const sessionKey = await getSessionKey();

    expect(sessionKey).toBeNull();
  });

  it('should return the session key when the "sessionkey" property exists', async () => {
    const mockUserSessionData = {
      sessionkey: 'abcdef1234567890'
    };

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const sessionKey = await getSessionKey();

    expect(sessionKey).toBe('abcdef1234567890');
  });

  it('should return the session key when the "sessionkey" property is a number', async () => {
    const mockUserSessionData = {
      sessionkey: 1234567890
    };

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const sessionKey = await getSessionKey();

    expect(sessionKey).toBe('1234567890');
  });

  it('should return null when the "sessionkey" property is not a string or number', async () => {
    const mockUserSessionData = {
      sessionkey: true
    };

    jest.spyOn(require('../util'), 'getFromStore').mockResolvedValue(mockUserSessionData);

    const sessionKey = await getSessionKey();

    expect(sessionKey).toBeNull();
  });
});

