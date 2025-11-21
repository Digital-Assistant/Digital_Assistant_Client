
import { fetchDomain } from '../fetchDomain';

describe('fetchDomain', () => {
  const originalHostname = window.location.hostname;

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        hostname: originalHostname,
      },
      writable: true,
    });
  });

  it('should fetch a simple domain', () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        hostname: 'example.com',
      },
      writable: true,
    });
    const domain = fetchDomain();
    expect(domain).toBe('example.com');
  });

  it('should fetch a domain with www', () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        hostname: 'www.example.com',
      },
      writable: true,
    });
    const domain = fetchDomain();
    expect(domain).toBe('example.com');
  });

  it('should fetch a subdomain', () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        hostname: 'sub.example.com',
      },
      writable: true,
    });
    const domain = fetchDomain();
    expect(domain).toBe('example.com');
  });

  it('should handle localhost', () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        hostname: 'localhost',
      },
      writable: true,
    });
    const domain = fetchDomain();
    expect(domain).toBe('localhost');
  });

  it('should handle IP addresses', () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        hostname: '127.0.0.1',
      },
      writable: true,
    });
    const domain = fetchDomain();
    expect(domain).toBe('127.0.0.1');
  });
});
