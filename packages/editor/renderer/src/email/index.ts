import { fontFamily, fontSize } from '@atlaskit/theme';

import { Fragment, Node as PMNode, Schema } from 'prosemirror-model';

import { Serializer } from '../serializer';
import { nodeSerializers } from './serializers';
import { serializeStyle } from './util';
import { calcTableColumnWidths } from '@atlaskit/editor-common';

const serializeNode = (node: PMNode, serializedHTML?: string): string => {
  // ignore nodes with unknown type
  if (!nodeSerializers[node.type.name]) {
    return `[UNKNOWN_NODE_TYPE: ${node.type.name}]`;
  }

  const attrs = node.type.name === 'table' ? getTableAttrs(node) : node.attrs;

  return nodeSerializers[node.type.name]({
    attrs,
    marks: node.marks,
    text:
      serializedHTML || node.attrs.text || node.attrs.shortName || node.text,
  });
};

const getTableAttrs = (node: PMNode): any => {
  return {
    ...node.attrs,
    columnWidths: calcTableColumnWidths(node),
  };
};

const traverseTree = (fragment: Fragment): string => {
  let output = '';

  fragment.forEach(childNode => {
    if (childNode.isLeaf) {
      output += serializeNode(childNode);
    } else {
      const innerHTML = traverseTree(childNode.content);
      output += serializeNode(childNode, innerHTML);
    }
  });

  return output;
};

const wrapperCSS = serializeStyle({
  'font-family': fontFamily(),
  'font-size': fontSize(),
  'font-weight': 400,
  'line-height': '24px',
});

export default class EmailSerializer implements Serializer<string> {
  serializeFragment(fragment: Fragment): string {
    const innerHTML = traverseTree(fragment);
    return `<div style="${wrapperCSS}">${innerHTML}</div>`;
  }

  static fromSchema(schema: Schema): EmailSerializer {
    return new EmailSerializer();
  }
}
