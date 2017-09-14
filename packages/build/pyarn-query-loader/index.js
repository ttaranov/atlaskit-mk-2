// @flow

const loaderUtils = require('loader-utils');
const pyarnQuery = require('pyarn-query');

module.exports = async function extractReactTypesLoader(content /* : string */) {
  const opts = loaderUtils.getOptions(this);
  return `module.exports = ${JSON.stringify(await pyarnQuery(opts))}`;
};
