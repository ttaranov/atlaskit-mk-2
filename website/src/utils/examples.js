import sentenceCase from 'sentence-case';

const examples = require('!pyarn-query-loader?{workspaceFiles:{examples:"examples/*.js"}}!');

function basename(path) {
  return path.split('/').pop();
}

function removeLeadingNumber(path) {
  return path.split('-')[1];
}

function removeSuffix(path) {
  return path.replace('.js', '');
}

function formatCodeImports(component, code) {
  return code.replace(/\.\.\/src/g, `@atlaskit/${component}`);
}

export function formatExampleLink(name) {
  return basename(removeSuffix(name));
}

export function formatExampleName(name) {
  return sentenceCase(removeLeadingNumber(removeSuffix(basename(name))));
}

export function getExampleData(group, name, example) {
  const path = `./${group}/${name}/examples/${example}.js`;
  return {
    code: formatCodeImports(name, requireContextRaw(path)),
    Component: requireContext(path).default,
  };
}

export function filterExamplesByPackage(name) {
  return examples.workspaces.filter(w => w.pkg.name.split('/')[1] === name)[0].files.examples.map(e => e.filePath);
}
