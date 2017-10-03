// @flow

const path = require('path');
const boltQuery = require('bolt-query');
const webpack = require('webpack');

const ORDERED_FILE_PREFIX = /^[0-9]+-/;

function sanitizeName(filePath) {
  return filePath
    .split(path.sep)
    .map(part => path.parse(part).name.replace(ORDERED_FILE_PREFIX, ''))
    .join('/');
}

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

  // add workspace groups (i.e folders in the /packages directory) to the
  // packages object here for them to be available in the webstie
  const data = {
    packages: {
      elements: [],
      fabric: [],
    },
  };

  const entries = {};
  const aliases = {};

  results.workspaces.forEach(workspace => {
    const parts = workspace.dir.split('/');
    const name = parts.pop();
    const group = parts.pop();

    if (!data.packages[group]) return;

    const docsDir = path.join(workspace.dir, 'docs');
    const docs = [];

    if (workspace.pkg.src) {
      aliases[workspace.pkg.name] = path.resolve(workspace.dir, workspace.pkg.src);
    }

    if (workspace.files.docs) {
      workspace.files.docs.forEach(doc => {
        const filePath = doc.filePath;
        const relativePath = path.relative(docsDir, filePath);
        const sanitisedName = sanitizeName(relativePath);
        docs.push({ name: sanitisedName, filePath });

        const bundleName = `${workspace.pkg.name}/docs/${name}`.replace(/\//g, '-');
        entries[bundleName] = filePath;
      });
    }

    data.packages[group].push({
      name,
      group,
      docs,
      description: workspace.pkg.description,
      relativePath: path.relative(basePath, workspace.dir),
    });
  });

  entries.main = './src/index.js';

  return {
    entry: entries,
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
            cacheDirectory: true,
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
      modules: ['../build/', 'node_modules'],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          WEBSITE_DATA: JSON.stringify(data),
        },
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        // ...
      }),
    ],
  };
};
