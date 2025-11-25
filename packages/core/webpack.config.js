// webpack.config.js
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    // Define a common rule for source-map-loader to avoid repetition
    const sourceMapLoaderRule = {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules\/parse-domain/, // Exclude the problematic package
    };

    return [
        // ESM build
        {
            entry: './src/index.ts',
            output: {
                path: path.resolve(__dirname, 'dist'),
                filename: 'index.esm.js',
                module: true,
                library: {type: 'module'},
                clean: true, // Clean the output directory before emit.
            },
            experiments: {outputModule: true},
            module: {
                rules: [
                    {test: /\.ts$/, use: ['ts-loader'], exclude: /node_modules/},
                    sourceMapLoaderRule, // Use the common rule
                ],
            },
            resolve: {
                extensions: ['.tsx', '.ts', '.js'],
                fallback: {
                    //fallback module dependencies
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
            devtool: isProduction ? false : 'source-map', // Changed to 'source-map'
            optimization: {
                minimize: isProduction,
                minimizer: [
                    new TerserPlugin({
                        terserOptions: {compress: {drop_console: isProduction}},
                    }),
                ],
            },
            cache: {type: 'filesystem'},
        },
        // CJS build
        {
            entry: './src/index.ts',
            output: {
                path: path.resolve(__dirname, 'dist'),
                filename: 'index.cjs.js',
                library: {type: 'commonjs2'},
                clean: true, // Clean the output directory before emit.
            },
            target: 'node',
            module: {
                rules: [
                    {test: /\.ts$/, use: ['ts-loader'], exclude: /node_modules/},
                    sourceMapLoaderRule, // Use the common rule here as well
                ],
            },
            resolve: {extensions: ['.tsx', '.ts', '.js']},
            devtool: isProduction ? false : 'source-map', // Changed to 'source-map'
            optimization: {
                minimize: isProduction,
                minimizer: [
                    new TerserPlugin({
                        terserOptions: {compress: {drop_console: isProduction}},
                    }),
                ],
            },
            cache: {type: 'filesystem'},
        },
    ];
};
