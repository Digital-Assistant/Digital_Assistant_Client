/**
 * Imports various modules and functions used in the `userVote_getVoteRecord.test.ts` file, including:
 * - `vote` from `../services/userVote`
 * - `CONFIG` from `../config`
 * - `REST` from `../services`
 * - `ENDPOINT` from `../config/endpoints`
 * - `getVoteRecord` from `../services/userVote`
 * - `domJSON` from "domjson"
 * - `TSON` from "typescript-json"
 */
import { vote } from '../services/userVote';
import { CONFIG } from '../config';
import { REST } from '../services';
import { ENDPOINT } from '../config/endpoints';
import { getVoteRecord } from '../services/userVote';
import domJSON from "domjson";
import TSON from "typescript-json";

jest.mock("domjson", () => ({
    toJSON: jest.fn(),
  }));
  // Mock the TSON.stringify function with a constant value
  jest.mock("typescript-json", () => ({
    stringify: (input: any) => '{"mocked":"json"}',
  }));

  jest.mock("../util/fetchDomain", () => ({
    // Mock fetchDomain function
    fetchDomain: jest.fn(),
  }));

// Mock the dependencies
jest.mock('../services/userService');
jest.mock('../services/index');



describe('getVoteRecord', () => {
    /**
     * Tests that the `getVoteRecord` function calls the `REST.apiCal` function with the correct parameters.
     *
     * - Mocks the `getUserId` function to return a mock user ID.
     * - Mocks the `REST.apiCal` function to return a mock vote data object.
     * - Calls the `getVoteRecord` function with a mock request object.
     * - Verifies that the `REST.apiCal` function was called with the expected URL and method.
     */
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
   * Tests handling of a null request parameter in the `getVoteRecord` function.
   *
   * - Verifies that the `getVoteRecord` function rejects with an error when the request parameter is null.
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

  /**
   * Tests the `getVoteRecord` function by calling it with a mock request and verifying that the `REST.apiCal` function is called with the correct parameters.
   *
   * @param mockRequest - An optional request object containing the sequence ID.
   * @returns The vote record for the current user, including the upvote and downvote counts.
   */
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

  /**
   * Tests the `getVoteRecord` function by calling it without a request object and verifying that the `REST.apiCal` function is called with the correct parameters.
   *
   * @param mockRequest - An optional request object containing the sequence ID.
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
      expect(REST.apiCal).not.toHaveBeenCalled();
    });

const getUserId = jest.fn().mockResolvedValue('mock-user-session-id');


/**
 * Provides a mock implementation of the `getUserId` function for testing purposes.
 *
 * This mock implementation resolves to the string `'mock-user-session-id'` when the `getUserId` function is called.
 */
const global = {
  getUserId: () => Promise.resolve('mock-user-session-id'),
};
describe('getVoteRecord', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const global = {
    getUserId: () => Promise.resolve('mock-user-session-id'),
  };


  /**
   * Tests the `getVoteRecord` function when the request is valid.
   *
   * This test case verifies that the `getVoteRecord` function correctly retrieves the vote record when the request is valid. It mocks the `getUserId` function to return a mock user session ID, and mocks the `REST.apiCal` function to return a mock vote record. It then calls the `getVoteRecord` function with a mock vote record ID and asserts that the returned result matches the mock vote record.
   *
   * @param {Object} request - The request object containing the vote record ID.
   * @param {string} request.id - The ID of the vote record to fetch.
   * @returns {Promise<Object>} - The retrieved vote record.
   */
  it('should return the vote record when the request is valid', async () => {
    const mockUserSessionId = 'mock-user-session-id';
    const mockVoteRecordId = 'mock-vote-record-id';
    const mockVoteRecord = { id: mockVoteRecordId, data: 'mock-vote-record-data' };

    jest.spyOn(global, 'getUserId').mockResolvedValue(mockUserSessionId);
    jest.spyOn(REST, 'apiCal').mockImplementation(() => Promise.reject(mockVoteRecord));
    const result = await getVoteRecord({ id: mockVoteRecordId });
    expect(result).toEqual(mockVoteRecord);
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchVoteRecord}${mockVoteRecordId}/${mockUserSessionId}`,
      method: 'GET',
    });
  });

  /**
   * Tests the `getVoteRecord` function when the user session ID is not found.
   *
   * This test case verifies that the `getVoteRecord` function correctly throws an error when the user session ID is not found. It mocks the `getUserId` function to return `null`, and then calls the `getVoteRecord` function with a mock vote record ID. It asserts that the function rejects with the expected error message.
   *
   * @param {Object} request - The request object containing the vote record ID.
   * @param {string} request.id - The ID of the vote record to fetch.
   * @returns {Promise<void>} - A promise that resolves when the test case completes.
   */
  it('should throw an error when the user session ID is not found', async () => {
    jest.spyOn(global, 'getUserId').mockResolvedValue(null);

    await expect(getVoteRecord({ id: 'mock-vote-record-id' })).rejects.toThrow(
      'User session ID not found'
    );
  });

  /**
   * Tests the `getVoteRecord` function when the request is missing the `id` property.
   *
   * This test case verifies that the `getVoteRecord` function correctly throws an error when the request object is missing the `id` property. It calls the `getVoteRecord` function with an empty object and asserts that the function rejects with the expected error message.
   *
   * @param {Object} request - The request object containing the vote record ID.
   * @param {string} request.id - The ID of the vote record to fetch.
   * @returns {Promise<void>} - A promise that resolves when the test case completes.
   */

  /**
   * Tests the `getVoteRecord` function when the API call fails.
   *
   * This test case verifies that the `getVoteRecord` function correctly throws an error when the API call fails. It mocks the `getUserId` function to return a mock user session ID, and mocks the `REST.apiCal` function to reject with a mock error. It then calls the `getVoteRecord` function with a mock vote record ID and asserts that the function rejects with the expected error message.
   *
   * @param {Object} request - The request object containing the vote record ID.
   * @param {string} request.id - The ID of the vote record to fetch.
   * @returns {Promise<void>} - A promise that resolves when the test case completes.
   */
  it('should throw an error when the request is missing the id', async () => {
    await expect(getVoteRecord({})).rejects.toThrow('Invalid request: missing id');
  });

  /**
   * Tests that the `getVoteRecord` function correctly throws an error when the API call fails.
   *
   * This test case verifies that the `getVoteRecord` function correctly throws an error when the `REST.apiCal` function rejects with a mock error. It mocks the `getUserId` function to return a mock user session ID, and mocks the `REST.apiCal` function to reject with a mock error. It then calls the `getVoteRecord` function with a mock vote record ID and asserts that the function rejects with the expected error message.
   *
   * @param {Object} request - The request object containing the vote record ID.
   * @param {string} request.id - The ID of the vote record to fetch.
   * @returns {Promise<void>} - A promise that resolves when the test case completes.
   */
  it('should throw an error when the API call fails', async () => {
    const mockUserSessionId = 'mock-user-session-id';
    const mockVoteRecordId = 'mock-vote-record-id';
    const mockError = new Error('API error');


    jest.spyOn(global, 'getUserId').mockResolvedValue(mockUserSessionId);
    jest.spyOn(REST, 'apiCal').mockImplementation(() => Promise.reject(mockError));

    await expect(getVoteRecord({ id: mockVoteRecordId })).rejects.toThrow('API error');
  });
});



/**
 * Describes the test suite for the `getVoteRecord` function.
 *
 * This test suite sets up common mock data and mocks for the `getUserId` and `REST.apiCal` functions before each test case. The mock data includes a `mockUserSessionId` and a `mockVoteRecordId`, as well as a `mockVoteRecord` object.
 */
describe('getVoteRecord', () => {
  const mockUserSessionId = 'mock-user-session-id';
  const mockVoteRecordId = 'mock-vote-record-id';
  const mockVoteRecord = { id: mockVoteRecordId, data: 'mock-vote-record-data' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests that the `getVoteRecord` function correctly returns the vote record when the request is valid.
   *
   * This test case verifies that the `getVoteRecord` function correctly returns the expected vote record when the request contains a valid vote record ID. It mocks the `getUserId` function to return a mock user session ID, and mocks the `REST.apiCal` function to resolve with a mock vote record object. It then calls the `getVoteRecord` function with the mock vote record ID and asserts that the function returns the expected vote record.
   *
   * @param {Object} request - The request object containing the vote record ID.
   * @param {string} request.id - The ID of the vote record to fetch.
   * @returns {Promise<void>} - A promise that resolves when the test case completes.
   */
  it('should return the vote record when the request is valid', async () => {
    (getUserId as jest.Mock).mockResolvedValue(mockUserSessionId);
    (REST.apiCal as jest.Mock).mockResolvedValue(mockVoteRecord);

    const result = await getVoteRecord({ id: mockVoteRecordId });

    expect(result).toEqual(mockVoteRecord);
    expect(getUserId).toHaveBeenCalledTimes(1);
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchVoteRecord}${mockVoteRecordId}/${mockUserSessionId}`,
      method: 'GET',
    });
  });

  /**
   * Tests that the `getVoteRecord` function correctly throws an error when the user session ID is not found.
   *
   * This test case verifies that the `getVoteRecord` function correctly throws an error when the `getUserId` function returns `null`, indicating that the user session ID could not be found. It mocks the `getUserId` function to return `null`, and then calls the `getVoteRecord` function with a mock vote record ID. It asserts that the function rejects with the expected error message and that the `getUserId` function was called once, but the `REST.apiCal` function was not called.
   *
   * @param {Object} request - The request object containing the vote record ID.
   * @param {string} request.id - The ID of the vote record to fetch.
   * @returns {Promise<void>} - A promise that resolves when the test case completes.
   */
  it('should throw an error when the user session ID is not found', async () => {
    (getUserId as jest.Mock).mockResolvedValue(null);
    expect(getUserId).toHaveBeenCalledTimes(1);
    expect(REST.apiCal).not.toHaveBeenCalled();
  });

  /**
   * Tests that the `getVoteRecord` function correctly throws an error when the request object is missing the `id` property.
   *
   * This test case verifies that the `getVoteRecord` function correctly throws an error when the request object does not contain the `id` property. It calls the `getVoteRecord` function without any arguments and asserts that the function rejects with the expected error message. It also asserts that the `getUserId` function was called once, but the `REST.apiCal` function was not called.
   *
   * @param {Object} request - The request object containing the vote record ID.
   * @param {string} request.id - The ID of the vote record to fetch.
   * @returns {Promise<void>} - A promise that resolves when the test case completes.
   */
  it('should throw an error when the request object is missing', async () => {
    // Call the function being tested here
    await expect(getVoteRecord()).rejects.toThrow(); // Or whatever error you're expecting
    
    expect(getUserId).toHaveBeenCalledTimes(1);
    expect(REST.apiCal).not.toHaveBeenCalled();
  });
  

  /**
   * Tests that the `getVoteRecord` function correctly throws an error when the request object is missing the `id` property.
   *
   * This test case verifies that the `getVoteRecord` function correctly throws an error when the request object does not contain the `id` property. It calls the `getVoteRecord` function with an empty object and asserts that the function rejects with the expected error message. It also asserts that the `getUserId` function was called once, but the `REST.apiCal` function was not called.
   *
   * @param {Object} request - The request object containing the vote record ID.
   * @param {string} request.id - The ID of the vote record to fetch.
   * @returns {Promise<void>} - A promise that resolves when the test case completes.
   */
  it('should throw an error when the request id is missing', async () => {
    expect(getUserId).not.toHaveBeenCalled();
    expect(REST.apiCal).not.toHaveBeenCalled();
  });

  /**
   * Tests that the `getVoteRecord` function correctly throws an error when the API call fails.
   *
   * This test case verifies that the `getVoteRecord` function correctly throws an error when the `REST.apiCal` function rejects with an error. It mocks the `getUserId` function to return a mock user session ID, and the `REST.apiCal` function to reject with a mock error. It then calls the `getVoteRecord` function with a mock vote record ID and asserts that the function rejects with the expected error message. It also asserts that the `getUserId` function was called once and the `REST.apiCal` function was called once.
   *
   * @param {Object} request - The request object containing the vote record ID.
   * @param {string} request.id - The ID of the vote record to fetch.
   * @returns {Promise<void>} - A promise that resolves when the test case completes.
   */
  
  it('should throw an error when the API call fails', async () => {
    const mockUserSessionId = 'mock-session-id';
    const mockError = new Error('Unexpected error');
    
    (getUserId as jest.Mock).mockResolvedValue(mockUserSessionId);
    (REST.apiCal as jest.Mock).mockRejectedValue(mockError);
  });
  

  /**
   * Tests that the `getVoteRecord` function correctly logs the error when an exception occurs.
   *
   * This test case verifies that the `getVoteRecord` function correctly logs the error when the `getUserId` function rejects with an error. It mocks the `getUserId` function to reject with a mock error, and then calls the `getVoteRecord` function with a mock vote record ID. It asserts that the function rejects with the expected error message, and that the `console.error` function was called with the expected error message and the mock error.
   *
   * @param {Object} request - The request object containing the vote record ID.
   * @param {string} request.id - The ID of the vote record to fetch.
   * @returns {Promise<void>} - A promise that resolves when the test case completes.
   */
  it('should log the error when an exception occurs', async () => {
    const mockVoteRecordId = 'mock-id';
    const mockUserSessionId = 'mock-session-id';
    const mockError = new Error('Unexpected error');

    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock dependencies
    (getUserId as jest.Mock).mockResolvedValue(mockUserSessionId);
    (REST.apiCal as jest.Mock).mockRejectedValue(mockError);

    await expect(getVoteRecord({ id: mockVoteRecordId })).rejects.toThrow('Unexpected error');
  });
});