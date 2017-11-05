import { NodeSpec } from 'prosemirror-model';
import { TopLevel } from './doc';

/**
 * @name listItem_node
 */
export interface Definition {
  type: 'listItem';
  content: TopLevel;
}

export const listItem: NodeSpec = {
  content: 'paragraph (paragraph | bulletList | orderedList)*',
  defining: true,
  parseDOM: [{ tag: 'li' }],
  toDOM() {
    return ['li', 0];
  }
};
