import { NodeSpec } from 'prosemirror-model';
import { Definition as Paragraph } from './paragraph';
import { Definition as OrderedList } from './ordered-list';
import { Definition as BulletList } from './bullet-list';
import { Definition as MediaGroup } from './media-group';
import { Definition as MediaSingle } from './media-single';

export interface ListItemArray
  extends Array<
      Paragraph | OrderedList | BulletList | MediaGroup | MediaSingle
    > {
  0: Paragraph | MediaGroup | MediaSingle;
  1: Paragraph | OrderedList | BulletList | MediaGroup | MediaSingle;
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
    '(paragraph | mediaGroup | mediaSingle) (paragraph | bulletList | orderedList)*',
  defining: true,
  parseDOM: [{ tag: 'li' }],
  toDOM() {
    return ['li', 0];
  },
};
