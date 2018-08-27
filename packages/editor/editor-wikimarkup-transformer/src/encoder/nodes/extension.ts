import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';

import { unknown } from './unknown';

export const extension: NodeEncoder = (node: PMNode): string => {
  if (node.attrs.extensionType === 'com.atlassian.jira.macro') {
    const paramString =
      node.attrs.parameters && node.attrs.parameters.rawAttrs
        ? `:${node.attrs.parameters.rawAttrs}`
        : '';
    return `{${node.attrs.extensionKey}${paramString}}${node.attrs.text}{${
      node.attrs.extensionKey
    }}`;
  }

  return unknown(node);
};
