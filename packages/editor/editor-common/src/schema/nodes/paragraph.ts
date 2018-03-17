import { NodeSpec, Node } from 'prosemirror-model';
import { Inline } from './doc';

/**
 * @name paragraph_node
 */
export interface Definition {
  type: 'paragraph';
  content: Array<Inline>;
  /**
   * @minProperties 1
   */
  attrs?: {
    /**
     * @minimum 1
     * @maximum 6
     */
    indentLevel?: number;
  };
}

export const paragraph: NodeSpec = {
  attrs: { indentLevel: { default: null } },
  content: 'inline*',
  group: 'block',
  parseDOM: [
    {
      tag: 'p',
      getAttrs: (dom: HTMLElement) => ({
        indentLevel: dom.getAttribute('data-indent-level'),
      }),
    },
  ],
  toDOM(node: Node) {
    const attrs = {
      'data-indent-level': node.attrs.indentLevel,
    };
    return ['p', attrs, 0];
  },
};
