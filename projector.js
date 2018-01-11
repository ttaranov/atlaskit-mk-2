// @flow

const release = require('./build/releases/release');
const karma = require('projector-karma');
const { getKarmaConfig } = require('./build/karma-config');

exports.release = async () => {
  await release.run({ cwd: __dirname });
};

const runKarma = async ({ watch, browserstack }) => {
  const config = await getKarmaConfig({
    cwd: process.cwd(),
    watch,
    browserstack,
  });
  await karma.run({ config, files: [] });
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
