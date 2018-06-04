'use strict';
const path = require('path');
const webpack = require('webpack');
const cwd = process.cwd();

module.exports = {
  mode: 'production',
  entry: {
    index: ['./src/index.js'],
  },
  output: {
    path: path.join(cwd, 'dist', 'without-dll'),
    filename: '[name].js',
    library: '[name]_[hash]',
  },
};
