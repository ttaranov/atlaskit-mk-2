const webpack = require('webpack');

module.exports = {
  entry: {
    'mobile-page.ts': './src',
  },
  output: {
    path: './dist/',
    filename: '[name]',
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.ts', '.tsx'],
    mainFields: ['webpack', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
};
