/**
 * Jest Test Setup Configuration
 * 
 * This file runs before all tests and sets up the global test environment.
 * It configures mocks, polyfills, and global variables needed for testing.
 * 
 * @see https://jestjs.io/docs/configuration#setupfilesafterenv-array
 */

// =============================================================================
// GLOBAL MOCKS
// =============================================================================

/**
 * Mock Winston Logger
 * 
 * Winston is mocked globally to:
 * 1. Avoid ESM/CJS parsing issues in Jest's CommonJS environment
 * 2. Keep test output clean (no actual logging)
 * 3. Make tests deterministic (no side effects from logging)
 */
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

/**
 * Mock parse-domain Package
 * 
 * parse-domain is an ESM-only package that causes import errors in Jest's
 * CommonJS environment. We provide a minimal mock implementation that
 * satisfies the API surface used by our code.
 */
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

// =============================================================================
// GLOBAL VARIABLES
// =============================================================================

/**
 * UDA Global Configuration
 * 
 * Set up minimal global configuration expected by browser utilities.
 * These are typically set by the host application but need to be
 * initialized in the test environment.
 */
(window as any).UDAGlobalConfig = (window as any).UDAGlobalConfig || {
    enableOverlay: false
};

(window as any).udaSpecialNodes = (window as any).udaSpecialNodes || {};

// =============================================================================
// BROWSER API POLYFILLS
// =============================================================================

/**
 * Element.scrollTo Polyfill
 * 
 * jsdom doesn't implement scrollTo, but some tests may call it.
 * Provide a no-op mock to avoid errors.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Element.prototype as any).scrollTo = (Element.prototype as any).scrollTo || jest.fn();

// Export empty object to make this a module
export { };
