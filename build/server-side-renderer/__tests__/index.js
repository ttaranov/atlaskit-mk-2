/**
 * @jest-environment node
 */
// @flow
import { testSSRAll } from '..';

const fs = require('fs');

function getDirectories(path) {
  return fs.readdirSync(path).filter(function(file) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
}

getDirectories('./packages/core').forEach(pkgName => {
  testSSRAll(pkgName);
});
