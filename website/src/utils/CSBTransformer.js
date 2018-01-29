import { getParameters } from 'codesandbox/lib/api/define';

const staticFiles = {
  'index.html': {
    content: '<div id="root"></div>',
  },
  'index.js': {
    content: `import React from 'react';
import ReactDOM from 'react-dom';
import Example from './example';

ReactDOM.render(
<Example />,
document.getElementById('root')
);`,
  },
};

const newpkgJSON = dependencies => `{
  "name": "atlaskit-example",
  "version": "0.0.0",
  "description": "An atlaskit example deployed to codesandbox",
  "main": "index.js",
  "dependencies": ${JSON.stringify(dependencies)}
}`;

const addDep = (pkgJSON, name, deps) => {
  // We are deliberately putting depencies as the last assigned as we will care most about the versions of depencies over other types
  const dependencies = Object.assign(
    {},
    pkgJSON.peerDependencies,
    pkgJSON.devDependencies,
    pkgJSON.dependencies,
  );
  for (let dependency in dependencies) {
    if (name.includes(dependency)) deps[dependency] = dependencies[dependency];
  }
};

const ensureReact = deps => {
  if (!deps.react && !deps['react-dom']) {
    deps.react = 'latest';
    deps['react-dom'] = 'latest';
  } else if (!deps.react) {
    deps.react = deps['react-dom'];
  } else if (!deps['react-dom']) {
    deps['react-dom'] = deps.react;
  }
};

// const actionOnImports = (data, onRelative = () => {}, onAbsolute = () => {}, onAll = () => {}) => {
//   const regex = /import (.*) from ["'](.*)["']/g;
//   const relativeRegex = /^\./;
//
//   const imports = exampleCode.match(regex);
//   for (let mpt of imports) {
//     let [importStr, name, source] = /import (.*) from ["'](.*)["']/.exec(mpt);
//     if (relativeRegex.test(source)) {
//       onRelative(data, importStr, source)
//       let local = handleRelativeImport(exampleCode, pkgJSON, importStr, source);
//     } else {
//       onAbsolute()
//
//       addDep(pkgJSON, source, deps);
//     }
//   }
// }

const getCSBData = (example, pkgJSON, handleRelativeImport) => {
  let exampleCode = example;
  const deps = {};
  deps[pkgJSON.name] = pkgJSON.version;

  const regex = /import (.*) from ["'](.*)["']/g;
  const relativeRegex = /^\./;

  const imports = exampleCode.match(regex);

  for (let mpt of imports) {
    let [complete, name, source] = /import (.*) from ["'](.*)["']/.exec(mpt);
    if (relativeRegex.test(source)) {
      exampleCode = handleRelativeImport(
        exampleCode,
        pkgJSON,
        complete,
        source,
      );
    } else {
      addDep(pkgJSON, source, deps);
    }
  }
  ensureReact(deps);

  const files = Object.assign({}, staticFiles, {
    'example.js': { content: exampleCode },
    'package.json': { content: newpkgJSON(deps) },
  });

  const data = { parameters: getParameters({ files }) };

  return { files, params: getParameters({ files }) };
};

export default getCSBData;
