//@flow
const path = require('path');
const fs = require('fs');
const meow = require('meow');

const { errorAndExit } = require('./utils');
const pushCommand = require('./push');
const pullCommand = require('./pull');

const TRANSIFEX_PROJECT_NAME = 'atlaskit';
const CLI_DEFAULT_USAGE =
  '$ i18n-tools <command> --resource=name path/to/package';

async function run() {
  const cli = meow(
    `
    Usage
      ${CLI_DEFAULT_USAGE}

    Options
      --resource  Transifex resource name
      --project   Override Transifex project name
                  [Default: ${TRANSIFEX_PROJECT_NAME}]
      --searchDir Override the default directory that i18n-tools will search in when extracting translation strings (relative to the package you point to)
                  [Default: dist/es2015]
      --cwd       Override the current working directory
                  [Default: process.cwd()]

    Examples
      $ i18n-tools push --resource=global-search packages/search/global-search
      $ i18n-tools pull --resource=media packages/media/media-card

      $ i18n-tools push --resource=core packages/core/avatar --searchDir dist/esm

    Notes
      i18n-tools extract will look in dist/es2015 by default, this can be overridden using the searchDir flag.
      i18n-tools can only extract messages from files that **import** react-intl. That means esm/es2015 only.
      i18n-tools can only extract messages that use \`defineMessages\`, \`FormattedMessage\` is not supported.
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
        project: {
          type: 'string',
          default: TRANSIFEX_PROJECT_NAME,
        },
        resource: {
          type: 'string',
        },
      },
    },
  );
  if (cli.input.length !== 2) {
    errorAndExit(`Usage: ${CLI_DEFAULT_USAGE}`);
  }

  const [command, packagePath] = cli.input;
  const { searchDir, project, resource } = cli.flags;

  if (!resource) {
    errorAndExit(
      `Transifex resource name is required!\nUsage: ${CLI_DEFAULT_USAGE}`,
    );
  }

  const allowedCommands = ['push', 'pull'];
  if (!allowedCommands.includes(command)) {
    errorAndExit(
      `Invalid command "${command}".\nMust be one of "pull" or "push"`,
    );
  }

  const absPathToPackage = path.resolve(path.join(cli.flags.cwd, packagePath));
  if (!fs.existsSync(absPathToPackage)) {
    errorAndExit(`Unable to find packagePath ${packagePath}`);
  }

  if (command === 'push') {
    const dirToSearch = path.join(absPathToPackage, searchDir);
    if (!fs.existsSync(dirToSearch)) {
      errorAndExit(`Unable to find directory "${dirToSearch}".`);
    }

    await pushCommand(absPathToPackage, searchDir, project, resource);
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
