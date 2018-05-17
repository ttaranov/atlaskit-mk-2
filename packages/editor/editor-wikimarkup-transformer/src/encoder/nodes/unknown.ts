import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';

export const unknown: NodeEncoder = (node: PMNode): string => {
  const content = JSON.stringify(node.toJSON());
  return node.isBlock
    ? `{adf:display=block}
${content}
{adf}`
    : `{adf:display=inline}${content}{adf}`;
};
