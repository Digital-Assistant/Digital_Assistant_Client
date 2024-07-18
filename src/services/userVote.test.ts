import { getUserId } from './userService';
import { CONFIG } from '../config';
import { REST } from '../services';
import { getFromStore } from '../util';
import { ENDPOINT } from '../config/endpoints';

// Mock dependencies
jest.mock('../services/userService');
jest.mock('../services');
jest.mock('../config', () => ({
  CONFIG: {
    UDA_DOMAIN: 'https://example.com',
  },
}));

/**
 * Clears all mocks before each test in the 'userVote' test suite.
 */
describe('userVote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Votes on a sequence with the given vote type.
   *
   * @param request - An object containing the sequence ID to vote on.
   * @param voteType - The type of vote to cast, either 'up' or 'down'.
   * @returns A promise that resolves with the success status of the vote.
   */
  describe('vote', () => {
    it('should call REST.apiCal with correct parameters for upvote', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'sequence456' };
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
      (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

      await vote(mockRequest, 'up');

      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${CONFIG.UDA_DOMAIN}/voiceapi/vote`,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: 'sequence456',
          upvote: 1,
          downvote: 0,
        },
      });
    });

    /**
     * Votes on a sequence with the given vote type.
     *
     * @param request - An object containing the sequence ID to vote on.
     * @param voteType - The type of vote to cast, either 'up' or 'down'.
     * @returns A promise that resolves with the success status of the vote.
     */
    it('should call REST.apiCal with correct parameters for downvote', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'sequence789' };
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
      (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

      await vote(mockRequest, 'down');

      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${CONFIG.UDA_DOMAIN}/voiceapi/vote`,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: 'sequence789',
          upvote: 0,
          downvote: 1,
        },
      });
    });

    /**
     * Tests error handling for the `vote` function.
     *
     * - Verifies that the `vote` function rejects with the expected error when `getUserId` throws an error.
     * - Verifies that the `vote` function rejects with the expected error when `REST.apiCal` throws an error.
     */
    it('should handle errors from getUserId', async () => {
        (getUserId as jest.Mock).mockRejectedValue(new Error('User ID error'));
  
        await expect(vote({ id: 'sequence123' }, 'up')).rejects.toThrow('User ID error');
      });
  
      it('should handle errors from REST.apiCal', async () => {
        (getUserId as jest.Mock).mockResolvedValue('user123');
        (REST.apiCal as jest.Mock).mockRejectedValue(new Error('API error'));
  
        await expect(vote({ id: 'sequence123' }, 'up')).rejects.toThrow('API error');
      });
    });
  });

  /**
   * Retrieves the vote record for a given sequence.
   *
   * @param request - An object containing the sequence ID to retrieve the vote record for.
   * @returns A promise that resolves with the vote data for the specified sequence.
   */
  describe('getVoteRecord', () => {
    it('should call REST.apiCal with correct parameters', async () => {
      const mockUserId = 'user456';
      const mockRequest = { id: 'sequence789' };
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
      (REST.apiCal as jest.Mock).mockResolvedValue({ voteData: 'someData' });

      await getVoteRecord(mockRequest);

      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${CONFIG.UDA_DOMAIN}/voiceapi/vote/sequence789/user456`,
        method: 'GET',
      });
    });
    /**
     * Tests error handling for the `getVoteRecord` function.
     *
     * - Verifies that the `getVoteRecord` function rejects with the expected error when `getUserId` throws an error.
     */
    it('should handle errors from getUserId', async () => {
        (getUserId as jest.Mock).mockRejectedValue(new Error('User ID error'));
  
        await expect(getVoteRecord({ id: 'sequence123' })).rejects.toThrow('User ID error');
      });
  
      /**
       * Tests error handling for the `getVoteRecord` function.
       *
       * - Verifies that the `getVoteRecord` function rejects with the expected error when `REST.apiCal` throws an error.
       */
      it('should handle errors from REST.apiCal', async () => {
        (getUserId as jest.Mock).mockResolvedValue('user123');
        (REST.apiCal as jest.Mock).mockRejectedValue(new Error('API error'));
  
        await expect(getVoteRecord({ id: 'sequence123' })).rejects.toThrow('API error');
      });
    });
    // Additional edge cases
  /**
   * Tests handling of undefined request in the `vote` function.
   *
   * - Verifies that the `vote` function rejects with an error when the `request` parameter is `undefined`.
   */
  describe('Edge cases', () => {
    it('should handle vote with undefined request', async () => {
      await expect(vote(undefined, 'up')).rejects.toThrow();
    });
});

    /**
     * Tests handling of an invalid vote type in the `vote` function.
     *
     * - Verifies that the `vote` function resolves successfully when an invalid vote type is provided.
     * - Ensures that the `REST.apiCal` function is called with the expected parameters, including `upvote` and `downvote` set to 0.
     */
    it('should handle vote with invalid vote type', async () => {
      await expect(vote({ id: 'sequence123' }, 'invalid')).resolves.toBeDefined();
      expect(REST.apiCal).toHaveBeenCalledWith(expect.objectContaining({
        body: expect.objectContaining({
          upvote: 0,
          downvote: 0,
        }),
      }));
    });

    /**
     * Tests handling of undefined request in the `getVoteRecord` function.
     *
     * - Verifies that the `getVoteRecord` function rejects with an error when the `request` parameter is `undefined`.
     */
    it('should handle getVoteRecord with undefined request', async () => {
      await expect(getVoteRecord(undefined)).rejects.toThrow();
    });

 
/**
 * Clears all mocks before each test in the 'userVote - Additional Tests' suite.
 * This ensures that each test starts with a clean mock state.
 */
describe('userVote - Additional Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests handling of a null request in the `vote` function.
   *
   * - Verifies that the `vote` function rejects with an error when the `request` parameter is `null`.
   */
  describe('vote - Additional Tests', () => {
    it('should handle vote with null request', async () => {
      await expect(vote(null, 'up')).rejects.toThrow();
    });

    /**
     * Tests handling of a non-object request in the `vote` function.
     *
     * - Verifies that the `vote` function rejects with an error when the `request` parameter is not an object.
     */
    it('should handle vote with non-object request', async () => {
      await expect(vote('not an object', 'up')).rejects.toThrow();
    });

    /**
     * Tests handling of a request object missing the 'id' property in the `vote` function.
     *
     * - Verifies that the `vote` function still calls the `REST.apiCal` function, but with the `sequenceid` property set to `undefined`.
     */
    it('should handle vote with request missing id', async () => {
      const mockUserId = 'user123';
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
      await vote({ someOtherProp: 'value' }, 'up');
      expect(REST.apiCal).toHaveBeenCalledWith(expect.objectContaining({
        body: expect.objectContaining({
          sequenceid: undefined,
        }),
      }));
      });

    /**
     * Tests handling of a numeric 'id' property in the `vote` function.
     *
     * - Verifies that the `vote` function calls the `REST.apiCal` function with the `sequenceid` property set to the numeric value of the 'id' property in the request object.
     */
    it('should handle vote with numeric id', async () => {
      const mockUserId = 'user123';
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
      await vote({ id: 12345 }, 'up');
      expect(REST.apiCal).toHaveBeenCalledWith(expect.objectContaining({
        body: expect.objectContaining({
          sequenceid: 12345,
        }),
      }));
     });

    /**
     * Tests handling of a null vote type in the `vote` function.
     *
     * - Verifies that the `vote` function resolves with a defined value when the `voteType` parameter is `null`.
     * - Ensures that the `REST.apiCal` function is called with the `upvote` and `downvote` properties in the request body set to 0.
     */
    it('should handle vote with null vote type', async () => {
      await expect(vote({ id: 'sequence123' }, null)).resolves.toBeDefined();
      expect(REST.apiCal).toHaveBeenCalledWith(expect.objectContaining({
        body: expect.objectContaining({
          upvote: 0,
          downvote: 0,
        }),
      }));
    });

    /**
     * Tests handling of an empty string vote type in the `vote` function.
     *
     * - Verifies that the `vote` function resolves with a defined value when the `voteType` parameter is an empty string.
     * - Ensures that the `REST.apiCal` function is called with the `upvote` and `downvote` properties in the request body set to 0.
     */
    it('should handle vote with empty string vote type', async () => {
      await expect(vote({ id: 'sequence123' }, '')).resolves.toBeDefined();
      expect(REST.apiCal).toHaveBeenCalledWith(expect.objectContaining({
        body: expect.objectContaining({
          upvote: 0,
          downvote: 0,
        }),
      }));
    });
  });

  /**
   * Tests handling of a null request object in the `getVoteRecord` function.
   *
   * - Verifies that the `getVoteRecord` function rejects with an error when the request parameter is `null`.
   */
  describe('getVoteRecord - Additional Tests', () => {
    it('should handle getVoteRecord with null request', async () => {
      await expect(getVoteRecord(null)).rejects.toThrow();
    });

    /**
     * Tests handling of a non-object request parameter in the `getVoteRecord` function.
     *
     * - Verifies that the `getVoteRecord` function rejects with an error when the request parameter is not an object.
     */
    it('should handle getVoteRecord with non-object request', async () => {
      await expect(getVoteRecord('not an object')).rejects.toThrow();
    }); 
  });

  /**
   * Tests handling of a null return value from the `getUserId` function in the `vote` function.
   *
   * - Verifies that the `REST.apiCal` function is called with the `usersessionid` property in the request body set to `null` when `getUserId` returns `null`.
   */
  describe('Error Handling - Additional Tests', () => {
    it('should handle getUserId returning null', async () => {
      (getUserId as jest.Mock).mockResolvedValue(null);
      await vote({ id: 'sequence123' }, 'up');
      expect(REST.apiCal).toHaveBeenCalledWith(expect.objectContaining({
        body: expect.objectContaining({
          usersessionid: null,
        }),
      }));
    });

    /**
     * Tests handling of a null return value from the `REST.apiCal` function in the `vote` function.
     *
     * - Verifies that the `vote` function resolves with a null value when the `REST.apiCal` function returns null.
     */
    it('should handle REST.apiCal returning null', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue(null);
      const result = await vote({ id: 'sequence123' }, 'up');
      expect(result).toBeNull();
    });

    /**
     * Tests handling of a null return value from the `REST.apiCal` function in the `getVoteRecord` function.
     *
     * - Verifies that the `getVoteRecord` function resolves with an undefined value when the `REST.apiCal` function returns undefined.
     */
    it('should handle REST.apiCal returning undefined', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue(undefined);
      const result = await getVoteRecord({ id: 'sequence123' });
      expect(result).toBeUndefined();
    });
  });

  /**
   * Tests handling of multiple concurrent calls to the `vote` function.
   *
   * - Verifies that the `REST.apiCal` function is called three times when multiple `vote` function calls are made concurrently.
   */
  describe('Performance - Additional Tests', () => {
    it('should handle multiple concurrent vote calls', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

      const promises = [
        vote({ id: 'sequence1' }, 'up'),
        vote({ id: 'sequence2' }, 'down'),
        vote({ id: 'sequence3' }, 'up'),
      ];

      await Promise.all(promises);

      expect(REST.apiCal).toHaveBeenCalledTimes(3);
    });

    /**
     * Tests handling of multiple concurrent calls to the `getVoteRecord` function.
     *
     * - Verifies that the `REST.apiCal` function is called three times when multiple `getVoteRecord` function calls are made concurrently.
     */
    it('should handle multiple concurrent getVoteRecord calls', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ voteData: 'someData' });

      const promises = [
        getVoteRecord({ id: 'sequence1' }),
        getVoteRecord({ id: 'sequence2' }),
        getVoteRecord({ id: 'sequence3' }),
      ];

      await Promise.all(promises);

      expect(REST.apiCal).toHaveBeenCalledTimes(3);
    });
  });
});

/**
 * Casts a vote for a given sequence.
 *
 * @param request - An object containing the sequence ID to vote on.
 * @param type - The type of vote, either 'up' or 'down'.
 * @returns A Promise that resolves when the vote is successfully cast.
 */
export const vote = async (request?: any, type?: string) => {
  let usersessionid = await getUserId();
  const payload = {
    usersessionid: usersessionid,
    sequenceid: request.id,
    upvote: type !== 'down' ? 1 : 0,
    downvote: type === 'down' ? 1 : 0,
  };

  const parameters = {
    url: ENDPOINT.VoteRecord,
    method: 'POST',
    body: payload,
  };
  return REST.apiCal(parameters);
};

/**
 * Retrieves the vote record for a given sequence.
 *
 * @param request - An object containing the sequence ID to fetch the vote record for.
 * @returns A Promise that resolves with the vote data for the specified sequence.
 */
export const getVoteRecord = async (request?: any) => {
  let userSessionId = await getUserId();

  const parameters = {
    url: ENDPOINT.fetchVoteRecord + request.id + '/' + userSessionId,
    method: 'GET',
  };
  return REST.apiCal(parameters);
};
/**
 * Mocks the REST API call functionality for testing purposes.
 * This mock implementation replaces the actual REST.apiCal function with a Jest mock function,
 * allowing you to assert on the calls made to the REST API during tests.
 */

jest.mock('./index', () => ({
  REST: {
    apiCal: jest.fn(),
  },
}));

/**
 * Clears all mocks before each test in the 'userVote' test suite.
 * This ensures that each test starts with a clean slate and can
 * independently verify the behavior of the functions being tested.
 */
describe('userVote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Votes on a sequence with the specified type (up or down).
   *
   * @param request - An object containing the sequence ID to vote on.
   * @param type - The type of vote, either 'up' or 'down'.
   * @returns A Promise that resolves with the result of the vote operation.
   */
  describe('vote', () => {
    it('should call REST.apiCal with the correct parameters for upvote', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'sequence123' };
      const mockType = 'up';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote(mockRequest, mockType);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 1,
          downvote: 0,
        },
      });
    });

    /**
     * Votes on a sequence with the specified type (down).
     *
     * @param request - An object containing the sequence ID to vote on.
     * @param type - The type of vote, 'down'.
     * @returns A Promise that resolves with the result of the vote operation.
     */
    it('should call REST.apiCal with the correct parameters for downvote', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'sequence123' };
      const mockType = 'down';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote(mockRequest, mockType);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 0,
          downvote: 1,
        },
      });
    });

    /**
     * Votes on a sequence with the specified type (up or down).
     *
     * @param request - An object containing the sequence ID to vote on. If not provided, the sequence ID will be set to `undefined`.
     * @param type - The type of vote, 'up' or 'down'. If not provided, the vote will be set to 0 for both upvote and downvote.
     * @returns A Promise that resolves with the result of the vote operation.
     */
    it('should call REST.apiCal with the correct parameters when type is not provided', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'sequence123' };
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote(mockRequest);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 0,
          downvote: 0,
        },
      });
    });
  });

  describe('getVoteRecord', () => {
    it('should call REST.apiCal with the correct parameters', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'sequence123' };
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await getVoteRecord(mockRequest);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}${mockRequest.id}/${mockUserId}`,
        method: 'GET',
      });
    });
  });
});


