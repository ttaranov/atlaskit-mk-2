// webpack.config.js
// @flow
/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    bundle: './dist/es2015/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist', 'bundle'),
  },
  resolve: {
    mainFields: ['atlaskit:src', 'browser', 'main'],
    extensions: ['.js', '.ts', '.tsx'],
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
          transpileOnly: true,
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV':
        process.env.NODE_ENV === 'production'
          ? '"production"'
          : '"development"',
    }),
  ],
};
