const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
          },
        },
      },
      {
        // We need an explicit override to make us babelify the build-releases code (since we wont
        // have a dist/)
        test: /node_modules\/@atlaskit\/build-releases/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Custom template',
      template: 'src/index.ejs',
    }),
    new CopyWebpackPlugin([{ from: 'static' }]),
  ],
};
