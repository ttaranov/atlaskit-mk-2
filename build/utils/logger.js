// @flow
const chalk = require('chalk');

function log(message) {
  console.log(message);
}

function info(message) {
  console.error(chalk.cyan('info'), message);
}

function warn(message) {
  console.error(chalk.yellow('warn'), message);
}

function error(message) {
  console.error(chalk.red('error'), message);
}

function success(message) {
  console.log(chalk.green('success'), message);
}

module.exports = {
  log,
  info,
  warn,
  error,
  success,
};
