const chalk = require('chalk');
const babel = require('@babel/core');
const { promisify } = require('util');

const babelConfig = {
  plugins: ['react-intl', '@babel/syntax-dynamic-import'],
};

function errorAndExit(msg) {
  console.error(chalk.red(msg));
  process.exit(1);
}

function getExtensionForType(type) {
  const lowerCasedType = String(type).toLowerCase();
  return lowerCasedType === 'typescript' || lowerCasedType === 'ts'
    ? '.ts'
    : '.js';
}

async function extractMessagesFromFile(file) {
  const res = await promisify(babel.transformFile)(file, babelConfig);
  return res.metadata['react-intl'].messages;
}

module.exports = { errorAndExit, getExtensionForType, extractMessagesFromFile };
