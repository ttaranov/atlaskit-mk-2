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
    entry: { main: './src/index.js' },
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
      extensions: ['.js', '.ts', '.tsx'],
      alias: aliases,
    },
    resolveLoader: {
      modules: ['../build/', 'node_modules', './src/loaders'],
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        // ...
      }),
      new HtmlWebpackPlugin({
        template: 'public/index.html.ejs'
      })
      // new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
    ],
  };
};