/**
 * Mocks the REST API module, providing a jest.fn() implementation of the `apiCal` function.
 * This mock is used in the unit tests for the `userVote` service to simulate API calls.
 */

jest.mock('./index', () => ({
  REST: {
    apiCal: jest.fn(),
  },
}));

describe('userVote', () => {
  // ... (previous test cases)

  /**
   * Votes on a sequence with the specified type (up or down).
   * If no request or type is provided, it will vote with a default upvote.
   *
   * @param request - The request object containing the sequence ID.
   * @param type - The type of vote, either 'up' or 'down'.
   * @returns The result of the API call.
   */
  describe('vote', () => {
    it('should call REST.apiCal with the correct parameters when request is not provided', async () => {
      const mockUserId = 'user123';
      const mockType = 'up';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote(undefined, mockType);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: undefined,
          upvote: 1,
          downvote: 0,
        },
      });
    });

    /**
     * Votes on a sequence with the specified type (up or down).
     * If no request or type is provided, it will vote with a default upvote.
     *
     * @param request - The request object containing the sequence ID.
     * @param type - The type of vote, either 'up' or 'down'.
     * @returns The result of the API call.
     */
    it('should call REST.apiCal with the correct parameters when request and type are not provided', async () => {
      const mockUserId = 'user123';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote();

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: undefined,
          upvote: 0,
          downvote: 0,
        },
      });
    });

    /**
     * Tests the `vote` function by calling it with a mock request and type, and verifying that the result matches the expected mock result.
     *
     * @param mockRequest - A mock request object containing the sequence ID.
     * @param mockType - The type of vote, either 'up' or 'down'.
     * @returns The result of the API call.
     */
    it('should return the result of REST.apiCal', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'sequence123' };
      const mockType = 'up';
      const mockResult = { success: true };
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);
      (REST.apiCal as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await vote(mockRequest, mockType);

      expect(result).toEqual(mockResult);
    });
  });

  /**
   * Fetches the vote record for the current user.
   *
   * @param request - An optional request object containing the sequence ID.
   * @returns The vote record for the current user, including the upvote and downvote counts.
   */
  describe('getVoteRecord', () => {
    it('should call REST.apiCal with the correct parameters when request is not provided', async () => {
      const mockUserId = 'user123';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await getVoteRecord();

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}undefined/${mockUserId}`,
        method: 'GET',
      });
    });

    /**
     * Tests the `getVoteRecord` function by calling it with a mock request and verifying that the result matches the expected mock result.
     *
     * @param mockRequest - An optional request object containing the sequence ID.
     * @returns The vote record for the current user, including the upvote and downvote counts.
     */
    it('should return the result of REST.apiCal', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'sequence123' };
      const mockResult = { upvote: 1, downvote: 0 };
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);
      (REST.apiCal as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await getVoteRecord(mockRequest);

      expect(result).toEqual(mockResult);
    });
  });
});


/**
 * Mocks the `REST` module, which provides an `apiCal` function for making API calls.
 * This mock implementation replaces the real `REST` module with a mock object that has a mocked `apiCal` function.
 * This allows the tests to control the behavior of the `apiCal` function and verify its usage without making actual API calls.
 */
jest.mock('./index', () => ({
  REST: {
    apiCal: jest.fn(),
  },
}));

/**
 * Sets up the test environment by clearing all mocks before each test.
 * This ensures that each test starts with a clean slate and can verify
 * the behavior of the code under test without interference from previous tests.
 */
describe('userVote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests the `vote` function by calling it with a mock request and verifying that the REST API is called with the correct parameters for an upvote.
   *
   * @param mockRequest - An optional request object containing the sequence ID.
   */
  describe('vote', () => {
    it('should call the REST API with the correct parameters for upvote', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'record456' };
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote(mockRequest, 'up');

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 1,
          downvote: 0,
        },
      });
    });

    /**
     * Tests the `vote` function by calling it with a mock request and verifying that the REST API is called with the correct parameters for a downvote.
     *
     * @param mockRequest - An optional request object containing the sequence ID.
     */
    it('should call the REST API with the correct parameters for downvote', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'record456' };
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote(mockRequest, 'down');

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 0,
          downvote: 1,
        },
      });
    });

    /**
     * Tests the `vote` function by calling it with a mock request and verifying that the REST API is called with the correct parameters when the request or type is missing.
     *
     * @param mockRequest - An optional request object containing the sequence ID.
     */
    it('should handle missing request or type', async () => {
      const mockUserId = 'user123';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote();

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: undefined,
          upvote: 0,
          downvote: 0,
        },
      });
    });
  });

  /**
   * Tests the `getVoteRecord` function by calling it with a mock request and verifying that the REST API is called with the correct parameters.
   *
   * @param mockRequest - An optional request object containing the sequence ID.
   */
  describe('getVoteRecord', () => {
    it('should call the REST API with the correct parameters', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'record456' };
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await getVoteRecord(mockRequest);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}${mockRequest.id}/${mockUserId}`,
        method: 'GET',
      });
    });

    /**
     * Tests the `getVoteRecord` function by calling it without a request object and verifying that the REST API is called with the correct parameters.
     *
     * This test case ensures that the `getVoteRecord` function handles a missing request object gracefully, and that the REST API is called with the correct URL, including the user ID retrieved from the `getUserId` function.
     */
    it('should handle missing request', async () => {
      const mockUserId = 'user123';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await getVoteRecord();

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}undefined/${mockUserId}`,
        method: 'GET',
      });
      });
  });
});


/**
 * Sets up the test environment by clearing all mocks before each test.
 */
describe('userVote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests the `vote` function by calling it with a mock request and verifying that the REST API is called with the correct parameters when the `getUserId` function returns `null`.
   *
   * This test case ensures that the `vote` function handles a `null` return value from the `getUserId` function gracefully, and that the REST API is called with the correct URL and request body, including a `null` user session ID.
   */
  describe('vote', () => {
    // Existing test cases...

    it('should handle getUserId returning null', async () => {
      (getUserId as jest.Mock).mockResolvedValueOnce(null);

      await vote();

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: null,
          sequenceid: undefined,
          upvote: 0,
          downvote: 0,
        },
      });
      });

    /**
     * Tests the `vote` function by calling it with a mock request and an invalid type parameter, and verifying that the REST API is called with the correct parameters.
     *
     * This test case ensures that the `vote` function handles an invalid type parameter gracefully, and that the REST API is called with the correct URL and request body, including the user session ID and the sequence ID from the mock request.
     */
    it('should handle invalid type parameter', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'record456' };
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote(mockRequest, 'invalid');

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 0,
          downvote: 0,
        },
      });
    });
  });

  /**
   * Tests the `getVoteRecord` function by calling it with a mock request and a `null` return value from the `getUserId` function, and verifying that the REST API is called with the correct parameters.
   *
   * This test case ensures that the `getVoteRecord` function handles a `null` user session ID gracefully, and that the REST API is called with the correct URL, including the `undefined` sequence ID and the `null` user session ID.
   */
  describe('getVoteRecord', () => {
    // Existing test cases...

    it('should handle getUserId returning null', async () => {
      (getUserId as jest.Mock).mockResolvedValueOnce(null);

      await getVoteRecord();

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}undefined/null`,
        method: 'GET',
      });
    });

    /**
     * Tests the `getVoteRecord` function by calling it with a mock request that has a missing `id` property, and verifying that the REST API is called with the correct parameters.
     *
     * This test case ensures that the `getVoteRecord` function handles a missing `id` property in the request gracefully, and that the REST API is called with the correct URL, including the `undefined` sequence ID and the user session ID from the mock request.
     */
    it('should handle request with missing id property', async () => {
      const mockUserId = 'user123';
      const mockRequest = {};
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await getVoteRecord(mockRequest);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}undefined/${mockUserId}`,
        method: 'GET',
      });
    });
  });
});



/**
 * Tests the `vote` function by calling it with a mock request to upvote a sequence.
 *
 * This test case ensures that the `vote` function correctly sends a POST request to the `ENDPOINT.VoteRecord` endpoint with the expected parameters, including the user session ID and the upvote/downvote values.
 *
 * @param {Object} request - The request object containing the sequence ID.
 * @param {string} type - The type of vote, either 'up' or 'down'.
 * @returns {Promise<{ success: boolean }>} - The response from the REST API call.
 */
describe('userVote', () => {
  describe('vote', () => {
    it('should send an upvote request', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

      const request = { id: 'sequence123' };
      const type = 'up';

      const result = await vote(request, type);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: 'user123',
          sequenceid: request.id,
          upvote: 1,
          downvote: 0
        }
      });
      expect(result).toEqual({ success: true });
    });

    /**
     * Tests the `vote` function by calling it with a mock request to downvote a sequence.
     *
     * This test case ensures that the `vote` function correctly sends a POST request to the `ENDPOINT.VoteRecord` endpoint with the expected parameters, including the user session ID and the upvote/downvote values.
     *
     * @param {Object} request - The request object containing the sequence ID.
     * @param {string} type - The type of vote, either 'up' or 'down'.
     * @returns {Promise<{ success: boolean }>} - The response from the REST API call.
     */
    it('should send a downvote request', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

      const request = { id: 'sequence123' };
      const type = 'down';

      const result = await vote(request, type);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: 'user123',
          sequenceid: request.id,
          upvote: 0,
          downvote: 1
        }
      });
      expect(result).toEqual({ success: true });
    });

    /**
     * Tests the `vote` function by calling it with a mock request to upvote a sequence when the user session ID is missing.
     *
     * This test case ensures that the `vote` function correctly sends a POST request to the `ENDPOINT.VoteRecord` endpoint with the expected parameters, including the user session ID (which is `null` in this case) and the upvote/downvote values.
     *
     * @param {Object} request - The request object containing the sequence ID.
     * @param {string} type - The type of vote, either 'up' or 'down'.
     * @returns {Promise<{ success: boolean }>} - The response from the REST API call.
     */
    it('should handle missing user session id', async () => {
      (getUserId as jest.Mock).mockResolvedValue(null);
      (REST.apiCal as jest.Mock).mockResolvedValue({ success: false });

      const request = { id: 'sequence123' };
      const type = 'up';

      const result = await vote(request, type);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: null,
          sequenceid: request.id,
          upvote: 1,
          downvote: 0
        }
      });
      expect(result).toEqual({ success: false });
    });
  });

  /**
   * Tests the `getVoteRecord` function by calling it with a mock request to fetch the vote record for a sequence.
   *
   * This test case ensures that the `getVoteRecord` function correctly sends a GET request to the `ENDPOINT.fetchVoteRecord` endpoint with the expected parameters, including the sequence ID and the user session ID.
   *
   * @param {Object} request - The request object containing the sequence ID.
   * @returns {Promise<{ vote: string }>} - The response from the REST API call, containing the user's vote for the sequence.
   */
  describe('getVoteRecord', () => {
    it('should fetch vote record', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ vote: 'up' });

      const request = { id: 'sequence123' };

      const result = await getVoteRecord(request);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}${request.id}/user123`,
        method: 'GET'
      });
      expect(result).toEqual({ vote: 'up' });
    });

    /**
     * Tests the `getVoteRecord` function by calling it with a mock request to fetch the vote record for a sequence when the user session ID is missing.
     *
     * This test case ensures that the `getVoteRecord` function correctly sends a GET request to the `ENDPOINT.fetchVoteRecord` endpoint with the expected parameters, including the sequence ID and a null user session ID, and returns the expected response.
     *
     * @param {Object} request - The request object containing the sequence ID.
     * @returns {Promise<{ vote: string }>} - The response from the REST API call, containing the user's vote for the sequence.
     */
    it('should handle missing user session id', async () => {
      (getUserId as jest.Mock).mockResolvedValue(null);
      (REST.apiCal as jest.Mock).mockResolvedValue({ vote: 'none' });

      const request = { id: 'sequence123' };

      const result = await getVoteRecord(request);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}${request.id}/null`,
        method: 'GET'
      });
      expect(result).toEqual({ vote: 'none' });
    });
  });
});

/**
 * Tests the `vote` function by calling it with a mock request to send an upvote request to the API.
 *
 * This test case ensures that the `vote` function correctly sends a POST request to the `ENDPOINT.VoteRecord` endpoint with the expected parameters, including the sequence ID, the user session ID, and the upvote/downvote values.
 *
 * @param {Object} request - The request object containing the sequence ID.
 * @param {string} type - The type of vote, either 'up' or 'down'.
 * @returns {Promise<{ status: number }>} - The response from the REST API call, containing the status code.
 */
describe('userVote', () => {
    describe('vote', () => {
        it('should handle API call failure', async () => {
            (getUserId as jest.Mock).mockResolvedValue('user123');
            (REST.apiCal as jest.Mock).mockRejectedValue(new Error('API call failed'));
      
            const request = { id: 'sequence123' };
            const type = 'up';
      
            await expect(vote(request, type)).rejects.toThrow('API call failed');
      
            expect(getUserId).toHaveBeenCalled();
            expect(REST.apiCal).toHaveBeenCalledWith({
              url: ENDPOINT.VoteRecord,
              method: 'POST',
              body: {
                usersessionid: 'user123',
                sequenceid: request.id,
                upvote: 1,
                downvote: 0
              }
            });
            });
          });
});

/**
 * Tests the behavior of the `getVoteRecord` function when an invalid request object is provided.
 *
 * This test case ensures that the `getVoteRecord` function correctly handles a request object that does not contain the expected `id` property. It verifies that the function still makes the expected API call with the `undefined` value for the sequence ID, and that the returned result matches the expected value.
 *
 * @param {Object} request - The request object containing the sequence ID.
 * @returns {Promise<{ vote: string }>} - The response from the REST API call, containing the vote record.
 */
describe('getVoteRecord', () => {
    
  it('should handle invalid request object', async () => {
    (getUserId as jest.Mock).mockResolvedValue('user123');
    (REST.apiCal as jest.Mock).mockResolvedValue({ vote: 'none' });

    const request = { invalidKey: 'sequence123' };

    const result = await getVoteRecord(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchVoteRecord}undefined/user123`,
      method: 'GET'
    });
    expect(result).toEqual({ vote: 'none' });
  });
});

  

