/**
 * Jest Configuration for @digital-assistant/core
 * 
 * This configuration sets up Jest for testing TypeScript code in a browser-like environment.
 * It includes optimizations for performance and proper handling of ES modules.
 */

import type { Config } from 'jest';

const config: Config = {
    // --- Test Environment ---
    // Use jsdom to simulate a browser environment (DOM APIs available)
    testEnvironment: 'jsdom',

    // --- File Extensions ---
    // Supported file extensions for modules
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

    // --- Transformers ---
    // How to transform files before running tests
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',    // Use ts-jest for TypeScript files
        '^.+\\.(js|jsx)$': 'babel-jest', // Use babel-jest for JavaScript files
    },

    // --- Test Discovery ---
    // Patterns to find test files
    testMatch: [
        '**/src/**/__tests__/**/*.[jt]s?(x)',      // Files in __tests__ directories
        '**/src/**/?(*.)+(spec|test).[jt]s?(x)',   // Files ending with .spec or .test
    ],

    // --- Coverage Configuration ---
    // Disable coverage collection by default (use --coverage flag when needed)
    collectCoverage: false,

    // Coverage report formats
    coverageReporters: ['text', 'lcov', 'json', 'html'],

    // Where to output coverage reports
    coverageDirectory: 'coverage',

    // Paths to exclude from coverage
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/__tests__/',
        '/__mocks__/',
    ],

    // --- Setup Files ---
    // Run setup file after test environment is set up
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],

    // --- Module Mocking ---
    // Map module imports to mock implementations
    moduleNameMapper: {
        'sweetalert2': '<rootDir>/__mocks__/sweetalert2.ts',
    },

    // --- TypeScript Configuration ---
    // ts-jest specific configuration
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },

    // --- Transform Ignore Patterns ---
    // Force Jest to transform certain node_modules packages (ESM modules)
    transformIgnorePatterns: [
        '/node_modules/(?!(@so-ric/colorspace|color)/)' // Transform these packages
    ],

    // --- Performance Optimizations ---
    // Use 50% of available CPU cores for parallel test execution
    maxWorkers: '50%',

    // Enable caching for faster subsequent runs
    cache: true,
    cacheDirectory: '<rootDir>/.jest-cache',

    // --- Watch Mode Settings ---
    // Only run tests related to changed files in watch mode
    watchPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/coverage/',
    ],

    // --- Error Handling ---
    // Stop running tests after first failure (useful for debugging)
    // bail: 1, // Uncomment to enable

    // --- Verbose Output ---
    // Display individual test results
    verbose: true,
};

export default config;
