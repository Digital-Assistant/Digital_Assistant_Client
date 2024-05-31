import type {Config} from 'jest';

const config: Config = {
    preset: 'ts-jest',
    // testMatch: ['**/*.test.ts?(x)'],
    // testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    // rootDir: '<rootDir>/src',
    verbose: true,
    "transformIgnorePatterns": [
        "node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"
    ],
    "transform": {
        "^.+\\.(ts|tsx|js|jsx)$": "ts-jest"
    },
    "testEnvironment": "node",
    // add jest dependency resolver for domjson
    "moduleNameMapper": {
        '^domjson': '<rootDir>/node_modules/domjson/dist/domJSON.js',
        // '^dmoJSON': '<rootDir>/node_modules/domjson/dist/domJSON.js'
    }
};

export default config;
