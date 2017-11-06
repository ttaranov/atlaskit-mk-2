import { NodeSpec } from 'prosemirror-model';
import { Definition as ListItemNode } from './list-item';

/**
 * @name bulletList_node
 */
export interface Definition {
  type: 'bulletList';
  /**
   * @minItems 1
   */
  content: Array<ListItemNode>;
}

export const bulletList: NodeSpec = {
  group: 'block',
  content: 'listItem+',
  parseDOM: [{ tag: 'ul' }],
  toDOM() {
    return ['ul', 0];
  }
};
