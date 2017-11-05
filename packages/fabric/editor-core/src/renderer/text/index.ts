import {
  Fragment,
  Node as PMNode,
  Schema,
} from 'prosemirror-model';

import { Serializer } from '@atlaskit/renderer';

const HARDBREAK_NODE_TYPE = 'hardBreak';
const IGNORE_NODE_TYPES = [
  'bulletList',
  'orderedList',
  'heading',
  'rule',
  'panel',
  'table',
];

interface Node {
  content?: Node[];
  text?: string;
}

const getText = (node: PMNode): string => {
  return node.type.name === HARDBREAK_NODE_TYPE
    ? '\n'
    : node.attrs.text || node.attrs.shortName || node.text;
};

const reduceTree = (fragment: Fragment): Node[] => {
  let fragmentContainsInlineNodes = false;
  let textChunks = '';
  let childrenChunks: Node[] = [];
  let prevNodeType: string;

  fragment.forEach(node => {
    fragmentContainsInlineNodes = fragmentContainsInlineNodes || node.isInline;

    if (fragmentContainsInlineNodes) {
      if (prevNodeType === HARDBREAK_NODE_TYPE && node.type.name === HARDBREAK_NODE_TYPE) {
        // pass: ignore multiple hardBreaks
      } else {
        textChunks += getText(node);
      }
    } else {
      if (IGNORE_NODE_TYPES.indexOf(node.type.name) !== -1) {
        // pass: ignore these nodes
      } else if (!node.childCount) {
        childrenChunks.push({ text: getText(node) } as Node);
      } else if (node.type.name === 'mediaGroup') {
        // count children which are media files
        // ignore card links
        let childMediaFilesCount = 0;

        node.content.forEach(childNode => {
          if (childNode.attrs.type === 'file') {
            childMediaFilesCount += 1;
          }
        });

        if (childMediaFilesCount) {
          const postfix = childMediaFilesCount > 1 ? 'Files' : 'File';
          childrenChunks.push({ text: `📎 ${childMediaFilesCount} ${postfix}` } as Node);
        }
      } else if (node.type.name === 'blockquote') {
        childrenChunks.push({
          content: reduceTree(node.content),
          text: '> ',
        });
      } else {
        childrenChunks.push({ content: reduceTree(node.content) });
      }
    }

    prevNodeType = node.type.name;
  });

  return fragmentContainsInlineNodes
    ? [{ text: textChunks } as Node]
    : childrenChunks;
};

const serializeTree = (node: Node): string => {
  if (node.content) {
    return node.content!.map(childNode => {
      return (node.text || '') + serializeTree(childNode);
    }).join('\n');
  }

  return node.text!;
};

const serializeFragment = (fragment: Fragment): string => {
  const tree: Node = { content: reduceTree(fragment) };
  return serializeTree(tree);
};

export default class TextSerializer implements Serializer<string> {
  serializeFragment(fragment: Fragment): string {
    return serializeFragment(fragment);
  }

  static fromSchema(schema: Schema): TextSerializer {
    return new TextSerializer();
  }
}
