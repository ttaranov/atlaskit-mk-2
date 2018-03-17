import { NodeSpec, Node } from 'prosemirror-model';
import { Definition as ListItemNode } from './list-item';

/**
 * @name orderedList_node
 */
export interface Definition {
  type: 'orderedList';
  /**
   * @minItems 1
   */
  content: Array<ListItemNode>;
  attrs?: {
    /**
     * @minimum 1
     */
    order: number;
    /**
     * @minimum 0
     * @maximum 6
     */
    indentLevel?: number;
  };
}

export const orderedList: NodeSpec = {
  group: 'block',
  content: 'listItem+',
  parseDOM: [
    {
      tag: 'ol',
      getAttrs: (dom: HTMLElement) => ({
        indentLevel: parseInt(dom.getAttribute('data-indent-level') || '0'),
      }),
    },
  ],
  toDOM(node: Node) {
    const attrs = {
      'data-indent-level': node.attrs.indentLevel,
    };
    return ['ol', attrs, 0];
  },
};
