/**
 * Imports various modules and functions used in the `userVote_getVoteRecord.test.ts` file.
 * - `vote` from `../services/userVote`
 * - `CONFIG` from `../config`
 * - `REST` from `../services`
 * - `ENDPOINT` from `../config/endpoints`
 * - `getVoteRecord` from `../services/userVote`
 * - `getUserId` from `../services/userService`
 * - `domJSON` from "domjson"
 * - `TSON` from "typescript-json"
 */
import { vote } from '../services/userVote';
import { CONFIG } from '../config';
import { REST } from '../services';
import { ENDPOINT } from '../config/endpoints';
import { getVoteRecord } from '../services/userVote';
import { getUserId } from '../services/userService';
import domJSON from "domjson";
import TSON from "typescript-json";

/**
 * Mocks the `domjson` module by providing a mock implementation for the `toJSON` function.
 * This is likely used for testing purposes, to simulate the behavior of the `domjson` module without
 * actually using the real implementation.
 */
jest.mock("domjson", () => ({
  toJSON: jest.fn(),
}));

/**
 * Mocks the `typescript-json` module by providing a mock implementation for the `stringify` function.
 * This is likely used for testing purposes, to simulate the behavior of the `typescript-json` module without
 * actually using the real implementation.
 */
jest.mock("typescript-json", () => ({
  stringify: (input: any) => '{"mocked":"json"}',
}));

/**
 * Mocks the `fetchDomain` function from the `../util/fetchDomain` module.
 * This is likely used for testing purposes, to simulate the behavior of the `fetchDomain` function without
 * actually using the real implementation.
 */
jest.mock("../util/fetchDomain", () => ({
  fetchDomain: jest.fn(),
}));

/**
 * Mocks the `getUserId` function from the `../services/userService` module.
 * This is likely used for testing purposes, to simulate the behavior of the `getUserId` function without
 * actually using the real implementation.
 */
jest.mock('../services/userService');
jest.mock('../services/index');

/**
 * Clears all mocks before each test in the `getVoteRecord` test suite.
 * This ensures that each test starts with a clean slate, without any
 * mock state or behavior carried over from previous tests.
 */
describe('getVoteRecord', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests that the `getVoteRecord` function handles errors from the `getUserId` function.
   * This test case ensures that if the `getUserId` function throws an error, the `getVoteRecord`
   * function correctly propagates the error and rejects the promise.
   */
  it('should handle errors from getUserId', async () => {
    (getUserId as jest.Mock).mockRejectedValue(new Error('User ID error'));
    await expect(getVoteRecord({ id: 'sequence123' })).rejects.toThrow('User ID error');
  });

  /**
   * Tests that the `getVoteRecord` function correctly handles errors from the `REST.apiCal` function.
   * This test case ensures that if the `REST.apiCal` function throws an error, the `getVoteRecord`
   * function correctly propagates the error and rejects the promise.
   */
  it('should handle errors from REST.apiCal', async () => {
    (getUserId as jest.Mock).mockResolvedValue('user123');
    (REST.apiCal as jest.Mock).mockRejectedValue(new Error('API error'));
    await expect(getVoteRecord({ id: 'sequence123' })).rejects.toThrow('API error');
  });

  /**
   * Tests that the `getVoteRecord` function correctly handles a null request object.
   * This test case ensures that if the `getVoteRecord` function is called with a null
   * request object, it correctly rejects the promise with an error.
   */
  it('should handle getVoteRecord with null request', async () => {
    await expect(getVoteRecord(null)).rejects.toThrow();
  });

  /**
   * Tests that the `getVoteRecord` function correctly handles a non-object request.
   * This test case ensures that if the `getVoteRecord` function is called with a non-object
   * request, it correctly rejects the promise with an error.
   */
  it('should handle getVoteRecord with non-object request', async () => {
    await expect(getVoteRecord('not an object')).rejects.toThrow();
  });

  
  /**
   * Tests that the `getVoteRecord` function correctly returns the result of the `REST.apiCal` function.
   * This test case ensures that when the `getVoteRecord` function is called with a valid request object,
   * it correctly fetches the vote record data from the API and returns it.
   *
   * @param {Object} mockRequest - The mock request object to pass to the `getVoteRecord` function.
   * @param {string} mockRequest.id - The ID of the sequence to fetch the vote record for.
   * @returns {Object} - The vote record data returned by the `REST.apiCal` function.
   */
  it('should return the result of REST.apiCal', async () => {
    const mockUserId = 'user123';
    const mockRequest = { id: 'sequence123' };
    (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);
    (REST.apiCal as jest.Mock).mockResolvedValueOnce({ voteData: 'someData' });
    
    const result = await getVoteRecord(mockRequest);
    
    expect(result).toEqual({ voteData: 'someData' });
  });


  /**
   * Tests that the `getVoteRecord` function correctly fetches the vote record data from the API.
   * This test case ensures that when the `getVoteRecord` function is called with a valid request object,
   * it correctly fetches the vote record data from the API and returns it.
   *
   * @param {Object} mockRequest - The mock request object to pass to the `getVoteRecord` function.
   * @param {string} mockRequest.id - The ID of the sequence to fetch the vote record for.
   * @returns {Object} - The vote record data returned by the `REST.apiCal` function.
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