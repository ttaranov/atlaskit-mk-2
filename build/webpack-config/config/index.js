// @flow
const os = require('os');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const { createDefaultGlob } = require('./utils');

// const vendorLibraries = [
//   'react',
//   'react-dom',
//   'styled-components',
//   'highlight.js',
//   'react-router',
//   'react-router-dom',
// ];

module.exports = function createWebpackConfig(
  {
    entry,
    host,
    port,
    globs = createDefaultGlob(),
    includePatterns = false,
    env = 'development',
    websiteEnv = 'local',
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
    websiteEnv: string,
    noMinimize?: boolean,
    report?: boolean,
  }*/,
) /*: {
  entry: {},
  output: {},
  devtool: boolean | string,
  module: {},
  resolve: {},
  resolveLoader: {},
  plugins: any[],
}*/ {
  return {
    entry: {
      // TODO: ideally we should have a vendor chunk, with just external library dependencies.
      // vendor: vendorLibraries,
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
          test: /CONTENTFUL_DATA/,
          loader: require.resolve('contentful-loader'),
          options: {
            spaceId: '8j5aqoy0ts8s',
            accessToken:
              'c095861ccf259e184e34be072a1bd4051fdefcf1b5570f5fcae84a94f462a033',
          },
        },
        {
          test: /DESIGN_EXAMPLES/,
          exclude: /node_modules/,
          loader: require.resolve('design-examples-loader'),
        },
        {
          test: /DESIGN_SITE_DATA$/,
          loader: require.resolve('bolt-fs-loader'),
          options: {
            include: [
              includePatterns && 'packages/**/design-examples/*.js',
            ].filter(p => !!p),
            exclude: ['**/node_modules/**', 'packages/build/docs/**'],
            debug: true,
          },
        },
        {
          test: /SITE_DATA$/,
          loader: require.resolve('bolt-fs-loader'),
          options: {
            include: [
              'docs/**/*.md',
              includePatterns && 'patterns/**/*.js',
              ...globs,
            ].filter(p => !!p),
            exclude: ['**/node_modules/**', 'packages/build/docs/**'],
          },
        },
        {
          test: /NAV_DATA$/,
          loader: require.resolve('nav-info-loader'),
          options: {
            include: [...globs]
              .filter(p => p.includes('package.json'))
              .map(p => p.replace('/package.json', '')),
            exclude: ['**/node_modules/**', 'packages/build/docs/**'],
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
          test: /\.(gif|jpe?g|png|ico|woff|woff2)$/,
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
    plugins: plugins({ cwd, env, websiteEnv, noMinimize, report }),
  };
};

function plugins(
  {
    cwd,
    env,
    websiteEnv,
    noMinimize,
    report,
  } /*: { cwd: string, env: string, websiteEnv: string, noMinimize: boolean, report: boolean } */,
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
      minChunks(module, count) {
        const context = module.context;
        return (
          count === 1 &&
          (context &&
            // We're intentionally excluding rxjs-async-map from this chunk as it currently breaks our build
            // This package is being used by the media-store package. Unfortunately it's not transpiled, and is thus breaking in ie11.
            (context && !context.includes('node_modules/rxjs-async-map')))
        );
      },
    }),

    new webpack.optimize.CommonsChunkPlugin({
      async: 'shared-async-deps',
      minChunks(module, count) {
        let context = module.context;
        if (
          context &&
          context.includes('node_modules') &&
          !context.includes('@atlaskit')
        ) {
          return count >= 2;
        }

        return false;
      },
    }),

    new webpack.optimize.CommonsChunkPlugin({
      async: 'editor-packages',
      minChunks(module, count) {
        const context = module.context;
        return (
          context &&
          (context.includes('packages/editor') ||
            context.includes('prosemirror'))
        );
      },
    }),

    new webpack.optimize.CommonsChunkPlugin({
      async: 'fabric-elements-packages',
      minChunks(module, count) {
        const context = module.context;
        return context && context.includes('packages/elements');
      },
    }),

    new webpack.optimize.CommonsChunkPlugin({
      async: 'media-packages',
      minChunks(module, count) {
        const context = module.context;
        return context && context.includes('packages/media');
      },
    }),

    new webpack.optimize.CommonsChunkPlugin({
      async: 'people-and-teams-packages',
      minChunks(module, count) {
        const context = module.context;
        return context && context.includes('packages/people-and-teams');
      },
    }),

    new webpack.optimize.CommonsChunkPlugin({
      async: 'core-packages',
      minChunks(module, count) {
        const context = module.context;
        return context && context.includes('packages/core');
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
      title: `Atlaskit by Atlassian${env === 'development' ? ' - DEV' : ''}`,
      favicon: path.join(
        cwd,
        `public/favicon${env === 'development' ? '-dev' : ''}.ico`,
      ),
      excludeChunks: ['examples'],
    }),

    new HtmlWebpackPlugin({
      filename: 'examples.html',
      title: `Atlaskit by Atlassian${env === 'development' ? ' - DEV' : ''}`,
      template: path.join(cwd, 'public/examples.html.ejs'),
      favicon: path.join(
        cwd,
        `public/favicon${env === 'development' ? '-dev' : ''}.ico`,
      ),
      excludeChunks: ['main'],
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${env}"`,
      WEBSITE_ENV: `"${websiteEnv}"`,
      BASE_TITLE: `"Atlaskit by Atlassian ${
        env === 'development' ? '- DEV' : ''
      }"`,
    }),
  ];

  if (report) {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        statsOptions: { source: false },
        generateStatsFile: true,
        openAnalyzer: true,
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
