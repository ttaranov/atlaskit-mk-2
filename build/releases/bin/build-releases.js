#!/usr/bin/env node

const changesetCommand = require('../changeset/changesetCommand');
const versionCommand = require('../version/versionCommand');
const publishCommand = require('../publish/publishCommand');

const args = process.argv.slice(2);
const VALID_COMMANDS = ['changeset', 'version', 'publish'];
if (args.length < 1) {
  console.error('Expected a command to run');
  console.error('`build-releases [changeset|version|publish]`');
  process.exit(1);
}

const command = args[0];
const flags = args.filter(arg => arg.startsWith('--'));

if (!VALID_COMMANDS.includes(command)) {
  console.error(
    `Invalid command ${command}, expected one of [${VALID_COMMANDS}]`,
  );
}

if (command === 'changeset') {
  changesetCommand({ cwd: process.cwd() });
} else if (command === 'version') {
  versionCommand({
    cwd: process.cwd(),
    noChangelog: flags.includes('--noChangelog'),
  });
} else if (command === 'publish') {
  publishCommand({
    cwd: process.cwd(),
    publicFlag: flags.includes('--public'),
  });
}

process.on('unhandledRejection', e => {
  console.error('There was an unhandled rejection in this script');
  throw e;
});
