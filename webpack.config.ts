import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import commonConfig from './webpack.common';
import devConfig from './webpack.dev';
import prodConfig from './webpack.prod';

interface EnvVariables {
  build?: string;
  production?: boolean;
}

const config = (env: EnvVariables, argv: any): Configuration => {
  const isProduction = env.production;
  const envFile = "./environments/" + (env.build ? `${env.build}.env` : "local.env");
  
  return merge(
    commonConfig,
    isProduction ? prodConfig : devConfig
  );
};

export default config;
