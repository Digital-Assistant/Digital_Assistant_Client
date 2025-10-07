import { fetchSearchResults, fetchRecord, fetchSpecialNodes } from '../SearchService';
import * as apiClientModule from '../apiClient';
import * as userServiceModule from '../userService';
import * as trackingServiceModule from '../trackingService';

// Mock the modules
jest.mock('../apiClient');
jest.mock('../userService');
jest.mock('../trackingService');

describe('SearchService SDK with Direct API Client', () => {
  const mockApiClient = apiClientModule.apiClient as jest.Mocked<typeof apiClientModule.apiClient>;
  const mockGetUserId = userServiceModule.getUserId as jest.MockedFunction<typeof userServiceModule.getUserId>;
  const mockRecordUserClickData = trackingServiceModule.recordUserClickData as jest.MockedFunction<typeof trackingServiceModule.recordUserClickData>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks  
    mockGetUserId.mockResolvedValue('test-session-id');
    mockRecordUserClickData.mockResolvedValue(undefined as any);
  });

  describe('Direct Function Usage', () => {
    it('should export fetchSearchResults function', () => {
      expect(fetchSearchResults).toBeDefined();
      expect(typeof fetchSearchResults).toBe('function');
    });

    it('should export fetchRecord function', () => {
      expect(fetchRecord).toBeDefined();
      expect(typeof fetchRecord).toBe('function');
    });

    it('should export fetchSpecialNodes function', () => {
      expect(fetchSpecialNodes).toBeDefined();
      expect(typeof fetchSpecialNodes).toBe('function');
    });
  });

  describe('fetchSearchResults', () => {
    it('should use apiClient for search requests', async () => {
      const mockResponse = { 
        data: [{ id: 1, title: 'Test Result' }], 
        status: 200, 
        statusText: 'OK' 
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const request = {
        keyword: 'test',
        page: 1,
        domain: 'test.com'
      };

      const result = await fetchSearchResults(request);

      expect(result).toEqual(mockResponse.data);
      expect(mockRecordUserClickData).toHaveBeenCalledWith("search", "test");
      expect(mockGetUserId).toHaveBeenCalled();
      expect(mockApiClient.get).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      const mockResponse = { 
        data: undefined, 
        status: 200, 
        statusText: 'OK' 
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const request = {
        keyword: '',
        page: 1,
        domain: 'test.com'
      };

      const result = await fetchSearchResults(request);
      expect(result).toEqual([]);
    });

    it('should handle search errors', async () => {
      const mockError = new Error('Network error');
      mockApiClient.get.mockRejectedValue(mockError);

      const request = {
        keyword: 'test',
        page: 1,
        domain: 'test.com'
      };

      await expect(fetchSearchResults(request)).rejects.toThrow('Failed to perform search: Network error');
    });
  });

  describe('fetchRecord', () => {
    it('should fetch record with basic parameters', async () => {
      const mockResponse = { 
        data: { id: '123', title: 'Test Record' }, 
        status: 200, 
        statusText: 'OK' 
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const request = {
        id: '123',
        domain: 'test.com'
      };

      const result = await fetchRecord(request);

      expect(result).toEqual(mockResponse.data);
      expect(mockApiClient.get).toHaveBeenCalled();
    });

    it('should throw error when no request provided', async () => {
      await expect(fetchRecord()).rejects.toThrow('Request parameter is required');
    });

    it('should handle fetch record errors', async () => {
      const mockError = new Error('Record not found');
      mockApiClient.get.mockRejectedValue(mockError);

      const request = {
        id: '123',
        domain: 'test.com'
      };

      await expect(fetchRecord(request)).rejects.toThrow('Failed to fetch record: Record not found');
    });
  });

  describe('fetchSpecialNodes', () => {
    it('should return special nodes configuration', async () => {
      const result = await fetchSpecialNodes();
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('include');
      expect(result).toHaveProperty('exclude');
      expect(result).toHaveProperty('ignoreChildren');
    });

    it('should handle optional request parameter', async () => {
      const request = { someParam: 'value' };
      const result = await fetchSpecialNodes(request);
      
      expect(result).toBeDefined();
    });
  });
});
