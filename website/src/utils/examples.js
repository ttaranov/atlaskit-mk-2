// @flow

import sentenceCase from 'sentence-case';

import { EXAMPLES } from '../constants';
import { getWorkspace } from './packages';
import { basename, removeNumericPrefix, removeSuffix } from './path';

import type { Example } from '../types';

type List = {
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

export async function getData(workspaceName: string, examplePath: string): Example {
  const workspace = getWorkspace(workspaceName);
  const workspaceExample = workspace.files.examples.filter(e => new RegExp(`/${examplePath}.js$`).test(e.filePath))[0];
  return {
    ...workspaceExample,
    ...{
      codeText: formatCodeImports(workspace.pkg.name, workspaceExample.fileContents),
      CodeNode: (await EXAMPLES.load[workspaceExample.filePath]()).default,
    },
  };
}

export function getList(workspaceName: string): Array<List> {
  return getWorkspace(workspaceName).files.examples.map(({ filePath }) => ({
    link: formatLink(filePath),
    name: formatName(filePath),
  }));
}
