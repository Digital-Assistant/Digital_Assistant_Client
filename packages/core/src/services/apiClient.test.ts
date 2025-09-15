import { processUrlParams } from './apiClient';

// Mock axios to prevent actual HTTP client creation during testing
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }))
}));

// Mock the store to prevent Redux dependencies during testing
jest.mock('../store', () => ({
  store: {
    getState: jest.fn(() => ({
      user: {
        userSessionData: null,
        keycloakSessionData: null
      }
    }))
  }
}));

describe('apiClient', () => {
  describe('processUrlParams', () => {
    it('should replace URL parameters correctly', () => {
      const url = '/api/users/#userId#/flows/#flowId#';
      const params = { userId: '123', flowId: '456' };
      
      const result = processUrlParams(url, params);
      
      expect(result).toBe('/api/users/123/flows/456');
    });

    it('should handle missing parameters by replacing with empty string', () => {
      const url = '/api/users/#userId#/flows/#flowId#';
      const params = { userId: '123' }; // flowId missing
      
      const result = processUrlParams(url, params);
      
      expect(result).toBe('/api/users/123/flows/');
    });

    it('should handle URLs with no parameters', () => {
      const url = '/api/users/static/path';
      const params = { userId: '123' };
      
      const result = processUrlParams(url, params);
      
      expect(result).toBe('/api/users/static/path');
    });

    it('should handle empty parameters object', () => {
      const url = '/api/users/#userId#';
      const params = {};
      
      const result = processUrlParams(url, params);
      
      expect(result).toBe('/api/users/');
    });

    it('should handle complex parameter values', () => {
      const url = '/api/search/#query#';
      const params = { query: 'hello world with spaces' };
      
      const result = processUrlParams(url, params);
      
      expect(result).toBe('/api/search/hello world with spaces');
    });

    it('should handle multiple instances of the same parameter', () => {
      const url = '/api/#userId#/data/#userId#';
      const params = { userId: '123' };
      
      const result = processUrlParams(url, params);
      
      expect(result).toBe('/api/123/data/123');
    });

    it('should handle numeric parameter values', () => {
      const url = '/api/users/#userId#/page/#pageNum#';
      const params = { userId: 123, pageNum: 5 };
      
      const result = processUrlParams(url, params);
      
      expect(result).toBe('/api/users/123/page/5');
    });

    it('should handle boolean parameter values', () => {
      const url = '/api/config/#enabled#';
      const params = { enabled: true };
      
      const result = processUrlParams(url, params);
      
      expect(result).toBe('/api/config/true');
    });

    it('should handle null and undefined values', () => {
      const url = '/api/users/#userId#/optional/#optionalParam#/extra/#undefinedParam#';
      const params = { userId: '123', optionalParam: null };
      
      const result = processUrlParams(url, params);
      
      // null values are converted to "null" string, undefined values are replaced with empty string
      expect(result).toBe('/api/users/123/optional/null/extra/');
    });

    it('should handle special characters in parameter names', () => {
      const url = '/api/search/#search-term#/#filter_type#';
      const params = { 'search-term': 'test', 'filter_type': 'active' };
      
      const result = processUrlParams(url, params);
      
      expect(result).toBe('/api/search/test/active');
    });
  });

  describe('apiClient integration', () => {
    it('should be importable without throwing errors', () => {
      expect(() => {
        const { apiClient } = require('./apiClient');
        expect(apiClient).toBeDefined();
      }).not.toThrow();
    });

    it('should export processUrlParams function', () => {
      expect(processUrlParams).toBeDefined();
      expect(typeof processUrlParams).toBe('function');
    });
  });

  describe('authentication integration test', () => {
    beforeEach(() => {
      // Clear module cache to get fresh imports
      jest.clearAllMocks();
    });

    it('should handle store access without errors', () => {
      // This test ensures that the apiClient can be created and doesn't throw
      // when accessing the store during interceptor setup
      expect(() => {
        // Force re-import to trigger interceptor setup
        delete require.cache[require.resolve('./apiClient')];
        const { apiClient } = require('./apiClient');
        expect(apiClient).toBeDefined();
      }).not.toThrow();
    });
  });
});