/**
 * Sets up the test environment for the `userVote` module by resetting the mocks for the `getUserId` and `REST.apiCal` functions.
 * 
 * This `beforeEach` block is executed before each test in the `userVote` test suite, ensuring that the mocks are in a known state before each test is run.
 */
describe('userVote', () => {
  beforeEach(() => {
    (getUserId as jest.Mock).mockReset();
    (REST.apiCal as jest.Mock).mockReset();
  });

  /**
   * Sends a vote request to the server, either an upvote or a downvote.
   *
   * @param {Object} request - The request object containing the sequence ID.
   * @param {'up'|'down'} voteType - The type of vote to send, either 'up' or 'down'.
   * @returns {Promise<{ status: number }>} - The response from the REST API call, containing the status code.
   */
  describe('vote', () => {
    it('should send an upvote request', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ status: 200 });

      const result = await vote({ id: 'sequence456' }, 'up');

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: 'user123',
          sequenceid: 'sequence456',
          upvote: 1,
          downvote: 0,
        },
      });
      expect(result).toEqual({ status: 200 });
    });

    it('should send a downvote request', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user789');
      (REST.apiCal as jest.Mock).mockResolvedValue({ status: 200 });

      const result = await vote({ id: 'sequence101112' }, 'down');

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: 'user789',
          sequenceid: 'sequence101112',
          upvote: 0,
          downvote: 1,
        },
      });
      expect(result).toEqual({ status: 200 });
    });
  });

  describe('getVoteRecord', () => {
    /**
     * Fetches the vote record for a given sequence ID and user session ID.
     *
     * @param {Object} request - The request object containing the sequence ID.
     * @param {string} request.id - The ID of the sequence to fetch the vote record for.
     * @returns {Promise<{ data: any }>} - The response from the REST API call, containing the vote data.
     */
    it('should fetch the vote record', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ data: 'voteData' });

      const result = await getVoteRecord({ id: 'sequence456' });

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}sequence456/user123`,
        method: 'GET',
      });
      expect(result).toEqual({ data: 'voteData' });
    });
  });
});


/**
 * Sets up the test environment for the `userVote` module by resetting the mocks for the `getUserId` and `REST.apiCal` functions before each test.
 */

describe('userVote', () => {
  beforeEach(() => {
    (getUserId as jest.Mock).mockReset();
    (REST.apiCal as jest.Mock).mockReset();
  });
});

  describe('vote', () => {
    /**
     * Sends an upvote request to the server for the specified sequence ID.
     *
     * @param {Object} request - The request object containing the sequence ID.
     * @param {string} request.id - The ID of the sequence to upvote.
     * @returns {Promise<{ status: number }>} - The response from the REST API call, containing the status code.
     */
    it('should send an upvote request', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ status: 200 });

      const result = await vote({ id: 'sequence456' }, 'up');

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: 'user123',
          sequenceid: 'sequence456',
          upvote: 1,
          downvote: 0,
        },
      });
      expect(result).toEqual({ status: 200 });
    });
    

    /**
     * Handles errors that occur when trying to get the user ID for a vote request.
     *
     * This test case verifies that if the `getUserId` function rejects with an error, the `vote` function will also reject with the same error, and the `REST.apiCal` function will not be called.
     */
    it('should handle errors from getUserId', async () => {
      (getUserId as jest.Mock).mockRejectedValue(new Error('Failed to get user ID'));

      await expect(vote({ id: 'sequence456' }, 'up')).rejects.toThrow('Failed to get user ID');
      expect(REST.apiCal).not.toHaveBeenCalled();
    });

    /**
     * Handles errors that occur when the REST API call fails during a vote request.
     *
     * This test case verifies that if the `REST.apiCal` function rejects with an error, the `vote` function will also reject with the same error, and the `getUserId` function will still be called.
     *
     * @param {Object} request - The request object containing the sequence ID.
     * @param {string} request.id - The ID of the sequence to vote on.
     * @returns {Promise<void>} - Rejects with the error thrown by the `REST.apiCal` function.
     */
    it('should handle errors from REST.apiCal', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockRejectedValue(new Error('API request failed'));

      await expect(vote({ id: 'sequence456' }, 'up')).rejects.toThrow('API request failed');
      expect(getUserId).toHaveBeenCalled();
    });
  });

  describe('getVoteRecord', () => {
    /**
     * Fetches the vote record for a given sequence ID and user session ID.
     *
     * This function makes a GET request to the `ENDPOINT.fetchVoteRecord` endpoint, passing the sequence ID and user session ID as URL parameters. It returns the response data from the API call.
     *
     * @param {Object} request - The request object containing the sequence ID.
     * @param {string} request.id - The ID of the sequence to fetch the vote record for.
     * @returns {Promise<Object>} - The response data from the API call.
     */
    it('should fetch the vote record', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ data: 'voteData' });

      const result = await getVoteRecord({ id: 'sequence456' });

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}sequence456/user123`,
        method: 'GET',
      });
      expect(result).toEqual({ data: 'voteData' });
    });
});

    /**
     * Handles errors that occur when the `getUserId` function fails to retrieve the user ID.
     *
     * This test case verifies that if the `getUserId` function rejects with an error, the `getVoteRecord` function will also reject with the same error, and the `REST.apiCal` function will not be called.
     *
     * @param {Object} request - The request object containing the sequence ID.
     * @param {string} request.id - The ID of the sequence to fetch the vote record for.
     * @returns {Promise<void>} - Rejects with the error thrown by the `getUserId` function.
     */
    it('should handle errors from getUserId', async () => {
      (getUserId as jest.Mock).mockRejectedValue(new Error('Failed to get user ID'));

      await expect(getVoteRecord({ id: 'sequence456' })).rejects.toThrow('Failed to get user ID');
      expect(REST.apiCal).not.toHaveBeenCalled();
    });


