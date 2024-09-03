import path from 'path';
import webpack from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import WebpackBar from 'webpackbar';
const commonConfig = {
    entry: {
        UDAHeaders: './src/Headers.js',
        UDAInjectHeaders: './src/InjectHeaders.js',
        UDASdk: './src/index.tsx',
        UDABackground: './src/Background.ts',
        UDALoad: './src/InjectSDK.js',
        UDAPluginSDK: './src/ExtensionSDK.js',
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'thread-loader',
                    },
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                type: 'asset',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css', '.scss'],
        alias: {
            utils: path.resolve(__dirname, './src/config/index'),
            antd: path.resolve(__dirname, 'node_modules/antd'),
        },
        fallback: {
            fs: false,
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            stream: require.resolve('stream-browserify'),
            zlib: require.resolve('browserify-zlib'),
            buffer: require.resolve('buffer/'),
            path: require.resolve('path-browserify'),
            os: require.resolve('os-browserify/browser'),
            assert: require.resolve('assert/'),
        },
    },
    plugins: [
        new WebpackBar(),
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
        new ForkTsCheckerWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: 'src/logo.*', to: '../logos/[name][ext]' },
                { from: 'public/', to: '../' },
            ],
        }),
    ],
};
export default commonConfig;
//# sourceMappingURL=webpack.common.js.map