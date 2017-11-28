// @flow

const chalk = require('chalk');

function print(msg /*: Array<String>*/) {
  console.log(msg.join('\n'));
}

function redBadge(label /*: string */) {
  return chalk.bgRed.black(` ${label} `);
}

function devServerBanner(
  {
    entry,
    workspaces,
    workspacesGlob,
    isAll,
    port,
    host,
  } /*: { entry: string, workspaces: Array<{ name: string, dir: string }>, workspacesGlob: string, isAll: boolean, port: number, host: string } */,
) {
  const msg /*: Array<any> */ = [''];

  if (isAll) {
    msg.push(chalk.blue(`Running with ${chalk.bold('"all"')} packages.`));
  } else {
    msg.push(
      chalk.blue(
        `Running with packages matching ${chalk.bold(
          '"' + workspacesGlob + '"',
        )} pattern:`,
      ),
      '',
      ...workspaces.map(
        ws => `– ${ws.name}   ${chalk.dim('[' + ws.dir + ']')}`,
      ),
    );
  }

  const serverUrl = `http://${host}:${port}`;
  msg.push('', chalk.bold(`> Open ${chalk.yellow(serverUrl)}`), '');

  return msg;
}

function buildBanner() /*: any */ {
  return [
    '',
    chalk.yellow(`Building with ${chalk.bold('"all"')} packages.`),
    '',
  ];
}

function errorMsg(
  { title, msg } /*: { title: string, msg: string } */,
) /*: any */ {
  return ['', chalk.red(`${redBadge('ERROR')} ${title}:`), '', msg, ''];
}

module.exports = { devServerBanner, buildBanner, errorMsg, print };
