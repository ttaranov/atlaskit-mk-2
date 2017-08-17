// @flow
const spawn = require('projector-spawn');
const jest = require('projector-jest');
const path = require('path');

exports.build = async () => {
  await spawn('babel', ['src', '-d', 'dist/cjs'], {
    cwd: path.join(__dirname, 'components', 'badge'),
  });
};

exports.test = async () => {
  await jest.test({
    rootDir: __dirname,
  });
};
