// @flow
const bolt = require('bolt');
const globby = require('globby');
const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const sentenceCase = require('sentence-case');

function normalize(filePath) {
  return filePath
    .split('/')
    .pop()
    .replace(/^[\d]+-/, '')
    .slice(0, -2);
}

function titleize(filePath) {
  return sentenceCase(normalize(filePath));
}

module.exports = async function getAllDesignExamples() {
  const projectDir = (await bolt.getProject({
    cwd: process.cwd(),
  })).dir;
  const files /*: Array<string> */ = await globby(
    [
      'packages/**/examples/design-examples/*.js',
      '!packages/**/node_modules/**',
      '!node_modules/**',
    ],
    {
      cwd: projectDir,
    },
  );

  let fileContent = 'export default [';

  files.forEach((file, index) => {
    fileContent = fileContent.concat(`
      {name: '${titleize(file)}', componentPath: '${file}'},
    `);
  });
  fileContent = fileContent.concat('];');
  return fileContent;
};