/**
 * Mocks the `./userService` and `./index` modules for testing purposes.
 * This allows the tests to control the behavior of these modules and verify the expected interactions.
 */
jest.mock('./userService');
jest.mock('./index');

/**
 * Sets up the test environment for the `vote` function by mocking the `getUserId` and `REST.apiCal` functions.
 *
 * This `beforeEach` block is executed before each test in the `vote` test suite. It ensures that the `getUserId` function returns a mock user ID of `'user123'`, and the `REST.apiCal` function returns a mock response with `{ success: true }`.
 */
describe('vote', () => {
  beforeEach(() => {
    getUserId.mockResolvedValue('user123');
    REST.apiCal.mockResolvedValue({ success: true });
  });

  /**
   * Sends a POST request to the vote record endpoint with the appropriate parameters for an upvote.
   *
   * This test case verifies that the `vote` function correctly sends a POST request to the `ENDPOINT.VoteRecord` endpoint with the expected parameters when the `type` parameter is set to `'up'`.
   *
   * @param {Object} request - The request object containing the sequence ID.
   * @param {string} request.id - The ID of the sequence to vote on.
   * @param {string} type - The type of vote, either `'up'` or `'down'`.
   * @returns {Promise<void>} - Resolves when the API call is complete.
   */
  it('should send a POST request with correct parameters for upvote', async () => {
    const request = { id: 'seq123' };
    const type = 'up';
    await vote(request, type);
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: 'user123',
        sequenceid: 'seq123',
        upvote: 1,
        downvote: 0,
      },
    });
  });

  /**
   * Sends a POST request to the vote record endpoint with the appropriate parameters for a downvote.
   *
   * This test case verifies that the `vote` function correctly sends a POST request to the `ENDPOINT.VoteRecord` endpoint with the expected parameters when the `type` parameter is set to `'down'`.
   *
   * @param {Object} request - The request object containing the sequence ID.
   * @param {string} request.id - The ID of the sequence to vote on.
   * @param {string} type - The type of vote, either `'up'` or `'down'`.
   * @returns {Promise<void>} - Resolves when the API call is complete.
   */
  it('should send a POST request with correct parameters for downvote', async () => {
    const request = { id: 'seq123' };
    const type = 'down';
    await vote(request, type);
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: 'user123',
        sequenceid: 'seq123',
        upvote: 0,
        downvote: 1,
      },
    });
  });

  /**
   * Verifies that the `vote` function gracefully handles a null userId when sending a POST request to the `ENDPOINT.VoteRecord` endpoint.
   *
   * This test case checks that the `vote` function does not make an API call if the `getUserId` function returns a null userId.
   *
   * @param {Object} request - The request object containing the sequence ID.
   * @param {string} request.id - The ID of the sequence to vote on.
   * @param {string} type - The type of vote, either `'up'` or `'down'`.
   * @returns {Promise<void>} - Resolves when the test case is complete.
   */
  it('should handle null userId gracefully', async () => {
    getUserId.mockResolvedValue(null);
    const request = { id: 'seq123' };
    const type = 'up';
    await vote(request, type);
    expect(REST.apiCal).not.toHaveBeenCalled();
  });
});

