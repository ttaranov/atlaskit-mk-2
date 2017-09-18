// @flow

import sentenceCase from 'sentence-case';

import { EXAMPLES } from '../constants';
import { getWorkspace } from './packages';
import { basename, removeNumericPrefix, removeSuffix } from './path';

import type { Example } from '../types';

export type List = {
  link: string,
  name: string,
};

export function formatCodeImports(packageName: string, code: string): string {
  return code.replace(/\.\.\/src/g, packageName);
}

export function formatLink(link: string): string {
  return basename(removeSuffix(link));
}

export function formatName(name: string): string {
  return sentenceCase(removeNumericPrefix(removeSuffix(basename(name))));
}

export async function getData(workspaceName: string, examplePath: string): Promise<Example> {
  const workspace = getWorkspace(workspaceName);
  const workspaceExamples = workspace.files.examples.filter(e => {
    return new RegExp(`/${examplePath}.js$`).test(e.filePath);
  });
  const workspaceExample = workspaceExamples[0];

  const exampleModule = await EXAMPLES.load[workspaceExample.filePath]();

  const codeText = formatCodeImports(workspace.pkg.name, workspaceExample.fileContents);
  const CodeNode = exampleModule.default;

  return {
    codeText,
    CodeNode,
  };
}

export function getList(workspaceName: string): Array<List> {
  return getWorkspace(workspaceName).files.examples.map(({ filePath }) => ({
    link: formatLink(filePath),
    name: formatName(filePath),
  }));
}
