import Dotenv from 'dotenv-webpack';
const devConfig = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
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
            path: './environments/development.env',
            safe: true,
            systemvars: true,
        }),
    ],
};
export default devConfig;
//# sourceMappingURL=webpack.dev.js.map