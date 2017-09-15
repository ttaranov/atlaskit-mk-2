// @flow

const loaderUtils = require('loader-utils');
const path = require('path');
const pyarnQuery = require('pyarn-query');

module.exports = async function extractReactTypesLoader() {
  const opts = loaderUtils.getOptions(this);
  const data = await pyarnQuery(opts);
  const load = [];
  const read = [];
  data.workspaces.forEach(({ dir, files }) => {
    Object.keys(files).forEach(key => {
      files[key].forEach(({ fileContents, filePath }) => {
        const dirParts = dir.split(path.sep);
        dirParts.pop();
        dirParts.pop();

        const translatedFilePath = filePath.replace(dirParts.join(path.sep), '').substring(1);
        load.push(`'${translatedFilePath}': function () { return import('${filePath}'); }`);
        read.push(`'${translatedFilePath}': ${JSON.stringify(fileContents)}`);
      });
    });
  });
  return `export default {
    data: ${JSON.stringify(data)},
    load: {${load.join(',')}},
    read: {${read.join(',')}}
  };`;
};
