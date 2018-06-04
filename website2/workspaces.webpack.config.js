'use strict';
const path = require('path');
const webpack = require('webpack');

const cwd = process.cwd();

module.exports = {
  mode: 'none',
  entry: {
    index: ['./src/index.js'],
  },
  output: {
    path: path.join(cwd, 'dist', 'dll'),
    filename: '[name].js',
    library: '[name]_[hash]',
  },
  externals: [
    (context, request, callback) => {
      if (request.startsWith('.')) {
        callback();
      } else {
        callback(null, 'commonjs ' + request);
      }
    },
  ],
  plugins: [
    new webpack.DllPlugin({
      path: path.join(cwd, 'dist', 'dll', 'webpack-manifest.json'),
      name: '[name]_[hash]',
    }),
  ],
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
    ],
  },
};
