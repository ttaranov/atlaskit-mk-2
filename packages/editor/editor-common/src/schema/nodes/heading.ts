import { NodeSpec, Node } from 'prosemirror-model';
import { Inline } from './doc';

/**
 * @name heading_node
 */
export interface Definition {
  type: 'heading';
  /**
   * @minItems 0
   */
  content: Array<Inline>;
  attrs: {
    /**
     * @minimum 1
     * @maximum 6
     */
    level: number;
    /**
     * @minimum 0
     * @maximum 6
     */
    indentLevel?: number;
  };
}

const getHeadingAttributes = (level: number) => (dom: HTMLElement) => ({
  level,
  indentLevel: parseInt(dom.getAttribute('data-indent-level') || '0', 10),
});

export const heading: NodeSpec = {
  attrs: { level: { default: 1 }, indentLevel: { default: 0 } },
  content: `inline*`,
  group: 'block',
  defining: true,
  parseDOM: [
    { tag: 'h1', getAttrs: getHeadingAttributes(1) },
    { tag: 'h2', getAttrs: getHeadingAttributes(2) },
    { tag: 'h3', getAttrs: getHeadingAttributes(3) },
    { tag: 'h4', getAttrs: getHeadingAttributes(4) },
    { tag: 'h5', getAttrs: getHeadingAttributes(5) },
    { tag: 'h6', getAttrs: getHeadingAttributes(6) },
  ],
  toDOM(node: Node) {
    const attrs = {
      'data-indent-level': node.attrs.indentLevel,
    };
    return ['h' + node.attrs['level'], attrs, 0];
  },
};
