// @flow

const webpack = require('webpack');
const path = require('path');
const pyarnQuery = require('pyarn-query');

const ORDERED_FILE_PREFIX = /^[0-9]+-/;

function sanitizeName(filePath) {
  return filePath.split(path.sep).map(part => path.parse(part).name.replace(ORDERED_FILE_PREFIX, '')).join('/');
}

module.exports = async function () {
  const results = await pyarnQuery({
    cwd: path.join(__dirname, '..'),
    projectFiles: {
      releases: 'releases/*.md',
      patterns: 'patterns/**/*.{js,ts,tsx}',
    },
    workspaceFiles: {
      docs: 'docs/**/*.{js,ts,tsx}',
      examples: 'examples/**/*.{js,ts,tsx}',
    },
  });

  const data = {
    packages: [],
  };

  results.workspaces.map(workspace => {
    const docsDir = path.join(workspace.dir, 'docs');
    const docs = [];

    if (workspace.files.docs) {
      workspace.files.docs.forEach(doc => {
        const filePath = doc.filePath;
        const relativePath = path.relative(docsDir, filePath);
        const name = sanitizeName(relativePath);
        docs.push({ name, filePath });
      });
    }

    data.packages.push({
      name: workspace.pkg.name,
      docs,
    });
  });

  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
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
      alias: {
        '@atlaskit/badge': path.resolve(__dirname, '..', 'components', 'badge', 'src', 'index.js'),
        '@atlaskit/code': path.resolve(__dirname, '..', 'components', 'code', 'src', 'index.ts'),
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          WEBSITE_DATA: JSON.stringify(data),
        },
      }),
    ],
  };
};
