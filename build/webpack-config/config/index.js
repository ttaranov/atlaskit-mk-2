// @flow
const os = require('os');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const { createDefaultGlob } = require('./utils');
const chunkslists = {
  all: [],
  includes: [],
  excludes: [],
};
var hasWritten = false;
module.exports = function createWebpackConfig(
  {
    entry,
    host,
    port,
    globs = createDefaultGlob(),
    includePatterns = false,
    env = 'development',
    cwd = process.cwd(),
    noMinimize = false,
    report = false,
  } /*: {
    entry: string,
    host?: string,
    port?: number,
    globs?: Array<string>,
    cwd?: string,
    includePatterns: boolean,
    env: string,
    noMinimize?: boolean,
    report?: boolean,
  }*/,
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
          : path.join(cwd, entry),
      examples:
        env === 'development' && host && port
          ? [
              `${require.resolve(
                'webpack-dev-server/client',
              )}?http://${host}:${port}/`,
              path.join(process.cwd(), './src/examples-entry.js'),
            ]
          : path.join(cwd, './src/examples-entry.js'),
      vendor: [
        'react',
        'react-dom',
        'styled-components',
        'highlight.js',
        'react-router',
        'react-router-dom',
      ],
    },
    output: {
      filename: '[name].js',
      path: path.resolve(cwd, 'dist'),
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
          test: /NAV_DATA$/,
          loader: require.resolve('nav-info-loader'),
          options: {
            include: [...globs]
              .filter(p => p.includes('package.json'))
              .map(p => p.replace('/package.json', '')),
            exclude: ['**/node_modules/**', 'packages/utils/docs/**'],
            configProps: [
              'name',
              'version',
              'description',
              'atlaskit',
              'maintainers',
              'peerDependencies',
              'devDependencies',
              'dependencies',
            ],
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
    plugins: plugins({ cwd, env, noMinimize, report }),
  };
};

function plugins(
  {
    cwd,
    env,
    noMinimize,
    report,
  } /*: { cwd: string, env: string, noMinimize: boolean, report: boolean } */,
) {
  const plugins = [
    new webpack.NamedChunksPlugin(
      chunk =>
        chunk.name && path.isAbsolute(chunk.name) ? chunk.id : chunk.name,
    ),
    new webpack.NamedModulesPlugin(),
    //
    // Order of CommonsChunkPlugins is important,
    // each next one of them can drag some dependencies from the previous ones.

    new webpack.optimize.CommonsChunkPlugin({
      async: 'async-deps',
      minChunks: 1,
    }),

    new webpack.optimize.CommonsChunkPlugin({
      async: 'editor-packages',
      minChunks(module, count) {
        const context = module.context;
        return (
          context &&
          (context.includes('fabric/editor') ||
            context.includes('fabric/renderer') ||
            context.includes('fabric/conversation') ||
            context.includes('prosemirror'))
        );
      },
    }),

    new webpack.optimize.CommonsChunkPlugin({
      async: 'fabric-elements-packages',
      minChunks(module, count) {
        const context = module.context;
        return (
          context &&
          (context.includes('fabric/mention') ||
            context.includes('fabric/emoji') ||
            context.includes('fabric/task-decision') ||
            context.includes('fabric/reactions'))
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

    new webpack.optimize.CommonsChunkPlugin({
      name: 'common-app',
      chunks: ['main', 'examples'],
      minChunks(module, count) {
        const resource = module.resource;
        return !resource || !resource.includes('website/src/index.js');
      },
    }),

    new HtmlWebpackPlugin({
      template: path.join(cwd, 'public/index.html.ejs'),
      favicon: path.join(cwd, 'public/favicon.ico'),
      excludeChunks: ['examples'],
    }),

    new HtmlWebpackPlugin({
      filename: 'examples.html',
      template: path.join(cwd, 'public/examples.html.ejs'),
      favicon: path.join(cwd, 'public/favicon.ico'),
      excludeChunks: ['main'],
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${env}"`,
    }),
  ];

  if (report) {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: true,
        generateStatsFile: true,
        logLevel: 'error',
      }),
    );
  }

  if (env === 'production' && !noMinimize) {
    plugins.push(uglify());
  }

  return plugins;
}

const uglify = () => {
  return new UglifyJsPlugin({
    parallel: Math.max(os.cpus().length - 1, 1),
    uglifyOptions: {
      compress: {
        // Disabling following options speeds up minimization by 20 – 30s
        // without any significant impact on a bundle size.
        arrows: false,
        booleans: false,
        collapse_vars: false,

        // https://product-fabric.atlassian.net/browse/MSW-436
        comparisons: false,

        computed_props: false,
        hoist_funs: false,
        hoist_props: false,
        hoist_vars: false,
        if_return: false,
        inline: false,
        join_vars: false,
        keep_infinity: true,
        loops: false,
        negate_iife: false,
        properties: false,
        reduce_funcs: false,
        reduce_vars: false,
        sequences: false,
        side_effects: false,
        switches: false,
        top_retain: false,
        toplevel: false,
        typeofs: false,
        unused: false,

        // Switch off all types of compression except those needed to convince
        // react-devtools that we're using a production build
        conditionals: true,
        dead_code: true,
        evaluate: true,
      },
      mangle: true,
    },
  });
};
