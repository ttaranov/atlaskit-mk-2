import sentenceCase from 'sentence-case';

const requireContext = require.context('../../../components/', true, /.*\/examples\/.*\.js$/);
const requireContextRaw = require.context('!raw-loader!../../../components/', true, /.*\/examples\/.*\.js$/);

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

export function getExampleData(component, example) {
  const path = `./${component}/examples/${example}.js`;
  return {
    code: formatCodeImports(component, requireContextRaw(path)),
    Component: requireContext(path).default,
  };
}

export function filterExamplesByPackage(name) {
  return requireContext.keys().filter(e => e.indexOf(name) > -1);
}
