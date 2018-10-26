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
                    [Default: src]
      --dry         Dry run - extract messages without pushing to Transifex (push command only)
      --outputDir   Override the default directory that i18n-tools will store downloaded translations (relative to the package you point to)
                    [Default: src/i18n]
      --type        Override the default type that i18n-tools will use to find & store translations
                    [Default: javascript]
      --cwd         Override the current working directory
                    [Default: process.cwd()]
      --ignore      A list of comma separated globs to ignore during extract
                    [Default: "**/__tests__**"]

    Examples
      $ i18n-tools push --resource global-search --type typescript packages/search/global-search
      $ i18n-tools pull --resource media-ui --type typescript packages/media/media-ui

      $ i18n-tools push --resource core --searchDir dist/esm packages/core/avatar
      $ i18n-tools pull --resource editor-core --type typescript packages/editor/editor-core

    Notes
      i18n-tools extract will look in src by default, this can be overridden using the searchDir flag.
      i18n-tools extract uses babel-plugin-transform-typescript under the hood so it shares all the caveats too https://babeljs.io/docs/en/babel-plugin-transform-typescript#caveats.
        If you are using any of those listed features then you might want to run this on your dist using \`--searchDir\`.
  `,
    {
      flags: {
        searchDir: {
          type: 'string',
          default: 'src',
        },
        dry: {
          type: 'boolean',
          default: false,
        },
        outputDir: {
          type: 'string',
          default: 'src/i18n',
        },
        type: {
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
        ignore: {
          type: 'string',
          default: '**/__tests__/**',
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
    type,
    ignore,
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
  const pushOptions = { ...options, searchDir, type, dry, ignore };
  const pullOptions = { ...options, outputDir, type };

  return command === 'push'
    ? pushCommand(pushOptions)
    : pullCommand(pullOptions);
}

createApp().catch(errorAndExit);
