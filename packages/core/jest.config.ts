import type {Config} from 'jest';

const config: Config = {
    // preset: 'ts-jest', // Removed preset to allow explicit transform configuration
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest', // Explicitly define ts-jest transformer
        '^.+\\.(js|jsx)$': 'babel-jest', // Rely on Babel's config discovery
    },
    testMatch: ['**/src/**/__tests__/**/*.[jt]s?(x)', '**/src/**/?(*.)+(spec|test).[jt]s?(x)'],
    collectCoverage: true,
    coverageReporters: ['text', 'lcov', 'json', 'html'],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
    ],
    setupFilesAfterEnv: [],
    moduleNameMapper: {
        // Handle module aliases if any
    },
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(@so-ric/colorspace|color)/)' // Ensure these are NOT ignored
    ],
};

export default config;
