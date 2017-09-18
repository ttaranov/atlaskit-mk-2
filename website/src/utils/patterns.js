// @flow

import sentenceCase from 'sentence-case';
// $FlowFixMe
import patterns from 'pyarn-query-loader?{workspaceFiles:{patterns:"pattern/index.js"}}!';
import { removeNumericPrefix } from './path';

import type { ExampleOrPattern } from './types';

export function getKey(pattern: string) {
  return pattern.split('patterns/')[1].split('/')[0];
}

export function getName(pattern: string) {
  return sentenceCase(removeNumericPrefix(pattern));
}

export async function getData(pattern: string): ExampleOrPattern {
  const key = `patterns/${pattern}/pattern/index.js`;
  return {
    codeText: patterns.read[key],
    CodeNode: (await patterns.load[key]()).default,
  };
}

export function getList() {
  return patterns.data.workspaces.reduce((p, c) => p.concat(...c.files.patterns), []).map(({ filePath }) => {
    const key = getKey(filePath);
    return {
      key,
      name: getName(key),
    };
  });
}
