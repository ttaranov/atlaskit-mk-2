// @flow

const path = require('path');
const boltQuery = require('bolt-query');
const webpack = require('webpack');

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
    devtool: 'cheap-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      watchContentBase: true,
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

      // new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
    ],
  };
};
