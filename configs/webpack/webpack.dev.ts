import { Configuration } from 'webpack';
import Dotenv from 'dotenv-webpack';

const devConfig: Configuration = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  output: {
    filename: '[name].js',
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
      path: '../environments/development.env',
      safe: true,
      systemvars: true,
    }),
  ],
};

export default devConfig;
