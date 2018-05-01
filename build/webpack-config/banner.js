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
  // flowlint-next-line unclear-type:off
  const msg /*: Array<any> */ = [''];
  const wsNamePadLength = workspaces.reduce(
    (acc, ws) => (ws.name.length > acc ? ws.name.length : acc),
    0,
  );

  const serverUrl = `http://${host}:${port}`;
  msg.push(chalk.bold(`> Open ${chalk.yellow(serverUrl)}`), '');

  if (isAll) {
    msg.push(
      chalk.blue(`Running dev server with ${chalk.bold('"all"')} packages.`),
    );
  } else {
    msg.push(
      chalk.blue(
        `Running dev server with packages matching ${chalk.bold(
          '"' + workspacesGlob + '"',
        )} pattern:`,
      ),
      '',
      ...workspaces.map(
        ws =>
          `– ${ws.name.padEnd(wsNamePadLength, ' ')}   ${chalk.dim(
            `[http://${host}:${port}/packages${ws.dir.split('packages')[1]}]`,
          )}`,
      ),
    );
  }

  msg.push('');

  return msg;
}

// flowlint-next-line unclear-type:off
function buildBanner() /*: any */ {
  return [
    '',
    chalk.yellow(`Building with ${chalk.bold('"all"')} packages.`),
    '',
  ];
}

function errorMsg(
  { title, msg } /*: { title: string, msg: string } */,
) // flowlint-next-line unclear-type:off
/*: any */ {
  return ['', chalk.red(`${redBadge('ERROR')} ${title}:`), '', msg, ''];
}

module.exports = { devServerBanner, buildBanner, errorMsg, print };
