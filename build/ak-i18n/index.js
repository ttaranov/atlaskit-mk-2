//@flow
const path = require('path');
const fs = require('fs');
const meow = require('meow');
const chalk = require('chalk');

const extractCommand = require('./extract');
const pushCommand = require('./push');
const pullCommand = require('./pull');

function errorAndExit(msg) {
  console.error(chalk.red(msg));
  process.exit(1);
}

async function run() {
  const cli = meow(
    `
    Usage
      $ ak-i18n <command> path/to/package

    Options
      --searchDir Override the default directory that ak-i18n will search in when extracting translation strings (relative to the package you point to)
                  [Default: dist/es2015]
      --cwd       Override the current working directory
                  [Default: process.cwd()]

    Examples
      $ ak-i18n extract packages/search/global-search
      $ ak-i18n push packages/search/global-search
      $ ak-i18n pull packages/search/global-search

      $ ak-i18n extract packages/core/avatar --searchDir dist/esm

    Notes
      ak-i18n extract will look in dist/es2015 by default, this can be overridden using the searchDir flag.
      ak-i18n will extract translation strings into the path/to/package/translations.pot
      ak-18n can only extract messages from files that **import** react-intl. That means esm/es2015 only.
      ak-18n can only extract messages that use \`defineMessages\`, \`FormattedMessage\` is not supported.
  `,
    {
      flags: {
        searchDir: {
          type: 'string',
          default: 'dist/es2015',
        },
        cwd: {
          type: 'string',
          default: process.cwd(),
        },
      },
    },
  );
  if (cli.input.length !== 2) {
    errorAndExit('Usage: $ ak-i18n <command> path/to/package');
  }

  const [command, packagePath] = cli.input;
  const { searchDir } = cli.flags;
  const allowedCommands = ['extract', 'push', 'pull'];

  if (!allowedCommands.includes(command)) {
    errorAndExit(
      `Invalid command "${command}".\nMust be one of "extract", "pull" or "push"`,
    );
  }

  const absPathToPackage = path.resolve(path.join(cli.flags.cwd, packagePath));
  if (!fs.existsSync(absPathToPackage)) {
    errorAndExit(`Unable to find packagePath ${packagePath}`);
  }

  if (command === 'extract') {
    const dirToSearch = path.join(absPathToPackage, searchDir);
    if (!fs.existsSync(dirToSearch)) {
      errorAndExit(`Unable to find directory "${dirToSearch}".`);
    }

    await extractCommand(absPathToPackage, searchDir);
  } else if (command === 'push') {
    await pushCommand(absPathToPackage);
  } else if (command === 'pull') {
    await pullCommand(absPathToPackage);
  }
}

(async () => {
  process.on('unhandledRejection', err => {
    throw err;
  });
  await run();
})();
