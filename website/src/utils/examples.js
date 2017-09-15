// @flow

import sentenceCase from 'sentence-case';
// $FlowFixMe
import examples from 'pyarn-query-loader?{workspaceFiles:{examples:"examples/*.js"}}!';

function basename(path) {
  return path.split('/').pop();
}

function removeLeadingNumber(path) {
  return path.split('-')[1];
}

function removeSuffix(path) {
  return path.replace('.js', '');
}

function formatCodeImports(packageName, code) {
  return code.replace(/\.\.\/src/g, packageName);
}

export function formatExampleLink(name /* : string */) {
  return basename(removeSuffix(name));
}

export function formatExampleName(name /* : string */) {
  return sentenceCase(removeLeadingNumber(removeSuffix(basename(name))));
}

export async function getExampleData(group /* : string*/, name /* : string*/, example /* : string */) {
  const key = `${group}/${name}/examples/${example}.js`;
  return {
    code: formatCodeImports(name, examples.read[key]),
    Component: (await examples.load[key]()).default,
  };
}

export function filterExamplesByPackage(group /* : string */, name /* : string */) {
  return examples.data.workspaces.filter(w => w.dir.indexOf(`${group}/${name}`) > -1)[0].files.examples.map(e => e.filePath);
}
