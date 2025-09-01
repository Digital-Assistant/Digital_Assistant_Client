const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const baseConfig = {
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
  };

  const umdConfig = {
    ...baseConfig,
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

  const esmConfig = {
    ...baseConfig,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.mjs',
      library: {
        type: 'module',
      },
    },
    experiments: {
      outputModule: true,
    },
  };

  return [umdConfig, esmConfig];
};
