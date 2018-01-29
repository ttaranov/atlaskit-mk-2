// @flow
const os = require('os');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { createDefaultGlob } = require('./utils');

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
  } /*: {
    entry: string,
    host?: string,
    port?: number,
    globs?: Array<string>,
    cwd?: string,
    includePatterns: boolean,
    env: string,
    noMinimize?: boolean
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
      vendor: ['react', 'react-dom', 'styled-components', 'highlight.js'],
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
    plugins: plugins({ cwd, env, noMinimize }),
  };
};

function plugins(
  {
    cwd,
    env,
    noMinimize,
  } /*: { cwd: string, env: string, noMinimize?: boolean } */,
) {
  const plugins = [
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
      template: path.join(cwd, 'public/index.html.ejs'),
      favicon: path.join(cwd, 'public/favicon.ico'),
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${env}"`,
    }),
  ];

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
