import { Node as PMNode } from 'prosemirror-model';

import { blockquote } from './nodes/blockquote';
import { bulletList } from './nodes/bullet-list';
import { codeBlock } from './nodes/code-block';
import { doc } from './nodes/doc';
import { heading } from './nodes/heading';
import { mediaGroup } from './nodes/media-group';
import { orderedList } from './nodes/ordered-list';
import { panel } from './nodes/panel';
import { paragraph } from './nodes/paragraph';
import { rule } from './nodes/rule';
import { table } from './nodes/table';
import { unknown } from './nodes/unknown';

export type MarkEncoder = (text: string, attrs: any) => string;
export type NodeEncoder = (node: PMNode, parent?: PMNode) => string;

const nodeEncoderMapping = {
  blockquote,
  bulletList,
  codeBlock,
  doc,
  heading,
  mediaGroup,
  mediaSingle: mediaGroup,
  orderedList,
  panel,
  paragraph,
  rule,
  table,
};

export function encode(node: PMNode): string {
  const encoder = nodeEncoderMapping[node.type.name];
  if (encoder) {
    return encoder(node);
  }
  return unknown(node);
}
