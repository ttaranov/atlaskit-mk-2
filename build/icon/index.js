// @flow
const build = require('./build');
const tidy = require('./tidy');
const createIconDocs = require('./createIconDocs');

/*::
type Config = {
  srcDir: string,
  processedDir: string,
  destDir: string,
  glob: string,
  maxWidth: number,
  maxHeight: number,
  size?: string
};
*/

module.exports = (config /*: Config */) =>
  tidy(config).then(() => build(config));

module.exports.tidy = tidy;
module.exports.build = build;
module.exports.createIconDocs = createIconDocs;
