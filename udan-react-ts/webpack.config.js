/**
 * Author: Lakshman Veti
 * Webpack configuration
 */

/**
 * At its core, webpack is a static module bundler for modern JavaScript applications. When webpack processes your application, 
 * it internally builds a dependency graph from one or more entry points and then combines every module your project needs into 
 * one or more bundles, which are static assets to serve your content from.
 */

const path = require('path');
const webpack = require('webpack')
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
  
  entry: [
  // string | object | array
  // defaults to ./src
  // Here the application starts executing
  // and webpack starts bundling
    './src/index.tsx',
    './src/App.scss',
    './public/css/antd.css'
  ]
  ,
  mode: 'development',// "production" | "development" | "none"
  devtool: 'cheap-module-source-map',// enum
  // enhance debugging by adding meta info for the browser devtools
  // source-map most detailed at the expense of build speed.
  module: {
    // configuration regarding modules
    rules: [
    // rules for modules (configure loaders, parser options, etc.)
      {
        // Conditions:
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader', // the loader which should be applied, it'll be resolved relative to the context
        options: { presets: ['@babel/env', '@babel/preset-react'] },  // options for the loader
      },
      {
         // Conditions:
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
         // Conditions:
        test:/\.css$/,
        use:['style-loader','css-loader']  // When multiple loader configuration needed
      },
      {
         // Conditions:
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
        // When multiple loader configuration needed
            {
                loader: 'file-loader',
                options: { name: '[name].min.css'}
            },
            'sass-loader'
        ]
      },
      {
         // Conditions:
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [{
          // When multiple loader configuration needed
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/'
          }
        }]
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: {
          // When multiple loader configuration needed
          loader: 'svg-url-loader',
          options: { name: '[name].svg'}
        }
      }
    ],
  },
  plugins: [
    // list of additional plugins
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.ProvidePlugin({
      'utils': 'utils'
    }),
      // new HtmlWebpackPlugin({
      //     title: 'digitalassist.com'
      // })
      new CopyPlugin({
        patterns: [
          { from: 'src/logo.*', to: "../[name][ext]" },
        ],
      }),
  ],
  resolve: {
    // options for resolving module requests
    // (does not apply to resolving of loaders)
    extensions: ['.tsx', '.ts', '.js', '.css','.scss'], // extensions that are used
    modules: ['./node_modules'], // directories where to look for modules (in order)
    alias: {
      // a list of module name aliases
      // aliases are imported relative to the current context
      process: "process/browser",
      utils: path.resolve(__dirname, './src/config/index') 
    },
    fallback: { //fallback module dependencies 
      "fs": false,
      "tls": false,
      "net": false,
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
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
    }
  },
  output: {
    // options related to how webpack emits results
    publicPath: '',
    filename: 'bundle.js', // the filename template for entry chunks
    library: 'udanLibrary',
    libraryTarget: 'var',
    path: path.resolve(__dirname, 'build/assets'), // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
  },
};
