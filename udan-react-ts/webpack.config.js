const path = require('path');

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
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss'],
    modules: ['./node_modules'],
  },
  output: {
    publicPath: '',
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build/assets'),
  },
};
