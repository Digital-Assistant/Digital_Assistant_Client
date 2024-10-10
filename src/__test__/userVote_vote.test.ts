/**
 * This code imports various modules and functions that are used in the `userVote_vote.test.ts` file. The imported modules and functions are:
 *
 * - `vote` function from `../services/userVote`
 * - `getUserId` function from `../services/userService`
 * - `CONFIG` object from `../config`
 * - `REST` object from `../services`
 * - `ENDPOINT` object from `../config/endpoints`
 * - `domJSON` module from `domjson`
 * - `TSON` module from `typescript-json`
 */
import { vote } from '../services/userVote';
import { getUserId } from '../services/userService';
import { CONFIG } from '../config';
import { REST } from '../services';
import { ENDPOINT } from '../config/endpoints';
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

describe('vote function', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });


  /**
   * Tests the 'vote' function with an 'up' vote.
   *
   * - Mocks the `getUserId` function to return a valid user session ID.
   * - Mocks the `REST.apiCal` function to return a successful response.
   * - Calls the `vote` function with a request object containing a 'recording-456' ID and an 'up' vote type.
   * - Verifies that the `vote` function calls the `REST.apiCal` function with the correct parameters, including the 'sequenceid' property set to the 'recording-456' ID and the 'upvote' property set to 1.
   * - Verifies that the `vote` function returns the expected successful response.
   */
  it('should successfully vote up', async () => {
    // Mock the getUserId function
    (getUserId as jest.Mock).mockResolvedValue('user-123');

    // Mock the REST.apiCal function
    (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

    const request = { id: 'recording-456' };
    const result = await vote(request, 'up');

    expect(result).toEqual({ success: true });
    expect(getUserId).toHaveBeenCalledTimes(1);
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: 'user-123',
        sequenceid: 'recording-456',
        upvote: 1,
        downvote: 0,
      },
    });
  });

  /**
   * Tests the 'vote' function with a 'down' vote.
   *
   * - Mocks the `getUserId` function to return a valid user session ID.
   * - Mocks the `REST.apiCal` function to return a successful response.
   * - Calls the `vote` function with a request object containing a 'recording-789' ID and a 'down' vote type.
   * - Verifies that the `vote` function calls the `REST.apiCal` function with the correct parameters, including the 'sequenceid' property set to the 'recording-789' ID and the 'downvote' property set to 1.
   * - Verifies that the `vote` function returns the expected successful response.
   */
  it('should successfully vote down', async () => {
    (getUserId as jest.Mock).mockResolvedValue('user-123');
    (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

    const request = { id: 'recording-789' };
    const result = await vote(request, 'down');

    expect(result).toEqual({ success: true });
    expect(getUserId).toHaveBeenCalledTimes(1);
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: 'user-123',
        sequenceid: 'recording-789',
        upvote: 0,
        downvote: 1,
      },
    });
  });

  /**
   * Tests that the `vote` function throws an error when the user session ID is not found.
   *
   * - Mocks the `getUserId` function to return `null`, simulating a scenario where the user session ID is not found.
   * - Calls the `vote` function with a request object containing a 'recording-123' ID and an 'up' vote type.
   * - Verifies that the `vote` function rejects with an error message 'User session ID not found'.
   */
  it('should throw an error if user session ID is not found', async () => {
    (getUserId as jest.Mock).mockResolvedValue(null);

    const request = { id: 'recording-123' };
    await expect(vote(request, 'up')).rejects.toThrow('User session ID not found');
  });

  /**
   * Tests handling of invalid requests in the `vote` function.
   *
   * - Verifies that the `vote` function rejects with an error when the `request` parameter is `undefined`.
   * - Verifies that the `vote` function rejects with an error when the `request` parameter is an empty object.
   */
  it('should throw an error if request is invalid', async () => {
    (getUserId as jest.Mock).mockResolvedValue('user-123');

    await expect(vote(undefined, 'up')).rejects.toThrow('Invalid request: missing id');
    await expect(vote({}, 'up')).rejects.toThrow('Invalid request: missing id');
  });

  /**
   * Tests handling of an invalid vote type in the `vote` function.
   *
   * - Verifies that the `vote` function rejects with an error when the `voteType` parameter is not 'up' or 'down'.
   */
  it('should throw an error if vote type is invalid', async () => {
    (getUserId as jest.Mock).mockResolvedValue('user-123');

    const request = { id: 'recording-123' };
    await expect(vote(request, 'invalid')).rejects.toThrow('Invalid vote type');
  });

  /**
   * Tests handling of a numeric 'id' property in the `vote` function.
   *
   * - Verifies that the `vote` function calls the `REST.apiCal` function with the `sequenceid` property set to the numeric value of the 'id' property in the request object.
   */
  it('should handle vote with numeric id', async () => {
    (getUserId as jest.Mock).mockResolvedValue('user-123');
    (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

    const request = { id: 123 };  // Numeric id
    const result = await vote(request, 'up');

    expect(result).toEqual({ success: true });
    expect(getUserId).toHaveBeenCalledTimes(1);
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: 'user-123',
        sequenceid: 123,  // Numeric id
        upvote: 1,
        downvote: 0,
      },
    });
  });
});

