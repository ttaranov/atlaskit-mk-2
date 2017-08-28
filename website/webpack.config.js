// @flow
'use strict';
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    watchContentBase: true,
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: require.resolve('ts-loader'),
        options: {
          cacheDirectory: true,
        },
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      '@atlaskit/badge': path.resolve(__dirname, '..', 'components', 'badge', 'src', 'index.js'),
      '@atlaskit/code': path.resolve(__dirname, '..', 'components', 'code', 'src', 'index.ts')
    },
  },
};
