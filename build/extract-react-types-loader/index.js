// @flow

const path = require('path');
const extractReactTypes = require('extract-react-types');

module.exports = function extractReactTypesLoader(content /* : string */) {
  const filename = this.resource;
  const ext = path.extname(filename);
  const typeSystem = ext === '.ts' || ext === '.tsx' ? 'typescript' : 'flow';

  const resolveOptions = {
    pathFilter: (pkg, b, c) => {
      if (pkg && pkg['atlaskit:src'] && b.includes('node_modules')) {
        let returnVal = b.replace(c, pkg['atlaskit:src']);
        return returnVal;
      }
      return null;
    },
  };

  const types = extractReactTypes(
    content,
    typeSystem,
    filename,
    resolveOptions,
  );

  return `module.exports = ${JSON.stringify(types)}`;
};
