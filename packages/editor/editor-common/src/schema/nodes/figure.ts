import { Node, NodeSpec } from 'prosemirror-model';
import { Inline } from './doc';

/**
 * @name caption_node
 */
export interface CaptionDefinition {
  type: 'caption';
  content: Array<Inline>;
}

export const caption: NodeSpec = {
  inline: false,
  group: 'block',
  content: 'inline*',
  isolating: true,

  parseDOM: [
    {
      tag: 'figcaption',
    },
  ],
  toDOM(node: Node) {
    return ['figcaption', 0];
  },
};
