const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const makeDir = require('make-dir');
const css = require('../src/index');

const writeFile = promisify(fs.writeFile);
const DIST = path.join(__dirname, '..', 'dist');

async function buildCSSReset() {
  try {
    await makeDir(DIST);
    await writeFile(path.join(DIST, 'css-reset.css'), css);
  } catch (err) {
    console.error(`Failed to build css-reset due to ${err}`);
  }
}

buildCSSReset().then(() => {
  console.log('successfully build css-reset');
});
