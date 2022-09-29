const path = require('path');
const webpack = require('webpack')

module.exports = {
  entry: [
    './src/index.tsx',
    './src/App.scss'
  ]
  ,
  mode: 'development',
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
     
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'file-loader',
                options: { name: '[name].min.css'}
            },
            'sass-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [{
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
          loader: 'svg-url-loader',
          options: { name: '[name].svg'}
        }
      }
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
      // new HtmlWebpackPlugin({
      //     title: 'digitalassist.com'
      // })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss'],
    modules: ['./node_modules'],
    alias: {
        process: "process/browser"
    },
    fallback: {
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
    publicPath: '',
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build/assets'),
  },
};
