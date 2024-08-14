import { Configuration } from 'webpack';
import Dotenv from 'dotenv-webpack';
import path from 'path';

const devConfig: Configuration = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, process.env.BUILD_PATH || 'build'),
    publicPath: '/build/',
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename], // Cache the config file itself
    },
    name: 'development-cache', // Specify a unique cache name for production
  },
  plugins: [
    new Dotenv({
      path: './environments/development.env',
      safe: true,
      systemvars: true,
    }),
  ],
};

export default devConfig;
