// @flow

const path = require('path');
const bolt = require('bolt');
const fs = require('fs');

function ensureDir(filePath) {
  try {
    fs.statSync(filePath);
    return true;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  return false;
}

function getWorkspaces() {
  return bolt.getWorkspaces({ cwd: path.join(__dirname, '..') });
}

async function getWorkspacesWithDocs() {
  const wsMap = {};
  const workspaces = await getWorkspaces();
  //console.log(fs.statSync(path.join(__dirname, '../build/atlaskid/docs/0-intro.js')));
  const workspacesWithDocs = workspaces.filter(workspace =>
    ensureDir(path.join(workspace.dir, 'docs/0-intro.js')),
  );
  workspacesWithDocs.forEach(w => {
    wsMap[w.name] = path.join(w.dir, 'docs/0-intro.js');
  });
  return wsMap;
}

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
  const wsMap = await getWorkspacesWithDocs();
  return {
    entry: {
      ...wsMap,
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
        {
          test: /\.(gif|jpe?g|png|ico)$/,
          loader: 'url-loader?limit=10000',
        },
        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader', 'less-loader'],
        },
      ],
    },
    resolveLoader: {
      modules: [path.join(__dirname, 'node_modules')],
    },
  };
}

module.exports = webpackConfig;
