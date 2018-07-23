import { NodeSpec } from 'prosemirror-model';
import { ParagraphDefinition as Paragraph } from './paragraph';
import { OrderedListDefinition as OrderedList } from './ordered-list';
import { BulletListDefinition as BulletList } from './bullet-list';
import { MediaSingleDefinition as MediaSingle } from './media-single';

export interface ListItemArray
  extends Array<Paragraph | OrderedList | BulletList | MediaSingle> {
  0: Paragraph | MediaSingle;
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
}

export const listItem: NodeSpec = {
  content:
    '(paragraph | mediaSingle) (paragraph | bulletList | orderedList | mediaSingle)*',
  defining: true,
  parseDOM: [{ tag: 'li' }],
  toDOM() {
    return ['li', 0];
  },
};
