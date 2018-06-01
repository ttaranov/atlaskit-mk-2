var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'none',
  entry: {
    index: ['./src/index.js'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: '[name]_[hash]',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist', 'webpack-manifest.json'),
      name: '[name]_[hash]',
    }),
  ],
};
