import { NodeSpec } from 'prosemirror-model';
import { Definition as Paragraph } from './paragraph';
import { Definition as OrderedList } from './ordered-list';
import { Definition as BulletList } from './bullet-list';
import { Definition as MediaSingle } from './media-single';

export interface ListItemArray
  extends Array<Paragraph | OrderedList | BulletList | MediaSingle> {
  0: Paragraph | MediaSingle;
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
  content:
    '(paragraph | mediaSingle) (paragraph | bulletList | orderedList | mediaSingle)*',
  defining: true,
  parseDOM: [{ tag: 'li' }],
  draggable: true,
  toDOM() {
    return ['li', { draggable: true }, 0];
  },
};
