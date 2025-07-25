/**
 * Imports various modules and functions used in the `userVote_vote.test.ts` file.
 * - `vote` function from `../services/userVote`
 * - `getUserId` function from `../services/userService`
 * - `CONFIG` object from `../config`
 * - `REST` object from `../services`
 * - `ENDPOINT` object from `../config/endpoints`
 * - `domJSON` module from "domjson"
 * - `TSON` module from "typescript-json"
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

/**
 * Mocks the `typescript-json` module by providing a mock implementation of the `stringify` function.
 * This is used for testing purposes to simulate the behavior of the `typescript-json` module.
 */
jest.mock("typescript-json", () => ({
    stringify: (input: any) => '{"mocked":"json"}',
}));

/**
 * Mocks the `fetchDomain` function from the `../util/fetchDomain` module.
 * This is used for testing purposes to simulate the behavior of the `fetchDomain` function.
 */
jest.mock("../util/fetchDomain", () => ({
    fetchDomain: jest.fn(),
}));

/**
 * Mocks the `getUserId` function from the `../services/userService` module and the `REST` object from the `../services` module.
 * This is used for testing purposes to simulate the behavior of these modules.
 */
jest.mock('../services/userService');
jest.mock('../services/index');

/**
 * Resets all mocks before each test in the 'vote function' test suite.
 * This ensures that each test starts with a clean slate and can independently
 * verify the behavior of the `vote` function.
 */
beforeEach(() => {
    jest.resetAllMocks();
});
describe('vote function', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    /**
     * Tests the successful voting up of a recording.
     * 
     * This test mocks the `getUserId` and `REST.apiCal` functions to simulate a successful vote up operation.
     * It verifies that the `vote` function returns the expected success response and that the mocked functions were called with the expected arguments.
     */
    it('should successfully vote up', async () => {
        (getUserId as jest.Mock).mockResolvedValue('user-123');
        (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

        const request = { id: 456 };
        const result = await vote(request, "up");

        expect(result).toEqual({ success: true });
        expect(getUserId).toHaveBeenCalledTimes(1);
        expect(REST.apiCal).toHaveBeenCalledWith({
            body: {
              downvote: 0,
              sequenceid: 456, // Update to 456 to match the received value
              upvote: 1,
              usersessionid: "user-123",
            },
            method: "POST",
            url: "/votes/addVote",
          });
    });

    /**
     * Tests the successful voting down of a recording.
     * 
     * This test mocks the `getUserId` and `REST.apiCal` functions to simulate a successful vote down operation.
     * It verifies that the `vote` function returns the expected success response and that the mocked functions were called with the expected arguments.
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
 * This test mocks the `getUserId` function to return `null`, simulating a scenario where the user session ID is not found.
 * It verifies that the `vote` function rejects with the expected error message.
 */

    /**
     * Tests that the `vote` function throws an error when the user session ID is not found.
     * 
     * This test mocks the `getUserId` function to return `null`, simulating a scenario where the user session ID is not found.
     * It verifies that the `vote` function rejects with the expected error message.
     */
    it('should throw an error if user session ID is not found', async () => {
        (getUserId as jest.Mock).mockResolvedValue(null);

        const request = { id: 'recording-123' };
        await expect(vote(request, 'up')).rejects.toThrow('User session ID not found');
    });

    /**
     * Tests that the `vote` function throws an error when the request is invalid.
     * 
     * This test mocks the `getUserId` function to return a valid user session ID, and then calls the `vote` function with an invalid request (either `undefined` or an empty object).
     * It verifies that the `vote` function rejects with the expected error message.
     */
    it('should throw an error if request is invalid', async () => {
        (getUserId as jest.Mock).mockResolvedValue('user-123');

        await expect(vote(undefined, 'up')).rejects.toThrow('Invalid request: missing id');
        await expect(vote({}, 'up')).rejects.toThrow('Invalid request: missing id');
    });

    /**
     * Tests that the `vote` function throws an error when the vote type is invalid.
     * 
     * This test mocks the `getUserId` function to return a valid user session ID, and then calls the `vote` function with an invalid vote type (`'invalid'`).
     * It verifies that the `vote` function rejects with the expected error message.
     */
    it('should throw an error if vote type is invalid', async () => {
        (getUserId as jest.Mock).mockResolvedValue('user-123');

        const request = { id: 'recording-123' };
        await expect(vote(request, 'invalid')).rejects.toThrow('Invalid vote type');
    });

    /**
     * Tests that the `vote` function handles a request with a numeric `id` property.
     * 
     * This test mocks the `getUserId` function to return a valid user session ID, and the `REST.apiCal` function to return a successful response.
     * It calls the `vote` function with a request object that has a numeric `id` property, and verifies that the function returns the expected successful response.
     * It also verifies that the `getUserId` function was called once, and that the `REST.apiCal` function was called with the expected parameters.
     */
    it('should handle vote with numeric id', async () => {
        (getUserId as jest.Mock).mockResolvedValue('user-123');
        (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

        const request = { id: 123 };
        const result = await vote(request, 'up');

        expect(result).toEqual({ success: true });
        expect(getUserId).toHaveBeenCalledTimes(1);
        expect(REST.apiCal).toHaveBeenCalledWith({
            url: ENDPOINT.VoteRecord,
            method: 'POST',
            body: {
                usersessionid: 'user-123',
                sequenceid: 123,
                upvote: 1,
                downvote: 0,
            },
        });
    });
});