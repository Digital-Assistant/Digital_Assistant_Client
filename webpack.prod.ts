import { Configuration } from 'webpack';
import Dotenv from 'dotenv-webpack';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const prodConfig: Configuration = {
  mode: 'production',
  devtool: 'source-map',

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename], // Cache the config file itself
    },
    name: 'production-cache', // Specify a unique cache name for production
  },
  plugins: [
    new Dotenv({
      path: './environments/production.env',
      safe: true,
      systemvars: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
};

export default prodConfig;
