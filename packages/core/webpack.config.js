const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const umdConfig = {
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: ["./node_modules"], // directories where to look for modules (in order)
        alias: {
            // a list of module name aliases
            // aliases are imported relative to the current context
            process: "process/browser",
            utils: path.resolve(__dirname, "./src/config/index"),
            // alias for antd
            antd: path.resolve(__dirname, 'node_modules/antd'),
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
            "process/browser": require.resolve("process/browser")
        },
    },
    devtool: isProduction ? false : 'source-map',
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction,
            },
          },
        }),
      ],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.umd.js',
      library: {
        name: 'DigitalAssistantSDK',
        type: 'umd',
      },
      globalObject: 'this',
    },
  };

  return umdConfig;
};
