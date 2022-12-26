/**
 * Author: Lakshman Veti
 * Webpack configuration
 */

/**
 * At its core, webpack is a static module bundler for modern JavaScript applications. When webpack processes your application,
 * it internally builds a dependency graph from one or more entry points and then combines every module your project needs into
 * one or more bundles, which are static assets to serve your content from.
 */

const path = require('path');
const webpack = require('webpack')
const CopyPlugin = require("copy-webpack-plugin");
const transform = require("typescript-json/lib/transform").default;
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {

    // reduce it to a nice object, the same as before

    const envFile = './environments/'+((env.build) ? `${env.build}.env` : 'local.env');

    const buildPath = (env.build && env.build == 'production') ? 'dist' : 'build';
    console.log(buildPath);

    const webpackConfig = {

        entry: {
            // string | object | array
            // defaults to ./src
            // Here the application starts executing
            // and webpack starts bundling
            'UdanHeaders': './src/Headers.js',
            'UdanSDK': './src/index.tsx',
        },
        mode: 'development',// "production" | "development" | "none"
        devtool: 'cheap-module-source-map',// enum
        // mode: 'production',

        // enhance debugging by adding meta info for the browser devtools
        // source-map most detailed at the expense of build speed.
        /*devtool: 'source-map',
        devServer: {
            watchContentBase: true,
            contentBase: path.resolve(__dirname, 'dist'),
            port: 9000
        },*/

        watch: false,

        watchOptions: {
            ignored: '/node_modules/',
        },

        module: {
            // configuration regarding modules
            rules: [
                // rules for modules (configure loaders, parser options, etc.)
                {
                    // Conditions:
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader', // the loader which should be applied, it'll be resolved relative to the context
                    options: {presets: ['@babel/env', '@babel/preset-react']},  // options for the loader
                },
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    loader: 'ts-loader',
                    options: {
                        getCustomTransformers: program => ({
                            before: [transform(program)]
                        })
                    }
                },
                {
                    // Conditions:
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']  // When multiple loader configuration needed
                },
                {
                    // Conditions:
                    test: /\.s(a|c)ss$/,
                    exclude: /node_modules/,
                    use: [
                        // When multiple loader configuration needed
                        /* {
                             loader: 'file-loader',
                             options: {name: '[name].min.css'}
                         },*/
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                    // More information here https://webpack.js.org/guides/asset-modules/
                    type: "asset",
                },
                {
                    // Conditions:
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    use: [{
                        // When multiple loader configuration needed
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/'
                        }
                    }]
                },
                {
                    test: /\.svg$/,
                    exclude: /node_modules/,
                    use: {
                        // When multiple loader configuration needed
                        loader: 'svg-url-loader',
                        options: {name: '[name].svg'}
                    }
                }
            ],
        },
        plugins: [
            // list of additional plugins
            new webpack.ProvidePlugin({
                process: 'process/browser',
                Buffer: ['buffer', 'Buffer']
            }),
            /*new webpack.ProvidePlugin({
                'utils': 'utils'
            }),*/
            new CopyPlugin({
                patterns: [
                    {from: 'src/logo.*', to: "../[name][ext]"},
                ],
            }),
            new webpack.DefinePlugin({
                "process.env": JSON.stringify(process.env)
            }),
            new Dotenv({
                path: `${envFile}`,
                safe: true,
                allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
                systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
                silent: true, // hide any errors
                defaults: false,
                ignoreStub: true,
            }),
        ],
        resolve: {
            // options for resolving module requests
            // (does not apply to resolving of loaders)
            extensions: ['.tsx', '.ts', '.js', '.css', '.scss'], // extensions that are used
            modules: ['./node_modules'], // directories where to look for modules (in order)
            alias: {
                // a list of module name aliases
                // aliases are imported relative to the current context
                process: "process/browser",
                utils: path.resolve(__dirname, './src/config/index')
            },
            fallback: { //fallback module dependencies
                "fs": false,
                "http": require.resolve("stream-http"),
                "https": require.resolve("https-browserify"),
                "stream": require.resolve("stream-browserify"),
                "zlib": require.resolve("browserify-zlib"),
                "buffer": require.resolve("buffer/"),
                "path": require.resolve("path-browserify"),
                "os": require.resolve("os-browserify/browser"),
                "assert": require.resolve("assert/")
            }
        },
        output: {
            // options related to how webpack emits results
            publicPath: '',
            filename: '[name].js', // the filename template for entry chunks
            library: 'UdanLibrary',
            libraryTarget: 'var',
            path: path.resolve(__dirname, buildPath+'/assets'),  // the target directory for all output files
            // must be an absolute path (use the Node.js path module)
            clean: true
        },
    };

    return webpackConfig;
}
