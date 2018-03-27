import { NodeSpec, Node } from 'prosemirror-model';
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
  attrs?: {
    /**
     * @minimum 0
     * @maximum 6
     */
    indentLevel?: number;
  };
}

export const bulletList: NodeSpec = {
  attrs: { indentLevel: { default: 0 } },
  group: 'block',
  content: 'listItem+',
  parseDOM: [
    {
      tag: 'ul',
      getAttrs: (dom: HTMLElement) => ({
        indentLevel: parseInt(dom.getAttribute('data-indent-level') || '0', 10),
      }),
    },
  ],
  toDOM(node: Node) {
    const attrs = {
      'data-indent-level': node.attrs.indentLevel,
    };
    return ['ul', attrs, 0];
  },
};
