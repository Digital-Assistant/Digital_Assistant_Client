
import { fetchDomain } from '../fetchDomain';

// Mock the parse-domain library
jest.mock('parse-domain', () => ({
  parseDomain: jest.fn((host: string) => {
    if (host === 'localhost' || host === '127.0.0.1') {
      return {
        type: 'Reserved', // Use 'Reserved' for localhost and IP addresses
        hostname: host,
      };
    } else if (host.includes('.')) {
      const parts = host.split('.');
      const domain = parts[parts.length - 2];
      const topLevelDomains = [parts[parts.length - 1]];
      return {
        type: 'Listed',
        domain,
        topLevelDomains,
      };
    }
    return {
      type: 'NotListed',
      hostname: host,
    };
  }),
  ParseResultType: {
    Listed: 'Listed',
    Reserved: 'Reserved',
    NotListed: 'NotListed',
  },
}));


describe('fetchDomain', () => {
  const originalLocation = window.location;
  const originalUDAGlobalConfig = window.UDAGlobalConfig;

  beforeAll(() => {
    // Mock UDAGlobalConfig for all tests that expect domain parsing
    Object.defineProperty(window, 'UDAGlobalConfig', {
      value: {
        enableForAllDomains: true,
      },
      writable: true,
    });
  });

  afterAll(() => {
    // Restore original UDAGlobalConfig
    Object.defineProperty(window, 'UDAGlobalConfig', {
      value: originalUDAGlobalConfig,
      writable: true,
    });
  });

  afterEach(() => {
    // Restore original window.location after each test
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('should fetch a simple domain', () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        host: 'example.com',
      },
      writable: true,
    });
    const domain = fetchDomain();
    expect(domain).toBe('example.com');
  });

  it('should fetch a domain with www', () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        host: 'www.example.com',
      },
      writable: true,
    });
    const domain = fetchDomain();
    expect(domain).toBe('example.com');
  });

  it('should fetch a subdomain', () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        host: 'sub.example.com',
      },
      writable: true,
    });
    const domain = fetchDomain();
    expect(domain).toBe('example.com');
  });

  it('should handle localhost', () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        host: 'localhost',
      },
      writable: true,
    });
    const domain = fetchDomain();
    expect(domain).toBe('localhost');
  });

  it('should handle IP addresses', () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        host: '127.0.0.1',
      },
      writable: true,
    });
    const domain = fetchDomain();
    expect(domain).toBe('127.0.0.1');
  });
});
