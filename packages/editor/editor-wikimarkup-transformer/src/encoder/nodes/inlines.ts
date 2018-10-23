import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';

import { emoji } from './emoji';
import { hardBreak } from './hard-break';
import { mention } from './mention';
import { text } from './text';

const inlinesEncoderMapping = {
  emoji,
  hardBreak,
  mention,
  text,
};

export const inlines: NodeEncoder = (node: PMNode, parent?: PMNode): string => {
  return inlinesEncoderMapping[node.type.name](node, parent);
};
