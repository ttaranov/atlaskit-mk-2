import sentenceCase from 'sentence-case';

const requireContext = require.context('../../../packages/', true, /^\.\/(elements|fabric)\/[\w\d-_]+\/examples\/.*\.js$/);
const requireContextRaw = require.context('!raw-loader!../../../packages/', true, /^\.\/(elements|fabric)\/[\w\d-_]+\/examples\/.*\.js$/);

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
  return requireContext.keys().filter(e => e.indexOf(`/${name}/`) > -1);
}
