// @flow

const karma = require('projector-karma');
const spawn = require('spawndamnit');
const { getKarmaConfig } = require('./build/karma-config');

const log = (type /*: string */ = 'log') => (
  data /*: { toString: Function }*/,
) =>
  // eslint-disable-next-line
  console[type](data.toString());

const runKarma = async ({ watch, browserstack }) => {
  const config = await getKarmaConfig({
    cwd: process.cwd(),
    watch,
    browserstack,
  });
  await karma.run({ config, files: [] });
};

const spawnWithLog = async (...args) => {
  const child = spawn(...args);
  child.on('stdout', log());
  child.on('stderr', log('error'));
  return child;
};

exports.start = async ({ packages } /*: { packages: string } */) => {
  const args = ['start'];
  if (packages) {
    args.push(`+(${packages.split(',').join('|')})`);
  }
  await spawnWithLog('yarn', args);
};

exports.testBrowser = async (
  { watch, browserstack } /*: { watch: boolean, browserstack: boolean }*/,
) => {
  await runKarma({ watch, browserstack });
};

exports.testBrowserCI = async (
  { watch, browserstack } /*: { watch: boolean, browserstack: boolean }*/,
) => {
  await runKarma({ watch, browserstack });
};
