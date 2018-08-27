// @flow
/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    bundle: './src/index.tsx',
  },
  stats: {
    warnings: false,
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist', 'bundle'),
  },
  resolve: {
    mainFields: ['atlaskit:src', 'browser', 'main'],
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      '@atlaskit/media-picker': `${path.resolve(__dirname)}/empty.ts`,
      '@atlaskit/tooltip': `${path.resolve(__dirname)}/empty.ts`,
      '@atlaskit/modal-dialog': `${path.resolve(__dirname)}/empty.ts`,
      '@atlaskit/logo': `${path.resolve(__dirname)}/empty.ts`,
      '@atlaskit/avatar': `${path.resolve(__dirname)}/empty.ts`,
      '@atlaskit/avatar-group': `${path.resolve(__dirname)}/empty.ts`,
      '@atlaskit/profilecard': `${path.resolve(__dirname)}/empty.ts`,
      '@atlaskit/select': `${path.resolve(__dirname)}/empty.ts`,
      'react-select': `${path.resolve(__dirname)}/empty.ts`,
      'components/picker/EmojiPicker': `${path.resolve(__dirname)}/empty.ts`,
      'react-virtualized/dist/commonjs/List': `${path.resolve(
        __dirname,
      )}/empty.ts`,
      'react-virtualized': `${path.resolve(__dirname)}/empty.ts`,
    },
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
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public/index.html.ejs'),
    }),
    new UglifyJsPlugin({
      test: /\.js($|\?)/i,
      sourceMap: true,
      uglifyOptions: {
        mangle: {
          keep_fnames: true,
        },
        compress: {
          warnings: false,
        },
        output: {
          beautify: false,
        },
      },
    }),
  ],
};
