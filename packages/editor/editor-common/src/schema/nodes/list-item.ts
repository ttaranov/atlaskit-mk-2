import { NodeSpec, Node as PMNode } from 'prosemirror-model';
import { ParagraphDefinition as Paragraph } from './paragraph';
import { OrderedListDefinition as OrderedList } from './ordered-list';
import { BulletListDefinition as BulletList } from './bullet-list';
import { MediaSingleDefinition as MediaSingle } from './media-single';
import { EmojiAttributes } from './emoji';

export interface ListItemArray
  extends Array<Paragraph | OrderedList | BulletList | MediaSingle> {
  0: Paragraph | MediaSingle;
}

export interface ListItemAttributes {
  emojiBullet?: EmojiAttributes;
}

/**
 * @name listItem_node
 */
export interface ListItemDefinition {
  type: 'listItem';
  /**
   * @minItems 1
   */
  content: ListItemArray;
  attrs: ListItemAttributes;
}

export const listItem: NodeSpec = {
  content:
    '(paragraph | mediaSingle) (paragraph | bulletList | orderedList | mediaSingle)*',
  defining: true,
  attrs: {
    emojiBullet: { default: null },
  },
  parseDOM: [
    {
      tag: 'li',
      getAttrs: (dom: Element) => ({
        emojiBullet: JSON.parse(dom.getAttribute('data-emojiBullet') || '{}'),
      }),
    },
  ],
  toDOM(node: PMNode) {
    const { emojiBullet } = node.attrs;
    const attrs = {
      'data-emojiBullet': JSON.stringify(emojiBullet),
    };
    return ['li', attrs, 0];
  },
};
