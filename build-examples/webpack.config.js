// @flow

const path = require('path');
// const bolt = require('bolt');

// async function printWorkspaces() {
//   const wsMap = {};
//   const ws = await bolt.getWorkspaces(
//     { cwd: path.join(__dirname, '..') }
//   );
//   ws.forEach(w => {
//     wsMap[w.name] = w.dir;
//   });
//   return wsMap;
// }

async function webpackConfig() {
  return {
    entry: {
      foo: path.join(__dirname, '../packages/core/button/docs/0-intro.js'),
    },
    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'dist'),
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
      ],
    },
    resolveLoader: {
      modules: [path.join(__dirname, 'node_modules')],
    },
  };
}

module.exports = webpackConfig;
