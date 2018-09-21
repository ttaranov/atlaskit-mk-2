#!/usr/bin/env node
//@flow
const path = require('path');
const fs = require('fs');
const meow = require('meow');

const { errorAndExit } = require('./utils');
const {
  TRANSIFEX_PROJECT_NAME,
  checkTransifexEnvVar,
} = require('./utils/transifex');
const pushCommand = require('./push');
const pullCommand = require('./pull');

const ALLOWED_COMMANDS = ['push', 'pull'];
const CLI_DEFAULT_USAGE = `$ i18n-tools <command> --resource name path/to/package\nCommands: ${ALLOWED_COMMANDS.join(
  ', ',
)}`;

function createApp() {
  const cli = meow(
    `
    Usage
      ${CLI_DEFAULT_USAGE}

    Options
      --resource    Transifex resource name
      --project     Override Transifex project name
                    [Default: ${TRANSIFEX_PROJECT_NAME}]
      --searchDir   Override the default directory that i18n-tools will search in when extracting translation strings (relative to the package you point to)
                    [Default: dist/es2015]
      --dry         Dry run - extract messages without pushing to Transifex (push command only)
      --outputDir   Override the default directory that i18n-tools will store downloaded translations (relative to the package you point to)
                    [Default: src/i18n]
      --outputType  Override the default file type that i18n-tools will use to store the translation files
                    [Default: javascript]
      --cwd         Override the current working directory
                    [Default: process.cwd()]

    Examples
      $ i18n-tools push --resource global-search packages/search/global-search
      $ i18n-tools pull --resource media packages/media/media-card

      $ i18n-tools push --resource core --searchDir dist/esm packages/core/avatar
      $ i18n-tools pull --resource editor-core --outputType typescript packages/editor/editor-core

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
        dry: {
          type: 'boolean',
          default: false,
        },
        outputDir: {
          type: 'string',
          default: 'src/i18n',
        },
        outputType: {
          type: 'string',
          default: 'javascript',
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

  checkTransifexEnvVar();

  if (cli.input.length !== 2) {
    errorAndExit(`Usage: ${CLI_DEFAULT_USAGE}`);
  }

  const [command, packagePath] = cli.input;
  const {
    project,
    resource,
    searchDir,
    dry,
    outputDir,
    outputType,
  } = cli.flags;

  if (!resource) {
    errorAndExit(
      `Transifex resource name is required!\nUsage: ${CLI_DEFAULT_USAGE}`,
    );
  }

  if (!ALLOWED_COMMANDS.includes(command)) {
    errorAndExit(
      `Invalid command "${command}".\nMust be one of "pull" or "push"`,
    );
  }

  const absPathToPackage = path.resolve(path.join(cli.flags.cwd, packagePath));
  if (!fs.existsSync(absPathToPackage)) {
    errorAndExit(`Unable to find packagePath ${packagePath}`);
  }

  const options = { absPathToPackage, project, resource };
  const pushOptions = { ...options, searchDir, dry };
  const pullOptions = { ...options, outputDir, outputType };

  return command === 'push'
    ? pushCommand(pushOptions)
    : pullCommand(pullOptions);
}

createApp().catch(errorAndExit);