describe('vote', () => {
    /**
     * Verifies that the `vote` function does not make an API call if the `request` parameter is `undefined`.
     *
     * This test case checks that the `vote` function gracefully handles the case where the `request` parameter is `undefined` by not making an API call.
     *
     * @param {Object|undefined} request - The request object containing the sequence ID. If `undefined`, the function should not make an API call.
     * @param {string} type - The type of vote, either `'up'` or `'down'`.
     * @returns {Promise<void>} - Resolves when the test case is complete.
     */
    it('should not send a request if request object is undefined', async () => {
      const type = 'up';
      await vote(undefined, type);
      expect(REST.apiCal).not.toHaveBeenCalled();
    });
  
    /**
     * Verifies that the `vote` function does not make an API call if the `type` parameter is neither `'up'` nor `'down'`.
     *
     * This test case checks that the `vote` function gracefully handles the case where the `type` parameter is an invalid value by not making an API call.
     *
     * @param {Object} request - The request object containing the sequence ID.
     * @param {string} request.id - The ID of the sequence to vote on.
     * @param {string} type - The type of vote, which should be either `'up'` or `'down'`.
     * @returns {Promise<void>} - Resolves when the test case is complete.
     */
    it('should not send a request if type is neither "up" nor "down"', async () => {
      const request = { id: 'seq123' };
      const type = 'invalidType';
      await vote(request, type);
      expect(REST.apiCal).not.toHaveBeenCalled();
    });
  
    /**
     * Verifies that the `vote` function gracefully handles API call failures by rejecting the promise with the error message.
     *
     * This test case checks that if the `REST.apiCal` function throws an error, the `vote` function will reject the promise with the same error message.
     *
     * @param {Object} request - The request object containing the sequence ID.
     * @param {string} request.id - The ID of the sequence to vote on.
     * @param {string} type - The type of vote, either `'up'` or `'down'`.
     * @returns {Promise<void>} - Rejects with the error message when the API call fails.
     */
    it('should handle API call failures gracefully', async () => {
      REST.apiCal.mockRejectedValue(new Error('API call failed'));
      const request = { id: 'seq123' };
      const type = 'up';
      await expect(vote(request, type)).rejects.toThrow('API call failed');
    });
  });



