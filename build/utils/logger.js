// @flow
const chalk = require('chalk');

function log(message: string) {
  console.log(message);
}

function info(message: string) {
  console.error(chalk.cyan('info'), message);
}

function warn(message: string) {
  console.error(chalk.yellow('warn'), message);
}

function error(message: string) {
  console.error(chalk.red('error'), message);
}

function success(message: string) {
  console.log(chalk.green('success'), message);
}

module.exports = {
  log,
  info,
  warn,
  error,
  success,
};
