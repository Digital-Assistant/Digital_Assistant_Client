const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack')

// const nodeModules = {};
// fs.readdirSync(path.resolve(__dirname, 'node_modules'))
//   .filter(x => ['.bin'].indexOf(x) === -1)
//   .forEach(mod => { nodeModules[mod] = `commonjs ${mod}`; });

module.exports = {
  target:'web',
  entry: {
    // 'bundle/index': './src/App.ts',
    'bundle/headers': './src/header.ts',
  },
  devtool: 'inline-source-map',
  // mode: 'production',
  mode: 'development',
  // externals: [nodeExternals()],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'output'),
    libraryTarget: 'umd',
    globalObject: 'this',
    libraryExport: 'default',
    umdNamedDefine : true,
    library : 'LibraryName'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    })
      // new HtmlWebpackPlugin({
      //     title: 'digitalassist.com'
      // })
  ],
  experiments: {
    //outputModule: true,
  },
  resolve: {
    // alias: {
    //     handlebars: 'handlebars/dist/handlebars.js',
    // },
    alias: {
        process: "process/browser"
    },
      fallback: {
      "fs": false,
      "tls": false,
      "net": false,
      // "path": false,
      // "zlib": false,
      "http": false,
      "https": false,
      // "stream": false,
      "crypto": false,
      "cluster": false,
      "fs-extra": require.resolve("fs-extra/"),
      "stream": require.resolve("stream-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "buffer": require.resolve("buffer/"),
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "url": require.resolve("url/"),
      "constants": require.resolve("constants-browserify"),
      "assert": require.resolve("assert/")
    } ,
    modules: ['./node_modules'],
    extensions: ['.ts','.js'],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ],
  },
};
