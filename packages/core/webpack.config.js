// webpack.config.js
/**
 * Webpack Configuration for @digital-assistant/core
 *
 * This configuration handles building the library for both ESM (ECMAScript Modules)
 * and CJS (CommonJS) targets. It includes optimizations for build speed and
 * debugging experience.
 */

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const pkg = require('./package.json');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    // Determine environment file path based on build environment
    const envFile = './environments/' + (env && env.build ? `${env.build}.env` : 'local.env');

    /**
     * Externals Configuration
     *
     * We only externalize `peerDependencies` (e.g., react, axios) to avoid bundling them.
     * Regular `dependencies` (including polyfills like stream-browserify) are BUNDLED
     * to ensure the library works "out of the box" in browser environments without
     * requiring the host application to provide node polyfills.
     */
    const externals = [
        ...Object.keys(pkg.peerDependencies || {}),
    ].reduce((acc, key) => {
        acc[key] = key;
        return acc;
    }, {});

    /**
     * Common Configuration
     * Shared settings between ESM and CJS builds.
     */
    const commonConfig = {
        mode: argv.mode,
        // Use 'inline-source-map' for development to embed maps directly in the file.
        // This ensures the host application can always find the source map.
        devtool: isProduction ? false : 'inline-source-map',
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            // Polyfills for Node.js core modules required by some dependencies
            fallback: {
                fs: false,
                http: require.resolve("stream-http"),
                https: require.resolve("https-browserify"),
                stream: require.resolve("stream-browserify"),
                zlib: require.resolve("browserify-zlib"),
                buffer: require.resolve("buffer/"),
                path: require.resolve("path-browserify"),
                os: require.resolve("os-browserify/browser"),
                assert: require.resolve("assert/"),
                "process/browser": require.resolve("process/browser")
            },
        },
        module: {
            rules: [
                // TypeScript Loader
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                // transpileOnly: true speeds up build by skipping type checking
                                // Type checking is handled by ForkTsCheckerWebpackPlugin
                                // DISABLED for debugging: transpileOnly can interfere with source maps
                                transpileOnly: false,
                                compilerOptions: {
                                    sourceMap: true,
                                }
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
                // Source Map Loader
                // Extracts source maps from existing library files (node_modules)
                {
                    test: /\.js$/,
                    enforce: 'pre',
                    use: ['source-map-loader'],
                    exclude: /node_modules\/parse-domain/, // Exclude problematic packages
                },
                // Handle domjson legacy dependency (implicit `this`)
                {
                    test: require.resolve('domjson'),
                    loader: 'imports-loader',
                    options: {
                        wrapper: 'window',
                    },
                },
            ],
        },
        plugins: [
            // Provide global variables for browser environments
            new webpack.ProvidePlugin({
                process: 'process/browser',
            }),
            // Run type checking in a separate process for faster builds
            new ForkTsCheckerWebpackPlugin(),
            // Load environment variables from .env files
            new Dotenv({
                path: `${envFile}`,
                safe: true,
                allowEmptyValues: true,
                systemvars: false,
                silent: true,
                defaults: false,
                ignoreStub: true,
            }),
        ],
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: { compress: { drop_console: isProduction } },
                }),
            ],
        },
        // Use filesystem cache for faster rebuilds
        cache: { type: 'filesystem' },
        externals,
    };

    /**
     * ESM Build Configuration
     * Output: dist/index.esm.js
     * Format: Module (ESM)
     */
    const esmConfig = {
        ...commonConfig,
        entry: './src/index.ts',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.esm.js',
            module: true,
            library: { type: 'module' },
            // clean: false to prevent deleting CJS build if running in parallel/sequence
            clean: false,
            // Ensure unique file paths in debugger (e.g. webpack://@digital-assistant/core/src/index.ts)
            devtoolModuleFilenameTemplate: info => {
                return `webpack://@digital-assistant/core/${info.resourcePath.replace(/^\.\//, '')}`;
            },
        },
        experiments: { outputModule: true },
    };

    /**
     * CJS Build Configuration
     * Output: dist/index.cjs.js
     * Format: CommonJS
     */
    const cjsConfig = {
        ...commonConfig,
        entry: './src/index.ts',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.cjs.js',
            library: { type: 'commonjs' },
            clean: false,
            devtoolModuleFilenameTemplate: info => {
                return `webpack://@digital-assistant/core/${info.resourcePath.replace(/^\.\//, '')}`;
            },
        },
    };

    return [esmConfig, cjsConfig];
};
