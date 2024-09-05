import { merge } from 'webpack-merge';
import commonConfig from './webpack.common';
import devConfig from './webpack.dev';
import prodConfig from './webpack.prod';
import path from 'path';
const config = (env, argv) => {
    const isProduction = env.production;
    const envFile = "./environments/" + (env.build ? `${env.build}.env` : "local.env");
    // Output path changes based on environment
    const buildPath = env.build === 'production' ? 'dist' : 'build';
    const outputPath = path.resolve(__dirname, buildPath, 'assets');
    const mergedConfig = merge(commonConfig, isProduction ? prodConfig : devConfig, {
        output: {
            path: outputPath,
            publicPath: '',
            filename: '[name].js',
            library: 'UdanLibrary',
            libraryTarget: 'var',
            clean: true,
        },
    });
    return mergedConfig;
};
export default config;
//# sourceMappingURL=webpack.config.js.map