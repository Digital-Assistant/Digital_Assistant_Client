import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import commonConfig from './configs/webpack/webpack.common';
import devConfig from './configs/webpack/webpack.dev';
import prodConfig from './configs/webpack/webpack.prod';
import path from 'path';

interface EnvVariables {
  build?: string;
  production?: boolean;
}

const config = (env: EnvVariables, argv: any): Configuration => {
  const isProduction = env.production;
  const envFile = "./environments/" + (env.build ? `${env.build}.env` : "local.env");

  // Output path changes based on environment
  const buildPath = env.build === 'production' ? 'dist' : 'build';
  const outputPath = path.resolve(__dirname, buildPath, 'assets');

  const mergedConfig = merge(
    commonConfig,
    isProduction ? prodConfig : devConfig,
    {
      output: {
        path: outputPath,
        publicPath: '',
        filename: '[name].js',
        library: 'UdanLibrary',
        libraryTarget: 'var',
        clean: true,
      },
    }
  );
  
  return mergedConfig;
};

export default config;