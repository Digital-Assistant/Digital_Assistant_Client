import { vote, getVoteRecord } from '../UserVote';
import { getUserId } from '../userService';
import { apiClient } from '../index';
import { ENDPOINT } from '../../config/endpoints';

jest.mock('../userService');
// Mock the apiClient from the correct module (`services/index.ts`)
jest.mock('../index', () => ({
    ...jest.requireActual('../index'),
    apiClient: {
        post: jest.fn(),
        get: jest.fn(),
    },
}));

describe('UserVote Service', () => {
    const mockUserId = 'test-user-id';
    const mockRequestId = 'test-request-id';
    const apiError = new Error('API Error');

    beforeEach(() => {
        // Reset mocks before each test
        (apiClient.post as jest.Mock).mockClear();
        (apiClient.get as jest.Mock).mockClear();
        (getUserId as jest.Mock).mockClear();

        // Default successful mock implementations
        (getUserId as jest.Mock).mockResolvedValue(mockUserId);
        (apiClient.post as jest.Mock).mockResolvedValue({ success: true });
        (apiClient.get as jest.Mock).mockResolvedValue({ success: true });
    });

    describe('vote', () => {
        it('should throw an error if user session ID is not found', async () => {
            (getUserId as jest.Mock).mockResolvedValue(null);
            await expect(vote({ id: mockRequestId }, 'up')).rejects.toThrow('User session ID not found');
        });

        it('should throw an error for an invalid request', async () => {
            await expect(vote(null, 'up')).rejects.toThrow('Invalid request: missing id');
        });

        it('should throw an error for an invalid vote type', async () => {
            await expect(vote({ id: mockRequestId }, 'invalid-type')).rejects.toThrow('Invalid vote type');
        });

        it('should call apiClient.post with correct parameters for an upvote', async () => {
            await vote({ id: mockRequestId }, 'up');
            expect(apiClient.post).toHaveBeenCalledWith(ENDPOINT.VoteRecord, {
                usersessionid: mockUserId,
                sequenceid: mockRequestId,
                upvote: 1,
                downvote: 0,
            });
        });

        it('should call apiClient.post with correct parameters for a downvote', async () => {
            await vote({ id: mockRequestId }, 'down');
            expect(apiClient.post).toHaveBeenCalledWith(ENDPOINT.VoteRecord, {
                usersessionid: mockUserId,
                sequenceid: mockRequestId,
                upvote: 0,
                downvote: 1,
            });
        });

        it('should propagate an error if apiClient.post fails', async () => {
            (apiClient.post as jest.Mock).mockRejectedValue(apiError);
            await expect(vote({ id: mockRequestId }, 'up')).rejects.toThrow('API Error');
        });
    });

    describe('getVoteRecord', () => {
        it('should throw an error if user session ID is not found', async () => {
            (getUserId as jest.Mock).mockResolvedValue(null);
            await expect(getVoteRecord({ id: mockRequestId })).rejects.toThrow('User session ID not found');
        });

        it('should throw an error for an invalid request', async () => {
            await expect(getVoteRecord(null)).rejects.toThrow('Invalid request: missing id');
        });

        it('should call apiClient.get with the correct parameters', async () => {
            await getVoteRecord({ id: mockRequestId });
            expect(apiClient.get).toHaveBeenCalledWith(`${ENDPOINT.fetchVoteRecord}${mockRequestId}/${mockUserId}`);
        });

        it('should propagate an error if apiClient.get fails', async () => {
            (apiClient.get as jest.Mock).mockRejectedValue(apiError);
            await expect(getVoteRecord({ id: mockRequestId })).rejects.toThrow('API Error');
        });
    });
});
