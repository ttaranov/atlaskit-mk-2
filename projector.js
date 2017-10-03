// @flow

const release = require('./build/releases/release');
const changeset = require('./build/releases/changeset');

exports.changeset = async () => {
  await changeset.run({
    rootDir: __dirname,
  });
};

exports.release = async () => {
  await release.run({
    rootDir: __dirname,
  });
};
