import path from 'path';
import { fileURLToPath } from 'url';
import ZipPlugin from 'zip-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env) => {
  const baseConfig = {
    mode: 'production',
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
  };

  const umdConfig = {
    ...baseConfig,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.umd.js',
      library: 'UdanSDK',
      libraryTarget: 'umd',
      umdNamedDefine: true,
    },
    plugins: [],
  };

  if (env.zip) {
    umdConfig.plugins.push(
      new ZipPlugin({
        filename: 'digital-assistant-core-1.0.0.zip',
      })
    );
  }

  const esmConfig = {
    ...baseConfig,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.mjs',
      libraryTarget: 'module',
    },
    experiments: {
      outputModule: true,
    },
  };

  return [umdConfig, esmConfig];
};
