/**
 * Author: Lakshman Veti
 * Webpack configuration
 */

/**
 * At its core, webpack is a static module bundler for modern JavaScript applications. When webpack processes your application,
 * it internally builds a dependency graph from one or more entry points and then combines every module your project needs into
 * one or more bundles, which are static assets to serve your content from.
 */

const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const transform = require("typescript-json/lib/transform").default;
const Dotenv = require("dotenv-webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// adding custom styleloader functionality to inject css styles into shadow dom
const customStyleLoader = {
        loader: require.resolve('style-loader'),
        options: {
            insert: function (linkTag) {
                setTimeout(()=>{
                    const parent = document.querySelector('#udan-react-root').shadowRoot;
                    // parent.prepend(linkTag);
                    parent.appendChild(linkTag);
                },10);
            },
            // injectType: "linkTag"
        }
    }

module.exports = (env, argv) => {
    // reduce it to a nice object, the same as before

    const envFile =
        "./environments/" + (env.build ? `${env.build}.env` : "local.env");

    const buildPath =
        env.build && env.build === "production" ? "dist" : "build";

    const webpackConfig = {
        entry: {
            // string | object | array
            // defaults to ./src
            // Here the application starts executing
            // and webpack starts bundling
            UDAHeaders: "./src/Headers.js",
            UDASdk: "./src/index.tsx",
            UDABackground: "./src/Background.js",
            UDALoad: "./src/InjectSDK.js",
        },
        mode: "development", // "production" | "development" | "none"
        devtool: "cheap-module-source-map", // enum
        watch: false,

        watchOptions: {
            ignored: "/node_modules/",
        },

        module: {
            // configuration regarding modules
            rules: [
                // rules for modules (configure loaders, parser options, etc.)
                {
                    // Conditions:
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: "babel-loader", // the loader which should be applied, it'll be resolved relative to the context
                    options: { presets: ["@babel/env", "@babel/preset-react"] }, // options for the loader
                },
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    loader: "ts-loader",
                    options: {
                        getCustomTransformers: (program) => ({
                            before: [transform(program)],
                        }),
                    },
                },
                /*{
                    // Conditions:
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"], // When multiple loader configuration needed
                },*/
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: [
                        customStyleLoader,
                        // MiniCssExtractPlugin.loader,
                        "css-loader"
                    ],
                },
                {
                    // Conditions:
                    test: /\.s(a|c)ss$/,
                    exclude: /node_modules/,
                    use: [
                        // When multiple loader configuration needed
                        // "style-loader",
                        customStyleLoader,
                        "css-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                    // More information here https://webpack.js.org/guides/asset-modules/
                    type: "asset",
                },
                {
                    // Conditions:
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    use: [
                        {
                            // When multiple loader configuration needed
                            loader: "file-loader",
                            options: {
                                name: "[name].[ext]",
                                outputPath: "/images/",
                            },
                        },
                    ],
                },
                {
                    test: /\.svg$/,
                    exclude: /node_modules/,
                    use: {
                        // When multiple loader configuration needed
                        loader: "svg-url-loader",
                        options: { name: "[name].svg" },
                    },
                },
            ],
        },
        plugins: [
            // list of additional plugins
            new webpack.ProvidePlugin({
                process: "process/browser",
                Buffer: ["buffer", "Buffer"],
            }),
            new CopyPlugin({
                patterns: [
                    { from: "src/logo.*", to: "../logos/[name][ext]" },
                    { from: "public/", to: "../" },
                ],
            }),
            /*new webpack.DefinePlugin({
                "process.env": JSON.stringify(process.env)
            }),*/
            new Dotenv({
                path: `${envFile}`,
                safe: true,
                allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
                systemvars: false, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
                silent: true, // hide any errors
                defaults: false,
                ignoreStub: true,
            }),
            /*new MiniCssExtractPlugin({
                filename: "styles.css",
            }),*/
            // new BundleAnalyzerPlugin(),
            // gzip
            /*new CompressionPlugin({
                algorithm: 'gzip',
                threshold: 10240,
                minRatio: 0.8
            })*/
        ],
        resolve: {
            // options for resolving module requests
            // (does not apply to resolving of loaders)
            extensions: [".tsx", ".ts", ".js", ".css", ".scss"], // extensions that are used
            modules: ["./node_modules"], // directories where to look for modules (in order)
            alias: {
                // a list of module name aliases
                // aliases are imported relative to the current context
                process: "process/browser",
                utils: path.resolve(__dirname, "./src/config/index"),
            },
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
            },
        },
        optimization: {
            nodeEnv: 'production',
            minimizer: [
                new CssMinimizerPlugin(),
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true, // remove console statement
                        },
                    },
                }),
            ],
        },
        output: {
            // options related to how webpack emits results
            publicPath: "",
            filename: "[name].js", // the filename template for entry chunks
            library: "UdanLibrary",
            libraryTarget: "var",
            path: path.resolve(__dirname, buildPath + "/assets"), // the target directory for all output files
            // must be an absolute path (use the Node.js path module)
            clean: true,
        },
    };

    if (env.build && env.build === "production") {
        webpackConfig.mode = "production";
        // webpackConfig.devtool = 'nosources-source-map';
        delete webpackConfig.devtool;
    }

    return webpackConfig;
};
