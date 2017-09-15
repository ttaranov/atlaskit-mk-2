// @flow
import chalk from 'chalk';

export function log(message: string) {
  console.log(message);
}

export function info(message: string) {
  console.error(chalk.cyan('info'), message);
}

export function warn(message: string) {
  console.error(chalk.yellow('warn'), message);
}

export function error(message: string) {
  console.error(chalk.red('error'), message);
}

export function success(message: string) {
  console.log(chalk.green('success'), message);
}
