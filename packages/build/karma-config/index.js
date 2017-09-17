const constants = require('karma').constants;
const ChromiumRevision = require('puppeteer/package.json').puppeteer.chromium_revision;
const Downloader = require('puppeteer/utils/ChromiumDownloader');

const revisionInfo = Downloader.revisionInfo(Downloader.currentPlatform(), ChromiumRevision);
process.env.CHROME_BIN = revisionInfo.executablePath;

const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader?transpileOnly=true',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
  },
  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
    'react-addons-test-utils': 'react-dom',
  },
};

module.exports = function getConfig() {
  return {
    port: 9876,
    basePath: process.cwd(),
    colors: true,
    frameworks: ['mocha', 'chai'],
    preprocessors: {
      '!(node_modules)/**/*.+(js|jsx|ts|tsx)': ['webpack'],
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only',
    },
    logLevel: constants.LOG_ERROR,
    reportSlowerThan: 500,
    mime: {
      'application/javascript': ['ts', 'tsx'],
    },
    autoWatch: false,
    singleRun: true,
    concurrency: 2,
    reporters: ['mocha'],
    browsers: ['ChromeHeadless'],
    mochaReporter: {
      showDiff: true,
    },
    plugins: [
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-chai'),
      require('karma-webpack'),
      require('karma-chrome-launcher'),
    ]
  };
}
