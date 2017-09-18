// @flow

import sentenceCase from 'sentence-case';
// $FlowFixMe
import examples from 'pyarn-query-loader?{workspaceFiles:{examples:"examples/*.js"}}!';
import { basename, formatCodeImports, removeNumericPrefix, removeSuffix } from './path';

import type { ExampleOrPattern } from './types';

export function formatLink(name: string) {
  return basename(removeSuffix(name));
}

export function formatName(name: string) {
  return sentenceCase(removeNumericPrefix(removeSuffix(basename(name))));
}

export async function getData(group: string, name: string, example: string): ExampleOrPattern {
  const key = `${group}/${name}/examples/${example}.js`;
  return {
    codeText: formatCodeImports(name, examples.read[key]),
    CodeNode: (await examples.load[key]()).default,
  };
}

export function getList(group: string, name: string) {
  return examples.data.workspaces.filter(w => w.dir.indexOf(`${group}/${name}`) > -1)[0].files.examples.map(e => e.filePath);
}
