// @flow
const fs = require('fs');
const path = require('path');

const testSuiteName = path.basename(path.resolve(__dirname, '..'));

jest.autoMockOff();
const { runInlineTest } = require('jscodeshift/dist/testUtils');

// $FlowFixMe - in require it should be a string litteral
const transformFn = require(path.resolve(__dirname, '..', 'src', 'index.js')); // eslint-disable-line

function getFixtureFiles() {
  return fs
    .readdirSync(path.resolve(__dirname, '..', '__fixtures__'))
    .filter(x => x.includes('.js'));
}

// Reads a fixture file (which contains input and expected) and returns an array
function getFixtureParts(testFixture) {
  const src = fs.readFileSync(
    path.resolve(__dirname, '..', '__fixtures__', testFixture),
    { encoding: 'utf8' },
  );
  return src.split('//////');
}

const focusedTestFile = false; // e.g. GridSize_e.js

describe(testSuiteName, () => {
  getFixtureFiles().forEach(testFixture =>
    (!focusedTestFile || testFixture === focusedTestFile ? it : it.skip)(
      testFixture,
      () => {
        const [testInput, expectedOutput] = getFixtureParts(testFixture);
        runInlineTest(transformFn, null, { source: testInput }, expectedOutput);
      },
    ),
  );
});
