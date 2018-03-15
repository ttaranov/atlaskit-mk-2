import { NodeSpec } from 'prosemirror-model';
import { Definition as Paragraph } from './paragraph';
import { Definition as OrderedList } from './ordered-list';
import { Definition as BulletList } from './bullet-list';

export interface ListItemArray
  extends Array<Paragraph | OrderedList | BulletList> {
  0: Paragraph;
}

/**
 * @name listItem_node
 */
export interface Definition {
  type: 'listItem';
  /**
   * @minItems 1
   */
  content: ListItemArray;
}

export const listItem: NodeSpec = {
  content: 'paragraph (paragraph | bulletList | orderedList)*',
  defining: true,
  parseDOM: [{ tag: 'li' }],
  toDOM() {
    return ['li', 0];
  },
};
