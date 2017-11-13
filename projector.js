// @flow

const release = require('./build/releases/release');
const changeset = require('./build/releases/changeset');
const karma = require('projector-karma');
const getKarmaConfig = require('./build/karma-config');

exports.changeset = async () => {
  await changeset.run();
};

exports.release = async () => {
  await release.run({ cwd: __dirname });
};

exports['test:browser'] = async (
  { watch, browserstack } /*: { watch: boolean, browserstack: boolean }*/,
) => {
  const config = await getKarmaConfig({
    cwd: process.cwd(),
    watch,
    browserstack,
  });
  await karma.run({ config, files: [] });
};
