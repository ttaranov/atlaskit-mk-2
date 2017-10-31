// @flow

// Start of the hack for the issue with the webpack watcher that leads to it dying in attempt of watching files
// in node_modules folder which contains circular symbolic links

const DirectoryWatcher = require('watchpack/lib/DirectoryWatcher');
const _oldcreateNestedWatcher = DirectoryWatcher.prototype.createNestedWatcher;
DirectoryWatcher.prototype.createNestedWatcher = function(dirPath) {
  if (dirPath.includes('node_modules')) return;
  _oldcreateNestedWatcher.call(this, dirPath);
};

// End of the hack

const path = require('path');
const boltQuery = require('bolt-query');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = async function createWebpackConfig() {
  const basePath = path.join(__dirname, '..');
  const results = await boltQuery({
    cwd: basePath,
    projectFiles: {
      releases: 'releases/*.md',
      patterns: 'patterns/**/*.{js,ts,tsx}',
    },
    workspaceFiles: {
      docs: 'docs/**/*.{js,ts,tsx}',
      examples: 'examples/**/*.{js,ts,tsx}',
    },
  });

  const aliases = results.workspaces.reduce((acc, workspace) => {
    if (workspace.pkg.src) {
      acc[workspace.pkg.name] = path.resolve(workspace.dir, workspace.pkg.src);
    }

    return acc;
  }, {});

  return {
    entry: {
      main: './src/index.js',
      vendor: [
        'react',
        'react-dom',
        'styled-components',
        'highlight.js',
        'date-fns',
        '@atlaskit/avatar',
        '@atlaskit/input',
        '@atlaskit/layer',
        '@atlaskit/activity',
        '@atlaskit/button',
        '@atlaskit/code',
        '@atlaskit/dropdown-menu',
        '@atlaskit/droplist',
        '@atlaskit/emoji',
        '@atlaskit/icon',
        '@atlaskit/logo',
        '@atlaskit/media-card',
        '@atlaskit/media-core',
        '@atlaskit/media-filmstrip',
        '@atlaskit/mention',
        '@atlaskit/profilecard',
        '@atlaskit/single-select',
        '@atlaskit/spinner',
        '@atlaskit/task-decision',
        '@atlaskit/tooltip',
        '@atlaskit/util-shared-styles',
        'mediapicker',
        'prosemirror-commands',
        'prosemirror-history',
        'prosemirror-inputrules',
        'prosemirror-keymap',
        'prosemirror-markdown',
        'prosemirror-model',
        'prosemirror-schema-basic',
        'prosemirror-schema-list',
        'prosemirror-state',
        'prosemirror-tables',
        'prosemirror-transform',
        'prosemirror-view',
        'prosemirror-dev-tools',
        'tslib',
        '@atlaskit/media-test-helpers',
        '@atlaskit/emoji/dist/es5/support',
        '@atlaskit/mention/dist/es5/support',
        '@atlaskit/inline-edit',
        'text-encoding',
      ],
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    devtool: false,
    devServer: {
      compress: true,
      port: 9000,
      // lazy: true,
      historyApiFallback: true,
      overlay: true,
      stats: {
        assets: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: true,
      },
    },
    module: {
      rules: [
        {
          test: /CHANGELOG\.md$/,
          exclude: /node_modules/,
          loader: 'changelog-md-loader',
        },
        {
          test: /\.md$/,
          exclude: /node_modules/,
          loader: 'raw-loader',
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
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
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
            loader: 'svg-url-loader',
            options: {
              limit: 512,
            },
          },
        },
      ],
    },
    resolve: {
      // mainFields: ['main', 'module', 'jsnext:main', 'jsnext:experimental:main'],
      extensions: ['.js', '.ts', '.tsx'],
      alias: aliases,
    },
    resolveLoader: {
      modules: ['../build/', 'node_modules', './src/loaders'],
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        // children: true,
        // deepChildren: true,
      }),
      new HtmlWebpackPlugin({
        template: 'public/index.html.ejs',
      }),
      // new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
    ],
  };
};