/**
 * Mocks the `REST.apiCal` function from the `./index` module for testing purposes.
 * This allows the tests to control the behavior of the `REST.apiCal` function without making actual API calls.
 */
jest.mock('./index', () => ({
  REST: {
    apiCal: jest.fn()
  }
}));

/**
 * Describes the test suite for the `vote` function.
 * 
 * This test suite verifies the behavior of the `vote` function, which is responsible for sending a vote request to the server.
 * The tests cover different scenarios, such as sending a valid vote request, handling invalid vote types, and gracefully handling API call failures.
 */
describe('vote', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });  
});

/**
 * Clears all mocks after each test in the `getVoteRecord` test suite.
 * This ensures that each test starts with a clean slate and doesn't interfere with other tests.
 */
afterEach(() => {
  jest.clearAllMocks();
});
describe('getVoteRecord', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests the `getVoteRecord` function by mocking the `REST.apiCal` function and verifying that it is called with the correct parameters.
   *
   * @param {Object} mockRequest - The mock request object containing the sequence ID.
   * @param {string} mockRequest.id - The ID of the sequence to fetch the vote record for.
   * @returns {Promise<void>} - Resolves when the test completes successfully.
   */
  it('should call the fetch vote record API with the correct parameters', async () => {
    const mockRequest = {
      id: 'sequence-123'
    };
  
    jest.spyOn(global, 'getUserId').mockResolvedValue('user-123');
  
    await getVoteRecord(mockRequest);
  
    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchVoteRecord}sequence-123/user-123`,
      method: 'GET'
    });
  });
  /**
   * Tests the `getVoteRecord` function by mocking the `REST.apiCal` function and verifying that it is called with the correct parameters.
   *
   * @param {Object} mockRequest - The mock request object containing the sequence ID.
   * @param {string} mockRequest.id - The ID of the sequence to fetch the vote record for.
   * @returns {Promise<void>} - Resolves when the test completes successfully.
   */
  it('should call the fetch vote record API with the correct parameters', async () => {
    const mockRequest = {
      id: 'sequence-123'
    };

    jest.spyOn(global, 'getUserId').mockResolvedValue('user-123');

    await getVoteRecord(mockRequest);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchVoteRecord}sequence-123/user-123`,
      method: 'GET'
    });
  });
});


