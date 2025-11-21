// Global Jest setup for packages/core
// Mock winston for all tests to avoid ESM/CJS parsing issues and keep tests deterministic.

const logger = {
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};

// IMPORTANT: Mock winston before any imports that might use it
jest.mock('winston', () => ({
  format: {
    colorize: jest.fn(),
    combine: jest.fn(),
    label: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
    json: jest.fn(),
  },
  createLogger: jest.fn().mockReturnValue(logger),
  transports: {
    Console: jest.fn(),
    Http: jest.fn(),
  },
}));

// Mock parse-domain (ESM-only package) globally to avoid ESM import errors under Jest CJS env
// Provide a minimal API surface used by the code/tests
jest.mock('parse-domain', () => {
  const ParseResultType = {
    Listed: 'LISTED',
    NotListed: 'NOT_LISTED',
    Reserved: 'RESERVED',
    Unknown: 'UNKNOWN',
    Icann: 'ICANN',
    Private: 'PRIVATE',
  } as const;

  const parseDomain = jest.fn((_input: string | URL) => ({
    type: ParseResultType.Listed,
    domain: 'example',
    topLevelDomains: ['com'],
    subDomains: [],
  }));

  return {
    __esModule: true,
    ParseResultType,
    parseDomain,
  };
});

// Minimal globals expected by some browser utilities
(window as any).UDAGlobalConfig = (window as any).UDAGlobalConfig || { enableOverlay: false };
(window as any).udaSpecialNodes = (window as any).udaSpecialNodes || {};

// Common no-op polyfills to avoid errors in jsdom when tests touch these APIs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Element.prototype as any).scrollTo = (Element.prototype as any).scrollTo || jest.fn();

export {};