/**
 * Tests handling of a null request object in the `vote` function.
 *
 * - Verifies that the `vote` function rejects with an error when the request parameter is `null`.
 */
describe('vote - Additional Tests', () => {
    it('should handle vote with null request', async () => {
      await expect(vote(null, 'up')).rejects.toThrow();
    });
  });
    
    /**
     * Tests handling of a non-object request object in the `vote` function.
     *
     * - Verifies that the `vote` function rejects with an error when the request parameter is not an object.
     */
    it('should handle vote with non-object request', async () => {
      await expect(vote('not an object', 'up')).rejects.toThrow();
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


  describe('vote', () => {  
    /**
     * Tests error handling for the `vote` function when the `getUserId` function fails.
     *
     * - Verifies that the `vote` function rejects with the expected error when `getUserId` throws an error.
     *
     * @param request - An object containing the sequence ID to vote on.
     */
    it('should handle errors from getUserId', async () => {
        (getUserId as jest.Mock).mockRejectedValue(new Error('User ID error'));
  
        await expect(vote({ id: 'sequence123' }, 'up')).rejects.toThrow('User ID error');
      });
  
      /**
       * Tests error handling for the `vote` function when the API call fails.
       *
       * - Verifies that the `vote` function rejects with the expected error when `REST.apiCal` throws an error.
       *
       * @param request - An object containing the sequence ID to vote on.
       */
      it('should handle errors from REST.apiCal', async () => {
        (getUserId as jest.Mock).mockResolvedValue('user123');
        (REST.apiCal as jest.Mock).mockRejectedValue(new Error('API error'));
  
        await expect(vote({ id: 'sequence123' }, 'up')).rejects.toThrow('API error');
      });
    });
       
      /**
       * Tests that the `vote` function rejects with an error when an invalid vote type is provided.
       *
       * @param request - An object containing the sequence ID to vote on.
       */
      it('should handle invalid vote types', async () => {
        const request = { id: 'recording-123' };
        await expect(vote(request, 'invalid')).rejects.toThrow();
      });
  

      describe('vote', () => {
        /**
         * Tests the `vote` function by calling it with a mock request and verifying that the REST API is called with the correct parameters for an upvote.
         *
         * @param mockRequest - An object containing the sequence ID to vote on.
         * @returns A promise that resolves with the result of the vote operation.
         */
        it('should call the REST API with the correct parameters for upvote', async () => {
          const mockUserId = 'user123';
          const mockRequest = { id: 'record456' };
          (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);
          (REST.apiCal as jest.Mock).mockResolvedValueOnce({}); // Resolve with a successful response
        
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
          (REST.apiCal as jest.Mock).mockResolvedValueOnce({});
        
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
         * This block sets up the test environment for the `vote` function by mocking the `userService` and `index` modules, and resetting all mocks before each test.
         */
        jest.mock('../services/userService');
        jest.mock('../services/index');
        
        describe('vote function', () => {
          beforeEach(() => {
            jest.resetAllMocks();
          });
        
          /**
           * Tests that the `vote` function correctly handles a case where `getUserId` returns `undefined`.
           *
           * @param request - An object with an `id` property of type string.
           * @returns A promise that rejects with an error indicating that the user session ID was not found.
           */
          it('should handle getUserId returning undefined', async () => {
            (getUserId as jest.Mock).mockResolvedValue(undefined);
        
            const request = { id: 'recording-123' };
            await expect(vote(request, 'up')).rejects.toThrow('User session ID not found');
          });
        
          /**
           * Tests that the `vote` function correctly handles a case where the `REST.apiCal` function throws a non-Error value.
           *
           * @param request - An object with an `id` property of type string.
           * @returns A promise that rejects with the value thrown by `REST.apiCal`.
           */
          it('should handle REST.apiCal throwing a non-Error', async () => {
            (getUserId as jest.Mock).mockResolvedValue('user-123');
            (REST.apiCal as jest.Mock).mockRejectedValue('API error');
        
            const request = { id: 'recording-123' };
            await expect(vote(request, 'up')).rejects.toEqual('API error');
          });
        });
    
        /**
         * Resets all mocks before each test in the 'vote function' test suite.
         */
        describe('vote function', () => {
            beforeEach(() => {
              jest.resetAllMocks();
            });
          
            /**
             * Tests that the `vote` function correctly handles a successful vote up request with a string ID.
             *
             * @param request - An object with an `id` property of type string.
             * @returns A promise that resolves with the successful response from the API call.
             */
            it('should successfully vote up with string id', async () => {
              (getUserId as jest.Mock).mockResolvedValue('user-123');
              (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });
          
              const request = { id: 'recording-456' };
              const result = await vote(request, 'up');
          
              expect(result).toEqual({ success: true });
              expect(getUserId).toHaveBeenCalledTimes(1);
              expect(REST.apiCal).toHaveBeenCalledWith({
                url: ENDPOINT.VoteRecord,
                method: 'POST',
                body: expect.objectContaining({
                  usersessionid: 'user-123',
                  sequenceid: 'recording-456',
                  upvote: 1,
                  downvote: 0,
                }),
              });
            });
        });    