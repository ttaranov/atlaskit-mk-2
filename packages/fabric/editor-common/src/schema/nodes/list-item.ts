import { NodeSpec } from 'prosemirror-model';
import { Definition as Paragraph } from './paragraph';
import { Definition as OrderedList } from './ordered-list';
import { Definition as BulletList } from './bullet-list';

/**
 * @name listItem_node
 */
export interface Definition {
  type: 'listItem';
  /**
   * @minItems 1
   */
  content: Array<Paragraph | OrderedList | BulletList>;
}

export const listItem: NodeSpec = {
  content: 'paragraph (paragraph | bulletList | orderedList)*',
  defining: true,
  parseDOM: [{ tag: 'li' }],
  toDOM() {
    return ['li', 0];
  },
};