/**
 * Mocks the `REST.apiCal` function from the `./index` module for testing purposes.
 */
jest.mock('./index', () => ({
  REST: {
    apiCal: jest.fn()
  }
}));

/**
 * Clears all mocks after each test in the 'vote' suite.
 * This ensures that each test starts with a clean slate and
 * doesn't have any side effects from previous tests.
 */
describe('vote', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests the `vote` function by mocking the `getUserId` and `REST.apiCal` functions and verifying that the vote API is called with the correct payload for an upvote.
   *
   * @param {Object} mockRequest - The mock request object containing the sequence ID.
   * @param {string} mockRequest.id - The ID of the sequence to vote on.
   * @returns {Promise<void>} - Resolves when the test completes successfully.
   */
  it('should call the vote API with the correct payload for an upvote', async () => {
    const mockRequest = {
      id: 'sequence-123'
    };

    jest.spyOn(global, 'getUserId').mockResolvedValue('user-123');

    await vote(mockRequest, 'up');

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: 'user-123',
        sequenceid: 'sequence-123',
        upvote: 1,
        downvote: 0
      }
    });
  });

  /**
   * Tests the `vote` function by mocking the `getUserId` and `REST.apiCal` functions and verifying that the vote API is called with the correct payload for a downvote.
   *
   * @param {Object} mockRequest - The mock request object containing the sequence ID.
   * @param {string} mockRequest.id - The ID of the sequence to vote on.
   * @returns {Promise<void>} - Resolves when the test completes successfully.
   */
  it('should call the vote API with the correct payload for a downvote', async () => {
    const mockRequest = {
      id: 'sequence-123'
    };

    jest.spyOn(global, 'getUserId').mockResolvedValue('user-123');

    await vote(mockRequest, 'down');

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: 'user-123',
        sequenceid: 'sequence-123',
        upvote: 0,
        downvote: 1
      }
    });
  });

  /**
   * Tests the `vote` function by mocking the `getUserId` and `REST.apiCal` functions and verifying that the vote API is called with the correct payload for an upvote, and that the result of the API call is returned.
   *
   * @param {Object} mockRequest - The mock request object containing the sequence ID.
   * @param {string} mockRequest.id - The ID of the sequence to vote on.
   * @returns {Promise<Object>} - Resolves with the response from the vote API call.
   */
  it('should return the result of the API call', async () => {
    const mockRequest = {
      id: 'sequence-123'
    };
    const mockResponse = { success: true };

    jest.spyOn(global, 'getUserId').mockResolvedValue('user-123');
    jest.spyOn(REST, 'apiCal').mockResolvedValue(mockResponse);

    const result = await vote(mockRequest, 'up');
    expect(result).toEqual(mockResponse);
  });

  /**
   * Tests the `vote` function by mocking the `getUserId` and `REST.apiCal` functions and verifying that the vote API is called with the correct payload for an upvote, and that the error is thrown if the API call fails.
   *
   * @param {Object} mockRequest - The mock request object containing the sequence ID.
   * @param {string} mockRequest.id - The ID of the sequence to vote on.
   * @returns {Promise<void>} - Resolves when the test completes successfully, or rejects with the error if the API call fails.
   */
  it('should throw an error if the API call fails', async () => {
    const mockRequest = {
      id: 'sequence-123'
    };
    const mockError = new Error('API call failed');

    jest.spyOn(global, 'getUserId').mockResolvedValue('user-123');
    jest.spyOn(REST, 'apiCal').mockRejectedValue(mockError);

    await expect(vote(mockRequest, 'up')).rejects.toThrow(mockError);
  });
});

/**
 * Clears all mocks after each test in the `getVoteRecord` suite.
 */
describe('getVoteRecord', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
});

it('should upvote a recording', async () => {
    const request = { id: 'recording-123' };
    const type = 'up';
  
    // Mock getUserId function to return a user session ID
    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue('user-session-123');
  
    // Mock the REST.apiCal function
    const mockApiCal = jest.fn();
    jest.mock('./index', () => ({
      REST: { apiCal: mockApiCal }
    }));
  
    await vote(request, type);
  
    expect(mockApiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: 'user-session-123',
        sequenceid: 'recording-123',
        upvote: 1,
        downvote: 0
      }
    });
  });

  it('should downvote a recording', async () => {
    const request = { id: 'recording-456' };
    const type = 'down';
  
    // Mock getUserId function to return a user session ID
    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue('user-session-456');
  
    // Mock the REST.apiCal function
    const mockApiCal = jest.fn();
    jest.mock('./index', () => ({
      REST: { apiCal: mockApiCal }
    }));
  
    await vote(request, type);
  
    expect(mockApiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: 'user-session-456',
        sequenceid: 'recording-456',
        upvote: 0,
        downvote: 1
      }
    });
  });
  
  it('should fetch the vote record for a recording', async () => {
    const request = { id: 'recording-789' };
  
    // Mock getUserId function to return a user session ID
    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue('user-session-789');
  
    // Mock the REST.apiCal function
    const mockApiCal = jest.fn();
    jest.mock('./index', () => ({
      REST: { apiCal: mockApiCal }
    }));
  
    await getVoteRecord(request);
  
    expect(mockApiCal).toHaveBeenCalledWith({
      url: ENDPOINT.fetchVoteRecord + 'recording-789/user-session-789',
      method: 'GET'
    });
  });
