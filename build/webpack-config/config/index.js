// @flow

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { createDefaultGlob } = require('./utils');

module.exports = function createWebpackConfig(
  {
    entry,
    host,
    port,
    globs = createDefaultGlob(),
    includePatterns = false,
    env = 'development',
  } /*: { entry: string, host?: string, port?: number, globs?: Array<string>, includePatterns: boolean, env: string } */,
) {
  return {
    entry: {
      main:
        env === 'development' && host && port
          ? [
              `${require.resolve(
                'webpack-dev-server/client',
              )}?http://${host}:${port}/`,
              path.join(process.cwd(), entry),
            ]
          : path.join(process.cwd(), entry),
      vendor: ['react', 'react-dom', 'styled-components', 'highlight.js'],
    },
    output: {
      filename: '[name].js',
      path: path.resolve(process.cwd(), 'dist'),
      publicPath: '/',
    },
    devtool: env === 'production' ? false : 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: /SITE_DATA$/,
          loader: require.resolve('bolt-fs-loader'),
          options: {
            include: [
              'docs/**/*.md',
              includePatterns && 'patterns/**/*.js',
              ...globs,
            ].filter(p => !!p),
            exclude: ['**/node_modules/**', 'packages/utils/docs/**'],
          },
        },
        {
          test: /CHANGELOG\.md$/,
          exclude: /node_modules/,
          loader: require.resolve('changelog-md-loader'),
        },
        {
          test: /\.md$/,
          exclude: /node_modules/,
          loader: require.resolve('raw-loader'),
        },
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
        {
          test: /\.css$/,
          use: [
            {
              loader: require.resolve('style-loader'),
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                camelCase: true,
                importLoaders: 1,
                mergeRules: false,
                modules: true,
              },
            },
          ],
        },
        {
          test: /\.(gif|jpe?g|png|ico)$/,
          loader: 'url-loader?limit=10000',
        },
        {
          test: /\.svg/,
          use: {
            loader: require.resolve('svg-url-loader'),
            options: {
              limit: 512,
            },
          },
        },
        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader', 'less-loader'],
        },
      ],
    },
    resolve: {
      mainFields: ['atlaskit:src', 'browser', 'main'],
      extensions: ['.js', '.ts', '.tsx'],
    },
    resolveLoader: {
      modules: [
        path.join(__dirname, '..', '..', '..', 'build/'),
        'node_modules',
      ],
    },
    plugins: [
      //
      // Order of CommonsChunkPlugins is important,
      // each next one of them can drag some dependencies from the previous ones.
      //

      // Joins all vendor entry point packages into 1 chunk
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
      }),

      new webpack.optimize.CommonsChunkPlugin({
        async: 'used-two-or-more-times',
        minChunks(module, count) {
          return count >= 2;
        },
      }),

      new webpack.optimize.CommonsChunkPlugin({
        async: 'editor-packages',
        minChunks(module, count) {
          const context = module.context;
          return (
            context &&
            (context.includes('fabric/editor') ||
              context.includes('fabric/renderer') ||
              context.includes('prosemirror'))
          );
        },
      }),

      new webpack.optimize.CommonsChunkPlugin({
        async: 'media-packages',
        minChunks(module, count) {
          const context = module.context;
          return context && context.includes('fabric/media');
        },
      }),

      new webpack.optimize.CommonsChunkPlugin({
        async: 'elements-packages',
        minChunks(module, count) {
          const context = module.context;
          return context && context.includes('elements/');
        },
      }),

      new HtmlWebpackPlugin({
        template: path.join(process.cwd(), 'public/index.html.ejs'),
        favicon: path.join(process.cwd(), 'public/favicon.ico'),
      }),

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': `"${env}"`,
      }),
    ],
  };
};
