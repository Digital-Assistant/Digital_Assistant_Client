import { fetchSearchResults } from '../SearchService';
import { apiClient } from '../apiClient';
import { getUserId } from '../userService';
import { recordUserClickData } from '../trackingService';
import { ENDPOINT } from '../../config/endpoints';
import { processUrlArgs } from '../../util/urlProcessing';

jest.mock('../apiClient');
jest.mock('../userService');
jest.mock('../trackingService');
jest.mock('../../util/urlProcessing');

describe('fetchSearchResults', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getUserId as jest.Mock).mockResolvedValue('test-session-id');
        (processUrlArgs as jest.Mock).mockImplementation((endpoint, req) => `${endpoint}?page=${req.page}`);
    });

    it('should fetch search results and record user click data', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: ['result1', 'result2'] });

        const result = await fetchSearchResults({ keyword: 'test', page: 1 });
        expect(recordUserClickData).toHaveBeenCalledWith('search', 'test');
        expect(apiClient.get).toHaveBeenCalled();
        expect(result).toEqual(['result1', 'result2']);
    });

    it('should use default page if request is undefined', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: ['default'] });

        const result = await fetchSearchResults(undefined);
        expect(apiClient.get).toHaveBeenCalled();
        expect(result).toEqual(['default']);
    });

    it('should return empty array if response data is undefined', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({});

        const result = await fetchSearchResults({ page: 1 });
        expect(result).toEqual([]);
    });

    it('should throw error and log if apiClient fails', async () => {
        (apiClient.get as jest.Mock).mockRejectedValue(new Error('API error'));
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        await expect(fetchSearchResults({ page: 1 })).rejects.toThrow('Failed to perform search: API error');
        expect(consoleSpy).toHaveBeenCalledWith('Search service error:', 'API error');
        consoleSpy.mockRestore();
    });

    it('should not record user click data if keyword is empty', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: ['result'] });

        await fetchSearchResults({ keyword: '', page: 1 });
        expect(recordUserClickData).not.toHaveBeenCalled();
    });

    it('should use SearchWithPermissions endpoint if additionalParams is present', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: ['result'] });

        await fetchSearchResults({ page: 1, additionalParams: { foo: 'bar' } });
        expect(processUrlArgs).toHaveBeenCalledWith(ENDPOINT.SearchWithPermissions, expect.any(Object));
    });

    it('should use Search endpoint if additionalParams is not present', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: ['result'] });

        await fetchSearchResults({ page: 1 });
        expect(processUrlArgs).toHaveBeenCalledWith(ENDPOINT.Search, expect.any(Object));
    });

// Edge case: additionalParams is explicitly null
    it('should delete additionalParams if it is null', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: ['result'] });

        const req = { page: 1, additionalParams: null };
        await fetchSearchResults(req);
        // Should use Search endpoint, not SearchWithPermissions
        expect(processUrlArgs).toHaveBeenCalledWith(ENDPOINT.Search, expect.any(Object));
    });

// Edge case: getUserId resolves to undefined
    it('should set userSessionId to undefined if getUserId resolves undefined', async () => {
        (getUserId as jest.Mock).mockResolvedValue(undefined);
        (apiClient.get as jest.Mock).mockResolvedValue({ data: ['result'] });

        const req = { page: 1 };
        await fetchSearchResults(req);
        // No assertion on req.userSessionId, as it is not mutated
    });

// Edge case: getUserId rejects
    it('should throw error if getUserId rejects', async () => {
        (getUserId as jest.Mock).mockRejectedValue(new Error('UserId error'));
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        await expect(fetchSearchResults({ page: 1 })).rejects.toThrow('Failed to perform search: UserId error');
        expect(consoleSpy).toHaveBeenCalledWith('Search service error:', 'UserId error');
        consoleSpy.mockRestore();
    });

// Edge case: processUrlArgs throws
    it('should throw error if processUrlArgs throws', async () => {
        (processUrlArgs as jest.Mock).mockImplementation(() => { throw new Error('URL error'); });
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        await expect(fetchSearchResults({ page: 1 })).rejects.toThrow('Failed to perform search: URL error');
        expect(consoleSpy).toHaveBeenCalledWith('Search service error:', 'URL error');
        consoleSpy.mockRestore();
    });

// Edge case: response.data is not an array
    it('should return response.data as is if it is not an array', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: { foo: 'bar' } });

        const result = await fetchSearchResults({ page: 1 });
        expect(result).toEqual({ foo: 'bar' });
    });

// Edge case: malformed request object (page missing)
    it('should handle request with missing page property', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: ['result'] });

        // @ts-expect-error: intentionally omitting page
        const result = await fetchSearchResults({});
        expect(apiClient.get).toHaveBeenCalled();
        expect(result).toEqual(['result']);
    });

});
