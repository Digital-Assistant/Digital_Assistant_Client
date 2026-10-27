/**
 * Author: Yureswar Ravuri
 * Webpack configuration
 */

const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { defineEntries } = require("./scripts/build-env");

// adding custom styleloader functionality to inject css styles into shadow dom
const customStyleLoader = {
    loader: require.resolve('style-loader'),
    options: {
        insert: function (linkTag) {
            setTimeout(() => {
                const parent = document.querySelector('#udan-react-root').shadowRoot;
                parent.appendChild(linkTag);
            }, 10);
        },
    }
}

module.exports = (env, argv) => {
    const isProd = env.build === "production" || env.build === "qa";
    const buildPath = isProd ? "dist" : "build";

    // Build-time env (public keys only): exactly the keys in environments/env.example,
    // read from environments/<env.build>.env (default local.env); an environment
    // variable with the same name overrides the file. See scripts/build-env.js.
    const { env: buildEnv, defs: envDefinitions } = defineEntries(env.build);
    if (!buildEnv.exists) {
        console.warn(`[env] ${path.relative(__dirname, buildEnv.file)} not found: all build-time keys are empty (copy environments/env.example).`);
    }

    const webpackConfig = {
        cache: {
            type: 'filesystem',
            buildDependencies: { config: [__filename, require.resolve("./scripts/build-env")] },
        },
        entry: {
            UDAHeaders: "./src/Headers.js",
            UDAInjectHeaders: "./src/InjectHeaders.js",
            UDASdk: "./src/main.tsx",
            UDABackground: "./src/Background.ts",
            UDALoad: "./src/InjectSDK.js",
            UDAPluginSDK: "./src/ExtensionSDK.js",
            UDAOptions: "./src/Options.ts",
        },
        mode: isProd ? "production" : "development",
        devtool: isProd ? false : "cheap-module-source-map",
        watch: false,
        watchOptions: {
            ignored: "/node_modules/",
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: "babel-loader",
                    options: { presets: ["@babel/env", "@babel/preset-react"] },
                },
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    loader: "ts-loader",
                    options: { transpileOnly: !isProd },
                },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: [customStyleLoader, "css-loader"],
                },
                {
                    test: /\.s(a|c)ss$/,
                    exclude: /node_modules/,
                    use: [customStyleLoader, "css-loader", "sass-loader"],
                },
                {
                    test: /\.(png|jpe?g|gif|eot|ttf|woff|woff2)$/i,
                    type: "asset",
                },
                {
                    test: /\.svg$/,
                    exclude: /node_modules/,
                    type: "asset/inline",
                },
                {
                    test: /\.m?js/,
                    resolve: { fullySpecified: false }
                }
            ],
        },
        plugins: [
            new webpack.ProvidePlugin({
                process: "process/browser",
                Buffer: ["buffer", "Buffer"],
            }),
            new webpack.DefinePlugin(envDefinitions),
            new CopyPlugin({
                patterns: [
                    { from: "public/", to: "../" },
                ],
            }),
        ],
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".css", ".scss"],
            modules: ["./node_modules"],
            alias: {
                process: "process/browser",
                utils: path.resolve(__dirname, "./src/config/index"),
            },
            fallback: { fs: false },
        },
        output: {
            publicPath: "",
            filename: "[name].js",
            library: "UdanLibrary",
            libraryTarget: "var",
            path: path.resolve(__dirname, buildPath + "/assets"),
            clean: true,
        },
    };

    if (isProd) {
        webpackConfig.optimization = {
            nodeEnv: 'production',
            splitChunks: false,
            minimizer: [
                new CssMinimizerPlugin(),
                new TerserPlugin({
                    terserOptions: { compress: { drop_console: true } },
                }),
            ],
        };
    }

    return webpackConfig;
};
