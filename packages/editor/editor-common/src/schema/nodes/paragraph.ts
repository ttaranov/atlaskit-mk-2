import { NodeSpec, Node } from 'prosemirror-model';
import { Inline } from './doc';

/**
 * @name paragraph_node
 */
export interface Definition {
  type: 'paragraph';
  content: Array<Inline>;
  attrs?: {
    /**
     * @minimum 0
     * @maximum 6
     */
    indentLevel?: number;
  };
}

export const paragraph: NodeSpec = {
  attrs: { indentLevel: { default: 0 } },
  content: `inline*`,
  group: 'block',
  defining: true,
  parseDOM: [
    {
      tag: 'p',
      getAttrs: (dom: HTMLElement) => ({
        indentLevel: parseInt(dom.getAttribute('data-indent-level') || '0', 10),
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
