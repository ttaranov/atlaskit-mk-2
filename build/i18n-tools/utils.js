const chalk = require('chalk');

function errorAndExit(msg) {
  console.error(chalk.red(msg));
  process.exit(1);
}

module.exports = { errorAndExit };
