// @flow

const release = require('./build/releases/release');
const changeset = require('./build/releases/changeset');

exports.changeset = async () => {
  await changeset.run();
};

exports.release = async () => {
  await release.run({
    cwd: __dirname,
  });
};
