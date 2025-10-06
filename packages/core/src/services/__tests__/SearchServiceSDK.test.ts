import { SearchService, createSearchService, createSearchServiceFunctions, type SearchServiceDependencies } from '../SearchService';

describe('SearchService SDK with Dependency Injection', () => {
  let searchService: SearchService;
  let mockDependencies: SearchServiceDependencies;

  beforeEach(() => {
    // Create mock dependencies
    mockDependencies = {
      httpClient: {
        get: jest.fn(),
        post: jest.fn()
      },
      userService: {
        getUserSessionId: jest.fn().mockResolvedValue('test-session-id')
      },
      trackingService: {
        recordUserClickData: jest.fn().mockResolvedValue(true)
      }
    };
    
    // Create SearchService with mocked dependencies
    searchService = createSearchService(mockDependencies);
  });

  describe('Dependency Injection', () => {
    it('should create SearchService with dependencies', () => {
      expect(searchService).toBeInstanceOf(SearchService);
    });

    it('should create functional interface with dependencies', () => {
      const functions = createSearchServiceFunctions(mockDependencies);
      
      expect(functions.fetchSearchResults).toBeDefined();
      expect(functions.fetchRecord).toBeDefined();
      expect(functions.fetchSpecialNodes).toBeDefined();
      expect(functions.service).toBeInstanceOf(SearchService);
    });
  });

  describe('fetchSearchResults', () => {
    it('should use injected dependencies for search', async () => {
      const mockResponse: any[] = [{ id: 1, title: 'Test Result' }];
      (mockDependencies.httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const request = {
        keyword: 'test',
        page: 1,
        domain: 'test.com'
      };

      const result = await searchService.fetchSearchResults(request);

      expect(result).toEqual(mockResponse);
      expect(mockDependencies.trackingService.recordUserClickData).toHaveBeenCalledWith('search', 'test');
      expect(mockDependencies.httpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/search/all')
      );
    });

    it('should not call tracking when no keyword provided', async () => {
      const mockResponse: any[] = [];
      (mockDependencies.httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const request = { page: 1, domain: 'test.com' };

      await searchService.fetchSearchResults(request);

      expect(mockDependencies.trackingService.recordUserClickData).not.toHaveBeenCalled();
      expect(mockDependencies.httpClient.get).toHaveBeenCalled();
    });
  });

  describe('fetchRecord', () => {
    it('should use injected dependencies for record fetch', async () => {
      const mockResponse = { id: 1, title: 'Test Record' };
      (mockDependencies.httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const request = {
        id: '1',
        domain: 'test.com'
      };

      const result = await searchService.fetchRecord(request);

      expect(result).toEqual(mockResponse);
      expect(mockDependencies.httpClient.get).toHaveBeenCalledWith('/search/1?domain=test.com');
    });
  });

  describe('fetchSpecialNodes', () => {
    it('should return special nodes configuration', async () => {
      const result = await searchService.fetchSpecialNodes();

      expect(result).toBeDefined();
      expect(result.include).toBeDefined();
      expect(result.exclude).toBeDefined();
    });
  });

  describe('Framework Agnostic Design', () => {
    it('should work with different HTTP client implementations', async () => {
      // Simulate different framework HTTP clients
      const axiosDeps: SearchServiceDependencies = {
        httpClient: {
          get: jest.fn().mockResolvedValue({ data: 'axios-response' }),
          post: jest.fn()
        },
        userService: { getUserSessionId: jest.fn().mockReturnValue('axios-user') },
        trackingService: { recordUserClickData: jest.fn() }
      };

      const fetchDeps: SearchServiceDependencies = {
        httpClient: {
          get: jest.fn().mockResolvedValue('fetch-response'),
          post: jest.fn()
        },
        userService: { getUserSessionId: jest.fn().mockReturnValue('fetch-user') },
        trackingService: { recordUserClickData: jest.fn() }
      };

      const axiosService = createSearchService(axiosDeps);
      const fetchService = createSearchService(fetchDeps);

      await axiosService.fetchSearchResults({ page: 1 });
      await fetchService.fetchSearchResults({ page: 1 });

      expect(axiosDeps.httpClient.get).toHaveBeenCalled();
      expect(fetchDeps.httpClient.get).toHaveBeenCalled();
    });
  });
});