/**
 * Throws an error if the provided request object does not have an 'id' property.
 *
 * @param {Object} request - The request object containing the recording ID.
 * @throws {Error} If the request ID is not provided.
 */

  it('should not vote and throw an error when request ID is not provided', async () => {
    const request = { id: null };
    const type = 'up';
  
    await expect(vote(request, type)).rejects.toThrow('Request ID is required');
  });
  
  /**
   * Throws an error if the provided vote type is neither "up" nor "down".
   *
   * @param {Object} request - The request object containing the recording ID.
   * @param {string} type - The type of vote, either "up" or "down".
   * @throws {Error} If the vote type is invalid.
   */
  it('should not vote and throw an error when type is neither "up" nor "down"', async () => {
    const request = { id: 'recording-123' };
    const type = 'invalid';
  
    await expect(vote(request, type)).rejects.toThrow('Invalid vote type');
  });
  
  /**
   * Throws an error if the provided request object does not have an 'id' property.
   *
   * @param {Object} request - The request object containing the recording ID.
   * @throws {Error} If the request ID is not provided.
   */
  it('should not fetch vote record and throw an error when request ID is not provided', async () => {
    const request = { id: null };
  
    await expect(getVoteRecord(request)).rejects.toThrow('Request ID is required');
  });

  it('should fetch the vote record for a recording successfully', async () => {
    const request = { id: 'recording-789' };
  
    // Mock getUserId function to return a user session ID
    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue('user-session-789');
  
    // Mock the REST.apiCal function to return a mock response
    const mockResponse = { data: 'vote record data' };
    jest.mock('./index', () => ({
      REST: { apiCal: jest.fn().mockResolvedValue(mockResponse) }
    }));
  
    const result = await getVoteRecord(request);
  
    expect(result).toEqual(mockResponse);
  });
  
  
  
  /**
   * Mocks the REST.apiCal function from the './index' module for testing purposes.
   */
  jest.mock('./index', () => ({
    REST: {
      apiCal: jest.fn()
    }
  }));
  
  /**
   * Clears all mocks after each test in the 'vote' suite.
   */
  describe('vote', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    /**
     * Calls the REST.apiCal function with the correct parameters to record an upvote for the specified request.
     *
     * @param {Object} request - The request object containing the recording ID.
     * @returns {Promise<void>} - A Promise that resolves when the upvote is recorded.
     */
    it('should call REST.apiCal with the correct parameters for an upvote', async () => {
      const mockUserId = '123456789';
      const mockRequest = { id: 'abc123' };
  
      jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
  
      await vote(mockRequest, 'up');
  
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 1,
          downvote: 0
        }
      });
    });
  
    /**
     * Calls the REST.apiCal function with the correct parameters to record a downvote for the specified request.
     *
     * @param {Object} request - The request object containing the recording ID.
     * @returns {Promise<void>} - A Promise that resolves when the downvote is recorded.
     */
    it('should call REST.apiCal with the correct parameters for a downvote', async () => {
      const mockUserId = '123456789';
      const mockRequest = { id: 'abc123' };
  
      jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
  
      await vote(mockRequest, 'down');
  
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 0,
          downvote: 1
        }
      });
    });
  
    /**
     * Calls the REST.apiCal function with the correct parameters to record a neutral vote for the specified request.
     *
     * @param {Object} request - The request object containing the recording ID.
     * @returns {Promise<void>} - A Promise that resolves when the neutral vote is recorded.
     */
    it('should call REST.apiCal with the correct parameters for a neutral vote', async () => {
      const mockUserId = '123456789';
      const mockRequest = { id: 'abc123' };
  
      jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
  
      await vote(mockRequest);
  
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 0,
          downvote: 0
        }
      });
    });
  });
  
  /**
   * Clears all mocks after each test in the 'getVoteRecord' test suite.
   */
  describe('getVoteRecord', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    /**
     * Calls the REST.apiCal function with the correct parameters to fetch the vote record for the specified request and user.
     *
     * @param {Object} request - The request object containing the recording ID.
     * @returns {Promise<void>} - A Promise that resolves when the vote record is fetched.
     */
    it('should call REST.apiCal with the correct parameters', async () => {
      const mockUserId = '123456789';
      const mockRequest = { id: 'abc123' };
  
      jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
  
      await getVoteRecord(mockRequest);
  
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}${mockRequest.id}/${mockUserId}`,
        method: 'GET'
      });
    });
  });


/**
 * Clears all mocks after each test in the 'vote' test suite.
 */
describe('vote', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Calls the REST.apiCal function with the correct parameters to record an upvote for the specified request and user.
   *
   * @param {Object} request - The request object containing the recording ID.
   * @returns {Promise<void>} - A Promise that resolves when the upvote is recorded.
   */
  it('should call REST.apiCal with the correct parameters for an upvote', async () => {
    const mockUserId = '123456789';
    const mockRequest = { id: 'abc123' };

    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

    await vote(mockRequest, 'up');

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: mockUserId,
        sequenceid: mockRequest.id,
        upvote: 1,
        downvote: 0
      }
    });
  });

  /**
   * Calls the REST.apiCal function with the correct parameters to record a downvote for the specified request and user.
   *
   * @param {Object} request - The request object containing the recording ID.
   * @returns {Promise<void>} - A Promise that resolves when the downvote is recorded.
   */
  it('should call REST.apiCal with the correct parameters for a downvote', async () => {
    const mockUserId = '123456789';
    const mockRequest = { id: 'abc123' };

    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

    await vote(mockRequest, 'down');

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: mockUserId,
        sequenceid: mockRequest.id,
        upvote: 0,
        downvote: 1
      }
    });
  });

  /**
   * Calls the REST.apiCal function with the correct parameters to record a neutral vote for the specified request and user.
   *
   * @param {Object} request - The request object containing the recording ID.
   * @returns {Promise<void>} - A Promise that resolves when the neutral vote is recorded.
   */
  it('should call REST.apiCal with the correct parameters for a neutral vote', async () => {
    const mockUserId = '123456789';
    const mockRequest = { id: 'abc123' };

    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

    await vote(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: mockUserId,
        sequenceid: mockRequest.id,
        upvote: 0,
        downvote: 0
      }
    });
  });

  /**
   * Handles the case where a null request is passed to the `vote` function.
   *
   * @param {Object} request - The request object containing the recording ID.
   * @returns {Promise<void>} - A Promise that resolves when the vote is recorded.
   */
  it('should handle null request', async () => {
    const mockUserId = '123456789';

    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

    await vote(null, 'up');

    expect(REST.apiCal).not.toHaveBeenCalled();
  });

  /**
   * Handles the case where an invalid vote type is passed to the `vote` function.
   *
   * @param {Object} request - The request object containing the recording ID.
   * @param {string} voteType - The type of vote to record ('up', 'down', or 'invalid').
   * @returns {Promise<void>} - A Promise that resolves when the vote is recorded.
   */
  it('should handle invalid vote type', async () => {
    const mockUserId = '123456789';
    const mockRequest = { id: 'abc123' };

    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

    await vote(mockRequest, 'invalid');

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: mockUserId,
        sequenceid: mockRequest.id,
        upvote: 0,
        downvote: 0
      }
    });
  });
});

/**
 * Clears all mocks after each test in the `getVoteRecord` suite.
 */
describe('getVoteRecord', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Calls the REST API to fetch the vote record for a given request.
   *
   * @param {Object} request - The request object containing the recording ID.
   * @returns {Promise<void>} - A Promise that resolves when the vote record is fetched.
   */
  it('should call REST.apiCal with the correct parameters', async () => {
    const mockUserId = '123456789';
    const mockRequest = { id: 'abc123' };

    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

    await getVoteRecord(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchVoteRecord}${mockRequest.id}/${mockUserId}`,
      method: 'GET'
    });
  });

  /**
   * Handles the case where a null request is passed to the `getVoteRecord` function.
   *
   * This test ensures that the `getVoteRecord` function does not make any API calls when a null request is provided.
   */
  it('should handle null request', async () => {
    const mockUserId = '123456789';

    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

    await getVoteRecord(null);

    expect(REST.apiCal).not.toHaveBeenCalled();
  });
});

  

